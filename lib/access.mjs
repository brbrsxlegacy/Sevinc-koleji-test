import {accountMode,currentUser,authRequest,role,accountCookie} from './accounts.mjs';
import {createHmac,timingSafeEqual} from 'node:crypto';
export function sameOrigin(req){try{return !req.headers.origin||new URL(req.headers.origin).host===req.headers.host;}catch{return false}}
const equal=(a,b)=>{const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)};
const sign=value=>createHmac('sha256',process.env.APP_SESSION_SECRET||process.env.SCHOOL_ACCESS_CODE||'local').update(value).digest('base64url');
export function isAllowed(req){if(accountMode())return currentUser(req).then(Boolean);if(!process.env.SCHOOL_ACCESS_CODE)return true;const raw=String(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('school_session='))?.slice(15);if(!raw)return false;const [expiry,sig]=raw.split('.');return /^\d+$/.test(expiry)&&Number(expiry)>Date.now()&&sig&&equal(sign(expiry),sig)}
export async function session(req,res){
 res.setHeader('Cache-Control','no-store');if(!sameOrigin(req))return res.status(403).json({error:'İstek kaynağı uygun değil.'});
 if(req.method==='GET'){const user=accountMode()?await currentUser(req):null;return res.status(200).json({required:accountMode()||!!process.env.SCHOOL_ACCESS_CODE,accounts:accountMode(),authenticated:await isAllowed(req),role:role(user)})}
 if(req.method==='DELETE'){res.setHeader('Set-Cookie',['school_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0','school_account=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0']);return res.status(200).json({ok:true})}
 if(req.method!=='POST')return res.status(405).json({error:'İstek yöntemi uygun değil.'});
 const value=typeof req.body?.code==='string'?req.body.code:'';
 if(accountMode()){
  if(!process.env.SCHOOL_ACCESS_CODE||!equal(value,process.env.SCHOOL_ACCESS_CODE))return res.status(401).json({error:'Giriş bilgileri doğru değil.'});
  try{const {email,password}=req.body||{};if(typeof email!=='string'||typeof password!=='string'||email.length>254||password.length>128)throw Error('E-posta ve şifre girin.');const data=await authRequest('/token?grant_type=password',{method:'POST',body:{email,password}});const user=await authRequest('/user',{token:data.access_token});if(!role(user))return res.status(403).json({error:'Bu hesaba okul yöneticisi henüz erişim vermedi.'});res.setHeader('Set-Cookie',`school_account=${encodeURIComponent(accountCookie(data.access_token))}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${Math.min(Number(data.expires_in)||3600,28800)}${process.env.VERCEL?'; Secure':''}`);return res.status(200).json({ok:true,role:role(user)})}catch(e){return res.status(401).json({error:e.message})}
 }
 if(!process.env.SCHOOL_ACCESS_CODE)return res.status(200).json({ok:true});if(!equal(value,process.env.SCHOOL_ACCESS_CODE))return res.status(401).json({error:'Okul erişim kodu doğru değil.'});const expiry=String(Date.now()+8*3600000);res.setHeader('Set-Cookie',`school_session=${expiry}.${sign(expiry)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${process.env.VERCEL?'; Secure':''}`);return res.status(200).json({ok:true})
}
