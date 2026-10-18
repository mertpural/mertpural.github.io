(()=>{
"use strict";
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const qp0=new URLSearchParams(location.search);
const bub=document.getElementById('bub'),muteBtn=document.getElementById('mute');
let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let S=4,W=0,H=0,T=0,last=performance.now();
const O='#f1eeeb',D='#cdc7c2',C='#ffffff',P='#f2a1b0',K='#1b1b24',WH='#ffffff',AM='#e2a43a',AMD='#b97a1e',GR='#8a7f78';
const rnd=(a,b)=>a+Math.random()*(b-a), clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

/* ---------- world ---------- */
const cat={x:60,y:80,dir:1,state:'sit',t:0,wait:2.5,tx:0,ty:0,phase:0,bats:0,interestUntil:0,batHit:false,petCount:0,petLast:-99,bellyUntil:0,lastMeow:-9,nextBlink:2,blink:0,printD:0,heartT:0,hunger:.8,thirst:.8,nextBeg:22,nextBox:35,nextDoor:90,boxStay:0,awayDur:0,exitDir:1,nextStartle:0,wantBowl:null,wantAt:0,bowl:null,eatDur:0,eatSnd:0,};
const box={x:0,y:0};
const bowls=[{type:'food',x:30,y:0,level:0,fill:0},{type:'water',x:54,y:0,level:0,fill:0}];
let drops=[];
const ball={x:150,y:90,vx:0,vy:0,held:false,rot:0,z:0,lastMove:-99,thread:0};
const ptr={x:-99,y:-99,down:false,dx:0,dy:0};
let lastInteract=0, hearts=[], prints=[], zs=[], stars=[];
const mkStars=()=>{stars=[];for(let i=0;i<34;i++)stars.push({x:Math.random(),y:Math.random(),p:Math.random()*6,s:1});};
function bounds(){return{minX:16,maxX:W-16,minY:30,maxY:H-6}}
function resize(){
  S=clamp(Math.round(Math.min(innerWidth/110,innerHeight/130)),3,6);
  W=Math.ceil(innerWidth/S);H=Math.ceil(innerHeight/S);
  cv.width=W;cv.height=H;cv.style.width=W*S+'px';cv.style.height=H*S+'px';
  ctx.imageSmoothingEnabled=false;
  for(const bw of bowls)bw.y=H-9;
  bowls[0].x=Math.round(Math.max(26,W*.14));bowls[1].x=bowls[0].x+Math.round(Math.max(24,W*.13));
  box.x=W-Math.round(Math.max(18,W*.14));box.y=H-8;
  const b=bounds();cat.x=clamp(cat.x,b.minX,b.maxX);cat.y=clamp(cat.y,b.minY,b.maxY);
  ball.x=clamp(ball.x,6,W-6);ball.y=clamp(ball.y,10,H-5);
}
addEventListener('resize',resize);
resize();mkStars();
cat.x=W*.28;cat.y=H*.74;ball.x=W*.72;ball.y=H*.82;

/* ---------- audio (sounds/ klasorundeki kayitlar; yuklenemezse kodla uretilen yedek ses calar) ---------- */
let ac=null,master=null,muted=false,purr=null,noiseBuf=null;
const SND={},CRUNCH_AT=[.5,1.3,2.5,3.25,4.15,5,6];
function loadSnd(n,u){fetch(u).then(r=>r.arrayBuffer()).then(b=>ac.decodeAudioData(b)).then(d=>{SND[n]=d;}).catch(()=>{});}
function playSnd(n,o){
  const b=SND[n];if(!ac||muted||!b)return false;
  o=o||{};const r=o.rate||1,v=o.vol||1,off=o.off||0,dur=Math.min(o.dur||b.duration,b.duration-off),t=ac.currentTime,end=t+dur/r;
  const s=ac.createBufferSource(),g=ac.createGain();
  s.buffer=b;s.playbackRate.value=r;
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.setValueAtTime(v,Math.max(t+.011,end-.04));g.gain.linearRampToValueAtTime(.0001,end);
  s.connect(g);g.connect(master);s.start(t,off,dur);return true;
}
function unlock(){
  if(!ac){try{ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=.6;master.connect(ac.destination);}catch(e){ac=null;}}
  if(ac&&ac.state==='suspended')ac.resume();
  if(ac&&!SND.silent){SND.silent=1;try{const sb=ac.createBuffer(1,1,22050),ss=ac.createBufferSource();ss.buffer=sb;ss.connect(ac.destination);ss.start(0);}catch(e){}}
  if(ac&&!SND.loading){SND.loading=1;loadSnd('meow','sounds/meow.m4a');loadSnd('mrrp','sounds/mrrp.m4a');loadSnd('meowOld','sounds/meow-old.m4a');loadSnd('purr','sounds/purr.m4a');loadSnd('crunch','sounds/crunch.m4a');loadSnd('water','sounds/water.mp3');loadSnd('bite','sounds/bite.m4a');loadSnd('lap','sounds/lap.m4a');loadSnd('munch','sounds/munch.m4a');}
}
function meow(kind){
  if(!ac||muted)return;
  if(kind==='mrrp'?(playSnd('mrrp',{rate:rnd(.97,1.08),vol:.9})||playSnd('meowOld',{dur:.3,rate:1.15,vol:.8})):(playSnd('meow',{rate:rnd(.96,1.03),vol:1})||playSnd('meowOld',{rate:rnd(.88,.96),vol:.9})))return;
  const mr=kind==='mrrp',t=ac.currentTime,dur=mr?0.24:rnd(.8,.95),base=mr?rnd(190,225):rnd(235,270);
  const o=ac.createOscillator(),f=ac.createBiquadFilter(),lp=ac.createBiquadFilter(),g=ac.createGain(),l=ac.createOscillator(),lg=ac.createGain();
  o.type='sawtooth';f.type='bandpass';f.Q.value=1.8;lp.type='lowpass';lp.frequency.value=1800;
  o.frequency.setValueAtTime(base,t);
  if(mr){o.frequency.linearRampToValueAtTime(base*1.4,t+.1);o.frequency.linearRampToValueAtTime(base*1.15,t+dur);}
  else{o.frequency.linearRampToValueAtTime(base*1.45,t+.17);o.frequency.linearRampToValueAtTime(base*1.18,t+.5);o.frequency.linearRampToValueAtTime(base*.85,t+dur);}
  f.frequency.setValueAtTime(420,t);f.frequency.linearRampToValueAtTime(950,t+dur*.3);f.frequency.linearRampToValueAtTime(600,t+dur);
  l.frequency.value=5;lg.gain.value=mr?2:5;l.connect(lg);lg.connect(o.frequency);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.7,t+.05);g.gain.setValueAtTime(.7,t+dur*.6);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(f);f.connect(lp);lp.connect(g);g.connect(master);
  o.start(t);l.start(t);o.stop(t+dur+.05);l.stop(t+dur+.05);
}
function tick(vol,freq){
  if(!ac||muted)return;
  const t=ac.currentTime,len=Math.floor(ac.sampleRate*.04),b=ac.createBuffer(1,len,ac.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);
  const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();
  s.buffer=b;f.type='bandpass';f.frequency.value=freq||1400;g.gain.value=vol||.3;
  s.connect(f);f.connect(g);g.connect(master);s.start(t);
}
function burst(dur,f0,f1,gain,q){
  if(!ac||muted)return;
  const t=ac.currentTime,len=Math.floor(ac.sampleRate*dur),b=ac.createBuffer(1,len,ac.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,1.6);
  const sr=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();
  sr.buffer=b;f.type='bandpass';f.Q.value=q;f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(f1,t+dur);g.gain.value=gain;
  sr.connect(f);f.connect(g);g.connect(master);sr.start(t);
}
function crunch(){if(playSnd('bite',{dur:.32,vol:.85,rate:rnd(1.1,1.4)}))return;burst(.05,rnd(2200,3200),rnd(1200,1800),.5,2);burst(.07,320,160,.22,1);setTimeout(()=>burst(.04,rnd(1800,2600),1200,.32,2),rnd(40,70));}
let eatLoop=null;
function startEatLoop(name){
  if(eatLoop||!ac||muted||!SND[name])return false;
  const s=ac.createBufferSource(),g=ac.createGain(),t=ac.currentTime;
  s.buffer=SND[name];s.loop=true;s.loopStart=.25;s.loopEnd=SND[name].duration-.25;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.9,t+.15);
  s.connect(g);g.connect(master);s.start(t,.1);eatLoop={s,g};return true;
}
function stopEatLoop(){
  if(!eatLoop||!ac)return;const d=eatLoop,t=ac.currentTime;eatLoop=null;
  d.g.gain.cancelScheduledValues(t);d.g.gain.setValueAtTime(d.g.gain.value,t);d.g.gain.linearRampToValueAtTime(0,t+.2);d.s.stop(t+.25);
}
function sip(){burst(.09,rnd(600,800),rnd(300,420),.3,3);setTimeout(()=>burst(.05,rnd(900,1200),500,.12,2),70);}
function rattle(){if(SND.crunch&&!muted){for(let i=0;i<8;i++)setTimeout(()=>playSnd('crunch',{off:CRUNCH_AT[Math.floor(Math.random()*CRUNCH_AT.length)],dur:.12,vol:.35,rate:rnd(1.5,1.9)}),i*70);return;}
  for(let i=0;i<9;i++)setTimeout(()=>tick(.16,rnd(1800,3200)),i*65);}
