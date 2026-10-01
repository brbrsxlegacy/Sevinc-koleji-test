import {PDFDocument,rgb} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import {gunzipSync} from 'node:zlib';
import {readFile} from 'node:fs/promises';
const W=595.28,H=841.89,M=42,WIDTH=W-2*M;
const navy=rgb(.09,.17,.28),orange=rgb(.96,.51,.13),grey=rgb(.36,.40,.47);
export async function createTestPdf(body){
 const {kind,settings={},questions}=body||{};
 if(!['exam','answers'].includes(kind)||!Array.isArray(questions)||!questions.length||questions.length>100)throw Error('PDF için 1-100 soru seçin.');
 for(const q of questions){if(!q||typeof q.text!=='string'||!q.text.trim()||q.text.length>6000||!Array.isArray(q.options)||q.options.length!==4||q.options.some(x=>typeof x!=='string'||!x.trim()||x.length>2000)||!Number.isInteger(q.answer)||q.answer<0||q.answer>3||typeof q.explanation!=='string'||q.explanation.length>6000)throw Error('Boş soru ve seçenekleri doldurun; doğru cevapları kontrol edin.');}
 const doc=await PDFDocument.create();doc.registerFontkit(fontkit);
 const [normalBytes,boldBytes,logoBytes]=await Promise.all(['DejaVuSans.ttf.gz','DejaVuSans-Bold.ttf.gz'].map(f=>readFile(new URL('../assets/fonts/'+f,import.meta.url))).concat(readFile(new URL('../assets/sevinc-college.png',import.meta.url))));
 const font=await doc.embedFont(gunzipSync(normalBytes),{subset:true}),bold=await doc.embedFont(gunzipSync(boldBytes),{subset:true}),logo=await doc.embedPng(logoBytes);
 const size=body.fontSize===16?12:10.5,line=size*1.6;
 const title=typeof settings.title==='string'?settings.title.slice(0,150):'Değerlendirme testi';
 const subject=typeof settings.subject==='string'?settings.subject.slice(0,100):'',grade=typeof settings.grade==='string'?settings.grade.slice(0,30):'';
 function safe(s){return String(s).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/\t/g,' ');}
 function wrap(text,width,f=font,n=size){const out=[];for(const para of safe(text).split('\n')){let cur='';for(const word of para.split(/\s+/)){if(!word)continue;const candidate=cur?cur+' '+word:word;if(f.widthOfTextAtSize(candidate,n)<=width){cur=candidate;continue;}if(cur){out.push(cur);cur='';}let part='';for(const char of word){if(f.widthOfTextAtSize(part+char,n)>width&&part){out.push(part);part='';}part+=char;}cur=part;}out.push(cur);}return out;}
 let page,y;let pageIndex=0;
 function text(str,x,pos,n=size,f=font,color=navy){page.drawText(safe(str),{x,y:pos,size:n,font:f,color});}
 function center(str,pos,n,f=font){text(str,M+(WIDTH-f.widthOfTextAtSize(str,n))/2,pos,n,f);}
 function newPage(){page=doc.addPage([W,H]);pageIndex++;page.drawRectangle({x:M,y:H-78,width:WIDTH,height:44,color:navy});const lw=205,lh=lw*logo.height/logo.width;page.drawImage(logo,{x:(W-lw)/2,y:H-55-lh/2,width:lw,height:lh});y=H-102;for(const t of wrap(kind==='answers'?title+' - Cevap anahtarı':title,WIDTH,bold,14)){center(t,y,14,bold);y-=20;}center([subject,grade,questions.length+' soru'].filter(Boolean).join(' · '),y,9);y-=14;page.drawLine({start:{x:M,y},end:{x:W-M,y},thickness:1.5,color:orange});y-=22;if(kind==='exam'&&pageIndex===1){text('Ad Soyad: __________________________________',M,y,9);text('Sınıf / No: ______________',W-190,y,9);y-=23;text('Tarih: ___________________',M,y,9);text('Puan: _________________',W-190,y,9);y-=25;}else y-=4;}
 function ensure(h){if(y-h<60)newPage();}
 function lines(str,width=WIDTH,x=M,f=font,n=size){for(const t of wrap(str,width,f,n)){ensure(n*1.6);text(t,x,y,n,f);y-=n*1.6;}}
 newPage();
 if(kind==='answers'){
  lines('Öğretmen nüshası - öğrencilerle paylaşılmamalıdır.',WIDTH,M,font,9);y-=10;
  for(let i=0;i<questions.length;i++){ensure(26);text((i+1)+'. '+String.fromCharCode(65+questions[i].answer),M+(i%5)*100,y,11,bold);if(i%5===4||i===questions.length-1)y-=26;}
  y-=12;for(let i=0;i<questions.length;i++){if(!questions[i].explanation.trim())continue;ensure(60);lines((i+1)+'. '+String.fromCharCode(65+questions[i].answer)+' - Açıklama',WIDTH,M,bold);lines(questions[i].explanation);y-=14;}
 }else{
  for(let i=0;i<questions.length;i++){
   const q=questions[i];let image=null,iw=0,ih=0;
   if(q.image){if(typeof q.image!=='string'||q.image.length>3500000||!/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(q.image))throw Error('Soru görsellerini PNG veya JPEG olarak yükleyin.');const bytes=Buffer.from(q.image.split(',')[1],'base64');try{image=q.image.startsWith('data:image/png')?await doc.embedPng(bytes):await doc.embedJpg(bytes);}catch{throw Error('Bir soru görseli okunamadı. Görseli yeniden yükleyin.');}const factor=Math.min(WIDTH/image.width,175/image.height,1);iw=image.width*factor;ih=image.height*factor;}
   const c=q.chart;let chart=null;if(c){if(typeof c.title!=='string'||!Array.isArray(c.labels)||!Array.isArray(c.values)||c.labels.length<2||c.labels.length>8||c.labels.length!==c.values.length||!c.labels.every(x=>typeof x==='string'&&x.length<=60)||!c.values.every(x=>typeof x==='number'&&Number.isFinite(x)&&x>=0))throw Error('Grafik verilerini kontrol edin.');chart=c;}
   const expected=wrap(q.text,WIDTH).length*line+q.options.reduce((n,o)=>n+wrap(o,WIDTH-20).length*line+5,0)+25+(image?ih+15:0)+(chart?180:0);
   // Keep normal questions together; long questions flow without clipping.
   ensure(Math.min(expected,470));lines((i+1)+'. '+q.text,WIDTH,M,bold);y-=5;
   if(image){ensure(ih+15);page.drawImage(image,{x:M+(WIDTH-iw)/2,y:y-ih,width:iw,height:ih});y-=ih+15;}
   if(chart){const labelLines=chart.labels.map(x=>wrap(x,(WIDTH-24)/chart.labels.length-4,font,8));const labelH=Math.max(...labelLines.map(x=>x.length))*11;ensure(158+labelH);lines(chart.title,WIDTH,M,bold,10);const base=y-110;const max=Math.max(...chart.values,1),step=(WIDTH-24)/chart.values.length;chart.values.forEach((v,j)=>{const barH=v/max*80;const x=M+12+j*step;page.drawRectangle({x:x+step*.2,y:base,width:step*.6,height:barH,color:orange});text(String(v),x+step*.25,base+barH+5,8);labelLines[j].forEach((t,k)=>text(t,x+2,base-14-k*11,8));});y=base-labelH-22;}
   q.options.forEach((o,j)=>{lines(String.fromCharCode(65+j)+') '+o,WIDTH-18,M+18);y-=4;});y-=12;
   page.drawLine({start:{x:M,y:y+4},end:{x:W-M,y:y+4},thickness:.5,color:rgb(.85,.88,.92)});y-=18;
  }
 }
 const pages=doc.getPages();pages.forEach((p,i)=>{page=p;p.drawLine({start:{x:M,y:42},end:{x:W-M,y:42},thickness:.5,color:rgb(.85,.88,.92)});text([subject,grade].filter(Boolean).join(' · '),M,27,8,font,grey);text((i+1)+' / '+pages.length,W-M-40,27,8,font,grey);});doc.setTitle(title+(kind==='answers'?' - Cevap anahtarı':''));doc.setAuthor('Test Atölyesi');return doc.save();
}
