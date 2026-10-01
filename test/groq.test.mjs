import {test} from 'node:test';
import assert from 'node:assert/strict';
import {generate,validateQuestions} from '../lib/ai.mjs';
const q={text:'2+2 kaçtır?',options:['1','2','3','4'],answer:3,explanation:'2+2=4',usesImage:false,chart:null};
process.env.GROQ_API_KEY='gsk_server_test';
const body={key:'gsk_test',subject:'Matematik',grade:'7. sınıf',topic:'Tam sayılar',difficulty:'Orta',notes:'',count:1};
test('rejects invalid answers and missing questions',()=>{assert.throws(()=>validateQuestions({questions:[{...q,answer:7}]},1));assert.throws(()=>validateQuestions({questions:[]},1));assert.equal(validateQuestions({questions:[q]},1)[0].answer,3)});
test('uses vision model and image when supplied',async()=>{let sent;const result=await generate({...body,image:'data:image/png;base64,YQ=='},async(url,options)=>{sent=JSON.parse(options.body);return new Response(JSON.stringify({choices:[{message:{content:JSON.stringify({questions:[q]})}}]}))});assert.equal(sent.model,'qwen/qwen3.8-27b');assert.equal(sent.messages[0].content[1].type,'image_url');assert.equal(result.questions.length,1)});
test('reports authentication and rate limits without exposing key',async()=>{await assert.rejects(generate(body,async()=>new Response('',{status:401})),/bağlantısı doğrulanamadı/);await assert.rejects(generate(body,async()=>new Response('',{status:429})),/kapasitesi dolu/)});
test('rejects malformed model output',async()=>{await assert.rejects(generate(body,async()=>new Response(JSON.stringify({choices:[{message:{content:'not-json'}}]}))),/uygun biçimde/)});

test('uses current text model and server secret without explicit client key',async()=>{const previous=process.env.GROQ_API_KEY;process.env.GROQ_API_KEY='gsk_server_test';try{let sent,auth;await generate({...body,key:''},async(url,options)=>{sent=JSON.parse(options.body);auth=options.headers.Authorization;return new Response(JSON.stringify({choices:[{message:{content:JSON.stringify({questions:[q]})}}]}))});assert.equal(sent.model,'qwen/qwen3.8-27b');assert.equal(auth,'Bearer gsk_server_test');}finally{if(previous===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=previous;}});