function pour(){
  if(!ac||muted)return;
  if(playSnd('water',{off:.15,dur:.75,vol:.7}))return;
  const t=ac.currentTime,len=Math.floor(ac.sampleRate*.7),b=ac.createBuffer(1,len,ac.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
  const sr=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();
  sr.buffer=b;f.type='bandpass';f.Q.value=.8;f.frequency.setValueAtTime(900,t);f.frequency.linearRampToValueAtTime(1800,t+.6);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.3,t+.1);g.gain.linearRampToValueAtTime(.0001,t+.7);
  sr.connect(f);f.connect(g);g.connect(master);sr.start(t);
}
function startPurr(){
  if(!ac||muted||purr)return;
  if(SND.purr){
    const s=ac.createBufferSource(),out=ac.createGain(),t=ac.currentTime;
    s.buffer=SND.purr;s.loop=true;s.loopStart=.9;s.loopEnd=8.9;
    out.gain.setValueAtTime(0,t);out.gain.linearRampToValueAtTime(.9,t+.3);
    s.connect(out);out.connect(master);s.start(t,.9);purr={s,lfo:null,out};return;
  }
  if(!noiseBuf){const n=ac.sampleRate*2;noiseBuf=ac.createBuffer(1,n,ac.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;}
  const s=ac.createBufferSource(),bp=ac.createBiquadFilter(),am=ac.createGain(),lfo=ac.createOscillator(),lg=ac.createGain(),out=ac.createGain(),t=ac.currentTime;
  s.buffer=noiseBuf;s.loop=true;bp.type='bandpass';bp.frequency.value=170;bp.Q.value=.9;
  am.gain.value=.5;lfo.type='sawtooth';lfo.frequency.value=23;lg.gain.value=.5;lfo.connect(lg);lg.connect(am.gain);
  out.gain.setValueAtTime(0,t);out.gain.linearRampToValueAtTime(1.6,t+.3);
  s.connect(bp);bp.connect(am);am.connect(out);out.connect(master);s.start(t);lfo.start(t);
  purr={s,lfo,out};
}
function stopPurr(){
  if(!purr||!ac)return;const p=purr,t=ac.currentTime;purr=null;
  p.out.gain.cancelScheduledValues(t);p.out.gain.setValueAtTime(p.out.gain.value,t);p.out.gain.linearRampToValueAtTime(0,t+.35);
  p.s.stop(t+.4);if(p.lfo)p.lfo.stop(t+.4);
}
muteBtn.addEventListener('click',e=>{e.stopPropagation();unlock();muted=!muted;muteBtn.textContent=muted?'🔇':'🔊';if(muted){stopPurr();stopEatLoop();}});
muteBtn.addEventListener('pointerdown',e=>e.stopPropagation());
/* ---------- Tonti fotograflari (polaroid) ---------- */
const PHOTOS=[['photos/tonti-1.jpg','32% 22%'],['photos/tonti-2.jpg','50% 50%'],['photos/tonti-3.jpg','62% 32%']];
const polEl=document.getElementById('pol'),polImg=document.getElementById('polimg'),polN=document.getElementById('poln');let polI=0;
function showPhoto(){const p=PHOTOS[polI];polImg.src=p[0];polImg.style.objectPosition=p[1];polN.textContent=(polI+1)+'/'+PHOTOS.length;}
function openPolaroid(){polEl.hidden=false;showPhoto();}
function closePolaroid(){polEl.hidden=true;}
document.getElementById('cam').addEventListener('click',e=>{e.stopPropagation();unlock();openPolaroid();});
document.getElementById('cam').addEventListener('pointerdown',e=>e.stopPropagation());
polEl.addEventListener('click',e=>{if(e.target===polEl||e.target.id==='polx')closePolaroid();else{polI=(polI+1)%PHOTOS.length;const c=polEl.querySelector('.polcard');c.style.animation='none';void c.offsetWidth;c.style.animation='';showPhoto();}});
addEventListener('keydown',e=>{if(polEl.hidden)return;if(e.key==='Escape')closePolaroid();else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){polI=(polI+(e.key==='ArrowRight'?1:PHOTOS.length-1))%PHOTOS.length;showPhoto();}});
if(qp0.get('photo'))setTimeout(()=>{polI=Math.max(0,Math.min(PHOTOS.length-1,(+qp0.get('photo'))-1));openPolaroid();},600);
addEventListener('touchend',unlock,{passive:true});addEventListener('click',unlock);
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopPurr();stopEatLoop();}});

