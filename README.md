# Sevinç Test Atölyesi

Barbaros'un okula ücretsiz sunmak için geliştirdiği bağımsız öğretmen test hazırlama projesi. Okulun resmî sistemi olduğu iddia edilmez.

## Mevcut özellikler
Konu/sınıf/zorluk seçimiyle soru hazırlama, kaynak görseli ve veri grafikleri, düzenleme ve şık seçimi, yukarı/aşağı sıralama, taslak yedekleme, mobil ayarlar.

**Öğrenci testi PDF** ve **cevap anahtarı PDF** farklı dosyalardır. Öğrenci bilgileri yalnızca ilk test sayfasındadır. Logo ve sayfa numarası her sayfada bulunur. Türkçe fontlar gömülüdür. PDF indirirken yazdırma penceresi gerekmez. Öğretmen ekranında sağlayıcı adı veya API anahtarı girişi yoktur.

## Çalıştırma
Node.js 20+: `npm ci`, ardından `npm start`. http://localhost:3000
Sunucuda `GROQ_API_KEY` ortam değişkeni bulunmalıdır. Anahtarı depoya koymayın. Vercel'de `npm ci` install command kullanın.

## Okul sunum paketi
- [Bir dakikalık anlatım ve canlı gösterim](docs/OKULA_SUNUM.md)
- [Öğretmen kullanım rehberi](docs/OGRETMEN_REHBERI.md)
- [Pilot planı, kabul senaryoları ve geri bildirim](docs/PILOT_VE_KABUL.md)
- [Yönetici kurulumu, erişim, veri akışı ve giderler](docs/YONETICI_KURULUM.md)

## Doğrulama
`npm test`: üretim yanıtı doğrulama, sunucu anahtarı, PDF içerik ayrımı, oturum kontrolleri ve arayüz kontrolleri.
Canlı üretim için çalışan servis hesabı gerekir. Okul pilotu ve gerçek cihaz kabul testleri henüz yapılmış kabul edilmez.

## Sınırlar
Taslaklar bu tarayıcıda saklanır; ortak okul soru bankası ve bireysel öğretmen hesapları yoktur. İsteğe bağlı okul erişim kodu ortak pilot erişimidir. AI çıktısı öğretmen onayı gerektirir. Lisans ücreti istenmez; barındırma/üretim giderleri yöneticiyle netleştirilmelidir.

Logo kaynağı: https://kolej.sevinc.k12.tr/wp-content/uploads/2024/01/Adsiz-tasarim-7-1400x201.png
İllüstrasyon: OpenAI Imagegen ile hazırlanmış turuncu/lacivert eğitim objeleri. Font lisansı: assets/fonts/LICENSE.txt

## Güncel erişim ve yayın

Ana sayfa tanıtımdır; öğretmen paneli `/panel` adresindedir. Mobil PDF hazırlandıktan sonra İndir/PDF aç veya Kaydet / paylaş seçeneğine dokunun. Yönetici hesapları için [kurulum](docs/YONETICI_KURULUM.md), Google Sites için [yayın rehberi](docs/GOOGLE_SITES.md). Hesap hizmeti bağlanmadan yönetici kontrollü giriş aktif değildir; eski okul kodu modu korunur.
