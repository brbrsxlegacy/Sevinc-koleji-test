import {profileUser,database,profileMode} from '../lib/profiles.mjs';
import {syncSubscription,billingReady} from '../lib/billing.mjs';
import {generate} from '../lib/ai.mjs';
import {isAllowed,sameOrigin} from '../lib/access.mjs';
export default async function handler(req,res){res.setHeader('Cache-Control','no-store');if(req.method!=='POST')return res.status(405).json({error:'İstek yöntemi uygun değil.'});if(!sameOrigin(req))return res.status(403).json({error:'İstek kaynağı uygun değil.'});let allowed=false;try{allowed=await isAllowed(req)}catch{return res.status(503).json({error:'Hesap doğrulanamadı. Yeniden deneyin.'})}if(!allowed)return res.status(401).json({error:'Okul erişim koduyla giriş yapın.'});let reservation;
try{
 if(profileMode()){const p=await profileUser(req);if(!p)throw Error('Kişisel hesabınızla giriş yapın.');if(p.subscription_ref){if(!billingReady())throw Error('Abonelik doğrulama hizmeti bağlı değil.');await syncSubscription(p.subscription_ref)}const quota=await database('rpc/reserve_test',{method:'POST',body:{p_account:p.id}});if(!quota.allowed)return res.status(429).json({error:quota.busy?'Bir test zaten hazırlanıyor. Bitmesini bekleyin.':'Bugünkü 10 ücretsiz test hakkınız doldu. Plus planı aylık 50 TL.',limitReached:!quota.busy});reservation=quota.reservation}
 const data=await generate(typeof req.body==='string'?JSON.parse(req.body):req.body);if(reservation)await database('test_usage?id=eq.'+reservation,{method:'PATCH',body:{state:'success'}});return res.status(200).json(data)
}catch(e){if(reservation){try{await database('test_usage?id=eq.'+reservation,{method:'PATCH',body:{state:'failed'}})}catch{}}return res.status(400).json({error:e.name==='TimeoutError'?'Soruların hazırlanması gecikti. Yeniden deneyin.':e.message})}}
