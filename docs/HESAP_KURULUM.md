# Kişisel kodlu hesap kurulumu

Test hazırlama, düzenleme ve PDF indirme ücretsizdir. Günlük test sayısı sınırı yoktur. Aynı hesapta bir test hazırlanırken ikinci üretim bekler.

1. Supabase SQL Editor’da `database/accounts.sql` dosyasının tamamını çalıştırın. Önceki şemayı kurduysanız aynı dosyayı tekrar çalıştırın: `reserve_test` fonksiyonu günlük sınırı kaldıracak şekilde güncellenir. Mevcut hesaplar korunur.
2. Vercel ortam değişkenlerine `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, güçlü ve sabit `APP_SESSION_SECRET`, güçlü ve sabit `CODE_PEPPER` ekleyin. Sırları tarayıcıya, sohbete veya GitHub’a koymayın. Kodları korumak için bu sırları sonradan değiştirmeyin.
3. Supabase Auth’ta yönetici için e-posta/şifre hesabı oluşturun. `ADMIN_EMAILS` değişkenine yönetici e-postasını, `SCHOOL_ID` için `sevinc` yazın.
4. `CODE_ACCOUNTS_ENABLED=true` ayarlayıp yeniden dağıtın. Veritabanı kurulmadan bu seçeneği açmayın. Seçenek kapalıysa yalnız okul kodu 2026 ile mevcut erişim devam eder.
5. Öğretmen okul kodu 2026 ile “Yeni hesap oluştur”u kullanır. 12 haneli kişisel kod yalnız oluşturulduğunda gösterilir; öğretmen güvenle saklar.
6. Yönetici 2026 okul kodu ve e-posta/şifresiyle “Yönetici girişi” yapar. Yönetici ekranında ilgili öğretmene erişim verir. Öğretmen artık okul kodu ve kişisel koduyla giriş yapabilir.

Tablolar RLS ile korunur; tarayıcı rolleri tablolara doğrudan erişemez. Kodlar HMAC özetiyle saklanır. Oturum çerezi HttpOnly’dir. Giriş denemeleri sunucuda sınırlanır. Taslaklar hâlâ cihaz tarayıcısında tutulur.

Kontrol: yönetici onayından önce giriş reddedilmeli; onaydan sonra giriş ve test üretimi çalışmalı; ondan fazla test oluşturulabilmeli; erişimi kapatılan hesap tekrar kullanılamamalı.
