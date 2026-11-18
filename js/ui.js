/* Bilgisayarin ekrani: Mac'e benzeyen bir masaustu. Menu cubugu, sagda simgeler, altta dock,
   suruklenebilen pencereler. Odadaki bir esyaya tiklaninca ayni pencere tek basina, odanin ustunde acilir.
   Icerik content.js'ten gelir, TR/EN. */
import {SITE,ABOUT,PROJECTS,WORK,HOBBIES,SKILLS,CONTACT,UI} from './content.js';
import {wallpaperURL} from './wallpaper.js';

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SECTIONS=['about','projects','skills','hobbies','contact','where'];

/* ---------- simgeler (hepsi bu dosyada cizilir) ---------- */
let gid=0;
function squircle(c1,c2,glyph){
  const id='g'+(++gid);
  return `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect x="3" y="3" width="58" height="58" rx="14" fill="url(#${id})"/><rect x="3.5" y="3.5" width="57" height="57" rx="13.5" fill="none" stroke="rgba(255,255,255,.25)"/>${glyph}</svg>`;
}
const ICON={
  folder:()=>`<svg viewBox="0 0 64 54" aria-hidden="true"><path d="M3 9a5 5 0 0 1 5-5h15l6 6h27a5 5 0 0 1 5 5v5H3z" fill="#3a8ee0"/><rect x="2" y="15" width="60" height="37" rx="5" fill="#62b3f6"/><rect x="2" y="15" width="60" height="5" rx="2" fill="#8ccaf9"/></svg>`,
  doc:()=>`<svg viewBox="0 0 54 64" aria-hidden="true"><path d="M5 3h30l14 14v42a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="#fff" stroke="#c9c9cf"/><path d="M35 3v12a2 2 0 0 0 2 2h12" fill="#e9e9ee" stroke="#c9c9cf"/><g stroke="#9a9aa3" stroke-width="2.2" stroke-linecap="round"><path d="M11 27h28M11 34h28M11 41h28M11 48h18"/></g></svg>`,
  notes:()=>squircle('#fff8d6','#f6e7a6','<rect x="3" y="3" width="58" height="15" rx="14" fill="#f5c54a"/><rect x="3" y="11" width="58" height="7" fill="#f5c54a"/><g stroke="#c9b98a" stroke-width="2"><path d="M12 29h40M12 37h40M12 45h40M12 53h26"/></g>'),
  terminal:()=>squircle('#3b3b40','#17171a','<path d="M15 22l9 8-9 8" fill="none" stroke="#7ee08a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M29 40h16" stroke="#e8e8ea" stroke-width="4" stroke-linecap="round"/>'),
  games:()=>squircle('#9b7bff','#5b3fd6','<path d="M18 26h28a8 8 0 0 1 7.6 5.5l3 10a5 5 0 0 1-8.4 4.8L44 42H20l-4.2 4.3a5 5 0 0 1-8.4-4.8l3-10A8 8 0 0 1 18 26z" fill="#fff"/><path d="M22 31v8M18 35h8" stroke="#5b3fd6" stroke-width="3" stroke-linecap="round"/><circle cx="41" cy="33" r="2.4" fill="#ff6b8b"/><circle cx="46" cy="37" r="2.4" fill="#4dd0e1"/>'),
  mail:()=>squircle('#5ec0ff','#1f7ff0','<rect x="12" y="19" width="40" height="27" rx="4" fill="#fff"/><path d="M13 21l19 14 19-14" fill="none" stroke="#1f7ff0" stroke-width="3" stroke-linejoin="round"/>'),
  map:()=>squircle('#9ee59a','#3fb26a','<path d="M3 40c14-6 22 6 58-4v11a14 14 0 0 1-14 14H17A14 14 0 0 1 3 47z" fill="#5ab4e8"/><path d="M32 14a10 10 0 0 1 10 10c0 8-10 18-10 18S22 32 22 24a10 10 0 0 1 10-10z" fill="#ff5a4e"/><circle cx="32" cy="24" r="3.8" fill="#fff"/>'),
  projects:()=>squircle('#7cc4ff','#2f86e8','<path d="M14 21a3 3 0 0 1 3-3h9l4 4h17a3 3 0 0 1 3 3v3H14z" fill="#d4ecff"/><rect x="13" y="26" width="38" height="22" rx="3" fill="#fff"/>'),
  trash:()=>`<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 16h36l-4 40a4 4 0 0 1-4 3.6H22a4 4 0 0 1-4-3.6z" fill="rgba(235,238,243,.9)" stroke="#9aa0aa"/><g stroke="#a8aeb8" stroke-width="2"><path d="M24 22l2 30M32 22v30M40 22l-2 30"/></g><rect x="11" y="11" width="42" height="6" rx="3" fill="#d9dde3" stroke="#9aa0aa"/></svg>`,
  door:()=>squircle('#c98a5a','#8a5530','<rect x="21" y="13" width="22" height="38" rx="2" fill="#5e3820"/><rect x="24" y="16" width="16" height="35" rx="1" fill="#e8b98a"/><circle cx="36" cy="34" r="2" fill="#5e3820"/>'),
};
/* proje simgeleri: projenin kendi rengi + kisa isareti */
const PICON={
  poqrox:()=>squircle('#5d6d36','#3e4a22','<text x="32" y="41" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-weight="900" font-size="24" fill="#e07a35">QR</text>'),
  meowly:()=>squircle('#ffd3de','#f59ab2','<image href="assets/cat/idle_0.png" x="15" y="10" width="34" height="50" style="image-rendering:pixelated"/>'),
  ullage:()=>squircle('#6fe0d0','#1b9c9a','<path d="M32 13s14 15 14 25a14 14 0 0 1-28 0c0-10 14-25 14-25z" fill="#fff"/><path d="M24 39a8 8 0 0 0 8 8" fill="none" stroke="#1b9c9a" stroke-width="3" stroke-linecap="round"/>'),
  'fitness-3d':()=>squircle('#ff8a7a','#e2433a','<g fill="#fff"><rect x="11" y="25" width="6" height="14" rx="2"/><rect x="47" y="25" width="6" height="14" rx="2"/><rect x="17" y="21" width="6" height="22" rx="2"/><rect x="41" y="21" width="6" height="22" rx="2"/><rect x="23" y="30" width="18" height="4"/></g>'),
  'auto-clicker':()=>squircle('#d6d6dc','#8e8e96','<path d="M24 14l20 20-9 1 6 12-5 2-6-12-6 7z" fill="#fff" stroke="#3a3a40" stroke-width="2" stroke-linejoin="round"/>'),
};
const picon=id=>(PICON[id]||(()=>squircle('#b9b9c2','#7d7d86','')))();

