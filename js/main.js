/* Oda: tek bir piksel resim + derinlik haritasi + esya maskesi.
   Fare gezindikce resim gercek derinligine gore kayar (WebGL), ustune gelinen esya kendi seklinde parlar,
   tiklama da maskeye gore calisir. Derinlik ve maske, resimden bilgisayarda modelle cikarildi (bkz. README). */
import {initUI} from './ui.js';
import {initWall} from './wall.js';
import {WALL_QR} from './content.js';
import qrcode from './vendor/qrcode.js';
import {wallpaperFile} from './wallpaper.js';

const $=id=>document.getElementById(id);
const qp=new URLSearchParams(location.search);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch=matchMedia('(pointer:coarse)').matches;
const IMG_W=2752,IMG_H=1536;
const M=.011; /* derinlik kaymasinin en fazla miktari (resim genisliginin orani) */
/* oda fareyle kaymaz, sabit durur (yalnizca imlecin altindaki dalga kalir); ?ptr= ile test icin acilabilir */
const PARALLAX=!!qp.get('ptr');

/* Esyalar: n = maske numarasi (room-ids.png'de n*16), kutu = klavye odagi ve yakinlasma icin */
const HOTSPOTS=[
  {n:1, id:'shelf',   box:[.172,.165,.340,.865],route:'projects'},
  {n:2, id:'poqrox',  box:[.203,.443,.316,.573],route:'projects/poqrox'},
  {n:3, id:'games',   box:[.183,.720,.315,.812],route:'hobbies'},
  {n:4, id:'portrait',box:[.420,.170,.482,.290],route:'about'},
  {n:5, id:'cert',    box:[.488,.200,.564,.308],route:'skills'},
  {n:6, id:'map',     box:[.575,.100,.735,.458],route:'where'},
  /* masadaki uzay grisi bilgisayar (resmin kendi parcasi); ekrani kodla aydinlatilir */
  {n:7, id:'monitor', box:[.430,.375,.575,.590],route:'about',dive:true},
  {n:8, id:'lamp',    box:[.362,.395,.437,.600],toggle:true},
  {n:9, id:'contact', box:[.619,.596,.667,.623],route:'contact'},
  {n:10,id:'notes',   box:[.885,.240,.978,.548],wall:true},
  {n:11,id:'ball',    box:[.688,.752,.752,.868],route:'hobbies'},
  {n:12,id:'cabinet', box:[.836,.628,.975,.950],route:'hobbies'},
  {n:13,id:'qr',      box:[.352,.176,.404,.298],href:WALL_QR.url,drawn:true},
].map(h=>({...h,x:h.box[0],y:h.box[1],w:h.box[2]-h.box[0],h:h.box[3]-h.box[1]}));
const byN={};for(const h of HOTSPOTS)byN[h.n]=h;
/* monitorun cami: PC'ye girerken buraya yakinlasilir */
const SCREEN={x:1049/2400,y:519/1339,w:316/2400,h:176/1339};

const view=$('view'),room=$('room'),ov=$('ov'),tip=$('tip'),langBtn=$('lang'),holEl=$('holiday');
const catEl=$('cat'),fx=$('fx'),mtag=$('mtag'),cntEl=$('cnt');
const cur={x:0,y:0,zf:0},goal={x:0,y:0,zf:0};
const ptr={x:0,y:0},ptrGoal={x:0,y:0};
let focus=null,dragged=false,hover=0,hoverK=0,hoverUV=[.5,.5],hoverTarget=[.5,.5],lastHot=0,rippleOn=false;
const ui=initUI({onClose:back,onLang:paintLang});
const wall=initWall({L:()=>ui.L(),onClose:back});
const busy=()=>ui.isOpen()||wall.isOpen();
function back(){goal.zf=0;document.documentElement.classList.remove('dive');}

/* ---------- gunun saati: ziyaretcinin yerel saatine gore ---------- */
function hourNow(){const q=parseFloat(qp.get('hour'));if(!isNaN(q))return((q%24)+24)%24;const d=new Date();return d.getHours()+d.getMinutes()/60;}
const todOf=h=>h>=5.5&&h<10?'morning':h>=10&&h<16.5?'day':h>=16.5&&h<19.5?'sunset':'night';
let tod=todOf(hourNow()),lampNight=false,night=false;
const curTod=()=>lampNight?(tod==='night'?'day':'night'):tod;
function paintTod(){
  const t=curTod();night=t==='night';
  document.documentElement.dataset.theme=night?'dark':'light';document.documentElement.dataset.tod=t;
  const m=document.querySelector('meta[name=theme-color]');if(m)m.content=night?'#121214':'#fbf8f3';
  if(gl){gl.show(t);scrKey=catKey='';paintPortrait();paintQR();}else{for(const i of document.querySelectorAll('.bg')){const on=i.dataset.t===t;if(on&&!i.src)i.src='assets/room-'+t+'.jpg';i.style.opacity=on?1:0;}}
}
if(!qp.get('hour'))setInterval(()=>{const n=todOf(hourNow());if(n!==tod){tod=n;lampNight=false;paintTod();}},60000);

/* ---------- derinlik ve maske (CPU tarafi: secim ve ustteki parcalarin kaymasi icin) ---------- */
let DW=0,DH=0,depthData=null,idData=null;
function sample(arr,u,v){const x=clamp(Math.round(u*(DW-1)),0,DW-1),y=clamp(Math.round(v*(DH-1)),0,DH-1);return arr[(y*DW+x)*4];}
const depthAt=(u,v)=>depthData?sample(depthData,u,v)/255:.5;
/* ekrandaki (tuvaldeki) bir noktanin resimde nereye denk geldigi: golgelendiriciyle ayni hesap */
function toTex(v0,v1){
  const u=.5+(v0-.5)*(1-2*M),w=.5+(v1-.5)*(1-2*M),d=depthAt(u,w);
  return[u-ptr.x*(d-.5)*2*M,w-ptr.y*(d-.5)*2*M];
}
function pickAt(cx,cy){
  if(!idData)return 0;const r=room.getBoundingClientRect();
  const v0=(cx-r.left)/r.width,v1=(cy-r.top)/r.height;if(v0<0||v0>1||v1<0||v1>1)return 0;
  const[u,w]=toTex(v0,v1);pickAt.uv=[u,w];return Math.round(sample(idData,u,w)/16);
}
function loadImg(src){return new Promise((ok,no)=>{const i=new Image();i.decoding='async';i.onload=()=>ok(i);i.onerror=no;i.src=src;});}

