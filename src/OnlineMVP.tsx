import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, Heart, MessageCircle, Send, RefreshCw,
  ShieldCheck, LogOut, Trash2, Flag, Sparkles, Pencil, Check,
  Users, Search, LockKeyhole
} from 'lucide-react';
import { createClient, type Session } from '@supabase/supabase-js';
import './online.css';

const endpoint = import.meta.env.VITE_SUPABASE_URL?.trim();
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
// Publishable key only. NEVER bundle service_role or secret API keys.
const api = endpoint && /^https:\/\/[a-z0-9.-]+$/i.test(endpoint) && publishableKey
  ? createClient(endpoint, publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null;

export const onlineConfigured = Boolean(api);

type Person = { id: string; handle: string; name: string; bio: string; created_at: string };
type Entry = { id: string; author_id: string; content: string; created_at: string };
type Like = { post_id: string; user_id: string };
type Comment = { id: string; post_id: string; author_id: string; content: string; created_at: string };
const errorText = (e: unknown) => e instanceof Error ? e.message : 'Ocorreu um erro. Tente novamente.';
const shortDate = (date: string) => new Date(date).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const avatar = (name: string) => (name.trim().charAt(0) || '?').toUpperCase();

export function OnlineMVP() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mode, setMode] = useState<'login' | 'cadastro'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [posts, setPosts] = useState<Entry[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [profileEditing, setProfileEditing] = useState(false);
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
  const uid = session?.user.id;
  const me = people.find(p => p.id === uid);
  const byId = (id: string) => people.find(p => p.id === id);
  const ownPosts = useMemo(() => posts.filter(p => p.author_id === uid).length, [posts, uid]);
  const visiblePosts = useMemo(() => posts.filter(p =>
    (filter !== 'meus' || p.author_id === uid) &&
    (!search.trim() || (p.content + ' ' + (people.find(u => u.id === p.author_id)?.name || '')).toLocaleLowerCase('pt-BR').includes(search.trim().toLocaleLowerCase('pt-BR')))
  ), [posts, people, search, filter, uid]);

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
      return;
    }
    const client = api;
    let mounted = true;
    async function fetchFeed() {
      setLoading(true);
      try {
        const [p, entries, l, c] = await Promise.all([
          client.from('rj_profiles').select('id,handle,name,bio,created_at').limit(300),
          client.from('rj_posts').select('id,author_id,content,created_at').order('created_at', {ascending: false}).limit(100),
          client.from('rj_likes').select('post_id,user_id').limit(3000),
          client.from('rj_comments').select('id,post_id,author_id,content,created_at').order('created_at', {ascending: true}).limit(3000)
        ]);
        const failure = p.error || entries.error || l.error || c.error;
        if (failure) throw failure;
        if (mounted) {
          setPeople((p.data || []) as Person[]);
          setPosts((entries.data || []) as Entry[]);
          setLikes((l.data || []) as Like[]);
          setComments((c.data || []) as Comment[]);
          setError('');
        }
      } catch (e) {
        if (mounted) setError('Falha ao carregar a comunidade: ' + errorText(e));
      } finally { if (mounted) setLoading(false); }
    }
    void fetchFeed();
    return () => { mounted = false; };
  }, [uid, version]);

  function refresh() { setVersion(v => v + 1); }
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
    if (!api || password.length < 8) { setError('Informe uma senha de pelo menos 8 caracteres.'); return; }
    const client = api;
    await task('auth', async () => {
      if (mode === 'cadastro') {
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
  async function deletePost(postId: string) {
    if (!api || !uid || !window.confirm('Excluir sua publicação permanentemente?')) return;
    const client = api;
    await task('delete-' + postId, async () => {
      const {error: saveError} = await client.from('rj_posts').delete().eq('id', postId).eq('author_id', uid);
      if (saveError) throw saveError;
      setNotice('Publicação excluída.'); refresh();
    });
  }
  async function reportPost(postId: string) {
    if (!api || !uid) return;
    const reason = window.prompt('Motivo da denúncia: spam, abuso ou outro', 'spam')?.trim().toLowerCase();
    if (!reason) return;
    if (!['spam','abuso','outro'].includes(reason)) { setError('Escolha spam, abuso ou outro.'); return; }
    const client = api;
    await task('report-' + postId, async () => {
      const {error: saveError} = await client.from('rj_reports').insert({post_id: postId, reporter_id: uid, reason});
      if (saveError) throw saveError;
      setNotice('Denúncia registrada para análise pela administração.');
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
          <div className="online-hero-facts"><span><ShieldCheck size={17}/> Contas protegidas</span><span><Heart size={17}/> Conexões reais</span></div>
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
      : !session ? <section className="online-auth online-panel" aria-label="Acessar comunidade">
        <div className="online-auth-intro"><span className="online-kicker">SEU PRÓXIMO CAPÍTULO</span><h2>{mode === 'login' ? 'Que bom ter você de volta!' : 'Sua história começa aqui.'}</h2><p>{mode === 'login' ? 'Entre para acompanhar as publicações de outras pessoas.' : 'Crie uma conta para publicar e participar.'}</p></div>
        <form onSubmit={authenticate} className="online-form">
          <label>E-mail<input type="email" value={email} required autoComplete="email" maxLength={254} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com"/></label>
          <label>Senha<input type="password" value={password} required minLength={8} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} onChange={e => setPassword(e.target.value)} placeholder="Pelo menos 8 caracteres"/></label>
          <button className="online-primary" type="submit" disabled={!!busy}>{busy === 'auth' ? 'Aguarde...' : mode === 'login' ? 'Entrar na comunidade' : 'Criar minha conta'}</button>
        </form>
        <button className="online-switch" type="button" onClick={() => {setMode(mode === 'login' ? 'cadastro' : 'login'); setError(''); setNotice('');}}>{mode === 'login' ? 'Ainda não tem conta? Cadastre-se' : 'Já tem uma conta? Entrar'}</button>
        <p className="online-small">Ao participar, respeite as outras pessoas. Nunca compartilhe dados sensíveis ou informações de terceiros.</p>
      </section> : loading && !me && people.length === 0 ? <div className="online-panel" role="status">Carregando perfil e publicações...</div>
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
          <div className="online-panel online-rules"><ShieldCheck size={22}/><h3>Um espaço de respeito</h3><p>Não publique informações privadas. Denuncie conteúdos ofensivos ou spam. Denúncias são analisadas manualmente.</p><span className="online-small">MVP · Acesso autenticado · Sem mensagens privadas nesta fase</span></div>
        </aside>
        <section className="online-feed" aria-label="Publicações da comunidade">
          <form className="online-panel online-compose" onSubmit={publish}>
            <div className="online-compose-header"><div className="online-avatar">{avatar(me.name)}</div><div><strong>Compartilhe seu momento</strong><span>O que você tem de novo?</span></div></div>
            <textarea value={draft} onChange={e => setDraft(e.target.value)} maxLength={2000} rows={3} aria-label="Escrever publicação online" placeholder="Uma novidade, conquista ou ideia para compartilhar..."/>
            <div className="online-compose-foot"><small>{draft.length}/2000 caracteres</small><button className="online-primary" type="submit" disabled={!!busy || !draft.trim()}><Send size={17}/> Publicar</button></div>
          </form>
          <div className="online-feed-bar"><div><h2>Conversa da comunidade</h2><p>Publicações visíveis para participantes conectados</p></div><button onClick={refresh} className="online-ghost" aria-label="Atualizar publicações" disabled={loading}><RefreshCw size={18}/></button></div>
          <div className="online-filter"><label className="online-search"><Search size={17}/><input aria-label="Buscar publicações online" placeholder="Buscar publicações..." value={search} onChange={e => setSearch(e.target.value)}/></label><button aria-pressed={filter === 'recentes'} onClick={() => setFilter('recentes')} className={filter === 'recentes' ? 'active' : ''}>Recentes</button><button aria-pressed={filter === 'meus'} onClick={() => setFilter('meus')} className={filter === 'meus' ? 'active' : ''}>Minhas</button></div>
          {visiblePosts.length ? visiblePosts.map(post => {
            const owner = byId(post.author_id);
            const related = comments.filter(c => c.post_id === post.id);
            const count = likes.filter(l => l.post_id === post.id).length;
            const liked = likes.some(l => l.post_id === post.id && l.user_id === uid);
            return <article className="online-panel online-post" data-testid="online-post" key={post.id}>
              <div className="online-post-top"><div className="online-avatar">{avatar(owner?.name || '?')}</div><div className="online-post-person"><strong>{owner?.name || 'Participante'}</strong><span>@{owner?.handle || 'usuario'} · <time dateTime={post.created_at}>{shortDate(post.created_at)}</time></span></div>
              {post.author_id === uid ? <button className="online-icon danger" aria-label="Excluir minha publicação" title="Excluir publicação" onClick={() => void deletePost(post.id)} disabled={!!busy}><Trash2 size={17}/></button> : <button className="online-icon" aria-label="Denunciar publicação" title="Denunciar publicação" onClick={() => void reportPost(post.id)} disabled={!!busy}><Flag size={17}/></button>}
              </div>
              <p className="online-post-body">{post.content}</p>
              <div className="online-post-actions"><button aria-pressed={liked} className={liked ? 'liked' : ''} onClick={() => void toggleLike(post.id)} disabled={!!busy}><Heart size={19} fill={liked ? 'currentColor' : 'none'}/> {count} curtidas</button><span><MessageCircle size={19}/> {related.length} comentários</span></div>
              {related.length > 0 && <div className="online-comments">{related.map(c => <div key={c.id} className="online-comment"><div className="online-avatar small">{avatar(byId(c.author_id)?.name || '?')}</div><div><strong>{byId(c.author_id)?.name || 'Participante'}</strong><p>{c.content}</p></div></div>)}</div>}
              <form onSubmit={e => void addComment(e, post.id)} className="online-comment-form"><input aria-label="Comentário na publicação online" maxLength={500} placeholder="Escreva um comentário..." value={commentDraft[post.id] || ''} onChange={e => setCommentDraft(v => ({...v, [post.id]: e.target.value}))}/><button type="submit" disabled={!!busy || !commentDraft[post.id]?.trim()} aria-label="Enviar comentário online"><Send size={18}/></button></form>
            </article>;
          }) : <div className="online-panel online-empty"><MessageCircle size={27}/><h3>Nenhuma publicação por aqui ainda</h3><p>Que tal começar uma boa conversa?</p></div>}
        </section>
      </div>}
      {notice && <div className="online-feedback" role="status"><Check size={17}/>{notice}<button aria-label="Fechar aviso" onClick={() => setNotice('')}>×</button></div>}
      {error && <div className="online-feedback error" role="alert">{error}<button aria-label="Fechar erro" onClick={() => setError('')}>×</button></div>}
    </main>
    <footer className="online-footer">Rede Jovem © 2026 · Uma comunidade em construção. <a href="#feed">Explorar demonstração</a></footer>
  </div>;
}
