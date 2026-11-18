/* SITENIN TUM ICERIGI BURADA.
   Yeni proje eklemek icin PROJECTS dizisine bir kayit ekle:
     ekrandaki "Projeler" listesine kart olarak kendiliginden gelir.
   Her metin iki dilde yazilir: { tr: '...', en: '...' } */

export const SITE = {
  name: 'Mert Pural',
  handle: 'mert@portfolio',
  role: { tr: 'Bilgisayar Mühendisliği öğrencisi', en: 'Computer Engineering student' },
  tagline: {
    tr: 'Web, masaüstü ve 3B projeler geliştiriyorum.',
    en: 'I build web, desktop and 3D projects.',
  },
};

export const ABOUT = {
  tr: [
    'Merhaba, ben Mert. Bilgisayar Mühendisliği 3. sınıf öğrencisiyim.',
    'Bir fikri alıp çalışan bir şeye çevirmeyi seviyorum: web uygulamaları, küçük masaüstü araçları, tarayıcıda 3B sahneler. Öğrenirken yapıyorum, yaparken öğreniyorum.',
    'Bu oda benim portfolyom. Eşyalara tıklayarak gezebilirsin.',
  ],
  en: [
    "Hi, I'm Mert. I'm a third-year Computer Engineering student.",
    'I like taking an idea and turning it into something that runs: web apps, small desktop tools, 3D scenes in the browser. I learn by building.',
    'This room is my portfolio. Click around to explore it.',
  ],
  facts: [
    { k: { tr: 'Konum', en: 'Based in' }, v: { tr: 'İstanbul, Türkiye', en: 'Istanbul, Türkiye' } },
    { k: { tr: 'Okul', en: 'Studying' }, v: { tr: 'Bilgisayar Mühendisliği, 3. sınıf', en: 'Computer Engineering, 3rd year' } },
    { k: { tr: 'Diller', en: 'Languages' }, v: { tr: 'Türkçe, İngilizce', en: 'Turkish, English' } },
  ],
};

