import {generate} from '../lib/groq.mjs';
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'POST kullanın.'});
  if(req.headers.origin && new URL(req.headers.origin).host!==req.headers.host)return res.status(403).json({error:'İstek kaynağı uygun değil.'});
  try {return res.status(200).json(await generate(typeof req.body==='string'?JSON.parse(req.body):req.body));}
  catch(e){return res.status(400).json({error:e.name==='TimeoutError'?'Groq yanıtı gecikti. Yeniden deneyin.':e.message});}
}
