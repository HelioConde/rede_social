import { useState } from 'react';
import { BookOpen, Check, CheckCircle2, Circle, Compass, ArrowRight } from 'lucide-react';
import { faithEntries, readingPlans } from './faith-content';
import './reading-plans.css';

type Props={
  completed:string[];
  onToggle:(key:string)=>void;
  onRead:(id:string)=>void;
};
export function ReadingPlans({completed,onToggle,onRead}:Props){
  const [selected,setSelected]=useState<string>(readingPlans[0].id);
  const plan=readingPlans.find(p=>p.id===selected)||readingPlans[0];
  const finished=plan.days.filter((_,index)=>completed.includes(plan.id+':'+index)).length;
  return <section className="reading-plans" aria-labelledby="reading-plans-title">
    <div className="reading-plans-intro">
      <div><span className="faith-kicker"><Compass size={15}/> LEITURA COM PROPÓSITO</span><h2 id="reading-plans-title">Pequenos passos, um dia de cada vez</h2><p>Trilhas de cinco reflexões, sem cobranças ou sequência obrigatória. Seu progresso fica somente neste navegador.</p></div>
      <span className="reading-plan-optional">5 dias · No seu ritmo</span>
    </div>
    <div className="reading-plan-choices" role="group" aria-label="Escolher plano de leitura">
      {readingPlans.map(p=>{
        const amount=p.days.filter((_,index)=>completed.includes(p.id+':'+index)).length;
        return <button type="button" className={'reading-plan-choice '+(selected===p.id?'selected':'')} aria-pressed={selected===p.id} key={p.id} onClick={()=>setSelected(p.id)}>
          <span className="reading-plan-choice-title">{p.title}</span>
          <span>{p.subtitle}</span>
          <small>{amount}/5 dias concluídos</small>
        </button>;
      })}
    </div>
    <div className="card reading-plan-details">
      <div className="reading-plan-topline">
        <div><span className="faith-kicker">{plan.topic.toUpperCase()}</span><h3>{plan.title}</h3><p>{plan.description}</p></div>
        <span className="reading-progress-percent">{Math.round(finished / plan.days.length * 100)}%</span>
      </div>
      <div className="reading-progress" role="progressbar" aria-label={'Progresso do plano '+plan.title} aria-valuenow={finished} aria-valuemin={0} aria-valuemax={plan.days.length}>
        <span style={{width:finished / plan.days.length * 100+'%'}}/>
      </div>
      <p className="reading-progress-label" aria-live="polite">{finished} de {plan.days.length} dias concluídos. Você pode ler na ordem que preferir.</p>
      <ol className="reading-days">{plan.days.map((id,index)=>{
        const item=faithEntries.find(entry=>entry.id===id);
        const done=completed.includes(plan.id+':'+index);
        return <li className={'reading-day '+(done?'is-complete':'')} key={id}>
          <span className="reading-day-number" aria-hidden="true">{done?<Check size={18}/>:index+1}</span>
          <div className="reading-day-info"><strong>Dia {index+1} · {item?.title||'Reflexão'}</strong><small>{item?.ref||''}</small></div>
          <div className="reading-day-actions">
            <button type="button" className="reading-day-open" onClick={()=>onRead(id)} aria-label={'Ler dia '+(index+1)+': '+(item?.title||'Reflexão')}><BookOpen size={16}/><span>Ler</span><ArrowRight size={14}/></button>
            <button type="button" className={'reading-day-toggle '+(done?'done':'')} aria-pressed={done} onClick={()=>onToggle(plan.id+':'+index)} aria-label={(done?'Marcar como não concluído o dia ':'Concluir dia ')+(index+1)}>
              {done?<CheckCircle2 size={18}/>:<Circle size={18}/>}<span>{done?'Concluído':'Concluir'}</span>
            </button>
          </div>
        </li>;
      })}</ol>
      <p className="reading-plan-privacy">Sem notificações obrigatórias, contagem de dias consecutivos ou cobrança de frequência. Não é necessário criar uma conta.</p>
    </div>
  </section>;
}
