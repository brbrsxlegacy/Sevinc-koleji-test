# Google Sites ve Google araması

Google Sites arka uç kodunu çalıştırmaz; öğretmen paneli Vercel’de kalır. Google Sites tanıtım sayfasında panel bağlantısı kullanın. Giriş çerezleri ve mobil PDF için paneli ayrı sekmede açmak en sorunsuz akıştır.

1. Vercel’de bu commit’in dağıtımını tamamlayın ve çalışan site adresini alın.
2. Google Sites’ta yeni site oluşturun. Başlık: “Sevinç Test Atölyesi”. `tanitim.html` içindeki tanıtım metinlerini ve özellikleri kullanın. Kurum onayı olmadan resmi okul sitesi olarak sunmayın.
3. “Ekle → Düğme” ile “Öğretmen girişi” ekleyin. Bağlantı: `https://VERCEL-ADRESINIZ/panel`. Yeni sekmede açın. Tanıtım bölümünü gömmek isterseniz “Ekle → Yerleştir”e Vercel ana adresini girin; giriş panelini iframe içine gömmek yerine bağlantı kullanın.
4. “Yayınla” ile sites.google.com/view/... adresini seçin. Yayınlanan siteyi herkes görüntüleyebilsin. “Herkese açık arama motorlarının sitemi göstermemesini iste” ayarını işaretlemeyin.
5. Search Console’a sahip olduğunuz yayın adresini ekleyip sahiplik doğrulamasını tamamlayın; kullanılabilir olduğunda URL Denetimi üzerinden indeksleme isteyin. Google’ın taraması ve sonuçlara eklemesi anlık veya garanti değildir.

Hazır Vercel ana sayfasında Türkçe başlık, açıklama, sosyal paylaşım metni ve index/follow bulunur. Panelde noindex vardır; asıl erişim koruması sunucudaki hesap denetimidir. Depodaki alan adına göre canonical, robots.txt ve sitemap.xml `https://sevinc-koleji-test.vercel.app/` adresine ayarlandı. Gerçek yayın adresi değişirse bu üç yerde de değiştirin. Next.js için eklenen app/sitemap.ts ve app/robots.ts bu düz HTML/Node projesinde çalışmaz; kökteki statik dosyalar kullanılır. Google doğrulama HTML dosyası korunmuştur.

Google Sites hesabında site oluşturma/yayınlama bu değişiklikle yapılmış sayılmaz; hesap erişimi ve yayın adresi gerekir.

Kaynaklar: https://support.google.com/sites/answer/6372880?hl=tr ve https://support.google.com/sites/answer/90569?hl=tr
