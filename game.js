'use strict';
/* ===== Super Isa Bros — motore ===== */
const STUN_TIME=3, STUN_IMMUNE=5;           // secondi: stordimento e immunità dopo (modificabili)
const FINAL_MSG=['Il Macellaio ha perso la tuta, la faccia e la clientela.','Il ristorante torna a riempirsi, come ogni sera.','Castellaneta Marina ha ritrovato un po’ di movimento. E Isa, finalmente, una partita tutta sua.'];   // schermata finale
const SPR=['boar_a','boar_d','boar_w','c1_atk','c1_hit','c1_idle','c1_ko','c1_walk','c2_atk','c2_hit','c2_idle','c2_ko','c2_walk','cat0','cat1','cat2','cat3','crab_a','crab_d','crab_w','dog0','dog1','dog2','dog3','gull_a','gull_d','gull_w','hk0','hk1','hk2','hk3','isa_atk','isa_idle','isa_jump','isa_run','jelly_a','jelly_d','jelly_w','m_pur','m_red','m_yel','mosq_a','mosq_d','mosq_w','ro0','ro1','ro2','ro3','umb_a','umb_d','umb_w','wolf_a','wolf_d','wolf_w','zc_a','zc_ko','zc_w','zc_w2','zs_a','zs_a2','zs_ko','zs_ko2','zs_w','zs_w2'];
const BGS=['v_room','v_net','b_beach','b_forest','b_hall','b_sea','b_ville','h_alley','h_beachtown','h_forest','h_hall','h_stage','h_street','r_ball','r_cant','r_corr','r_cucina','r_garden','r_sala','room_armory1','room_armory2','room_balls','room_carousel','room_lab','room_mirrors','s_beach','s_dayroad','s_jeep','s_lido','s_mush','s_night','s_nightroad','s_pine','s_shore','s_stalls','s_stalls2','s_sunset','v_gelato','v_kiosk','v_lighthouse','v_walk'];
const I={}, M={};
const c=document.getElementById('c'), x=c.getContext('2d');
c.width=1600;c.height=680;
function rs(){const s=Math.min(innerWidth/800,innerHeight/340);c.style.width=800*s+'px';c.style.height=340*s+'px';c.style.left=(innerWidth-800*s)/2+'px';c.style.top=(innerHeight-340*s)/2+'px'}
onresize=rs;rs();
/* ---------- salvataggio ---------- */
let SV={prog:{f:0,m:0,d:0},album:{},mute:0,df:'m',rec:[]};
try{const t=JSON.parse(localStorage.getItem('isabros2')||'null');if(t)SV=Object.assign(SV,t)}catch(e){}
function save(){try{localStorage.setItem('isabros2',JSON.stringify(SV))}catch(e){}}
/* ---------- audio ---------- */
let AC,mi=0,mt=0;
function au(){try{if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();if(AC.state!='running')AC.resume()}catch(e){}}
function tn(f,d,ty,v,t,f2,ab){if(!AC||SV.mute)return;const o=AC.createOscillator(),g=AC.createGain(),n=ab?t:AC.currentTime+t;o.type=ty;o.frequency.setValueAtTime(f,n);if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+d);g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(AC.destination);o.start(n);o.stop(n+d+.02)}
const mf=m=>440*Math.pow(2,(m-69)/12);
const SF={jump:[[0,.16,'square',.07,330,880]],atk:[[0,.1,'sawtooth',.05,500,200]],hit:[[0,.08,'square',.08,220,110]],kill:[[0,.07,'square',.08,400],[.07,.12,'square',.08,600]],pow:[[0,.08,'square',.07,523],[.08,.08,'square',.07,659],[.16,.08,'square',.07,784],[.24,.16,'square',.07,1047]],ouch:[[0,.25,'sawtooth',.09,400,100]],dead:[[0,.3,'square',.09,500,300],[.3,.3,'square',.09,300,150],[.6,.5,'square',.09,150,60]],slam:[[0,.3,'sawtooth',.12,120,40]],trans:[[0,.6,'square',.08,200,1200]],win:[[0,.12,'square',.08,523],[.12,.12,'square',.08,659],[.24,.12,'square',.08,784],[.36,.4,'square',.08,1047]],start:[[0,.1,'square',.06,392],[.1,.14,'square',.06,523]],stun:[[0,.06,'square',.08,900],[.06,.06,'square',.08,700],[.12,.1,'square',.08,500]],tap:[[0,.05,'square',.05,660]],door:[[0,.25,'sawtooth',.1,160,70]],flag:[[0,.1,'square',.07,660],[.1,.1,'square',.07,880],[.2,.2,'square',.07,1320]]};
function sfx(k){for(const a of SF[k]||[])tn(a[4],a[1],a[2],a[3],a[0],a[5])}

const SONGS={
title:{t:.125,L:[72, 76, 79, 0, 84, 0, 79, 76, 69, 72, 76, 0, 81, 0, 76, 72, 77, 0, 81, 84, 81, 0, 77, 0, 74, 0, 79, 83, 86, 0, 83, 79, 84, 0, 79, 76, 79, 0, 84, 0, 81, 0, 76, 72, 76, 0, 81, 0, 77, 81, 84, 81, 79, 83, 86, 83, 84, 0, 79, 0, 72, 0, 0, 0],B:[48, 55, 48, 55, 48, 55, 48, 55, 45, 52, 45, 52, 45, 52, 45, 52, 41, 48, 41, 48, 41, 48, 41, 48, 43, 50, 43, 50, 43, 50, 43, 50, 48, 55, 48, 55, 48, 55, 48, 55, 45, 52, 45, 52, 45, 52, 45, 52, 41, 43, 41, 43, 41, 43, 41, 43, 48, 55, 48, 55, 48, 55, 48, 55]},
day:{t:.115,L:[72, 76, 79, 0, 84, 0, 79, 76, 69, 72, 76, 0, 81, 0, 76, 72, 77, 0, 81, 84, 81, 0, 77, 0, 74, 0, 79, 83, 86, 0, 83, 79, 84, 0, 79, 76, 79, 0, 84, 0, 81, 0, 76, 72, 76, 0, 81, 0, 77, 81, 84, 81, 79, 83, 86, 83, 84, 0, 79, 0, 72, 0, 0, 0],B:[48, 55, 48, 55, 48, 55, 48, 55, 45, 52, 45, 52, 45, 52, 45, 52, 41, 48, 41, 48, 41, 48, 41, 48, 43, 50, 43, 50, 43, 50, 43, 50, 48, 55, 48, 55, 48, 55, 48, 55, 45, 52, 45, 52, 45, 52, 45, 52, 41, 43, 41, 43, 41, 43, 41, 43, 48, 55, 48, 55, 48, 55, 48, 55]},
day2:{t:.115,L:[79, 0, 83, 86, 83, 0, 79, 0, 76, 0, 79, 83, 88, 0, 83, 0, 72, 76, 79, 84, 79, 76, 79, 0, 74, 78, 81, 86, 81, 78, 74, 0, 83, 86, 91, 86, 83, 0, 79, 0, 88, 0, 83, 79, 83, 0, 76, 0, 84, 81, 79, 78, 74, 78, 79, 0, 79, 0, 0, 0, 67, 0, 0, 0],B:[43, 50, 43, 50, 43, 50, 43, 50, 40, 47, 40, 47, 40, 47, 40, 47, 48, 55, 48, 55, 48, 55, 48, 55, 38, 45, 38, 45, 38, 45, 38, 45, 43, 50, 43, 50, 43, 50, 43, 50, 40, 47, 40, 47, 40, 47, 40, 47, 48, 38, 48, 38, 48, 38, 48, 38, 43, 50, 43, 50, 43, 50, 43, 50]},
night:{t:.2,L:[76,0,0,72,0,0,69,0, 71,0,0,74,0,0,76,0, 77,0,0,74,0,0,72,0, 71,0,69,0,68,0,0,0],
 B:[45,0,0,0,52,0,0,0, 43,0,0,0,50,0,0,0, 41,0,0,0,48,0,0,0, 40,0,0,0,44,0,0,0]},
rest:{t:.14,L:[77,0,81,77,72,0,77,0, 79,0,82,79,74,0,79,0, 81,84,81,77,72,77,81,0, 79,77,74,77,72,0,0,0],
 B:[41,0,48,0,41,0,48,0, 43,0,50,0,43,0,50,0, 45,0,52,0,41,0,48,0, 43,0,50,0,36,0,41,0]},
boss:{t:.12,L:[74,74,0,77,74,0,81,74, 72,72,0,76,72,0,79,72, 70,70,0,74,70,0,77,70, 69,0,72,0,76,0,81,0],
 B:[38,38,0,38,38,0,38,38, 36,36,0,36,36,0,36,36, 34,34,0,34,34,0,34,34, 33,0,33,0,33,0,33,33]}};
let msong='title';
function noise(d,v,t){if(!AC||SV.mute)return;const n=Math.max(1,AC.sampleRate*d|0),b=AC.createBuffer(1,n,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);const s=AC.createBufferSource(),g=AC.createGain();s.buffer=b;g.gain.value=v;s.connect(g);g.connect(AC.destination);s.start(t)}
function songFor(){if(S=='play'||S=='intro'||S=='pause'||S=='clear'||S=='dead'){if(D){if(D.bossOn||D.arena&&D.arena.on)return'boss';if(D.key=='rest')return'rest';if(['night','nroad','e_sea','armory','lab','villa'].includes(D.key))return'night'}return lv%2?'day2':'day'}return'title'}
function mus(){if(!AC||SV.mute||AC.state!='running'||S=='load'||S=='pause')return;const sg=songFor();if(sg!=msong){msong=sg;mi=0;mt=0}const so=SONGS[msong],now=AC.currentTime;if(mt<now-.1)mt=now+.05;const q=(S=='play'||S=='intro')?1:.55;while(mt<now+.3){const n=so.L.length,i=mi%n,l=so.L[i],b=so.B[i];if(l)tn(mf(l),so.t*.9,'square',.028*q,mt,0,1);if(b)tn(mf(b),so.t*(so.B.length==so.L.length&&msong.startsWith('d')||msong=='title'?.95:1.8),'triangle',.07*q,mt,0,1);if(msong.startsWith('d')||msong=='title'){if(i%4==0)tn(120,.1,'sine',.09*q,mt,45,1);if(i%8==4)noise(.1,.07*q,mt);if(i%2==1)noise(.02,.018*q,mt)}else{if(i%8==0)noise(.09,.05*q,mt);else if(i%4==2)noise(.03,.02*q,mt)}mi++;mt+=so.t}}

