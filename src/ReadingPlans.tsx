import { useState } from 'react';
import { BookMarked, BookOpen, Check, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { readingPlans } from './reading-plans';
import { faithEntries } from './faith-content';

type Props={
  progress: Record<string,string[]>;
  onToggle:(planId:string, entryId:string)=>void;
  onOpen:(entryId:string)=>void;
};
export function ReadingPlans({progress,onToggle,onOpen}:Props) {
  const [selected,setSelected]=useState(readingPlans[0].id);
  const plan=readingPlans.find(p=>p.id===selected)||readingPlans[0];
  const completed=new Set(progress[plan.id]||[]);
  const doneCount=plan.days.filter(d=>completed.has(d.entryId)).length;
  const nextIndex=plan.days.findIndex(d=>!completed.has(d.entryId));
  return <section className="faith-plans" aria-labelledby="faith-plans-title" data-testid="reading-plans">
    <div className="faith-plans-heading">
      <div className="faith-plans-heading-icon"><BookMarked size={23}/></div>
      <div><span className="faith-kicker">UMA JORNADA NO SEU RITMO</span><h2 id="faith-plans-title">Planos de reflexão em 7 dias</h2><p>Leia quando desejar. O progresso é particular, sem cobranças ou contagem de sequência.</p></div>
    </div>
    <div className="faith-plan-tabs" role="group" aria-label="Escolher plano de leitura">
      {readingPlans.map(p=>{
        const n=p.days.filter(d=>(progress[p.id]||[]).includes(d.entryId)).length;
        return <button key={p.id} type="button" className={'faith-plan-tab '+(selected===p.id?'selected':'')}
          aria-pressed={selected===p.id} onClick={()=>setSelected(p.id)}>
          <strong>{p.name}</strong><span>{n} de {p.days.length} etapas</span>
        </button>
      })}
    </div>
    <div className="card faith-plan-detail">
      <div className="faith-plan-detail-head">
        <div><span className="faith-kicker">{plan.theme}</span><h3>{plan.name}</h3><p>{plan.description}</p></div>
        <span className="faith-plan-count" aria-label={doneCount+' de 7 etapas concluídas'}>{doneCount}/7</span>
      </div>
      <div className="faith-progress-track" role="progressbar" aria-label={'Progresso do plano '+plan.name}
        aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={7}>
        <span style={{width:(doneCount/7*100)+'%'}}/>
      </div>
      {doneCount===7&&<p className="faith-complete" role="status"><CheckCircle2 size={17}/> Plano concluído! Você pode revisitar qualquer etapa quando quiser.</p>}
      <ol className="faith-days">
        {plan.days.map((d,index)=>{
          const entry=faithEntries.find(e=>e.id===d.entryId);
          const checked=completed.has(d.entryId);
          return <li key={d.entryId} className={'faith-day '+(checked?'complete':'')+(nextIndex===index?' next':'')}>
            <span className="faith-day-number" aria-hidden="true">{checked?<Check size={16}/>:index+1}</span>
            <div className="faith-day-content">
              <strong>Dia {index+1} · {entry?.title||'Reflexão'}</strong>
              <span>{entry?.ref} — {d.action}</span>
              <button type="button" className="faith-open-day" onClick={()=>onOpen(d.entryId)}><BookOpen size={15}/> Ler reflexão <ArrowRight size={14}/></button>
            </div>
            <button type="button" className={'faith-day-toggle '+(checked?'checked':'')}
              aria-label={(checked?'Desmarcar':'Concluir')+' dia '+(index+1)+' do plano '+plan.name}
              aria-pressed={checked} onClick={()=>onToggle(plan.id,d.entryId)}>
              {checked?<CheckCircle2 size={20}/>:<Circle size={20}/>}
            </button>
          </li>;
        })}
      </ol>
      <p className="faith-plan-footnote">Leituras baseadas em referências bíblicas, com reflexões autorais. Os textos integrais devem ser consultados em uma tradução de sua preferência.</p>
    </div>
  </section>;
}
