# Kişisel kodlar ve Sevinç Plus

Ücretsiz: İstanbul saatine göre her takvim gününde 10 başarılı AI test üretimi. Plus: aylık 50 TL; günlük 10 test sınırı kalkar. PDF indirme, düzenleme ve yedek alma ayrıca test hakkı tüketmez. Aynı hesapta tek üretim aynı anda çalışır. Başarısız üretim sayılmaz.

## Veritabanı ve hesaplar

1. Supabase SQL Editor'da `database/accounts-and-plans.sql` dosyasının tamamını çalıştırın. Tablolar RLS ile korunur; tarayıcıya tablo erişimi verilmez. Sayaç SQL fonksiyonunda satır kilidiyle uygulanır.
2. Vercel'e `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, rastgele en az 32 baytlık `APP_SESSION_SECRET` ve ayrı rastgele `CODE_PEPPER` girin. Bunlar yalnız sunucuda olmalı. CODE_PEPPER değişirse eski kodların doğrulanması durur; gizli değerleri sabit tutun.
3. `CODE_ACCOUNTS_ENABLED=true` (SQL ve anahtarlar tamamlandıktan sonra etkinleştirin). `APP_URL=https://sevinc-koleji-test.vercel.app` veya gerçek HTTPS alan adınız.
4. Okul kodu 2026. Kullanıcı “Yeni hesap oluştur” ile isim girer; kriptografik rastgele 12 haneli kişisel kod tek sefer gösterilir. Kod anahtar olduğu için paylaşılmamalı. Kodun yalnız HMAC özeti veritabanında saklanır. Kayıt sırasında kişi aktif değildir.
5. Önceki yönetici kurulumu geçerlidir: Supabase Auth'ta yönetici e-posta/şifresi oluşturun, ADMIN_EMAILS'e yazın. Panelde “Yönetici girişi” ile girip Yönetici düğmesinden yeni kod hesaplarına erişim verin. Hesap modu etkinleştirildiğinde eski ortak kod oturumu yeni kişisel hesabın günlük hakkını atlayamaz. Kurulumdan önce mevcut 2026 girişi korunur; kişisel sayaç ve ücretli model etkin değildir.
6. Taslaklar cihazda kişisel hesaba göre ayrı tutulur. Önceki ortak kod dönemindeki taslakları geçişten önce JSON yedekleyin; yeni hesabınızda Yedek aç ile aktarın.

Kişisel kod kaybolursa yönetici kurum içinde kimliği doğrulayıp hesabı kurtarma sürecini yönetir. Bu sürüm otomatik kod kurtarma veya e-postayla kod göndermez; kodları toplu olarak göremez. Erişimi kapanan kişinin eski oturumu da API'de reddedilir.

## iyzico — gerçek kart aboneliği

Bu repoya kod gönderilmesi ödeme hesabı açmaz veya canlıda para almaya başlamaz. Onaylı üye işyeri ve etkin abonelik ürünü gerekir; ödeme hesabını kurum/veliyle birlikte yönetin. API sırlarını sohbete veya repoya koymayın.

1. iyzico üye işyeri hesabında abonelik ürünü oluşturun. Bir ödeme planı: price=50, currencyCode=TRY, paymentInterval=MONTHLY, paymentIntervalCount=1, planPaymentType=RECURRING, trialPeriodDays=0. Oluşturulan referansı IYZICO_PLAN_REFERENCE'e girin.
2. Vercel değişkenleri: IYZICO_API_KEY, IYZICO_SECRET_KEY, IYZICO_PLAN_REFERENCE, APP_URL.
3. Önce IYZICO_BASE_URL=https://sandbox-api.iyzipay.com ile test hesabının anahtarları ve planıyla uçtan uca doğrulayın. Panel test ortamını açıkça gösterir; sandbox gerçek para toplamaz.
4. Canlı onaydan sonra canlı anahtar/plan kullanın ve IYZICO_BASE_URL=https://api.iyzipay.com yapın. Tekrar dağıtın.
5. iyzico bildirim adresi: APP_URL/api/payment-webhook. X-IYZ-SIGNATURE-V3 abonelik imzası özelliğini iyzico ile etkinleştirin. İmzasız bildirim reddedilir. Bildirim sonrası abonelik tekrar sağlayıcıdan sorgulanır; gelen gövdeye bakarak Plus açılmaz.
6. Callback APP_URL/api/payment-callback adresidir; checkout kimliği ve token saklanan hesapla eşleştirilir. Sunucu sonucu iyzico'dan sorgular. İstemcide payment=verified yazmak, sahte callback veya webhook ücretli plan açmaz.
7. Plus yalnız ilgili 50 TRY planın SUCCESS siparişindeki ödenmiş dönem için açılır. Her test ve plan görüntülemede abonelik yeniden denetlenir. Provider erişilemezse doğrulama hatası gösterilir.
8. Kullanıcı “Otomatik yenilemeyi iptal et” ile yenilemeyi durdurur; doğrulanmış ödenmiş dönem bitene kadar erişim korunur. Dönem bitince ücretsiz 10/gün planına döner. İptal ödeme iadesi değildir.

Fatura için ad, soyad, e-posta, telefon, kimlik ve adres iyzico'ya sunucudan gönderilir; uygulama bunları profiline kaydetmez. Kart numarası/CVC uygulama tarafından alınmaz; iyzico formunda işlenir. Üye işyeri bilgileri, destek/iptal iletişimi ve kurumun satış belgelerini canlıya geçmeden ödeme hesabınızla tamamlayın.

## Doğrulama listesi

- İki paralel ücretsiz üretim aynı hesabı iki kez tüketmesin; 11. üretim reddedilsin.
- İstanbul'da gece yarısı yeni hak açılsın; başarısız üretim hak tüketmesin.
- Sağlayıcı bağlantısı yokken ödeme başlamasın; yanlış fiyat/para birimi/deneme planı reddedilsin.
- Başarısız ödeme, bozuk imza ve tekrar gelen callback erişimi genişletmesin.
- Sandbox başarılı ödeme → Plus → yenileme → başarısız yenileme → iptal → dönem bitişi akışını gerçek sağlayıcı hesabında doğrulayın.

Yerel otomatik testler gerçek kart tahsilatını veya üye işyeri hesabını doğrulamaz. Canlı anahtarlar ve veritabanı bağlanmadan sistem canlı ücret toplayamaz.

Resmi kaynaklar:
- https://docs.iyzico.com/urunler/abonelik/abonelik-entegrasyonu/abonelik-islemleri
- https://docs.iyzico.com/urunler/abonelik/abonelik-entegrasyonu/odeme-plani
- https://docs.iyzico.com/ek-servisler/webhook
- https://docs.iyzico.com/on-hazirliklar/kimlik-dogrulama/hmacsha256-kimlik-dogrulama
