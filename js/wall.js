/* Not duvari: soldaki renkli kagitlardan birini duvara surukle, yaz, yapistir.
   Notlar Supabase'de (mert-portfolio / notes) durur. Anahtar herkese aciktir;
   tablo kurallari yalnizca okumaya ve not eklemeye izin verir. */
const URL_='https://shiykssegogufypnprfw.supabase.co/rest/v1/notes',KEY='sb_publishable_uMZ8iXPpRP9Awo8kpGcq3w_dooLrhmX';
const COLORS=['yellow','pink','blue','green'];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const hash=n=>{let h=2166136261;for(const c of String(n)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0)/4294967296;};

export function initWall(o){
  const el=document.getElementById('wall'),board=el.querySelector('.board'),chips=el.querySelector('.chips');
  let open=false,draft=null,loaded=false;
  const L=()=>o.L();

  function noteEl(n){
    const li=document.createElement('div'),id=n.id||n.created_at||n.body;
    li.className='note '+(COLORS.includes(n.color)?n.color:'yellow');
    const x=typeof n.x==='number'?n.x:.12+hash(id+'x')*.76,y=typeof n.y==='number'?n.y:.2+hash(id+'y')*.6;
    li.style.left=x*100+'%';li.style.top=y*100+'%';li.style.setProperty('--r',(hash(id)*6-3).toFixed(2)+'deg');
    const p=document.createElement('p'),s=document.createElement('small');
    p.textContent=n.body;s.textContent=n.name;li.append(p,s);return li;
  }
  function load(){
    fetch(URL_+'?select=id,name,body,color,x,y,created_at&approved=is.true&order=created_at.desc&limit=80',{headers:{apikey:KEY}})
      .then(r=>r.ok?r.json():Promise.reject()).then(rows=>{
        loaded=true;board.querySelectorAll('.note[data-srv]').forEach(n=>n.remove());
        /* yeni yapistirilan not sunucudan da gelirse yerel kopyasi kalkar */
        const seen=new Set(rows.map(n=>n.body+'|'+n.name));board.querySelectorAll('.note.stuck').forEach(n=>{if(seen.has(n.dataset.k))n.remove();});
        rows.reverse().forEach((n,i)=>{const e=noteEl(n);e.dataset.srv='1';e.style.animationDelay=Math.min(i*25,600)+'ms';e.classList.add('in');board.appendChild(e);});
      }).catch(()=>{});
  }
  function discard(){if(draft){draft.remove();draft=null;}}
  function place(d,cx,cy){
    const r=board.getBoundingClientRect(),hw=d.offsetWidth/2/r.width,hh=d.offsetHeight/2/r.height;
    d._x=clamp((cx-r.left)/r.width,hw+.01,1-hw-.01);d._y=clamp((cy-r.top)/r.height,hh+.01,1-hh-.01);
    d.style.left=d._x*100+'%';d.style.top=d._y*100+'%';
  }
  function makeDraft(color,keep){
    const d=document.createElement('form');d.className='note draft '+color;d.noValidate=true;d._color=color;
    d.innerHTML=`<textarea name="body" maxlength="140" rows="3" required></textarea><input name="name" maxlength="24" autocomplete="nickname"><input name="site" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true"><div class="act"><span class="msg" role="status"></span><button type="submit"></button></div>`;
    d.elements.body.placeholder=L().noteBody;d.elements.name.placeholder=L().noteName;d.querySelector('button').textContent=L().noteSend;
    if(keep){d.elements.body.value=keep.body;d.elements.name.value=keep.name;}
    d.addEventListener('submit',e=>{e.preventDefault();stick(d);});
    /* taslak, yazi alanlari disindan tutulup tasinabilir */
    d.addEventListener('pointerdown',e=>{if(e.target.closest('textarea,input,button'))return;e.preventDefault();drag(d,e,false);});
    return d;
  }
  function drag(d,e,fresh){
    let moved=false;const sx=e.clientX,sy=e.clientY;
    d.classList.add('held');
    const mv=ev=>{if(Math.hypot(ev.clientX-sx,ev.clientY-sy)>6)moved=true;place(d,ev.clientX,ev.clientY);};
    const up=ev=>{
      removeEventListener('pointermove',mv);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);
      d.classList.remove('held');
      /* yeni kagit suruklenmeden birakildiysa (dokunmatik): duvarin ortasina yakin bir yere konur */
      if(fresh&&!moved){const r=board.getBoundingClientRect();place(d,r.left+r.width*(.4+Math.random()*.2),r.top+r.height*(.4+Math.random()*.15));}
      if(fresh)d.elements.body.focus({preventScroll:true});
    };
    addEventListener('pointermove',mv);addEventListener('pointerup',up);addEventListener('pointercancel',up);
  }
  chips.addEventListener('pointerdown',e=>{
    const c=e.target.closest('[data-c]');if(!c)return;e.preventDefault();
    const keep=draft?{body:draft.elements.body.value,name:draft.elements.name.value}:null;discard();
    draft=makeDraft(c.dataset.c,keep);board.appendChild(draft);place(draft,e.clientX,e.clientY);drag(draft,e,true);
  });
  function stick(d){
    const f=d.elements,msg=d.querySelector('.msg'),btn=d.querySelector('button');
    /* ad isteğe bağlı: boşsa 'anonim' olarak yapışır */
    const body=f.body.value.trim(),name=f.name.value.trim()||L().noteAnon;
    if(f.site.value)return;
    if(!body){msg.textContent=L().noteFill;return;}
    let lastAt=0;try{lastAt=+localStorage.getItem('noteAt')||0;}catch(_){}
    if(Date.now()-lastAt<60000){msg.textContent=L().noteWait;return;}
    btn.disabled=true;msg.textContent='';
    fetch(URL_,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({name,body,color:d._color,x:+d._x.toFixed(4),y:+d._y.toFixed(4)})})
      .then(r=>{if(!r.ok)throw 0;try{localStorage.setItem('noteAt',Date.now());}catch(_){}
        const n=noteEl({name,body,color:d._color,x:d._x,y:d._y,id:Date.now()});n.classList.add('stuck');n.dataset.k=body+'|'+name;board.appendChild(n);d.remove();draft=null;})
      .catch(()=>{msg.textContent=L().noteError;btn.disabled=false;});
  }
  function show(){
    open=true;el.hidden=false;el.querySelector('.x').setAttribute('aria-label',L().close);
    requestAnimationFrame(()=>el.classList.add('on'));load();
  }
  function close(){
    if(!open)return;open=false;discard();el.classList.remove('on');setTimeout(()=>{if(!open)el.hidden=true;},260);o.onClose&&o.onClose();
  }
  el.querySelector('.x').addEventListener('click',close);
  addEventListener('keydown',e=>{if(!open||e.key!=='Escape')return;if(draft)discard();else close();});
  return{show,close,isOpen:()=>open};
}