export function initUI(o){
  o=o||{};
  const pref=()=>(navigator.language||'en').toLowerCase().startsWith('tr')?'tr':'en';
  let lang=pref();
  try{const s=localStorage.getItem('lang');if(s==='tr'||s==='en')lang=s;}catch(e){}
  const q=new URLSearchParams(location.search).get('lang');if(q==='tr'||q==='en')lang=q;
  document.documentElement.lang=lang;
  const t=v=>v&&typeof v==='object'?(v[lang]||v.en||''):v;
  const L=()=>UI[lang];
  const el=document.getElementById('screen'),mac=el.querySelector('.mac'),desk=el.querySelector('.desk'),winsEl=el.querySelector('.wins'),dock=el.querySelector('.dock-in');
  const bar=el.querySelector('.menubar'),appName=bar.querySelector('.app'),clock=bar.querySelector('.clock');
  let open=false,dive=false,lastFocus=null,z=20,clockT=0;
  const wins=new Map();
  const small=()=>innerWidth<700;

  /* ---------- uygulamalar ---------- */
  function project(p){
    const links=p.links.length?p.links.map(l=>`<a class="btn" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(t(l.label))} <span aria-hidden="true">↗</span></a>`).join(''):`<span class="muted">${esc(L().privateRepo)}</span>`;
    return `<article class="proj"><header><span class="pi">${picon(p.id)}</span><div><h2>${esc(p.name)}</h2><span class="status">${esc(t(p.status))}</span></div></header>
      <p class="lead">${esc(t(p.tagline))}</p><p>${esc(t(p.desc))}</p>
      <ul class="chips">${p.stack.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><div class="links">${links}</div></article>`;
  }
  const APPS={
    about:{icon:ICON.notes,desk:ICON.doc,name:()=>L().about,w:560,h:470,render:()=>`<p class="eyebrow">${esc(L().about)}</p><h2>${esc(SITE.name)}</h2><p class="role">${esc(t(SITE.role))}</p>
      ${ABOUT[lang].map(p=>`<p>${esc(p)}</p>`).join('')}
      <dl class="facts">${ABOUT.facts.map(f=>`<div><dt>${esc(t(f.k))}</dt><dd>${esc(t(f.v))}</dd></div>`).join('')}</dl>`},
    projects:{icon:ICON.projects,desk:ICON.folder,name:()=>L().folderProjects,title:()=>L().projects,w:660,h:470,render:()=>`
      <section class="finder"><h3 class="grp">${esc(L().projectsOnly)}</h3><div class="grid">${PROJECTS.map(p=>`<button type="button" class="ico" data-open="p:${esc(p.id)}"><span class="i">${picon(p.id)}</span><span class="n">${esc(p.name)}</span></button>`).join('')}</div>
      <h3 class="grp">${esc(L().work)}</h3>${WORK.length?`<div class="grid">${WORK.map(p=>`<button type="button" class="ico" data-open="p:${esc(p.id)}"><span class="i">${picon(p.id)}</span><span class="n">${esc(p.name)}</span></button>`).join('')}</div>`:`<p class="empty-work">${esc(L().workEmpty)}</p>`}</section>`},
    terminal:{icon:ICON.terminal,desk:ICON.terminal,name:()=>'Terminal',w:640,h:440,term:true,render:()=>`<div class="term"><div class="out" aria-live="polite"></div><form class="in"><label class="pr" for="tin">mert@portfolio ~ %</label><input id="tin" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go"></form><div class="cmds">${CMDS().map(c=>`<button type="button" data-cmd="${c}">${c}</button>`).join('')}</div></div>`,init:w=>termInit(w)},
    skills:{icon:ICON.terminal,desk:ICON.terminal,name:()=>L().skills,alias:'terminal',run:'/skills'},
    hobbies:{icon:ICON.games,desk:ICON.games,name:()=>L().hobbies,w:620,h:460,render:()=>`<p class="eyebrow">${esc(L().hobbies)}</p><p>${esc(t(HOBBIES.lead))}</p><ul class="hob">${HOBBIES.items.map(h=>`<li><h3>${esc(t(h.title))}</h3><p>${esc(t(h.text))}</p>${h.tags?`<ul class="chips tags">${h.tags.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</li>`).join('')}</ul>`},
    contact:{icon:ICON.mail,desk:ICON.mail,name:()=>L().contact,w:480,h:330,render:()=>`<p class="eyebrow">${esc(L().contact)}</p><p>${esc(L().contactLead)}</p><ul class="rows">${CONTACT.map(c=>`<li><span>${esc(t(c.label))}</span><a href="${esc(c.href)}"${c.href.startsWith('http')?' target="_blank" rel="noopener"':''}>${esc(c.text)}</a></li>`).join('')}</ul>`},
    sys:{icon:ICON.notes,name:()=>tr()?'Bu Mac hakkında':'About This Mac',w:380,h:430,render:()=>`<div class="sysv"><img src="assets/portrait.png" alt=""><h2>MertOS</h2><p class="dim">${tr()?'Sürüm 1.0 · İstanbul':'Version 1.0 · Istanbul'}</p><dl>${[[tr()?'Kullanıcı':'User',SITE.name],[tr()?'Model':'Model',t(SITE.role)],[tr()?'Çip':'Chip','TypeScript + React'],[tr()?'Bellek':'Memory',tr()?'Çok kahve':'Lots of coffee'],[tr()?'Ekran':'Display',tr()?'Piksel oda, 4 farklı ışık':'Pixel room, 4 lightings'],[tr()?'Evcil hayvan':'Pet','Meowly']].map(([a,b])=>`<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl></div>`},
    trash:{icon:ICON.trash,name:()=>lang==='tr'?'Çöp Kutusu':'Trash',w:420,h:280,render:()=>`<div class="trashv">${ICON.trash()}<p>${lang==='tr'?'Çöp kutusu boş. Yarım kalan projeler de burada değil, rafta bekliyor.':'The trash is empty. Unfinished projects are not here either; they wait on the shelf.'}</p></div>`},
    where:{icon:ICON.map,desk:ICON.map,name:()=>L().whereCity,title:()=>L().whereTitle,w:420,h:300,render:()=>`<p class="eyebrow">${esc(L().whereTitle)}</p><h2>${esc(L().whereCity)}</h2><p class="role">${esc(L().whereCountry)}</p><p>${esc(L().whereText)}</p>`},
  };
  for(const p of [...PROJECTS,...WORK])APPS['p:'+p.id]={icon:()=>picon(p.id),name:()=>p.name,w:580,h:520,render:()=>project(p)};
  const DESK=['about','projects','skills','hobbies','contact','where'];
  const DOCK=['projects','terminal','about','hobbies','contact','where','|','p:poqrox','p:meowly','|','trash'];

  /* ---------- terminal: hazir komutlar ya da yazarak ---------- */
  const CMDS=()=>['/me','/projects','/skills','/hobbies','/contact','/where','/help','/clear'];
  const tr=()=>lang==='tr';
  function cmdOut(raw){
    const [c0,...rest]=raw.trim().split(/\s+/),c=(c0||'').toLowerCase().replace(/^\//,''),arg=rest.join(' ').toLowerCase();
    const line=(k,v)=>`<p><span class="k">${esc(k)}</span> ${v}</p>`;
    switch(c){
      case '':return '';
      case 'help':case 'yardim':case 'yardım':return `<p class="dim">${tr()?'Kullanabileceğin komutlar:':'Commands you can use:'}</p>`+[
        ['/me',tr()?'ben kimim':'who I am'],['/projects',tr()?'projelerim':'my projects'],['/skills',tr()?'kullandığım teknolojiler':'tech I use'],['/hobbies',tr()?'hobilerim':'my hobbies'],
        ['/contact',tr()?'bana ulaş':'reach me'],['/where',tr()?'nerede yaşıyorum':'where I live'],['/open <app>',tr()?'bir pencere aç (ör. /open projects)':'open a window (e.g. /open projects)'],['/clear',tr()?'ekranı temizle':'clear the screen']
      ].map(([a,b])=>`<p class="hl"><span class="k">${esc(a)}</span><span class="dim">${esc(b)}</span></p>`).join('');
      case 'me':case 'whoami':case 'about':case 'hakkimda':case 'hakkımda':return `<p class="big">${esc(SITE.name)}</p><p class="dim">${esc(t(SITE.role))}</p>`+ABOUT[lang].map(p=>`<p>${esc(p)}</p>`).join('')+ABOUT.facts.map(f=>line(t(f.k).toLowerCase()+':',esc(t(f.v)))).join('');
      case 'projects':case 'projeler':case 'ls':return PROJECTS.map(p=>`<p><button type="button" class="lk" data-open="p:${esc(p.id)}">${esc(p.name)}</button> <span class="dim">[${esc(t(p.status))}]</span> ${esc(t(p.tagline))}</p>`).join('')+`<p class="dim">${tr()?'Bir projeye tıkla ya da /open projects yaz.':'Click a project or type /open projects.'}</p>`;
      case 'skills':case 'yetenekler':return `<p class="dim"># ${esc(L().skillsLead)}</p>`+SKILLS.map(s=>`<p><span class="k">${esc(t(s.group).toLowerCase())}/</span></p><p class="items">${s.items.map(i=>`<span>${esc(i)}</span>`).join('')}</p>`).join('');
      case 'hobbies':case 'hobiler':return HOBBIES.items.map(h=>line('•',`<b>${esc(t(h.title))}</b> <span class="dim">${esc(t(h.text))}</span>`)).join('');
      case 'contact':case 'iletisim':case 'iletişim':return CONTACT.map(x=>line(t(x.label).toLowerCase()+':',`<a href="${esc(x.href)}"${x.href.startsWith('http')?' target="_blank" rel="noopener"':''}>${esc(x.text)}</a>`)).join('');
      case 'where':case 'nerede':return `<p>📍 ${esc(L().whereCity)}, ${esc(L().whereCountry)}</p><p class="dim">${esc(L().whereText)}</p>`;
      case 'open':case 'ac':case 'aç':{const id=APPS[arg]?arg:APPS['p:'+arg]?'p:'+arg:null;if(id){setTimeout(()=>openApp(id),60);return `<p class="dim">${tr()?'açılıyor':'opening'} ${esc(arg)}…</p>`;}return `<p class="err">${tr()?'böyle bir uygulama yok':'no such app'}: ${esc(arg||'?')}</p>`;}
      case 'sudo':return `<p class="err">${tr()?'Bu bilgisayarın yöneticisi Mert. İyi deneme ama 🙂':'Mert is the admin here. Nice try though 🙂'}</p>`;
      case 'meow':case 'cat':case 'meowly':return `<p>${tr()?'Meowly şu an odada, topla bitkinin arasında. Onu sevmeyi unutma.':'Meowly is in the room, between the ball and the plant. Do pet it.'}</p>`;
      default:return `<p class="err">${tr()?'komut bulunamadı':'command not found'}: ${esc(c0)}</p><p class="dim">${tr()?'/help yazarak komutları görebilirsin.':'Type /help to see the commands.'}</p>`;
    }
  }
  /* cikti bir anda gelmez: satirlar hizlica tek tek yazilir */
  function typeOut(blk,body){
    const rows=[...blk.children];if(matchMedia('(prefers-reduced-motion: reduce)').matches){body.scrollTop=body.scrollHeight;return;}
    rows.forEach((r,i)=>{if(i)r.classList.add('wait');});
    rows.forEach((r,i)=>{if(!i)return;setTimeout(()=>{r.classList.remove('wait');r.classList.add('show');body.scrollTop=body.scrollHeight;},i*55);});
    body.scrollTop=body.scrollHeight;
  }
  function termInit(w){
    const out=w.querySelector('.out'),form=w.querySelector('.in'),inp=w.querySelector('#tin'),body=w.querySelector('.mw-body'),hist=[];let hi=0;
    const run=raw=>{
      if(/^\/?clear$/i.test(raw.trim())){out.innerHTML='';return;}
      const blk=document.createElement('div');blk.className='blk';
      blk.innerHTML=`<p><span class="pr">mert@portfolio ~ %</span> ${esc(raw)}</p>${cmdOut(raw)}`;out.appendChild(blk);
      if(raw.trim()){hist.push(raw);hi=hist.length;}
      typeOut(blk,body);
    };
    w._run=run;
    out.innerHTML=`<div class="blk"><p class="dim">${tr()?'Merhaba! Aşağıdaki komutlardan birine tıkla ya da yaz.':'Hi! Click one of the commands below or type one.'}</p><p class="dim">${tr()?'Tüm komutlar için /help':'All commands: /help'}</p></div>`;typeOut(out.firstChild,w.querySelector('.mw-body'));
    form.addEventListener('submit',e=>{e.preventDefault();const v=inp.value;inp.value='';run(v);});
    inp.addEventListener('keydown',e=>{if(e.key==='ArrowUp'&&hist.length){hi=Math.max(0,hi-1);inp.value=hist[hi];e.preventDefault();}else if(e.key==='ArrowDown'){hi=Math.min(hist.length,hi+1);inp.value=hist[hi]||'';e.preventDefault();}});
    w.querySelector('.cmds').addEventListener('click',e=>{const b=e.target.closest('[data-cmd]');if(b){run(b.dataset.cmd);if(!small())inp.focus({preventScroll:true});}});
    body.addEventListener('click',e=>{if(!e.target.closest('button,a')&&!getSelection().toString()&&!small())inp.focus({preventScroll:true});});
    if(!small())setTimeout(()=>inp.focus({preventScroll:true}),50);
  }

  /* ---------- pencereler ---------- */
  function titleOf(id){const a=APPS[id];return (a.title||a.name)();}
  function focusWin(w){w.style.zIndex=++z;for(const x of wins.values())x.classList.toggle('front',x===w);appName.textContent=titleOf(w.dataset.app);paintDock();}
  function place(w,a){
    const area=winsEl.getBoundingClientRect(),n=wins.size;
    const ww=Math.min(a.w,area.width-24),hh=Math.min(a.h,area.height-20);
    w.style.width=ww+'px';w.style.height=hh+'px';
    w.style.left=Math.max(8,Math.round((area.width-ww)/2+((n%6)-2)*28))+'px';
    w.style.top=Math.max(6,Math.round((area.height-hh)/2.4+((n%6)-2)*24))+'px';
  }
  let fromRect=null;
  function openApp(id){
    if(id==='exit'){close();return;}
    let a=APPS[id];if(!a)return;
    /* bilgisayarda proje simgesi dogrudan sitesine gider; odadan (raftan) gelince proje karti acilir */
    if(id.startsWith('p:')&&dive&&!a.forceWin){const p=[...PROJECTS,...WORK].find(x=>'p:'+x.id===id);if(p&&p.links.length){window.open(p.links[0].href,'_blank','noopener');return;}}
    if(a.alias){const w2=openApp(a.alias);if(w2&&w2._run&&a.run)w2._run(a.run);return w2;}
    let w=wins.get(id);
    if(w){w.hidden=false;w.classList.remove('min');focusWin(w);return w;}
    w=document.createElement('section');w.className='mw'+(a.term?' term-w':'');w.dataset.app=id;w.setAttribute('role','dialog');w.setAttribute('aria-label',titleOf(id));
    w.innerHTML=`<header class="mw-bar"><span class="lights"><button type="button" class="l cl"></button><button type="button" class="l mn"></button><button type="button" class="l zm"></button></span><span class="ttl"></span></header><div class="mw-body view" tabindex="-1"></div><i class="rz" aria-hidden="true"></i>`;
    winsEl.appendChild(w);wins.set(id,w);place(w,a);fill(w);focusWin(w);
    /* pencere tiklanan simgeden buyuyerek acilir (Mac'teki gibi) */
    if(fromRect&&!small()){const r=w.getBoundingClientRect();w.style.transformOrigin='0 0';w.style.transform=`translate(${fromRect.left-r.left}px,${fromRect.top-r.top}px) scale(${Math.max(.06,fromRect.width/r.width)},${Math.max(.06,fromRect.height/r.height)})`;
      w.getBoundingClientRect();requestAnimationFrame(()=>{w.classList.add('in','grow');w.style.transform='';setTimeout(()=>{w.classList.remove('grow');w.style.transformOrigin='';},320);});}
    else requestAnimationFrame(()=>w.classList.add('in'));
    fromRect=null;
    w.querySelector('.mw-body').focus({preventScroll:true});
    return w;
  }
  function fill(w){
    const id=w.dataset.app,a=APPS[id];
    w.querySelector('.ttl').textContent=titleOf(id);w.setAttribute('aria-label',titleOf(id));
    w.querySelector('.cl').setAttribute('aria-label',L().close);w.querySelector('.mn').setAttribute('aria-label',L().minimize);w.querySelector('.zm').setAttribute('aria-label',L().zoom);
    w.querySelector('.mw-body').innerHTML=a.render();
    if(a.init)a.init(w);
  }
  function closeWin(w){
    wins.delete(w.dataset.app);w.classList.remove('in');setTimeout(()=>w.remove(),160);
    const rest=[...wins.values()].filter(x=>!x.hidden);
    if(rest.length)focusWin(rest.sort((a,b)=>b.style.zIndex-a.style.zIndex)[0]);else{appName.textContent=L().desktop;paintDock();}
    if(!dive&&!wins.size)close();
  }
  winsEl.addEventListener('pointerdown',e=>{const w=e.target.closest('.mw');if(w)focusWin(w);});
  winsEl.addEventListener('click',e=>{
    const w=e.target.closest('.mw');if(!w)return;
    if(e.target.closest('.cl')){closeWin(w);return;}
    if(e.target.closest('.mn')){if(!dive){closeWin(w);return;}w.classList.add('min');setTimeout(()=>{w.hidden=true;},180);appName.textContent=L().desktop;paintDock();return;}
    if(e.target.closest('.zm')){w.classList.toggle('max');return;}
    const b=e.target.closest('[data-open]');if(b)openApp(b.dataset.open);
  });
  /* basliktan surukleme (telefonda pencereler tam ekran, suruklenmez) */
  winsEl.addEventListener('pointerdown',e=>{
    const head=e.target.closest('.mw-bar');if(!head||e.target.closest('.l')||small())return;
    const w=head.parentElement;if(w.classList.contains('max'))return;
    /* surukleme imleci birebir izler: konum her karede bir kez ve yalnizca 'translate' ile degisir (yeniden yerlesim yok) */
    const sx=e.clientX,sy=e.clientY,ox=w.offsetLeft,oy=w.offsetTop,area=winsEl.getBoundingClientRect(),ww=w.offsetWidth;e.preventDefault();
    try{head.setPointerCapture(e.pointerId);}catch(_){}
    let dx=0,dy=0;w.classList.add('dragging');mac.classList.add('dragging');
    /* konum olayin icinde hemen uygulanir: bir kare bile gecikme olmaz */
    const mv=ev=>{const nx=Math.min(area.width-80,Math.max(-ww+80,ox+ev.clientX-sx)),ny=Math.min(area.height-30,Math.max(0,oy+ev.clientY-sy));dx=nx-ox;dy=ny-oy;w.style.translate=dx+'px '+dy+'px';};
    const up=()=>{head.removeEventListener('pointermove',mv);head.removeEventListener('pointerup',up);head.removeEventListener('pointercancel',up);mac.classList.remove('dragging');
      w.style.left=(ox+dx)+'px';w.style.top=(oy+dy)+'px';w.style.translate='';w.classList.remove('dragging');};
    head.addEventListener('pointermove',mv);head.addEventListener('pointerup',up);head.addEventListener('pointercancel',up);
  });
  /* sag alt koseden boyutlandirma */
  winsEl.addEventListener('pointerdown',e=>{
    const g=e.target.closest('.rz');if(!g||small())return;const w=g.parentElement;if(w.classList.contains('max'))return;e.preventDefault();e.stopPropagation();
    const sx=e.clientX,sy=e.clientY,w0=w.offsetWidth,h0=w.offsetHeight;try{g.setPointerCapture(e.pointerId);}catch(_){}
    w.classList.add('dragging');mac.classList.add('dragging');
    const mv=ev=>{w.style.width=Math.max(320,w0+ev.clientX-sx)+'px';w.style.height=Math.max(220,h0+ev.clientY-sy)+'px';};
    const up=()=>{g.removeEventListener('pointermove',mv);g.removeEventListener('pointerup',up);w.classList.remove('dragging');mac.classList.remove('dragging');};
    g.addEventListener('pointermove',mv);g.addEventListener('pointerup',up);
  });
  winsEl.addEventListener('dblclick',e=>{const h=e.target.closest('.mw-bar');if(h&&!e.target.closest('.l'))h.parentElement.classList.toggle('max');});

  /* ---------- masaustu, dock, menu cubugu ---------- */
  function paintDesk(){
    desk.innerHTML=DESK.map(id=>`<button type="button" class="ico" role="listitem" data-open="${id}"><span class="i">${(APPS[id].desk||APPS[id].icon)()}</span><span class="n">${esc(APPS[id].name())}</span></button>`).join('');
  }
  function paintDock(){
    dock.innerHTML=DOCK.map(id=>{
      if(id==='|')return '<span class="sep" aria-hidden="true"></span>';
      const name=id==='exit'?L().back:APPS[id].name(),ic=id==='exit'?ICON.door():APPS[id].icon();
      const on=wins.has(id)?' on':'';
      return `<button type="button" class="dk${on}" data-open="${id}" aria-label="${esc(name)}"><span class="i">${ic}</span><i class="dot" aria-hidden="true"></i></button>`;
    }).join('');
  }
  /* masaustu: simgeye tek tik acar */
  const coarse=matchMedia('(pointer:coarse)').matches;
  const sel=b=>desk.querySelectorAll('.ico').forEach(x=>x.classList.toggle('sel',x===b));
  const openFrom=b=>{fromRect=b.querySelector('.i').getBoundingClientRect();openApp(b.dataset.open);};
  desk.addEventListener('click',e=>{const b=e.target.closest('[data-open]');if(!b)return;sel(b);openFrom(b);});
  desk.addEventListener('keydown',e=>{const b=e.target.closest('[data-open]');if(b&&e.key==='Enter'){e.preventDefault();openFrom(b);}});
  /* bos masaustunde surukleyince secim kutusu */
  const band=document.createElement('div');band.className='band';band.hidden=true;mac.appendChild(band);
  mac.addEventListener('pointerdown',e=>{
    if(e.button!==0||coarse||e.target.closest('.mw,.dock,.menubar,.dd,.ico'))return;
    if(e.target!==mac&&e.target!==desk&&e.target!==winsEl)return;
    sel(null);const m=mac.getBoundingClientRect(),sx=e.clientX,sy=e.clientY;
    const mv=ev=>{const x0=Math.min(sx,ev.clientX),y0=Math.min(sy,ev.clientY),x1=Math.max(sx,ev.clientX),y1=Math.max(sy,ev.clientY);
      if(x1-x0<4&&y1-y0<4)return;band.hidden=false;Object.assign(band.style,{left:x0-m.left+'px',top:y0-m.top+'px',width:x1-x0+'px',height:y1-y0+'px'});
      desk.querySelectorAll('.ico').forEach(b=>{const r=b.querySelector('.i').getBoundingClientRect();b.classList.toggle('sel',r.right>x0&&r.left<x1&&r.bottom>y0&&r.top<y1);});};
    const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);band.hidden=true;};
    addEventListener('pointermove',mv);addEventListener('pointerup',up);
  });
  dock.addEventListener('click',e=>{const b=e.target.closest('[data-open]');if(!b)return;b.classList.remove('hop');void b.offsetWidth;b.classList.add('hop');fromRect=b.querySelector('.i').getBoundingClientRect();openApp(b.dataset.open);});
  /* dock buyutmesi: imlece yakin simgeler buyur */
  let mx=null,mraf=0;
  function mag(){mraf=0;if(mx===null)return;for(const b of dock.querySelectorAll('.dk')){const r=b.getBoundingClientRect(),d=(mx-(r.left+r.width/2))/62;b.style.setProperty('--s',(1+.62*Math.exp(-d*d)).toFixed(3));}}
  dock.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||small())return;mx=e.clientX;dock.classList.add('mag');if(!mraf)mraf=requestAnimationFrame(mag);});
  dock.addEventListener('pointerleave',()=>{mx=null;dock.classList.remove('mag');for(const b of dock.querySelectorAll('.dk'))b.style.setProperty('--s',1);});
  bar.querySelector('.lng').addEventListener('click',()=>api.setLang(lang==='tr'?'en':'tr'));
  bar.querySelector('.exit').addEventListener('click',close);
  function paintBar(){
    bar.querySelector('.logo').dataset.menu='logo';bar.querySelector('.logo').innerHTML='<svg viewBox="0 0 16 16"><path fill="currentColor" d="M5 2.5a1.6 2 0 1 1 0 4 1.6 2 0 0 1 0-4zm6 0a1.6 2 0 1 1 0 4 1.6 2 0 0 1 0-4zM2 6.6a1.4 1.7 0 1 1 0 3.4 1.4 1.7 0 0 1 0-3.4zm12 0a1.4 1.7 0 1 1 0 3.4 1.4 1.7 0 0 1 0-3.4zM8 7.5c2.3 0 4.4 2.5 4.4 4.6 0 1.4-1 2-2.2 2-1 0-1.4-.5-2.2-.5s-1.2.5-2.2.5c-1.2 0-2.2-.6-2.2-2C3.6 10 5.7 7.5 8 7.5z"/></svg>';
    bar.querySelector('.menus').innerHTML=L().menus.map((m,i)=>`<button type="button" class="mi" data-menu="${i}">${esc(m)}</button>`).join('');
    bar.querySelector('.lng').textContent=lang==='tr'?'EN':'TR';bar.querySelector('.lng').setAttribute('aria-label',lang==='tr'?'Switch to English':'Türkçeye geç');
    const ex=bar.querySelector('.exit');ex.textContent=L().back;
    bar.querySelector('.sys').innerHTML='<svg viewBox="0 0 18 14"><path d="M9 12.5l2.2-2.6a3.2 3.2 0 0 0-4.4 0zM4.2 7.3a7 7 0 0 1 9.6 0l-1.3 1.6a5 5 0 0 0-7 0zM1.5 4.4a11 11 0 0 1 15 0l-1.3 1.5a9 9 0 0 0-12.4 0z" fill="currentColor"/></svg>';
  }
  function tick(){
    const d=new Date(),loc=lang==='tr'?'tr-TR':'en-US';
    clock.innerHTML=`<span class="d">${esc(d.toLocaleDateString(loc,{weekday:'short',day:'numeric',month:'short'}))}&nbsp;&nbsp;</span>${esc(d.toLocaleTimeString(loc,{hour:'2-digit',minute:'2-digit'}))}`;
  }
  function paintAll(){paintBar();paintDesk();paintDock();tick();for(const w of wins.values())fill(w);const f=[...wins.values()].find(w=>w.classList.contains('front')&&!w.hidden);appName.textContent=f?titleOf(f.dataset.app):L().desktop;}

  /* ---------- menu cubugu: acilir menuler (Mac'teki gibi) ---------- */
  const dd=document.createElement('div');dd.className='dd';dd.hidden=true;dd.setAttribute('role','menu');mac.appendChild(dd);
  const front=()=>[...wins.values()].filter(w=>!w.hidden).sort((a,b)=>b.style.zIndex-a.style.zIndex)[0];
  function items(k){
    const T=(a,b)=>tr()?a:b,f=front();
    const go=SECTIONS.map(id=>[APPS[id].name(),()=>openApp(id)]);
    return ({
      logo:[[T('Bu Mac hakkında','About This Mac'),()=>openApp('sys')],'-',[L().back,close]],
      0:[[T('Yeni Terminal penceresi','New Terminal window'),()=>openApp('terminal')],[T('Projeler klasörünü aç','Open Projects folder'),()=>openApp('projects')],'-',[T('Pencereyi kapat','Close window'),f&&(()=>closeWin(f))]],
      1:[[T('E-postayı kopyala','Copy e-mail'),()=>{const m=CONTACT.find(c=>c.href.startsWith('mailto:'));if(m&&navigator.clipboard)navigator.clipboard.writeText(m.text).catch(()=>{});}],[T('Terminali temizle','Clear Terminal'),wins.get('terminal')&&(()=>{const o=wins.get('terminal').querySelector('.out');if(o)o.innerHTML='';})]],
      2:[[mac.classList.contains('dark')?T('Açık görünüm','Light appearance'):T('Koyu görünüm','Dark appearance'),()=>{const dk=!mac.classList.contains('dark');mac.classList.toggle('dark',dk);mac.style.background=wallpaperURL(dk)+' center / cover no-repeat';}],[T('Tam ekran','Full screen'),document.fullscreenEnabled&&(()=>{document.fullscreenElement?document.exitFullscreen():el.requestFullscreen().catch(()=>{});})]],
      3:go,
      4:[[L().minimize,f&&(()=>f.querySelector('.mn').click())],[L().zoom,f&&(()=>f.classList.toggle('max'))],[T('Tüm pencereleri kapat','Close all windows'),wins.size&&(()=>{for(const w of [...wins.values()])closeWin(w);})],...(wins.size?['-',...[...wins.values()].map(w=>['• '+titleOf(w.dataset.app),()=>openApp(w.dataset.app)])]:[])],
      5:[[T('Terminal komutları','Terminal commands'),()=>{const w=openApp('terminal');w&&w._run&&w._run('/help');}],[T('GitHub profilim','My GitHub'),()=>{const g=CONTACT.find(c=>/github/.test(c.href));if(g)window.open(g.href,'_blank','noopener');}]],
    })[k]||[];
  }
  let ddFor=null;
  function openMenu(btn){
    const k=btn.dataset.menu;if(ddFor===btn){closeMenu();return;}
    const list=items(k);dd.innerHTML=list.map((it,i)=>it==='-'?'<hr>':`<button type="button" role="menuitem" data-i="${i}"${it[1]?'':' disabled'}>${esc(it[0])}</button>`).join('');
    dd._list=list;const r=btn.getBoundingClientRect(),m=mac.getBoundingClientRect();
    dd.style.left=Math.min(r.left-m.left,m.width-240)+'px';dd.hidden=false;ddFor=btn;
    bar.querySelectorAll('[data-menu]').forEach(b=>b.classList.toggle('act',b===btn));
  }
  function closeMenu(){dd.hidden=true;ddFor=null;bar.querySelectorAll('[data-menu]').forEach(b=>b.classList.remove('act'));}
  bar.addEventListener('click',e=>{const b=e.target.closest('[data-menu]');if(b){e.stopPropagation();openMenu(b);}});
  bar.addEventListener('pointerover',e=>{const b=e.target.closest('[data-menu]');if(b&&ddFor&&b!==ddFor)openMenu(b);});
  dd.addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(!b)return;const it=dd._list[+b.dataset.i];closeMenu();if(it&&it[1])it[1]();});
  mac.addEventListener('pointerdown',e=>{if(!dd.hidden&&!e.target.closest('.dd,[data-menu]'))closeMenu();});

  /* ---------- acma / kapama ---------- */
  function routeTo(r){
    const[sec,sub]=(r||'about').split('/');
    if(sub&&APPS['p:'+sub])return'p:'+sub;
    return SECTIONS.includes(sec)?sec:'about';
  }
  function show(r,d){
    const wasOpen=open;dive=!!d;
    el.classList.toggle('dive',dive);mac.classList.toggle('solo',!dive);
    const dk=document.documentElement.dataset.theme==='dark';mac.classList.toggle('dark',dk);mac.style.background=dive?wallpaperURL(dk)+' center / cover no-repeat':'';
    if(!open){open=true;lastFocus=document.activeElement;el.hidden=false;requestAnimationFrame(()=>el.classList.add('on'));clearInterval(clockT);clockT=setInterval(tick,15000);}
    if(!wasOpen){for(const w of wins.values())w.remove();wins.clear();}
    paintAll();
    if(!dive)openApp(routeTo(r));
  }
  function close(){
    if(!open)return;
    open=false;el.classList.remove('on');clearInterval(clockT);
    setTimeout(()=>{if(!open){el.hidden=true;for(const w of wins.values())w.remove();wins.clear();}},220);
    if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});
    o.onClose&&o.onClose();
  }
  /* bos alana (odanin ustundeki karartmaya) tiklayinca kapanir */
  el.addEventListener('click',e=>{if(!dive&&(e.target===el||e.target===mac||e.target===winsEl))close();});
  addEventListener('keydown',e=>{
    if(!open||e.key!=='Escape')return;
    if(!dd.hidden){closeMenu();return;}
    const f=[...wins.values()].filter(w=>!w.hidden).sort((a,b)=>b.style.zIndex-a.style.zIndex)[0];
    if(f)closeWin(f);else close();
  });
  const api={
    show,close,t,L,
    isOpen:()=>open,
    covers:()=>open&&dive,
    lang:()=>lang,
    setLang(l){lang=l;try{localStorage.setItem('lang',l);}catch(e){}document.documentElement.lang=l;if(open)paintAll();o.onLang&&o.onLang(l);},
  };
  return api;
}