/* ---------- WebGL ---------- */
let gl=null;
function initGL(depthImg,idImg){
  const cv=$('gl'),g=cv.getContext('webgl',{antialias:false,premultipliedAlpha:false,alpha:false});if(!g)return null;
  const sh=(t,s)=>{const o=g.createShader(t);g.shaderSource(o,s);g.compileShader(o);if(!g.getShaderParameter(o,g.COMPILE_STATUS))console.warn(g.getShaderInfoLog(o));return o;};
  const p=g.createProgram();
  g.attachShader(p,sh(g.VERTEX_SHADER,'attribute vec2 a;varying vec2 v;void main(){v=vec2(a.x*.5+.5,.5-a.y*.5);gl_Position=vec4(a,0.,1.);}'));
  g.attachShader(p,sh(g.FRAGMENT_SHADER,`precision highp float;varying vec2 v;
    uniform sampler2D A,B,D,I,O,C;uniform float k,m,hk,tm,asp,dc;uniform vec2 p,hc;uniform vec4 cr;
    float dep(vec2 t){return texture2D(D,t).r;}
    float hs(vec2 q){return fract(sin(dot(q,vec2(41.3,289.1)))*15731.743);}
    float noise(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);
      return mix(mix(hs(i),hs(i+vec2(1,0)),f.x),mix(hs(i+vec2(0,1)),hs(i+vec2(1,1)),f.x),f.y);}
    void main(){
      vec2 base=.5+(v-.5)*(1.-2.*m),off=vec2(0.);
      if(hk>.001){
        /* sivi dalga: imlecin altindaki resim yalnizca kivrilir (renk/isik eklenmez, halka gorunmez) */
        vec2 q=vec2(base.x*asp,base.y),c=vec2(hc.x*asp,hc.y),dl=q-c;float dist=length(dl);vec2 dir=dl/(dist+1e-4);
        float n=noise(q*14.+tm*.7);
        float ph=dist*120.-tm*7.+n*2.;
        float fall=exp(-dist*dist*230.)*hk;
        off=dir*sin(ph)*fall*.0032+vec2(-dir.y,dir.x)*(n-.5)*fall*.0022;
      }
      /* derinlik kaydirmasi: her piksel kendi derinligine gore kayar (kenarlar resimle birebir) */
      vec2 uv=clamp(base-p*(dep(base)-.5)*2.*m+off,0.,1.);
      vec4 c=mix(texture2D(A,uv),texture2D(B,uv),k);
      /* odaya islenmis parcalar (portre, ekran yazisi): resimle ayni kayma ve dalgayi alir */
      vec4 o=texture2D(O,uv);c.rgb=c.rgb*(1.-o.a)+o.rgb;
      /* kedi: tek parca halinde kendi derinliginde kayar, dalgayi o da alir */
      vec2 cu=(base-p*(dc-.5)*2.*m+off-cr.xy)/cr.zw;
      if(cu.x>0.&&cu.x<1.&&cu.y>0.&&cu.y<1.){vec4 e=texture2D(C,cu);c.rgb=c.rgb*(1.-e.a)+e.rgb;}
      gl_FragColor=c;
    }`));
  g.linkProgram(p);if(!g.getProgramParameter(p,g.LINK_STATUS)){console.warn(g.getProgramInfoLog(p));return null;}g.useProgram(p);
  const b=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,b);g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),g.STATIC_DRAW);
  const al=g.getAttribLocation(p,'a');g.enableVertexAttribArray(al);g.vertexAttribPointer(al,2,g.FLOAT,false,0,0);
  const U=n=>g.getUniformLocation(p,n);const uK=U('k'),uP=U('p'),uHK=U('hk'),uT=U('tm'),uHC=U('hc'),uCR=U('cr'),uDC=U('dc');g.uniform1f(U('asp'),IMG_W/IMG_H);
  g.uniform1i(U('A'),0);g.uniform1i(U('B'),1);g.uniform1i(U('D'),2);g.uniform1i(U('I'),3);g.uniform1i(U('O'),4);g.uniform1i(U('C'),6);g.uniform1f(U('m'),M);g.uniform4f(uCR,-1,-1,.001,.001);
  /* yeni dokular bos bir yuvada (5) olusturulur; 2 ve 3. yuvadaki derinlik ve maske hic degismez */
  const tex=(src,nearest,fmt)=>{const t=g.createTexture();g.activeTexture(g.TEXTURE5);g.bindTexture(g.TEXTURE_2D,t);const f=nearest?g.NEAREST:g.LINEAR;
    for(const[k2,v2]of[[g.TEXTURE_MIN_FILTER,f],[g.TEXTURE_MAG_FILTER,f],[g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE],[g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE]])g.texParameteri(g.TEXTURE_2D,k2,v2);
    g.texImage2D(g.TEXTURE_2D,0,fmt||g.RGB,fmt||g.RGB,g.UNSIGNED_BYTE,src);return t;};
  const bind=(unit,t)=>{g.activeTexture(g.TEXTURE0+unit);g.bindTexture(g.TEXTURE_2D,t);};
  bind(2,tex(depthImg,false,g.LUMINANCE));bind(3,tex(idImg,true,g.LUMINANCE));
  /* resmin ustune islenen katmanlar: 4 = portre ve ekran yazisi (resim boyutunda), 6 = kedi (kucuk) */
  const blank=(w,h)=>{const t=g.createTexture();g.activeTexture(g.TEXTURE5);g.bindTexture(g.TEXTURE_2D,t);
    for(const[k2,v2]of[[g.TEXTURE_MIN_FILTER,g.LINEAR],[g.TEXTURE_MAG_FILTER,g.LINEAR],[g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE],[g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE]])g.texParameteri(g.TEXTURE_2D,k2,v2);
    g.texImage2D(g.TEXTURE_2D,0,g.RGBA,w,h,0,g.RGBA,g.UNSIGNED_BYTE,null);return t;};
  const OT=blank(IMG_W,IMG_H),CT=blank(1,1);bind(4,OT);bind(6,CT);
  const upload=(unit,t,fn)=>{g.activeTexture(g.TEXTURE0+unit);g.bindTexture(g.TEXTURE_2D,t);g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);fn();g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);};
  const T={};let a=null,bT=null,k=0,fading=false,T0=performance.now();
  function get(t){if(!T[t])T[t]=loadImg('assets/room-'+t+'.jpg').then(i=>tex(i));return T[t];}
  return{
    async show(t){const x=await get(t);if(t!==curTod())return;if(!a){a=bT=x;}else{a=bT||a;bT=x;k=0;fading=true;}document.documentElement.classList.add('ready');},
    preload(t){get(t);},
    /* buyuk katmana bir parca yaz (x,y resim pikseli) */
    put(x,y,cv){upload(4,OT,()=>g.texSubImage2D(g.TEXTURE_2D,0,x,y,g.RGBA,g.UNSIGNED_BYTE,cv));},
    /* kedi katmani: tuval + resimdeki yeri (0-1) + derinligi */
    cat(cv,r,d){upload(6,CT,()=>g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,cv));g.uniform4f(uCR,r[0],r[1],r[2],r[3]);g.uniform1f(uDC,d);},
    draw(dt,px,py){
      if(!a)return;if(fading){k=Math.min(1,k+dt/(reduced?.01:.8));if(k>=1){fading=false;a=bT;k=0;}}
      bind(0,a);bind(1,bT||a);g.uniform1f(uK,fading?k:0);g.uniform2f(uP,px,py);
      g.uniform1f(uHK,hoverK);g.uniform2f(uHC,hoverUV[0],hoverUV[1]);g.uniform1f(uT,(performance.now()-T0)/1000);
      g.drawArrays(g.TRIANGLE_STRIP,0,4);
    },
    size(w,h){const r=Math.min(devicePixelRatio||1,2),cw=Math.min(Math.round(w*r),3000),ch=Math.round(cw*h/w);if(cv.width!==cw){cv.width=cw;cv.height=ch;g.viewport(0,0,cw,ch);}},
  };
}

