import {createHmac,randomInt,randomUUID,timingSafeEqual} from 'node:crypto';
export const profilesReady=()=>!!(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY&&process.env.APP_SESSION_SECRET);
export const profileMode=()=>process.env.CODE_ACCOUNTS_ENABLED==='true';
export const hashCode=code=>createHmac('sha256',process.env.CODE_PEPPER||process.env.APP_SESSION_SECRET).update('account:'+code).digest('hex');
const sign=value=>createHmac('sha256',process.env.APP_SESSION_SECRET).update('profile:'+value).digest('base64url');
export async function database(path,{method='GET',body,prefer='return=representation'}={}){
 if(!profilesReady())throw Error('Kişisel hesap sistemi henüz yönetici tarafından etkinleştirilmedi.');
 const r=await fetch(process.env.SUPABASE_URL.replace(/\/$/,'')+'/rest/v1/'+path,{method,headers:{apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,Authorization:'Bearer '+process.env.SUPABASE_SERVICE_ROLE_KEY,'Content-Type':'application/json',Prefer:prefer},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(15000)});
 if(!r.ok)throw Error('Hesap/kullanım bilgisi okunamadı. Okul yöneticinize bildirin.');return r.status===204?null:r.json();
}
export function profileCookie(id){const value=id+'.'+(Date.now()+8*3600000);return 'teacher_profile='+value+'.'+sign(value)+'; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800'+(process.env.VERCEL?'; Secure':'')}
export async function profileUser(req){if(!profilesReady())return null;const raw=String(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('teacher_profile='))?.slice(16);if(!raw)return null;const [id,expiry,sig]=raw.split('.');if(!/^[a-f0-9-]{36}$/.test(id)||!/^\d+$/.test(expiry)||Number(expiry)<Date.now()||!sig)return null;const expected=Buffer.from(sign(id+'.'+expiry)),actual=Buffer.from(sig);if(expected.length!==actual.length||!timingSafeEqual(expected,actual))return null;const [p]=await database('teacher_profiles?id=eq.'+id+'&select=*');return p?.active?p:null}
export async function createProfile(name){if(!profilesReady())throw Error('Kişisel hesap sistemi henüz bağlanmadı.');const code=String(randomInt(0,1e12)).padStart(12,'0');const [p]=await database('teacher_profiles',{method:'POST',body:{id:randomUUID(),name,active:false,code_hash:hashCode(code)}});return {profile:p,code}}
export async function usage(p){const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());const rows=await database('test_usage?account_id=eq.'+p.id+'&day=eq.'+day+'&state=eq.success&select=state');const used=rows.length;return {used,name:p.name,id:p.id}}
