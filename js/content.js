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
    'Aklıma takılan bir fikri alıp kısa sürede çalışan bir şeye dönüştürmeyi seviyorum. Telefonları kumandaya çeviren bir parti oyunu, Mac\'te yaşayan bir piksel kedi, antrenmanı 3B kaslar üzerinde gösteren bir uygulama bunlardan birkaçı.',
    'En çok, insanların gerçekten kullandığı ve kullanırken keyif aldığı şeyler yapmaktan hoşlanıyorum. Okulda öğrendiklerimi kendi projelerimde deniyor, projelerde takıldığım yerlerden de yeni şeyler öğreniyorum.',
    'Bu oda benim portfolyom. Raftaki projelere, duvardaki çerçevelere ya da masadaki bilgisayara tıklayarak gezebilirsin.',
  ],
  en: [
    "Hi, I'm Mert, a third-year Computer Engineering student in Istanbul.",
    "I like turning an idea that won't leave me alone into something that actually works: a party game that turns phones into controllers, a pixel cat that lives on your Mac, a workout app that paints training load onto 3D muscles.",
    'Most of all I enjoy building things people actually use and have fun with. I try what I learn at school in my own projects, and learn the most from the parts where those projects get stuck.',
    'This room is my portfolio. Click the shelf, the frames on the wall or the computer on the desk to look around.',
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
      tr: 'Herkesin telefonunu kumandaya çeviren, tek ekranda oynanan parti oyunları.',
      en: 'Party games on one shared screen, with everyone\'s phone as the controller.',
    },
    desc: {
      tr: 'Oyun televizyonda ya da bilgisayarda açılır; arkadaşların ekrandaki QR kodu okutup saniyeler içinde telefonlarından katılır. Telefon, oyuna göre bazen kumanda, bazen gizli kartların, bazen de oy pusulası olur. Kimsenin hesap açması gerekmez, bir takma ad yeterli. Gecikme olmasın diye ayrı bir gerçek zamanlı sunucu yazdım; 3B sahneler React Three Fiber ile çalışıyor.',
      en: 'The game opens on a TV or laptop, and friends join in seconds by scanning the QR code on screen. Depending on the game, the phone becomes a controller, a private hand of cards or a ballot. Nobody has to sign up; a nickname is enough. I wrote a separate realtime server to keep latency low, and the 3D scenes run on React Three Fiber.',
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
      tr: "Mac'inde yaşayan piksel bir kedi; yapay zekâ limitlerini takip eder, gününü rapora çevirir.",
      en: 'A pixel cat that lives on your Mac, keeps an eye on your AI limits and turns your day into a report.',
    },
    desc: {
      tr: 'Claude ya da Codex ile çalışırken masaüstünün köşesinde sana eşlik eden bir kedi. Kalan limitin menü çubuğunda görünür; hangi projede ne kadar çalıştığın günlük, haftalık ve aylık raporlara dönüşür. Sunucusu yok, verilerin kendi bilgisayarından çıkmaz. Bu odada oturan kedi de Meowly\'nin ta kendisi.',
      en: 'A cat that keeps you company in the corner of your screen while you work with Claude or Codex. Your remaining limit sits in the menu bar, and the time you spend on each project becomes daily, weekly and monthly reports. There is no server; your data never leaves your Mac. The cat sitting in this room is Meowly itself.',
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
      tr: 'Yapay zekâ limitine çarpmadan önce gör: kalan hakkın Mac menü çubuğunda.',
      en: 'See it before you hit the wall: your remaining AI quota in the Mac menu bar.',
    },
    desc: {
      tr: 'Claude, Codex, Gemini ve Antigravity için kalan limitini ve token kullanımını tek bakışta menü çubuğunda gösterir. Tamamen bilgisayarında çalışır, hiçbir yere veri göndermez ve ücretsizdir.',
      en: 'Shows your remaining limits and token usage for Claude, Codex, Gemini and Antigravity at a glance in the menu bar. It runs entirely on your Mac, sends nothing anywhere and is free.',
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
      tr: 'Antrenmanını kaydet, hangi kasını ne kadar çalıştırdığını 3B vücut üzerinde gör.',
      en: 'Log your workouts and see how hard each muscle worked on a 3D body.',
    },
    desc: {
      tr: 'Antrenmanları kaydetmek, program hazırlamak, rekorları ve tahmini 1RM\'i takip etmek için yazdığım full-stack bir web uygulaması. Hangi kas grubuna ne kadar yüklendiğini, gerçek zamanlı dönen bir 3B model üzerinde renklerle gösteriyor.',
      en: 'A full-stack web app I built for logging workouts, planning programs and tracking PRs and estimated 1RM. It paints the load on each muscle group onto a real-time 3D model you can spin around.',
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
      tr: 'Sen arkana yaslan, o tıklasın: hafif ve reklamsız bir otomatik tıklayıcı.',
      en: 'Sit back and let it click: a lightweight, ad-free auto clicker.',
    },
    desc: {
      tr: 'macOS ve Windows\'ta çalışır. Farklı işler için profil kaydedebilir, istatistiklerini görebilir, saniyede 500 tıklamaya kadar çıkabilir ve 5 tema arasından seçebilirsin.',
      en: 'Runs on macOS and Windows. Save profiles for different tasks, check your stats, go up to 500 clicks per second and pick from 5 themes.',
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
    tr: 'Kod yazmadığım zamanların çoğu ya bir oyunun başında ya da basketbol sahasında geçiyor.',
    en: "When I'm not writing code, I'm usually in front of a game or out on the basketball court.",
  },
  items: [
    { title: { tr: 'PC oyunları', en: 'PC games' }, text: { tr: 'Bilgisayarda oyun oynamak en büyük hobim. Oyunların arkasında neler döndüğünü merak etmem, hatta kendi oyunumu yapmaya kalkmam da buradan geliyor.', en: 'Playing games on PC is my biggest hobby. It is also why I got curious about what goes on behind them, and why I ended up making a game of my own.' } },
    { title: { tr: 'PlayStation koleksiyonu', en: 'PlayStation collection' }, text: { tr: 'Kutulu PlayStation oyunlarını biriktiriyorum. Rafta eski FIFA\'lardan GTA serisine kadar yıllar içinde topladığım oyunlar duruyor.', en: 'I collect boxed PlayStation games. The shelf holds everything from old FIFA editions to the GTA series, gathered over the years.' }, tags: ['FIFA', 'GTA'] },
    { title: { tr: 'Basketbol', en: 'Basketball' }, text: { tr: 'Uzun bir kod gününden sonra kafamı boşaltmanın en iyi yolu sahaya çıkıp birkaç top atmak.', en: 'After a long day of code, the best way to clear my head is to get on the court and shoot a few hoops.' } },
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
    work: 'İş deneyimi', projectsOnly: 'Projeler', workEmpty: 'Henüz bir staj ya da iş deneyimim yok. İlki geldiğinde burada yerini alacak.',
    close: 'Kapat', privateRepo: 'Kod şimdilik gizli.',
    hot: { monitor: 'Bilgisayar', shelf: 'Projeler', poqrox: 'poQRox', cat: 'Meowly', portrait: 'Hakkımda', cert: 'Yetenekler', games: 'Oyunlar', ball: 'Basketbol', cabinet: 'Oyun koleksiyonu', map: 'İstanbul', notes: 'Not bırak', contact: 'İletişim', lamp: 'Lamba', qr: 'poQRox' },
    contactLead: 'Bir sorun, bir fikrin ya da birlikte yapmak istediğin bir şey varsa yazman yeterli; dönüş yaparım.',
    notesLead: 'Uğradıysan duvara bir not bırak.',
    noteName: 'Adın (isteğe bağlı)', noteAnon: 'anonim', noteBody: 'Notunu yaz…', noteSend: 'Yapıştır',
    whereTitle: 'Yaşadığım yer', whereCity: 'İstanbul', whereCountry: 'Türkiye', whereText: 'İstanbul\'da yaşıyor ve okuyorum. Kodun çoğu, bu duvardaki haritanın içinde bir yerlerde yazılıyor.',
    noteThanks: 'Teşekkürler, notun duvarda!', noteFill: 'Notunu yaz.', noteWait: 'Biraz bekle, az önce bir not bıraktın.',
    noteEmpty: 'Henüz not yok. İlk notu sen bırak.', noteError: 'Şu an notlara ulaşılamıyor.',
    skillsLead: 'Projelerimde kullandığım ve rahat çalıştığım araçlar.',
    meowlyTag: 'Meowly →',
    menus: ['Dosya', 'Düzen', 'Görünüm', 'Git', 'Pencere', 'Yardım'], desktop: 'Masaüstü', back: 'Odaya dön', minimize: 'Küçült', zoom: 'Büyüt', folderProjects: 'Projeler',
  },
  en: {
    about: 'About', projects: 'Projects & Work', skills: 'Skills', hobbies: 'Hobbies', notes: 'Notes', contact: 'Contact',
    work: 'Work experience', projectsOnly: 'Projects', workEmpty: 'No internships or jobs yet. The first one will take its place here.',
    close: 'Close', privateRepo: 'Source is private for now.',
    hot: { monitor: 'Computer', shelf: 'Projects', poqrox: 'poQRox', cat: 'Meowly', portrait: 'About me', cert: 'Skills', games: 'Games', ball: 'Basketball', cabinet: 'Game collection', map: 'Istanbul', notes: 'Leave a note', contact: 'Contact', lamp: 'Lamp', qr: 'poQRox' },
    contactLead: 'If you have a question, an idea or something we could build together, just write. I will get back to you.',
    notesLead: 'Stopped by? Leave a note on the wall.',
    noteName: 'Your name (optional)', noteAnon: 'anonymous', noteBody: 'Write your note…', noteSend: 'Stick',
    whereTitle: 'Where I live', whereCity: 'Istanbul', whereCountry: 'Türkiye', whereText: 'I live and study in Istanbul. Most of the code gets written somewhere inside the map on this wall.',
    noteThanks: 'Thanks, your note is on the wall!', noteFill: 'Write a note.', noteWait: 'Give it a minute, you just left a note.',
    noteEmpty: 'No notes yet. Be the first.', noteError: "Can't reach the notes right now.",
    skillsLead: "The tools I've used in my projects and feel at home with.",
    meowlyTag: 'Meowly →',
    menus: ['File', 'Edit', 'View', 'Go', 'Window', 'Help'], desktop: 'Desktop', back: 'Back to the room', minimize: 'Minimize', zoom: 'Zoom', folderProjects: 'Projects',
  },
};
