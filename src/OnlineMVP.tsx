import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, Heart, MessageCircle, Send, RefreshCw,
  ShieldCheck, LogOut, Trash2, Flag, Sparkles, Pencil, Check,
  Users, Search, LockKeyhole, KeyRound, Eye, EyeOff, UserX, UserCheck, ClipboardCheck
} from 'lucide-react';
import { createClient, type Session } from '@supabase/supabase-js';
import './online.css';
import {ModerationPanel} from './ModerationPanel';

const endpoint = import.meta.env.VITE_SUPABASE_URL?.trim();
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
// Publishable key only. NEVER bundle service_role or secret API keys.
const api = endpoint && /^https:\/\/[a-z0-9.-]+$/i.test(endpoint) && publishableKey
  ? createClient(endpoint, publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' } })
  : null;

export const onlineConfigured = Boolean(api);

type Person = { id: string; handle: string; name: string; bio: string; created_at: string };
type Entry = { id: string; author_id: string; content: string; created_at: string };
type Like = { post_id: string; user_id: string };
type Comment = { id: string; post_id: string; author_id: string; content: string; created_at: string };
const errorText = (e: unknown) => e instanceof Error ? e.message : 'Ocorreu um erro. Tente novamente.';
const shortDate = (date: string) => new Date(date).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const avatar = (name: string) => (name.trim().charAt(0) || '?').toUpperCase();
const PAGE_SIZE = 20;
const recoveryMarker = () => new URLSearchParams(window.location.search).get('rj_recovery') === '1';
type AuthMode = 'login' | 'cadastro' | 'recuperar';

export function OnlineMVP() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mode, setMode] = useState<AuthMode>('login');
  const [isRecovery, setIsRecovery] = useState(recoveryMarker);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [mutedIds, setMutedIds] = useState<string[]>([]);
  const [mutedProfiles, setMutedProfiles] = useState<Person[]>([]);
  const [mutesReady, setMutesReady] = useState(false);
  const [mutesError, setMutesError] = useState('');
  const [isModerator,setIsModerator]=useState(false);
  const [moderationOpen,setModerationOpen]=useState(false);
  const [posts, setPosts] = useState<Entry[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [profileEditing, setProfileEditing] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editPostBody, setEditPostBody] = useState('');
  const [reportingId, setReportingId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<'spam' | 'abuso' | 'outro'>('spam');
  const [profileName, setProfileName] = useState('');
  const [profileHandle, setProfileHandle] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [draft, setDraft] = useState('');
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'recentes' | 'meus'>('recentes');
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedError, setFeedError] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const uid = session?.user.id;
  const me = people.find(p => p.id === uid);
  const byId = (id: string) => people.find(p => p.id === id);
  const ownPosts = useMemo(() => posts.filter(p => p.author_id === uid).length, [posts, uid]);
  const visiblePosts = useMemo(() => posts.filter(p =>
    !mutedIds.includes(p.author_id) &&
    (filter !== 'meus' || p.author_id === uid) &&
    (!search.trim() || (p.content + ' ' + (people.find(u => u.id === p.author_id)?.name || '')).toLocaleLowerCase('pt-BR').includes(search.trim().toLocaleLowerCase('pt-BR')))
  ), [posts, people, mutedIds, search, filter, uid]);

  useEffect(() => {
    if (!api) { setAuthLoading(false); return; }
    let mounted = true;
    api.auth.getSession().then(({data, error: authError}) => {
      if (!mounted) return;
      setSession(data.session);
      if (authError) setError(errorText(authError));
      setAuthLoading(false);
    }).catch(e => { if (mounted) { setError(errorText(e)); setAuthLoading(false); } });
    const {data: { subscription }} = api.auth.onAuthStateChange((_event, next) => {
      if (mounted) { setSession(next); setAuthLoading(false); }
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!api || !uid) {
      setPeople([]); setPosts([]); setLikes([]); setComments([]);
      setPage(0);setFeedError('');setHasMore(false);
      return;
    }
    const client = api;
    let mounted = true;
    async function fetchFeed() {
      setLoading(true);
      setFeedError('');
      try {
        const entries = await client.from('rj_posts')
          .select('id,author_id,content,created_at')
          .order('created_at', {ascending:false})
          .order('id', {ascending:false})
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
        if (entries.error) throw entries.error;
        const batch = (entries.data || []) as Entry[];
        const postIds = batch.map(p => p.id);
        const [l, c] = await Promise.all([
          postIds.length ? client.from('rj_likes').select('post_id,user_id').in('post_id',postIds).limit(3000) : Promise.resolve({data:[] as Like[],error:null}),
          postIds.length ? client.from('rj_comments').select('id,post_id,author_id,content,created_at').in('post_id',postIds).order('created_at',{ascending:true}).limit(3000) : Promise.resolve({data:[] as Comment[],error:null})
        ]);
        if (l.error || c.error) throw (l.error || c.error);
        const newLikes = (l.data || []) as Like[];
        const newComments = (c.data || []) as Comment[];
        const authorIds = [...new Set([uid,...batch.map(p=>p.author_id),...newComments.map(p=>p.author_id)])];
        const p = await client.from('rj_profiles').select('id,handle,name,bio,created_at').in('id',authorIds);
        if(p.error) throw p.error;
        const newPeople = (p.data || []) as Person[];
        if (mounted) {
          setPeople(old => page===0 ? newPeople : [...old,...newPeople.filter(p => !old.some(x => x.id===p.id))]);
          setPosts(old => page===0 ? batch : [...old,...batch.filter(p => !old.some(x=>x.id===p.id))]);
          setLikes(old => page===0 ? newLikes : [...old,...newLikes]);
          setComments(old => page===0 ? newComments : [...old,...newComments]);
          setHasMore(batch.length === PAGE_SIZE);
          setError('');
        }
      } catch (e) {
        if (mounted) {
          setFeedError('Não foi possível carregar as publicações. Tente novamente.');
          setError('Falha ao carregar a comunidade: ' + errorText(e));
        }
      } finally { if (mounted) setLoading(false); }
    }
    void fetchFeed();
    return () => { mounted = false; };
  }, [uid, page, version]);

  useEffect(()=>{
    if(!api || !uid){
      setMutedIds([]);setMutedProfiles([]);setMutesReady(false);setMutesError('');
      return;
    }
    let active=true;
    const client=api;
    async function loadMutes(){
      const {data,error:mutesFailure}=await client.from('rj_mutes')
        .select('muted_id').eq('owner_id',uid).limit(500);
      if(!active)return;
      if(mutesFailure){
        setMutesReady(false);
        setMutesError('Silenciar pessoas requer a atualização de segurança do banco.');
        return;
      }
      const ids=(data||[]).map(x=>x.muted_id as string);
      setMutedIds(ids);setMutesReady(true);setMutesError('');
      if(!ids.length){setMutedProfiles([]);return;}
      const {data:profiles,error:profilesFailure}=await client.from('rj_profiles')
        .select('id,handle,name,bio,created_at').in('id',ids);
      if(!active)return;
      if(!profilesFailure)setMutedProfiles((profiles||[]) as Person[]);
    }
    void loadMutes();
    return ()=>{active=false};
  },[uid,version]);

  useEffect(()=>{
    if(!api||!uid){setIsModerator(false);setModerationOpen(false);return;}
    const client=api;
    let active=true;
    async function checkModerator(){
      const result=await client.from('rj_moderators').select('user_id')
        .eq('user_id',uid).maybeSingle();
      if(active)setIsModerator(!result.error&&!!result.data);
    }
    void checkModerator();
    return ()=>{active=false};
  },[uid]);

  function refresh() { setPage(0);setHasMore(false);setVersion(v => v + 1); }
  async function task(key: string, fn: () => Promise<void>) {
    if (busy) return;
    setBusy(key); setError(''); setNotice('');
    try { await fn(); }
    catch (e) { setError(errorText(e)); }
    finally { setBusy(''); }
  }
  function goDemo() { window.location.hash = 'feed'; }

  async function authenticate(e: React.FormEvent) {
    e.preventDefault();
    if (!api) return;
    if (mode !== 'recuperar' && password.length < 8) { setError('Informe uma senha de pelo menos 8 caracteres.'); return; }
    const client = api;
    await task('auth', async () => {
      if (mode === 'recuperar') {
        const redirect = window.location.origin + import.meta.env.BASE_URL + '?rj_recovery=1#comunidade';
        const {error: resetError} = await client.auth.resetPasswordForEmail(email.trim().toLowerCase(), {redirectTo:redirect});
        if(resetError) throw resetError;
        setNotice('Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha.');
      } else if (mode === 'cadastro') {
        const redirect = window.location.origin + import.meta.env.BASE_URL + '#comunidade';
        const {data, error: authError} = await client.auth.signUp({
          email: email.trim().toLowerCase(), password, options: {emailRedirectTo: redirect}
        });
        if (authError) throw authError;
        setPassword('');
        setNotice(data.session ? 'Conta criada! Complete seu perfil.' : 'Verifique seu e-mail para confirmar o cadastro antes de entrar.');
      } else {
        const {error: authError} = await client.auth.signInWithPassword({email: email.trim(), password});
        if (authError) throw authError;
        setPassword('');
        setNotice('Bem-vindo à comunidade!');
      }
    });
  }

  async function changeRecoveredPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!api || password.length < 8) {
      setError('Escolha uma senha com pelo menos 8 caracteres.');
      return;
    }
    await task('password-reset', async () => {
      const {error: updateError} = await api.auth.updateUser({password});
      if(updateError) throw updateError;
      const url = new URL(window.location.href);
      url.searchParams.delete('rj_recovery');
      window.history.replaceState(null,'',url.pathname+url.search+url.hash);
      setIsRecovery(false);
      setPassword('');
      setNotice('Senha atualizada. Você já pode usar sua conta.');
    });
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!api || !uid) return;
    const client = api;
    const name = profileName.trim();
    const handle = profileHandle.trim().toLowerCase().replace(/^@/, '');
    if (name.length < 2 || name.length > 60 || !/^[a-z0-9_]{3,24}$/.test(handle) || profileBio.length > 240) {
      setError('Use nome de 2–60 caracteres, @usuario com 3–24 letras/números/_ e bio com até 240 caracteres.');
      return;
    }
    await task('profile', async () => {
      const record = {id: uid, name, handle, bio: profileBio.trim()};
      const {error: saveError} = me
        ? await client.from('rj_profiles').update({name, handle, bio: record.bio}).eq('id', uid)
        : await client.from('rj_profiles').insert(record);
      if (saveError) throw saveError;
      setProfileEditing(false);
      setNotice('Perfil atualizado.');
      refresh();
    });
  }
  function startProfile() {
    setProfileName(me?.name || '');
    setProfileHandle(me?.handle || '');
    setProfileBio(me?.bio || '');
    setProfileEditing(true);
  }
  async function publish(e: React.FormEvent) {
    e.preventDefault();
    if (!api || !uid || !me || !draft.trim() || draft.trim().length > 2000) return;
    const client = api;
    await task('post', async () => {
      const {error: saveError} = await client.from('rj_posts').insert({author_id: uid, content: draft.trim()});
      if (saveError) throw saveError;
      setDraft(''); setNotice('Publicação compartilhada com a comunidade.'); refresh();
    });
  }
  async function toggleLike(postId: string) {
    if (!api || !uid) return;
    const client = api;
    await task('like-' + postId, async () => {
      const liked = likes.some(l => l.post_id === postId && l.user_id === uid);
      const {error: saveError} = liked
        ? await client.from('rj_likes').delete().eq('post_id', postId).eq('user_id', uid)
        : await client.from('rj_likes').insert({post_id: postId, user_id: uid});
      if (saveError) throw saveError;
      refresh();
    });
  }
  async function addComment(e: React.FormEvent, postId: string) {
    e.preventDefault();
    const body = (commentDraft[postId] || '').trim();
    if (!api || !uid || !body || body.length > 500) return;
    const client = api;
    await task('comment-' + postId, async () => {
      const {error: saveError} = await client.from('rj_comments').insert({post_id: postId, author_id: uid, content: body});
      if (saveError) throw saveError;
      setCommentDraft(v => ({...v, [postId]: ''}));
      refresh();
    });
  }
  async function updatePost(e: React.FormEvent, postId: string) {
    e.preventDefault();
    if (!api || !uid) return;
    const content = editPostBody.trim();
    if (!content || content.length > 2000) {setError('A publicação deve ter entre 1 e 2.000 caracteres.');return;}
    const client=api;
    await task('edit-'+postId, async () => {
      const {error: updateError} = await client.from('rj_posts').update({content}).eq('id',postId).eq('author_id',uid);
      if(updateError) throw updateError;
      setEditingPostId(null);setNotice('Publicação atualizada.');refresh();
    });
  }
  async function deleteComment(commentId: string) {
    if(!api || !uid || !window.confirm('Excluir seu comentário?'))return;
    const client=api;
    await task('comment-delete-'+commentId,async ()=>{
      const {error: deleteError} = await client.from('rj_comments').delete().eq('id',commentId).eq('author_id',uid);
      if(deleteError)throw deleteError;
      setNotice('Comentário excluído.');refresh();
    });
  }
  async function deletePost(postId: string) {
    if (!api || !uid || !window.confirm('Excluir sua publicação permanentemente?')) return;
    const client = api;
    await task('delete-' + postId, async () => {
      const {error: saveError} = await client.from('rj_posts').delete().eq('id', postId).eq('author_id', uid);
      if (saveError) throw saveError;
      setNotice('Publicação excluída.'); refresh();
    });
  }
  async function toggleMute(personId:string){
    if(!api || !uid || !mutesReady || personId===uid)return;
    const client=api;
    const alreadyMuted=mutedIds.includes(personId);
    await task('mute-'+personId,async()=>{
      const response=alreadyMuted
        ? await client.from('rj_mutes').delete().eq('owner_id',uid).eq('muted_id',personId)
        : await client.from('rj_mutes').insert({owner_id:uid,muted_id:personId});
      if(response.error)throw response.error;
      if(alreadyMuted){
        setMutedIds(prev=>prev.filter(x=>x!==personId));
        setMutedProfiles(prev=>prev.filter(x=>x.id!==personId));
      }else{
        setMutedIds(prev=>[...prev,personId]);
        const person=people.find(x=>x.id===personId);
        if(person)setMutedProfiles(prev=>[...prev.filter(x=>x.id!==personId),person]);
      }
      setNotice(alreadyMuted?'Pessoa removida da lista de silenciados.':'Publicações desta pessoa serão ocultadas deste feed.');
    });
  }
  async function reportPost(e: React.FormEvent, postId: string) {
    e.preventDefault();
    if (!api || !uid) return;
    const client = api;
    await task('report-' + postId, async () => {
      const {error: saveError} = await client.from('rj_reports').insert({post_id: postId, reporter_id: uid, reason:reportReason});
      if (saveError) throw saveError;
      setReportingId(null);
      setNotice('Denúncia registrada. A equipe responsável precisará analisá-la.');
    });
  }

  return <div className="online-root">
    <a className="online-skip" href="#online-main">Pular para o conteúdo</a>
    <header className="online-top">
      <div className="online-top-inner">
        <a href="#feed" className="online-logo"><span className="online-logo-mark"><Sparkles size={20}/></span> Rede <strong>Jovem</strong><small>COMUNIDADE</small></a>
        <div className="online-top-actions">
          <span className="online-live"><span/> {api ? 'Comunidade online' : 'Conexão pendente'}</span>
          <button className="online-ghost" onClick={goDemo}><ArrowLeft size={17}/> <span>Ver demonstração</span></button>
          {session && <button className="online-ghost" onClick={() => {if (api) void task('logout', async () => {const {error: e} = await api.auth.signOut(); if (e) throw e;});}}><LogOut size={17}/> Sair</button>}
        </div>
      </div>
    </header>
    <main id="online-main" className="online-main">
      <div className="online-hero">
        <div className="online-hero-content">
          <span className="online-kicker"><Users size={16}/> CONECTE IDEIAS, CRIE LAÇOS</span>
          <h1>Uma comunidade para <em>crescer juntos.</em></h1>
          <p>Encontre pessoas, compartilhe conquistas e converse nos comentários. Respeito e boas ideias começam aqui.</p>
          <div className="online-hero-facts"><span><ShieldCheck size={17}/> Acesso por conta</span><span><Heart size={17}/> Publique e interaja</span></div>
        </div>
        <div className="online-hero-decoration" aria-hidden="true"><span>✦</span><span>♥</span><span>✧</span></div>
      </div>
      {!api ? <section className="online-panel online-setup" aria-label="Configuração da comunidade">
        <LockKeyhole size={30}/>
        <h2>Estamos preparando o espaço online</h2>
        <p>O feed demonstrativo continua disponível. Para ativar contas reais, é necessário criar um projeto Supabase separado, aplicar a migração de segurança e definir as variáveis públicas no workflow do GitHub Pages.</p>
        <p className="online-small">Nenhuma senha ou banco de outro projeto será usado automaticamente.</p>
        <a href="https://github.com/HelioConde/rede_social/blob/gh-pages/docs/MVP_ONLINE.md" target="_blank" rel="noopener noreferrer" className="online-primary">Como ativar o MVP</a>
      </section> : authLoading ? <div className="online-panel" role="status">Conectando à comunidade...</div>
      : isRecovery && session ? <section className="online-auth online-panel" aria-label="Redefinir senha">
        <div className="online-auth-intro"><span className="online-kicker"><KeyRound size={15}/> SEGURANÇA DA CONTA</span><h2>Crie sua nova senha</h2><p>Escolha uma senha de pelo menos oito caracteres.</p></div>
        <form onSubmit={changeRecoveredPassword} className="online-form">
          <label>Nova senha<input type={showPassword?'text':'password'} value={password} required minLength={8} autoComplete="new-password" onChange={e=>setPassword(e.target.value)}/></label>
          <button className="online-secondary-action" type="button" onClick={()=>setShowPassword(v=>!v)}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>} {showPassword?'Ocultar senha':'Mostrar senha'}</button>
          <button type="submit" className="online-primary" disabled={!!busy}>{busy==='password-reset'?'Atualizando...':'Salvar nova senha'}</button>
        </form>
      </section>
      : !session ? <section className="online-auth online-panel" aria-label="Acessar comunidade">
        <div className="online-auth-intro"><span className="online-kicker">SEU PRÓXIMO CAPÍTULO</span><h2>{mode==='login'?'Bem-vindo de volta!':mode==='cadastro'?'Sua história começa aqui.':'Recuperar acesso'}</h2><p>{mode==='login'?'Acesse as publicações e conversas da comunidade.':mode==='cadastro'?'Crie uma conta para publicar e participar.':'Informe seu e-mail para receber instruções de redefinição de senha.'}</p></div>
        <form onSubmit={authenticate} className="online-form">
          <label>E-mail<input type="email" value={email} required autoComplete="email" maxLength={254} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com"/></label>
          {mode!=='recuperar'&&<>
            <label>Senha<input type={showPassword?'text':'password'} value={password} required minLength={8} autoComplete={mode==='login'?'current-password':'new-password'} onChange={e=>setPassword(e.target.value)} placeholder="Pelo menos 8 caracteres"/></label>
            <button type="button" className="online-secondary-action" onClick={()=>setShowPassword(v=>!v)}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>} {showPassword?'Ocultar senha':'Mostrar senha'}</button>
          </>}
          <button className="online-primary" type="submit" disabled={!!busy}>{busy==='auth'?'Aguarde...':mode==='login'?'Entrar na comunidade':mode==='cadastro'?'Criar minha conta':'Enviar instruções'}</button>
        </form>
        <div className="online-auth-links">
          <button className="online-switch" type="button" onClick={()=>{setMode(mode==='login'?'cadastro':'login');setError('');setNotice('');}}>{mode==='login'?'Ainda não tem conta? Cadastre-se':'Já tem uma conta? Entrar'}</button>
          {mode==='login'&&<button className="online-switch" type="button" onClick={()=>{setMode('recuperar');setError('');setNotice('');}}>Esqueci minha senha</button>}
        </div>
        <p className="online-small">Ao participar, respeite as outras pessoas. Nunca compartilhe dados sensíveis ou informações de terceiros.</p>
      </section> : loading && !me && people.length === 0 ? <div className="online-panel" role="status">Carregando perfil e publicações...</div>
      : feedError && !me ? <section className="online-panel online-onboard" role="alert"><h2>Não conseguimos carregar seu perfil</h2><p>{feedError}</p><button className="online-primary" onClick={refresh}><RefreshCw size={16}/> Tentar novamente</button></section>
      : !me || profileEditing ? <section className="online-panel online-onboard">
        <span className="online-kicker">PERFIL DA COMUNIDADE</span><h2>{me ? 'Editar meu perfil' : 'Como podemos chamar você?'}</h2>
        <p>Escolha como você vai aparecer nas publicações. Seu nome de usuário é público.</p>
        <form className="online-form" onSubmit={saveProfile}>
          <label>Nome<input value={profileName} onChange={e => setProfileName(e.target.value)} minLength={2} maxLength={60} required autoComplete="nickname"/></label>
          <label>Usuário (sem @)<input value={profileHandle} onChange={e => setProfileHandle(e.target.value)} pattern="[a-z0-9_]{3,24}" maxLength={24} required placeholder="meu_usuario"/></label>
          <label>Sobre mim<textarea value={profileBio} onChange={e => setProfileBio(e.target.value)} maxLength={240} rows={3} placeholder="Interesses, projetos e ideias..."/></label>
          <div className="online-row"><button type="submit" className="online-primary" disabled={!!busy}><Check size={17}/> Salvar perfil</button>{me && <button className="online-ghost" type="button" onClick={() => setProfileEditing(false)}>Cancelar</button>}</div>
        </form>
      </section> : <div className="online-layout">
        <aside className="online-about">
          <div className="online-panel online-identity"><div className="online-avatar large">{avatar(me.name)}</div><h2>{me.name}</h2><span>@{me.handle}</span><p>{me.bio || 'Faça sua apresentação para a comunidade.'}</p><div className="online-stats"><strong>{ownPosts}</strong><span>Publicações</span></div><button className="online-ghost" onClick={startProfile}><Pencil size={16}/> Editar perfil</button></div>
          {isModerator&&<button className="online-ghost moderation-entry" type="button" aria-expanded={moderationOpen}
            onClick={()=>setModerationOpen(v=>!v)}><ClipboardCheck size={18}/> {moderationOpen?'Fechar fila de denúncias':'Revisar denúncias'}</button>}
          <div className="online-panel online-rules"><ShieldCheck size={22}/><h3>Um espaço de respeito</h3><p>Evite dados pessoais. Denuncie conteúdo ofensivo ou spam; a equipe precisará analisar as denúncias manualmente.</p><span className="online-small">MVP · Acesso autenticado · Sem mensagens privadas nesta fase</span></div>
          <div className="online-panel online-muted-list">
            <div className="online-muted-head"><UserX size={19}/><h3>Pessoas silenciadas</h3></div>
            {mutesError?<p className="online-small" role="status">{mutesError}</p>:mutedIds.length===0?<p className="online-small">{mutesReady?'Você não silenciou ninguém.':'Carregando preferências...'}</p>
              :<div className="online-muted-items">{mutedIds.map(id=>{
                const person=mutedProfiles.find(p=>p.id===id) || people.find(p=>p.id===id);
                return <div className="online-muted-item" key={id}><span>{person?.name || 'Pessoa silenciada'}</span><button className="online-ghost" type="button" aria-label={'Reexibir '+(person?.name||'pessoa')} disabled={!!busy} onClick={()=>void toggleMute(id)}><UserCheck size={15}/> Reexibir</button></div>;
              })}</div>}
            <p className="online-small">Silenciar apenas oculta publicações neste feed. Não impede contatos por outros meios e não substitui uma denúncia.</p>
          </div>
        </aside>
        <section className="online-feed" aria-label="Publicações da comunidade">
          {isModerator&&moderationOpen&&api&&uid&&<ModerationPanel client={api} userId={uid}
            onClose={()=>setModerationOpen(false)}/>}
          <form className="online-panel online-compose" onSubmit={publish}>
            <div className="online-compose-header"><div className="online-avatar">{avatar(me.name)}</div><div><strong>Compartilhe seu momento</strong><span>O que você tem de novo?</span></div></div>
            <textarea value={draft} onChange={e => setDraft(e.target.value)} maxLength={2000} rows={3} aria-label="Escrever publicação online" placeholder="Uma novidade, conquista ou ideia para compartilhar..."/>
            <div className="online-compose-foot"><small>{draft.length}/2000 caracteres</small><button className="online-primary" type="submit" disabled={!!busy || !draft.trim()}><Send size={17}/> Publicar</button></div>
          </form>
          <div className="online-feed-bar"><div><h2>Conversa da comunidade</h2><p>Publicações visíveis para participantes conectados{mutedIds.length?' · pessoas silenciadas ocultadas':''}</p></div><button onClick={refresh} className="online-ghost" aria-label="Atualizar publicações" disabled={loading}><RefreshCw size={18}/></button></div>
          {feedError&&<div className="online-feed-error" role="alert"><span>{feedError}</span><button className="online-ghost" onClick={refresh}>Tentar novamente</button></div>}
          <div className="online-filter"><label className="online-search"><Search size={17}/><input aria-label="Buscar publicações online" placeholder="Buscar publicações carregadas..." value={search} onChange={e => setSearch(e.target.value)}/></label><button aria-pressed={filter === 'recentes'} onClick={() => setFilter('recentes')} className={filter === 'recentes' ? 'active' : ''}>Recentes</button><button aria-pressed={filter === 'meus'} onClick={() => setFilter('meus')} className={filter === 'meus' ? 'active' : ''}>Minhas</button></div>
          {visiblePosts.length ? visiblePosts.map(post => {
            const owner = byId(post.author_id);
            const related = comments.filter(c => c.post_id === post.id && !mutedIds.includes(c.author_id));
            const count = likes.filter(l => l.post_id === post.id).length;
            const liked = likes.some(l => l.post_id === post.id && l.user_id === uid);
            return <article className="online-panel online-post" data-testid="online-post" key={post.id}>
              <div className="online-post-top"><div className="online-avatar">{avatar(owner?.name || '?')}</div><div className="online-post-person"><strong>{owner?.name || 'Participante'}</strong><span>@{owner?.handle || 'usuario'} · <time dateTime={post.created_at}>{shortDate(post.created_at)}</time></span></div>
              {post.author_id===uid ? <div className="online-post-tools">
                <button className="online-icon" aria-label="Editar minha publicação" title="Editar publicação" onClick={()=>{setEditingPostId(post.id);setEditPostBody(post.content)}} disabled={!!busy}><Pencil size={17}/></button>
                <button className="online-icon danger" aria-label="Excluir minha publicação" title="Excluir publicação" onClick={()=>void deletePost(post.id)} disabled={!!busy}><Trash2 size={17}/></button>
              </div> : <div className="online-post-tools">
                  {mutesReady&&<button className="online-icon" aria-label={'Silenciar '+(owner?.name||'pessoa')} title="Ocultar publicações desta pessoa" onClick={()=>void toggleMute(post.author_id)} disabled={!!busy}><UserX size={17}/></button>}
                  <button className="online-icon" aria-label="Denunciar publicação" title="Denunciar publicação" onClick={()=>{setReportingId(reportingId===post.id?null:post.id);setReportReason('spam')}} disabled={!!busy}><Flag size={17}/></button>
                </div>}
              </div>
              {editingPostId===post.id ? <form className="online-edit-post" onSubmit={e=>void updatePost(e,post.id)}>
                <label htmlFor={'edit-post-'+post.id}>Editar publicação</label>
                <textarea id={'edit-post-'+post.id} maxLength={2000} required value={editPostBody} onChange={e=>setEditPostBody(e.target.value)} rows={3}/>
                <div className="online-row"><button className="online-primary" type="submit" disabled={!!busy||!editPostBody.trim()}><Check size={16}/> Salvar alterações</button><button type="button" className="online-ghost" onClick={()=>setEditingPostId(null)}>Cancelar</button></div>
              </form> : <p className="online-post-body">{post.content}</p>}
              {reportingId===post.id&&<form className="online-report-form" onSubmit={e=>void reportPost(e,post.id)}>
                <label htmlFor={'report-'+post.id}>Motivo da denúncia</label>
                <select id={'report-'+post.id} value={reportReason} onChange={e=>setReportReason(e.target.value as 'spam'|'abuso'|'outro')}>
                  <option value="spam">Spam</option><option value="abuso">Abuso ou assédio</option><option value="outro">Outro motivo</option>
                </select>
                <div className="online-row"><button type="submit" className="online-primary" disabled={!!busy}><Flag size={16}/> Enviar denúncia</button><button type="button" className="online-ghost" onClick={()=>setReportingId(null)}>Cancelar</button></div>
              </form>}
              <div className="online-post-actions"><button aria-pressed={liked} className={liked ? 'liked' : ''} onClick={() => void toggleLike(post.id)} disabled={!!busy}><Heart size={19} fill={liked ? 'currentColor' : 'none'}/> {count} curtidas</button><span><MessageCircle size={19}/> {related.length} comentários</span></div>
              {related.length > 0 && <div className="online-comments">{related.map(c => <div key={c.id} className="online-comment"><div className="online-avatar small">{avatar(byId(c.author_id)?.name || '?')}</div><div className="online-comment-content"><strong>{byId(c.author_id)?.name || 'Participante'}</strong><p>{c.content}</p></div>
                  {c.author_id===uid&&<button className="online-icon danger online-comment-delete" aria-label="Excluir meu comentário" title="Excluir meu comentário" disabled={!!busy} onClick={()=>void deleteComment(c.id)}><Trash2 size={15}/></button>}
                </div>)}</div>}
              <form onSubmit={e => void addComment(e, post.id)} className="online-comment-form"><input aria-label="Comentário na publicação online" maxLength={500} placeholder="Escreva um comentário..." value={commentDraft[post.id] || ''} onChange={e => setCommentDraft(v => ({...v, [post.id]: e.target.value}))}/><button type="submit" disabled={!!busy || !commentDraft[post.id]?.trim()} aria-label="Enviar comentário online"><Send size={18}/></button></form>
            </article>;
          }) : <div className="online-panel online-empty"><MessageCircle size={27}/><h3>{search?'Nenhum resultado entre as publicações carregadas':'Nenhuma publicação por aqui ainda'}</h3><p>{search?'Tente outra busca ou carregue outras publicações.':'Que tal começar uma boa conversa?'}</p></div>}
          {mutedIds.length>0&&<p className="online-muted-footnote"><UserX size={15}/> Você ocultou publicações de {mutedIds.length} {mutedIds.length===1?'pessoa':'pessoas'}.</p>}
          <div className="online-pagination">
            <span>{posts.length} publicações carregadas</span>
            {loading && <span role="status">Carregando publicações...</span>}
            {hasMore && <button type="button" className="online-ghost" onClick={()=>setPage(p=>p+1)} disabled={loading||!!busy}>Carregar mais publicações</button>}
          </div>
        </section>
      </div>}
      {notice && <div className="online-feedback" role="status"><Check size={17}/>{notice}<button aria-label="Fechar aviso" onClick={() => setNotice('')}>×</button></div>}
      {error && <div className="online-feedback error" role="alert">{error}<button aria-label="Fechar erro" onClick={() => setError('')}>×</button></div>}
    </main>
    <footer className="online-footer">Rede Jovem © 2026 · Uma comunidade em construção. <a href="#feed">Explorar demonstração</a></footer>
  </div>;
}