export const PROJECTS = [
  {
    id: 'poqrox',
    name: 'poQRox',
    status: { tr: 'geliştiriliyor', en: 'in development' },
    tagline: {
      tr: 'Telefonların kumanda olduğu, ortak ekranda oynanan parti oyunu platformu.',
      en: 'A party-game platform played on a shared screen, with phones as controllers.',
    },
    desc: {
      tr: 'Oyun ortak bir ekranda akar, oyuncular QR kodu okutup telefonlarından katılır; telefon her oyuna göre kumanda, gizli bilgi ya da oylama ekranı olur. Hesap açmadan takma adla oynanabilir. Düşük gecikme için ayrı bir gerçek zamanlı sunucu, 3B sahneler için React Three Fiber kullanıyor.',
      en: 'The game runs on a shared screen and players join from their phones by scanning a QR code; the phone becomes a controller, a private hand or a voting screen depending on the game. Guests can play with just a nickname. It uses a separate realtime server for low latency and React Three Fiber for the 3D scenes.',
    },
    stack: ['TypeScript', 'React', 'React Three Fiber', 'WebSocket', 'Supabase', 'PostgreSQL'],
    links: [
      { label: { tr: 'Siteye git', en: 'Visit site' }, href: 'https://poqrox-web.onrender.com' },
    ],
  },
  {
    id: 'meowly',
    name: 'Meowly',
    status: { tr: 'yayında', en: 'released' },
    tagline: {
      tr: "Mac'inde yaşayan piksel kedi: yapay zekâ limitlerini gösterir, gününü rapora çevirir.",
      en: 'A pixel cat that lives on your Mac, shows your AI limits and turns your day into a report.',
    },
    desc: {
      tr: 'Sen Claude ya da Codex ile çalışırken masaüstünde oturan bir kedi. Limitlerin menü çubuğunda durur; hangi projede ne kadar çalıştığın günlük, haftalık, aylık rapor olur. Sunucusu yok, her şey kendi bilgisayarında kalır. Odadaki kedi de oradan geliyor.',
      en: 'A cat that sits on your desktop while you work with Claude or Codex. Your limits live in the menu bar, and the time you spend per project becomes daily, weekly and monthly reports. No server; everything stays on your own Mac. The cat in this room comes from there.',
    },
    stack: ['Swift', 'SwiftUI', 'macOS'],
    links: [
      { label: { tr: 'Siteye git', en: 'Visit site' }, href: 'https://meowly.vercel.app' },
      { label: { tr: 'GitHub', en: 'GitHub' }, href: 'https://github.com/mertpural/meowly' },
    ],
  },
  {
    id: 'ullage',
    name: 'Ullage',
    status: { tr: 'yayında', en: 'released' },
    tagline: {
      tr: 'Yapay zekâ limitine çarpmadan önce bil: Mac menü çubuğunda kalan hakkın.',
      en: 'Know before you hit the limit: your remaining AI quota in the Mac menu bar.',
    },
    desc: {
      tr: 'Claude, Codex, Gemini ve Antigravity için kalan limiti ve token kullanımını menü çubuğunda gösterir. Yerel çalışır, veri göndermez, ücretsizdir.',
      en: 'Shows remaining limits and token usage for Claude, Codex, Gemini and Antigravity in the menu bar. Runs locally, sends nothing, free.',
    },
    stack: ['Swift', 'macOS'],
    links: [
      { label: { tr: 'Siteye git', en: 'Visit site' }, href: 'https://ullage-app.netlify.app' },
      { label: { tr: 'GitHub', en: 'GitHub' }, href: 'https://github.com/mertpural/ullage' },
    ],
  },
  {
    id: 'fitness-3d',
    name: 'Fitness 3D',
    status: { tr: 'demo', en: 'demo' },
    tagline: {
      tr: 'Antrenman takibi ve 3B anatomi modeli üzerinde kas yükü haritası.',
      en: 'Workout tracking with a muscle-load heat map on a 3D anatomy model.',
    },
    desc: {
      tr: 'Antrenman kaydı, program yönetimi, PR ve tahmini 1RM takibi yapan full-stack web uygulaması. Hangi kas grubuna ne kadar yüklendiğini gerçek zamanlı 3B model üzerinde renklerle gösterir.',
      en: 'A full-stack web app for logging workouts, managing programs and tracking PRs and estimated 1RM. It paints training load per muscle group onto a real-time 3D model.',
    },
    stack: ['Next.js', 'TypeScript', 'Three.js', 'Supabase', 'PostgreSQL'],
    links: [
      { label: { tr: 'Demoyu aç', en: 'Open demo' }, href: 'https://fitness-3d-peach.vercel.app' },
      { label: { tr: 'GitHub', en: 'GitHub' }, href: 'https://github.com/mertpural/fitness-3d' },
    ],
  },
  {
    id: 'auto-clicker',
    name: 'AutoClicker',
    status: { tr: 'yayında', en: 'released' },
    tagline: {
      tr: 'Sen bekle, o tıklasın: hafif, reklamsız otomatik tıklayıcı.',
      en: 'You wait, it clicks: a lightweight, ad-free auto clicker.',
    },
    desc: {
      tr: 'macOS ve Windows için. Profiller, istatistikler, saniyede 500 tıklamaya kadar hız ve 5 tema.',
      en: 'For macOS and Windows. Profiles, statistics, up to 500 clicks per second and 5 themes.',
    },
    stack: ['C#', 'macOS', 'Windows'],
    links: [
      { label: { tr: 'Siteye git', en: 'Visit site' }, href: 'https://autoclicker-tr.netlify.app' },
      { label: { tr: 'GitHub', en: 'GitHub' }, href: 'https://github.com/mertpural/auto-clicker' },
    ],
  },
];

/* Is deneyimi: staj, is, serbest calisma. Bos oldukca "yakinda" yazisi gorunur.
   Kayit bicimi PROJECTS ile ayni (name, status, tagline, desc, stack, links). */
export const WORK = [];

/* Duvardaki QR tablosu: baska bir proje icin yalnizca bu kaydi degistirmek yeterli.
   bg/ink/accent: tablonun renkleri (projenin kendi renkleri). */
export const WALL_QR = {
  title: 'poQRox',
  accent: 'QR',              // basliktaki bu harfler vurgu renginde yazilir
  url: 'https://poqrox-web.onrender.com',
  bg: '#4f5d2f', ink: '#f3ead6', accent_color: '#e07a35', dark: '#2c3419',
};

export const HOBBIES = {
  lead: {
    tr: 'Kod yazmadığım zamanlarda çoğunlukla oyundayım ya da sahadayım.',
    en: "When I'm not coding I'm usually gaming or on the court.",
  },
  items: [
    { title: { tr: 'PC oyunları', en: 'PC games' }, text: { tr: 'Bilgisayarda oynamak en büyük hobim; oyunların nasıl yapıldığını merak etmem de buradan geliyor.', en: 'Gaming on PC is my biggest hobby, and it is where my curiosity about how games are made comes from.' } },
    { title: { tr: 'PlayStation koleksiyonu', en: 'PlayStation collection' }, text: { tr: 'Kutulu PS oyunları biriktiriyorum; FIFA ve GTA\'nın eskilerinden bu yana.', en: 'I collect boxed PlayStation games, all the way back to the old FIFA and GTA titles.' }, tags: ['FIFA', 'GTA'] },
    { title: { tr: 'Basketbol', en: 'Basketball' }, text: { tr: 'Ekran başından kalkınca potaya atıyorum.', en: 'When I step away from the screen, I shoot hoops.' } },
  ],
};

