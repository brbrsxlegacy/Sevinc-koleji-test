export function validateQuestions(data, count) {
  if (!Array.isArray(data?.questions) || data.questions.length !== count) throw new Error('Beklenen sayıda soru alınamadı. Yeniden deneyin.');
  return data.questions.map(q => {
    if (typeof q.text !== 'string' || !q.text.trim() || q.text.length > 6000 || !Array.isArray(q.options) || q.options.length !== 4 || q.options.some(o => typeof o !== 'string' || !o.trim()) || !Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3 || typeof q.explanation !== 'string') throw new Error('Soruların biçimi uygun değil. Yeniden deneyin.');
    const chart = q.chart && typeof q.chart.title === 'string' && Array.isArray(q.chart.labels) && Array.isArray(q.chart.values) && q.chart.labels.length >= 2 && q.chart.labels.length <= 8 && q.chart.labels.length === q.chart.values.length && q.chart.labels.every(x=>typeof x==='string') && q.chart.values.every(x=>typeof x==='number' && Number.isFinite(x) && x>=0) ? q.chart : null;
    return { text:q.text, options:q.options, answer:q.answer, explanation:q.explanation, usesImage:!!q.usesImage, chart };
  });
}
export async function generate(body, fetcher=fetch) {
  const {subject, grade, topic, difficulty, count, notes='', image='', visual=false}=body;
  const key = body.key || process.env.GROQ_API_KEY;
  if (typeof key !== 'string' || !key.startsWith('gsk_') || key.length > 250) throw new Error('Geçerli bir Groq API anahtarı girin.');
  if (!Number.isInteger(count) || count<1 || count>20 || ![subject,grade,topic,difficulty,notes].every(x=>typeof x==='string') || !topic.trim() || topic.length>2000 || notes.length>4000) throw new Error('Konu ve test ayarlarını kontrol edin.');
  if (image && (typeof image!=='string' || image.length>3500000 || !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(image))) throw new Error('Görsel biçimi veya boyutu uygun değil.');
  const prompt=`Türkçe bir öğretmen için ${count} özgün çoktan seçmeli soru üret. Ders: ${subject.slice(0,100)}. Sınıf: ${grade.slice(0,30)}. Konu: ${topic}. Zorluk: ${difficulty.slice(0,40)}. Öğretmen notu: ${notes}. Yaşa uygun, net, tek doğru cevaplı ve çözülebilir sorular olsun. Doğru şıkların yerlerini çeşitlendir. ${image?'Yüklenen görsele dayanan sorular da üret; yalnızca gerçekten görsele ihtiyaç duyan sorularda usesImage=true kullan. Görselde olmayan ayrıntıları uydurma.':''} ${visual?'Konu uygunsa en az bir soruya çözülebilir bir sütun grafiği ekle. Grafik sorusunda tüm gerekli veri chart içinde olsun. Konu grafiğe uygun değilse chart=null olsun.':''} Sadece JSON döndür: {"questions":[{"text":"soru","options":["A metni","B metni","C metni","D metni"],"answer":0,"explanation":"doğru cevabın gerekçesi","usesImage":false,"chart":null}]}. chart ya null ya da {"title":"başlık","labels":["etiket1","etiket2"],"values":[10,20]}. answer 0-3 arasında tam sayı. Sorular içinde HTML, SVG veya Markdown üretme.`;
  const content=image?[{type:'text',text:prompt},{type:'image_url',image_url:{url:image}}]:prompt;
  const response=await fetcher('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify({model:'qwen/qwen3.8-27b',messages:[{role:'user',content}],response_format:{type:'json_object'},temperature:0.6,max_completion_tokens:10000}),signal:AbortSignal.timeout(90000)});
  if (!response.ok) {if(response.status===401)throw new Error('Groq anahtarı kabul edilmedi.');if(response.status===404)throw new Error('Groq modeli bulunamadı veya hesabınızda erişilebilir değil. qwen/qwen3.8-27b model erişimini kontrol edin.');if(response.status===429)throw new Error('Groq kullanım sınırına ulaşıldı. Biraz sonra tekrar deneyin.');throw new Error(`Groq isteği tamamlanamadı (${response.status}). Model erişimini ve hesabınızı kontrol edin.`);}
  const result=await response.json();
  let parsed; try{parsed=JSON.parse(result.choices?.[0]?.message?.content);}catch{throw new Error('Groq geçerli bir test döndürmedi. Yeniden deneyin.');}
  return {questions:validateQuestions(parsed,count)};
}
