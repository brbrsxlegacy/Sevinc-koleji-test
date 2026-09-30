import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {generate} from './lib/groq.mjs';
const port=Number(process.env.PORT||3000);
http.createServer(async(req,res)=>{
  const json=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
  if(req.url==='/api/generate' && req.method==='POST'){
    if(req.headers.origin && new URL(req.headers.origin).host!==req.headers.host)return json(403,{error:'İstek kaynağı uygun değil.'});
    try{let text='';for await(const chunk of req){text+=chunk;if(text.length>4000000)return json(413,{error:'Görsel çok büyük.'});}json(200,await generate(JSON.parse(text)));}catch(e){json(400,{error:e.name==='TimeoutError'?'Groq yanıtı gecikti. Yeniden deneyin.':e.message});}return;
  }
  if(req.method==='GET' && ['/assets/sevinc-college.png','/assets/learning-studio.webp'].includes(req.url)){try{res.writeHead(200,{'Content-Type':req.url.endsWith('.png')?'image/png':'image/webp'});res.end(await readFile(new URL('.'+req.url,import.meta.url)));}catch{res.end();}return;}
  if(req.method==='GET' && (req.url==='/'||req.url==='/index.html')){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(new URL('./index.html',import.meta.url)));return;}
  res.writeHead(404);res.end('Bulunamadı');
}).listen(port,'127.0.0.1',()=>console.log(`Sevinç Test Atölyesi: http://localhost:${port}`));
