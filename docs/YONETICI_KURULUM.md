# Yönetici kurulumu ve veri akışı

## Vercel ayarları
Other preset; Root Directory `./`; Build Command boş; Output Directory `.`; Install Command `npm ci` (yeni PDF bağımlılıkları kurulmalıdır). Node.js 20 veya üstü.

Environment Variables:
- `GROQ_API_KEY`: sunucuda kullanılan üretim anahtarı. Önceki anahtar aynı şekilde kullanılabilir.
- `SCHOOL_ACCESS_CODE`: uzun ve tahmin edilmesi zor okul erişim kodu. Pilot okul paylaşımından önce ayarlayın.
- `APP_SESSION_SECRET`: erişim kodundan farklı, en az 32 rastgele karakter. Oturum imzalamak için önerilir.

Değişiklikten sonra yeni GitHub commit'ini deploy edin. Eski sürüme Redeploy yapmak yeni kodu almayabilir; son commit'i kontrol edin.

`SCHOOL_ACCESS_CODE` ayarlanmamışsa mevcut kurulum bozulmasın diye panel açıktır. Bu bir güvenlik özelliğinin aktif olduğu anlamına gelmez. Kod tanımlanınca üretim ve PDF uçları oturum ister. Oturum 8 saatlik, HttpOnly ve SameSite=Strict çerezidir; Vercel'de Secure olarak ayarlanır. Paylaşılan kod bireysel kullanıcı hesabı değildir. Vercel Firewall tarafında giriş ve üretim uçlarına kullanım sınırlaması ayrıca yapılandırılmalıdır; uygulama dağıtık kota sistemi içermez.

## Veri akışı
Öğretmen konu/not/kaynak görseli -> sunucunun üretim uç noktası -> Groq -> soru taslağı -> öğretmen tarayıcısı. API anahtarı tarayıcıya gönderilmez. Öğrenci ad alanları PDF'de boş basılır; öğrenci listesi tutulmaz.

PDF oluşturmak için test soruları sunucudaki PDF uç noktasına gönderilir. Bu adım dış yapay zekâ sağlayıcısına istek göndermez. PDF bellekte oluşturulur; uygulama dosyayı veritabanına kaydetmez. Barındırma ve dış servislerin veri/log politikaları ayrıca değerlendirilmeli; “hiçbir yerde veri tutulmaz” iddiası kullanılmamalıdır.

Yerel taslaklar localStorage içindedir. Çıkış yapmak yerel taslakları silmez. Aynı cihazdaki kişiler taslakları açabilir. Kimliği belirli öğrenci verisi yüklenmemelidir. Okulun veri sorumlusu/BT yetkilisi dış servis kullanımı, saklama, erişim ve açıklama gereksinimlerini onaylamalıdır. Bu proje resmî uyumluluk sertifikası veya hukuk görüşü sağlamaz.

## Ücretsiz kullanım ve giderler
Barbaros okul için lisans veya kullanım ücreti talep etmez. Dış hizmet ve sunucu kullanımının gideri ayrı konudur. Yönetici sağlayıcı hesaplarında bütçe/limit belirlemeli; okul içi kullanım büyümeden önce gider sorumluluğunu netleştirmelidir. Sınırsız ücretsiz üretim vaadi verilmez.

## Üretim öncesi yapılacaklar
1. Giriş kodu ve oturum sırrını ayarla; erişimi farklı tarayıcıda test et.
2. Harcama ve hız limitlerini hesap yönetiminden ayarla.
3. Okulun dış servis ve logo kullanım kararını al.
4. Pilot kabul testlerini gerçek cihazlarda tamamla.
5. Destek sorumlusunu, yedekleme ve güncelleme sürecini yazılı belirle.
6. Okul çapı kullanım için bireysel kullanıcılar, ortak kayıt bankası ve gerektiğinde denetim izi planla; bu sürümde varmış gibi sunma.
