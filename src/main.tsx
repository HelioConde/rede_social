import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Home, Users, MessageCircle, Search, Compass, Settings, Bell, Moon, Sun, Menu, X,
  Heart, Send, ImagePlus, MessageSquare, Trash2, Pencil, Check, UserRound,
  Download, Upload, RotateCcw, ChevronDown, Camera, ShieldCheck, Sparkles,
  CheckCircle2, UserPlus, MapPin, Share2, BookOpen, Palette
} from 'lucide-react';
import type { SocialData, Profile, Post, Section, FriendStatus } from './types';
import { starterData } from './data';
import { downloadBackup, imageToDataUrl, isValidState, loadState, newId, saveState } from './storage';
import './styles.css';
import { OnlineMVP, onlineConfigured } from './OnlineMVP';
import { FaithHub } from './FaithHub';
import { faithPalettes, type FaithPalette } from './faith-content';
import './refresh.css';
import './personalization.css';

const BASE=import.meta.env.BASE_URL;
type AccentId='indigo'|'oceano'|'floresta'|'aurora';
const ACCENTS:{id:AccentId;name:string;description:string;first:string;second:string}[]=[
  {id:'indigo',name:'Índigo',description:'Azul e grafite',first:'#3555ba',second:'#48a8b8'},
  {id:'oceano',name:'Oceano',description:'Azul e turquesa',first:'#087b9d',second:'#39c7b5'},
  {id:'floresta',name:'Floresta',description:'Verde e esmeralda',first:'#206b5d',second:'#8cbf71'},
  {id:'aurora',name:'Aurora',description:'Violeta e coral',first:'#7751c5',second:'#ea8b95'}
];
const NAV: {id:Section;label:string;icon:typeof Home}[]=[
  {id:'feed',label:'Início',icon:Home},
  {id:'faith',label:'Espaço Fé',icon:BookOpen},
  {id:'explore',label:'Explorar',icon:Compass},
  {id:'friends',label:'Amigos',icon:Users},
  {id:'messages',label:'Mensagens',icon:MessageCircle},
  {id:'profile',label:'Meu perfil',icon:UserRound},
  {id:'settings',label:'Configurações',icon:Settings}
];
const sections= NAV.map(x=>x.id);
function getSection():Section {
  const hash=location.hash.replace('#','');
  return sections.includes(hash as Section)?hash as Section:'feed';
}
function formatDate(time:number) {
  const diff=Date.now()-time;
  if(diff<60_000)return 'Agora';
  if(diff<3_600_000)return Math.floor(diff/60_000)+' min';
  if(diff<86_400_000)return Math.floor(diff/3_600_000)+' h';
  return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short'}).format(time);
}
function initials(name:string){return name.split(/\s+/).filter(Boolean).slice(0,2).map(p=>p[0]?.toUpperCase()||'').join('')||'?'}
function Avatar({profile,size='md'}:{profile?:Profile;size?:'sm'|'md'|'lg'|'xl'}) {
  return <span className={'avatar avatar-'+size} style={{'--avatar-color':profile?.color||'#5874e9'} as React.CSSProperties}>
    {profile?.avatar?<img src={profile.avatar} alt={''}/>:<span aria-hidden="true">{initials(profile?.name||'?')}</span>}
  </span>;
}
function Logo(){return <span className="brand"><span className="brand-symbol"><img src={BASE+'assets/brand-logo.png'} alt="" onError={e=>(e.currentTarget.style.display='none')}/><Sparkles size={17}/></span><span>Rede <strong>Jovem</strong></span></span>}
function Pill({children}:{children:React.ReactNode}){return <span className="pill">{children}</span>}
function App(){
  const [data,setData]=useState<SocialData>(starterData);
  const [ready,setReady]=useState(false);
  const [section,setSection]=useState<Section>(getSection);
  const [search,setSearch]=useState('');
  const [mobileSearch,setMobileSearch]=useState(false);
  const [theme,setTheme]=useState(()=>{try{return localStorage.getItem('rede-jovem-theme-v3')==='dark'?'dark':'light'}catch{return 'light'}});
  const [accent,setAccent]=useState<AccentId>(()=>{
    try{const saved=localStorage.getItem('rede-jovem-accent-v1');return ACCENTS.some(a=>a.id===saved)?saved as AccentId:'indigo'}
    catch{return 'indigo'}
  });
  const [palette,setPalette]=useState<FaithPalette>(()=>{try{const v=localStorage.getItem('rede-jovem-palette');return faithPalettes.some(p=>p.id===v)?v as FaithPalette:'sereno'}catch{return 'sereno'}});
  const [sidebar,setSidebar]=useState(false);
  const [notify,setNotify]=useState(false);
  const [toast,setToast]=useState('');
  const [postBody,setPostBody]=useState('');
  const [postImage,setPostImage]=useState('');
  const [postUploading,setPostUploading]=useState(false);
  const [commentDrafts,setCommentDrafts]=useState<Record<string,string>>({});
  const [editPost,setEditPost]=useState<string|null>(null);
  const [editPostBody,setEditPostBody]=useState('');
  const [profileEditing,setProfileEditing]=useState(false);
  const [profileForm,setProfileForm]=useState({name:'',handle:'',bio:'',city:''});
  const [chatIds,setChatIds]=useState<string[]>([]);
  const [chatDrafts,setChatDrafts]=useState<Record<string,string>>({});
  const [selectedProfile,setSelectedProfile]=useState<string>('me');
  const [savingError,setSavingError]=useState(false);
  const [filter,setFilter]=useState<'all'|'friends'>('all');
  const uploadInput=useRef<HTMLInputElement>(null);
  const backupInput=useRef<HTMLInputElement>(null);
  const me=data.profiles.find(p=>p.id===data.activeId)||data.profiles[0];
  const findUser=(id:string)=>data.profiles.find(p=>p.id===id);
  const friends=data.friendships.filter(f=>f.status==='friends').map(f=>findUser(f.userId)).filter((x):x is Profile=>!!x);
  const incoming=data.friendships.filter(f=>f.status==='pending').length;
  const query=search.trim().toLocaleLowerCase('pt-BR');
  const visiblePosts=useMemo(()=>data.posts.filter(p=>{
    const author=data.profiles.find(u=>u.id===p.authorId);
    return (filter==='all'||p.authorId===me.id||friends.some(f=>f.id===p.authorId)) &&
      (!query||p.body.toLocaleLowerCase('pt-BR').includes(query)||(author?.name.toLocaleLowerCase('pt-BR').includes(query)??false));
  }).sort((a,b)=>b.createdAt-a.createdAt),[data.posts,data.profiles,filter,query,me.id,data.friendships]);
  useEffect(()=>{
    let live=true;
    loadState().then(d=>{if(live){setData(d);setSelectedProfile(d.activeId);setReady(true)}});
    return ()=>{live=false};
  },[]);
  useEffect(()=>{if(!ready)return;saveState(data).then(()=>setSavingError(false)).catch(e=>{console.warn(e);setSavingError(true)})},[data,ready]);
  useEffect(()=>{document.documentElement.dataset.theme=theme;try{localStorage.setItem('rede-jovem-theme-v3',theme)}catch{}},[theme]);
  useEffect(()=>{document.documentElement.dataset.accent=accent;try{localStorage.setItem('rede-jovem-accent-v1',accent)}catch{}},[accent]);
  useEffect(()=>{document.documentElement.dataset.palette=palette;try{localStorage.setItem('rede-jovem-palette',palette)}catch{}},[palette]);
  useEffect(()=>{
    const onHash=()=>{setSection(getSection());setSidebar(false);window.scrollTo({top:0})};
    addEventListener('hashchange',onHash);return ()=>removeEventListener('hashchange',onHash);
  },[]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),3500);return ()=>clearTimeout(t)},[toast]);
  function go(to:Section){location.hash=to;setSection(to);setSidebar(false);window.scrollTo({top:0})}
  function update(fn:(prev:SocialData)=>SocialData){setData(fn)}
  function feedback(message:string){setToast(message)}
  function post(){
    const body=postBody.trim();
    if(!body&&!postImage){feedback('Escreva algo ou escolha uma imagem.');return}
    if(body.length>2000){feedback('A publicação deve ter no máximo 2.000 caracteres.');return}
    update(prev=>({...prev,posts:[{id:newId(),authorId:prev.activeId,body,image:postImage||undefined,createdAt:Date.now(),likedBy:[],comments:[]},...prev.posts]}));
    setPostBody('');setPostImage('');if(uploadInput.current)uploadInput.current.value='';
    feedback('Publicação adicionada ao seu navegador.');
  }
  async function picture(file?:File){
    if(!file)return;
    setPostUploading(true);
    try{setPostImage(await imageToDataUrl(file));feedback('Imagem preparada.')}catch(e){feedback(e instanceof Error?e.message:'Falha ao abrir imagem.')}
    finally{setPostUploading(false)}
  }
  function shareFaith(body:string){
    update(prev=>({...prev,posts:[{id:newId(),authorId:prev.activeId,body,createdAt:Date.now(),likedBy:[],comments:[]},...prev.posts]}));
    feedback('Reflexão compartilhada no seu feed local.');go('feed');
  }
  function toggleFaithFavorite(id:string){
    update(prev=>{const items=prev.faithFavorites||[];return {...prev,faithFavorites:items.includes(id)?items.filter(x=>x!==id):[...items,id]}});
  }
  function toggleReading(planId:string,entryId:string){
    update(prev=>{
      const all=prev.readingProgress||{};
      const current=all[planId]||[];
      const next=current.includes(entryId)?current.filter(v=>v!==entryId):[...current,entryId];
      return {...prev,readingProgress:{...all,[planId]:next}};
    });
  }
  function addGratitude(body:string){
    update(prev=>({...prev,gratitudeNotes:[...(prev.gratitudeNotes||[]),{id:newId(),body,createdAt:Date.now()}].slice(-100)}));
  }
  function deleteGratitude(id:string){
    update(prev=>({...prev,gratitudeNotes:(prev.gratitudeNotes||[]).filter(n=>n.id!==id)}));
  }
  function toggleLike(id:string){
    update(prev=>({...prev,posts:prev.posts.map(p=>p.id!==id?p:{...p,likedBy:p.likedBy.includes(prev.activeId)?p.likedBy.filter(x=>x!==prev.activeId):[...p.likedBy,prev.activeId]})}));
  }
  function comment(id:string){
    const body=(commentDrafts[id]||'').trim();
    if(!body)return;
    if(body.length>500){feedback('O comentário deve ter até 500 caracteres.');return}
    update(prev=>({...prev,posts:prev.posts.map(p=>p.id===id?{...p,comments:[...p.comments,{id:newId(),authorId:prev.activeId,body,createdAt:Date.now()}]}:p)}));
    setCommentDrafts(prev=>({...prev,[id]:''}));
    feedback('Comentário publicado localmente.');
  }
  function removePost(id:string){if(!confirm('Excluir esta publicação do navegador?'))return;update(prev=>({...prev,posts:prev.posts.filter(p=>p.id!==id)}));feedback('Publicação excluída.')}
  function savePost(id:string){
    const body=editPostBody.trim();if(!body||body.length>2000){feedback('Informe um texto de até 2.000 caracteres.');return}
    update(prev=>({...prev,posts:prev.posts.map(p=>p.id===id?{...p,body}:p)}));setEditPost(null);feedback('Publicação atualizada.');
  }
  function setFriend(id:string,status:FriendStatus['status']){
    update(prev=>({...prev,friendships:prev.friendships.map(f=>f.userId===id?{...f,status}:f)}));
    feedback(status==='friends'?'Amizade adicionada à demonstração.':status==='sent'?'Solicitação demonstrativa enviada.':'Lista atualizada.');
  }
  function openChat(id:string){
    if(id===me.id)return;
    setChatIds(ids=>[...ids.filter(x=>x!==id),id].slice(-2));setNotify(false);
  }
  function sendChat(id:string){
    const body=(chatDrafts[id]||'').trim();
    if(!body||body.length>1000)return;
    update(prev=>({...prev,messages:[...prev.messages,{id:newId(),from:prev.activeId,to:id,body,createdAt:Date.now()}]}));
    setChatDrafts(p=>({...p,[id]:''}));
  }
  function startEditProfile(){
    setProfileForm({name:me.name,handle:me.handle,bio:me.bio,city:me.city});setProfileEditing(true);go('profile');
  }
  function saveProfile(){
    const name=profileForm.name.trim(), handle=profileForm.handle.trim().replace(/^@/,'').replace(/\s/g,'');
    if(name.length<2||name.length>60||!handle||handle.length>24||profileForm.bio.length>300){feedback('Revise nome, usuário (até 24) e biografia (até 300).');return}
    update(prev=>({...prev,profiles:prev.profiles.map(p=>p.id===prev.activeId?{...p,name,handle,bio:profileForm.bio.trim(),city:profileForm.city.trim()}:p)}));
    setProfileEditing(false);feedback('Perfil atualizado.');
  }
  async function changeAvatar(file?:File){
    if(!file)return;
    try{const avatar=await imageToDataUrl(file);update(prev=>({...prev,profiles:prev.profiles.map(p=>p.id===prev.activeId?{...p,avatar}:p)}));feedback('Foto atualizada.')}
    catch(e){feedback(e instanceof Error?e.message:'Erro ao selecionar foto')}
  }
  async function importBackup(file?:File){
    if(!file)return;
    if(file.size>15*1024*1024){feedback('O backup deve ter no máximo 15 MB.');return}
    try{
      const json:unknown=JSON.parse(await file.text());
      if(!isValidState(json)){feedback('Arquivo inválido ou versão não compatível.');return}
      if(!confirm('Substituir os dados locais pelo backup selecionado?'))return;
      update(()=>json);setSelectedProfile(json.activeId);setChatIds([]);feedback('Backup importado com sucesso.');
    }catch{feedback('Não foi possível ler o arquivo JSON.')}
    if(backupInput.current)backupInput.current.value='';
  }
  function reset(){if(confirm('Apagar seus dados locais e restaurar a demonstração?')){const fresh=starterData();setData(fresh);setSelectedProfile(fresh.activeId);setChatIds([]);feedback('Demonstração restaurada.');go('feed')}}
  function switchProfile(id:string){update(prev=>({...prev,activeId:id}));setSelectedProfile(id);setChatIds([]);feedback('Perfil demonstrativo alterado.')}
  function copyPost(post:Post){const text=post.body+'\n— Rede Jovem (demonstração local)';if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(()=>feedback('Texto copiado.')).catch(()=>feedback('Não foi possível copiar.'));else feedback('Área de transferência indisponível.')}
  function PostCard({post}:{post:Post}){
    const author=findUser(post.authorId);
    const mine=post.authorId===me.id;
    const liked=post.likedBy.includes(me.id);
    return <article className="card post-card" data-testid="post-card">
      <div className="post-head">
        <Avatar profile={author}/>
        <div className="post-author"><strong>{author?.name||'Usuário'}</strong><span>@{author?.handle||'perfil'} · <time dateTime={new Date(post.createdAt).toISOString()}>{formatDate(post.createdAt)}</time></span></div>
        {mine&&<div className="post-manage"><button className="icon-btn" title="Editar publicação" aria-label="Editar publicação" onClick={()=>{setEditPost(post.id);setEditPostBody(post.body)}}><Pencil size={16}/></button><button className="icon-btn danger" title="Excluir publicação" aria-label="Excluir publicação" onClick={()=>removePost(post.id)}><Trash2 size={16}/></button></div>}
      </div>
      {editPost===post.id?<div className="inline-edit"><textarea aria-label="Editar texto da publicação" value={editPostBody} maxLength={2000} onChange={e=>setEditPostBody(e.target.value)}/><div className="button-row"><button className="btn secondary" onClick={()=>setEditPost(null)}>Cancelar</button><button className="btn primary" onClick={()=>savePost(post.id)}><Check size={16}/> Salvar</button></div></div>
      :<p className="post-text">{post.body}</p>}
      {post.image&&<img className="post-image" src={post.image} alt="Imagem anexada à publicação" loading="lazy"/>}
      <div className="post-actions">
        <button className={'post-action '+(liked?'is-liked':'')} aria-pressed={liked} aria-label={liked?'Descurtir publicação':'Curtir publicação'} onClick={()=>toggleLike(post.id)}><Heart size={18} fill={liked?'currentColor':'none'}/> <span>{post.likedBy.length} <span className="desktop-label">Curtidas</span></span></button>
        <span className="post-action static"><MessageSquare size={18}/> {post.comments.length} <span className="desktop-label">Comentários</span></span>
        <button className="post-action" onClick={()=>copyPost(post)} aria-label="Copiar publicação"><Share2 size={18}/><span className="desktop-label">Compartilhar</span></button>
      </div>
      {post.comments.length>0&&<div className="comments">{post.comments.map(c=><div className="comment" key={c.id}><Avatar size="sm" profile={findUser(c.authorId)}/><div><strong>{findUser(c.authorId)?.name||'Pessoa'}</strong><span>{c.body}</span></div></div>)}</div>}
      <form className="comment-form" onSubmit={e=>{e.preventDefault();comment(post.id)}}>
        <Avatar profile={me} size="sm"/>
        <input aria-label="Escrever comentário" placeholder="Escreva um comentário..." maxLength={500} value={commentDrafts[post.id]||''} onChange={e=>setCommentDrafts(p=>({...p,[post.id]:e.target.value}))}/>
        <button type="submit" className="icon-btn send-icon" aria-label="Enviar comentário" disabled={!commentDrafts[post.id]?.trim()}><Send size={17}/></button>
      </form>
    </article>;
  }
  function PeopleGrid({type='all'}:{type?:'all'|'pending'}){
    const people=data.profiles.filter(p=>p.id!==me.id&&(!query||p.name.toLowerCase().includes(query)||p.handle.toLowerCase().includes(query)))
      .filter(p=>type==='all'||data.friendships.some(f=>f.userId===p.id&&f.status==='pending'));
    return <div className="people-grid">{people.length?people.map(p=>{
      const status=data.friendships.find(f=>f.userId===p.id)?.status||'suggested';
      return <article className="card person-card" key={p.id}><div className="person-banner" style={{'--person-color':p.color} as React.CSSProperties}/><Avatar profile={p} size="lg"/><h3>{p.name}</h3><p>@{p.handle}</p><p className="person-bio">{p.bio}</p><div className="person-actions">
        {status==='pending'?<button className="btn primary" onClick={()=>setFriend(p.id,'friends')}><Check size={16}/> Aceitar</button>
         :status==='friends'?<button className="btn primary" onClick={()=>openChat(p.id)}><MessageCircle size={16}/> Conversar</button>
         :status==='sent'?<button className="btn secondary" disabled><Check size={16}/> Solicitado</button>
         :<button className="btn primary" onClick={()=>setFriend(p.id,'sent')}><UserPlus size={16}/> Adicionar</button>}
        {status==='pending'&&<button className="btn secondary" onClick={()=>setFriend(p.id,'suggested')}>Recusar</button>}
      </div></article>;
    }):<div className="card empty full-span"><Users size={28}/><strong>Nenhum perfil encontrado</strong><span>Tente outra busca ou explore a comunidade.</span></div>}</div>;
  }
  function Chat({id}:{id:string}){
    const user=findUser(id);if(!user)return null;
    const msgs=data.messages.filter(m=>(m.from===id&&m.to===me.id)||(m.from===me.id&&m.to===id)).sort((a,b)=>a.createdAt-b.createdAt);
    return <section className="chat-window" aria-label={'Conversa com '+user.name} data-testid="chat-window">
      <div className="chat-header"><Avatar profile={user} size="sm"/><div><strong>{user.name}</strong><span>Conversa local · Demonstração</span></div><button className="icon-btn" onClick={()=>setChatIds(ids=>ids.filter(x=>x!==id))} aria-label={'Fechar conversa com '+user.name}><X size={18}/></button></div>
      <div className="chat-messages" role="log" aria-live="polite">
        {msgs.length?msgs.map(m=><div key={m.id} className={'bubble '+(m.from===me.id?'own':'theirs')}>{m.body}<small>{formatDate(m.createdAt)}</small></div>):<div className="chat-empty">Inicie uma conversa demonstrativa com {user.name}.</div>}
      </div>
      <form className="chat-compose" onSubmit={e=>{e.preventDefault();sendChat(id)}}>
        <input maxLength={1000} placeholder="Sua mensagem..." aria-label={'Mensagem para '+user.name} value={chatDrafts[id]||''} onChange={e=>setChatDrafts(v=>({...v,[id]:e.target.value}))}/>
        <button type="submit" className="icon-btn send-icon" disabled={!chatDrafts[id]?.trim()} aria-label="Enviar mensagem"><Send size={18}/></button>
      </form>
    </section>;
  }
  const profilePosts=data.posts.filter(p=>p.authorId===me.id).sort((a,b)=>b.createdAt-a.createdAt);
  if(!ready)return <div className="loading-screen"><Logo/><p>Carregando seu espaço...</p></div>;
  return <div className="app-shell">
    <a href="#main" className="skip-link">Pular para conteúdo</a>
    <header className={"topbar "+(mobileSearch?"search-open":"")}>
      <button className="icon-btn hamburger" aria-label="Abrir menu" aria-expanded={sidebar} onClick={()=>setSidebar(v=>!v)}><Menu size={22}/></button>
      <button className="brand-btn" onClick={()=>go('feed')} aria-label="Rede Jovem, início"><Logo/></button>
      <div className={"top-search "+(mobileSearch?"expanded":"")}><Search className="search-desktop-icon" size={19}/><button className="mobile-search-btn icon-btn" aria-label={mobileSearch?"Fechar busca":"Abrir busca"} aria-expanded={mobileSearch} onClick={()=>setMobileSearch(v=>!v)}>{mobileSearch?<X size={19}/>:<Search size={19}/>}</button><input aria-label="Pesquisar pessoas e publicações" placeholder="Pesquisar na Rede Jovem" value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button className="icon-btn" aria-label="Limpar busca" onClick={()=>setSearch('')}><X size={15}/></button>}</div>
      <div className="top-actions">
        <Pill><ShieldCheck size={14}/> Modo demonstração</Pill>
        <button className="icon-btn top-personalize" aria-label="Personalizar cores" title="Personalizar cores" onClick={()=>go('settings')}><Palette size={20}/></button>
        <button className="icon-btn top-theme" aria-label={theme==='dark'?'Ativar modo claro':'Ativar modo escuro'} onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{theme==='dark'?<Sun size={20}/>:<Moon size={20}/>}</button>
        <div className="notify-wrap"><button className="icon-btn notification-btn" aria-label="Notificações" aria-expanded={notify} onClick={()=>setNotify(v=>!v)}><Bell size={20}/>{incoming>0&&<span className="count">{incoming}</span>}</button>
          {notify&&<div className="notify-panel card"><strong>Notificações</strong><p>{incoming? `Você tem ${incoming} solicitação(ões) demonstrativa(s).`:'Nenhuma nova notificação.'}</p><button className="btn secondary" onClick={()=>{setNotify(false);go('friends')}}>Ver amizades</button></div>}
        </div>
        <button className="top-user" onClick={()=>go('profile')} title="Meu perfil"><Avatar profile={me} size="sm"/><span>{me.name.split(' ')[0]}</span><ChevronDown size={14}/></button>
      </div>
    </header>
    <div className="layout">
      <aside className={'sidebar '+(sidebar?'open':'')} aria-label="Navegação principal">
        <div className="sidebar-profile"><Avatar profile={me} size="lg"/><div><strong>{me.name}</strong><span>@{me.handle}</span></div></div>
        <nav className="side-links" aria-label="Navegação principal"><a className="side-link" href="#comunidade"><Users size={20}/><span>Comunidade online</span></a>{NAV.map(item=><button key={item.id} onClick={()=>go(item.id)} className={'side-link '+(section===item.id?'active':'')} aria-current={section===item.id?'page':undefined}><item.icon size={20}/><span>{item.label}</span>{item.id==='friends'&&incoming>0&&<span className="nav-count">{incoming}</span>}</button>)}</nav>
        <div className="side-bottom"><div className="side-hint"><Sparkles size={18}/><div><strong>Seu espaço, suas ideias</strong><p>Experimente sem criar conta. Tudo fica neste navegador.</p></div></div><span className="sidebar-footer">Rede Jovem · Experiência local</span></div>
      </aside>
      {sidebar&&<button className="mobile-overlay" aria-label="Fechar menu" onClick={()=>setSidebar(false)}/>}
      <main id="main" tabIndex={-1} className="content">
        {savingError&&<div role="alert" className="storage-warning">Não foi possível salvar seus dados. Exporte um backup antes de sair.</div>}
        {section==='feed'&&<>
          <div className="page-intro feed-welcome"><div className="welcome-copy"><span className="eyebrow"><Sparkles size={15}/> SEU CANTINHO NA REDE</span><h1>Boas-vindas, <span className="welcome-name">{me.name.split(' ')[0]}!</span> <span className="welcome-sparkle">✦</span></h1><p>O melhor das conexões começa com um simples olá. O que vamos compartilhar hoje?</p><span className="welcome-caption"><span className="welcome-pulse"/> Um espaço para ser você</span></div><div className="welcome-decoration" aria-hidden="true"><span className="network-ring ring-one"/><span className="network-ring ring-two"/><span className="network-core"><Users size={46}/></span><span className="network-node node-one"/><span className="network-node node-two"/><span className="network-node node-three"/></div></div>
          <div className="feed-quick-actions">
            <div className="online-invite card"><span className="quick-icon community-icon"><Users size={20}/></span><div><strong>Comunidade em construção</strong><p>Conheça a experiência online que estamos preparando.</p><a href="#comunidade">Explorar comunidade <span aria-hidden="true">↗</span></a></div></div>
            <div className="faith-quick card"><span className="faith-quick-icon"><BookOpen size={20}/></span><div><strong>Seu momento de inspiração</strong><p>Reflexões, gratidão e palavras que acolhem.</p><button type="button" onClick={()=>go('faith')}>Conhecer Espaço Fé <span aria-hidden="true">↗</span></button></div></div>
          </div>
          <section className="card composer" aria-label="Criar publicação"><div className="composer-head"><Avatar profile={me}/><textarea aria-label="O que você está pensando?" placeholder={'No que você está pensando, '+me.name.split(' ')[0]+'?'} maxLength={2000} value={postBody} onChange={e=>setPostBody(e.target.value)} rows={2}/></div>
            {postImage&&<div className="attachment"><img alt="Prévia da imagem selecionada" src={postImage}/><button className="icon-btn" aria-label="Remover imagem" onClick={()=>setPostImage('')}><X size={18}/></button></div>}
            <div className="composer-bottom"><label className="upload-label" htmlFor="post-photo"><ImagePlus size={19}/> <span>Foto</span></label><input id="post-photo" ref={uploadInput} type="file" accept="image/*" onChange={e=>picture(e.target.files?.[0])}/><span className="compose-counter">{postBody.length}/2000</span><button className="btn primary" disabled={postUploading||(!postBody.trim()&&!postImage)} onClick={post}><Send size={16}/> Publicar</button></div>
          </section>
          <div className="feed-header"><h2>Seu feed <span>{visiblePosts.length} publicações</span></h2><div className="segmented" aria-label="Filtrar publicações"><button onClick={()=>setFilter('all')} aria-pressed={filter==='all'} className={filter==='all'?'selected':''}>Todas</button><button onClick={()=>setFilter('friends')} aria-pressed={filter==='friends'} className={filter==='friends'?'selected':''}>Amigos</button></div></div>
          <div className="feed-list">{visiblePosts.length?visiblePosts.map(post=><React.Fragment key={post.id}>{PostCard({post})}</React.Fragment>):<div className="card empty"><Search size={26}/><strong>Não encontramos publicações</strong><span>Experimente outro termo ou publique algo novo.</span></div>}</div>
        </>}
        {section==='faith'&&<FaithHub palette={palette} onPalette={setPalette} favorites={data.faithFavorites||[]} onFavorite={toggleFaithFavorite} notes={data.gratitudeNotes||[]} onAddNote={addGratitude} onDeleteNote={deleteGratitude} onShare={shareFaith} readingProgress={data.readingProgress||{}} onToggleReading={toggleReading}/>}
        {section==='explore'&&<><div className="page-intro"><div><span className="eyebrow"><Compass size={14}/> DESCUBRA A REDE</span><h1>Explorar pessoas</h1><p>Conheça os perfis demonstrativos da comunidade.</p></div></div>{PeopleGrid({})}</>}
        {section==='friends'&&<><div className="page-intro"><div><span className="eyebrow"><Users size={14}/> SUA COMUNIDADE</span><h1>Amigos e conexões</h1><p>Gerencie amizades e solicitações fictícias neste navegador.</p></div></div>{incoming>0&&<div className="section-heading"><h2>Solicitações recebidas <span>{incoming}</span></h2></div>}{incoming>0&&PeopleGrid({type:'pending'})}<div className="section-heading"><h2>Pessoas da comunidade</h2></div>{PeopleGrid({})}</>}
        {section==='messages'&&<><div className="page-intro"><div><span className="eyebrow"><MessageCircle size={14}/> CONVERSAS</span><h1>Suas mensagens</h1><p>Abra conversas em janelas flutuantes. Mensagens ficam salvas localmente.</p></div></div><div className="card contact-list"><h2>Conversas demonstrativas</h2>{data.profiles.filter(p=>p.id!==me.id).map(p=>{const recent=data.messages.filter(m=>(m.from===p.id&&m.to===me.id)||(m.from===me.id&&m.to===p.id)).sort((a,b)=>b.createdAt-a.createdAt)[0];return <button className="contact-row" key={p.id} onClick={()=>openChat(p.id)}><Avatar profile={p}/><span><strong>{p.name}</strong><small>{recent?.body||'Inicie uma conversa demonstrativa'}</small></span><MessageCircle size={20}/></button>})}</div></>}
        {section==='profile'&&<><div className="page-intro"><div><span className="eyebrow"><UserRound size={14}/> MINHA IDENTIDADE</span><h1>Meu perfil</h1><p>Um espaço para mostrar quem você é.</p></div></div><div className="card profile-card"><div className="cover-photo"><button className="cover-tag" onClick={startEditProfile}><Pencil size={15}/> Editar perfil</button></div><div className="profile-details"><div className="profile-topline"><div className="profile-avatar"><Avatar profile={me} size="xl"/><label title="Alterar foto" className="camera-button" htmlFor="avatar-upload"><Camera size={17}/></label><input type="file" accept="image/*" id="avatar-upload" onChange={e=>changeAvatar(e.target.files?.[0])}/></div><button className="btn secondary" onClick={startEditProfile}><Pencil size={16}/> Editar</button></div><h2>{me.name}</h2><span className="handle">@{me.handle}</span><p className="profile-bio">{me.bio}</p><span className="location"><MapPin size={16}/>{me.city||'Localização não informada'}</span><div className="profile-stats"><span><strong>{profilePosts.length}</strong> Publicações</span><span><strong>{friends.length}</strong> Amigos</span><span><strong>{me.id==='me'?'2026':'Demo'}</strong> Comunidade</span></div></div></div>
          {profileEditing&&<div className="card edit-profile"><h2>Editar perfil</h2><div className="form-grid"><label>Nome<input maxLength={60} value={profileForm.name} onChange={e=>setProfileForm(p=>({...p,name:e.target.value}))}/></label><label>Usuário<input maxLength={24} value={profileForm.handle} onChange={e=>setProfileForm(p=>({...p,handle:e.target.value}))}/></label><label className="span-2">Cidade<input maxLength={80} value={profileForm.city} onChange={e=>setProfileForm(p=>({...p,city:e.target.value}))}/></label><label className="span-2">Biografia<textarea maxLength={300} rows={3} value={profileForm.bio} onChange={e=>setProfileForm(p=>({...p,bio:e.target.value}))}/></label></div><div className="button-row"><button className="btn secondary" onClick={()=>setProfileEditing(false)}>Cancelar</button><button className="btn primary" onClick={saveProfile}><Check size={16}/> Salvar alterações</button></div></div>}
          <div className="section-heading"><h2>Minhas publicações</h2></div><div className="feed-list">{profilePosts.length?profilePosts.map(post=><React.Fragment key={post.id}>{PostCard({post})}</React.Fragment>):<div className="card empty"><MessageSquare size={24}/><strong>Você ainda não publicou</strong><button className="btn primary" onClick={()=>go('feed')}>Criar publicação</button></div>}</div></>}
        {section==='settings'&&<><div className="page-intro"><div><span className="eyebrow"><Settings size={14}/> CONTROLE LOCAL</span><h1>Configurações</h1><p>Personalize sua experiência e gerencie os dados deste navegador.</p></div></div>
          <div className="card settings-card"><h2>Aparência</h2><p>Deixe a Rede Jovem com a sua cara. Todas as paletas estão disponíveis para qualquer pessoa.</p>
            <div className="settings-line"><span>{theme==='dark'?'Modo escuro':'Modo claro'}</span><button className="btn secondary" onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{theme==='dark'?<Sun size={17}/>:<Moon size={17}/>} Alternar tema</button></div>
            <fieldset className="accent-picker"><legend>Cores da interface</legend>
              <div className="accent-options">{ACCENTS.map(option=><button type="button" key={option.id} aria-label={'Paleta '+option.name} aria-pressed={accent===option.id} className={'accent-option '+(accent===option.id?'selected':'')} onClick={()=>setAccent(option.id)}>
                <span className="accent-swatch" style={{'--swatch-one':option.first,'--swatch-two':option.second} as React.CSSProperties} aria-hidden="true"/>
                <span className="accent-option-copy"><strong>{option.name}</strong><small>{option.description}</small></span>
                {accent===option.id&&<Check size={17} aria-hidden="true"/>}
              </button>)}</div>
              <p className="accent-help">Sua preferência fica salva apenas neste navegador. Você pode mudar quando quiser.</p>
            </fieldset>
          </div>
          <div className="card settings-card"><h2>Perfil de demonstração</h2><p>Alterne entre as pessoas fictícias para experimentar interações. Isso não é autenticação real.</p><label className="select-label">Perfil ativo<select aria-label="Escolher perfil demonstrativo" value={selectedProfile} onChange={e=>switchProfile(e.target.value)}>{data.profiles.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label></div>
          <div className="card settings-card"><h2>Seus dados locais</h2><p>Publicações, imagens e conversas permanecem neste navegador. Não existe conta, sincronização ou servidor.</p><div className="settings-buttons"><button className="btn secondary" onClick={()=>downloadBackup(data)}><Download size={17}/> Exportar JSON</button><button className="btn secondary" onClick={()=>backupInput.current?.click()}><Upload size={17}/> Importar JSON</button><input hidden ref={backupInput} type="file" accept=".json,application/json" onChange={e=>importBackup(e.target.files?.[0])}/><button className="btn danger-btn" onClick={reset}><RotateCcw size={17}/> Restaurar demonstração</button></div></div>
          <div className="privacy-note"><ShieldCheck size={21}/><div><strong>Privacidade e limites</strong><p>Esta é uma rede social demonstrativa. Não informe senhas, dados sensíveis ou mensagens confidenciais. Outros visitantes não conseguem ver seus dados e você não recebe mensagens reais.</p></div></div>
        </>}
      </main>
      <aside className="rightbar" aria-label="Painel de contatos">
        <div className="right-top"><div className="welcome-art"><span className="right-feature-overline"><Sparkles size={15}/> DESCUBRA</span><strong>Gente nova. <em>Ideias novas.</em></strong><span>Cada conexão pode render uma boa história.</span><button onClick={()=>go('explore')}>Conhecer pessoas <span aria-hidden="true">↗</span></button><span className="right-feature-decoration" aria-hidden="true"><Users size={98}/></span></div></div>
        <div className="contacts-header"><h2>Contatos</h2><span>{friends.length}</span></div>
        <div className="contacts">{friends.map(p=><button key={p.id} className="contact-mini" onClick={()=>openChat(p.id)}><Avatar profile={p} size="sm"/><span>{p.name}</span><MessageCircle size={16}/></button>)}</div>
        <div className="right-note"><ShieldCheck size={16}/><span>Sem conexão com servidor. Conversas são apenas locais.</span></div>
      </aside>
    </div>
    {chatIds.length>0&&<div className="chat-stack">{chatIds.map(id=><React.Fragment key={id}>{Chat({id})}</React.Fragment>)}</div>}
    {toast&&<div role="status" className="toast"><CheckCircle2 size={18}/>{toast}<button aria-label="Fechar aviso" onClick={()=>setToast('')}><X size={16}/></button></div>}
    <nav className="bottom-nav" aria-label="Navegação mobile">{NAV.slice(0,5).map(n=><button className={section===n.id?'active':''} aria-label={n.label} aria-current={section===n.id?'page':undefined} key={n.id} onClick={()=>go(n.id)}><n.icon size={21}/><small>{n.label}</small></button>)}</nav>
  </div>;
}
function RootApp() {
  const [online,setOnline]=useState(() => location.hash === '#comunidade' || (onlineConfigured && !location.hash));
  useEffect(()=>{
    try {
      const saved=localStorage.getItem('rede-jovem-accent-v1');
      document.documentElement.dataset.accent=ACCENTS.some(option=>option.id===saved)?saved!:'indigo';
    } catch {
      document.documentElement.dataset.accent='indigo';
    }
  },[]);
  useEffect(() => {
    const change = () => setOnline(location.hash === '#comunidade' || (onlineConfigured && !location.hash));
    addEventListener('hashchange',change);
    return () => removeEventListener('hashchange',change);
  },[]);
  return online ? <OnlineMVP/> : <App/>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><RootApp/></React.StrictMode>);
