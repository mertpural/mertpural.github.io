# Kedi sitesi

Sitedeki sesler `sounds/` klasöründeki kayıtlar ve `index.html` içinde kodla üretilen yedek seslerdir. Bir dosya yüklenemezse yedek ses çalar.

## Ses kaynakları ve lisanslar

| Dosya | Kullanıldığı yer | Kaynak | Lisans |
|---|---|---|---|
| `sounds/meow.m4a` | miyav | [Pixabay: Cute soft cat meow (3)](https://pixabay.com/sound-effects/film-special-effects-cute-soft-cat-meow-3-535482/), yodguard (m4a'ya çevrildi) | Pixabay Content License (ücretsiz, ticari kullanıma izin verir) |
| `sounds/mrrp.m4a` | "mrrp" (kısa cıvıltı) | [Pixabay: cat chirp](https://pixabay.com/sound-effects/nature-cat-chirp-99887/), freesound_community (kısa bölüm, m4a'ya çevrildi) | Pixabay Content License (ücretsiz, ticari kullanıma izin verir) |
| `sounds/meow-old.m4a` | miyav ve mrrp yedeği (yeni kayıtlar yüklenemezse) | [Wikimedia Commons: Meow normalized.opus](https://commons.wikimedia.org/wiki/File:Meow_normalized.opus), orijinal: Dcrosby ([Meow.ogg](https://commons.wikimedia.org/wiki/File:Meow.ogg)) | CC BY-SA 3.0 |
| `sounds/purr.m4a` | mırıltı (döngü) | [Wikimedia Commons: Purring cat.oga](https://commons.wikimedia.org/wiki/File:Purring_cat.oga), Mysid | Kamu malı |
| `sounds/munch.m4a` | yemek yeme (kedi yerken döngüyle çalar) | [Pixabay: Cat Eating Dry Food](https://pixabay.com/sound-effects/household-cat-eating-dry-food-133130/), soundsforyou (kısa bölüm, m4a'ya çevrildi) | Pixabay Content License (ücretsiz, ticari kullanıma izin verir) |
| `sounds/lap.m4a` | su içme (kedi su içerken döngüyle çalar) | [Pixabay: Cat Drinking 6 FX](https://pixabay.com/sound-effects/nature-cat-drinking-6-fx-306169/), SOUND_GARAGE (kısa bölüm, m4a'ya çevrildi) | Pixabay Content License (ücretsiz, ticari kullanıma izin verir) |
| `sounds/hiss.m4a` | tıslama (kedi ürkünce ya da çok sevilince) | [Pixabay: hiss](https://pixabay.com/sound-effects/film-special-effects-hiss-86052/), freesound_community (kısa bölüm, m4a'ya çevrildi) | Pixabay Content License (ücretsiz, ticari kullanıma izin verir) |
| `sounds/crunch.m4a` | mama dökme (kısa parçalar hızlı çalınır) | [OpenGameArt: 7 Eating Crunches](https://opengameart.org/content/7-eating-crunches) | CC0 |
| `sounds/water.mp3` | su dökme | [OpenGameArt: 6 Short water splashes](https://opengameart.org/content/6-short-water-splashes), ezwa (yükleyen: qubodup) | CC0 |
| `sounds/bite.m4a` | yemek yeme yedeği | [OpenGameArt: Apple Bite](https://opengameart.org/content/apple-bite), AntumDeluge | CC0 |

`meow-old.m4a` CC BY-SA 3.0 lisanslıdır: kaynak belirtmek gerekir (yukarıda belirtildi) ve bu dosyadan türeyen ses aynı lisansla paylaşılmalıdır. Pixabay lisansı ticari kullanıma izin verir ama dosyaların tek başına yeniden dağıtılmasına izin vermez.

## Kedi

Dosyalar: `index.html` (sayfa ve stiller), `cat.js` (kedi, sesler, gökyüzü, bayramlar, hava; ileride başka sayfalara tek satırla eklenebilir), `sw.js` + `manifest.webmanifest` (telefona uygulama olarak eklenebilir, çevrimdışı açılır), `og.png` (link paylaşım kartı), `photos/` (Tonti'nin fotoğrafları).

- Kediyi 5 kez sevince (dokunma, tıklama ya da boşluk/Enter tuşu) karnını açar. 8 saniyede 14'ten fazla sevilirse tısladıktan sonra kaçar ve 30 saniye boyunca sevilmez (sayaca da sayılmaz).
- Gökyüzü, güneş/ay, bulutlar ve tepeler ziyaretçinin yerel saatine göre değişir. Test: adrese `?hour=7` ya da `?hour=19.3` ekleyin.
- 23 Nisan, 19 Mayıs, 30 Ağustos, 28-29 Ekim'de dalgalanan Türk bayrakları ve flamalar çıkar. 10 Kasım'da sade bir anma günüdür: renkler soluklaşır, bayraklar yarıya iner, kedi sakin durur, hava olayları ve konfeti kapalıdır, 09:05'te bir dakikalık saygı duruşu (ekran kararır, ses kesilir). Yılbaşında kedi şapka takar ve kar yağar. Test: `?date=10-29` ya da `?date=11-10&hour=9.09`.
- Ara sıra yağmur ya da kar yağar, kedi yağmurda kutuya saklanır (`?weather=rain` / `?weather=snow`). Geceleri ara sıra kayan yıldız geçer.
- Ortak sevgi sayacı 100'ün katlarına ulaşınca konfeti yağar.
- Sağ üstteki 📷 düğmesi (ya da kedi kutudayken kutuya dokunmak) Tonti'nin fotoğraflarını polaroid olarak açar; fotoğrafa dokunarak sıradakine geçilir. Test: `?photo=2`.

## Ortak sevgi sayacı

Sağ üstteki ♥ sayacı herkesin sevmelerinin toplamıdır. Sayaç ücretsiz [Abacus](https://jasoncameron.dev/abacus/) servisinde (`piercies3sc-cat/hearts`) tutulur; servis ulaşılamazsa tarayıcıda saklanan kişisel sayı gösterilir. Anahtarsız herkese açık bir sayaç olduğu için biri adresi elle çağırarak sayıyı artırabilir. Site büyüyünce kendi sunucuya (ör. Supabase) taşınabilir.
