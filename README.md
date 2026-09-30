# Sevinç Koleji — Test Atölyesi

Öğretmenler için Türkçe, mobil uyumlu test hazırlama paneli. Bağımsız projedir; resmi okul hizmeti veya okul kimlik doğrulaması içermez.

## Özellikler
- Ders, 1–12. sınıf, kazanım, zorluk ve soru sayısıyla gerçek Groq üretimi.
- Görsel yükleyerek görsele dayalı soru hazırlama; uygun konularda veri grafikleri.
- Soru ve şık düzenleme, doğru cevap seçimi, açıklamalı cevap anahtarı.
- Soru kopyalama, sıralama ve silme; her soruya ayrı görsel ekleme.
- A4 sınav önizleme; cevap anahtarı ayrı sayfada; tarayıcıdan yazdırma veya PDF kaydetme.
- Bu tarayıcıda taslak kaydetme, JSON içe/dışa aktarma.
- Groq anahtarı yalnızca oturum belleğinde tutulur; hiçbir dosyaya veya localStorage'a yazılmaz.

## Bilgisayarda çalıştırma
Node.js 20 veya üstünü kurun. Depoyu indirin; klasörde `npm start` çalıştırın. `http://localhost:3000` adresini açın. Windows'ta `Baslat.bat` kullanılabilir. Bağımlılık kurulumu gerekmez.

Groq bağlantısı düğmesinden kendi `gsk_...` anahtarınızı girin. https://console.groq.com/keys üzerinden oluşturabilirsiniz. Test üretimi için konu, notlar ve yüklenen kaynak görsel Groq'a gönderilir. API anahtarını GitHub'a eklemeyin.

## Vercel üzerinden yayınlama
Bu GitHub deposunu Vercel'e aktarın. Framework Preset: **Other**, Build Command boş, Output Directory `.`. `api/generate.mjs` Node sunucusuz işlev olarak çalışır. Her öğretmen kendi Groq anahtarını panelde girer; ortak servis anahtarı gerekli değildir. Vercel planının süre sınırı uzun üretimleri etkileyebilir.

GitHub deposuna kod yüklemek siteyi otomatik yayınlamaz. GitHub Pages tek başına sunucu işlevini çalıştıramaz. Sunucuya ihtiyaç duyan üretim için Vercel veya Node.js kullanın.

## Modeller ve kontroller
Metin: `llama-3.3-70b-versatile`; kaynak görselli istek: `qwen/qwen3.8-27b`. Modellerin erişimi Groq hesabına bağlıdır. https://console.groq.com/docs/vision ve https://console.groq.com/docs/text-chat

`npm test` ile Groq yanıt doğrulaması ve hata akışları kontrol edilir. Gerçek anahtar olmadan canlı model doğrulaması yapılamaz. Soruları ve cevap anahtarını dağıtmadan önce öğretmen kontrol etmelidir. Okul hesapları veya ortak bulut soru bankası bulunmaz; kayıtlar bu tarayıcıya aittir.
