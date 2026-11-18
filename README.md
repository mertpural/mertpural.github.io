# mert@portfolio

Mert Pural'ın portfolyosu: içinde gezilebilen piksel bir oda ve odadaki bilgisayarın içinde Mac'e benzeyen bir masaüstü. Canlı adres: https://mertpural.github.io

## Nasıl çalışır

Derleme adımı yok; düz HTML + ES modülleri. Oda tek bir piksel resimdir; üstüne tıklanabilir alanlar, kedi, portre, QR tablosu ve ışıklı ekran WebGL ile işlenir.

| Dosya | Ne işe yarar |
|---|---|
| `js/content.js` | **Tüm içerik** (hakkımda, projeler, iş deneyimi, yetenekler, hobiler, iletişim; TR + EN) ve duvardaki QR tablosunun ayarı (`WALL_QR`). Yeni proje eklemek için buraya bir kayıt yeterli. |
| `js/main.js` | Oda, tıklanabilir alanlar (`HOTSPOTS`), günün saati, imleç dalgası, kedi ve sevgi barı, ekran/portre/QR çizimi. Alanların yerini görmek için `?edit=1`. |
| `js/ui.js` | Bilgisayarın içi: menü çubuğu, masaüstü simgeleri, dock, sürüklenip boyutlandırılabilen pencereler, hazır komutlu terminal (`/me`, `/projects`…). Odadaki bir eşyaya tıklayınca aynı pencere tek başına açılır. |
| `js/wall.js` | Ziyaretçi not duvarı. |
| `js/wallpaper.js` | Masaüstü duvar kâğıdının çizimi; `assets/wallpaper*.jpg` bundan üretildi. |
| `js/vendor/qrcode.js` | QR kodu üretici (Kazuhiko Arase, MIT lisansı). |
| `assets/room-morning/day/sunset/night.jpg` | Odanın sabah, öğlen, akşam ve gece resmi; ziyaretçinin yerel saatine göre seçilir. |
| `assets/room-depth.png`, `assets/room-ids.png` | Derinlik haritası (Depth Anything V2) ve eşya maskeleri (SlimSAM), ikisi de bilgisayarda çalıştırıldı; tıklama bu maskeye göre çalışır. |
| `assets/cat/` | Meowly kedisinin kareleri. |
| `assets/portrait.png` | Çerçevedeki piksel portre. |

Deneme adresleri: `?hour=22`, `?lang=en`, `?hot=monitor`, `?panel=projects`, `?wall=1`, `?date=10-29`, `?edit=1`, `?nocount=1` (sevgi sayacına yazmaz).

## Görseller

- Oda (modern eşyalar, dört farklı ışık) Google Gemini ile üretildi.
- Piksel portre fotoğraftan ChatGPT ile çizildi.
- Kedi, Meowly uygulamasının kendi çizimleridir (Mert Pural).

## Kedi

- Meowly'nin kedisi top ile bitkinin arasında oturur, göz kırpar, ara ara uyur. Yürümez, sessizdir.
- İmleci üstünde gezdirince ya da tıklayınca sevilir (kalp çıkar). Tıklayınca çıkan "Meowly" etiketi meowly.vercel.app adresine gider.
- Sol alttaki sevgi barı herkesin toplam sevgisini gösterir; alttaki ince çubuk o ziyaretçinin sevgisidir. 50 kez sevilince kedi "puf" diye kaybolur, 30 saniye sonra geri gelir. Bir tarayıcı günde en fazla 200 kez sayaca yazabilir.
- Lambaya tıklamak odayı geceye (geceyse gündüze) çevirir. Milli bayramlarda duvara bayrak dizisi, yılbaşında ışıklar asılır; 10 Kasım'da oda soluklaşır.

## Ziyaretçi notları

Duvardaki post-it'lere tıklayan ziyaretçi not duvarına geçer: soldaki renkli kâğıtlardan birini duvara sürükler, notunu yazar (ad isteğe bağlı) ve "Yapıştır"a basar; not bıraktığı yerde kalır. Notlar Supabase'deki `mert-portfolio` projesinde, `notes` tablosunda durur.

- Yeni not hemen duvarda görünür (onay yok). Bir notu kaldırmak için Supabase → Table Editor → `notes` → satırı sil ya da `approved` kutusunun işaretini kaldır.
- Sitedeki anahtar herkese açık (publishable) anahtardır; tablo kuralları yalnızca okumaya ve not eklemeye izin verir.

## Ortak sevgi sayacı

Sayaç ücretsiz [Abacus](https://jasoncameron.dev/abacus/) servisinde (`piercies3sc-cat/hearts`) tutulur. Anahtarsız herkese açık bir sayaç olduğu için biri adresi elle çağırarak sayıyı artırabilir; site büyüyünce kendi sunucuya (ör. Supabase) taşınabilir.