/* ---------- esyalar: klavye icin gorunmez dugmeler (fare maskeyle calisir) ---------- */
function showTipAt(x,y,text){tip.textContent=text;placeTip(x,y);tip.classList.add('on');}
/* etiket imlecin sag altinda durur, dalgayi kapatmaz */
function placeTip(x,y){tip.style.left=Math.min(x+18,innerWidth-tip.offsetWidth-10)+'px';tip.style.top=Math.min(y+22,innerHeight-40)+'px';}
const hideTip=()=>tip.classList.remove('on');
const hotEls=HOTSPOTS.map(h=>{
  const b=document.createElement('button');b.type='button';b.className='hot';b.dataset.id=h.id;
  Object.assign(b.style,{left:h.x*100+'%',top:h.y*100+'%',width:h.w*100+'%',height:h.h*100+'%'});
  ov.appendChild(b);
  b.addEventListener('click',()=>openHot(h));
  b.addEventListener('focus',()=>{if(!b.matches(':focus-visible'))return;hover=lastHot=h.n;rippleOn=true;hoverUV=hoverTarget=[h.x+h.w/2,h.y+h.h/2];const r=b.getBoundingClientRect();showTipAt(r.left+r.width/2,r.top,ui.L().hot[h.id]);});
  b.addEventListener('blur',()=>{hover=0;rippleOn=false;hideTip();});
  return{h,b};
});
function paintLang(){
  langBtn.textContent=ui.lang()==='tr'?'EN':'TR';langBtn.setAttribute('aria-label',ui.lang()==='tr'?'Switch to English':'Türkçeye geç');
  for(const{h,b}of hotEls)b.setAttribute('aria-label',ui.L().hot[h.id]);
  mtag.textContent=ui.L().meowlyTag;
}
langBtn.addEventListener('click',()=>ui.setLang(ui.lang()==='tr'?'en':'tr'));
$('brand').addEventListener('click',()=>openHot(byN[7]));
function seen(){document.documentElement.classList.add('seen');try{localStorage.setItem('seen','1');}catch(e){}}
try{if(localStorage.getItem('seen')==='1')document.documentElement.classList.add('seen');}catch(e){}
function openHot(h){
  hideTip();seen();
  if(h.toggle){lampNight=!lampNight;paintTod();return;}
  if(h.href){window.open(h.href,'_blank','noopener');return;}
  focus=h;hover=0;
  if(reduced){h.wall?wall.show():ui.show(h.route,h.dive);return;}
  goal.zf=1;
  if(h.dive)document.documentElement.classList.add('dive');
  setTimeout(()=>h.wall?wall.show():ui.show(h.route,h.dive),h.dive?720:h.wall?520:300);
}