export const SKILLS = [
  { group: { tr: 'Diller', en: 'Languages' }, items: ['TypeScript', 'JavaScript', 'C', 'C++', 'C#', 'Swift', 'SQL', 'HTML/CSS'] },
  { group: { tr: 'Web', en: 'Web' }, items: ['React', 'Next.js', 'Three.js', 'ASP.NET Core', 'Node.js'] },
  { group: { tr: 'Veri', en: 'Data' }, items: ['PostgreSQL', 'Supabase', 'SQLite'] },
  { group: { tr: 'Araçlar', en: 'Tools' }, items: ['Git', 'Docker', 'Vite'] },
];

export const CONTACT = [
  { label: 'GitHub', text: 'github.com/mertpural', href: 'https://github.com/mertpural' },
  { label: { tr: 'E-posta', en: 'Email' }, text: 'mertpural@gmail.com', href: 'mailto:mertpural@gmail.com' },
];

export const UI = {
  tr: {
    about: 'Hakkımda', projects: 'Projeler & İşler', skills: 'Yetenekler', hobbies: 'Hobiler', notes: 'Notlar', contact: 'İletişim',
    work: 'İş deneyimi', projectsOnly: 'Projeler', workEmpty: 'Henüz staj ya da iş deneyimim yok; ilki geldiğinde burada olacak.',
    close: 'Kapat', privateRepo: 'Kod şimdilik gizli.',
    hot: { monitor: 'Bilgisayar', shelf: 'Projeler', poqrox: 'poQRox', cat: 'Meowly', portrait: 'Hakkımda', cert: 'Yetenekler', games: 'Oyunlar', ball: 'Basketbol', cabinet: 'Oyun koleksiyonu', map: 'İstanbul', notes: 'Not bırak', contact: 'İletişim', lamp: 'Lamba', qr: 'poQRox' },
    contactLead: 'Bir şey sormak ya da birlikte bir şey yapmak istersen yaz.',
    notesLead: 'Uğradıysan bir not bırak. Notlar ben onayladıktan sonra duvarda görünür.',
    noteName: 'Adın (isteğe bağlı)', noteAnon: 'anonim', noteBody: 'Notunu yaz…', noteSend: 'Yapıştır',
    whereTitle: 'Yaşadığım yer', whereCity: 'İstanbul', whereCountry: 'Türkiye', whereText: 'İstanbul\'da yaşıyor ve okuyorum.',
    noteThanks: 'Teşekkürler! Notun onaydan sonra duvara asılacak.', noteFill: 'Notunu yaz.', noteWait: 'Biraz bekle, az önce bir not bıraktın.',
    noteEmpty: 'Henüz not yok. İlk notu sen bırak.', noteError: 'Şu an notlara ulaşılamıyor.',
    skillsLead: 'Projelerde kullandıklarım.',
    meowlyTag: 'Meowly →',
    menus: ['Dosya', 'Düzen', 'Görünüm', 'Git', 'Pencere', 'Yardım'], desktop: 'Masaüstü', back: 'Odaya dön', minimize: 'Küçült', zoom: 'Büyüt', folderProjects: 'Projeler',
  },
  en: {
    about: 'About', projects: 'Projects & Work', skills: 'Skills', hobbies: 'Hobbies', notes: 'Notes', contact: 'Contact',
    work: 'Work experience', projectsOnly: 'Projects', workEmpty: 'No internships or jobs yet; the first one will show up here.',
    close: 'Close', privateRepo: 'Source is private for now.',
    hot: { monitor: 'Computer', shelf: 'Projects', poqrox: 'poQRox', cat: 'Meowly', portrait: 'About me', cert: 'Skills', games: 'Games', ball: 'Basketball', cabinet: 'Game collection', map: 'Istanbul', notes: 'Leave a note', contact: 'Contact', lamp: 'Lamp', qr: 'poQRox' },
    contactLead: 'Write to me if you want to ask something or build something together.',
    notesLead: 'If you stopped by, leave a note. Notes show up on the wall after I approve them.',
    noteName: 'Your name (optional)', noteAnon: 'anonymous', noteBody: 'Write your note…', noteSend: 'Stick',
    whereTitle: 'Where I live', whereCity: 'Istanbul', whereCountry: 'Türkiye', whereText: 'I live and study in Istanbul.',
    noteThanks: 'Thanks! Your note goes on the wall once approved.', noteFill: 'Write a note.', noteWait: 'Give it a minute, you just left a note.',
    noteEmpty: 'No notes yet. Be the first.', noteError: "Can't reach the notes right now.",
    skillsLead: "What I've used in my projects.",
    meowlyTag: 'Meowly →',
    menus: ['File', 'Edit', 'View', 'Go', 'Window', 'Help'], desktop: 'Desktop', back: 'Back to the room', minimize: 'Minimize', zoom: 'Zoom', folderProjects: 'Projects',
  },
};