/* ---------- gun/gece ---------- */
let night=false,hourF=12,lightK=0,warmG=0;
const KF=[[0,'#070b16','#101a33',0],[5,'#0b1020','#1d2347',0],[6,'#2b2a5e','#e0785a',.3],[7,'#4a6fb0','#f2b27a',.65],[8.5,'#4f93d8','#a9d6f5',1],[12,'#3f86d6','#9fd0f4',1],[16.5,'#4f93d8','#b3d9f3',1],[18,'#4a5fa8','#f2a65f',.8],[19.5,'#2d2a5c','#e2644f',.4],[20.5,'#151a3d','#5a2f58',.1],[22,'#080d1a','#12193a',0],[24,'#070b16','#101a33',0]];
const hx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const mixC=(a,b,t)=>{const x=hx(a),y=hx(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('');};
function setMode(){
  const d=new Date(),q=parseFloat(new URLSearchParams(location.search).get('hour'));
  hourF=isNaN(q)?d.getHours()+d.getMinutes()/60:((q%24)+24)%24;
  let a=KF[0],b=KF[1];for(let i=0;i<KF.length-1;i++)if(hourF>=KF[i][0]&&hourF<=KF[i+1][0]){a=KF[i];b=KF[i+1];break;}
  const t=(hourF-a[0])/(b[0]-a[0]||1),top=mixC(a[1],b[1],t),bot=mixC(a[2],b[2],t);
  lightK=a[3]+(b[3]-a[3])*t;night=lightK<.15;
  warmG=Math.max(0,1-Math.abs(hourF-6.3)/1.6,1-Math.abs(hourF-19.2)/1.8);
  const r=document.documentElement.style;
  const dk=lightK>.6;
  const mg=document.documentElement.classList.contains('mourn');
  r.setProperty('--sky-top',mg?mixC(top,'#5c616b',.55):top);r.setProperty('--sky-bot',mg?mixC(bot,'#5c616b',.55):bot);
  r.setProperty('--ink',dk?'#0e2748':'#e6edf3');r.setProperty('--gold',dk?'#ffcf4a':'#d4a540');
  r.setProperty('--dim',dk?'#12305c':'#aab4c2');
  r.setProperty('--tsh',dk?'0 2px 0 rgba(18,48,92,.5)':'none');
}
setMode();setInterval(setMode,5000);
/* ---------- sevme sayaci ---------- */
const cntEl=document.getElementById('cnt');let pets=0,total=null;
const CNT='https://abacus.jasoncameron.dev',CNS='piercies3sc-cat',CKEY='hearts';
try{pets=parseInt(localStorage.getItem('tontiPets'),10)||0;}catch(e){}
let celebrated=null;
function noteTotal(v){const k=Math.floor(v/100);if(celebrated===null){celebrated=k;return;}if(k>celebrated){celebrated=k;celebrate(k*100);}}
function showCount(){cntEl.textContent='♥ '+(total!==null?total:pets);}
function loadTotal(){
  if(document.hidden)return;
  fetch(CNT+'/get/'+CNS+'/'+CKEY).then(r=>r.status===404?{value:0}:r.json()).then(j=>{if(typeof j.value==='number'){total=Math.max(total||0,j.value);showCount();noteTotal(total);}}).catch(()=>{});
}
showCount();loadTotal();setInterval(loadTotal,30000);
function bump(){
  pets++;try{localStorage.setItem('tontiPets',pets);}catch(e){}
  if(total!==null){total++;noteTotal(total);}showCount();
  fetch(CNT+'/hit/'+CNS+'/'+CKEY).then(r=>r.json()).then(j=>{if(typeof j.value==='number'){total=Math.max(j.value,total||0);showCount();noteTotal(total);}}).catch(()=>{});
}
/* ---------- konusma balonu ---------- */
let bubTimer=0;
function say(txt){bub.textContent=txt;bub.classList.add('on');clearTimeout(bubTimer);bubTimer=setTimeout(()=>bub.classList.remove('on'),1100);placeBub();}
function placeBub(){bub.style.left=(cat.x*S)+'px';bub.style.top=((cat.y-26)*S)+'px';}

/* ---------- input ---------- */
const toL=e=>({x:e.clientX/S,y:e.clientY/S});
const hitBall=p=>Math.hypot(p.x-ball.x,p.y-(ball.y-4-ball.z))<9;
const hitBox=p=>Math.abs(p.x-box.x)<13&&p.y>box.y-13&&p.y<box.y+2;
const hitBowl=(p,b)=>Math.abs(p.x-b.x)<9&&p.y>b.y-12&&p.y<b.y+2;
const hitCat=p=>{const h=cat.state==='belly'?[-14,19,-18,2]:cat.state==='sleep'?[-12,12,-14,2]:cat.state==='box'?[-9,9,-24,-8]:cat.state==='sit'||cat.state==='pet'||cat.state==='yawn'||cat.state==='startle'?[-9,9,-24,2]:[-12,14,-18,2];
  return p.x>=cat.x+h[0]&&p.x<=cat.x+h[1]&&p.y>=cat.y+h[2]&&p.y<=cat.y+h[3];};
let samples=[],dragOff={x:0,y:0};
addEventListener('pointerdown',e=>{
  if(e.target.closest&&e.target.closest('a,button,#pol'))return;
  unlock();const p=toL(e);ptr.x=p.x;ptr.y=p.y;ptr.down=true;lastInteract=T;
  if(hitBall(p)){
    ball.held=true;ball.vx=ball.vy=0;dragOff={x:ball.x-p.x,y:ball.y-p.y};samples=[{t:T,x:ball.x,y:ball.y}];
    cat.bats=0;cat.interestUntil=T+16;
  }else if(hitCat(p)){startPet();}
  else if(hitBox(p)){clickBox();}
  else{const bw=bowls.find(b=>hitBowl(p,b));if(bw)fillBowl(bw);}
});
addEventListener('pointermove',e=>{
  const p=toL(e);ptr.x=p.x;ptr.y=p.y;
  if(ball.held){
    ball.x=clamp(p.x+dragOff.x,6,W-6);ball.y=clamp(p.y+dragOff.y,10,H-5);ball.z=3;
    samples.push({t:T,x:ball.x,y:ball.y});while(samples.length>2&&T-samples[0].t>.12)samples.shift();
    lastInteract=T;
  }
  if(cat.state==='belly'&&ptr.down&&hitCat(p)){lastInteract=T;cat.bellyUntil=T+6;if(cat.heartT>.25){spawnHeart();cat.heartT=0;purrFor(.7);}}
  if(e.pointerType==='mouse')document.body.style.cursor=hitBall(p)?'grab':(hitCat(p)||bowls.some(b=>hitBowl(p,b)))?'pointer':'default';
});
addEventListener('keydown',e=>{
  if(e.repeat)return;const tg=document.activeElement&&document.activeElement.tagName;
  if((e.code==='Space'||e.key==='Enter')&&tg!=='A'&&tg!=='BUTTON'&&polEl.hidden){e.preventDefault();unlock();if(!['away','leave','return'].includes(cat.state))startPet();}
});
function release(){
  ptr.down=false;
  if(ball.held){
    ball.held=false;ball.z=0;
    const a=samples[0],b=samples[samples.length-1],dt=Math.max(.016,b.t-a.t);
    ball.vx=clamp((b.x-a.x)/dt,-170,170);ball.vy=clamp((b.y-a.y)/dt,-170,170);
    ball.lastMove=T;cat.interestUntil=T+14;cat.bats=0;
  }
}
addEventListener('pointerup',release);addEventListener('pointercancel',release);
addEventListener('blur',()=>{release();stopPurr();stopEatLoop();});

function clickBox(){
  lastInteract=T;
  if(cat.state==='box'){openPolaroid();return;}
  if(['sit','walk','run','watch','sleep','beg','stretch','yawn'].includes(cat.state)){cat.state='toBox';cat.t=0;cat.interestUntil=0;say('?');}
}
function fillBowl(bw){
  bw.fill=1;lastInteract=T;
  for(let i=0;i<12;i++)drops.push({bw,x:bw.x+rnd(-3,3),y:bw.y-24-i*3,vy:rnd(40,60)});
  if(bw.type==='food')rattle();else pour();
  cat.wantBowl=bw;cat.wantAt=T+1.1;
}
let purrT=0;
function purrFor(sec){startPurr();clearTimeout(purrT);purrT=setTimeout(stopPurr,sec*1000);}
const petTimes=[];let annoyedUntil=0,lastGrumble=-9;
function annoy(){
  annoyedUntil=T+30;petTimes.length=0;say('yeter!');cat.state='startle';cat.t=0;cat.nextStartle=T+30;
  setTimeout(()=>{if(['startle','sit','pet','belly','box'].includes(cat.state)){cat.exitDir=cat.x<W/2?-1:1;cat.state='leave';cat.t=0;cat.interestUntil=0;}},750);
}
function grumble(){if(T-lastGrumble>1.6){lastGrumble=T;say(['hmph.','yeter!','dur artık!'][Math.floor(Math.random()*3)]);}}
function startPet(){
  if(silence)return;
  if(T<annoyedUntil){grumble();return;}
  petTimes.push(T);while(petTimes.length&&T-petTimes[0]>8)petTimes.shift();
  if(petTimes.length>=14){annoy();return;}
  petInner();bump();
}
function petInner(){
  lastInteract=T;
  if(cat.state==='box'){cat.t=0;cat.petLast=T;cat.heartT=0;spawnHeart();spawnHeart();purrFor(1.3);if(T-cat.lastMeow>1.6){meow('mrrp');cat.lastMeow=T;}return;}
  if(cat.state==='belly'){cat.bellyUntil=T+6;cat.heartT=0;for(let i=0;i<3;i++)spawnHeart();purrFor(1.6);if(T-cat.lastMeow>2){meow('mrrp');cat.lastMeow=T;}return;}
  if(T-cat.petLast>6)cat.petCount=0;
  cat.petLast=T;cat.petCount++;cat.heartT=0;
  if(cat.petCount>=5){
    cat.petCount=0;cat.state='belly';cat.t=0;cat.bellyUntil=T+7;
    for(let i=0;i<5;i++)spawnHeart();meow('mrrp');cat.lastMeow=T;say('prrrr~');purrFor(2.5);return;
  }
  cat.state='pet';cat.t=0;
  if(T-cat.lastMeow>1.4){meow('meow');say(['meow!','nya~','mrrp?','meow~'][Math.floor(Math.random()*4)]);cat.lastMeow=T;}
  purrFor(1.3);spawnHeart();spawnHeart();
}
function spawnHeart(){hearts.push({x:cat.x+rnd(-7,7),y:cat.y-22,vy:rnd(-14,-9),life:1.2});}

/* ---------- yapay zeka ---------- */
function interested(){return ball.held||T<cat.interestUntil;}
function goChase(){cat.state='run';cat.t=0;}
function sitDown(){cat.state='sit';cat.t=0;cat.wait=rnd(2.5,5.5);}
function moveTo(tx,ty,sp,dt){
  const dx=tx-cat.x,dy=ty-cat.y,d=Math.hypot(dx,dy);
  if(d<.8)return d;
  const st=Math.min(d,sp*dt);cat.x+=dx/d*st;cat.y+=dy/d*st;
  if(Math.abs(dx)>1.5)cat.dir=dx>0?1:-1;
  cat.phase+=st*.55;
  cat.printD+=st;if(cat.printD>7){cat.printD=0;prints.push({x:cat.x-cat.dir*5,y:cat.y,life:5,s:prints.length%2});if(prints.length>40)prints.shift();}
  return d-st;
}
function updateCat(dt){
  if(eatLoop&&cat.state!=='eat')stopEatLoop();
  const b=bounds();cat.t+=dt;cat.heartT+=dt;
  cat.hunger=Math.min(1,cat.hunger+dt*.01);cat.thirst=Math.min(1,cat.thirst+dt*.012);
  if(cat.wantBowl&&T>cat.wantAt&&['sit','walk','run','watch','sleep','beg','box','stretch','yawn'].includes(cat.state)){
    cat.bowl=cat.wantBowl;cat.wantBowl=null;cat.state='toBowl';cat.t=0;cat.interestUntil=0;
  }
  if(!['pet','belly','box','leave','away','return','startle','sleep','toBox'].includes(cat.state)&&T>cat.nextStartle&&!ball.held){
    if(Math.hypot(ball.vx,ball.vy)>135&&Math.hypot(ball.x-cat.x,ball.y-cat.y)<30){cat.state='startle';cat.t=0;cat.nextStartle=T+8;cat.dir=ball.x>cat.x?-1:1;say('!');}
  }
  if(cat.state!=='pet'){/* goz kirpma */cat.nextBlink-=dt;if(cat.nextBlink<0){cat.blink=.13;cat.nextBlink=rnd(2,5);}}
  if(cat.blink>0)cat.blink-=dt;
  switch(cat.state){
    case 'sleep':
      if(interested()||T-lastInteract<2){sitDown();}
      break;
    case 'sit':
      if(interested()){goChase();break;}
      if(!reduced&&T>cat.nextBeg&&T-lastInteract>6){
        const em=bowls.filter(x=>x.fill<.05);
        if(em.length){cat.bowl=cat.hunger>=cat.thirst?(em.find(x=>x.type==='food')||em[0]):(em.find(x=>x.type==='water')||em[0]);cat.state='toBowl';cat.t=0;cat.nextBeg=T+rnd(50,80);break;}
        cat.nextBeg=T+30;
      }
      if(!reduced&&T>cat.nextBox&&T-lastInteract>4){cat.state='toBox';cat.t=0;cat.nextBox=T+rnd(50,90);break;}
      if(!reduced&&T>cat.nextDoor&&T-lastInteract>8){cat.exitDir=cat.x<W/2?-1:1;cat.state='leave';cat.t=0;cat.nextDoor=T+rnd(80,140);break;}
      if(!reduced&&cat.t>2&&Math.random()<dt*.04){cat.state=Math.random()<.5?'stretch':'yawn';cat.t=0;say(cat.state==='yawn'?'yaaawn~':'streeetch~');break;}
      if(!reduced&&cat.t>cat.wait){cat.tx=rnd(b.minX,b.maxX);cat.ty=rnd(b.minY,b.maxY);cat.state='walk';cat.t=0;}
      else if(T-lastInteract>(night?8:25)&&cat.t>3){cat.state='sleep';cat.t=0;}
      break;
    case 'walk':
      if(interested()){goChase();break;}
      if(moveTo(cat.tx,cat.ty,22,dt)<1.2)sitDown();
      break;
    case 'run':{
      if(!interested()){sitDown();break;}
      if(ball.held){
        const tx=ball.x-(ball.x>cat.x?24:-24),d=moveTo(clamp(tx,b.minX,b.maxX),clamp(ball.y,b.minY,b.maxY),50,dt);
        if(d<2){cat.dir=ball.x>cat.x?1:-1;cat.state='watch';cat.t=0;}
        break;}
      const tx=ball.x-(ball.x>cat.x?10:-10);
      moveTo(clamp(tx,b.minX,b.maxX),clamp(ball.y,b.minY,b.maxY),64,dt);
      if(Math.abs(ball.x-cat.x)<15&&Math.abs(ball.y-cat.y)<6){cat.state='bat';cat.t=0;cat.batHit=false;cat.dir=ball.x>=cat.x?1:-1;}
      break;}
    case 'watch':
      if(!ball.held){goChase();break;}
      if(Math.hypot(ball.x-cat.x,ball.y-cat.y)>34){goChase();}
      break;
    case 'bat':
      if(!cat.batHit&&cat.t>.14&&!ball.held){
        cat.batHit=true;
        const a=Math.atan2(ball.y-cat.y,ball.x-cat.x)+rnd(-.7,.7),sp=rnd(55,105);
        ball.vx=Math.cos(a)*sp;ball.vy=Math.sin(a)*sp*.7;ball.lastMove=T;ball.z=2;
        cat.bats++;tick(.35);
        if(Math.random()<.28){meow('mrrp');if(T-cat.lastMeow>1.2){say('mrrp!');}cat.lastMeow=T;}
      }
      if(cat.t>.38){
        if(cat.bats>=9){cat.interestUntil=T;cat.bats=0;sitDown();}
        else goChase();
      }
      break;
    case 'pet':
      lastInteract=T;
      if(T-cat.petLast>1.5){sitDown();}
      break;
    case 'belly':
      lastInteract=T;
      if(cat.heartT>.7){spawnHeart();cat.heartT=0;}
      if(T>cat.bellyUntil){sitDown();}
      break;
    case 'toBowl':{
      const bw=cat.bowl;
      if(moveTo(bw.x-8,bw.y-1,46,dt)<1.5){
        cat.dir=1;cat.t=0;
        if(bw.fill>.03){cat.state='eat';cat.eatDur=rnd(3.2,5.5);cat.eatSnd=0;}
        else{cat.state='beg';cat.hunger=cat.thirst=.9;meow('meow');cat.lastMeow=T;say(bw.type==='food'?'feed me?':'thirsty...');}
      }
      break;}
    case 'eat':{
      const bw=cat.bowl;cat.dir=1;
      bw.fill=Math.max(0,bw.fill-(bw.type==='food'?.11:.16)*dt);
      cat.eatSnd-=dt;if(cat.eatSnd<0){if(!eatLoop&&!startEatLoop(bw.type==='food'?'munch':'lap')){if(bw.type==='food')crunch();else sip();}cat.eatSnd=bw.type==='food'?.24:.3;}
      if(cat.t>cat.eatDur||bw.fill<.02){
        if(bw.type==='food')cat.hunger=0;else cat.thirst=0;
        say(bw.type==='food'?'yum!':'ahh~');spawnHeart();cat.nextBeg=T+rnd(60,90);sitDown();
      }
      break;}
    case 'toBox':
      if(moveTo(box.x-15,box.y,46,dt)<1.5){cat.state='box';cat.t=0;cat.boxStay=rnd(9,16);if(weather.type==='rain')cat.boxStay=Math.max(cat.boxStay,weather.until-T+2);cat.x=box.x;cat.y=box.y-1;cat.dir=1;cat.nextBox=T+rnd(60,100);say('*cozy*');}
      break;
    case 'box':
      cat.x=box.x;cat.y=box.y-1;
      if(interested()||cat.t>cat.boxStay){cat.state='sit';cat.t=0;cat.wait=rnd(2,4);cat.x=box.x-17;cat.y=box.y;}
      break;
    case 'leave':{
      if(interested()){goChase();break;}
      if(moveTo(cat.exitDir>0?W+14:-14,cat.y,26,dt)<1.5){cat.state='away';cat.t=0;cat.awayDur=Math.max(rnd(3,6),annoyedUntil-T);}
      break;}
    case 'away':
      if(cat.t>cat.awayDur||interested()){cat.x=cat.exitDir>0?-14:W+14;cat.state='return';cat.t=0;cat.tx=rnd(W*.25,W*.75);cat.ty=cat.y;}
      break;
    case 'return':
      if(interested()){goChase();break;}
      if(moveTo(cat.tx,cat.ty,26,dt)<1.5)sitDown();
      break;
    case 'stretch':if(cat.t>1.7)sitDown();break;
    case 'yawn':if(cat.t>1.5)sitDown();break;
    case 'startle':if(cat.t>.8)sitDown();break;
    case 'beg':
      if(cat.t>3.6){sitDown();}
      break;
  }
  placeBub();
}
function updateBall(dt){
  if(ball.held){ball.rot+=.0;return;}
  if(ball.z>0)ball.z=Math.max(0,ball.z-dt*18);
  const sp=Math.hypot(ball.vx,ball.vy);
  if(sp>.5){
    ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;ball.rot+=sp*dt*.28;
    const k=Math.exp(-1.5*dt);ball.vx*=k;ball.vy*=k;
    if(ball.x<6){ball.x=6;ball.vx=Math.abs(ball.vx)*.7;tick(.15);}
    if(ball.x>W-6){ball.x=W-6;ball.vx=-Math.abs(ball.vx)*.7;tick(.15);}
    if(ball.y<10){ball.y=10;ball.vy=Math.abs(ball.vy)*.7;tick(.15);}
    if(ball.y>H-5){ball.y=H-5;ball.vy=-Math.abs(ball.vy)*.7;tick(.15);}
    if(Math.hypot(ball.vx,ball.vy)<5){ball.vx=ball.vy=0;}
  }
}

/* ---------- cizim ---------- */
const R=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
function shadow(w){R(-w/2,0,w,1,'rgba(0,0,0,.30)');R(-w/2+2,1,w-4,1,'rgba(0,0,0,.2)');}
const S2='#aaa39d',QD='#e07f95',PAL={O:O,D:D,S:S2,C:C,P:P,Q:QD,G:GR,K:K};
function spr(rows,ox,oy,mir){
  for(let j=0;j<rows.length;j++){
    let r=rows[j];if(mir)r+=[...r].reverse().join('');
    for(let i=0;i<r.length;){
      const ch=r[i];let k=i;while(k<r.length&&r[k]===ch)k++;
      if(PAL[ch])R(ox+i,oy+j,k-i,1,PAL[ch]);
      i=k;
    }
  }
}
const FRONT_HEAD=[
"..O.....",
".OPO....",
".OPPO...",
".OOOOOCC",
"OOOOOOOO",
"OOOOOOOO",
"OOOOOOOO",
"OOOOOOOO",
"OOOOOOOO",
"OOOOOOOO",
"OOOOOOOO",
"DOOOOOOO",
".DOOOOOO",
"..DDOOOO"
];
const FRONT_BODY=[
"..DOOOOO",
"..DOOOOC",
"..DOOOCC",
"..DOOOCC",
"..DOOOOO",
"..DOOOOD",
"..DOOOOD",
"..DCCSCD"
];
const SBODY=[
".CCCCCCCC...",
"OOOOOOOOOOO.",
"OOOOOOOOOOOC",
"OOOOOOOOOOCC",
"DOOOOOOOOOOC",
".DOOOOOOOOD.",
"..DDDDDDDD.."
];
const SHEAD=[
"..O....O...",
".OPO..OPO..",
".OOOOOOOOO.",
"OOOOOOOOOOC",
"OOOOOOOOOOO",
"OOOOOOOOOOO",
"OOOOOOOOOOO",
"OOOOOOOOOOO",
"DOOOOOOOOOD",
".DOOOOOOODD",
"..DDDDDDD.."
];
const SLEEP=[
"...............O....O.",
".......CCCCC..OPO..OPO",
"....OOOOOOOOOOOOOOOOOO",
"..OOOOOOOOOOOOOOOOOOOO",
".OOOOOOOOOOOOOOOOOOOOO",
"OOOOOOOOOOOOOOOOOOOOOO",
"OOOOOOOOOOOOOOOOOOOOOO",
"DOOOOOOOOOOOOOOOOOOOOD",
".DDDDDDDDDDDDDDDDDDDD."
];
const BELLY=[
"...OOOOOOOOOOOOOOOO...",
"..OOOCCCCCCCCCCCCOOO..",
".OOOCCCCCCCCCCCCCCOOO.",
"OOOCCCCCCCCCCCCCCCCOOO",
"OOOCCCCCCCCCCCCCCCCOOO",
"OOOCCCCCCCCCCCCCCCCOOO",
".DOOCCCCCCCCCCCCCOOOD.",
"..DDOOOOOOOOOOOOOODD..",
"....DDDDDDDDDDDDDD...."
];
function sideCat(moving,fast,bat,eat){
  const bob=moving&&Math.sin(cat.phase*2)>0?-1:0,crouch=(bat||eat)?1:0;
  shadow(18);
  for(let i=0;i<9;i++){const k=i/8,tx=-9-Math.round(Math.sin(i*.5)*3+k*Math.sin(T*(moving?7:3.5)+i*.3)*1.6),ty=-8-i+bob,w=i<6?3:2;R(tx,ty,w,w,i>6?D:O);if(i<5)R(tx,ty,w,1,C);}
  const legs=[[2,0,D],[-5,0,D],[-1,Math.PI,O],[-8,Math.PI,O]];
  for(const[lx,off,col]of legs){
    const ph=cat.phase*(fast?1.5:1)+off,lift=moving?Math.max(0,Math.sin(ph)):0,sx=moving?Math.round(Math.cos(ph)*(fast?2:1.4)):0,h=Math.max(1,Math.round(5-lift*2));
    R(lx+sx,-5+crouch,3,h,col);R(lx+sx,-1-Math.round(lift*2)+crouch,3,1,C);R(lx+sx+1,-1-Math.round(lift*2)+crouch,1,1,S2);
  }
  spr(SBODY,-8,-12+bob+crouch);
  const dn=eat===3?5:eat?(Math.sin(T*(eat===1?11:8))>0?3:4):0,hx=eat===3?3:eat?2:0,hy=-17+bob*-1*0+bob+crouch+dn;
  spr(SHEAD,1+hx,hy);
  if(cat.blink>0||eat){R(7+hx,hy+6,3,1,GR);R(7+hx,hy+5,1,1,GR);}
  else{R(7,hy+4,3,4,AM);R(8,hy+4,2,4,K);R(7,hy+4,1,1,WH);R(9,hy+5,1,1,WH);R(7,hy+7,3,1,AMD);}
  R(11+hx,hy+6,2,2,P);R(11+hx,hy+6,1,1,QD);R(8+hx,hy+9,3,1,D);R(5+hx,hy+8,2,1,P);
  if(eat===2&&Math.sin(T*8)>.2)R(10+hx,hy+10,1,2,P);
  if(eat===3){R(3,-3,10,2,O);R(11,-3,3,2,C);R(2,-5,3,3,O);}
  if(bat){const p=Math.min(1,cat.t/.14),l=Math.round(2+p*5);R(3,-8+crouch,l,3,O);R(3+l-1,-8+crouch,1,3,C);R(3+l,-8+crouch,1,2,P);}
}
function frontCat(happy){
  const yawn=cat.state==='yawn',startle=cat.state==='startle',breathe=Math.sin(T*2.2)>.6?1:0;
  const sway=happy?Math.round(Math.sin(T*9)):0,dip=happy?(Math.floor(T*9)%2):breathe;
  shadow(16);
  for(let i=0;i<10;i++){const w=i<7?3:2,tx=6+Math.round(Math.sin(T*2.2+i*.7)*1.8)+(i>5?1:0);R(tx,-2-i,w,w,i>8?D:O);if(i<6)R(tx,-2-i,1,w,C);}
  spr(FRONT_BODY,-8,-8,true);
  ctx.translate(sway,dip);
  spr(FRONT_HEAD,-8,-22,true);
  R(-2,-12,4,2,C);
  R(-12,-13,4,1,'rgba(255,255,255,.5)');R(8,-13,4,1,'rgba(255,255,255,.5)');R(-12,-11,4,1,'rgba(255,255,255,.35)');R(8,-11,4,1,'rgba(255,255,255,.35)');
  R(-1,-12,2,1,P);R(-2,-11,1,1,GR);R(1,-11,1,1,GR);R(-1,-10,2,1,GR);
  R(-7,-12,happy?3:2,1,P);R(happy?4:5,-12,happy?3:2,1,P);
  if(happy){
    R(-6,-13,1,1,GR);R(-5,-14,2,1,GR);R(-3,-13,1,1,GR);R(2,-13,1,1,GR);R(3,-14,2,1,GR);R(5,-13,1,1,GR);
  }else if(cat.blink>0||yawn){R(-6,-14,4,1,GR);R(2,-14,4,1,GR);}
  else{
    const lx=ptr.x<cat.x-6?-1:ptr.x>cat.x+6?1:0,ly=ptr.y<cat.y-26?-1:ptr.y>cat.y-4?1:0,px=-5+lx,ph=startle?2:4;
    R(-6,-16,4,4,AM);R(2,-16,4,4,AM);R(-6,-16,4,1,AMD);R(2,-16,4,1,AMD);
    R(px,-16+(startle?1:0)+Math.max(0,ly),2,ph-Math.max(0,ly),K);R(px+8,-16+(startle?1:0)+Math.max(0,ly),2,ph-Math.max(0,ly),K);
    R(-6,-15,1,1,WH);R(2,-15,1,1,WH);R(-3,-13,1,1,'rgba(255,255,255,.7)');R(5,-13,1,1,'rgba(255,255,255,.7)');
  }
  if(yawn){R(-2,-11,4,3,'#9c3f55');R(-1,-9,2,1,'#e88aa0');}
  if(HOLIDAY&&HOLIDAY.kind==='newyear'){R(-5,-23,10,2,'#fff');R(-4,-26,8,3,'#d93636');R(-2,-29,5,3,'#d93636');R(2,-31,4,4,'#fff');}
  if(startle){R(-10,-18,2,1,C);R(8,-18,2,1,C);R(-11,-14,2,1,C);R(9,-14,2,1,C);R(-3,-23,1,2,C);R(2,-23,1,2,C);}
  ctx.translate(-sway,-dip);
}
function sleepCat(){
  const br=Math.sin(T*1.8)>0?1:0,ear=Math.sin(T*.9)>.97?1:0;shadow(24);
  R(-13,-3,4,2,O);R(-14,-5,3,3,O);R(-13,-6,2,1,C);R(-12,-2,2,1,D);
  spr(SLEEP,-11,-9);
  if(br)R(-6,-8,10,1,O);
  R(-5,-7,7,1,C);
  R(3,-5,3,1,GR);R(7,-5,3,1,GR);R(2,-4,1,1,P);R(10,-4,1,1,P);R(6,-4,2,1,P);R(5,-3,1,1,GR);R(8,-3,1,1,GR);
  if(ear)R(8,-9,3,1,D);
}
function bellyCat(){
  const w=Math.sin(T*9)>0?1:0;shadow(28);
  R(-17,-5,3,3,O);R(-16,-6,3,2,C);R(-19,-3,3,2,D);
  spr(BELLY,-11,-9);
  R(-4,-5,8,1,'#e6e1dc');R(-2,-6,4,1,'#e6e1dc');
  const legs=[[-11,-13,5],[-5,-14+w,6],[2,-14+(1-w),6],[8,-13,5]];
  for(const[lx,ly,h]of legs){R(lx,ly,3,h,O);R(lx,ly,3,2,C);R(lx+1,ly+1,1,1,P);R(lx,ly+h-1,1,1,D);}
  /* kafa */
  R(11,-12,9,1,C);R(10,-11,11,8,O);R(11,-3,9,1,D);R(10,-5,1,2,D);R(11,-15,3,3,O);R(18,-15,3,3,O);R(12,-14,1,2,P);R(19,-14,1,2,P);
  R(11,-10,1,1,GR);R(12,-11,2,1,GR);R(14,-10,1,1,GR);R(16,-10,1,1,GR);R(17,-11,2,1,GR);R(19,-10,1,1,GR);
  R(11,-7,2,1,P);R(18,-7,2,1,P);R(13,-7,5,3,C);R(14,-8,3,1,P);R(15,-5,1,1,D);R(14,-6,1,1,D);R(16,-6,1,1,D);
}
function drawBoxBack(){const x=Math.round(box.x),y=Math.round(box.y);R(x-10,y-11,20,4,'#7a5530');R(x-13,y-13,3,4,'#c99a5f');R(x+10,y-13,3,4,'#c99a5f');}
function drawBoxFront(){
  const x=Math.round(box.x),y=Math.round(box.y);
  R(x-11,y,22,1,'rgba(0,0,0,.3)');
  R(x-11,y-9,22,9,'#b98a52');R(x-11,y-9,22,1,'#d9a96b');R(x-11,y-1,22,1,'#8a6234');R(x-11,y-9,1,9,'#a47843');R(x+10,y-9,1,9,'#8f6638');
  R(x-1,y-9,3,5,'#e8d3a8');R(x-6,y-5,2,1,'#a47843');R(x+4,y-4,3,1,'#a47843');
}
const CLOUDS=[{x:.1,y:.16,s:1,v:1.6},{x:.45,y:.09,s:1.4,v:1.1},{x:.75,y:.24,s:.9,v:2},{x:.3,y:.34,s:.8,v:1.3}];
const CLOUD_PAT=['..####....','.######.#.','##########','.########.'];
function drawSky(){
  /* yildizlar */
  const starA=Math.max(0,1-lightK*1.5);
  if(starA>.02)for(const s of stars){if(s.p>starA*6.3)continue;ctx.globalAlpha=starA*(.25+.45*Math.abs(Math.sin(T*.8+s.p)));R(Math.floor(s.x*W),Math.floor(s.y*H),s.s,s.s,'#cdd9e5');}
  /* gunes */
  if(hourF>5.4&&hourF<20.2){
    const pr=(hourF-5.6)/14.4,alt=Math.sin(Math.PI*Math.min(1,Math.max(0,pr))),sx=Math.round(W*(.07+.86*pr)),sy=Math.round(H*(.66-.54*alt));
    const col=mixC('#ff7a3d','#ffe36e',Math.min(1,alt*1.6)),rim=mixC('#ff5a2a','#ffc83d',Math.min(1,alt*1.6));
    for(const[r,al]of[[13,.07+.07*(1-alt)],[10,.10],[8,.14]]){ctx.globalAlpha=al;for(let dy=-r;dy<=r;dy++){const sp2=Math.floor(Math.sqrt(r*r-dy*dy));R(sx-sp2,sy+dy,2*sp2+1,1,col);}}
    ctx.globalAlpha=1;
    const sp=['..###..','.#####.','#######','#######','#######','.#####.','..###..'];
    for(let j=0;j<7;j++)for(let i=0;i<7;i++)if(sp[j][i]==='#')R(sx+i-3,sy+j-3,1,1,(i+j<5&&j<3)?col:rim);
    const ph=Math.floor(T*1.6)%2;ctx.globalAlpha=.8;
    if(ph){R(sx-1,sy-7,3,1,col);R(sx-1,sy+7,3,1,col);R(sx-7,sy-1,1,3,col);R(sx+7,sy-1,1,3,col);}
    else{R(sx-6,sy-6,1,1,col);R(sx+6,sy-6,1,1,col);R(sx-6,sy+6,1,1,col);R(sx+6,sy+6,1,1,col);}
    ctx.globalAlpha=1;
  }
  /* ay */
  if(hourF>=19||hourF<6.8){
    const pr=((hourF>=19?hourF-19:hourF+5)/11.8),alt=Math.sin(Math.PI*Math.min(1,pr)),mx=Math.round(W*(.08+.84*pr)),my=Math.round(H*(.5-.38*alt));
    const m=['..###..','.##....','##.....','##.....','##.....','.##....','..###..'];
    ctx.globalAlpha=Math.min(1,.2+.8*(1-lightK*1.3));
    for(let j=0;j<7;j++)for(let i=0;i<7;i++)if(m[j][i]==='#')R(mx+i-3,my+j-3,1,1,'#f1e7b8');
    ctx.globalAlpha=1;
  }
  /* bulutlar */
  if(lightK>.45){
    ctx.globalAlpha=Math.min(.92,(lightK-.45)*1.8);
    for(const c of CLOUDS){
      const cx=Math.floor(((c.x*W+T*c.v)%(W+40))-20),cy=Math.floor(c.y*H),sc=Math.max(1,Math.round(c.s*2));
      for(let j=0;j<CLOUD_PAT.length;j++)for(let i=0;i<10;i++)if(CLOUD_PAT[j][i]==='#')R(cx+i*sc,cy+j*sc,sc,sc,j===3?'#dfe9f5':'#ffffff');
    }
    ctx.globalAlpha=1;
  }
  /* tepeler */
  const farC=mixC(mixC('#0f1628','#6fae78',lightK),'#6a3858',warmG*.75),nearC=mixC(mixC('#0a0f1c','#4c8f55',lightK),'#2a1d3a',warmG*.8);
  for(let x=0;x<W;x++){
    const f=Math.round(10+3*Math.sin(x*.045+1)+2*Math.sin(x*.13)),n=Math.round(6+2.5*Math.sin(x*.07+2)+1.5*Math.sin(x*.21));
    R(x,H-f,1,f,farC);R(x,H-n,1,n,nearC);
  }
  ctx.globalAlpha=1;
}
function drawBowl(bw){
  const x=Math.round(bw.x),y=Math.round(bw.y),food=bw.type==='food';
  R(x-6,y,12,1,'rgba(0,0,0,.3)');
  R(x-6,y-4,12,4,food?'#e0a96d':'#8bbbe6');R(x-5,y-1,10,1,food?'#b9824a':'#5f93c4');R(x-6,y-4,12,1,food?'#f4cf9d':'#bddcf3');
  const lv=bw.level;
  if(lv>.03){
    if(food){const h=Math.max(1,Math.round(lv*3));R(x-4,y-4-h,8,h,'#a65f35');R(x-3,y-4-h,1,1,'#d08a55');R(x,y-3-h,1,1,'#7b3f1f');R(x+2,y-4-h,1,1,'#d08a55');}
    else{R(x-5,y-4,10,1,'#3f8fd0');if(lv>.5){R(x-5,y-5,10,1,'#4aa3df');R(x-3,y-5,2,1,'#b9e1ff');}}
  }else{R(x-5,y-4,10,1,'#4b535d');
    ctx.globalAlpha=.35+.35*Math.abs(Math.sin(T*2.5));R(x-1,y-9,3,1,'#e6edf3');R(x,y-10,1,3,'#e6edf3');ctx.globalAlpha=1;}
}
function heart(x,y,a){
  const pat=['.#.#.','#####','#####','.###.','..#..'];ctx.globalAlpha=a;
  for(let j=0;j<5;j++)for(let i=0;i<5;i++)if(pat[j][i]==='#')R(Math.round(x)+i-2,Math.round(y)+j,1,1,(i+j<3&&j<2)?'#ff9ec0':'#ff6b9a');
  ctx.globalAlpha=1;
}
function zGlyph(x,y,s,a){ctx.globalAlpha=a;const c='#9bb6ff';R(x,y,s,1,c);for(let i=0;i<s;i++)R(x+s-1-i,y+1+i-(i>0?0:0),1,1,c);R(x,y+s,s,1,c);ctx.globalAlpha=1;}
function drawBall(){
  const cx=Math.round(ball.x),cy=Math.round(ball.y-4-ball.z),sw=ball.z>0?5:7;
  R(cx-sw/2|0,Math.round(ball.y),sw,1,'rgba(0,0,0,.3)');R((cx-sw/2|0)+1,Math.round(ball.y)+1,sw-2,1,'rgba(0,0,0,.2)');
  const ws=[3,7,9,9,9,9,9,7,3];
  for(let j=0;j<9;j++)R(cx-((ws[j]-1)/2),cy-4+j,ws[j],1,'#e5534b');
  R(cx-2,cy-3,2,1,'#ff9a92');R(cx-3,cy-2,1,1,'#ff9a92');
  for(let k=0;k<3;k++){const a=ball.rot+k*2.1;R(Math.round(cx+Math.cos(a)*2.4),Math.round(cy+Math.sin(a)*2.4),2,1,'#b8322b');}
  const sp=Math.hypot(ball.vx,ball.vy);let ax=0,ay=0;
  if(sp>4){ax=-ball.vx/sp;ay=-ball.vy/sp;}else{ax=-1;ay=.3;}
  for(let i=0;i<6;i++){R(Math.round(cx+ax*(5+i)+Math.sin(T*8+i)*.7*(sp>4?1:0)),Math.round(cy+3+ay*(5+i)*.4+(sp>4?0:i*.2)),1,1,'#ff7a70');}
}
function draw(){
  ctx.clearRect(0,0,W,H);
  drawSky();drawHoliday();drawShoot();drawWeatherBack();
  ctx.globalAlpha=1;
  for(const p of prints){ctx.globalAlpha=clamp(p.life/5,0,1)*.22;R(Math.round(p.x),Math.round(p.y)+(p.s?1:-1),2,2,'#cdd9e5');R(Math.round(p.x)-1,Math.round(p.y)-1+(p.s?1:-1),1,1,'#cdd9e5');}
  ctx.globalAlpha=1;
  const items=[{y:cat.y,f:()=>{
      if(cat.state==='away')return;
      const jy=cat.state==='startle'?-Math.round(Math.sin(Math.min(1,cat.t/.4)*Math.PI)*6):0;
      ctx.save();ctx.translate(Math.round(cat.x),Math.round(cat.y)+jy);
      if(cat.state==='sleep'){ctx.scale(cat.dir,1);sleepCat();}
      else if(cat.state==='belly'){bellyCat();}
      else if(cat.state==='sit'||cat.state==='pet'||cat.state==='watch'||cat.state==='beg'||cat.state==='yawn'||cat.state==='startle'||cat.state==='box'){frontCat((cat.state==='pet'||cat.state==='box')&&T-cat.petLast<.6);}
      else{ctx.scale(cat.dir,1);sideCat(cat.state==='walk'||cat.state==='run'||cat.state==='toBowl'||cat.state==='toBox'||cat.state==='leave'||cat.state==='return',cat.state==='run',cat.state==='bat',cat.state==='eat'?(cat.bowl.type==='food'?1:2):cat.state==='stretch'?3:0);}
      ctx.restore();}},{y:ball.y,f:drawBall},...bowls.map(bw=>({y:bw.y,f:()=>drawBowl(bw)})),{y:box.y-2,f:drawBoxBack},{y:box.y+.5,f:drawBoxFront}].sort((a,b)=>a.y-b.y);
  items.forEach(i=>i.f());
  for(const d of drops){if(d.bw.type==='food')R(Math.round(d.x),Math.round(d.y),1,1,'#a65f35');else R(Math.round(d.x),Math.round(d.y),1,2,'#4aa3df');}
  for(const h of hearts)heart(h.x,h.y,clamp(h.life,0,1));
  drawWeatherFront();drawConfetti();
  if(cat.state==='sleep'){for(let i=0;i<3;i++){const ph=((T*5+i*6)%18);zGlyph(Math.round(cat.x+10+i*3),Math.round(cat.y-12-ph),2+(i>1?1:0),clamp(1-ph/18,0,1));}}
}
/* ---------- bayramlar, hava, kayan yildiz, konfeti ---------- */
const qp=new URLSearchParams(location.search);
function todayYMD(){const q=qp.get('date'),m=q&&q.match(/^(?:(\d{4})-)?(\d{1,2})-(\d{1,2})$/);if(m)return{y:m[1]?+m[1]:new Date().getFullYear(),m:+m[2],d:+m[3]};const n=new Date();return{y:n.getFullYear(),m:n.getMonth()+1,d:n.getDate()};}
const NATIONAL=[[4,23,'23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kutlu olsun!','23 Nisan kutlu olsun!'],[5,19,"19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramı kutlu olsun!",'19 Mayıs kutlu olsun!'],[8,30,'30 Ağustos Zafer Bayramı kutlu olsun!','30 Ağustos kutlu olsun!'],[10,28,'Cumhuriyet Bayramı arifesi, yarın 29 Ekim!','yarın 29 Ekim!'],[10,29,'29 Ekim Cumhuriyet Bayramı kutlu olsun!','29 Ekim kutlu olsun!']];
function findHoliday(){
  const t=todayYMD();
  if(t.m===11&&t.d===10)return{kind:'mourning',full:'10 Kasım · Saygı ve özlemle anıyoruz',short:''};
  for(const h of NATIONAL)if(h[0]===t.m&&h[1]===t.d)return{kind:'national',full:h[2],short:h[3]};
  if((t.m===12&&t.d===31)||(t.m===1&&t.d===1))return{kind:'newyear',full:'Mutlu yıllar! 🎄',short:'Mutlu yıllar!'};
  return null;
}
const HOLIDAY=findHoliday();
const QUIET=!!HOLIDAY&&HOLIDAY.kind==='mourning';
const holEl=document.getElementById('holiday');
if(HOLIDAY){if(holEl){holEl.textContent=(HOLIDAY.kind==='national'?'🇹🇷 ':'')+HOLIDAY.full;holEl.hidden=false;}if(HOLIDAY.short)setTimeout(()=>say(HOLIDAY.short),3500);}
if(QUIET){reduced=true;document.documentElement.classList.add('mourn');}
let silence=false,silenceMuted=false;
function updateSilence(){
  if(!QUIET)return;
  const on=hourF>=9+5/60&&hourF<9+6/60;
  if(on&&!silence){silence=true;silenceMuted=!muted;muted=true;stopPurr();stopEatLoop();if(holEl)holEl.textContent='Saygı duruşu · 09:05';}
  else if(!on&&silence){silence=false;if(silenceMuted)muted=false;if(holEl)holEl.textContent=HOLIDAY.full;}
}
function drawFlag(px,py,amp,hang){
  R(px,py,1,30,'#b9a88c');R(px-1,py-1,3,2,'#e7c35a');
  const top=py+1+(hang||0);
  for(let i=0;i<15;i++){
    const ph=T*4.2-i*.62,k=i/14,dy=Math.round(Math.sin(ph)*amp*(.25+k*.75)),fold=Math.sin(ph+.9);
    for(let j=0;j<10;j++){
      const wob=0;
      let c=fold>.35?'#b5000f':fold<-.55?'#f5303c':'#e30a17',w=fold>.35?'#d4d4d4':'#ffffff';
      const dyy=j-4.5;let col=c;
      if(Math.hypot(i-5.5,dyy)<=3.2&&Math.hypot(i-6.8,dyy)>2.6)col=w;
      if((i===10&&(j===3||j===4||j===5))||((i===9||i===11)&&j===4))col=w;
      R(px+1+i,top+j+dy+wob,1,1,col);
    }
  }
}
function drawHoliday(){
  if(!HOLIDAY)return;
  if(HOLIDAY.kind==='mourning'){drawFlag(8,H-37,.9,12);drawFlag(Math.round(box.x-24),H-37,.9,12);return;}
  const y0=Math.round(H*.06),cols=HOLIDAY.kind==='national'?['#e30a17','#ffffff']:['#d93636','#3aa655','#f5c542'];
  const sag=x=>Math.round(3*Math.sin((x%40)/40*Math.PI));
  for(let x=0;x<W;x++)R(x,y0+sag(x),1,1,'#c9b78e');
  for(let x=4,k=0;x<W;x+=8,k++){const c=cols[k%cols.length],y=y0+sag(x)+1;R(x-2,y,5,1,c);R(x-1,y+1,3,1,c);R(x,y+2,1,1,c);}
  if(HOLIDAY.kind==='national'){drawFlag(8,H-37,2,0);drawFlag(Math.round(box.x-24),H-37,2,0);}
}
const weather={type:'none',until:0,next:0,drops:[]};
const forceW=qp.get('weather');let weatherInit=false;
function setWeather(t,dur){
  weather.type=t;weather.until=T+dur;weather.drops=[];
  if(t!=='none'){const n=Math.round(W*(t==='rain'?.55:.4));for(let i=0;i<n;i++)weather.drops.push({x:Math.random()*W,y:Math.random()*H,v:t==='rain'?rnd(70,95):rnd(8,16),p:Math.random()*6});}
  if(t==='rain'&&!reduced&&['sit','walk','watch','sleep','beg','stretch','yawn'].includes(cat.state)){cat.state='toBox';cat.t=0;cat.interestUntil=0;say('rain!');}
}
function updateWeather(dt){
  if(QUIET)return;
  if(!weatherInit){weatherInit=true;weather.next=T+rnd(90,200);if(forceW)setWeather(forceW,1e6);}
  if(weather.type==='none'){
    if(T>weather.next&&!reduced){const t=todayYMD(),winter=t.m===12||t.m<=2,ny=HOLIDAY&&HOLIDAY.kind==='newyear';
      if(ny||winter&&Math.random()<.7)setWeather('snow',rnd(30,50));else if(!winter)setWeather('rain',rnd(25,40));else setWeather('rain',rnd(25,40));}
  }else{
    if(T>weather.until){weather.type='none';weather.drops=[];weather.next=T+rnd(180,420);return;}
    for(const d of weather.drops){
      d.y+=d.v*dt;
      if(weather.type==='rain')d.x-=14*dt;else d.x+=Math.sin(T+d.p)*6*dt;
      if(d.y>H){d.y=-3;d.x=Math.random()*W;}if(d.x<0)d.x+=W;if(d.x>W)d.x-=W;
    }
  }
}
function drawWeatherBack(){if(weather.type==='rain'){ctx.fillStyle='rgba(20,32,56,.22)';ctx.fillRect(0,0,W,H);}if(silence){ctx.fillStyle='rgba(0,0,0,.42)';ctx.fillRect(0,0,W,H);}}
function drawWeatherFront(){
  if(weather.type==='none')return;
  for(const d of weather.drops){
    if(weather.type==='rain'){ctx.globalAlpha=.75;R(Math.round(d.x),Math.round(d.y),1,3,'#bcd6ff');}
    else{ctx.globalAlpha=.9;R(Math.round(d.x),Math.round(d.y),1,1,'#ffffff');}
  }
  ctx.globalAlpha=1;
}
let shoot=null,nextShoot=0,shootInit=false;
function updateShoot(dt){
  if(QUIET)return;
  if(!shootInit){shootInit=true;nextShoot=T+(qp.get('shoot')?2:rnd(15,40));}
  if(!shoot&&lightK<.3&&T>nextShoot&&!reduced){shoot={x:rnd(W*.4,W*.95),y:rnd(0,H*.25),vx:-rnd(70,100),vy:rnd(28,42),life:1.1};nextShoot=T+rnd(25,60);}
  if(shoot){shoot.x+=shoot.vx*dt;shoot.y+=shoot.vy*dt;shoot.life-=dt;if(shoot.life<=0)shoot=null;}
}
function drawShoot(){
  if(!shoot)return;const l=Math.min(1,shoot.life*1.6);
  for(let i=0;i<16;i++){ctx.globalAlpha=l*(1-i/16);R(Math.round(shoot.x-shoot.vx*.012*i),Math.round(shoot.y-shoot.vy*.012*i),1,1,'#fff6cf');}
  ctx.globalAlpha=1;
}
let confetti=[];
function celebrate(n){
  if(QUIET)return;
  say('♥ '+n+'!');spawnHeart();
  for(let i=0;i<60;i++)confetti.push({x:rnd(0,W),y:rnd(-40,0),vy:rnd(18,36),c:i%3,p:Math.random()*6});
  if(!['belly','box','leave','away','return'].includes(cat.state)){cat.state='startle';cat.t=0;cat.nextStartle=T+8;}
}
function updateConfetti(dt){for(const c of confetti){c.y+=c.vy*dt;c.x+=Math.sin(T*2+c.p)*8*dt;}confetti=confetti.filter(c=>c.y<H+4);}
function drawConfetti(){const cs=['#ff6b9a','#ffd25e','#7fd1ff'];for(const c of confetti)R(Math.round(c.x),Math.round(c.y),2,2,cs[c.c]);}
function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;T+=dt;
  updateBall(dt);updateCat(dt);updateWeather(dt);updateShoot(dt);updateConfetti(dt);updateSilence();
  for(const bw of bowls)bw.level+=(bw.fill-bw.level)*Math.min(1,dt*(bw.fill>bw.level?3:2));
  for(const d of drops)d.y+=d.vy*dt;drops=drops.filter(d=>d.y<d.bw.y-4);
  for(const h of hearts){h.y+=h.vy*dt;h.life-=dt;}hearts=hearts.filter(h=>h.life>0);
  for(const p of prints)p.life-=dt;prints=prints.filter(p=>p.life>0);
  draw();requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
/* acilista kedi bir kere yumagi oynasin, sayfa canli dursun */
setTimeout(()=>{if(T-lastInteract>2&&!reduced)cat.interestUntil=T+7;},2800);
window.catDebug=()=>({cat,ball,S,W,H,weather,HOLIDAY,celebrate});
if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
