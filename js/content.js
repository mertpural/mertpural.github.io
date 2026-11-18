/* SITENIN TUM ICERIGI BURADA.
   Yeni proje eklemek icin PROJECTS dizisine bir kayit ekle:
     ekrandaki "Projeler" listesine kart olarak kendiliginden gelir.
   Her metin iki dilde yazilir: { tr: '...', en: '...' } */

export const SITE = {
  name: 'Mert Pural',
  handle: 'mert@portfolio',
  role: { tr: 'Bilgisayar Mühendisliği öğrencisi', en: 'Computer Engineering student' },
  tagline: {
    tr: 'Web, masaüstü ve tarayıcıda 3B projeler geliştiriyorum.',
    en: 'I build web apps, desktop tools and 3D in the browser.',
  },
};

export const ABOUT = {
  tr: [
    'Merhaba, ben Mert. İstanbul\'da Bilgisayar Mühendisliği 3. sınıf öğrencisiyim.',
    'Boş zamanlarımda kendi projelerimi geliştiriyorum: web uygulamaları, Mac için küçük araçlar ve tarayıcıda çalışan 3B projeler. Bunların bir kısmını raftan ya da masadaki bilgisayardan inceleyebilirsin.',
    'Okulda öğrendiklerimi bu projelerde uyguluyor, yeni şeyleri de çoğunlukla bir şey yaparken öğreniyorum.',
    'Odadaki eşyalara tıklayarak gezebilirsin.',
  ],
  en: [
    "Hi, I'm Mert, a third-year Computer Engineering student in Istanbul.",
    'In my free time I work on my own projects: web apps, small tools for the Mac and 3D projects that run in the browser. You can find some of them on the shelf or on the computer on the desk.',
    'I use what I learn at school in these projects, and I usually pick up new things while building something.',
    'Click the things in the room to look around.',
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
      tr: 'Telefonların kumanda olarak kullanıldığı, tek ekranda oynanan bir parti oyunu platformu.',
      en: 'A party game platform played on one screen, with phones used as controllers.',
    },
    desc: {
      tr: 'Oyun televizyonda ya da bilgisayarda açılır, oyuncular ekrandaki QR kodu okutup telefonlarından katılır. Telefon oyuna göre kumanda, gizli kart ya da oylama ekranı olarak kullanılır. Hesap açmak gerekmez, takma adla oynanabilir. Düşük gecikme için ayrı bir gerçek zamanlı sunucu var; 3B sahneler React Three Fiber ile yapıldı.',
      en: 'The game opens on a TV or computer, and players join from their phones by scanning the QR code on screen. Depending on the game, the phone works as a controller, a private hand of cards or a voting screen. No account is needed; you can play with a nickname. A separate realtime server keeps latency low, and the 3D scenes are built with React Three Fiber.',
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
      tr: "Mac'te masaüstünde duran bir piksel kedi; yapay zekâ limitlerini ve çalışma süreni takip eder.",
      en: 'A pixel cat that sits on your Mac desktop and tracks your AI limits and working time.',
    },
    desc: {
      tr: 'Claude ya da Codex ile çalışırken masaüstünde duran bir kedi. Kalan limit menü çubuğunda görünür, hangi projede ne kadar çalıştığın da günlük, haftalık ve aylık rapor olarak tutulur. Sunucusu yok; veriler bilgisayardan çıkmaz. Bu odadaki kedi de Meowly\'den.',
      en: 'A cat that sits on your desktop while you work with Claude or Codex. Your remaining limit shows in the menu bar, and the time you spend on each project is kept as daily, weekly and monthly reports. There is no server; data stays on your Mac. The cat in this room is from Meowly.',
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
      tr: 'Yapay zekâ araçlarında kalan kullanım hakkını Mac menü çubuğunda gösteren bir uygulama.',
      en: 'A Mac menu bar app that shows how much of your AI usage limit is left.',
    },
    desc: {
      tr: 'Claude, Codex, Gemini ve Antigravity için kalan limiti ve token kullanımını menü çubuğunda gösterir. Bilgisayarda çalışır, veri göndermez ve ücretsizdir.',
      en: 'Shows remaining limits and token usage for Claude, Codex, Gemini and Antigravity in the menu bar. It runs locally, sends no data and is free.',
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
      tr: 'Antrenman takibi yapan ve kas yükünü 3B model üzerinde gösteren bir web uygulaması.',
      en: 'A web app for tracking workouts that shows muscle load on a 3D model.',
    },
    desc: {
      tr: 'Antrenman kaydı, program hazırlama, rekor ve tahmini 1RM takibi yapan full-stack bir web uygulaması. Hangi kas grubunun ne kadar çalıştığını 3B model üzerinde renklerle gösterir.',
      en: 'A full-stack web app for logging workouts, planning programs and tracking PRs and estimated 1RM. It shows how much each muscle group worked with colours on a 3D model.',
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
      tr: 'macOS ve Windows için hafif, reklamsız bir otomatik tıklayıcı.',
      en: 'A lightweight, ad-free auto clicker for macOS and Windows.',
    },
    desc: {
      tr: 'Profil kaydetme, istatistikler, saniyede 500 tıklamaya kadar hız ve 5 tema seçeneği var.',
      en: 'It has saved profiles, statistics, up to 500 clicks per second and 5 themes.',
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
    tr: 'Kod dışında en çok oyun oynuyor ve basketbol oynuyorum.',
    en: 'Outside of code, I mostly play video games and basketball.',
  },
  items: [
    { title: { tr: 'PC oyunları', en: 'PC games' }, text: { tr: 'Boş zamanımın çoğunu bilgisayarda oyun oynayarak geçiriyorum. Oyun geliştirmeye ilgim de buradan başladı.', en: 'I spend most of my free time playing games on PC. That is also where my interest in making games started.' } },
    { title: { tr: 'PlayStation koleksiyonu', en: 'PlayStation collection' }, text: { tr: 'Kutulu PlayStation oyunları biriktiriyorum; aralarında eski FIFA\'lar ve GTA oyunları var.', en: 'I collect boxed PlayStation games, including older FIFA and GTA titles.' }, tags: ['FIFA', 'GTA'] },
    { title: { tr: 'Basketbol', en: 'Basketball' }, text: { tr: 'Fırsat buldukça arkadaşlarla basketbol oynuyorum.', en: 'I play basketball with friends whenever I get the chance.' } },
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
    work: 'İş deneyimi', projectsOnly: 'Projeler', workEmpty: 'Henüz staj ya da iş deneyimim yok; olduğunda burada yer alacak.',
    close: 'Kapat', privateRepo: 'Kod şimdilik gizli.',
    hot: { monitor: 'Bilgisayar', shelf: 'Projeler', poqrox: 'poQRox', cat: 'Meowly', portrait: 'Hakkımda', cert: 'Yetenekler', games: 'Oyunlar', ball: 'Basketbol', cabinet: 'Oyun koleksiyonu', map: 'İstanbul', notes: 'Not bırak', contact: 'İletişim', lamp: 'Lamba', qr: 'poQRox' },
    contactLead: 'Bir sorun ya da birlikte çalışmak istediğin bir şey varsa bana yazabilirsin.',
    notesLead: 'Uğradıysan duvara bir not bırak.',
    noteName: 'Adın (isteğe bağlı)', noteAnon: 'anonim', noteBody: 'Notunu yaz…', noteSend: 'Yapıştır',
    whereTitle: 'Yaşadığım yer', whereCity: 'İstanbul', whereCountry: 'Türkiye', whereText: 'İstanbul\'da yaşıyor ve okuyorum.',
    noteThanks: 'Teşekkürler, notun duvarda!', noteFill: 'Notunu yaz.', noteWait: 'Biraz bekle, az önce bir not bıraktın.',
    noteEmpty: 'Henüz not yok. İlk notu sen bırak.', noteError: 'Şu an notlara ulaşılamıyor.',
    skillsLead: 'Projelerimde kullandığım diller ve araçlar.',
    meowlyTag: 'Meowly →',
    menus: ['Dosya', 'Düzen', 'Görünüm', 'Git', 'Pencere', 'Yardım'], desktop: 'Masaüstü', back: 'Odaya dön', minimize: 'Küçült', zoom: 'Büyüt', folderProjects: 'Projeler',
  },
  en: {
    about: 'About', projects: 'Projects & Work', skills: 'Skills', hobbies: 'Hobbies', notes: 'Notes', contact: 'Contact',
    work: 'Work experience', projectsOnly: 'Projects', workEmpty: 'No internships or jobs yet; they will be listed here.',
    close: 'Close', privateRepo: 'Source is private for now.',
    hot: { monitor: 'Computer', shelf: 'Projects', poqrox: 'poQRox', cat: 'Meowly', portrait: 'About me', cert: 'Skills', games: 'Games', ball: 'Basketball', cabinet: 'Game collection', map: 'Istanbul', notes: 'Leave a note', contact: 'Contact', lamp: 'Lamp', qr: 'poQRox' },
    contactLead: 'If you have a question or want to work on something together, feel free to write to me.',
    notesLead: 'Stopped by? Leave a note on the wall.',
    noteName: 'Your name (optional)', noteAnon: 'anonymous', noteBody: 'Write your note…', noteSend: 'Stick',
    whereTitle: 'Where I live', whereCity: 'Istanbul', whereCountry: 'Türkiye', whereText: 'I live and study in Istanbul.',
    noteThanks: 'Thanks, your note is on the wall!', noteFill: 'Write a note.', noteWait: 'Give it a minute, you just left a note.',
    noteEmpty: 'No notes yet. Be the first.', noteError: "Can't reach the notes right now.",
    skillsLead: 'Languages and tools I use in my projects.',
    meowlyTag: 'Meowly →',
    menus: ['File', 'Edit', 'View', 'Go', 'Window', 'Help'], desktop: 'Desktop', back: 'Back to the room', minimize: 'Minimize', zoom: 'Zoom', folderProjects: 'Projects',
  },
};
