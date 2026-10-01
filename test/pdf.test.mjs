import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createTestPdf} from '../lib/pdf.mjs';
import {PDFDocument} from 'pdf-lib';
const q={text:'Sıcaklık −4 °C iken 9 °C artarsa kaç olur?',options:['−13','−5','5','13'],answer:2,explanation:'−4 + 9 = 5',image:'',chart:null};
test('creates independent multipage exam and answer PDFs',async()=>{const base={questions:Array.from({length:20},()=>q),settings:{title:'Türkçe karakter testi: ı İ ş Ş ğ Ğ',grade:'7. sınıf',subject:'Matematik'}};const exam=await PDFDocument.load(await createTestPdf({...base,kind:'exam'}));const key=await PDFDocument.load(await createTestPdf({...base,kind:'answers'}));assert.ok(exam.getPageCount()>1);assert.ok(key.getPageCount()>=1);assert.match(exam.getTitle(),/Türkçe/);assert.match(key.getTitle(),/Cevap anahtarı/)});
test('rejects incomplete questions and non-image data',async()=>{await assert.rejects(createTestPdf({kind:'exam',questions:[{...q,options:['','','','']}]}),/Boş soru/);await assert.rejects(createTestPdf({kind:'exam',questions:[{...q,image:'https://untrusted.test/a.png'}]}),/PNG veya JPEG/)});
