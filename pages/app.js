(()=>{"use strict";
const KEY="rede-social-demo-v1";
const people=[{id:"luna",name:"Luna",role:"Comunidade de jogos",initials:"LU",color:"secondary"},{id:"alex",name:"Alex",role:"Desenvolvimento web",initials:"AL",color:"third"},{id:"bia",name:"Bia",role:"Pixel art e criatividade",initials:"BI",color:"secondary"}];
const initial=()=>({posts:[{id:"welcome-1",author:"luna",content:"Bem-vindo! Este espaço demonstra o mural da Rede Social. Você pode publicar, curtir e conversar — tudo fica neste navegador.",likes:2,liked:false,created:"Exemplo"},{id:"welcome-2",author:"alex",content:"Modernizar um projeto também é preservar suas ideias. Qual funcionalidade você gostaria de testar?",likes:1,liked:false,created:"Exemplo"}],friends:["luna"],messages:{luna:[{mine:false,text:"Olá! Esta é uma conversa fictícia de demonstração."}],alex:[],bia:[]},conversation:"luna"});
const q=s=>document.querySelector(s),qa=s=>Array.from(document.querySelectorAll(s));
let available=true;let state;
function load(){try{const stored=localStorage.getItem(KEY);if(!stored)return initial();const item=JSON.parse(stored);if(!item||!Array.isArray(item.posts)||!Array.isArray(item.friends)||!item.messages||typeof item.messages!=="object")return initial();return item}catch{available=false;return initial()}}
state=load();
function save(){try{if(available)localStorage.setItem(KEY,JSON.stringify(state))}catch{available=false;q("#storage-note").textContent="O armazenamento está indisponível. Seus dados ficarão apenas até fechar a página.";announce("Armazenamento indisponível neste navegador.")}}
function announce(message){const el=q("#alert");el.textContent=message;}
function make(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=String(text);return el}
function btn(text,cls,run){const el=make("button",cls,text);el.type="button";el.addEventListener("click",run);return el}
function avatar(person){return make("span","avatar "+(person?.color||""),person?.initials||"VC")}
function personById(id){return people.find(p=>p.id===id)}
function renderPosts(){const list=q("#post-list");list.replaceChildren();const find=q("#post-search").value.trim().toLocaleLowerCase("pt-BR");const posts=state.posts.filter(p=>p.content.toLocaleLowerCase("pt-BR").includes(find)||(personById(p.author)?.name||"Visitante").toLocaleLowerCase("pt-BR").includes(find));if(!posts.length){list.append(make("p","empty","Nenhuma publicação encontrada."));return}for(const post of posts){const who=personById(post.author);const item=make("article","post-card");const header=make("header");header.append(avatar(who));const info=make("div");info.append(make("h3","",who?.name||"Visitante"));info.append(make("small","",post.created||"Agora"));header.append(info);item.append(header);item.append(make("p","",post.content));const foot=make("footer");foot.append(btn((post.liked?"♥ ":"♡ ")+post.likes+" curtidas","secondary-btn",()=>{post.liked=!post.liked;post.likes=Math.max(0,post.likes+(post.liked?1:-1));save();renderPosts()}));if(post.author==="me")foot.append(btn("Excluir","secondary-btn remove",()=>{if(!window.confirm("Excluir esta publicação local?"))return;state.posts=state.posts.filter(p=>p!==post);save();renderPosts();announce("Publicação excluída.")}));item.append(foot);list.append(item)}}
function personRow(person){const node=make("article","person");node.append(avatar(person));const info=make("div","person-info");info.append(make("strong","",person.name));info.append(make("small","",person.role));node.append(info);node.append(btn(state.friends.includes(person.id)?"✓ Seguindo":"+ Seguir","secondary-btn",()=>{if(state.friends.includes(person.id))state.friends=state.friends.filter(x=>x!==person.id);else state.friends.push(person.id);save();renderFriends();announce("Amizades de demonstração atualizadas.")}));node.append(btn("Conversar","secondary-btn",()=>openFloating(person.id)));return node}
function renderFriends(){for(const [selector,subset] of [["#friend-list",people],["#suggested-friends",people.slice(0,2)]]){const list=q(selector);list.replaceChildren();for(const person of subset)list.append(personRow(person))}}
function renderMessages(){const conv=q("#conversation-list");conv.replaceChildren();for(const person of people)conv.append(btn(person.name,"secondary-btn"+(state.conversation===person.id?" active":""),()=>{state.conversation=person.id;save();renderMessages()}));const person=personById(state.conversation)||people[0];q("#conversation-title").textContent="Conversa com "+person.name;const history=q("#chat-history");history.replaceChildren();const messages=Array.isArray(state.messages[person.id])?state.messages[person.id]:[];if(!messages.length)history.append(make("p","empty","Esta conversa ainda não tem mensagens."));for(const entry of messages){const bubble=make("div","bubble"+(entry.mine?" mine":""));bubble.append(make("small","",entry.mine?"Você":person.name));bubble.append(make("span","",String(entry.text).slice(0,300)));history.append(bubble)}history.scrollTop=history.scrollHeight}
function show(view){qa(".view").forEach(el=>el.hidden=el.id!==view+"-view");qa(".nav-link").forEach(btn=>{const active=btn.dataset.view===view;btn.classList.toggle("active",active);if(active)btn.setAttribute("aria-current","page");else btn.removeAttribute("aria-current")});const titles={feed:"Seu espaço para conversar",friends:"Pessoas e conexões",messages:"Conversas da comunidade",settings:"Controle da sua experiência"};q("#page-title").textContent=titles[view]||titles.feed;announce("");if(view==="messages")renderMessages();if(view==="friends")renderFriends();history.replaceState(null,"","#"+view)}
qa("[data-view]").forEach(el=>el.addEventListener("click",()=>show(el.dataset.view)));
q("#post-input").addEventListener("input",event=>q("#counter").textContent=event.target.value.length+"/300 caracteres");
q("#post-search").addEventListener("input",renderPosts);
q("#post-form").addEventListener("submit",event=>{event.preventDefault();const field=q("#post-input");const content=field.value.trim();if(!content)return;if(state.posts.length>=100){announce("Limite de 100 publicações nesta demonstração.");return}state.posts.unshift({id:"local-"+Date.now(),author:"me",content:content.slice(0,300),likes:0,liked:false,created:new Date().toLocaleString("pt-BR")});field.value="";q("#counter").textContent="0/300 caracteres";save();renderPosts();announce("Sua publicação foi adicionada ao mural local.")});
q("#message-form").addEventListener("submit",event=>{event.preventDefault();const field=q("#message-input");const text=field.value.trim();if(!text)return;const id=state.conversation;if(!people.some(p=>p.id===id))return;if(!Array.isArray(state.messages[id]))state.messages[id]=[];state.messages[id].push({mine:true,text:text.slice(0,300)});state.messages[id]=state.messages[id].slice(-50);field.value="";save();renderMessages();announce("Mensagem adicionada nesta conversa local.")});
q("#export").addEventListener("click",()=>{const json=JSON.stringify(state,null,2);const href=URL.createObjectURL(new Blob([json],{type:"application/json"}));const link=document.createElement("a");link.href=href;link.download="rede-social-demo.json";document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(href),500);announce("Exportação local preparada.")});
q("#reset").addEventListener("click",()=>{if(!window.confirm("Restaurar os dados fictícios e apagar suas alterações locais?"))return;state=initial();save();renderPosts();renderFriends();renderMessages();announce("Demonstração restaurada.")});
renderPosts();renderFriends();renderMessages();show(["feed","friends","messages","settings"].includes(location.hash.slice(1))?location.hash.slice(1):"feed");
if(!available)q("#storage-note").textContent="Modo temporário: navegador não permitiu armazenamento persistente.";

let floatingId=null;
function mountFloating(){
 if(q('#floating-chat'))return;
 const wrap=make('section','floating-chat');
 wrap.id='floating-chat';wrap.hidden=true;wrap.setAttribute('role','region');wrap.setAttribute('aria-label','Conversa flutuante de demonstração');
 const head=make('div','floating-head'),name=make('strong','floating-name');
 name.id='floating-name';
 const close=btn('×','floating-close',()=>{wrap.hidden=true;floatingId=null;});
 close.setAttribute('aria-label','Fechar janela de conversa');
 head.append(name,close);
 const note=make('p','floating-note','Esta conversa é fictícia e fica somente neste navegador.');
 const history=make('div','floating-history');history.id='floating-history';history.setAttribute('role','log');history.setAttribute('aria-live','polite');
 const form=make('form','floating-form');form.id='floating-form';
 const input=make('input');input.id='floating-input';input.type='text';input.required=true;input.maxLength=300;input.placeholder='Mensagem local…';input.setAttribute('aria-label','Mensagem local');
 const send=make('button','primary','Enviar');send.type='submit';form.append(input,send);
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!floatingId)return;
  const value=input.value.trim();if(!value)return;
  if(!Array.isArray(state.messages[floatingId]))state.messages[floatingId]=[];
  state.messages[floatingId].push({mine:true,text:value.slice(0,300)});
  state.messages[floatingId]=state.messages[floatingId].slice(-50);
  input.value='';save();drawFloating();announce('Mensagem guardada somente neste navegador.');
 });
 wrap.append(head,note,history,form);document.body.append(wrap);
}
function drawFloating(){
 const person=personById(floatingId),log=q('#floating-history');
 if(!log||!person)return;
 q('#floating-name').textContent=person.name;
 log.replaceChildren();
 const messages=Array.isArray(state.messages[floatingId])?state.messages[floatingId]:[];
 if(!messages.length)log.append(make('p','empty','Nenhuma mensagem local ainda.'));
 for(const msg of messages){const bubble=make('div','floating-bubble'+(msg.mine?' mine':''));
 bubble.append(make('small','',msg.mine?'Você':person.name),make('span','',String(msg.text).slice(0,300)));log.append(bubble);}
 log.scrollTop=log.scrollHeight;
}
function openFloating(id){
 if(!personById(id))return;
 mountFloating();floatingId=id;
 const popup=q('#floating-chat');popup.hidden=false;
 drawFloating();q('#floating-input').focus();
}
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&floatingId){q('#floating-chat').hidden=true;floatingId=null;}});

})();