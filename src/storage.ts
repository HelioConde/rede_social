import { starterData } from './data';
import type { SocialData } from './types';

const DB_NAME = 'rede-jovem-demo';
const STORE = 'state';
const DATA_KEY = 'app-v1';
export const newId = () => crypto.randomUUID();
function dbOpen(): Promise<IDBDatabase> {
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,1);
    req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE)};
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
export async function loadState(): Promise<SocialData> {
  try {
    const db=await dbOpen();
    const saved=await new Promise<unknown>((resolve,reject)=>{
      const tx=db.transaction(STORE,'readonly');
      const req=tx.objectStore(STORE).get(DATA_KEY);
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
    db.close();
    return isValidState(saved)?saved:starterData();
  } catch(e) {
    console.warn('Armazenamento indisponível; sessão temporária.',e);
    return starterData();
  }
}
export async function saveState(data:SocialData):Promise<void> {
  const db=await dbOpen();
  try {
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).put(data,DATA_KEY);
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error);
    });
  } finally {db.close();}
}
export function isValidState(value:unknown):value is SocialData {
  if(!value||typeof value!=='object')return false;
  const v=value as Partial<SocialData>;
  return v.version===1 && typeof v.activeId==='string' &&
   Array.isArray(v.profiles) && Array.isArray(v.posts) &&
   Array.isArray(v.friendships) && Array.isArray(v.messages) &&
   v.profiles.length<=100 && v.posts.length<=2000 && v.messages.length<=10000 &&
   v.profiles.every(p=>p&&typeof p.id==='string'&&typeof p.name==='string') &&
   v.posts.every(p=>p&&typeof p.id==='string'&&typeof p.body==='string') &&
   v.messages.every(m=>m&&typeof m.body==='string') &&
   (v.faithFavorites===undefined||(Array.isArray(v.faithFavorites)&&v.faithFavorites.length<=100&&v.faithFavorites.every(x=>typeof x==='string'))) &&
   (v.gratitudeNotes===undefined||(Array.isArray(v.gratitudeNotes)&&v.gratitudeNotes.length<=100&&v.gratitudeNotes.every(x=>x&&typeof x.id==='string'&&typeof x.body==='string'&&x.body.length<=400&&typeof x.createdAt==='number'))) &&
   (v.readingProgress===undefined||(v.readingProgress!==null&&typeof v.readingProgress==='object'&&!Array.isArray(v.readingProgress)&&Object.entries(v.readingProgress).length<=12&&
     Object.entries(v.readingProgress).every(([key,val])=>key.length<=60&&Array.isArray(val)&&val.length<=30&&val.every(id=>typeof id==='string'&&id.length<=90)))) &&
   (v.savedPostIds===undefined||(v.savedPostIds!==null&&typeof v.savedPostIds==='object'&&!Array.isArray(v.savedPostIds)&&
     Object.entries(v.savedPostIds).length<=100&&
     Object.entries(v.savedPostIds).every(([user,ids])=>user.length<=128&&Array.isArray(ids)&&ids.length<=2000&&ids.every(id=>typeof id==='string'&&id.length<=128))));
}
export function downloadBackup(data:SocialData) {
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='rede-jovem-backup.json';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export async function imageToDataUrl(file:File):Promise<string> {
  if(!file.type.startsWith('image/')||file.size>5*1024*1024)throw Error('Selecione uma imagem de até 5 MB.');
  const bitmap=await createImageBitmap(file);
  const scale=Math.min(1,1200/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(bitmap.width*scale));
  canvas.height=Math.max(1,Math.round(bitmap.height*scale));
  const ctx=canvas.getContext('2d');
  if(!ctx)throw Error('Não foi possível processar a imagem.');
  ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg',0.78);
}