/* ---------- yerlesim ve kamera ---------- */
let W=0,H=0,vw=0,vh=0;
function layout(){
  vw=innerWidth;vh=innerHeight;if(vw<8||vh<8)return;
  const s=Math.max(vw/IMG_W,vh/IMG_H);W=IMG_W*s;H=IMG_H*s;
  room.style.width=W+'px';room.style.height=H+'px';
  if(gl)gl.size(W,H);
  const first=!layout.done;layout.done=true;
  goal.x=first?clamp((vw<W*.6?.53:.5)*W-vw/2,0,W-vw):clamp(goal.x,0,W-vw);
  /* dikeyde tasma varsa alt kenar (kedi ve zemin) hep gorunsun; tavandan kirpilir */
  goal.y=clamp((H-vh)*.92,0,H-vh);
  if(first)Object.assign(cur,goal);
}
addEventListener('resize',layout);
let down=null,lastMove=null;
view.addEventListener('pointerdown',e=>{if(busy())return;down={x:e.clientX,y:e.clientY,gx:goal.x};dragged=false;});
addEventListener('pointermove',e=>{
  if(PARALLAX&&e.pointerType==='mouse'&&!busy()&&!qp.get('ptr')){ptrGoal.x=clamp(e.clientX/vw*2-1,-1,1);ptrGoal.y=clamp(e.clientY/vh*2-1,-1,1);}
  if(e.pointerType==='mouse')lastMove=[e.clientX,e.clientY,e.target];
  if(!down)return;
  const dx=e.clientX-down.x;if(!dragged&&Math.abs(dx)>7){dragged=true;view.classList.add('drag');hideTip();}
  if(dragged)goal.x=clamp(down.gx-dx,0,W-vw);
});
document.addEventListener('mouseleave',()=>{ptrGoal.x=ptrGoal.y=0;lastMove=null;hover=0;rippleOn=false;hideTip();});
function up(e){
  if(!down)return;const was=dragged;down=null;view.classList.remove('drag');setTimeout(()=>{dragged=false;},0);
  if(was||busy()||e.type==='pointercancel'||e.target===catEl||e.target.closest('#hud,#mtag'))return;
  const n=pickAt(e.clientX,e.clientY);if(n&&byN[n])openHot(byN[n]);
}
view.addEventListener('pointerup',up);addEventListener('pointercancel',up);
addEventListener('keydown',e=>{if(busy())return;if(e.key==='ArrowLeft'||e.key==='ArrowRight')goal.x=clamp(goal.x+(e.key==='ArrowLeft'?-120:120),0,W-vw);});
/* farenin altindaki esya (her karede: oda kayarken de dogru kalsin) */
function updateHover(){
  if(qp.get('hl'))return;
  if(!lastMove||busy()||goal.zf>0||dragged){rippleOn=false;if(!document.activeElement||!document.activeElement.classList.contains('hot'))hover=0;return;}
  const[x,y,t]=lastMove;
  /* dalga odanin her yerinde (kedinin ustunde de); yalnizca ust menude durur */
  const over=!(t.closest&&t.closest('#hud,#mtag'));
  let n=over?pickAt(x,y):0;if(t===catEl)n=0;
  rippleOn=over;if(over&&pickAt.uv)hoverTarget=pickAt.uv.slice();
  if(rippleOn&&hoverK<.02&&pickAt.uv)hoverUV=pickAt.uv.slice();
  if(n!==hover){hover=n;if(n)lastHot=n;view.style.cursor=n?'pointer':'';if(n&&byN[n])showTipAt(x,y,ui.L().hot[byN[n].id]);else hideTip();}
  else if(n)placeTip(x,y);
}

/* ---------- Meowly kedisi (sessiz) ---------- */
const SRC=n=>`assets/cat/${n}.png`,KH=.185/216; /* sprite pikseli -> oda yuksekligi orani */
/* yalnizca Meowly sitesinde yayinlanan kareler; kedi yurumez, cevrilmez, yeniden boyanmaz */
const FR=['idle_0','idle_1','idle_2','content','sleep','yawn','groomA','groomB','groomC','groomD'];
const SIZE={},IMGS={};let frame='idle_0',seq=null,si=0,st=0;
function setFrame(n){frame=n;catEl.src=SRC(n);const s=SIZE[n];if(s){catEl.style.height=(s[1]*KH*100).toFixed(3)+'%';catEl.style.aspectRatio=s[0]+'/'+s[1];}}
FR.forEach(n=>{const i=new Image();i.onload=()=>{SIZE[n]=[i.naturalWidth,i.naturalHeight];IMGS[n]=i;if(n===frame)setFrame(n);};i.src=SRC(n);});
/* oturma dongusu: duz bakar, ara ara goz kirpar ve biraz yana bakar (yalama yok) */
const SIT=[['idle_0',3400],['idle_1',160],['idle_0',2600],['idle_1',160],['idle_0',1800],['idle_2',1600]];
/* kedi top ile bitkinin arasinda durur */
const cat={x:.768,gone:false,mine:0,sitAt:0,wakeNext:false,mode:'',until:0,pets:0,petAt:0,lastTouch:performance.now(),sleepNext:false,zAt:0};
const FLOOR=.94;
function play(frames){seq=frames;si=0;st=performance.now();setFrame(frames[0][0]);}
function hold(n){seq=null;setFrame(n);}
function setMode(m,ms){
  cat.mode=m;cat.until=ms?performance.now()+ms:0;
  if(m==='sit'){cat.sitAt=performance.now();play(SIT);}else if(m==='sleep')hold('sleep');else if(m==='yawn')hold('yawn');
  else if(m==='pet')hold('content');
}
function pop(cls,html){
  const e=document.createElement('span'),s=SIZE[frame]||[146,216];e.className=cls;e.innerHTML=html;
  e.style.left=(cat.x*100+(Math.random()*1.6-.8))+'%';e.style.bottom=((1-FLOOR)*100+s[1]*KH*100)+'%';
  fx.appendChild(e);setTimeout(()=>e.remove(),1500);
}
const HEART='<svg viewBox="0 0 7 6" shape-rendering="crispEdges"><path fill="#f57394" d="M1 0h2v1h1V0h2v1h1v2H6v1H5v1H4v1H3V5H2V4H1V3H0V1h1z"/></svg>';
/* sevgi bari: herkesin toplam sevgisi hep gorunur; alttaki cubuk senin bu turdaki sevgin (MAX'a ulasinca kedi
   "puf" diye kaybolur, 30 sn sonra geri gelir). Boylece sayi tek kisinin tikla-tikla sisirmesiyle uzamaz. */
