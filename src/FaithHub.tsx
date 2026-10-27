import { useMemo, useState } from 'react';
import { BookOpen, Heart, ArrowLeft, ArrowRight, Sparkles, SunMedium, HandHeart, PenLine, Trash2, Send, CheckCircle2, Palette, ShieldCheck } from 'lucide-react';
import type { GratitudeNote } from './types';
import { faithEntries, faithPalettes, faithTopics, type FaithPalette, type FaithTopic } from './faith-content';
import './faith.css';

type Props={
  palette:FaithPalette;
  onPalette:(palette:FaithPalette)=>void;
  favorites:string[];
  onFavorite:(id:string)=>void;
  notes:GratitudeNote[];
  onAddNote:(body:string)=>void;
  onDeleteNote:(id:string)=>void;
  onShare:(body:string)=>void;
};
function localDayIndex(){
  const d=new Date();
  const jan1=new Date(d.getFullYear(),0,1);
  return Math.floor((new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime()-jan1.getTime())/86400000);
}
export function FaithHub({palette,onPalette,favorites,onFavorite,notes,onAddNote,onDeleteNote,onShare}:Props){
  const [topic,setTopic]=useState<FaithTopic>('Todos');
  const [savedOnly,setSavedOnly]=useState(false);
  const [selected,setSelected]=useState(()=>faithEntries[localDayIndex()%faithEntries.length].id);
  const [note,setNote]=useState('');
  const [showJournal,setShowJournal]=useState(false);
  const [notice,setNotice]=useState('');
  const filtered=useMemo(()=>faithEntries.filter(v=>(topic==='Todos'||v.topic===topic)&&(!savedOnly||favorites.includes(v.id))),[topic,savedOnly,favorites]);
  const active=filtered.find(v=>v.id===selected)||filtered[0];
  const position=active?filtered.findIndex(v=>v.id===active.id):0;
  function navigate(delta:number){
    if(filtered.length===0)return;
    setSelected(filtered[(position+delta+filtered.length)%filtered.length].id);
  }
  function keyboardNavigate(event:React.KeyboardEvent<HTMLElement>){
    // Não capturar as teclas de campos, botões ou outros controles internos.
    if(event.target!==event.currentTarget||filtered.length===0)return;
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    if(event.key==='Home')setSelected(filtered[0].id);
    else if(event.key==='End')setSelected(filtered[filtered.length-1].id);
    else navigate(event.key==='ArrowRight'?1:-1);
  }
  function addNote(){
    const value=note.trim();
    if(!value||value.length>400)return;
    onAddNote(value);setNote('');setNotice('Registro guardado apenas neste navegador.');
  }
  function share(){
    if(!active)return;
    onShare('Uma reflexão que me inspirou: '+active.title+'\n\n'+active.reflection+'\n\nReferência bíblica: '+active.ref+'\n(Reflexão autoral, não transcrição do versículo.)');
  }
  return <section className="faith-page" aria-label="Espaço Fé">
    <div className="faith-hero">
      <div className="faith-hero-content">
        <span className="faith-overline"><Sparkles size={15}/> UM ESPAÇO PARA ACOLHER E INSPIRAR</span>
        <h1>Uma pausa para a <em>alma.</em></h1>
        <p>Reflexões de fé, esperança e afeto para acompanhar o seu dia. Explore do seu jeito, no seu tempo.</p>
        <div className="faith-hero-pills"><span><Heart size={15}/> Esperança</span><span><SunMedium size={15}/> Gratidão</span><span><HandHeart size={15}/> Comunidade</span></div>
      </div>
      <div className="faith-hero-art" aria-hidden="true"><span className="faith-orbit orbit-one"/><span className="faith-orbit orbit-two"/><span className="faith-sun"><BookOpen size={53}/></span><span className="faith-dot dot-one"/><span className="faith-dot dot-two"/></div>
    </div>

    <div className="faith-intro-line"><div><span className="faith-kicker"><BookOpen size={15}/> REFLEXÕES PARA O DIA A DIA</span><h2>Encontre uma palavra de inspiração</h2></div><span className="faith-content-note">Conteúdo cristão opcional</span></div>
    <div className="faith-filter-toolbar">
      <div className="faith-topics" role="group" aria-label="Filtrar reflexões por tema">
        {faithTopics.map(t=><button type="button" key={t} className={'faith-topic '+(topic===t?'active':'')} aria-pressed={topic===t} onClick={()=>{setTopic(t);setSelected('')}}>{t}</button>)}
      </div>
      <button className={'faith-favorite-filter '+(savedOnly?'active':'')} type="button" aria-pressed={savedOnly} onClick={()=>{setSavedOnly(v=>!v);setSelected('')}}><Heart size={17} fill={savedOnly?'currentColor':'none'}/> Salvos <span>{favorites.length}</span></button>
    </div>

    {active?<article className="faith-feature card" data-testid="faith-feature" role="region" aria-roledescription="carrossel"
      aria-label="Reflexões de fé" aria-describedby="faith-keyboard-hint" tabIndex={0} onKeyDown={keyboardNavigate}>
      <div className="faith-feature-header">
        <span className="faith-day-label"><Sparkles size={15}/> {topic==='Todos'&&!savedOnly?'REFLEXÃO EM DESTAQUE':'REFLEXÃO SELECIONADA'}</span>
        <span className="faith-pagination" aria-live="polite" aria-atomic="true">{position+1} de {filtered.length}</span>
      </div>
      <div className="faith-progress" aria-hidden="true"><span style={{width:((position+1)/filtered.length*100)+'%'}} /></div>
      <div className="faith-feature-main">
        <div className="faith-reference"><BookOpen size={17}/>{active.ref}<span>·</span>{active.topic}</div>
        <h3>{active.title}</h3>
        <p className="faith-reflection">{active.reflection}</p>
        <div className="faith-question"><span>PARA REFLETIR</span><p>{active.question}</p></div>
        <p className="faith-disclaimer">Reflexão original inspirada na referência indicada. Não é uma transcrição da Bíblia.</p>
      </div>
      <div className="faith-feature-footer">
        <div className="faith-nav-buttons">
          <button type="button" className="faith-round" onClick={()=>navigate(-1)} aria-label="Reflexão anterior"><ArrowLeft size={18}/></button>
          <button type="button" className="faith-round" onClick={()=>navigate(1)} aria-label="Próxima reflexão"><ArrowRight size={18}/></button>
        </div>
        <div className="faith-main-actions">
          <button type="button" className={'faith-save '+(favorites.includes(active.id)?'saved':'')} aria-pressed={favorites.includes(active.id)} onClick={()=>onFavorite(active.id)}><Heart size={18} fill={favorites.includes(active.id)?'currentColor':'none'}/>{favorites.includes(active.id)?'Salvo':'Salvar'}</button>
          <button type="button" className="btn primary" onClick={share}><Send size={16}/> Compartilhar no feed</button>
        </div>
      </div>
      <p className="faith-keyboard-hint" id="faith-keyboard-hint">Dica: selecione este cartão e use ← → para explorar, Home para o início e End para o fim.</p>
    </article>:<div className="card faith-empty"><Heart size={26}/><h3>Nenhuma reflexão salva neste filtro</h3><p>Experimente outro tema ou desative o filtro de favoritos.</p><button type="button" className="btn secondary" onClick={()=>{setSavedOnly(false);setTopic('Todos')}}>Ver todas as reflexões</button></div>}

    <div className="faith-content-grid">
      <section className="card faith-journal">
        <div className="faith-card-heading"><span className="faith-icon"><PenLine size={23}/></span><div><span className="faith-kicker">UM HÁBITO GENTIL</span><h2>Meu caderno de gratidão</h2></div></div>
        <p>Que tal registrar uma coisa boa do seu dia? Somente você verá suas anotações neste navegador.</p>
        <label htmlFor="faith-gratitude">Hoje sou grato(a) por...</label>
        <textarea id="faith-gratitude" rows={3} maxLength={400} placeholder="Um momento, uma pessoa, uma conquista..." value={note} onChange={e=>setNote(e.target.value)}/>
        <div className="faith-journal-actions"><span>{note.length}/400</span><button type="button" className="btn primary" disabled={!note.trim()} onClick={addNote}><CheckCircle2 size={16}/> Guardar reflexão</button></div>
        {notice&&<p role="status" className="faith-note-notice">{notice}</p>}
        <button type="button" className="faith-history-toggle" aria-expanded={showJournal} onClick={()=>setShowJournal(v=>!v)}>{showJournal?'Ocultar':'Ver'} meus registros ({notes.length}) <ArrowRight size={15}/></button>
        {showJournal&&<div className="faith-notes">{notes.length?notes.slice().sort((a,b)=>b.createdAt-a.createdAt).map(n=><div className="faith-note" key={n.id}><p>{n.body}</p><div><time dateTime={new Date(n.createdAt).toISOString()}>{new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric'}).format(n.createdAt)}</time><button type="button" aria-label="Excluir registro de gratidão" onClick={()=>onDeleteNote(n.id)}><Trash2 size={15}/></button></div></div>):<p className="faith-no-notes">Você ainda não registrou nada. Que tal começar hoje?</p>}</div>}
      </section>
      <section className="card faith-personalize">
        <div className="faith-card-heading"><span className="faith-icon"><Palette size={23}/></span><div><span className="faith-kicker">DO SEU JEITO</span><h2>Cores que acolhem</h2></div></div>
        <p>Escolha a atmosfera que combina com você. As opções são propostas de design, não preferências atribuídas a uma religião.</p>
        <fieldset className="faith-palettes"><legend>Paleta de cores do site</legend>{faithPalettes.map(p=><button type="button" key={p.id} className={'faith-palette-choice '+(palette===p.id?'selected':'')} aria-pressed={palette===p.id} onClick={()=>onPalette(p.id)}>
          <span className="faith-swatches" aria-hidden="true">{p.swatches.map(color=><i key={color} style={{backgroundColor:color}}/>)}</span><span className="faith-palette-copy"><strong>{p.name}</strong><small>{p.detail}</small></span>{palette===p.id&&<CheckCircle2 size={19} className="faith-palette-check"/>}
        </button>)}</fieldset>
        <div className="faith-privacy"><ShieldCheck size={16}/><span>As preferências ficam no seu dispositivo. Nenhum perfil religioso é identificado.</span></div>
      </section>
    </div>
    <div className="faith-footer-note"><BookOpen size={18}/><p>O Espaço Fé apresenta reflexões cristãs de forma voluntária e respeitosa. A Rede Jovem continua aberta a todas as pessoas, independentemente de sua crença.</p></div>
  </section>;
}