/* ---------- input ---------- */
const K={};
['l','r','j','a'].forEach(k=>{const e=document.getElementById(k),d=v=>ev=>{ev.preventDefault();au();K[k]=v;if(v&&k=='a')K.ap=1;if(v&&k=='j')K.jp=1};e.onpointerdown=d(1);e.onpointerup=e.onpointercancel=e.onpointerleave=d(0)});
const KM={ArrowLeft:'l',ArrowRight:'r',ArrowUp:'j',' ':'j',z:'a',x:'a',a:'l',d:'r',w:'j'};
onkeydown=e=>{au();const m=KM[e.key];if(m){K[m]=1;if(m=='a')K.ap=1;if(m=='j')K.jp=1}if(e.key=='Escape'||e.key=='p')pauseToggle();if(S!='play'&&S!='intro'&&(e.key=='Enter'||e.key==' '))uiTap(-1,-1,1)};
onkeyup=e=>{const m=KM[e.key];if(m)K[m]=0};
function lp(e){const r=c.getBoundingClientRect();return[(e.clientX-r.left)/r.width*800,(e.clientY-r.top)/r.height*340]}
document.addEventListener('pointerdown',e=>{au();if(e.target.classList&&e.target.classList.contains('b'))return;const[px,py]=lp(e);uiTap(px,py)});
let UI=[];                                   // zone toccabili del frame corrente
function uiTap(px,py,key){for(let i=UI.length-1;i>=0;i--){const u=UI[i];if(key?u.def:(px>=u.x&&px<=u.x+u.w&&py>=u.y&&py<=u.y+u.h)){sfx('tap');u.fn();return}}if(S=='vig'&&!key)vigNext()}
function btn(X,Y,W,H,fn,def){UI.push({x:X,y:Y,w:W,h:H,fn,def})}
/* ---------- utilità ---------- */
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const rnd=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
function rr(X,Y,W,H,R){x.beginPath();x.moveTo(X+R,Y);x.arcTo(X+W,Y,X+W,Y+H,R);x.arcTo(X+W,Y+H,X,Y+H,R);x.arcTo(X,Y+H,X,Y,R);x.arcTo(X,Y,X+W,Y,R);x.closePath()}
function T(s,X,Y,z,col='#fff',al='center',lw=5){x.font='800 '+z+'px system-ui,sans-serif';x.textAlign=al;x.fillStyle=col;x.strokeStyle='#000';x.lineWidth=lw;x.lineJoin='round';if(lw)x.strokeText(s,X,Y);x.fillText(s,X,Y)}
function wrap(s,mw,z){x.font='800 '+z+'px system-ui,sans-serif';const w=s.split(' '),L=[];let cur='';for(const t of w){const n=cur?cur+' '+t:t;if(x.measureText(n).width>mw&&cur){L.push(cur);cur=t}else cur=n}if(cur)L.push(cur);return L}
function sp(n,px,py,s=1,fl=0,al=1,rot=0){const im=I[n];if(!im)return;const w=im.width/2*s,h=im.height/2*s;x.save();x.globalAlpha=al;x.translate(px,py);if(rot)x.rotate(rot);if(fl)x.scale(-1,1);x.drawImage(im,-w/2,-h,w,h);x.restore()}
function shadow(px,py,w,al=.28){x.save();x.globalAlpha=al;x.fillStyle='#000';x.beginPath();x.ellipse(px,py+1,w/2,w/7,0,0,7);x.fill();x.restore()}
function star(px,py,r,rot,col='#ffe14a'){x.save();x.translate(px,py);x.rotate(rot);x.fillStyle=col;x.strokeStyle='#8a5a00';x.lineWidth=1.2;x.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,q=i%2?r*.45:r;x.lineTo(Math.cos(a)*q,Math.sin(a)*q)}x.closePath();x.fill();x.stroke();x.restore()}
/* ---------- caricamento ---------- */
function loadAll(done){let n=0;const tot=SPR.length+BGS.length+1;
const ok=()=>{n++;if(n>=tot)done();else{x.fillStyle='#10131c';x.fillRect(0,0,800,340);T('Super Isa Bros',400,150,34,'#ffe066');x.fillStyle='#fff3';x.fillRect(250,200,300,10);x.fillStyle='#ffd23f';x.fillRect(250,200,300*n/tot,10)}};
x.setTransform(2,0,0,2,0,0);
for(const k of SPR){const i=new Image();i.onload=ok;i.onerror=ok;i.src='sp/'+k+'.png';I[k]=i}
for(const k of BGS){const i=new Image();i.onload=ok;i.onerror=ok;i.src='bg/'+k+'.jpg';I[k]=i}
const l=new Image();l.onload=ok;l.onerror=ok;l.src='ui/logo.png';I.logo=l;
fetch('bg/meta.json').then(r=>r.json()).then(j=>{Object.assign(M,j)}).catch(()=>{})}
/* layout sfondo: scala, offset, altezza del terreno */
function lay(n){const m=M[n]||{band:.8,mode:'cover'},im=I[n],w=im.width||800,h=im.height||340;
if(m.mode=='room'){const s=340/h;return{s,w:w*s,dh:340,band:m.band,top:m.top,gl:Math.round(m.band*340)}}
if(m.mode=='strip'){const dh=m.drawh,s=dh/h;return{s,w:w*s,dh,band:m.band,top:m.top,gl:Math.round(340-dh+m.band*dh)}}
const s=Math.max(800/w,340/h),dh=h*s,oy=Math.max(340-dh,Math.min(0,270-m.band*dh));return{s,w:w*s,dh,band:m.band,top:m.top,gl:Math.round(oy+m.band*dh)}}

/* ---------- vignette ---------- */
const V={
s1:{t:'Castellaneta Marina',bg:'b_ville',a:[],c:'Castellaneta Marina è un piccolo paesino sul mare, dove la vita scorre lentissima. Da tanto tempo non accade nulla che scuota la quiete del paese.'},
s2:{t:'Isa e il ristorante',bg:'r_garden',a:[['isa_idle',200,2,0]],c:'Isa è presa da una vita frenetica e ha sempre meno tempo da dedicare alla sua passione: i videogame.'},
s3:{t:'La cameretta',bg:'v_room',a:[],o:[[525,60,650,274]],b:[['Il mio PC inizia a guardarmi male… sono due settimane che non gioco!',[580,82]]]},
s4:{t:'Aluki e Ico',bg:'v_room',a:[['dog0',270,2.4,0],['cat0',400,2.6,0]],o:[[525,60,650,274]],b:[['Voi siete gli unici che non mi chiedete ferie.',[580,82]]]},
s5:{t:'',bg:'h_beachtown',a:[['isa_idle',150,2,0],['ro0',250,2,0],['dog0',360,2.3,0],['hk0',450,2.1,0]],b:[['Per fare una passeggiata abbiamo solo 20 minuti. Al ristorante il turno inizia presto!',0]]},
s6:{t:'I funghi',bg:'s_mush',a:[['isa_idle',130,2,0]],p:[['mush','red',300,'Rosso: colpi doppi'],['mush','yel',480,'Giallo: assorbe un colpo'],['mush','pur',670,'Viola: tieni premuto il salto e voli']],b:[['Prima lo identifico e poi lo raccolgo!',0]]},

s7:{t:'La rete',bg:'v_net',a:[['c1_idle',590,1.2,1]],o:[[191,0,609,300]],fx:[['!',253,40]]},
s8:{t:'Aluki catturato',bg:'v_net',a:[],o:[[191,0,609,300]],b:[['Non posso credere che sia stato davvero lui! Dobbiamo recuperare Aluki subito!',[253,70]]]},
s10:{t:'Ro torna al ristorante',bg:'s_pine',a:[['isa_idle',130,2,0],['ro0',250,2,0],['hk0',350,2.1,0]],b:[['Torno al ristorante, i clienti arriveranno presto.',1]]},
jeep:{t:'Il sentiero della jeep',bg:'s_jeep',a:[['isa_run',150,2,0,60],['c1_walk',470,1.2,0,115]],b:[['Il tuo cane è in ottime mani, Isa. Le mie!',1],['Fermo!!',0]]},
resc:{t:'Aluki è salvo',bg:'s_lido',a:[['isa_idle',150,2,0],['dog2',330,2.5,0]],b:[['Aluki!',0],['Wof!',1]]},
ico1:{t:'Ico si è perso',bg:'s_night',a:[['isa_idle',170,2,0],['dog0',270,2.5,0]],c:'Nella fuga, Ico si è perso. Isa lo cerca fra i lampioni, dove la notte sa di sale.'},
ico2:{t:'Ico è tornato',bg:'s_night',a:[['isa_idle',170,2,0],['dog0',270,2.5,0],['cat0',380,2.6,1]],b:[['Ico! Eccoti, finalmente!',0]]},
rest1:{t:'Al ristorante',bg:'r_garden',a:[['ro0',150,2,0],['hk0',260,2.1,0],['zs_w',570,2,1],['zc_w',690,2,1]],b:[['Hanno bevuto tutti la limonata. Sono… diversi.',0]]},
preboss:{t:'Il pagliaccio',bg:'h_hall',a:[['isa_idle',120,2,0],['c1_idle',640,1.1,1]],b:[['Hai rapito Aluki. Ora la pagherai!',0],['Il tuo locale è sempre più pieno, la mia invidia!',1]]},
fase2:{t:'Senza tuta',bg:'h_stage',a:[['isa_idle',120,2,0],['c2_idle',640,1.1,1]],b:[['Avevo un ristorante, avevo anche un vestito oltre alla mia dignità, e tu me li hai portati via!',1]]},
fine1:{t:'Il Macellaio sconfitto',bg:'h_stage',a:[['isa_idle',200,2,0],['c2_ko',600,1.1,1]],c:'Il Macellaio ha perso la tuta, la faccia e la clientela.'},
fine2:{t:'Castellaneta Marina',bg:'s_sunset',a:[['isa_idle',200,2,0],['ro0',290,2,0],['dog0',390,2.3,0],['cat0',460,2.5,0],['hk0',550,2.1,0]],c:'Il ristorante torna a riempirsi, come ogni sera. Castellaneta Marina ha ritrovato un po’ di movimento. E Isa, finalmente, una partita tutta sua.'}
};
const VORD=['s1','s2','s3','s4','s5','s6','s7','s8','s10','jeep','resc','ico1','ico2','rest1','preboss','fase2','fine1','fine2'];
let vq=[],vi=0,vthen=null,vt=0;
function showVig(list,then){vq=list.slice();vi=0;vthen=then;if(!vq.length){then&&then();return}vq.forEach(id=>{SV.album[id]=1});save();S='vig';vt=0}
function vigNext(){if(vt<.25)return;sfx('tap');vi++;vt=0;if(vi>=vq.length){const f=vthen;vthen=null;f&&f()}}
function vigSkip(){vi=vq.length;const f=vthen;vthen=null;f&&f()}
function spH(n,sc){const im=I[n];return im&&im.height?im.height/2*sc:100}
function spW(n,sc){const im=I[n];return im&&im.width?im.width/2*sc:50}
function propBox(pr,gy){const k=pr[0];if(k=='net')return[pr[1]-pr[3]-8,pr[2]-pr[3]-70,pr[1]+pr[3]+8,pr[2]+pr[3]+8];if(k=='netflat')return[pr[1]-130,gy-40,pr[1]+130,gy+6];if(k=='mush')return[pr[2]-62,gy-spH('m_'+pr[1],1.9)-40,pr[2]+62,gy];if(k=='tree')return[pr[1]-110,6,pr[1]+110,gy];return null}
function vigLayout(v){if(v._L)return v._L;const z=16;x.font='800 '+z+'px system-ui,sans-serif';const cap=v.c?wrap(v.c,735,17):null,capH=cap?cap.length*22+16:0,gy=cap?300-capH+6:274;
const acts=(v.a||[]).map(([n,ax,sc,fl,vx])=>({n,ax,sc,fl,vx:vx||0,top:gy-spH(n,sc),hw:spW(n,sc)*.42}));
const obs=acts.map(a=>[a.ax-a.hw,a.top,a.ax+a.hw,gy]);for(const pr of v.p||[]){const b=propBox(pr,gy);if(b)obs.push(b)}if(cap)obs.push([0,300-capH,800,300]);for(const o of v.o||[])obs.push(o);
const out=[];(v.b||[]).forEach(([s,who])=>{x.font='800 '+z+'px system-ui,sans-serif';const L=wrap(s,190,z),w=Math.max(...L.map(l=>x.measureText(l).width))+24,h=L.length*(z+5)+14;let tx,ty;
 if(typeof who=='number'&&who>=0&&acts[who]){tx=acts[who].ax;ty=acts[who].top-3}else if(Array.isArray(who)){tx=who[0];ty=who[1]}else if(who==-2){tx=815;ty=gy-90}else{tx=-15;ty=gy-80}
 let best=null,bd=1e9;for(let yy=6;yy<=gy-h-8;yy+=10)for(let xx=6;xx<=794-w;xx+=14){const r=[xx,yy,xx+w,yy+h];if(obs.some(o=>r[0]<o[2]+8&&r[2]>o[0]-8&&r[1]<o[3]+4&&r[3]>o[1]-4))continue;const d=Math.abs(xx+w/2-tx)+Math.abs(yy+h-ty)*1.3;if(d<bd){bd=d;best=[xx,yy]}}
 if(!best)best=[6,6];obs.push([best[0],best[1],best[0]+w,best[1]+h]);out.push({s,L,w,h,x:best[0],y:best[1],tx,ty})});
return v._L={gy,acts,cap,capH,bub:out}}
function drawNet(X,Y,R){x.save();x.translate(X,Y);x.fillStyle='rgba(190,220,255,.16)';x.beginPath();x.arc(0,0,R+10,0,7);x.fill();sp('dog0',0,R*.62,R/32,0);x.strokeStyle='#f3eedf';x.lineWidth=2.2;
for(const a of[.3,.6,.85]){x.beginPath();x.ellipse(0,0,R*a,R,0,0,7);x.stroke()}for(const b of[-.7,-.35,0,.35,.7]){const w=R*Math.sqrt(1-b*b);x.beginPath();x.ellipse(0,R*b,w,w*.2,0,0,7);x.stroke()}
x.lineWidth=4;x.beginPath();x.arc(0,0,R,0,7);x.stroke();x.strokeStyle='#b68a52';x.lineWidth=5;x.beginPath();x.moveTo(0,-R);x.lineTo(R*.9,-R-52);x.stroke();x.fillStyle='#b68a52';x.beginPath();x.arc(0,-R-2,7,0,7);x.fill();
const lw=R*2.05,ly=R*.3;x.fillStyle='#efe3c4';x.strokeStyle='#5a3c1e';x.lineWidth=2.5;rr(-lw/2,ly,lw,24,6);x.fill();x.stroke();x.setLineDash([3,3]);x.strokeStyle='#9a7a50';x.lineWidth=1;rr(-lw/2+3,ly+3,lw-6,18,4);x.stroke();x.setLineDash([]);
x.fillStyle='#d63030';x.beginPath();x.arc(-lw/2+14,ly+12,5.5,0,7);x.fill();x.strokeStyle='#555';x.lineWidth=2;x.beginPath();x.moveTo(-lw/2+8,ly+19);x.lineTo(-lw/2+20,ly+6);x.stroke();
x.fillStyle='#3a220c';x.font='800 11px system-ui,sans-serif';x.textAlign='left';x.fillText('Il Macellaio · Pagliaccio',-lw/2+24,ly+16);x.restore()}
function drawNetFlat(X,Y,rx,ry){x.save();x.translate(X,Y);x.fillStyle='rgba(205,215,225,.22)';x.beginPath();x.ellipse(0,0,rx,ry,0,0,7);x.fill();x.strokeStyle='#f3eedf';x.lineWidth=2.4;
for(let k=-5;k<=5;k++){const f=k/5.4,h=ry*Math.sqrt(1-f*f);x.beginPath();x.moveTo(f*rx,-h);x.lineTo(f*rx,h);x.stroke()}for(let k=-2;k<=2;k++){const f=k/2.6,w=rx*Math.sqrt(1-f*f);x.beginPath();x.moveTo(-w,f*ry);x.lineTo(w,f*ry);x.stroke()}
x.lineWidth=4;x.beginPath();x.ellipse(0,0,rx,ry,0,0,7);x.stroke();const lw=rx*1.55,lh=ry*1.1;x.fillStyle='#efe3c4';x.strokeStyle='#5a3c1e';x.lineWidth=3;rr(-lw/2,-lh/2,lw,lh,7);x.fill();x.stroke();x.setLineDash([4,3]);x.strokeStyle='#9a7a50';x.lineWidth=1.2;rr(-lw/2+4,-lh/2+4,lw-8,lh-8,5);x.stroke();x.setLineDash([]);
x.fillStyle='#d63030';x.beginPath();x.arc(-lw/2+17,0,7,0,7);x.fill();x.strokeStyle='#555';x.lineWidth=2.4;x.beginPath();x.moveTo(-lw/2+10,9);x.lineTo(-lw/2+25,-9);x.stroke();x.fillStyle='#3a220c';x.font='800 15px system-ui,sans-serif';x.textAlign='left';x.fillText('Il Macellaio · Pagliaccio',-lw/2+32,5);x.restore()}
function drawTree(X,gy){x.fillStyle='#5f3b24';x.beginPath();x.moveTo(X-22,gy);x.lineTo(X-14,60);x.lineTo(X+14,60);x.lineTo(X+22,gy);x.fill();x.fillRect(X-100,gy-150,100,12);x.fillStyle='#2f7a2c';for(const[ox,oy,rx,ry]of[[-40,40,80,34],[40,34,90,36],[0,66,70,28]]){x.beginPath();x.ellipse(X+ox,oy,rx,ry,0,0,7);x.fill()}sp('cat0',X-62,gy-150,2.7,0)}
function drawVigScene(v,X,Y,W,H,small){const s=small?Math.max(W/800,H/300):W/800;x.save();x.beginPath();x.rect(X,Y,W,H);x.clip();x.translate(X+(W-800*s)/2,Y+(H-300*s)/2);x.scale(s,s);x.beginPath();x.rect(0,0,800,300);x.clip();
const im=I[v.bg];if(im&&im.width){const bs=Math.max(800/im.width,300/im.height)*(small?1:1+Math.min(vt,8)*.004),w=im.width*bs,h=im.height*bs,m=M[v.bg]||{};let oy=300-h;if(m.mode=='room'||v.bg=='v_room')oy=(300-h)/2;x.drawImage(im,(800-w)/2,oy,w,h)}else{x.fillStyle='#345';x.fillRect(0,0,800,300)}
const L=vigLayout(v),gy=L.gy;
for(const pr of v.p||[]){if(pr[0]=='netflat')drawNetFlat(pr[1],gy-16,120,26);if(pr[0]=='tree')drawTree(pr[1],gy)}
for(const a of L.acts){shadow(a.ax,gy,60*a.sc/1.5);sp(a.n,a.ax+(small?0:a.vx*Math.min(vt,3.5)),gy+(small?0:Math.sin(vt*(a.vx?9:2)+a.ax)*(a.vx?2.5:1.2)),a.sc,a.fl)}
for(const pr of v.p||[]){if(pr[0]=='net')drawNet(pr[1],pr[2]+(small?0:Math.sin(vt*2.2)*4),pr[3]);if(pr[0]=='mush'){const mx=pr[2];shadow(mx,gy,40,.25);sp('m_'+pr[1],mx,gy+(small?0:Math.sin(vt*3+mx)*2),1.9);if(!small){x.font='800 12px system-ui,sans-serif';const w=x.measureText(pr[3]).width+16;x.fillStyle='#ffd23f';x.strokeStyle='#000';x.lineWidth=2.5;rr(mx-w/2,gy-spH('m_'+pr[1],1.9)-34,w,22,7);x.fill();x.stroke();x.fillStyle='#2a1a00';x.textAlign='center';x.fillText(pr[3],mx,gy-spH('m_'+pr[1],1.9)-18)}}}
if(v.fx&&!small)for(const[c,fx,fy]of v.fx)T(c,fx,(fy??gy-spH('isa_idle',2)-8)+Math.sin(vt*8)*3,46,'#ff4d4d','center',5);
if(!small){for(const b of L.bub)drawBub(b);if(L.cap){x.fillStyle='rgba(10,10,24,.86)';x.fillRect(0,300-L.capH,800,L.capH);x.fillStyle='#fff';x.textAlign='left';x.font='800 17px system-ui,sans-serif';L.cap.forEach((l,i)=>x.fillText(l,26,300-L.capH+25+i*22))}}
x.restore()}
function drawBub(b){x.save();x.lineJoin='round';const ax=cl(b.tx,b.x+18,b.x+b.w-18),by=b.y+b.h,tx=cl(b.tx,-4,804),ty=b.ty;x.fillStyle='#fff';x.strokeStyle='#111';x.lineWidth=3;x.beginPath();x.moveTo(ax-10,by-2);x.lineTo(tx,ty);x.lineTo(ax+12,by-2);x.closePath();x.fill();x.stroke();rr(b.x,b.y,b.w,b.h,13);x.fill();x.stroke();
x.beginPath();x.moveTo(ax-9,by);x.lineTo(ax+11,by);x.strokeStyle='#fff';x.lineWidth=4;x.stroke();x.fillStyle='#111';x.textAlign='left';x.font='800 16px system-ui,sans-serif';b.L.forEach((l,i)=>x.fillText(l,b.x+12,b.y+22+i*21));x.restore()}
function drawVigScreen(){const id=vq[vi],v=V[id];if(!v)return;vt+=1/60;
x.fillStyle='#14131f';x.fillRect(0,0,800,340);x.fillStyle='#ffd23f';rr(8,6,784,328,10);x.fill();x.fillStyle='#14131f';rr(12,28,776,300,6);x.fill();
x.fillStyle='#14131f';x.font='800 15px system-ui,sans-serif';x.textAlign='left';x.fillText(v.t||'',18,22);
drawVigScene(v,12,28,776,300);
x.fillStyle='#000c';rr(730,300,54,22,8);x.fill();T((vi+1)+'/'+vq.length,757,316,13,'#fff','center',0);
x.fillStyle='#14131f';x.textAlign='right';x.font='800 15px system-ui,sans-serif';x.fillText('Salta ▸',784,22);
btn(700,0,100,30,vigSkip)}