const CNT='https://abacus.jasoncameron.dev',CKEY='piercies3sc-cat/hearts',MAXPET=50,AWAY=30000,DAYCAP=200;
let total=null;
function paintLove(){cntEl.querySelector('b').textContent=total===null?'…':total.toLocaleString('tr-TR');cntEl.style.setProperty('--fill',(cat.mine/MAXPET*100).toFixed(1)+'%');}
function dayHits(add){const k='hits-'+new Date().toISOString().slice(0,10);let n=0;try{n=+localStorage.getItem(k)||0;if(add){n++;localStorage.setItem(k,n);}}catch(e){}return n;}
function poof(){
  const s=SIZE[frame]||[146,216],cy=(1-FLOOR)*100+s[1]*KH*50;
  for(let i=0;i<14;i++){const e=document.createElement('span');e.className='puff';const a=i/14*Math.PI*2,r=2+Math.random()*2.5;
    e.style.left=cat.x*100+'%';e.style.bottom=cy+'%';e.style.setProperty('--dx',(Math.cos(a)*r).toFixed(2)+'vw');e.style.setProperty('--dy',(-Math.sin(a)*r*1.2).toFixed(2)+'vw');
    e.style.animationDelay=(Math.random()*120|0)+'ms';fx.appendChild(e);setTimeout(()=>e.remove(),1100);}
}
function goAway(){
  poof();cat.gone=true;catEl.classList.add('gone');mtag.classList.remove('on');hideTip();
  setTimeout(()=>{cat.mine=0;paintLove();cat.gone=false;catEl.classList.remove('gone');setMode('sit');poof();},AWAY);
}
function pet(){
  if(cat.gone)return;
  const now=performance.now();cat.lastTouch=now;
  if(cat.mode==='sleep'||cat.mode==='yawn'){setMode('yawn',1100);return;}
  cat.pets=now-cat.petAt<5000?cat.pets+1:1;cat.petAt=now;
  setMode('pet',1800);
  pop('heart',HEART);
  cat.mine++;
  const send=!qp.get('nocount')&&dayHits()<DAYCAP;
  if(total!==null&&send)total++;
  paintLove();cntEl.classList.remove('bump');void cntEl.offsetWidth;cntEl.classList.add('bump');
  if(send){dayHits(true);fetch(CNT+'/hit/'+CKEY).then(r=>r.json()).then(j=>{if(typeof j.value==='number'){total=Math.max(total||0,j.value);paintLove();}}).catch(()=>{});}
  if(cat.mine>=MAXPET)setTimeout(goAway,700);
}
fetch(CNT+'/get/'+CKEY).then(r=>r.json()).then(j=>{if(typeof j.value==='number'){total=j.value;paintLove();}}).catch(()=>{});
paintLove();
/* farenin (ya da parmagin) kedinin ustunde gezmesi sevmek sayilir */
let stroke=0,lastXY=null,strokeAt=0,tagT=0;
catEl.addEventListener('pointermove',e=>{
  if(lastXY)stroke+=Math.hypot(e.clientX-lastXY[0],e.clientY-lastXY[1]);lastXY=[e.clientX,e.clientY];
  const now=performance.now();if(stroke>110&&now-strokeAt>800){stroke=0;strokeAt=now;pet();}
});
catEl.addEventListener('pointerleave',()=>{lastXY=null;stroke=0;hideTip();});
catEl.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=0;const r=catEl.getBoundingClientRect();showTipAt(r.left+r.width/2,r.top,'Meowly');}});
catEl.addEventListener('click',()=>{if(dragged||cat.gone)return;hideTip();seen();strokeAt=performance.now();pet();mtag.classList.add('on');clearTimeout(tagT);tagT=setTimeout(()=>mtag.classList.remove('on'),4200);});
catEl.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();catEl.click();}});
function catTick(now){
  if(cat.gone)return;
  if(seq&&now-st>seq[si][1]){si=(si+1)%seq.length;st=now;setFrame(seq[si][0]);}
  /* uyku da dongunun parcasi: bir sure oturur, esner, kestirir, esneyip uyanir */
  if(cat.until&&now>cat.until){
    if(cat.sleepNext){cat.sleepNext=false;setMode('sleep',night?45000:15000);}
    else if(cat.mode==='sleep'){cat.wakeNext=true;setMode('yawn',900);}
    else setMode('sit');
  }
  if(cat.mode==='sit'&&now-Math.max(cat.lastTouch,cat.sitAt)>(night?16000:30000)){cat.sleepNext=true;setMode('yawn',1000);}
  else if(cat.mode==='sleep'&&now-cat.zAt>1800){cat.zAt=now;pop('zz','z z');}
}
catEl.style.left=mtag.style.left=cat.x*100+'%';catEl.style.bottom=(1-FLOOR)*100+'%';setMode('sit');

/* ---------- isik: gunes huzmesindeki toz ---------- */
const dust=$('dust'),dx=dust.getContext('2d');const motes=[];
for(let i=0;i<90;i++)motes.push({u:Math.random(),v:Math.random(),s:Math.random()*.6+.4,p:Math.random()*6.28});
function drawDust(t){
  const w=dust.width=Math.round(W/3)||1,h=dust.height=Math.round(H/3)||1;dx.clearRect(0,0,w,h);
  if(night||reduced)return;
  dx.fillStyle=curTod()==='sunset'?'#ffd2a8':'#fff6d8';
  for(const m of motes){
    /* gunes huzmesi: soldaki pencereden arka duvara dogru capraz serit */
    const u=.06+m.u*.42,v=.12+m.v*.75;const band=Math.abs((v-.12)-(u-.06)*1.1-.08);if(band>.25)continue;
    const x=(u+Math.sin(t*.00011*m.s+m.p)*.012)*w,y=((v+t*.000004*m.s)%1)*h;
    dx.globalAlpha=(.2+.6*Math.abs(Math.sin(t*.0009*m.s+m.p)))*(1-band/.25);dx.fillRect(Math.round(x),Math.round(y),1,1);
  }
  dx.globalAlpha=1;
}

/* ---------- bayram yazisi ---------- */
(function(){
  const q=qp.get('date'),m=q&&q.match(/^(\d{1,2})-(\d{1,2})$/),d=new Date(),mo=m?+m[1]:d.getMonth()+1,da=m?+m[2]:d.getDate();
  const N={'4-23':'23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kutlu olsun','5-19':"19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramı kutlu olsun",'8-30':'30 Ağustos Zafer Bayramı kutlu olsun','10-29':'29 Ekim Cumhuriyet Bayramı kutlu olsun','11-10':'10 Kasım · Saygı ve özlemle anıyoruz','12-31':'Mutlu yıllar','1-1':'Mutlu yıllar'};
  const t=N[mo+'-'+da];if(!t)return;holEl.textContent=t;holEl.hidden=false;
  if(mo===11&&da===10)document.documentElement.classList.add('mourn');
  else document.documentElement.dataset.decor=(mo===12||mo===1)?'lights':'flags';
})();

/* ---------- resme islenen parcalar ----------
   Portre, ekran yazisi ve kedi WebGL'de odayla birlikte cizilir; boylece derinlik kaymasini ve
   imlec dalgasini resmin geri kalaniyla ayni sekilde alirlar. HTML'deki kopyalar yalnizca
   WebGL yoksa gorunur (kedi gorunmez kalip tiklanmaya devam eder). */
