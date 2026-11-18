/* Masaustu duvar kagidi: koyu zeminde yumusak, akan isik seritleri (ozgun bir cizim).
   Hem bilgisayarin icinde hem odadaki ekranda (piksellestirilerek) kullanilir. */
export function wallpaperSVG(dark){
  const W=1600,H=1000;
  const bg=dark?['#07080d','#121522']:['#0d1020','#1d2238'];
  const bands=[
    {d:'M-200 760 C 200 520 520 900 900 640 S 1500 380 1900 520',w:260,c:['#ff9a5a','#e8507a'],o:dark?.55:.75},
    {d:'M-200 860 C 260 700 620 980 1000 760 S 1560 560 1900 680',w:200,c:['#7a5cff','#3fa8ff'],o:dark?.5:.7},
    {d:'M-200 600 C 180 420 600 700 960 470 S 1520 260 1900 360',w:150,c:['#ffd27a','#ff7a8a'],o:dark?.35:.5},
    {d:'M-200 960 C 300 860 700 1040 1100 900 S 1600 780 1900 860',w:180,c:['#2fd1c4','#5b6cff'],o:dark?.4:.55},
  ];
  let defs=`<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient><filter id="soft" filterUnits="userSpaceOnUse" x="-400" y="-400" width="2400" height="1800"><feGaussianBlur stdDeviation="38"/></filter>`;
  bands.forEach((b,i)=>{defs+=`<linearGradient id="g${i}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${b.c[0]}"/><stop offset="1" stop-color="${b.c[1]}"/></linearGradient>`;});
  const glow=bands.map((b,i)=>`<path d="${b.d}" fill="none" stroke="url(#g${i})" stroke-width="${b.w}" stroke-linecap="round" opacity="${b.o}" filter="url(#soft)"/>`).join('');
  const lines=bands.map((b,i)=>`<path d="${b.d}" fill="none" stroke="url(#g${i})" stroke-width="${Math.round(b.w*.18)}" stroke-linecap="round" opacity="${(b.o*.9).toFixed(2)}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><rect width="${W}" height="${H}" fill="url(#bg)"/>${glow}${lines}</svg>`;
}
/* sitede hazir cizilmis dosyalar kullanilir (assets/wallpaper*.jpg); SVG yalnizca bunlari uretmek icin */
export const wallpaperFile=dark=>dark?'assets/wallpaper-dark.jpg':'assets/wallpaper.jpg';
export const wallpaperURL=dark=>`url("${wallpaperFile(dark)}")`;