/* ===== livelli e logica ===== */
const DIF={f:{n:'Facile',len:2.2,den:2.6,sp:1,hp:3,mu:1.2,cp:1,extra:0},m:{n:'Medio',len:2.6,den:3.4,sp:1.12,hp:3,mu:1,cp:1,extra:1},d:{n:'Difficile',len:3,den:4.6,sp:1.3,hp:2,mu:.9,cp:1,extra:2}};
const RESTROOMS=['r_garden','r_sala','r_cucina','r_cant','r_ball','r_corr'];
const STEPS={r_cucina:[[0,0],[250,-30],[310,-60],[370,-90],[520,-60],[580,-30],[640,0]],r_ball:[[0,0],[130,-40],[190,-80],[270,-40],[330,0]],r_corr:[[0,0],[120,-45],[180,-90],[250,-45],[310,0]]};
const INTRO=['s1','s2','s3','s4','s5','s6'];
const SG={
e_pine:{n:'La pineta',bg:['b_forest'],pool:['mosq','boar','gull','boar'],script:'intro',v:INTRO},
e_beach:{n:'La spiaggia',bg:['b_beach'],pool:['crab','umb','gull','boar','jelly','crab'],mini:'crab',cage:1,ev:['resc'],v:['jeep']},
e_sea:{n:'Lungomare di sera',bg:['b_sea'],pool:['wolf','mosq','jelly','gull','umb','wolf'],v:['ico1'],ev:['ico2'],ico:1},
e_ville:{n:'Tra le ville',bg:['b_ville'],pool:['boar','wolf','gull','mosq','umb'],v:[]},
pine:{n:'La pineta',bg:['s_pine'],pool:['mosq','boar','gull','boar'],script:'intro',v:INTRO},
mush:{n:'La radura dei funghi',bg:['s_mush'],pool:['mosq','boar','wolf','gull'],v:[]},
jeep:{n:'Il sentiero della jeep',bg:['s_jeep'],pool:['boar','mosq','gull','wolf','boar'],mini:'boar',cage:1,ev:['resc'],v:['jeep']},
walk:{n:'La passerella sul mare',bg:['v_walk'],pool:['gull','crab','mosq','jelly'],v:[]},
beach:{n:'La spiaggia',bg:['s_beach'],pool:['crab','umb','gull','boar','jelly','crab'],v:[]},
lido:{n:'Il lido con piscina e molo',bg:['s_lido'],pool:['crab','umb','jelly','gull','crab'],v:[]},
kiosk:{n:'Il chiosco sulla sabbia',bg:['v_kiosk'],pool:['crab','umb','gull','boar'],v:[]},
dayroad:{n:'Il lungomare di giorno',bg:['s_dayroad'],pool:['gull','umb','mosq','boar','crab'],v:[]},
sunset:{n:'Lungomare al tramonto',bg:['s_sunset','s_stalls2'],pool:['wolf','mosq','jelly','gull','umb'],v:[]},
stalls:{n:'Le bancarelle e il gelato',bg:['s_stalls','v_gelato'],pool:['wolf','mosq','umb','gull','boar'],v:[]},
shore:{n:'La strada sul mare',bg:['s_shore'],pool:['gull','boar','mosq','umb','wolf'],v:[]},
night:{n:'Lungomare di notte',bg:['s_night','s_nightroad'],pool:['wolf','wolf','mosq','jelly','gull'],v:['ico1'],ev:['ico2'],ico:1},
nroad:{n:'La strada di notte',bg:['s_nightroad'],pool:['wolf','mosq','boar','wolf','zs'],v:[]},
ville:{n:'Tra le ville',bg:['b_ville'],pool:['boar','wolf','gull','mosq','umb'],v:[]},
centro:{n:'Il centro storico',bg:['h_alley'],pool:['boar','wolf','mosq','umb','zs'],v:[]},
btown:{n:'Il borgo sul mare',bg:['h_beachtown'],pool:['boar','wolf','zs','mosq','zs','umb'],v:[]},
armory:{n:'L’armeria del pagliaccio',rooms:['room_armory1','room_armory2',['room_armory1',1],['room_armory2',1]],pool:['zs','wolf','boar','mosq','zs'],mini:'boar',v:[],pc:'#b57a3a'},
lab:{n:'La cantina-laboratorio',rooms:['r_cant','room_lab',['r_cant',1],['room_lab',1]],pool:['zs','zs','mosq','wolf','zs'],mini:'zs',v:[],pc:'#a8793f'},
rest:{n:'Il ristorante di Isa',rooms:RESTROOMS,arenaRooms:['r_ball','r_sala'],pool:['zs','zc','zs','wolf','mosq','umb','zc'],join:['ro','hk'],v:['rest1'],pc:'#c9a36b'},
villa:{n:'La villa del pagliaccio',rooms:['room_mirrors','room_carousel','room_balls',['room_mirrors',1]],bossRoom:'h_hall',pool:['zs','zs','wolf','mosq','zs'],v:[],pc:'#b8884a'}
};
const LV={f:['e_pine','e_beach','e_sea','e_ville','rest','villa'],
m:['pine','jeep','beach','lido','sunset','night','ville','centro','rest','villa'],
d:['pine','mush','jeep','walk','beach','lido','kiosk','dayroad','sunset','stalls','shore','night','nroad','ville','centro','btown','rest','armory','lab','villa']};
const CS={dog:['dog0','dog1','dog2'],cat:['cat0','cat1','cat2'],ro:['ro0','ro1','ro3'],hk:['hk0','hk1','hk2']};
const CNAME={dog:'Aluki',cat:'Ico',ro:'Ro',hk:'Kayn'};
let PEND=null,LZ=[],RG=[],free=0,lap=0,score=0;
let S='load',lv=0,df=SV.df||'m',D=null,p={x:0,y:0,f:1},en=[],it=[],cp=[],wv=[],pt=[],bs=null,cam=0,tm=0,T0=0,bub=null,shake=0,cpx=0,hs=0;const Q=[],TP={};
const isZ=t=>t=='zs'||t=='zc';
function say(s,d=3){Q.push([s,d])}function tip(k,s){if(!TP[k]){TP[k]=1;say(s)}}
function gp(a,b2,g,r){const P=[];let x=a;while(x<b2-150){const n=1+(r()*4|0);let h=58+r()*16,xx=x;for(let k=0;k<n;k++){const w=70+r()*50;P.push([xx|0,(g-h)|0,w|0]);xx+=w+38+r()*36;h+=36+r()*10;if(h>210)break}x=xx+170+r()*190}return P}
function mk(key){const st=SG[key],d=DIF[df],r=rnd(key.length*97+key.charCodeAt(0)*13+key.charCodeAt(key.length-1)+lap*31),o={key,n:st.n,pool:st.pool,pc:st.pc||'#8a5a2b',mini:null,ng:0,cage:!!st.cage,ico:!!st.ico,script:st.script||0,sc:0,e:[],i:[]};
const elix=free||['rest','armory','lab','villa'].includes(key),den=d.den*(free?1+.3*lap:1);
let EX;
if(st.rooms){let list=st.rooms.map(q=>Array.isArray(q)?q:[q,0]);const base=list.slice();let tot=list.reduce((s2,q)=>s2+lay(q[0]).w,0),k2=0;const tgt=3200*d.len*(key=='villa'?.8:1);
 while(tot<tgt&&k2<60){const q=base[k2%base.length];list.push([q[0],(q[1]+((k2/base.length|0)+1))&1]);tot+=lay(q[0]).w;k2++}
 if(st.arenaRooms)list=list.concat(st.arenaRooms.map((n,i)=>[n,i,'A']));
 if(st.bossRoom)list.push([st.bossRoom,0,'B']);
 const rooms=[];let ox=0;
 for(const[n,f,k]of list){const L=lay(n);const bossR=k=='B';const w=bossR?800:L.w,g=bossR?292:L.gl;const q={bg:n,w,x:ox,g,f,k,s:bossR?[800/I[n].width,340/I[n].height]:[L.s,L.s],st:(k||f)?0:STEPS[n]||0};ox+=w;rooms.push(q)}
 o.rooms=rooms;o.W=ox;o.ng=1;o.gl=rooms[0].g;
 o.gf=v=>{for(const q of rooms)if(v<q.x+q.w||q==rooms[rooms.length-1]){let dy=0;if(q.st)for(const[a,e]of q.st)if(v-q.x>=a)dy=e;return q.g+dy}};
 o.p=[];EX=o.W;
 const ar=rooms.find(q=>q.k=='A'),br=rooms.find(q=>q.k=='B');
 if(ar){const aw=rooms.filter(q=>q.k=='A').reduce((s2,q)=>s2+q.w,0);o.arena={x:ar.x,w:aw,on:false,done:false,wave:0,g:ar.g};
  const b=d.extra;o.arena.waves=[['zs','zc'].concat(b?['zs']:[]),['zs','zc','zs'].concat(b>1?['zc','zs']:b?['zc']:[]),['zc','zs','zc','zs'].concat(b>1?['zc','zs','zc']:b?['zs']:[])];EX=ar.x-40}
 if(br){o.bossX=br.x;o.bgl=br.g;EX=br.x-40}
 for(const q of rooms)if(!q.k)o.p.push(...gp(q.x+60,q.x+q.w-30,q.g,r));
 if(elix){const ek=['ec','es','eg'];let ei=0;for(const q of rooms){if(q.k)continue;const P=o.p.filter(pl=>pl[0]>=q.x+40&&pl[0]<q.x+q.w-120);const kind=q.bg=='r_cucina'?'ec':q.bg=='r_cant'?'es':q.bg=='r_corr'?'eg':ek[ei++%3];if(P.length&&r()<.9){const pl=P[r()*P.length|0];o.i.push([kind,pl[0]+pl[2]/2,pl[1]-26])}else if(r()<.7){o.i.push([kind,q.x+q.w*(.3+r()*.4),q.g-26])}}}
 o.goal=br?null:[o.W-70,rooms[rooms.length-1].g]}
else{const L=lay(st.bg[0]),m=M[st.bg[0]]||{};o.W=Math.round(3200*d.len);o.gl=L.gl;o.gc=m.gc||'#333';o.top=m.top||'#222';o.p=gp(380,o.W-250,o.gl,r);o.goal=[o.W-70,o.gl];EX=o.W-250;o.bgs=st.bg;
 if(elix){const ek=['ec','es','eg'];let ei=0;for(let k=0;k<o.p.length;k+=7){const pl=o.p[k];o.i.push([ek[ei++%3],pl[0]+pl[2]/2,pl[1]-26])}}}
const ks=['pur','red','yel'];let ki=0;
if(!o.script){for(const q of o.p){const gg=o.gf?o.gf(q[0]):o.gl;if(gg-q[1]>=105&&q[0]>420&&r()<.4){const t=r()<.7?'mosq':'gull';o.e.push([t,q[0]+q[2]/2|0,undefined,gg,0,q[1]-46])}}}

for(const q of o.p)if(r()<.7*d.mu)o.i.push([ks[ki++%3],q[0]+q[2]/2,q[1]-26]);
for(let gx=520;gx<EX;gx+=470+r()*300){const g2=o.gf?o.gf(gx):o.gl;o.i.push([ks[ki++%3],gx,g2-26])}
if(o.script=='intro')o.i.push(['red',260,o.gl-26],['yel',350,o.gl-26],['pur',440,o.gl-26]);
const span=Math.max(0,EX-420),n=Math.round(span/800*den*(st.rooms?2:1));
for(let k=0;k<n;k++){const ex=(420+span*(k+r())/n)|0,t=st.pool[r()*st.pool.length|0],g=o.gf?o.gf(ex):o.gl;if(o.script=='intro'&&ex<1800)continue;if(o.gf&&(o.gf(ex-70)!=g||o.gf(ex+70)!=g))continue;o.e.push([t,ex,undefined,g])}
if(!o.script&&!st.rooms){const nf=Math.round(n*.2);for(let k=0;k<nf;k++){const ex=(520+span*(k+r())/Math.max(1,nf))|0,t=r()<.5?'mosq':'gull';o.e.push([t,ex,undefined,o.gl,0,o.gl-(86+r()*30)])}}
if(st.mini){const mx=Math.min(o.W-320,EX-120);o.mini=1;o.e.push([st.mini,mx,undefined,o.gf?o.gf(mx):o.gl,1])}
const cps=[];if(d.cp){const E=EX;for(const f of[.34,.68]){const cx=Math.round(E*f);cps.push([cx,o.gf?o.gf(cx):o.gl])}}o.cps=cps;
return o}
const bn=e=>e.t+'_w',zsc=e=>(isZ(e.t)?.92:1)*(e.sc||1);
const ew=e=>I[bn(e)].width/4*.85*zsc(e),eh=e=>I[bn(e)].height/2*zsc(e),gy=v=>D.gf?D.gf(v):D.gl;
const HP0={umb:3,boar:3,crab:2,jelly:2,wolf:2,zs:2,zc:2};
function mkEn([t,ex,ey,g,mini,alt],extra){const e={t,x:ex,x0:ex,g,y:ey??g,y0:alt??g-(t=='gull'?80:70),base:alt??g-(t=='gull'?80:70),hp:HP0[t]||1,d:-1,tm:Math.random()*5,st:0,fl:0,vx:0,vy:0,jt:0,cdp:0,stun:0,imm:0,drop:0,v:Math.random()<.5?0:1,sc:1};
if(mini){e.mini=1;e.sc=1.7;e.hp=8;e.hpm=8}if(extra)Object.assign(e,extra);return e}
function comps(i){const a=[];const ks=LV[df];for(const k of ks.slice(0,i)){if(SG[k].cage&&!a.includes('dog'))a.push('dog');if(SG[k].ico&&!a.includes('cat'))a.push('cat')}for(const k of ks.slice(0,i+1))for(const c of(SG[k].join||[]))if(!a.includes(c))a.push(c);return a}
function startStage(i){const key=LV[df][i];lv=i;if(free){load(i);return}showVig(SG[key].v||[],()=>load(i))}
function load(i,at){lv=i;const key=LV[df][i];D=mk(key);const hp=free?3:DIF[df].hp;
p={x:60,y:D.gl,vx:0,vy:0,hp,f:1,g:1,inv:0,atk:0,cd:0,big:0,red:0,fly:0,coh:0,ice:0,voc:0,vt:0,kb:0,gy0:D.gl,hs:new Set()};
en=D.e.map(a=>mkEn(a));it=D.i.map(([k,ix,iy])=>({k,x:ix,y:iy??D.gl-26}));
const cs=comps(i);cp=cs.map((n,j)=>({n,x:p.x-30*(j+1),y:D.gl,cd:1+j*.4,lg:0,dr:1,px:0}));
bs=null;wv=[];pt=[];LZ=[];RG=[];PEND=null;cam=0;cpx=0;hs=0;Q.length=0;bub=null;D.cps.forEach(c=>c[2]=0);
if(at){p.x=at;p.y=gy(at);p.gy0=p.y;en=en.filter(e=>e.x>at+150||e.mini);D.cps.forEach(c=>{if(c[0]<=at)c[2]=1});cpx=at;cp.forEach((q,j)=>{q.x=at-30*(j+1);q.y=p.y})}
if(D.bossX!==undefined){D.bossOn=false}
S='intro';tm=2.4;sfx('start');
if(!free&&!at){const nj=SG[key].join;if(nj)nj.forEach(c=>tip('j'+c+df,'È arrivato '+CNAME[c]+'! Combatte con Isa.'));const pv=i>0?comps(i-1):[];cs.filter(c=>(c=='dog'||c=='cat')&&!pv.includes(c)).forEach(c=>tip('j'+c+df,CNAME[c]+' è con te! Combatte con Isa.'))}
tip('stun','Salta sui nemici per stordirli, poi colpiscili: danno doppio!');
if(D.mini)say(D.cage?'Sconfiggi il guardiano per liberare Aluki!':'Sconfiggi il guardiano per aprire il traguardo!',3.5)}
function pick(i){i.o=1;sfx('pow');score+=i.k[0]=='e'?150:50;
if(i.k=='red'){p.red=p.coh>0?30:15;tip('red','Super forza! I colpi fanno il doppio.')}
else if(i.k=='yel'){p.big=p.coh>0?2:1;tip('yel','Fungo gigante! Assorbe un colpo.')}
else if(i.k=='pur'){p.fly=p.coh>0?20:10;tip('pur','Tieni premuto il salto: voli!')}
else if(i.k=='ec'){p.coh=25;if(p.red>0)p.red*=2;if(p.fly>0)p.fly*=2;if(p.big>0)p.big=2;tip('ec','Elisir della coerenza: l’effetto dei funghi dura il doppio!')}
else if(i.k=='es'){p.voc=10;p.vt=0;tip('es','Elisir sexy: il nemico rimane stordito dalla tua voce suadente!')}
else if(i.k=='eg'){p.ice=14;tip('eg','Elisir degli occhi di ghiaccio: laser congelante sparato dagli occhi')}
if(D.script&&D.sc==0&&['red','yel','pur'].includes(i.k)){D.sc=1;PEND=()=>{say('Attenta, ci sono i cinghiali!',2.2);spawnTut()}}}
function spawnTut(){for(let k=0;k<3;k++){const ex=Math.round(p.x+420+k*170),e=mkEn(['boar',ex,undefined,gy(ex)]);e.tut=1;e.d=-1;en.push(e)}say('Prova la nuova abilità: salta sulla loro testa e restano storditi. Poi colpiscili!',4.5)}
function fireLaser(){p.cd=.45;sfx('atk');LZ.push({x:p.x,y:p.y-46,f:p.f,t:.3});for(const e of en){if(e.dead)continue;const dx=(e.x-p.x)*p.f;if(dx>-10&&dx<310&&e.y>p.y-80&&e.y-eh(e)<p.y){e.stun=Math.max(e.stun,STUN_TIME+3);e.frz=STUN_TIME+3;hurt(e,1,1)}}
if(bs&&bs.st!='ko'&&bs.st!='trans'){const dx=(bs.x-p.x)*p.f;if(dx>-10&&dx<330&&p.y>bs.y-130){hurtB(2)}}}
function voiceWave(){RG.push({x:p.x,y:p.y-40,t:.7});sfx('stun');for(const e of en)if(!e.dead&&!e.mini&&!(e.stun>0)&&e.imm<=0&&Math.abs(e.x-p.x)<380)stunE(e);if(bs&&Math.abs(bs.x-p.x)<460)bs.stunT=2.4}
function afterClear(){const key=LV[df][lv];if(free){if(lv+1<LV[df].length)startStage(lv+1);else{lap++;startStage(0)}return}const ev=SG[key].ev;if(ev&&ev.length)showVig(ev,()=>startStage(lv+1));else startStage(lv+1)}
function startFree(i=0){free=1;lap=0;score=0;df='d';Object.keys(TP).forEach(k=>delete TP[k]);startStage(i)}
function addRec(){SV.rec=(SV.rec||[]).concat([score]).sort((a,b)=>b-a).slice(0,3);save()}
function dmgP(ex){if(p.inv>0||S!='play')return;sfx('ouch');shake=.25;if(p.big){p.big--;p.inv=1.2}else{p.hp--;p.inv=1.6}p.kb=.25;p.vx=(Math.sign(p.x-ex)||1)*200;p.vy=-220;p.g=0;if(p.hp<=0){S='dead';sfx('dead');if(free)addRec()}}
function burst(px,py,n,cols,sp2=220){for(let i=0;i<n;i++)pt.push({x:px,y:py,vx:(Math.random()-.5)*sp2,vy:-100-Math.random()*sp2*.6,c:cols[i%cols.length],t:.5+Math.random()*.4})}
function hurt(e,d,nodbl){if(e.dead)return;if(e.stun>0&&!nodbl)d*=2;e.hp-=d;e.fl=.25;sfx(e.hp<=0?'kill':'hit');burst(e.x,e.y-20,6,['#ffe066','#fff'],200);e.x+=p.f*8;if(e.hp<=0&&!e.dead){score+=(e.mini?500:100)*(1+lap);e.dead=1;e.dt=.8;e.stun=0;burst(e.x,e.y-24,10,['#ffd23f','#ff7a3a','#fff'],300)}}
function stunE(e){e.stun=STUN_TIME;e.vx=0;sfx('stun');burst(e.x,e.y-eh(e),6,['#ffe14a'],160)}
function hurtB(d){if(!bs||bs.st=='ko'||bs.st=='trans')return;if(bs.stunT>0)d*=2;bs.hp-=d;bs.fl=.2;sfx('hit');shake=.1;
if(bs.hp<=0){score+=3000;bs.st='ko';bs.tm=2.6;wv=[];sfx('win')}else if(bs.ph==1&&bs.hp<=7){bs.st='trans';bs.tm=2.2;wv=[];sfx('trans');say('Il pagliaccio perde la tuta!',3);PEND=()=>showVig(['fase2'],()=>{S='play'});for(let i=0;i<30;i++)pt.push({x:bs.x+(Math.random()-.5)*60,y:bs.y-60-Math.random()*60,vx:(Math.random()-.5)*300,vy:-100-Math.random()*250,c:['#e8c020','#d33','#fff'][i%3],t:1.6})}}
function nextWave(){const A=D.arena;const l=A.waves[A.wave++];l.forEach((t,i)=>{const left=i%2==0,ex=left?A.x-40-(i>>1)*70:A.x+A.w+40+(i>>1)*70;const e=mkEn([t,ex,undefined,D.gf(ex)]);e.chase=1;e.wv=1;e.d=left?1:-1;en.push(e)});sfx('door');say('Ondata '+A.wave+' di '+A.waves.length+'!',2.2)}
function spawnMinion(){const bx=D.bossX,left=Math.random()<.5,ex=left?bx-30:bx+830;const e=mkEn(['zs',ex,undefined,D.bgl]);e.chase=1;e.d=left?1:-1;en.push(e)}
function stageDone(){if(!free){SV.prog[df]=Math.max(SV.prog[df]||0,lv+1);save()}score+=1000*(1+lap);sfx('flag');S='clear';tm=1.8}
function endGame(){SV.prog[df]=LV[df].length;save();S='end';tm=0;sfx('win')}
function pauseToggle(){if(S=='play')S='pause';else if(S=='pause')S='play'}
function up(dt){
if(S=='intro'){tm-=dt;if(tm<=0)S='play';return}
if(S=='clear'){tm-=dt;if(tm<=0)afterClear();return}
if(S!='play')return;if(PEND){const f=PEND;PEND=null;f();return}T0+=dt;shake=Math.max(0,shake-dt);if(!bub&&Q.length){const[s,d]=Q.shift();bub={s,d}}if(bub){bub.d-=dt;if(bub.d<=0)bub=null}
const R=p.red>0,ST=D.arena&&D.arena.on,BO=D.bossOn;p.inv-=dt;p.red-=dt;p.fly-=dt;p.cd-=dt;p.kb-=dt;p.coh-=dt;p.ice-=dt;p.voc-=dt;if(p.voc>0){p.vt-=dt;if(p.vt<=0){p.vt=2.4;voiceWave()}}
const mv=(K.r?1:0)-(K.l?1:0);if(p.kb<=0){p.vx=mv*150;if(mv)p.f=mv}
if(K.jp&&p.g){p.vy=-430;p.g=0;sfx('jump');burst(p.x,p.y,3,['#fff8'],60)}K.jp=0;if(!K.j&&p.vy<-170)p.vy=-170;
if(p.fly>0&&K.j&&!p.g)p.vy=Math.max(p.vy-2300*dt,-170);
const py0=p.y,wasG=p.g;p.vy+=1100*dt;p.y+=p.vy*dt;let nx=p.x+p.vx*dt;
if(ST){nx=cl(nx,D.arena.x+16,D.arena.x+D.arena.w-16)}else if(BO){nx=cl(nx,D.bossX+16,D.bossX+784)}else if(D.bossX!==undefined){nx=Math.min(nx,D.bossX+900)}
p.x=cl(nx,16,D.W-16);p.g=0;
const fy=gy(p.x);if(p.y>=fy){p.y=fy;if(!wasG&&p.vy>200)burst(p.x,p.y,4,['#fff9','#ddd9'],90);p.vy=0;p.g=1}
for(const[a,b,w]of D.p)if(p.vy>=0&&py0<=b+3&&p.y>=b&&p.x>a-8&&p.x<a+w+8){p.y=b;p.vy=0;p.g=1}
if(p.y>345){p.x=Math.max(60,cpx);p.y=gy(p.x);p.vy=0}if(p.y<40){p.y=40;p.vy=0}if(p.g)p.gy0=p.y;
if(K.ap&&p.atk<=0&&p.cd<=0){if(p.ice>0)fireLaser();else{p.atk=.28;p.cd=.38;p.hs=new Set();sfx('atk')}}K.ap=0;
if(p.atk>0){p.atk-=dt;const cx=p.x+p.f*(R?52:40),hw=R?46:32;
for(const e of en)if(!e.dead&&!p.hs.has(e)&&Math.abs(e.x-cx)<hw+ew(e)&&e.y>p.y-62&&e.y-eh(e)<p.y){p.hs.add(e);hurt(e,R?2:1)}
if(bs&&!p.hs.has(bs)&&Math.abs(bs.x-cx)<hw+36&&p.y>bs.y-130){p.hs.add(bs);hurtB(R?2:1)}}
const D0=dt,dts=D0*DIF[df].sp*(1+.06*lap*(free?1:0));
for(const e of en){e.fl-=D0;if(e.dead){e.dt-=D0;e.y+=120*D0;continue}const dt=dts;
const flyer=e.t=='gull'||e.t=='mosq'||e.t=='jelly';
if(e.stun>0){e.stun-=D0;e.frz=Math.max(0,(e.frz||0)-D0);if(e.stun<=0){e.imm=STUN_IMMUNE}
 if(flyer){e.drop=Math.min(e.drop+420*D0,Math.max(0,e.g-e.base))}
 else if(e.t=='umb'||e.t=='wolf'){e.vy+=900*D0;e.y+=e.vy*D0;if(e.y>=e.g){e.y=e.g;e.vy=0}}
 if(flyer)e.y=e.base+e.drop;
 continue}
e.imm-=D0;if(e.drop>0)e.drop=Math.max(0,e.drop-220*D0);
e.tm+=dt;const dx=p.x-e.x,t=e.t;
if(t=='gull'){e.x=e.x0+Math.sin(e.tm*1.2)*130;e.base=e.y0+Math.sin(e.tm*2.4)*18;e.d=Math.cos(e.tm*1.2)>0?1:-1}
else if(t=='mosq'){if(Math.abs(dx)<300){e.x+=Math.sign(dx)*50*dt;e.d=Math.sign(dx)}e.base=e.y0+Math.sin(e.tm*3)*16}
else if(t=='jelly'){e.base=e.g-70+Math.sin(e.tm*1.6)*45}
else if(t=='crab'){e.x+=e.d*40*dt;if(Math.abs(e.x-e.x0)>90)e.d*=-1}
else if(t=='umb'){e.x+=e.d*35*dt;if(Math.abs(e.x-e.x0)>80)e.d*=-1;e.vy+=900*dt;e.y+=e.vy*dt;if(e.y>=e.g){e.y=e.g;e.vy=0;e.jt+=dt;if(e.jt>1.4){e.vy=-280;e.jt=0}}}
else if(t=='boar'){const sc=e.mini?1.15:1;if(e.st==0){e.x+=e.d*45*dt;if(Math.abs(e.x-e.x0)>100)e.d*=-1;if(Math.abs(dx)<(e.mini?340:260)&&Math.sign(dx)==e.d){e.st=1;e.tm=0}}else if(e.st==1){e.x+=e.d*210*sc*dt;if(e.tm>1.3){e.st=2;e.tm=0}}else if(e.tm>1)e.st=0}
else if(isZ(t)){const ch=e.chase||Math.abs(dx)<320;if(ch){e.d=Math.sign(dx)||1;e.x+=e.d*(e.mini?52:38)*dt;e.st=Math.abs(dx)<70?1:0}else{e.x+=e.d*25*dt;if(Math.abs(e.x-e.x0)>90)e.d*=-1;e.st=0}}
else if(t=='wolf'){e.cdp-=dt;if(e.y>=e.g&&e.st==0){e.x+=e.d*55*dt;if(Math.abs(e.x-e.x0)>100)e.d*=-1;if(Math.abs(dx)<230&&e.cdp<=0){e.vx=Math.sign(dx)*240;e.vy=-320;e.st=1;e.cdp=2.2;e.d=Math.sign(dx)}}
e.vy+=900*dt;e.y+=e.vy*dt;e.x+=e.vx*dt;if(e.y>=e.g){e.y=e.g;e.vy=0;e.vx=0;e.st=0}}
if(flyer)e.y=e.base+e.drop;
if(e.mini&&e.t=='boar'&&e.st==1&&0){}
}
for(const e of en){if(e.dead)continue;const dx=p.x-e.x;
 if(p.inv<=0&&Math.abs(dx)<ew(e)+10&&p.y>e.y-eh(e)&&p.y-58<e.y){
  if(p.vy>120&&p.y<e.y-eh(e)*.5){ if(e.stun>0||e.imm>0||e.mini){hurt(e,1,1)}else stunE(e);p.vy=-320}
  else if(!(e.stun>0))dmgP(e.x)}}
en=en.filter(e=>!e.dead||e.dt>0);
for(const i of it)if(!i.o&&Math.abs(p.x-i.x)<22&&p.y>i.y-62&&p.y-58<i.y+8)pick(i);
if(D.script&&D.sc==1&&p.x>1250&&!en.some(e=>e.tut&&!e.dead)){D.sc=2;PEND=()=>showVig(['s7','s8','s10'],()=>{S='play'})}
cp.forEach((q,i)=>{const k=q.n,rc=k=='cat'||k=='ro'?95:55;q.cd-=dt;q.lg-=dt;let b=null,bd=320;q.px=q.x;q.dr=p.f;
for(const e of en)if(!e.dead&&Math.abs(e.x-q.x)<bd&&q.y-e.y<rc&&e.y-q.y<30){bd=Math.abs(e.x-q.x)-(e.stun>0?60:0);b=e}
if(!b&&bs&&bs.st!='ko'&&Math.abs(bs.x-q.x)<380)b=bs;q.ch=!!b;
if(b){const dd=b.x-q.x;q.dr=Math.sign(dd)||1;if(Math.abs(dd)>28)q.x+=q.dr*250*dt;else if(q.cd<=0){b===bs?hurtB(1):hurt(b,1);q.lg=.3;q.cd=.55}}
else q.x+=(p.x-p.f*(34+30*i)-q.x)*Math.min(1,4*dt);q.y+=(p.gy0-q.y)*Math.min(1,8*dt)});
/* arena zombie */
if(D.arena){const A=D.arena;if(!A.on&&!A.done&&p.x>A.x+90){A.on=true;sfx('door');say('Le porte si chiudono! Difendetevi!',3);nextWave()}
 else if(A.on&&!en.some(e=>!e.dead&&e.wv)){if(A.wave>=A.waves.length){A.on=false;A.done=true;sfx('flag');say('Le porte si aprono! Avanti!',3)}else nextWave()}}
/* boss */
if(D.bossX!==undefined&&!bs&&!D.bossOn&&p.x>D.bossX+110){D.bossOn=true;bs={x:D.bossX+640,y:D.bgl,hp:14,ph:1,st:'walk',tm:2,d:-1,fl:0,mn:7,stunT:0};sfx('slam');PEND=()=>showVig(['preboss'],()=>{S='play'});en.forEach(e=>{if(e.x<D.bossX-50&&!e.dead){}})}
if(bs){bs.tm-=dt;bs.fl-=dt;const bx0=bs.x,stn=bs.stunT>0;if(stn){bs.stunT-=dt;bs.tm+=dt}const dx=p.x-bs.x,bx=D.bossX;
if(bs.st=='walk'){bs.d=Math.sign(dx)||1;bs.x=cl(bs.x+bs.d*(bs.ph==1?32:85)*dt,bx+60,bx+740);if(bs.tm<=0){bs.st='wind';bs.tm=bs.ph==1?.8:.5}}
else if(bs.st=='wind'){if(bs.tm<=0){bs.st='slam';bs.tm=.6;sfx('slam');shake=.35;const v=bs.ph==1?190:250;wv.push({x:bs.x-30,v:-v},{x:bs.x+30,v})}}
else if(bs.st=='slam'){if(bs.tm<=0){bs.st='walk';bs.tm=bs.ph==1?2.6:1.5}}
else if(bs.st=='trans'){if(bs.tm<=0){bs.st='walk';bs.tm=1;bs.ph=2}}
else if(bs.st=='ko'&&bs.tm<=0){bs=null;D.bossOn=false;showVig(['fine1','fine2'],endGame);return}
if(bs&&stn)bs.x=bx0;
if(bs&&bs.st!='ko'&&bs.st!='trans'&&!stn){bs.mn-=dt;if(bs.mn<=0){bs.mn=bs.ph==1?9:6;if(en.filter(e=>!e.dead&&isZ(e.t)).length<2)spawnMinion()}
 if(Math.abs(p.x-bs.x)<34&&p.y>bs.y-110&&!stn)dmgP(bs.x)}}
for(const w of wv){w.x+=w.v*dt;if(Math.abs(p.x-w.x)<12&&p.y>(D.bgl||D.gl)-18)dmgP(w.x)}if(D.bossX!==undefined)wv=wv.filter(w=>w.x>D.bossX-20&&w.x<D.bossX+820);
for(const q of pt){q.x+=q.vx*dt;q.vy+=700*dt;q.y+=q.vy*dt;q.t-=dt}pt=pt.filter(q=>q.t>0);for(const l of LZ)l.t-=dt;LZ=LZ.filter(l=>l.t>0);for(const r_ of RG)r_.t-=dt;RG=RG.filter(r_=>r_.t>0);
/* checkpoint */
for(const c of D.cps)if(!c[2]&&p.x>c[0]){c[2]=1;cpx=c[0];sfx('flag');tip('cp'+c[0],'Checkpoint! Se cadi riparti da qui.')}
const gok=!D.mini||!en.some(e=>e.mini&&!e.dead);
if(D.goal&&gok&&!(D.arena&&!D.arena.done)){if(p.x>=D.goal[0]-6)stageDone()}
const tgt=D.arena&&D.arena.on?D.arena.x+(D.arena.w-800)/2:D.bossOn?D.bossX:cl(p.x-300,0,D.W-800);
cam+=(tgt-cam)*Math.min(1,10*dt);if(D.W<=800)cam=0}
/* ===== disegno e schermate ===== */
const LC={};function lay2(n){return LC[n]||(LC[n]=lay(n))}
let hT=0,resetArm=0;
function espr(e){const t=e.t,z=isZ(t);
if(z){const v=e.v;if(e.dead||e.stun>0)return t=='zs'?(v?'zs_ko2':'zs_ko'):'zc_ko';if(e.st==1)return t=='zs'?(v?'zs_a2':'zs_a'):'zc_a';return t=='zs'?(v?'zs_w2':'zs_w'):(v?'zc_w2':'zc_w')}
if(e.dead)return t+'_d';if(e.st==1&&(t=='boar'||t=='wolf'))return t+'_a';return t+'_w'}
function skyFill(top,gl){const g=x.createLinearGradient(0,0,0,gl);g.addColorStop(0,top);g.addColorStop(1,top);x.fillStyle=g;x.fillRect(0,0,800,340)}
function drawBgScene(names,gl,top,camB){skyFill(top||'#223',gl);const single=names.length==1;let px=-camB%1e9,k=0,guard=0;
 // salta i tile fuori schermo
 let acc=0;while(guard++<400){const n=names[k%names.length],L=lay2(n);if(acc+L.w>camB)break;acc+=L.w;k++}
 px=acc-camB;
 while(px<800&&guard++<800){const n=names[k%names.length],L=lay2(n),oy=gl-L.band*L.dh,mir=single&&(k%2);
  x.save();if(mir){x.translate(px+L.w,oy);x.scale(-L.s,L.s)}else{x.translate(px,oy);x.scale(L.s,L.s)}x.drawImage(I[n],0,0);x.restore();px+=L.w-.5;k++}}