const LAYER={portrait:[1029/2400,246/1339,108/2400,124/1339],screen:[1049/2400,519/1339,316/2400,176/1339]};
const FILT={night:'brightness(.48) saturate(.7) hue-rotate(-10deg)',sunset:'brightness(.92) sepia(.3) saturate(1.15)',morning:'brightness(1.02) saturate(.9) hue-rotate(6deg)'};
const CATF={night:'brightness(.62) saturate(.85) hue-rotate(-8deg)',sunset:'sepia(.25) saturate(1.15) brightness(.97)'};
const MUL={night:'#6a6470',sunset:'#f2dcc6',morning:'#fffaf3'};
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,w);c.height=Math.max(1,h);return c;};
const px=r=>[Math.round(r[0]*IMG_W),Math.round(r[1]*IMG_H),Math.round(r[2]*IMG_W),Math.round(r[3]*IMG_H)];
/* gunun saatine gore renk: CSS filtresiyle ayni; filtre desteklenmezse carparak */
function tinted(src,f,mul){
  if(!f)return src;const b=mk(src.width,src.height),c=b.getContext('2d');
  if('filter' in c){c.filter=f;c.drawImage(src,0,0);return b;}
  c.drawImage(src,0,0);c.globalCompositeOperation='multiply';c.fillStyle=mul||'#fff';c.fillRect(0,0,b.width,b.height);
  c.globalCompositeOperation='destination-in';c.drawImage(src,0,0);return b;
}
const pimg=new Image();pimg.src=$('portrait').querySelector('img').getAttribute('src');
function paintPortrait(){
  if(!gl||!pimg.naturalWidth)return;
  const t=curTod(),[x,y,w,h]=px(LAYER.portrait),a=mk(w,h),c=a.getContext('2d');
  /* resim cercevenin icini tamamen doldurur (paspartu yok); fazlasi ust-alttan kirpilir */
  const sw=pimg.naturalWidth,sh=pimg.naturalHeight,s=Math.max(w/sw,h/sh),cw=w/s,ch=h/s;
  c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(pimg,(sw-cw)/2,(sh-ch)*.35,cw,ch,0,0,w,h);
  /* cercevenin ice dusen golgesi */
  const gr=c.createLinearGradient(0,0,0,h*.06);gr.addColorStop(0,'rgba(40,25,15,.35)');gr.addColorStop(1,'rgba(40,25,15,0)');c.fillStyle=gr;c.fillRect(0,0,w,h*.06);
  c.strokeStyle='rgba(40,25,15,.35)';c.lineWidth=3;c.strokeRect(1.5,1.5,w-3,h-3);
  gl.put(x,y,tinted(a,FILT[t],MUL[t]));
}
pimg.onload=paintPortrait;
/* QR tablosu: cerceve + baslik + projeye giden QR, kodla cizilir (WALL_QR degisince kendiliginden degisir) */
/* Lucas'in duvarindaki gibi ince ahsap cerceve + duvara dusen golge; ic alanin yerini dondurur */
function woodFrame(w,hh){
  const sh=7,a=mk(w+sh,hh+sh),c=a.getContext('2d');
  c.fillStyle='rgba(40,22,10,.22)';c.fillRect(sh,sh,w,hh);
  const B=Math.max(7,Math.round(Math.min(w,hh)*.065));
  c.fillStyle='#3a2416';c.fillRect(0,0,w,hh);
  c.fillStyle='#8f5f3c';c.fillRect(2,2,w-4,hh-4);
  c.fillStyle='#a8744c';c.fillRect(2,2,w-4,2);c.fillRect(2,2,2,hh-4);
  c.fillStyle='#6e452a';c.fillRect(2,hh-4,w-4,2);c.fillRect(w-4,2,2,hh-4);
  c.fillStyle='#3a2416';c.fillRect(B-1,B-1,w-2*B+2,hh-2*B+2);
  return{a,c,ix:B,iy:B,iw:w-2*B,ih:hh-2*B};
}

