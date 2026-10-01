import http from 'node:http';
import {readFile} from 'node:fs/promises';
import generateHandler from './api/generate.mjs';
import pdfHandler from './api/pdf.mjs';
import sessionHandler from './api/session.mjs';
const port=Number(process.env.PORT||3000);
const handlers={'/api/generate':generateHandler,'/api/pdf':pdfHandler,'/api/session':sessionHandler};
http.createServer(async(req,res)=>{
 res.status=n=>{res.statusCode=n;return res};res.json=data=>{res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(data));return res};res.send=data=>{res.end(data);return res};
 try{
  if(handlers[req.url]){if(req.method==='POST'){let data='';for await(const chunk of req){data+=chunk;if(Buffer.byteLength(data)>4000000)return res.status(413).json({error:'Görsellerin toplam boyutu çok büyük. Daha küçük görseller kullanın.'})}try{req.body=JSON.parse(data)}catch{return res.status(400).json({error:'İstek okunamadı.'})}}await handlers[req.url](req,res);return;}
  if(req.method==='GET'&&['/assets/sevinc-college.png','/assets/learning-studio.webp'].includes(req.url)){res.setHeader('Content-Type',req.url.endsWith('.png')?'image/png':'image/webp');res.end(await readFile(new URL('.'+req.url,import.meta.url)));return;}
  if(req.method==='GET'&&(req.url==='/'||req.url==='/index.html')){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(await readFile(new URL('./index.html',import.meta.url)));return;}
  res.status(404).json({error:'Bulunamadı.'});
 }catch{if(!res.headersSent)res.status(500).json({error:'İşlem tamamlanamadı. Yeniden deneyin.'});else res.end();}
}).listen(port,'127.0.0.1',()=>console.log(`Test Atölyesi: http://localhost:${port}`));