function drawWorld(){
if(D.rooms){x.fillStyle='#1a1410';x.fillRect(0,0,800,340);
 for(const q of D.rooms){const px=q.x-cam;if(px>800||px+q.w<0)continue;x.save();if(q.f){x.translate(px+q.w,0);x.scale(-1,1)}else x.translate(px,0);x.drawImage(I[q.bg],0,0,q.w,340);x.restore();
 if(q.st)q.st.forEach(([a,e],k)=>{if(e<0){const a2=q.st[k+1]?q.st[k+1][0]:q.w;x.fillStyle='#7a4b22';x.fillRect(px+a,q.g+e,a2-a,340-q.g-e);x.fillStyle='#a87038';x.fillRect(px+a,q.g+e,a2-a,5)}})}
 if(D.arena){const A=D.arena;const open=!A.on;for(const dx of[A.x,A.x+A.w-22]){const px=dx-cam;if(px<-40||px>820)continue;const g=A.g;
  x.fillStyle=open?'#2a1a0f':'#4b2a14';x.fillRect(px,g-150,22,150);x.fillStyle='#6a3d1c';x.fillRect(px+2,g-148,18,146);x.fillStyle='#3a2010';for(let k=0;k<4;k++)x.fillRect(px+2,g-140+k*34,18,3);if(!open){x.fillStyle='#ffd23f';x.fillRect(px+(dx==A.x?14:4),g-72,4,12)}if(open&&!A.done){x.fillStyle='#0008';x.fillRect(px,g-150,22,150)}}}}
else{drawBgScene(D.bgs,D.gl,D.top,cam*.5);x.fillStyle=D.gc;x.fillRect(0,D.gl,800,340-D.gl);const gr=x.createLinearGradient(0,D.gl,0,340);gr.addColorStop(0,'#0000');gr.addColorStop(1,'#0006');x.fillStyle=gr;x.fillRect(0,D.gl,800,340-D.gl);x.fillStyle='#ffffff22';x.fillRect(0,D.gl,800,2);x.fillStyle='#0005';x.fillRect(0,D.gl+2,800,3)}
for(const[a,b,w]of D.p){const px=a-cam;if(px>820||px+w<-20)continue;const col=D.pc;x.fillStyle='#0004';x.fillRect(px+3,b+9,w,4);x.fillStyle=col;rr(px,b,w,10,3);x.fill();x.fillStyle='#ffffff35';x.fillRect(px+2,b+1,w-4,3);x.fillStyle='#0004';x.fillRect(px+1,b+7,w-2,3);x.fillStyle='#0003';for(let k=14;k<w-4;k+=22)x.fillRect(px+k,b+2,1.5,7)}
for(const c of D.cps){const px=c[0]-cam;if(px<-20||px>820)continue;x.fillStyle='#ddd';x.fillRect(px,c[1]-52,3,52);x.fillStyle=c[2]?'#3ddc6a':'#ffd23f';x.beginPath();x.moveTo(px+3,c[1]-52);x.lineTo(px+30,c[1]-42+Math.sin(T0*6)*2);x.lineTo(px+3,c[1]-32);x.fill()}
if(D.goal){const gx=D.goal[0],gyy=D.goal[1],open=(!D.mini||!en.some(e=>e.mini&&!e.dead))&&!(D.arena&&!D.arena.done);x.fillStyle='#fff';x.fillRect(gx-cam,gyy-70,4,70);x.fillStyle=open?'#e22':'#777';x.beginPath();x.moveTo(gx-cam+4,gyy-70);x.lineTo(gx-cam+38,gyy-58+Math.sin(T0*6)*3);x.lineTo(gx-cam+4,gyy-46);x.fill();if(!open)T('🔒',gx-cam+2,gyy-76,16,'#fff','center',0)}
drawCage();for(const i of it)if(!i.o)drawItem(i);
for(const e of en){const n=espr(e),sc=zsc(e),stn=e.stun>0,flyer=e.t=='gull'||e.t=='mosq'||e.t=='jelly';
 if(e.dead){sp(n,e.x-cam,e.y,sc,e.d>0?0:1,Math.max(0,e.dt/.8));continue}
 if(!flyer||stn)shadow(e.x-cam,e.g,ew(e)*2.2,.22);
 const fl=e.fl>0&&Math.floor(e.fl*30)%2,al=fl?.4:1;
 if(stn&&!isZ(e.t)){sp(n,e.x-cam,e.y,sc,e.d>0?0:1,al,Math.sin(T0*14)*.12)}
 else sp(n,e.x-cam,e.y+(isZ(e.t)&&!stn?Math.abs(Math.sin(T0*6+e.x))*-1.5:0),sc,e.d>0?0:1,al);
 if(stn){const hy=e.y-eh(e)*(isZ(e.t)?.55:1.05);for(let k=0;k<3;k++)star(e.x-cam+Math.cos(T0*5+k*2.1)*17,hy-6+Math.sin(T0*5+k*2.1)*5,6,T0*4+k)}
 else if(e.imm>0&&e.imm<STUN_IMMUNE){x.save();x.globalAlpha=.55;x.strokeStyle='#8fd3ff';x.lineWidth=1.5;x.setLineDash([3,3]);x.beginPath();x.arc(e.x-cam,e.y-eh(e)*.5,ew(e)*1.1,0,7);x.stroke();x.restore()}
 if(e.frz>0){x.save();x.globalAlpha=.45;x.fillStyle='#8fe6ff';rr(e.x-cam-ew(e),e.y-eh(e),ew(e)*2,eh(e),6);x.fill();x.restore()}
 if(e.mini){const bw=60,bx=e.x-cam-bw/2,by=e.y-eh(e)-12;x.fillStyle='#000a';x.fillRect(bx-1,by-1,bw+2,7);x.fillStyle='#ff5a3a';x.fillRect(bx,by,bw*Math.max(0,e.hp)/e.hpm,5)}}
cp.forEach(q=>{const m=Math.abs(q.x-q.px)>.3,k=CS[q.n],lg=q.lg>0||q.ch;shadow(q.x-cam,q.y,36,.22);sp(k[lg?2:m?1:0],q.x-cam+(q.lg>0?q.dr*20:0),q.y-(lg?8:0),1,q.dr<0)});
if(S!='dead'){const s=p.big?1.35:1,n=p.atk>0?'isa_atk':(!p.g?'isa_jump':(Math.abs(p.vx)>10?'isa_run':'isa_idle'));
 shadow(p.x-cam,p.gy0>p.y?p.gy0:p.y,34*s,.3);
 if(p.fly>0&&!p.g){x.save();x.globalAlpha=.35;x.fillStyle='#b070ff';x.beginPath();x.ellipse(p.x-cam,p.y-30,22,30,0,0,7);x.fill();x.restore()}
 sp(n,p.x-cam,p.y+(p.g&&Math.abs(p.vx)>10?-Math.abs(Math.sin(T0*14))*3:0),s,p.f<0,p.inv>0&&Math.floor(p.inv*14)%2?.35:1);
 if(p.red>0){x.fillStyle='#ff4040';x.fillRect(p.x-cam-12,p.y-84*s,Math.min(24,24*p.red/15),3)}}
if(bs){const q='c'+bs.ph+'_',n=bs.st=='ko'?q+'ko':bs.st=='trans'?q+'hit':bs.st=='wind'||bs.st=='slam'?q+'atk':(Math.floor(T0*3)%2?q+'walk':q+'idle');
 shadow(bs.x-cam,bs.y,90,.3);x.save();if(bs.st=='trans'&&Math.floor(bs.tm*12)%2)x.filter='brightness(3)';sp(n,bs.x-cam,bs.y,1,bs.d>0?0:1,bs.fl>0&&Math.floor(bs.fl*30)%2?.5:1);x.restore()}
drawFx();const wy=D.bgl||D.gl;x.fillStyle='#e22';for(const w of wv){const px=w.x-cam;x.beginPath();x.moveTo(px,wy);x.lineTo(px-Math.sign(w.v)*18,wy);x.lineTo(px,wy-16);x.fill()}
for(const q of pt){x.globalAlpha=Math.min(1,q.t*3);x.fillStyle=q.c;x.fillRect(q.x-cam,q.y,5,5)}x.globalAlpha=1}
function flask(X,Y,col,s=1){x.save();x.translate(X,Y);x.scale(s,s);x.shadowColor=col;x.shadowBlur=10;x.fillStyle=col;x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.arc(0,-8,9,0,7);x.fill();x.stroke();x.shadowBlur=0;x.fillStyle='#e8f4ff';x.fillRect(-4,-26,8,11);x.strokeRect(-4,-26,8,11);x.fillStyle='#96643c';x.fillRect(-5,-30,10,5);x.fillStyle='rgba(255,255,255,.6)';x.beginPath();x.arc(-3,-10,2.5,0,7);x.fill();x.restore()}
function drawItem(i){const yy=i.y+Math.sin(T0*4+i.x)*3+14,X=i.x-cam;if(X<-40||X>840)return;shadow(X,i.y+16,22,.2);if(i.k[0]=='e')flask(X,yy+10,i.k=='ec'?'#ffd23f':i.k=='es'?'#ff82be':'#78dcff',1.15);else sp('m_'+i.k,X,yy,.8)}
function drawTreeIco(){return;if(!D.ico)return;const cx=D.goal[0]-150-cam,gyy=D.goal[1];if(cx<-140||cx>940)return;x.fillStyle='#5f3b24';x.beginPath();x.moveTo(cx-18,gyy);x.lineTo(cx-11,gyy-190);x.lineTo(cx+11,gyy-190);x.lineTo(cx+18,gyy);x.fill();x.fillRect(cx-80,gyy-120,80,10);x.fillStyle='#2f7a2c';for(const[ox,oy,rx,ry]of[[-30,-200,70,28],[34,-206,76,30],[0,-176,60,22]]){x.beginPath();x.ellipse(cx+ox,gyy+oy,rx,ry,0,0,7);x.fill()}sp('cat0',cx-52,gyy-120+Math.sin(T0*2)*1.5,2.4,0);T('Miao.',cx-52,gyy-165,12,'#fff','center',3)}
function drawCage(){drawTreeIco();if(!D.cage)return;const cx=D.goal[0]-170-cam,gyy=D.goal[1],alive=en.some(e=>e.mini&&!e.dead);if(cx<-120||cx>920)return;
if(alive){sp('dog0',cx,gyy+Math.sin(T0*3)*-2,1.9,1);x.strokeStyle='#2b2b33';x.lineWidth=5;for(let k=-3;k<=3;k++){x.beginPath();x.moveTo(cx+k*13,gyy-70);x.lineTo(cx+k*13,gyy);x.stroke()}x.fillStyle='#3a3a44';x.fillRect(cx-46,gyy-76,92,8);x.fillRect(cx-46,gyy-4,92,6);T('Wof!',cx,gyy-90,12,'#fff','center',3)}
else{sp('dog2',cx+40+Math.sin(T0*6)*6,gyy-Math.abs(Math.sin(T0*6))*10,1.9,0);x.strokeStyle='#555';x.lineWidth=4;x.beginPath();x.moveTo(cx-40,gyy-70);x.lineTo(cx-40,gyy);x.stroke();x.beginPath();x.moveTo(cx-40,gyy-70);x.lineTo(cx-70,gyy-60);x.stroke()}}
function drawFx(){for(const l of LZ){const X=l.x-cam,Y=l.y,X2=X+l.f*300,a=Math.min(1,l.t/.15);x.save();x.globalAlpha=a;x.lineCap='round';x.strokeStyle='#bff3ff';x.lineWidth=9;x.beginPath();x.moveTo(X+l.f*14,Y);x.lineTo(X2,Y);x.stroke();x.strokeStyle='#fff';x.lineWidth=3.5;x.beginPath();x.moveTo(X+l.f*14,Y);x.lineTo(X2,Y);x.stroke();x.restore()}
for(const r_ of RG){const k=1-r_.t/.7;x.save();x.globalAlpha=r_.t/.7*.7;x.strokeStyle='#ff82be';x.lineWidth=3;x.beginPath();x.arc(r_.x-cam,r_.y,30+k*320,0,7);x.stroke();x.restore();T('♪',r_.x-cam+Math.cos(k*9)*120*k,r_.y-30-k*30,20,'#ff9ad0','center',3)}
if(bs&&bs.stunT>0){for(let k=0;k<3;k++)star(bs.x-cam+Math.cos(T0*5+k*2.1)*24,bs.y-150+Math.sin(T0*5+k*2.1)*6,8,T0*4+k)}}
function drawHUD(){
x.textAlign='left';x.font='22px system-ui';for(let i=0;i<DIF[df].hp;i++){x.fillStyle=i<p.hp?'#f33':'#0006';x.strokeStyle='#000';x.lineWidth=3;x.strokeText('♥',10+i*24,28);x.fillText('♥',10+i*24,28)}
if(p.big)sp('m_yel',20,58,.6);if(p.red>0)sp('m_red',46,58,.6);if(p.fly>0)sp('m_pur',72,58,.6);
if(p.coh>0){flask(104,72,'#ffd23f',.7);x.fillStyle='#ffd23f';x.fillRect(94,76,Math.min(20,20*p.coh/25),3)}if(p.voc>0){flask(132,72,'#ff82be',.7);x.fillStyle='#ff82be';x.fillRect(122,76,Math.min(20,20*p.voc/10),3)}if(p.ice>0){flask(160,72,'#78dcff',.7);x.fillStyle='#78dcff';x.fillRect(150,76,Math.min(20,20*p.ice/14),3)}
T(free?'Giro '+(lap+1)+' · '+D.n:'Livello '+(lv+1)+'/'+LV[df].length+' · '+D.n,720,22,13,'#fff','right',4);T('Punti '+String(score).padStart(6,'0'),720,38,12,'#ffd23f','right',3);
if(S=='play'||S=='intro'){x.fillStyle='#000a';x.beginPath();x.arc(770,54,21,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=2;x.stroke();T('II',770,61,17,'#fff','center',0);btn(744,30,56,50,()=>{if(S=='play')S='pause'})}
if(bs){x.fillStyle='#000a';rr(280,8,240,14,6);x.fill();x.fillStyle=bs.ph==1?'#e8c020':'#e33';rr(282,10,Math.max(0,236*bs.hp/14),10,5);x.fill();T('Gran Pagliaccio',400,36,11,'#fff','center',3)}
if(bub&&S=='play'){x.font='800 15px system-ui';const w=x.measureText(bub.s).width+28;x.fillStyle='#fff';x.strokeStyle='#000';x.lineWidth=3;rr(400-w/2,40,w,34,12);x.fill();x.stroke();x.beginPath();x.moveTo(380,73);x.lineTo(372,88);x.lineTo(398,73);x.fill();x.fillStyle='#000';x.textAlign='center';x.fillText(bub.s,400,62)}}
function panel(X,Y,W,H,col='#14131fee'){x.fillStyle=col;rr(X,Y,W,H,14);x.fill();x.strokeStyle='#ffd23f';x.lineWidth=3;x.stroke()}
function bigBtn(s,X,Y,W,H,col,fn,z=22){x.fillStyle='#0006';rr(X,Y+4,W,H,H/2.4);x.fill();x.fillStyle=col;rr(X,Y,W,H,H/2.4);x.fill();x.strokeStyle='#fff';x.lineWidth=3;x.stroke();T(s,X+W/2,Y+H/2+z*.35,z,'#fff','center',4);btn(X,Y,W,H,fn)}
function toHome(){free=0;S='home'}
function gameMenu(){if(free){free=0;S='free';return}S='map'}
function retry(){load(lv,D&&D.cps.length&&cpx?cpx:0)}
function overlays(){
if(S=='intro'){x.fillStyle='#000a';x.fillRect(0,100,800,110);T('Livello '+(lv+1),400,150,40,'#ffe066');T(D.n,400,188,24)}
if(S=='clear'){x.fillStyle='#000a';x.fillRect(0,90,800,120);T('Livello completato!',400,150,38,'#ffe066');T(lv+1<LV[df].length?'Avanti…':'',400,188,20)}
if(S=='dead'&&free){x.fillStyle='#000b';x.fillRect(0,0,800,340);T('Fine partita',400,80,44,'#ff6b6b');T('Punti: '+score,400,125,24,'#ffe066');T('Record: '+((SV.rec||[])[0]||0),400,155,18,'#fff');bigBtn('Ancora',250,185,300,50,'#2e9e4a',()=>startFree(0),21);bigBtn('Livelli',250,248,145,40,'#456',gameMenu,16);bigBtn('Home',405,248,145,40,'#456',toHome,16)}else if(S=='dead'){x.fillStyle='#000b';x.fillRect(0,0,800,340);T('Oh no!',400,110,50,'#ff6b6b');bigBtn(D.cps.length&&cpx?'Riparti dal checkpoint':'Riprova',250,140,300,50,'#2e9e4a',retry,21);bigBtn(free?'Livelli':'Mappa',250,205,140,44,'#456',gameMenu,18);bigBtn('Home',410,205,140,44,'#456',toHome,18)}
if(S=='pause'){x.fillStyle='#000b';x.fillRect(0,0,800,340);T('Pausa',400,92,40,'#ffe066');bigBtn('Riprendi',270,115,260,50,'#2e9e4a',()=>{S='play'});bigBtn(free?'☰ Livelli':'☰ Mappa',270,178,125,44,'#456',gameMenu,16);bigBtn('⌂ Esci',405,178,125,44,'#a33',toHome,16);T('Esci = torna alla Home (il livello si perde)',400,290,11,'#cfd3e0','center',3);bigBtn(SV.mute?'🔇 Audio off':'🔊 Audio on',270,232,260,40,'#345',()=>{SV.mute=!SV.mute;save()},16)}}
/* ---- home ---- */
const CARDS=[['f','Facile','5 livelli + boss','#3aa655','b_beach'],['m','Medio','10 livelli','#f0932b','s_mush'],['d','Difficile','20 livelli','#e03a3a','v_walk']];
function thumb(n,X,Y,W,H){const im=I[n];if(!im||!im.width)return;const s=Math.max(W/im.width,H/im.height),w=im.width*s,h=im.height*s;x.save();rr(X,Y,W,H,8);x.clip();x.drawImage(im,X+(W-w)/2,Y+(H-h)/2,w,h);x.restore()}
function homeBg(){x.drawImage(I.h_beachtown,0,0,I.h_beachtown.width,I.h_beachtown.height,-((hT*8)%800),0,800,340);x.drawImage(I.h_beachtown,0,0,I.h_beachtown.width,I.h_beachtown.height,800-((hT*8)%800),0,800,340);x.fillStyle='#0003';x.fillRect(0,0,800,340);x.fillStyle='#3a2a22';x.fillRect(0,300,800,40);x.fillStyle='#5a4034';x.fillRect(0,300,800,4)}
function parade(){const seq=['isa_run','dog1','cat1','ro2','hk1','boar_w','crab_w','crab_w'],sc=[1,1,1,1,1,1,.9,.7];seq.forEach((n,i)=>{const px=((hT*34+i*62)%900)-60,by=330+Math.sin(hT*9+i)*(i<5?-1.5:0);shadow(px,332,40,.3);sp(n,px,by,sc[i],0)})}
function icons(){[['♪',()=>{SV.mute=!SV.mute;save()},SV.mute],['📖',()=>{S='album'}],['⚙',()=>{if(resetArm>0){SV.prog={f:0,m:0,d:0};SV.album={};SV.rec=[];save();resetArm=0}else resetArm=3}]].forEach(([s,fn,off],i)=>{const cx=706+i*36;x.fillStyle='#14131fdd';x.beginPath();x.arc(cx,14,14,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=2;x.stroke();T(s,cx,20,14,off?'#888':'#fff','center',0);if(off){x.strokeStyle='#f55';x.beginPath();x.moveTo(cx-8,6);x.lineTo(cx+8,22);x.stroke()}btn(cx-14,0,28,30,fn)});if(resetArm>0){resetArm-=1/60;T('Tocca ⚙ di nuovo per azzerare i progressi',560,50,11,'#fff','center',3)}}
function drawHome(){homeBg();
if(I.logo.width){x.save();x.shadowColor='#000a';x.shadowBlur=14;x.shadowOffsetY=5;x.fillStyle='#fff';rr(24,22,290,290,34);x.fill();x.restore();x.save();rr(28,26,282,282,30);x.clip();x.drawImage(I.logo,28,26,282,282);x.restore();x.strokeStyle='#111';x.lineWidth=4;rr(26,24,286,286,32);x.stroke()}
bigBtn('▶  STORIA',350,50,400,72,'#d92b2b',()=>{S='story'},34);T('La storia di Isa, Aluki e Ico',550,134,13,'#fff','center',3);
bigBtn('★  GIOCO LIBERO',350,152,400,72,'#f0932b',()=>{S='free'},30);T('Giro infinito · batti il record',550,236,13,'#fff','center',3);
bigBtn('▣  Album vignette',350,252,195,36,'#334',()=>{S='album'},15);bigBtn('♪  Audio '+(SV.mute?'off':'on'),555,252,195,36,'#334',()=>{SV.mute=!SV.mute;save()},15);
T('Il tuo record: '+String((SV.rec||[])[0]||0).padStart(6,'0'),550,296,14,'#ffd23f','center',3);icons();parade()}
function playStory(k){df=k;SV.df=k;save()}
function drawStory(){homeBg();x.fillStyle='#0008';x.fillRect(0,0,800,340);T('STORIA · scegli la difficoltà',400,34,24,'#ffe066');
CARDS.forEach(([k,nm,sub,col,bg],i)=>{const X=40+i*250,Y=50,W=232,H=200,sel=df==k,pr=SV.prog[k]||0,n=LV[k].length;x.save();if(sel){x.translate(X+W/2,Y+H/2);x.scale(1.03,1.03);x.translate(-X-W/2,-Y-H/2)}
x.fillStyle=sel?'#ffd23f':'#ffffffee';rr(X-3,Y-3,W+6,H+6,16);x.fill();x.fillStyle='#14161f';rr(X,Y,W,H,13);x.fill();thumb(bg,X+6,Y+6,W-12,72);
T(nm,X+W/2,Y+104,26,'#fff','center',0);x.fillStyle=col;rr(X+16,Y+112,W-32,22,11);x.fill();T(sub,X+W/2,Y+128,13,'#fff','center',0);
x.font='20px system-ui';x.textAlign='center';for(let h=0;h<DIF[k].hp;h++){x.fillStyle='#ff3b4a';x.fillText('♥',X+W/2+(h-(DIF[k].hp-1)/2)*24,Y+160)}
T(pr>=n?'Completata ★':pr>0?'Livello '+(pr+1)+' di '+n:'Nuova partita',X+W/2,Y+186,13,'#cfd3e0','center',0);x.restore();btn(X,Y,W,H,()=>playStory(k))});
const pr=SV.prog[df]||0,n=LV[df].length,newGame=()=>{SV.prog[df]=0;save();free=0;score=0;lap=0;startStage(0)};
if(pr>0&&pr<n){bigBtn('Continua ▶',200,266,200,46,'#2e9e4a',()=>{free=0;S='map'},20);bigBtn('Nuova partita',410,266,190,46,'#a33',newGame,17)}else bigBtn(pr>=n?'Rigioca ▶':'Nuova partita ▶',270,266,260,46,'#2e9e4a',newGame,20);
bigBtn('◀ Home',20,284,110,36,'#456',toHome,15)}
function drawFree(){homeBg();x.fillStyle='#0008';x.fillRect(0,0,800,340);T('GIOCO LIBERO · scegli da dove partire',400,32,22,'#ffe066');
LV.d.forEach((k,i)=>{const st=SG[k],bgn=st.bg?st.bg[0]:(Array.isArray(st.rooms[0])?st.rooms[0][0]:st.rooms[0]),X=18+(i%5)*136,Y=44+(i/5|0)*57,W=128,H=50;thumb(bgn,X,Y,W,H);x.fillStyle='#0007';x.fillRect(X,Y+H-16,W,16);x.strokeStyle=i==19?'#ff6b6b':'#fff';x.lineWidth=2;rr(X,Y,W,H,7);x.stroke();T(String(i+1),X+13,Y+17,15,'#ffd23f','center',3);T(st.n.length>19?st.n.slice(0,18)+'…':st.n,X+W/2,Y+H-4,10,'#fff','center',2);btn(X,Y,W,H,()=>startFree(i))});
T('Tocca un livello per iniziare da lì. Poi si prosegue e si ricomincia, più difficile.',400,282,12,'#fff','center',3);T('Aluki, Ico, Ro e Kayn si uniscono solo dopo le loro scene.',400,298,12,'#cfd3e0','center',3);
x.fillStyle='#14161f';rr(700,44,92,170,12);x.fill();x.strokeStyle='#ffd23f';x.lineWidth=3;x.stroke();T('RECORD',746,66,13,'#ffd23f','center',0);for(let i=0;i<3;i++)T((i+1)+'° '+String((SV.rec||[])[i]||0).padStart(6,'0'),746,98+i*34,13,'#fff','center',0);
bigBtn('DAL 1',700,226,92,60,'#d92b2b',()=>startFree(0),17);bigBtn('◀ Home',20,296,110,34,'#456',toHome,14)}
function play(){S='story'}
/* ---- mappa ---- */
function drawMap(){
x.drawImage(I.h_beachtown,0,0,800,340);x.fillStyle='#000a';x.fillRect(0,0,800,340);
const n=LV[df].length,pr=SV.prog[df]||0,rows=n>10?2:1,per=Math.ceil(n/rows);
T(DIF[df].n+' · la mappa di Castellaneta Marina',400,36,22,'#ffe066');
for(let r=0;r<rows;r++){const y=rows==1?170:95+r*110;
 for(let k=0;k<per;k++){const i=r*per+k;if(i>=n)break;const X=60+k*(680/(per-1||1)),Y=y+Math.sin(k*1.1+r)*14,done=i<pr,cur=i==pr,lock=i>pr,boss=i==n-1;
 if(k<per-1&&i+1<n){x.strokeStyle=i<pr?'#ffd23f':'#ffffff44';x.lineWidth=5;x.setLineDash([8,6]);x.beginPath();x.moveTo(X,Y);x.lineTo(60+(k+1)*(680/(per-1||1)),y+Math.sin((k+1)*1.1+r)*14);x.stroke();x.setLineDash([])}
 const R=boss?19:15+(cur?Math.sin(hT*6)*1.5:0);x.fillStyle=lock?'#444':done?'#2e9e4a':'#ffd23f';x.beginPath();x.arc(X,Y,R,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=3;x.stroke();
 T(boss?'★':lock?'🔒':String(i+1),X,Y+5,boss?20:15,lock?'#999':done?'#fff':'#222','center',0);
 const nm=SG[LV[df][i]].n;x.font='700 9px system-ui';T(nm.length>17?nm.slice(0,16)+'…':nm,X,Y+R+13,9.5,lock?'#888':'#fff','center',2.5);
 if(!lock)btn(X-24,Y-24,48,48,()=>startStage(i))}}
if(pr>=n)T('Gioco completato! 🎉',400,300,16,'#ffe066','center',4);
else bigBtn('Continua ▶',290,285,220,44,'#2e9e4a',()=>startStage(Math.min(pr,n-1)),20);
bigBtn('◀ Home',20,292,110,38,'#456',toHome,15);bigBtn('Album',670,292,110,38,'#456',()=>{S='album'},15)}
/* ---- album ---- */
function drawAlbum(){x.fillStyle='#14131f';x.fillRect(0,0,800,340);T('Album delle vignette',400,26,22,'#ffe066');const got=VORD.filter(k=>SV.album[k]).length;T(got+'/'+VORD.length,770,24,13,'#fff','right',3);
VORD.forEach((k,i)=>{const cx=i%8,cy=i/8|0,X=22+cx*96,Y=44+cy*84,W=90,H=62,v=V[k];x.save();rr(X,Y,W,H,8);x.clip();
 if(SV.album[k]){drawVigScene(v,X,Y,W,H,1);x.restore();x.fillStyle='#000a';x.fillRect(X,Y+H-13,W,13);T(v.t.slice(0,16),X+W/2,Y+H-3,9,'#fff','center',0);btn(X,Y,W,H,()=>showVig([k],()=>{S='album'}))}
 else{x.fillStyle='#252536';x.fillRect(X,Y,W,H);x.restore();T('?',X+W/2,Y+H/2+10,28,'#555','center',0)}
 x.strokeStyle='#ffd23f';x.lineWidth=2;rr(X,Y,W,H,8);x.stroke()});
bigBtn('◀ Indietro',20,300,120,32,'#456',()=>{S='home'},14)}
/* ---- fine ---- */
function drawEnd(){hT+=0;x.drawImage(I.h_beachtown,0,0,800,340);x.fillStyle='#000a';x.fillRect(0,0,800,340);
T('Ce l’hai fatta, Isa!',400,60,38,'#ffe066');T('Castellaneta Marina è salva 🎉',400,98,20);
['isa_run','dog1','cat1','ro2','hk1'].forEach((n,i)=>sp(n,250+i*75,300+Math.sin(hT*6+i)*-3,1,0));
FINAL_MSG.forEach((m,i)=>T(m,400,148+i*26,i==2?15:14,i==2?'#ffe066':'#fff','center',3));
bigBtn('Album',220,285,150,38,'#456',()=>{S='album'},16);bigBtn('Home',430,285,150,38,'#2e9e4a',toHome,16)}
/* ---- ciclo ---- */
function dr(){x.setTransform(2,0,0,2,0,0);x.imageSmoothingEnabled=true;UI=[];x.clearRect(0,0,800,340);
document.body.classList.toggle('play',S=='play'||S=='intro');
if(S=='load')return;
if(S=='home'){drawHome();return}if(S=='story'){drawStory();return}if(S=='free'){drawFree();return}if(S=='map'){drawMap();return}if(S=='album'){drawAlbum();return}if(S=='end'){drawEnd();return}if(S=='vig'){drawVigScreen();return}
x.save();if(shake>0)x.translate((Math.random()-.5)*shake*14,(Math.random()-.5)*shake*14);drawWorld();x.restore();
const g=x.createRadialGradient(400,170,160,400,170,480);g.addColorStop(0,'#0000');g.addColorStop(1,'#0005');x.fillStyle=g;x.fillRect(0,0,800,340);
drawHUD();overlays()}
let last=0;function loop(t){const dt=Math.min(.033,(t-last)/1000||0);last=t;hT+=dt;try{up(dt);dr();mus()}catch(e){console.error(e);window.__err=(window.__err||[]).concat(String(e&&e.stack||e))}requestAnimationFrame(loop)}
window.G={step(n){for(let i=0;i<n;i++){up(1/60);if(S=='dead'){p.hp=9;S='play'}}},get S(){return S},set S(v){S=v},get D(){return D},get p(){return p},get en(){return en},get bs(){return bs},start:startStage,load,stunE,hurt,dmgP,get cam(){return cam},K,LV,SV,showVig,V,get lv(){return lv},setdf(k){df=k},get cp(){return cp},get pt(){return pt},get score(){return score},startFree,get lap(){return lap},get free(){return free},set S(v){S=v},PEND(){return PEND}};
loadAll(()=>{S='home';df=SV.df||'m';requestAnimationFrame(loop)});