function paintQR(){
  if(!gl)return;
  /* Lucas'in duvarindaki gibi: ince ahsap cerceve, krem kagit, oynak siyah harfli baslik, altta renkli QR */
  const h=HOTSPOTS.find(o=>o.href),Q=WALL_QR,[x,y,w,hh]=px([h.x,h.y,h.w,h.h]),sh=7,a=mk(w+sh,hh+sh),c=a.getContext('2d');
  c.fillStyle='rgba(40,22,10,.22)';c.fillRect(sh,sh,w,hh);
  const B=Math.max(7,Math.round(w*.065));
  c.fillStyle='#3a2416';c.fillRect(0,0,w,hh);
  c.fillStyle='#8f5f3c';c.fillRect(2,2,w-4,hh-4);
  c.fillStyle='#a8744c';c.fillRect(2,2,w-4,2);c.fillRect(2,2,2,hh-4);
  c.fillStyle='#6e452a';c.fillRect(2,hh-4,w-4,2);c.fillRect(w-4,2,2,hh-4);
  c.fillStyle='#3a2416';c.fillRect(B-1,B-1,w-2*B+2,hh-2*B+2);
  const ix=B,iy=B,iw=w-2*B,ih=hh-2*B;c.fillStyle='#efe7d8';c.fillRect(ix,iy,iw,ih);
  const g=c.createLinearGradient(0,iy,0,iy+ih*.08);g.addColorStop(0,'rgba(60,40,20,.25)');g.addColorStop(1,'rgba(60,40,20,0)');c.fillStyle=g;c.fillRect(ix,iy,iw,ih*.08);
  /* baslik: harfler hafif egik ve dalgali (PRESENT FUTURES gibi), yarim cozunurlukte cizilip buyutulur */
  const T=mk(Math.round(iw/2),Math.round(ih*.26/2)),t=T.getContext('2d');let fs=T.height*.62;
  const font=f=>`900 ${f}px "Arial Black","Helvetica Neue",Arial,sans-serif`;t.font=font(fs);t.textBaseline='middle';
  const chars=[...Q.title],acc=new Set();{const k=Q.title.indexOf(Q.accent);if(k>=0)for(let i=k;i<k+Q.accent.length;i++)acc.add(i);}
  let tw=chars.reduce((s,ch)=>s+t.measureText(ch).width*.92,0);if(tw>T.width*.9){fs*=T.width*.9/tw;t.font=font(fs);tw*=T.width*.9/tw;}
  let tx=(T.width-tw)/2;chars.forEach((ch,i)=>{const cw=t.measureText(ch).width;t.save();t.translate(tx+cw/2,T.height/2+Math.sin(i*1.3)*T.height*.1);t.rotate(-.12+Math.sin(i*2.1)*.16);
    t.fillStyle=acc.has(i)?Q.accent_color:'#1d1a17';t.fillText(ch,-cw/2,0);t.restore();tx+=cw*.92;});
  c.imageSmoothingEnabled=false;c.drawImage(T,ix,iy+Math.round(ih*.05),iw,T.height*2);
  /* QR: kagidin ustunde, koyu kareler projenin rengi, kose gozleri vurgu renginde */
  const q=qrcode(0,'M');q.addData(Q.url);q.make();const n=q.getModuleCount(),fit=Math.min(iw*.84,ih*.64),m=Math.max(1,Math.floor(fit/(n+2))),qs=m*(n+2);
  const qx=ix+Math.round((iw-qs)/2),qy=iy+ih-qs-Math.round(ih*.07);
  c.fillStyle='#f8f3ea';c.fillRect(qx,qy,qs,qs);
  const eye=(r,cc)=>(r<7&&cc<7)||(r<7&&cc>=n-7)||(r>=n-7&&cc<7);
  for(let r=0;r<n;r++)for(let cc=0;cc<n;cc++)if(q.isDark(r,cc)){c.fillStyle=eye(r,cc)?Q.accent_color:Q.bg;c.fillRect(qx+m*(cc+1),qy+m*(r+1),m,m);}
  const t2=curTod();gl.put(x,y,tinted(a,FILT[t2],MUL[t2]));
}
let scrKey='';
/* iMac: govde gunun isigina gore renklenir, ekran ise kendi isigini verdigi icin hep parlak kalir */
const wpImg=new Image();wpImg.src=wallpaperFile(false);wpImg.onload=()=>{scrKey='';};
function rr(c,x,y,w,h,r){c.beginPath();c.roundRect?c.roundRect(x,y,w,h,r):c.rect(x,y,w,h);}
/* bilgisayarin ekrani kendi isigini verir: gunun saatinden bagimsiz, piksel piksel kucuk bir masaustu */
function paintScr(){
  if(!gl)return;
  const key=wpImg.complete+'';if(key===scrKey)return;scrKey=key;
  const[x,y,w,h]=px(LAYER.screen),o=mk(w,h),d=o.getContext('2d');
  const P=Math.max(2,Math.round(w/105)),lw=Math.round(w/P),lh=Math.round(h/P),lo=mk(lw,lh),l=lo.getContext('2d'),k=lw/316;
  if(wpImg.complete&&wpImg.naturalWidth){const W0=wpImg.naturalWidth,H0=wpImg.naturalHeight,r=Math.max(lw/W0,lh/H0);l.drawImage(wpImg,(lw-W0*r)/2,(lh-H0*r)/2,W0*r,H0*r);}else{l.fillStyle='#2a2c33';l.fillRect(0,0,lw,lh);}
  l.fillStyle='rgba(28,28,32,.5)';l.fillRect(0,0,lw,Math.max(1,6*k));
  const dw=104*k,dx0=(lw-dw)/2,dy0=lh-16*k;l.fillStyle='rgba(255,255,255,.22)';l.fillRect(dx0,dy0,dw,12*k);
  ['#62b3f6','#1d1d20','#f6e7a6','#7b5fe8','#2f8ff0','#4fbf72','#5d6d36'].forEach((col,i)=>{l.fillStyle=col;l.fillRect(dx0+(4+i*14)*k,dy0+2*k,10*k,8*k);});
  ['#fff','#62b3f6','#1d1d20','#7b5fe8'].forEach((col,i)=>{l.fillStyle=col;l.fillRect(lw-20*k,(13+i*22)*k,12*k,12*k);});
  d.imageSmoothingEnabled=false;d.drawImage(lo,0,0,w,h);
  const g=d.createLinearGradient(0,0,w*.6,h);g.addColorStop(0,'rgba(255,255,255,.08)');g.addColorStop(.5,'rgba(255,255,255,0)');d.fillStyle=g;d.fillRect(0,0,w,h);
  gl.put(x,y,o);
}
let catKey='',catAt=0,catCv=null;
function paintCat(now){
  if(gl&&cat.gone){if(catKey!=='gone'){catKey='gone';gl.cat(mk(1,1),[-1,-1,.001,.001],.5);}return;}
  const s=SIZE[frame],im=IMGS[frame];if(!gl||!s||!im)return;
  const step=reduced?0:Math.round(((1-Math.cos(now/2200*Math.PI*2))/2)*12),key=frame+'|'+step+'|'+curTod();
  if(key===catKey||now-catAt<30)return;catKey=key;catAt=now;
  const ch=s[1]*KH*IMG_H,cw=ch*s[0]/s[1],bh=ch*(1+.022*step/12),W2=Math.ceil(cw)+4,H2=Math.ceil(ch*1.025)+4;
  if(!catCv||catCv.width!==W2||catCv.height!==H2)catCv=mk(W2,H2);
  const c=catCv.getContext('2d');c.clearRect(0,0,W2,H2);c.imageSmoothingEnabled=false;
  c.drawImage(im,(W2-cw)/2,H2-bh,cw,bh);
  const t=curTod(),out=tinted(catCv,CATF[t],t==='night'?'#8f8a94':'#fff');
  gl.cat(out,[cat.x-W2/2/IMG_W,FLOOR-H2/IMG_H,W2/IMG_W,H2/IMG_H],catDepth);
}
let catDepth=.5;

