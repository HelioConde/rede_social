import {useCallback,useEffect,useMemo,useState} from 'react';
import type {SupabaseClient} from '@supabase/supabase-js';
import {CheckCircle2,EyeOff,Flag,RefreshCw,ShieldCheck,X} from 'lucide-react';

type Report={id:string;post_id:string;reason:'spam'|'abuso'|'outro';created_at:string};
type Review={report_id:string;moderator_id:string;decision:'dismissed'|'hidden';reviewed_at:string};
type Post={id:string;content:string;author_id:string;created_at:string};
type Hidden={post_id:string;created_at:string};
type Props={client:SupabaseClient;userId:string;onClose:()=>void};
const date=(s:string)=>new Date(s).toLocaleString('pt-BR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});

export function ModerationPanel({client,userId,onClose}:Props){
  const [reports,setReports]=useState<Report[]>([]);
  const [reviews,setReviews]=useState<Review[]>([]);
  const [posts,setPosts]=useState<Post[]>([]);
  const [hidden,setHidden]=useState<Hidden[]>([]);
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [revision,setRevision]=useState(0);

  const load=useCallback(()=>setRevision(n=>n+1),[]);
  useEffect(()=>{
    let active=true;
    async function fetchQueue(){
      setLoading(true);setError('');
      try{
        // Mesmo na UI de moderadores, a autorização real pertence ao RLS.
        const [r,permission]=await Promise.all([
          client.from('rj_reports').select('id,post_id,reason,created_at')
            .order('created_at',{ascending:false}).limit(50),
          client.from('rj_moderators').select('user_id').eq('user_id',userId).maybeSingle()
        ]);
        if(permission.error||!permission.data)throw Error('Você não tem permissão para revisar denúncias.');
        if(r.error)throw r.error;
        const incoming=(r.data||[]) as Report[];
        const reportIds=incoming.map(x=>x.id);
        const postIds=[...new Set(incoming.map(x=>x.post_id))];
        const [reviewResult,postResult,hiddenResult]=await Promise.all([
          reportIds.length?client.from('rj_report_reviews')
            .select('report_id,moderator_id,decision,reviewed_at').in('report_id',reportIds)
            :Promise.resolve({data:[] as Review[],error:null}),
          postIds.length?client.from('rj_posts')
            .select('id,content,author_id,created_at').in('id',postIds)
            :Promise.resolve({data:[] as Post[],error:null}),
          postIds.length?client.from('rj_post_moderation')
            .select('post_id,created_at').in('post_id',postIds)
            :Promise.resolve({data:[] as Hidden[],error:null})
        ]);
        if(reviewResult.error||postResult.error||hiddenResult.error)
          throw reviewResult.error||postResult.error||hiddenResult.error;
        if(active){
          setReports(incoming);
          setReviews((reviewResult.data||[]) as Review[]);
          setPosts((postResult.data||[]) as Post[]);
          setHidden((hiddenResult.data||[]) as Hidden[]);
        }
      }catch(e){
        if(active)setError(e instanceof Error?e.message:'Não foi possível carregar a fila de denúncias.');
      }finally{if(active)setLoading(false);}
    }
    void fetchQueue();
    return ()=>{active=false};
  },[client,userId,revision]);

  const pending=useMemo(()=>reports.filter(r=>!reviews.some(v=>v.report_id===r.id)),[reports,reviews]);

  async function decide(report:Report,decision:'dismissed'|'hidden'){
    if(busy)return;
    if(decision==='hidden'&&!window.confirm('Ocultar esta publicação do feed dos demais participantes?'))return;
    setBusy(true);setError('');setNotice('');
    try{
      const alreadyHidden=hidden.some(x=>x.post_id===report.post_id);
      if(decision==='hidden'&&!alreadyHidden){
        const result=await client.from('rj_post_moderation')
          .insert({post_id:report.post_id,moderator_id:userId});
        if(result.error)throw result.error;
      }
      const result=await client.from('rj_report_reviews')
        .insert({report_id:report.id,moderator_id:userId,decision});
      if(result.error)throw result.error;
      setNotice(decision==='hidden'?'Publicação ocultada; decisão registrada.':'Denúncia descartada e registrada.');
    }catch(e){
      setError(e instanceof Error?e.message:'Não foi possível salvar a decisão. Revise o estado da fila.');
    }finally{
      setBusy(false);load();
    }
  }

  return <section className="online-panel moderation-panel" aria-label="Painel de moderação">
    <header className="moderation-header">
      <div><span className="online-kicker"><ShieldCheck size={16}/> ACESSO RESTRITO</span>
        <h2>Fila de moderação</h2>
        <p>Revisão humana. Ocultar preserva a denúncia para auditoria.</p>
      </div>
      <button type="button" className="online-icon" aria-label="Fechar moderação" onClick={onClose}><X size={20}/></button>
    </header>
    <div className="moderation-toolbar">
      <strong>{pending.length} pendentes nos últimos {reports.length} registros</strong>
      <button type="button" className="online-ghost" disabled={loading||busy} onClick={load}>
        <RefreshCw size={16}/> Atualizar fila
      </button>
    </div>
    {error&&<p role="alert" className="moderation-error">{error}</p>}
    {notice&&<p role="status" className="moderation-notice">{notice}</p>}
    {loading?<p role="status">Carregando denúncias...</p>
      :pending.length===0?<div className="moderation-empty"><CheckCircle2 size={25}/><strong>Nenhuma denúncia pendente neste lote</strong><p>As próximas denúncias aparecerão aqui após a atualização.</p></div>
      :<div className="moderation-queue">{pending.map(report=>{
        const post=posts.find(p=>p.id===report.post_id);
        const isHidden=hidden.some(x=>x.post_id===report.post_id);
        return <article className="moderation-item" key={report.id}>
          <div className="moderation-meta"><span><Flag size={15}/> {report.reason==='abuso'?'Abuso ou assédio':report.reason==='spam'?'Spam':'Outro motivo'}</span><time dateTime={report.created_at}>{date(report.created_at)}</time></div>
          <p className="moderation-excerpt">{post?.content||'Publicação indisponível. Verifique o registro antes de decidir.'}</p>
          {isHidden&&<p className="moderation-hidden"><EyeOff size={16}/> Publicação já oculta</p>}
          <div className="moderation-actions">
            <button type="button" className="online-primary" disabled={busy||!post}
              onClick={()=>void decide(report,'hidden')}><EyeOff size={17}/>{isHidden?'Registrar ocultação':'Ocultar publicação'}</button>
            <button type="button" className="online-ghost" disabled={busy}
              onClick={()=>void decide(report,'dismissed')}><CheckCircle2 size={16}/> Descartar denúncia</button>
          </div>
        </article>;
      })}</div>}
    <p className="online-small">A fila mostra os 50 registros mais recentes, incluindo os já revisados. Não há moderação automática nem banimento. Reversões e exclusões de conta exigem processo administrativo documentado.</p>
  </section>;
}
