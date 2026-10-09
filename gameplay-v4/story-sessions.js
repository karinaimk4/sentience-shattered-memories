import {SAVE_KEY,newSave} from './engine.js';
const INDEX=SAVE_KEY+'-journeys';
const itemKey=id=>SAVE_KEY+'-journey-'+id;
function index(storage){try{const v=JSON.parse(storage.getItem(INDEX));if(v&&Array.isArray(v.items)&&v.items.length&&v.items.some(x=>x.id===v.active))return v;}catch{}return null;}
export function initializeSessions(storage){let v=index(storage);if(v)return v;const id='original',current=storage.getItem(SAVE_KEY),backup=storage.getItem(SAVE_KEY+'-backup');v={active:id,items:[{id,name:'Hành trình đầu tiên',created:Date.now(),updated:Date.now()}]};storage.setItem(itemKey(id),current||JSON.stringify(newSave()));if(backup)storage.setItem(itemKey(id)+'-backup',backup);storage.setItem(INDEX,JSON.stringify(v));return v;}
export function writeSession(storage,save){const v=initializeSessions(storage),key=itemKey(v.active),old=storage.getItem(key);if(old)storage.setItem(key+'-backup',old);storage.setItem(key,JSON.stringify(save));const current=v.items.find(x=>x.id===v.active);current.updated=Date.now();storage.setItem(INDEX,JSON.stringify(v));}
export function listSessions(storage){const v=initializeSessions(storage);return v.items.map(item=>{let save;try{save=JSON.parse(storage.getItem(itemKey(item.id)))}catch{}return {...item,active:item.id===v.active,checkpoint:save?.checkpoint?.m||0,level:save?.level||1,complete:save?.cleared?.includes(2000)||false};});}
export function createSession(storage,name){const v=initializeSessions(storage),id=crypto.randomUUID(),s=newSave();storage.setItem(itemKey(id),JSON.stringify(s));v.items.push({id,name:String(name||'Hành trình mới').trim().slice(0,60)||'Hành trình mới',created:Date.now(),updated:Date.now()});storage.setItem(INDEX,JSON.stringify(v));return selectSession(storage,id);}
export function selectSession(storage,id){const v=initializeSessions(storage);if(!v.items.some(i=>i.id===id))return false;const key=itemKey(id);let save,raw;for(const k of [key,key+'-backup'])try{const text=storage.getItem(k),candidate=JSON.parse(text);if(candidate?.version===4&&candidate.checkpoint&&Array.isArray(candidate.weapons)){save=candidate;raw=text;break;}}catch{}if(!save)return false;const old=storage.getItem(SAVE_KEY);if(old)storage.setItem(itemKey(v.active),old);storage.setItem(SAVE_KEY,raw);storage.setItem(SAVE_KEY+'-backup',raw);v.active=id;storage.setItem(INDEX,JSON.stringify(v));return true;}
export function renameSession(storage,id,name){const v=initializeSessions(storage),item=v.items.find(x=>x.id===id);if(!item||!name.trim())return false;item.name=name.trim().slice(0,60);storage.setItem(INDEX,JSON.stringify(v));return true;}
function validSave(save){return !!(save&&save.version===4&&save.checkpoint&&Number.isFinite(save.checkpoint.m)&&Array.isArray(save.weapons)&&Array.isArray(save.cleared));}
export function exportSession(storage,id){
 const v=initializeSessions(storage),item=v.items.find(x=>x.id===id);if(!item)throw Error('Không tìm thấy hành trình để xuất.');
 const raw=id===v.active?storage.getItem(SAVE_KEY):storage.getItem(itemKey(id));let save;try{save=JSON.parse(raw)}catch{}
 if(!validSave(save))throw Error('Dữ liệu hành trình bị lỗi nên chưa thể xuất.');
 return {type:'sentience-shattered-memories-journey',format:1,exportedAt:new Date().toISOString(),journey:{name:item.name,created:item.created,updated:item.updated},save};
}
export function importSession(storage,payload){
 if(!payload||payload.type!=='sentience-shattered-memories-journey'||payload.format!==1||!validSave(payload.save))throw Error('File này không phải hành trình hợp lệ của Sentience.');
 const v=initializeSessions(storage),id=crypto.randomUUID(),baseName=String(payload.journey?.name||'Hành trình đã tải').trim().slice(0,52)||'Hành trình đã tải';
 const names=new Set(v.items.map(x=>x.name));let name=baseName,n=2;while(names.has(name))name=`${baseName} (${n++})`.slice(0,60);
 const now=Date.now();storage.setItem(itemKey(id),JSON.stringify(payload.save));v.items.push({id,name,created:Number(payload.journey?.created)||now,updated:now});storage.setItem(INDEX,JSON.stringify(v));
 if(!selectSession(storage,id))throw Error('Không thể mở hành trình vừa tải.');return id;
}
export function manualSaveKey(storage,slot){const v=initializeSessions(storage);return v.active==='original'?SAVE_KEY+'-manual-'+slot:itemKey(v.active)+'-manual-'+slot;}