/* ---------- dongu ---------- */
const deep=[[catEl,cat.x,FLOOR-.03],[$('portrait'),.447,.232],[$('scr'),.5,.46],[fx,cat.x,FLOOR-.03],[mtag,cat.x,FLOOR-.03],[$('dust'),.5,.4],[$('decor'),.5,.05],...hotEls.map(o=>[o.b,o.h.x+o.h.w/2,o.h.y+o.h.h/2])].map(([el,u,v])=>({el,u,v,d:.5}));
let last=performance.now(),dustT=0;
function tick(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;
  const k=reduced?1:1-Math.pow(.0015,dt),kp=1-Math.pow(.03,dt);
  for(const p in cur)cur[p]+=(goal[p]-cur[p])*k;
  if(PARALLAX&&touch&&!reduced&&!qp.get('ptr')){ptrGoal.x=Math.sin(now*.00035)*.5;ptrGoal.y=Math.cos(now*.00027)*.3;}
  if(busy()||goal.zf>0){ptrGoal.x*=.85;ptrGoal.y*=.85;}
  ptr.x+=(ptrGoal.x-ptr.x)*kp;ptr.y+=(ptrGoal.y-ptr.y)*kp;
  /* oda kendiliginden de cok hafif salinir (canli dursun diye) */
  const sw=!PARALLAX||busy()||goal.zf>0||qp.get('ptr')?0:.12,px=reduced?0:ptr.x+Math.sin(now*.00025)*sw,py=reduced?0:ptr.y+Math.cos(now*.0002)*sw;
  updateHover();
  /* dalga gucu yumusakca acilip kapanir, merkezi imleci agir bir sivi gibi geriden izler */
  /* dalga imlec odadayken her yerde; bir esyanin ustundeyken biraz daha belirgin */
  hoverK+=((rippleOn||hover?1:0)-hoverK)*(1-Math.pow(.0004,dt));
  const kf=1-Math.pow(1e-7,dt);hoverUV[0]+=(hoverTarget[0]-hoverUV[0])*kf;hoverUV[1]+=(hoverTarget[1]-hoverUV[1])*kf;
  /* yakinlasma: tiklanan esya ekranin ortasina gelir; monitorde cam ekrani tamamen kaplar */
  const h=focus||byN[7],box=h.dive?SCREEN:h;
  const ox=(box.x+box.w/2)*W,oy=(box.y+box.h/2)*H;
  const Z=h.dive?Math.max(vw/(SCREEN.w*W),vh/(SCREEN.h*H))*1.04:h.wall?2.2:1.35;
  const zf=cur.zf,z=Math.exp(Math.log(Z)*zf);
  let tx=-cur.x*(1-zf)+(vw/2-ox)*zf,ty=-cur.y*(1-zf)+(vh*.5-oy)*zf;
  if(!h.dive){tx=clamp(tx,vw-W*z-ox*(1-z),-ox*(1-z));ty=clamp(ty,vh-H*z-oy*(1-z),-oy*(1-z));}
  room.style.transformOrigin=ox.toFixed(1)+'px '+oy.toFixed(1)+'px';
  room.style.transform=`translate3d(${tx.toFixed(2)}px,${ty.toFixed(2)}px,0) scale(${z.toFixed(4)})`;
  /* bilgisayarin masaustu tum ekrani kaplarken oda arkada bosuna cizilmez (pencereler akici kalsin) */
  const hidden=ui.covers()&&!document.getElementById('screen').hidden&&goal.zf>0&&cur.zf>.98;
  if(hidden){last=now;requestAnimationFrame(tick);return;}
  if(gl)gl.draw(dt,px,py);
  /* resmin ustundeki parcalar resimle ayni derinlikte kaysin */
  for(const o of deep){const X=(px*(o.d-.5)*2*M*W).toFixed(2)+'px';o.el.style.translate=`${o.el===catEl?`calc(-50% + ${X})`:X} ${(py*(o.d-.5)*2*M*H).toFixed(2)}px`;}
  catTick(now);paintCat(now);paintScr();
  if(now-dustT>40){dustT=now;drawDust(now);}
  requestAnimationFrame(tick);
}

/* ---------- baslat ---------- */
(async function(){
  layout();paintLang();
  try{
    if(qp.get('no3d'))throw 0;
    const[d,ids]=await Promise.all([loadImg('assets/room-depth.png'),loadImg('assets/room-ids.png')]);
    DW=d.naturalWidth;DH=d.naturalHeight;
    const rd=(img)=>{const c=document.createElement('canvas');c.width=DW;c.height=DH;const x=c.getContext('2d',{willReadFrequently:true});x.imageSmoothingEnabled=false;x.drawImage(img,0,0,DW,DH);return x.getImageData(0,0,DW,DH).data;};
    depthData=rd(d);idData=rd(ids);
    /* resimde olmayan esyalar (QR ve Bogaz tablolari) maskeye burada eklenir */
    for(const h of HOTSPOTS)if(h.drawn)for(const[a0,b0,a1,b1]of h.idRects||[h.box]){for(let y=Math.round(b0*DH);y<Math.round(b1*DH);y++)for(let x=Math.round(a0*DW);x<Math.round(a1*DW);x++)idData[(y*DW+x)*4]=h.n*16;}
    for(const o of deep)o.d=depthAt(o.u,o.v);
    gl=initGL(d,ids);
    if(gl){catDepth=depthAt(cat.x,FLOOR-.03);document.documentElement.classList.add('glov');}
  }catch(e){console.warn(e);gl=null;}
  if(!gl){document.documentElement.classList.add('nogl');for(const{b}of hotEls)b.classList.add('box');}
  layout();paintTod();
  if(gl)setTimeout(()=>{for(const t of['day','night','morning','sunset'])gl.preload(t);},2500);
  requestAnimationFrame(tick);
  if(qp.get('wall'))setTimeout(()=>wall.show(),300);
  if(qp.get('panel'))setTimeout(()=>ui.show(qp.get('panel')),200);
  if(qp.get('hot')){const h=HOTSPOTS.find(x=>x.id===qp.get('hot'));if(h)setTimeout(()=>openHot(h),500);}
  if(qp.get('hl')){hover=lastHot=+qp.get('hl');hoverK=1;const h=byN[hover];if(h)hoverUV=hoverTarget=[h.x+h.w*.5,h.y+h.h*.45];}
  if(qp.get('edit'))document.documentElement.classList.add('edit');
  if(qp.get('ptr')){const[a,b]=qp.get('ptr').split(',').map(Number);ptr.x=ptrGoal.x=a;ptr.y=ptrGoal.y=b;}
})();
window.site={cat,goal,cur,pet,setMode,HOTSPOTS,ptr,ptrGoal,pickAt,get hover(){return hover;},set hover(v){hover=v;}};
if('serviceWorker' in navigator&&/^https?:/.test(location.protocol)&&location.hostname!=='localhost')navigator.serviceWorker.register('sw.js').catch(()=>{});
