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

## Yönetici kontrollü öğretmen hesapları

Yalnız okul kodu modu eski kurulumlarla uyumluluk için korunur. İstenen kişilere erişim vermek için aşağıdaki hesap modunu etkinleştirin; sadece kodla giriş bu modda kapanır.

1. Supabase projesi oluşturun. Authentication ayarlarında herkese açık yeni kayıtları kapatın. Proje hesabını okul yöneticisi yönetmeli.
2. Vercel Environment Variables alanına `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SCHOOL_ACCESS_CODE`, `SCHOOL_ID=sevinc`, `ADMIN_EMAILS` ekleyin. Anahtar yalnız sunucuda kalır; başına NEXT_PUBLIC veya VITE eklemeyin. ADMIN_EMAILS yönetici e-postasıdır (birden çok yönetici virgülle ayrılır).
3. Supabase Authentication → Users → Add user ile yönetici hesabını ve güçlü şifresini oluşturun. E-postasının ADMIN_EMAILS ile aynı olması gerekir. Yönetici hesabının e-posta sahipliğini kurum içinde doğrulayın; uygulama e-posta göndermez.
4. Vercel’de yeniden dağıtım yapın. `/panel` adresinde okul kodu + yönetici e-postası + şifreyle giriş yapın.
5. Yönetici düğmesinden öğretmen e-postası ve en az 12 karakterli başlangıç şifresiyle hesap açın. Şifreyi ilgili öğretmene güvenli bir kanaldan iletin. Hesaplar Supabase’de kalıcıdır.
6. Öğretmen listesinde erişimi açın/kapatın. Kapatılan hesap her API isteğinde yeniden denetlendiği için eski oturumu da test/PDF üretmeye devam edemez.

Şifre unutulduğunda bu sürümde yönetici Supabase kullanıcı yönetiminden şifreyi yeniler. Oturum süresi dolunca kullanıcı yeniden giriş yapar. Sürekli yenileme veya otomatik e-posta daveti bu sürümde yoktur. Hesap anahtarlarından yalnız biri girilmişse hesap modu açık ama giriş kapalı kalır; iki alanı da tamamlayın.

## Sayfalar

- `/`: herkese açık, arama motorlarının tarayabileceği tanıtım sayfası.
- `/panel`: giriş isteyen öğretmen alanı. HTML ve API için indeksleme kapalı.
- Google Sites kurulumu: [GOOGLE_SITES.md](GOOGLE_SITES.md).

## Zorunlu okul kodu ve tema

Giriş artık ortam değişkeni boş olsa bile zorunludur. Güncel okul kodu kullanıcının talebiyle `2026` olarak `lib/school.mjs` içinde tanımlıdır; eski SCHOOL_ACCESS_CODE değeri bunu değiştirmez. Kod değişikliği bu dosyadan yapılır. Oturum imzası için APP_SESSION_SECRET kullanın; yoksa sunucudaki GROQ_API_KEY kullanılır. İkisi de yoksa geliştirme oturumu süreç başına rastgele imzalanır; kalıcı Vercel oturumları için APP_SESSION_SECRET ayarlayın. Hesap modu ayrıca öğretmen e-postası ve şifre ister.

Panel oturum denetlenene kadar gizlidir; kontrol başarısız olursa giriş açık kalır. Çıkış yap oturumu temizler. Açık/koyu tema düğmesi hem girişte hem panelde vardır; tercih bu cihazda saklanır. PDF çıktıları beyazdır.

## Güncel hesap ve fiyat modeli


Test hazırlama ve PDF indirme ücretsizdir. Kişisel kod hesapları için [hesap kurulumu](HESAP_KURULUM.md).
