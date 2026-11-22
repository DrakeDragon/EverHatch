
(()=>{'use strict';
/* ============================ helpers ============================ */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const KEY='aerie_save_v1';
const DEBUG=/[?&]debug/.test(location.search);
const clean=s=>(s||'').replace(/[^A-Za-z0-9 '\-]/g,'').trim().slice(0,14);
const lerp=(a,b,t)=>a+(b-a)*t;
function hex2rgb(h){h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function mix(c1,c2,t){const a=hex2rgb(c1),b=hex2rgb(c2);return `rgb(${Math.round(lerp(a[0],b[0],t))},${Math.round(lerp(a[1],b[1],t))},${Math.round(lerp(a[2],b[2],t))})`}
const HEART='<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 21C5 15 2 11.5 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 3.5-3 7-10 13z" fill="#e0674a"/></svg>';

/* ============================ data ============================ */
const STAGES=[{n:'Hatchling',g:0},{n:'Fledgling',g:110},{n:'Juvenile',g:380},{n:'Legend',g:900}];
const CHAPTERS=['Downy Days','First Wingbeats','The Storm Season','Sky Legend'];
const CHAPTER_TXT=[
 'A hatchling is all appetite and wonder. Learn who it is by how you care for it.',
 'The wings are real now. It wants the sky, and it wants to know you will be there when it falls.',
 'Wild weather, wild neighbors. Your griffin is becoming someone.',
 'Your companion has become a legend. The aerie is awake again.'];
const BOND=[
 {n:'Wary',xp:0,u:'It keeps its distance and watches you. Petting only half-works until it trusts you.'},
 {n:'Curious',xp:25,u:'It leans into your hand. Its favorite spot starts to matter.'},
 {n:'Trusting',xp:70,u:'It lets you preen its feathers.'},
 {n:'Nuzzling',xp:140,u:'It greets you at the ledge. Unlocks Greet, a nuzzle once every 20 minutes.'},
 {n:'Perching',xp:240,u:'It rests its weight against you. Story moments deepen. One more outing each time it is away.'},
 {n:'Calling',xp:370,u:'It calls your name across the peaks. Rare treasures turn up more often.'},
 {n:'Steadfast',xp:540,u:'It guards your sleep. It brings home extra provisions every trip.'},
 {n:'Sky-Bound',xp:760,u:'It trusts you with its back. Unlocks Ride the Sky, once it is a Juvenile.'}];
const COATS=[
 {n:'Dawn Gold',body:'#c98a3a',belly:'#e6c27a',wing:'#e3b25a',wing2:'#c98a3a',tip:'#7a4a1c',head:'#f3e9cf',beak:'#e6a92e'},
 {n:'Storm Grey',body:'#7a808c',belly:'#b9bec8',wing:'#aab0bb',wing2:'#868d9b',tip:'#3e4352',head:'#dfe2e8',beak:'#dcaa3a'},
 {n:'Ember',body:'#b4502f',belly:'#e0a070',wing:'#d9783f',wing2:'#b4502f',tip:'#5e2415',head:'#f1dcc0',beak:'#e8b13c'},
 {n:'Snowcrest',body:'#d8d1c0',belly:'#f4efe3',wing:'#f3efe6',wing2:'#d3cdbf',tip:'#8a93a6',head:'#ffffff',beak:'#e2b240'},
 {n:'Night Umber',body:'#4d3b33',belly:'#8a6f5c',wing:'#6e5649',wing2:'#4d3b33',tip:'#1d1613',head:'#bda68f',beak:'#c9972c'},
 {n:'Sunforged',body:'#d9a22e',belly:'#f6dc8a',wing:'#f2c75c',wing2:'#d9a22e',tip:'#8a5a12',head:'#fff6dc',beak:'#f0b52e'}];
const IRIS={bold:'#f2b705',gentle:'#d9a441',fierce:'#e8601c',mischief:'#f0d24a',none:'#e8b030'};
const TRAIT_ADJ={bold:'Bold',gentle:'Gentle',fierce:'Fierce',mischief:'Mischievous'};
const PATHS={hunter:{n:'Sky Hunter',boost:['speed','sight'],aura:'#f0b44c'},
             storm:{n:'Storm Caller',boost:['flight','cry'],aura:'#9fb0ec'},
             guardian:{n:'Guardian',boost:['strength'],aura:'#f4e6b8'}};
const SKILLS={
 flight:{n:'Flight',t:'Wingbeat Drills',perk:'More outings while it is away',tr:'bold'},
 speed:{n:'Speed',t:'Dive Runs',perk:'Chance of a second gift on each outing',tr:'mischief'},
 strength:{n:'Strength',t:'Stone Carrying',perk:'More provisions from hunts',tr:'fierce'},
 sight:{n:'Sight',t:'Far-Sight Watch',perk:'Rarer treasures',tr:'gentle'},
 cry:{n:'Cry',t:'Cry Practice',perk:'More bond from every outing',tr:'bold'}};
const SKILL_CAP=[3,8,15,25];
const FOODS=[
 {id:'berries',n:'Wild Berries',cost:0,h:15,joy:2,f:0,g:1,tr:'gentle',d:'Free. A light snack.'},
 {id:'trout',n:'Silver Trout',cost:2,h:30,joy:3,f:5,g:2,tr:'mischief',d:'Fills it up. Puts a shine on the feathers.'},
 {id:'venison',n:'Fresh Venison',cost:3,h:42,joy:2,f:0,g:3,tr:'fierce',d:'A real meal. Makes it stronger.'},
 {id:'moonfruit',n:'Moonfruit',cost:8,h:25,joy:16,f:4,g:5,tr:'bold',d:'Rare and sweet. It adores these.'}];
const SEASON_NAMES={autumn:'Autumn',winter:'Winter',spring:'Spring',summer:'Summer'};
const ITEMS=[
 {id:'f_russet',n:'Russet Feather',k:'feather',r:0,s:'autumn',c:'#b5602f',d:'Dropped in a leaf-fall updraft. Smells faintly of woodsmoke.'},
 {id:'f_amber',n:'Amber Flight Feather',k:'feather',r:1,s:'autumn',c:'#e0a23a',d:'A primary feather that caught the last warm light of the year.'},
 {id:'f_harvest',n:'Harvest-Gold Plume',k:'feather',r:2,s:'autumn',c:'#f3cd6b',d:'Long, soft, and gold all the way through. Nobody lost this by accident.'},
 {id:'f_frost',n:'Frostrime Feather',k:'feather',r:0,s:'winter',c:'#c9d3e8',d:'Stiff with ice crystals. It does not melt in your hand.'},
 {id:'f_snow',n:'Snowcrest Down',k:'feather',r:1,s:'winter',c:'#f4f1ea',d:'Weightless. It drifts upward when you open your hand.'},
 {id:'f_longwinter',n:'Long Winter Plume',k:'feather',r:2,s:'winter',c:'#8f9bc0',d:'Dusk-colored and enormous. It hums faintly in the wind.'},
 {id:'f_dawnwash',n:'Dawnwash Feather',k:'feather',r:0,s:'spring',c:'#f0c98a',d:'Pale gold at the edge, like the first light over the ridge.'},
 {id:'f_rainbright',n:'Rainbright Plume',k:'feather',r:1,s:'spring',c:'#9db4d8',d:'Beads of rain still roll off it.'},
 {id:'f_nestling',n:'Nestling Fluff',k:'feather',r:2,s:'spring',c:'#f3e6c0',d:'From the very first chick of the season. Soft enough to make you sentimental.'},
 {id:'f_sunscorch',n:'Sunscorch Feather',k:'feather',r:0,s:'summer',c:'#e07a3a',d:'Warm to the touch, as if it remembers noon.'},
 {id:'f_thermal',n:'Thermal Plume',k:'feather',r:1,s:'summer',c:'#f0b84c',d:'Ridden a hundred updrafts and shows it.'},
 {id:'f_zenith',n:'Zenith Feather',k:'feather',r:2,s:'summer',c:'#fbeab8',d:'From the highest point of the highest flight of the year.'},
 {id:'r_coin',n:'Bronze Aerie Coin',k:'relic',r:0,sh:'coin',c:'#b9803a',d:'Stamped with a griffin in profile. Older than the village in the valley.'},
 {id:'r_whistle',n:'Hawk-Bone Whistle',k:'relic',r:0,sh:'whistle',c:'#e8dcc0',d:'It makes no sound a person can hear. Your griffin hears it just fine.'},
 {id:'r_cairn',n:'Carved Cairn Stone',k:'relic',r:0,sh:'stone',c:'#8d93a8',d:'Someone marked this stone to show where the aerie once stood.'},
 {id:'r_acorn',n:'Gilded Acorn',k:'relic',r:0,sh:'acorn',c:'#e0b24a',d:'Gold paint over a real acorn. A child\'s treasure, left on a ledge long ago.'},
 {id:'r_bell',n:"Shepherd's Bell",k:'relic',r:1,sh:'bell',c:'#d6a640',d:'It rings once, low and clear, then waits for an answer.'},
 {id:'r_brooch',n:'Wing Brooch',k:'relic',r:1,sh:'brooch',c:'#c9a35a',d:'A cloak pin in the shape of spread wings. One tiny garnet eye remains.'},
 {id:'r_glass',n:'Ember Glass',k:'relic',r:1,sh:'glass',c:'#e0743f',d:'Volcanic glass, red at its heart. Warm when the sun is out.'},
 {id:'r_nail',n:'Star-Iron Nail',k:'relic',r:1,sh:'nail',c:'#7d86a6',d:'Forged from a fallen star. It points north no matter how you hold it.'},
 {id:'r_mirror',n:'Mirror Pebble',k:'relic',r:1,sh:'pebble',c:'#b6bfd8',d:'Polished by a river until it shows your face. Your griffin keeps checking its own.'},
 {id:'r_sun',n:'Cracked Sun Disc',k:'relic',r:2,sh:'disc',c:'#f2c75c',d:'Half a ceremonial disc. Whoever has the other half is surely still looking.'},
 {id:'r_crown',n:'Crown Shard',k:'relic',r:2,sh:'shard',c:'#e8c068',d:'A jagged piece of a king\'s crown, from when kings rode griffins.'},
 {id:'r_tooth',n:"Lion's Tooth Charm",k:'relic',r:2,sh:'tooth',c:'#f1e6c6',d:'Half lion, half eagle. The old keepers wore these for luck.'},
 {id:'l_first',n:'Feather of the First Griffin',k:'legend',r:3,c:'#f8e7b0',d:'It was waiting at the edge of the ledge the morning the aerie woke. It glows faintly, and it is not from your griffin.'}];
ITEMS.push(
 {id:'x_ridge',n:'Windward Chime',k:'region',r:2,sh:'bell',c:'#cfd6ea',d:'A chime of hammered silver that rings by itself when the wind turns.'},
 {id:'x_pines',n:'Heartwood Charm',k:'region',r:2,sh:'acorn',c:'#9a6a34',d:'A knot of heartwood from a hollow pine, warm as something alive.'},
 {id:'x_ruins',n:"Founder's Seal",k:'region',r:2,sh:'disc',c:'#e3b866',d:'The seal of the first keeper of the aerie. The griffin on it looks a lot like yours.'},
 {id:'x_coast',n:'Sea-Glass Crest',k:'region',r:2,sh:'glass',c:'#9db4d8',d:'Glass worn soft by a thousand tides. It shines like a captured wave.'},
 {id:'x_storm',n:'Thunderstone',k:'region',r:2,sh:'stone',c:'#6e7aa8',d:'A black stone that hums before a storm. Your griffin approves.'},
 {id:'x_spire',n:'Ice-Heart Gem',k:'region',r:2,sh:'glass',c:'#c9d8f2',d:'A gem that never melts and is always, faintly, cold.'},
 {id:'x_ember',n:'Cinder Heart',k:'region',r:2,sh:'glass',c:'#e0553d',d:'A coal that burns without fuel. It is warm and a little bit alive.'},
 {id:'x_sea',n:'Cloud-Sea Lantern',k:'region',r:2,sh:'bell',c:'#f6e7b8',d:'A lantern lit with the glow of a hundred sunrises above the clouds.'},
 {id:'w_sorrel',n:"Sorrel's Down",k:'wild',r:2,c:'#f4f1ea',d:'Pale and soft. Sorrel left it for you after you proved a gentle friend.'},
 {id:'w_tempest',n:"Tempest's Pinion",k:'wild',r:2,c:'#8b92a8',d:'Iron-grey and razor-straight. Tempest does not give these away. You earned it.'},
 {id:'w_pip',n:"Pip's Tail Tuft",k:'wild',r:2,c:'#d9783f',d:'A bright, scruffy tuft. Pip insists it was an accident. It was not.'},
 {id:'w_marrow',n:"Marrow's Scar-Feather",k:'wild',r:2,c:'#7a6a58',d:'Old and weathered. Marrow gave it to you without a word.'},
 {id:'w_aurelia',n:"Aurelia's Sunplume",k:'wild',r:3,c:'#f6dc8a',d:'Gold from root to tip. Holding it feels like holding a sunrise.'});
const ITEM_BY_ID=Object.fromEntries(ITEMS.map(i=>[i.id,i]));
const RARITY=['Common','Uncommon','Rare','Legendary'];

/* ============================ state ============================ */
let S=null, tab='care', titleUp=true, modalQ=[], modalOpen=false, preen=null, training=false, lastGKey='', lastSpeechAt=0, lastT=Date.now();

function load(){try{const r=localStorage.getItem(KEY);if(r){const o=JSON.parse(r);if(o&&(o.v===1||o.v===2))return migrate(o)}}catch(e){}return null}
function save(){try{if(S){const h=S.hatching;delete S.hatching;localStorage.setItem(KEY,JSON.stringify(S));if(h)S.hatching=h}}catch(e){}}
const stage=()=>{let s=0;STAGES.forEach((x,i)=>{if(S.growth>=x.g)s=i});return s};
const lvl=()=>{let l=0;BOND.forEach((b,i)=>{if(S.bondXP>=b.xp)l=i});return l};
const skLv=k=>Math.floor(S.sk[k]/6);
const domTrait=()=>{let k=null,m=2.9;for(const t in S.tr){if(S.tr[t]>m){m=S.tr[t];k=t}}return k};
function season(d=new Date()){const m=d.getMonth();return m>=8&&m<=10?'autumn':m===11||m<=1?'winter':m<=4?'spring':'summer'}
const todayStr=(d=new Date())=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
const yestStr=()=>{const d=new Date();d.setDate(d.getDate()-1);return todayStr(d)};
function journal(text){S.journal.unshift({t:Date.now(),text});if(S.journal.length>80)S.journal.pop()}
function titleLine(){const d=domTrait();let t=S.name;if(d||S.path){t+=' the '+(d?TRAIT_ADJ[d]+' ':'')+(S.path?PATHS[S.path].n.replace(' ','-'):'')}return t.trim()}

/* ============================ effects ============================ */
function addBond(x){const before=lvl();const avg=(S.st.hunger+S.st.feathers+S.st.rest+S.st.joy)/4;if(avg<35)x*=.5;x*=1+perk('bond')+(S.nest.tier>=3?.1:0)+(S.nest.tier>=4?.05:0);S.bondXP+=x;
  const after=lvl();if(after>before){toast(`Bond deepened — ${BOND[after].n}`);sfx('level');journal(`Bond deepened: ${S.name} is now ${BOND[after].n}.`);lastGKey=''}}
function stat(k,v){S.st[k]=clamp(S.st[k]+v,0,100)}
function apply(fx){if(!fx)return;const b=stage();
  if(fx.growth)S.growth+=fx.growth;
  if(fx.bond)addBond(fx.bond);
  ['hunger','feathers','rest','joy'].forEach(k=>{if(fx[k])stat(k,fx[k])});
  if(fx.traits)for(const t in fx.traits)S.tr[t]+=fx.traits[t];
  if(fx.prov)S.prov+=fx.prov;
  if(fx.path)S.path=fx.path;
  if(stage()>b){onStageUp()}}
function onStageUp(){if(stage()>=4)setTimeout(ascendEvent,900);const s=stage();toast(`${S.name} grew — ${STAGES[s].n}!`);sfx('level');cry(true);journal(`${S.name} has become a ${STAGES[s].n}.`);lastGKey=''}
function giveItem(it){S.hoard[it.id]=(S.hoard[it.id]||0)+1;S.seen[it.id]=1}
function rollItem(kind,minR=0){
  const rare=.06+.012*lvl()+.012*skLv('sight')+perk('treasure');const r=Math.random();
  let rar=r<rare?2:r<rare+.28?1:0;rar=Math.max(rar,minR);
  for(let q=rar;q>=0;q--){const pool=ITEMS.filter(i=>i.r===q&&(i.k==='feather'||i.k==='relic')&&(!kind||i.k===kind)&&(i.k!=='feather'||i.s===season()));if(pool.length)return pick(pool)}
  return pick(ITEMS.filter(i=>i.k==='relic'&&i.r===0))}

/* ============================ time ============================ */
function tick(dt){
  const h=dt/3600,sl=S.sleeping,f=sl?.4:1,s=S.st;
  s.hunger=Math.max(5,s.hunger-7*h*f*(1-perk('hungerd')));
  s.feathers=Math.max(5,s.feathers-3*h*f*(S.nest.tier>=2?.8:1));
  s.joy=Math.max(5,s.joy-5*h*f*(1-perk('joyd')));
  if(sl){s.rest=Math.min(100,s.rest+1.6*dt*(S.nest.tier>=1?1.25:1));if(s.rest>=100){S.sleeping=false;lastGKey='';if(!titleUp)say(`${S.name} wakes, stretches every feather, and yawns like a lion.`,5000)}}
  else s.rest=Math.max(5,s.rest-4*h*(1-perk('restd')));
  const avg=(s.hunger+s.feathers+s.rest+s.joy)/4;
  if(avg>50){const b=stage();S.growth+=4*h*(avg/100);if(stage()>b)onStageUp()}
}
function offline(dt){dt=Math.min(dt,36*3600);let left=dt;while(left>0){const st=Math.min(left,1800);tick(st);left-=st}}

/* ============================ away + daily ============================ */
const AWAY=[
 {min:0,r:n=>`${n} dozed on a sun-warm rock and woke with a crick in its neck.`,fx:{rest:10}},
 {min:0,r:n=>`${n} chased falling ${season()==='winter'?'snow':season()==='spring'?'petals':season()==='summer'?'motes of light':'leaves'} until it flopped down, dizzy and delighted.`,fx:{joy:8},trait:'mischief'},
 {min:0,r:n=>`${n} hunted along the ridge and came back with a full crop and a look of enormous pride.`,fx:{hunger:15},prov:1},
 {min:0,r:n=>`${n} wandered down the valley and returned with something shiny it clearly considers a gift.`,item:'relic'},
 {min:0,r:n=>`${n} found a drifting feather in an updraft and carried it home like a flag.`,item:'feather'},
 {min:1,r:n=>`${n} chased the edge of a storm and came back with crackling, ruffled feathers.`,fx:{joy:10},trait:'bold'},
 {min:1,r:n=>`${n} tried to scream like an eagle. A real eagle was not impressed. ${n} is still sulking about it.`,fx:{joy:4},trait:'mischief'},
 {min:1,r:n=>`${n} kept watch over the pass until dusk and returned looking very serious.`,fx:{},trait:'fierce',prov:1},
 {min:1,r:n=>`${n} circled the old aerie ruins for an hour, then came back quieter than it left.`,fx:{},trait:'gentle',item:'relic'},
 {min:2,r:n=>`${n} met a young wild griffin on the far ridge. They glared, they preened, they parted as friends.`,fx:{joy:12},item:'feather'}];
function awayReport(dtSec){
  const hrs=dtSec/3600,n=S.name,st=stage(),L=lvl();
  const count=clamp(1+Math.floor(hrs*.7),1,3+(L>=4?1:0)+Math.floor(skLv('flight')/5));
  const out=[];const pool=AWAY.filter(a=>a.min<=st);
  for(let i=0;i<count;i++){
    const a=pick(pool);const e={text:a.r(n),items:[],prov:0};
    if(a.fx)apply(a.fx);
    if(a.trait)S.tr[a.trait]+=.6;
    addBond(2+Math.floor(skLv('cry')/3));
    S.growth+=1;
    let prov=(a.prov||0);if(prov)prov+=Math.floor(skLv('strength')/3);
    if(L>=6&&prov)prov+=1;
    if(prov){S.prov+=prov;e.prov=prov}
    const wantsItem=a.item||Math.random()<.35+.03*L;
    if(wantsItem){const it=rollItem(a.item||null);giveItem(it);e.items.push(it);
      if(Math.random()<skLv('speed')*.04){const it2=rollItem(null);giveItem(it2);e.items.push(it2)}}
    out.push(e);
  }
  companionVisits(out,hrs);return out}
const DAILY={
 autumn:[n=>`${n} came back at dawn with frost on its wingtips and something golden in its beak.`,n=>`${n} spent the morning arranging leaves in the nest. It will not explain the pattern.`,n=>`${n} woke you by dropping a feather on your face. Good morning.`],
 winter:[n=>`${n} slept against you through the cold. In the morning it left you a gift on the ledge.`,n=>`${n} shook snow off its wings directly onto you, then brought an apology feather.`,n=>`${n} stood in the first light with its breath steaming, looking at you as if you had hung the sun.`],
 spring:[n=>`${n} spent the dawn calling to the new green valley. The valley, for once, seemed to answer.`,n=>`${n} returned with mud on its talons and a gift held very carefully.`,n=>`${n} woke up in a good mood. There is no explanation. Enjoy it.`],
 summer:[n=>`${n} rode the noon thermals until it was a dot, then dropped back down with a present.`,n=>`${n} basked on the warm stone like a cat with wings, and left you a treasure by your boot.`,n=>`${n} woke before the sun and waited on the ledge, just to be there when you arrived.`]};
function dailyCheck(){
  const d=todayStr();if(S.daily===d)return null;
  S.streak=(S.daily===yestStr())?S.streak+1:1;S.daily=d;
  const it=rollItem(null,1);giveItem(it);const prov=Math.min(S.streak,7);S.prov+=prov;
  addBond(3);S.growth+=2;
  return{text:pick(DAILY[season()])(S.name),item:it,prov,streak:S.streak}}
function onOpen(dtSec){
  if(S.phase!=='alive')return;
  if(S.exp){if(Date.now()>=S.exp.end)resolveExp();return}
  let rep=null;if(dtSec>=600)rep=awayReport(dtSec);
  const daily=dailyCheck();
  if(!rep&&!daily)return;
  let html='';
  if(rep){const m=Math.round(dtSec/60);const t=m>=120?`${Math.floor(m/60)} hours`:m>=60?'about an hour':`${m} minutes`;
    html+=`<p style="text-align:center;color:var(--muted);font-size:0.8125rem;margin:0 0 6px">${S.name} was out for ${t}.</p>`;
    rep.forEach(e=>{html+=`<p style="font-size:0.875rem;margin:10px 0 4px">${e.text}</p>`;
      e.items.forEach(it=>{html+=`<div class="gift">${itemIcon(it,34)}<div><b style="color:var(--gold2)">${it.n}</b><br><small style="color:var(--muted)">${RARITY[it.r]}</small></div></div>`});
      if(e.prov)html+=`<div class="gift"><div style="width:34px;text-align:center;font-size:1.25rem">✦</div><div>+${e.prov} provisions</div></div>`});
    journal(`While you were away, ${S.name} had ${rep.length} outing${rep.length>1?'s':''}.`);}
  if(daily){html+=`<div style="margin-top:14px;border-top:1px solid var(--line);padding-top:8px"><h3 style="text-align:center">Today's Moment · Day ${daily.streak} in a row</h3><p style="font-size:0.875rem">${daily.text}</p>
    <div class="gift daily">${itemIcon(daily.item,38)}<div><b style="color:var(--gold2)">${daily.item.n}</b><br><small style="color:var(--muted)">${RARITY[daily.item.r]}</small></div></div>
    <div class="gift daily"><div style="width:38px;text-align:center;font-size:1.25rem">✦</div><div>+${daily.prov} provisions</div></div></div>`;
    journal(`Daily moment: ${daily.text}`)}
  showModal({title:rep?'While You Were Away':'A New Day',html,buttons:[{t:'Welcome back',cls:'gold'}]});
  save();renderAll()}

/* ============================ icons ============================ */
function featherSVG(c,size){return`<svg viewBox="0 0 32 32" width="${size}" height="${size}"><path d="M7 27 C5 14 14 5 26 5 C25 17 18 25 9 26 Z" fill="${c}" stroke="rgba(0,0,0,.35)" stroke-width="1"/><path d="M7 27 L22 10" stroke="rgba(0,0,0,.35)" stroke-width="1.4" fill="none"/><path d="M13 20 l5 1 M16 16 l5 1 M11 23 l4 0" stroke="rgba(0,0,0,.22)" stroke-width="1"/></svg>`}
function relicSVG(sh,c,size){const st=`stroke="rgba(0,0,0,.4)" stroke-width="1"`;let b='';
  switch(sh){
   case'coin':b=`<circle cx="16" cy="16" r="10" fill="${c}" ${st}/><circle cx="16" cy="16" r="6.5" fill="none" stroke="rgba(0,0,0,.3)"/><path d="M13 19 l3-8 3 8" stroke="rgba(0,0,0,.4)" fill="none"/>`;break;
   case'whistle':b=`<rect x="5" y="12" width="20" height="8" rx="4" fill="${c}" ${st}/><circle cx="25" cy="16" r="4" fill="${c}" ${st}/><circle cx="12" cy="16" r="1.6" fill="rgba(0,0,0,.45)"/>`;break;
   case'stone':b=`<path d="M6 24 L9 10 L18 6 L26 12 L25 25 Z" fill="${c}" ${st}/><path d="M12 14 h8 M12 18 h6 M12 22 h8" stroke="rgba(0,0,0,.3)"/>`;break;
   case'acorn':b=`<path d="M8 14 C8 25 24 25 24 14 Z" fill="${c}" ${st}/><path d="M7 14 C7 7 25 7 25 14 Z" fill="#8d6a2a" ${st}/><rect x="15" y="4" width="2" height="4" fill="#6a4c1c"/>`;break;
   case'bell':b=`<path d="M7 24 C8 12 10 7 16 7 C22 7 24 12 25 24 Z" fill="${c}" ${st}/><circle cx="16" cy="25" r="2.6" fill="#7a5a22"/><circle cx="16" cy="5.5" r="2" fill="none" stroke="#7a5a22"/>`;break;
   case'brooch':b=`<path d="M16 8 L5 14 L10 17 L16 14 L22 17 L27 14 Z" fill="${c}" ${st}/><path d="M16 14 L16 25" stroke="${c}" stroke-width="4"/><circle cx="16" cy="12" r="2" fill="#b83a3a"/>`;break;
   case'glass':b=`<path d="M16 4 L26 12 L22 26 L10 26 L6 12 Z" fill="${c}" ${st}/><path d="M16 4 L16 26 M6 12 L26 12" stroke="rgba(255,230,200,.35)"/>`;break;
   case'nail':b=`<rect x="14" y="4" width="4" height="22" fill="${c}" ${st}/><rect x="9" y="3" width="14" height="4" rx="1" fill="${c}" ${st}/><path d="M14 26 L16 30 L18 26Z" fill="${c}"/>`;break;
   case'pebble':b=`<ellipse cx="16" cy="16" rx="11" ry="8" fill="${c}" ${st}/><ellipse cx="13" cy="13" rx="4" ry="2" fill="rgba(255,255,255,.5)"/>`;break;
   case'disc':b=`<path d="M16 16 L16 4 A12 12 0 0 1 28 16 Z" fill="${c}" ${st}/><path d="M16 16 L4 16 A12 12 0 0 0 16 28 Z" fill="${c}" opacity=".35"/><path d="M18 8 L16 16 L24 14" stroke="rgba(0,0,0,.4)" fill="none"/>`;break;
   case'shard':b=`<path d="M5 24 L9 8 L14 18 L18 6 L23 18 L27 10 L27 24 Z" fill="${c}" ${st}/>`;break;
   case'tooth':b=`<path d="M9 6 C9 20 14 28 16 28 C18 28 23 20 23 6 Z" fill="${c}" ${st}/><circle cx="16" cy="9" r="1.8" fill="rgba(0,0,0,.4)"/>`;break;
   default:b=`<circle cx="16" cy="16" r="9" fill="${c}"/>`}
  return`<svg viewBox="0 0 32 32" width="${size}" height="${size}">${b}</svg>`}

const treasureArtIds=new Set(["f_russet", "f_amber", "f_harvest", "f_frost", "f_snow", "f_longwinter", "r_coin", "r_whistle", "r_cairn", "r_acorn", "r_bell", "r_brooch", "r_glass", "r_nail", "r_mirror", "r_sun", "r_crown", "r_tooth", "g_cord", "g_bell", "g_chain", "g_circlet", "g_crest", "g_crown", "g_band", "g_cuff", "g_star", "g_ring", "g_ember", "g_sun"]);
const treasureAliases={f_dawnwash:'f_harvest',f_rainbright:'f_longwinter',f_nestling:'f_snow',f_sunscorch:'f_russet',f_thermal:'f_amber',f_zenith:'f_harvest',l_first:'f_harvest',l_ascend:'f_harvest',x_ridge:'r_bell',x_pines:'r_acorn',x_ruins:'r_sun',x_coast:'r_mirror',x_storm:'r_cairn',x_spire:'r_mirror',x_ember:'r_glass',x_dunes:'r_glass',x_canopy:'f_amber',x_anvil:'r_nail',x_titan:'r_tooth',g_suncol:'g_cord',g_vine:'g_cord',g_pend:'g_chain',g_frost:'g_circlet',g_stormc:'g_crest',g_firstc:'g_crown',g_iron:'g_star',g_dawn:'g_band',g_veilc:'g_cuff',g_titan:'g_ring',g_cloud:'g_ring',g_heart:'g_sun',g_halo:'g_circlet',g_starn:'g_chain',g_moonw:'g_star',g_dawnt:'g_ring'};
function paintedIcon(id,size,filter=''){return `<img class="loot-art" src="assets/treasures/${id}.webp" alt="" width="${size}" height="${size}" style="${filter}" decoding="async">`}
function itemIcon(it,size){const key=treasureArtIds.has(it.id)?it.id:treasureAliases[it.id];if(key&&!(it.k==='feather'&&SPEC.id!=='griffin'&&SPEC.id!=='hippogriff'))return paintedIcon(key,size,it.id===key?'':'filter:saturate(.85)');return `<span class="loot-fallback" style="width:${size}px;height:${size}px;--loot-color:${it.c}">${originalItemIcon(it,size)}</span>`}
function gearArt(g){const key=treasureArtIds.has(g.id)?g.id:treasureAliases[g.id];return key?paintedIcon(key,56):''}
const boonSymbols=['➶','ϟ','◉','✥','✦','♥','☀','♦','☾','✎','▣','★','❧','✧','✷'];
function medalIcon(group,i,locked=false){const symbols=group==='boon'?boonSymbols:['✦','➶','✥','♛','♥','☀','★','♦','◈','✷','➶','✥','✦','⊕','✥','★','♛','➶','✦','ϟ','♥','❧','✥','♥','♥','◉','☀','⌂','✎','✧','⌂','♛','♦','♛','✷','★','☀','➶','❧','✷','✦','☀','★'];const c=group==='boon'?['#77bde0','#e7a95b','#b8a3ed'][Math.floor(i/5)%3]:['#b98a4b','#dfbe76','#a5c8e7','#d8b3f5'][i%4];return `<span class="medal-art ${locked?'medal-locked':''}" style="--medal-color:${c}"><span>${symbols[i%symbols.length]}</span><small>${String(i+1).padStart(2,'0')}</small></span>`}

function originalItemIcon(it,size){if(it.k==='feather'||it.k==='legend'||it.k==='wild')return featherSVG(it.c,size);return relicSVG(it.sh,it.c,size)}

/* ============================ griffin art ============================ */
const SP=[{s:.72,hs:1.45,wl:46,wn:4,fl:true,crest:0},{s:.82,hs:1.25,wl:82,wn:6,fl:true,crest:1},
          {s:.92,hs:1.1,wl:108,wn:8,fl:false,crest:2},{s:1,hs:1,wl:128,wn:10,fl:false,crest:3}];
function featherPath(px,py,len,w){return`M${px},${py} C${px-w},${py-len*.3} ${px-w*.9},${py-len*.8} ${px},${py-len} C${px+w*.9},${py-len*.8} ${px+w},${py-len*.3} ${px},${py} Z`}
function wingFeathers(px,py,len,n,a0,a1,f1,f2,tip){let s='';
  for(let i=0;i<n;i++){const t=n===1?0:i/(n-1);const a=a0+(a1-a0)*t;const L=len*(.68+.32*Math.sin(Math.PI*(.12+.76*t)));
    s+=`<path d="${featherPath(px,py,L,Math.max(5,len*.095))}" transform="rotate(${a.toFixed(1)} ${px} ${py})" fill="${i%2?f1:f2}" stroke="${tip}" stroke-opacity=".45" stroke-width="1"/>`;
    s+=`<path d="M${px},${py} L${px},${py-L*.92}" transform="rotate(${a.toFixed(1)} ${px} ${py})" stroke="${tip}" stroke-opacity=".25" stroke-width="1" fill="none"/>`}
  return s}
function auraSVG(col){return`<defs><radialGradient id="aura"><stop offset="0" stop-color="${col}" stop-opacity=".85"/><stop offset=".55" stop-color="${col}" stop-opacity=".3"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs><circle cx="165" cy="150" r="170" fill="url(#aura)"/>`}
function griffinSVG(o){
  const P=SP[o.stage],c=o.stage>=4?ascCoat(COATS[o.coat]):COATS[o.coat],fold=o.fold!==undefined?o.fold:(o.sleep?-50:0),s=P.s,G=gearSVG(o.eq);
  let wNear=wingFeathers(152,150,P.wl,P.wn,-6,-94,c.wing,c.wing2,c.tip);
  let wFar=wingFeathers(138,146,P.wl*.92,P.wn,-20,-104,c.wing2,c.body,c.tip);
  let wX=o.stage>=4?wingFeathers(138,146,P.wl*1.07,P.wn+3,-34,-122,c.wing2,c.wing,c.tip):'';
  const X=(SPX[o.sp||SPEC.id]||SPX.griffin)(c,P,o);if(X.w){wNear=X.w[0];wFar=X.w[1];wX=X.w[2]}
  const eye=o.sleep?`<path d="M241,99 q6,5 12,0" stroke="#2a1a10" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
    :`<g class="blink"><circle cx="247" cy="98" r="6.8" fill="${o.iris}"/><circle cx="248" cy="98.5" r="3.5" fill="#1a0f0a"/><circle cx="249.6" cy="96.6" r="1.5" fill="#fff"/></g>`;
  let fluff='';if(P.fl&&!X.nofl){for(let a=0;a<360;a+=24){const x=148+82*Math.cos(a*Math.PI/180),y=192+46*Math.sin(a*Math.PI/180);fluff+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${a%48?10:13}" fill="${c.belly}" opacity=".9"/>`}
    fluff+=`<circle cx="232" cy="82" r="8" fill="${c.head}"/><circle cx="222" cy="86" r="8" fill="${c.head}"/><circle cx="244" cy="80" r="6" fill="${c.head}"/>`}
  let crest='';if(P.crest>=1){const n=P.crest+1;for(let i=0;i<n;i++)crest+=`<path d="${featherPath(222,92,20+P.crest*4,5)}" transform="rotate(${-62-i*14} 222 92)" fill="${c.head}" stroke="${c.wing2}" stroke-opacity=".5"/>`}
  const ear=P.crest>=2?`<path d="M226,82 L222,60 L240,76 Z" fill="${c.body}"/><path d="M226,82 L225,66 L236,77Z" fill="${c.wing}"/>`:'';
  const sparks=o.aura?`<g fill="#fff4d2"><circle cx="70" cy="70" r="2.2"/><circle cx="260" cy="48" r="2"/><circle cx="288" cy="150" r="1.8"/><circle cx="40" cy="150" r="2"/><circle cx="170" cy="18" r="2.2"/></g>`:'';
  return`<svg viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.body}"/><stop offset="1" stop-color="${c.belly}"/></linearGradient></defs>
  ${o.stage>=4?ascendSVG():''}${o.aura?auraSVG(o.auraCol):''}${sparks}
  ${o.noNest?'':nestSVG(o.nestTier,o.slots,o.banner)}
  <g transform="translate(160 262) scale(${s}) translate(-160 -262)"><g class="breathe" ${o.sleep?'transform="translate(0 4)"':''}>
${X.tail||`    <path d="M66,192 C30,188 14,212 22,234" stroke="${c.body}" stroke-width="10" fill="none" stroke-linecap="round"/>
    <ellipse cx="22" cy="238" rx="9" ry="15" fill="${c.tip}" transform="rotate(14 22 238)"/>`}${o.stage>=4?asPlume(c):""}
    <g class="wflap" style="transform-origin:138px 146px"><g transform="rotate(${fold} 138 146)">${wX}${wFar}<ellipse cx="138" cy="146" rx="26" ry="20" fill="${c.wing2}" transform="rotate(-45 138 146)"/></g></g>
    <path d="M62,196 C52,160 98,138 150,140 C200,142 228,160 226,192 C224,222 190,236 150,236 C108,236 72,226 62,196 Z" fill="url(#bg1)"/>
    ${fluff}${X.extra||''}
${X.hind||`    <rect x="86" y="222" width="26" height="36" rx="11" fill="${c.body}" stroke="${c.tip}" stroke-opacity=".35"/>
    <ellipse cx="98" cy="206" rx="34" ry="30" fill="${c.body}" stroke="${c.tip}" stroke-opacity=".35"/>
    <path d="M70,214 C90,196 118,200 128,222" stroke="${c.tip}" stroke-opacity=".3" fill="none" stroke-width="2"/>
    <ellipse cx="100" cy="257" rx="22" ry="8.5" fill="${c.body}" stroke="${c.tip}" stroke-opacity=".4"/>
    <path d="M86,258 v6 M100,259 v6 M114,258 v6" stroke="${c.tip}" stroke-width="3" stroke-linecap="round"/>`}
${X.fore||`    <g opacity=".85"><rect x="176" y="222" width="12" height="30" rx="5" fill="${c.beak}"/><ellipse cx="184" cy="256" rx="15" ry="6.5" fill="${c.beak}"/>
      <path d="M172,258 q-6,4 -4,9 M184,261 q-1,6 2,10 M196,258 q6,4 5,9" stroke="${c.tip}" stroke-width="3" fill="none" stroke-linecap="round"/></g>
    <rect x="200" y="220" width="14" height="32" rx="6" fill="${c.beak}"/><ellipse cx="207" cy="256" rx="16" ry="7" fill="${c.beak}"/>
    <path d="M194,258 q-6,4 -4,10 M207,262 q-1,6 2,11 M220,258 q6,4 5,10" stroke="${c.tip}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`}${G.talon}
    <ellipse cx="205" cy="212" rx="22" ry="18" fill="${c.head}" opacity=".95"/>
    <g class="wflap" style="transform-origin:152px 150px"><g transform="rotate(${fold} 152 150)"><ellipse cx="152" cy="152" rx="32" ry="24" fill="${c.body}" transform="rotate(-48 152 152)"/>${wNear}<ellipse cx="152" cy="150" rx="22" ry="18" fill="${c.wing}" transform="rotate(-50 152 150)"/></g></g>${G.wing}
    <ellipse cx="214" cy="152" rx="27" ry="32" fill="${c.head}"/>${o.stage>=4?asMantle(c):""}
    <path d="M196,160 q8,10 18,4 M204,172 q8,10 20,2 M198,146 q8,8 16,3" stroke="${c.wing2}" stroke-opacity=".45" fill="none" stroke-width="2"/>${G.neck}
    <circle data-spot="1" cx="214" cy="150" r="30" fill="transparent"/>
    <circle data-spot="2" cx="150" cy="116" r="36" fill="transparent"/>
    <circle data-spot="3" cx="116" cy="186" r="34" fill="transparent"/>
    <g class="hd"><g transform="translate(226 126) scale(${P.hs}) translate(-226 -126)">
      <path d="M215,134 C212,112 222,98 238,100 C256,102 252,130 240,142 Z" fill="${c.head}"/>
      <circle cx="238" cy="102" r="25" fill="${c.head}"/>${X.top!==undefined?X.top:crest+ear}${o.stage>=4?asCrown(c):""}
${X.beak||`      <path d="M255,92 C276,92 293,103 291,121 C284,114 276,113 270,115 C264,117 258,115 254,108 Z" fill="${c.beak}" stroke="${c.tip}" stroke-opacity=".5"/>
      <path d="M255,111 C266,115 276,121 270,129 C262,127 256,121 254,113 Z" fill="${c.beak}" opacity=".85" stroke="${c.tip}" stroke-opacity=".5"/>
      <circle cx="268" cy="100" r="1.6" fill="${c.tip}"/>
      <path d="M237,89 C243,85 254,87 259,94" stroke="${c.tip}" stroke-width="3" fill="none" stroke-linecap="round"/>`}
      ${X.eye||eye}
      ${G.head}<circle data-spot="0" cx="240" cy="104" r="32" fill="transparent"/>
    </g></g>
  </g></g></svg>`}
function eggSVG(h){const E=SPEC.egg;const k=h>=75?3:h>=50?2:h>=25?1:0;
  const sp=[[140,190,2.5],[175,170,2],[160,225,3],[190,210,2.2],[130,225,2],[170,148,1.8],[150,165,2],[185,240,2.2],[145,250,2.4]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="${E.s}" opacity=".7"/>`).join('');
  const cr=[ '', 'M150,150 l8,14 -6,10 9,12','M150,150 l8,14 -6,10 9,12 M185,170 l-9,10 7,10 -5,12','M150,150 l8,14 -6,10 9,12 M185,170 l-9,10 7,10 -5,12 M130,200 l10,6 -4,10 10,8 M172,215 l9,-2 4,12'][k];
  return`<svg viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="eg" cx=".38" cy=".3" r=".9"><stop offset="0" stop-color="${E.a}"/><stop offset=".6" stop-color="${E.b}"/><stop offset="1" stop-color="${E.c}"/></radialGradient>
  <radialGradient id="eglow"><stop offset="0" stop-color="${E.g}" stop-opacity="${(.15+h/150).toFixed(2)}"/><stop offset="1" stop-color="${E.g}" stop-opacity="0"/></radialGradient></defs>
  <circle cx="160" cy="200" r="${110+h}" fill="url(#eglow)"/>
  ${nestSVG(S.nest.tier,S.nest.slots,bannerCol())}
  <g class="eggpulse"><g id="eggbody"><path d="M160,128 C200,128 214,190 208,225 C203,254 183,266 160,266 C137,266 117,254 112,225 C106,190 120,128 160,128Z" fill="url(#eg)" stroke="#7a5a28" stroke-opacity=".5" stroke-width="2"/>
  ${sp}<path d="${cr}" stroke="#4a3216" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M138,158 C142,146 152,140 160,138" stroke="#fff" stroke-opacity=".6" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="160" cy="200" rx="60" ry="80" fill="transparent" data-egg="1"/></g></g></svg>`}

/* ============================ background canvas ============================ */
const bg=$('#bg'),ctx=bg.getContext('2d');let W=0,H=0,DPR=1;
const stars=Array.from({length:110},()=>({x:Math.random(),y:Math.random()*.6,r:rnd(.4,1.6),p:rnd(0,6)}));
const clouds=Array.from({length:7},()=>({x:Math.random(),y:rnd(.06,.5),s:rnd(.6,1.5),v:rnd(.004,.012)}));
const parts=Array.from({length:30},()=>({x:Math.random(),y:Math.random(),v:rnd(.03,.09),w:rnd(0,6),s:rnd(2,5)}));
function ridge(seed,base,amp,n){const pts=[];let r=seed;const R=()=>{r=(r*9301+49297)%233280;return r/233280};for(let i=0;i<=n;i++){pts.push([i/n,base-R()*amp-Math.sin(i*.9+seed)*amp*.35])}return pts}
const RIDGES=[ridge(3,.74,.2,16),ridge(7,.82,.18,14),ridge(11,.9,.13,12)];
const PAL=[ // hour keyframes
 {h:0,top:'#070b22',mid:'#121a42',bot:'#272c58',m:['#19204d','#111743','#0b1030'],st:1},
 {h:5,top:'#0b1030',mid:'#1c2552',bot:'#343a68',m:['#1d2552','#141b46','#0c1133'],st:.8},
 {h:6.6,top:'#1a2352',mid:'#4a4f7c',bot:'#e8a05a',m:['#323a6c','#222a5a','#141a42'],st:.2},
 {h:9,top:'#3f5f96',mid:'#7f9cc4',bot:'#efe0b8',m:['#6c82ab','#506690','#34476f'],st:0},
 {h:16.5,top:'#3f5f96',mid:'#8fa6c8',bot:'#f2dca8',m:['#6c82ab','#506690','#34476f'],st:0},
 {h:18.6,top:'#1b2354',mid:'#7a4f4a',bot:'#f0a050',m:['#3c3a66','#2a2d58','#171c44'],st:.15},
 {h:20.6,top:'#0b1030',mid:'#1b2352',bot:'#2c315e',m:['#1d2552','#141b46','#0c1133'],st:.8},
 {h:24,top:'#070b22',mid:'#121a42',bot:'#272c58',m:['#19204d','#111743','#0b1030'],st:1}];
function palette(){const d=new Date(),h=d.getHours()+d.getMinutes()/60;let a=PAL[0],b=PAL[1];for(let i=0;i<PAL.length-1;i++){if(h>=PAL[i].h&&h<=PAL[i+1].h){a=PAL[i];b=PAL[i+1];break}}
  const t=(h-a.h)/(b.h-a.h||1);return{top:mix(a.top,b.top,t),mid:mix(a.mid,b.mid,t),bot:mix(a.bot,b.bot,t),m:a.m.map((c,i)=>mix(c,b.m[i],t)),st:lerp(a.st,b.st,t),h}}
function resize(){DPR=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;bg.width=W*DPR;bg.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0)}
let lastDraw=0;
function drawBG(ts){requestAnimationFrame(drawBG);if(document.hidden||ts-lastDraw<33)return;lastDraw=ts;
  const p=palette(),t=ts/1000;
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,p.top);g.addColorStop(.55,p.mid);g.addColorStop(1,p.bot);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  if(p.st>.02){stars.forEach(s=>{ctx.globalAlpha=p.st*(.55+.45*Math.sin(t*1.3+s.p));ctx.fillStyle='#fff4d6';ctx.beginPath();ctx.arc(s.x*W,s.y*H,s.r,0,6.3);ctx.fill()});ctx.globalAlpha=1}
  // sun/moon
  const night=p.h<6||p.h>20.2;const ang=night?((p.h+(p.h<6?24:0)-20.2)/9.8):((p.h-6)/14.2);
  const cx=W*(.12+.76*clamp(ang,0,1)),cy=H*(.58-Math.sin(clamp(ang,0,1)*Math.PI)*.42);
  const gl=ctx.createRadialGradient(cx,cy,0,cx,cy,night?90:150);gl.addColorStop(0,night?'rgba(245,230,180,.5)':'rgba(255,225,150,.75)');gl.addColorStop(1,'rgba(255,225,150,0)');
  ctx.fillStyle=gl;ctx.fillRect(0,0,W,H);ctx.fillStyle=night?'#f1e6c0':'#fff0c0';ctx.beginPath();ctx.arc(cx,cy,night?16:22,0,6.3);ctx.fill();
  if(night){ctx.fillStyle=p.mid;ctx.beginPath();ctx.arc(cx+8,cy-4,14,0,6.3);ctx.fill()}
  // clouds
  clouds.forEach(c=>{c.x+=c.v/60*2;if(c.x>1.3)c.x=-.3;const x=c.x*W,y=c.y*H,s=c.s*60;ctx.fillStyle=night?'rgba(70,80,140,.28)':'rgba(255,245,225,.38)';
    [[0,0,1],[.7,.1,.8],[-.7,.1,.75],[.2,-.3,.7]].forEach(q=>{ctx.beginPath();ctx.ellipse(x+q[0]*s,y+q[1]*s*.6,s*q[2]*.9,s*q[2]*.38,0,0,6.3);ctx.fill()})});
  RIDGES.forEach((r,i)=>{ctx.fillStyle=p.m[i];ctx.beginPath();ctx.moveTo(0,H);r.forEach(q=>ctx.lineTo(q[0]*W,q[1]*H));ctx.lineTo(W,H);ctx.closePath();ctx.fill()});
  // seasonal particles
  const sn=season();parts.forEach(q=>{q.y+=q.v/60*(sn==='summer'?-.4:1);q.x+=Math.sin(t*.6+q.w)*.0008+(sn==='winter'?0:.0006);if(q.y>1.05)q.y=-.05;if(q.y<-.05)q.y=1.05;if(q.x>1.05)q.x=-.05;
    const x=q.x*W,y=q.y*H;
    if(sn==='autumn'){ctx.fillStyle=['#c0652f','#e0a23a','#a8512a'][Math.floor(q.w)%3];ctx.save();ctx.translate(x,y);ctx.rotate(t+q.w);ctx.beginPath();ctx.ellipse(0,0,q.s*1.3,q.s*.7,0,0,6.3);ctx.fill();ctx.restore()}
    else if(sn==='winter'){ctx.fillStyle='rgba(245,245,255,.8)';ctx.beginPath();ctx.arc(x,y,q.s*.45,0,6.3);ctx.fill()}
    else if(sn==='spring'){ctx.fillStyle='rgba(250,235,200,.75)';ctx.save();ctx.translate(x,y);ctx.rotate(t*.8+q.w);ctx.beginPath();ctx.ellipse(0,0,q.s,q.s*.5,0,0,6.3);ctx.fill();ctx.restore()}
    else{ctx.fillStyle=`rgba(255,226,140,${.35+.35*Math.sin(t*2+q.w)})`;ctx.beginPath();ctx.arc(x,y,q.s*.5,0,6.3);ctx.fill()}});
}

/* ============================ UI helpers ============================ */
let toastT=0;function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>e.classList.remove('on'),2800)}
function say(t,ms=7000){const e=$('#speech');e.style.opacity=0;setTimeout(()=>{e.textContent=t;e.style.opacity=1},150);lastSpeechAt=Date.now()+ms}
function showModal(cfg,front){if(modalOpen){front?modalQ.unshift(cfg):modalQ.push(cfg);return}renderModal(cfg)}
function renderModal(cfg){modalOpen=true;const m=$('#modal');
  m.innerHTML=`<div class="card"><h2>${cfg.title||''}</h2>${cfg.html||''}<div class="opts">${(cfg.buttons||[]).map((b,i)=>`<button class="btn ${b.cls||''}" data-i="${i}">${b.t}</button>`).join('')}</div></div>`;
  m.classList.add('on');
  $$('button[data-i]',m).forEach(btn=>btn.onclick=()=>{const b=cfg.buttons[+btn.dataset.i];const keep=b.fn&&b.fn(m)===false;if(!keep)closeModal()});
  if(cfg.onShow)cfg.onShow(m)}
function closeModal(noNext){const m=$('#modal');m.classList.remove('on');m.innerHTML='';modalOpen=false;if(!noNext&&modalQ.length)renderModal(modalQ.shift());else if(!noNext)setTimeout(checkEvents,400)}
function burst(x,y,type,n=6){const fx=$('#fx');for(let i=0;i<n;i++){const e=document.createElement('div');e.className='fxp';
  if(type==='heart')e.innerHTML=HEART;else{e.style.width=e.style.height=rnd(5,9)+'px';e.style.borderRadius='50%';e.style.background=pick(['#f5dc9c','#e3b866','#fff4d2','#e0743f'])}
  e.style.left=x+'px';e.style.top=y+'px';e.style.setProperty('--dx',rnd(-50,50)+'px');e.style.setProperty('--dy',rnd(-110,-40)+'px');e.style.setProperty('--r',rnd(-30,30)+'deg');
  fx.appendChild(e);setTimeout(()=>e.remove(),1300)}}
function sceneXY(e){const r=$('#scene').getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]}
function gcenter(dx=0,dy=0){const r=$('#gwrap').getBoundingClientRect(),s=$('#scene').getBoundingClientRect();return[r.left-s.left+r.width*(.5+dx),r.top-s.top+r.height*(.4+dy)]}
function animG(cls,ms){const w=$('#gwrap');w.classList.add(cls);setTimeout(()=>w.classList.remove(cls),ms)}

/* ============================ render ============================ */
function renderGriffin(force){
  const w=$('#gwrap');
  if(S.phase==='egg'){const k='egg'+Math.floor(S.hatch/25)+S.nest.tier+S.nest.slots.join('|');if(k!==lastGKey||force){lastGKey=k;w.innerHTML=eggSVG(S.hatch)}return}
  const st=stage(),d=domTrait();
  const k=['g',SPEC.id,st,S.coat,S.sleeping,d,S.path,S.legend,S.eq.neck,S.eq.head,S.eq.wing,S.eq.talon,S.nest.tier,S.nest.slots.join('|'),!!S.exp].join();
  if(k===lastGKey&&!force)return;lastGKey=k;
  if(S.exp){w.innerHTML=`<svg viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg">${nestSVG(S.nest.tier,S.nest.slots,bannerCol())}</svg>`;w.classList.remove('sleeping');$('#sleepveil').classList.remove('on');return}
  w.innerHTML=griffinSVG({stage:st,coat:S.coat,sleep:S.sleeping,iris:IRIS[d||'none'],aura:st>=3,auraCol:S.path?PATHS[S.path].aura:'#f2d58a',eq:S.eq,nestTier:S.nest.tier,slots:S.nest.slots,banner:bannerCol()});
  w.classList.toggle('sleeping',S.sleeping);$('#sleepveil').classList.toggle('on',S.sleeping)}
function renderHUD(){
  if(S.phase==='egg'){$('#gname').textContent='The Last Egg';$('#gsub').textContent='Warmth '+Math.round(S.hatch)+'%';$('#bars').style.display='none';return}
  $('#bars').style.display='grid';
  $('#gname').textContent=S.name;
  const d=domTrait();$('#gsub').textContent=S.exp?`Exploring ${RB[S.exp.rid].n}`:`${STAGES[stage()].n}${d?' · '+TRAIT_ADJ[d]:''}${S.path?' · '+PATHS[S.path].n:''} · ${BOND[lvl()].n}`;
  ['hunger','feathers','rest','joy'].forEach(k=>{$('#b_'+k).style.width=S.st[k]+'%'})}
function renderBars(){if(S.phase!=='alive')return;['hunger','feathers','rest','joy'].forEach(k=>{$('#b_'+k).style.width=S.st[k]+'%'})}
function renderAll(){renderGriffin();renderHUD();renderPanel()}

function lowest(){let k='hunger',v=999;for(const a in S.st){if(S.st[a]<v){v=S.st[a];k=a}}return{k,v}}
const IDLE=[
 [n=>`${n} watches you with one eye, ready to bolt.`,n=>`${n} edges a little closer, then thinks better of it.`,n=>`${n} puffs up when the wind gusts, to look bigger than it is.`],
 [n=>`${n} tilts its head at you, beak open a crack.`,n=>`${n} hops after your hand, as if to ask what you will do next.`,n=>`${n} peeps something that is almost your name.`],
 [n=>`${n} leans its whole weight against you and sighs.`,n=>`${n} greets you with a low, rumbling purr that does not belong in a bird.`,n=>`${n} is looking at the sky, then at you, then at the sky.`],
 [n=>`${n} calls across the peaks, and waits for you to answer.`,n=>`${n} stands between you and the open edge, just in case.`,n=>`${n} rests its beak on your shoulder. It weighs more every day, and you wouldn't change a thing.`]];
const TRAITLINES={
 bold:[n=>`${n} stares down the horizon like it owes it money.`],
 gentle:[n=>`${n} nudges you with its head, checking that you're okay.`],
 fierce:[n=>`${n} flares its wings at a passing cloud, just on principle.`],
 mischief:[n=>`${n} is sitting on something it wants you not to look at.`]};
function needLine(k){const n=S.name;return{hunger:`${n}'s stomach growls loud enough to echo off the rocks.`,feathers:`${n}'s feathers are ragged and dull. It keeps glancing at them and sighing.`,
  rest:`${n} is swaying on its feet. Its eyelids keep closing.`,joy:`${n} sits very still, looking at you. It would really like some attention.`}[k]}
function idleLine(){const n=S.name;if(S.exp)return `${n} is out exploring ${RB[S.exp.rid].n}.`;if(S.sleeping)return pick([`${n} sleeps, flanks rising and falling. One talon twitches.`,`Zzz… ${n} dreams of wind.`,`${n} sleeps with its beak tucked under one wing.`]);
  const m=lowest();if(m.v<30)return needLine(m.k);
  const l=lvl(),t=l<2?0:l<4?1:l<6?2:3;let L=IDLE[t].map(f=>f(n));const d=domTrait();if(d)L=L.concat(TRAITLINES[d].map(f=>f(n)));return pick(L)}

/* panel */
function tabsOff(on){$('#tabs').classList.toggle('off',on)}
function renderPanel(){
  const p=$('#panel');
  $('#app').classList.toggle('reading',S.phase==='alive'&&((tab==='story'&&(SUB.story==='lore'||SUB.story==='record'))||(tab==='sky'&&(!SUB.sky||SUB.sky==='map'||SUB.sky==='wild'))));
  if(S.phase==='egg'){tabsOff(true);p.innerHTML=`<h3>Chapter One · The Last Egg</h3><p style="margin:0;font-size:0.9375rem;line-height:1.55">It is warm under your hands. Something inside is listening.</p><p class="note">Tap the egg to warm it. Keep going. It will let you know when it is ready.</p><button type="button" class="btn gold egg-warm" data-act="warmEgg">Warm the egg</button><div class="egg-meter" role="progressbar" aria-label="Egg warmth" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(S.hatch)}"><i style="width:${S.hatch}%"></i></div><p class="note egg-status" aria-live="polite">${Math.round(S.hatch)}% warm</p>`;return}
  tabsOff(false);$$('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===tab));
  const F={care:()=>S.exp?awayCard():pCare(),train:pTrain2,sky:pSky,nest:pNest,bond:pBond,story:pStory2}[tab];const sc=p.scrollTop;p.innerHTML=F();p.scrollTop=sc;
}
function pCare(){const l=lvl(),n=S.name,gr=Date.now()<S.cd.greet;
  return`<div class="grid2">
   <button class="btn" data-act="feed">Feed<br><small style="color:var(--muted)">${S.prov} provisions</small></button>
   <button class="btn ${l<2?'dis':''}" data-act="preen">Preen feathers<br><small style="color:var(--muted)">${l<2?'needs Trusting':'swipe its wings'}</small></button>
   <button class="btn" data-act="rest">${S.sleeping?'Wake':'Let it rest'}<br><small style="color:var(--muted)">${S.sleeping?'tap to wake':'nap in the nest'}</small></button>
   <button class="btn ${l<3||gr?'dis':''}" data-act="greet">Greet<br><small style="color:var(--muted)">${l<3?'needs Nuzzling':gr?'cooling down':'nuzzle'}</small></button></div>
   <p class="note">Tap ${n} to pet it. Each companion has one spot it loves most: head, neck, wing, or flank. Watch how it reacts.</p>`}
function pTrain(){const st=stage();let h=`<h3>Training</h3>`;
  for(const k in SKILLS){const s=SKILLS[k],lv=skLv(k),cap=SKILL_CAP[st];const full=lv>=cap;
    h+=`<div class="row" data-act="train" data-k="${k}"><div class="grow"><b>${s.n}</b> <span class="pill">Lv ${lv}/${cap}</span><small>${s.t} · ${s.perk}</small>
      <div class="bar" style="margin-top:5px"><i style="width:${(S.sk[k]%6)/6*100}%;background:var(--gold)"></i></div></div></div>`}
  h+=`<p class="note">Each session costs some rest and hunger. ${S.path?`${PATHS[S.path].n}: bonus progress in ${PATHS[S.path].boost.map(x=>SKILLS[x].n).join(' and ')}.`:'At Fledgling, you will choose a path.'} Skills are capped until it grows.</p>`;return h}
function pBond(){const l=lvl(),n=S.name;const nx=BOND[l+1];
  let h=`<h3>Bond · ${BOND[l].n}</h3><div class="bar" style="height:10px"><i style="width:${nx?clamp((S.bondXP-BOND[l].xp)/(nx.xp-BOND[l].xp)*100,0,100):100}%;background:var(--joy)"></i></div><p class="note" style="margin-top:6px">${nx?`Next: ${nx.n}`:'The deepest bond.'}</p>`;
  BOND.forEach((b,i)=>{h+=`<div class="row ${i>l?'lock':''}"><div class="grow"><b>${i+1}. ${b.n}</b><small>${i>l?'???':b.u}</small></div></div>`});
  h+=`<h3 style="margin-top:12px">Personality</h3>`;
  for(const t in TRAIT_ADJ){h+=`<div style="display:flex;gap:8px;align-items:center;margin:5px 0"><span style="width:86px;font-size:0.8125rem">${TRAIT_ADJ[t]}</span><div class="bar" style="flex:1"><i style="width:${clamp(S.tr[t]*5,0,100)}%;background:var(--gold)"></i></div></div>`}
  h+=`<p class="note">${n}'s personality comes from how you raise it: what you feed it, how you train it, and what you do when things get hard.</p>`;
  if(S.legend)h+=`<p class="note" style="color:var(--gold2)">${titleLine()}</p>`;h+=familyHTML();return h}
function pStory(){const st=stage();let h=`<h3>Chapter ${st+2} · ${CHAPTERS[st]}</h3><p style="margin:0 0 8px;font-size:0.875rem;line-height:1.5">${CHAPTER_TXT[st]}</p>`;
  h+=`<h3 style="margin-top:10px">Journal</h3>`+S.journal.map(e=>`<div class="entry"><em>${new Date(e.t).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</em>${e.text}</div>`).join('');return h}

/* ============================ actions ============================ */
function guard(){if(titleUp||modalOpen||training||S.phase!=='alive')return false;if(S.exp){say(`${S.name} is away exploring.`,3000);return false}return true}
function act(a,el){if(extraAct(a,el))return;
  if(a==='item'){const it=ITEM_BY_ID[el.dataset.id];if(!S.seen[it.id])return;
    showModal({title:it.n,html:`<div style="text-align:center">${itemIcon(it,70)}</div><p style="text-align:center;color:var(--muted);font-size:0.75rem;margin:0">${RARITY[it.r]}${it.s?' · '+SEASON_NAMES[it.s]:''} · ×${S.hoard[it.id]}</p><p>${it.d}</p>`,buttons:[{t:'Close'}]});return}
  if(!guard())return;
  if(a==='feed')return doFeedMenu();
  if(a==='preen')return startPreen();
  if(a==='rest')return doRest();
  if(a==='greet')return doGreet();
  if(a==='train')return doTrain(el.dataset.k)}
function doFeedMenu(){
  if(S.sleeping){say(`${S.name} is asleep. Let it rest.`);return}
  const html=FOODS.map(f=>`<div class="row" style="margin:7px 0${S.prov<f.cost?';opacity:.45':''}" data-food="${f.id}"><div class="grow"><b>${f.n}</b><small>${f.d}</small></div><span class="pill">${f.cost?f.cost+' prov':'free'}</span></div>`).join('');
  showModal({title:'What will you offer?',html,buttons:[{t:'Never mind'}],onShow:m=>{$$('[data-food]',m).forEach(e=>e.onclick=()=>{closeModal(true);feed(e.dataset.food)})}})}
function feed(id){const f=FOODS.find(x=>x.id===id),n=S.name;
  if(S.prov<f.cost){say(`You don't have enough provisions for that.`);return}
  if(S.st.hunger>=92){say(`${n} sniffs it and turns away. It isn't hungry.`);return}
  S.prov-=f.cost;cnt('feed');stat('hunger',f.h);stat('joy',f.joy);if(f.f)stat('feathers',f.f);S.growth+=f.g;S.tr[f.tr]+=.35;addBond(lvl()===0?3:2);
  const [x,y]=gcenter(.22,-.2);burst(x,y,'spark',5);animG('bounce',550);sfx('munch');
  say(pick([`${n} gulps it down and looks around for more.`,`${n} makes a happy clicking noise with its beak.`,`${n} eats with great dignity and a little bit on its chin.`]));
  save();renderAll();checkEvents()}
function doRest(){S.sleeping=!S.sleeping;lastGKey='';
  say(S.sleeping?`${S.name} circles the nest twice and folds itself down.`:`${S.name} lifts its head, blinking.`);renderAll();save()}
function doGreet(){if(lvl()<3){return}if(Date.now()<S.cd.greet){say('It is still nuzzling the last greeting.');return}
  if(S.sleeping){say('It is asleep.');return}
  S.cd.greet=Date.now()+20*60000;addBond(3);sfx('chirp');stat('joy',10);animG('nuz',1400);const [x,y]=gcenter(.1,-.2);burst(x,y,'heart',5);
  say(`${S.name} presses its whole head into your chest and holds it there.`);save();renderPanel()}
/* petting */
let lastPet=0;
function pet(spot,e){
  if(!guard()&&!(preen&&S.phase==='alive'))return;if(preen||S.sleeping)return;
  const now=Date.now();if(now-lastPet<350)return;lastPet=now;
  const [x,y]=sceneXY(e),n=S.name,l=lvl(),fav=spot===S.fav,names=['head','neck','wing','flank'];
  if(l===0&&!fav&&Math.random()<.5){animG('flinch',400);say(`${n} flinches away. It doesn't trust you there yet.`);return}
  if(fav){stat('joy',7);addBond(l<1?1.5:3);S.growth+=.6;burst(x,y,'heart',4);animG('bounce',550);sfx('chirp');
    say(pick([`${n}'s eyes go half-lidded. That's the spot.`,`${n} leans into your hand and makes a sound like a purr.`,`${n} melts. It would let you do this all day.`]))}
  else{stat('joy',2.5);addBond(l<1?.6:1);burst(x,y,'spark',3);
    say(pick([`${n} tolerates it, but doesn't lean in.`,`${n} gives you a polite blink.`,`${n} shifts. Not quite there.`]))}
  renderBars();renderHUD();
  if(Math.random()<.15)save();
}
/* preen */
function startPreen(){if(lvl()<2){say(`${S.name} flinches away. It doesn't trust you enough for that yet.`);return}
  if(S.sleeping){say('It is asleep.');return}
  if(S.st.feathers>=96){say(`${S.name}'s feathers are already perfect. It's vain about it.`);return}
  preen={dist:0,start:S.st.feathers,down:false,lx:0,ly:0};$('#hint').textContent='Swipe slowly over its feathers';
  $('#panel').innerHTML=`<h3>Preening</h3><p class="note" style="margin-top:0">Drag your finger across ${S.name}, especially the wings. Go slow.</p><button class="btn gold" style="width:100%;margin-top:8px" data-act="donepreen">Done</button>`}
function preenMove(e){if(!preen||!preen.down)return;const [x,y]=sceneXY(e);const d=Math.hypot(x-preen.lx,y-preen.ly);preen.lx=x;preen.ly=y;if(d>60)return;preen.dist+=d;
  while(preen.dist>=26){preen.dist-=26;stat('feathers',1.4);addBond(.18);S.growth+=.05;if(Math.random()<.6)burst(x,y,'spark',2)}
  renderBars();if(S.st.feathers>=100)endPreen()}
function endPreen(){if(!preen)return;const gain=S.st.feathers-preen.start;preen=null;$('#hint').textContent='';
  if(gain>=15){say(`${S.name} shakes itself out. Every feather gleams.`);sfx('chime');cnt('preen');burst(...gcenter(0,-.1),'spark',8);animG('bounce',550);addBond(3);S.growth+=1;stat('joy',6);if(Math.random()<.2){const it=rollItem('feather');giveItem(it);toast(`A loose feather came free: ${it.n}`)}}
  else say(`${S.name} looks you over, gently unimpressed.`);
  save();renderAll();checkEvents()}
/* training */
/* ============================ story events ============================ */
const EVENTS=[
 {id:'shadow',when:()=>stage()===0&&lvl()>=1,title:'A Shadow Over the Nest',text:n=>`A hawk's shadow slides across the ledge. ${n} goes rigid, then looks up at you.`,opts:[
   {t:'Cover it with your coat',fx:{traits:{gentle:2},bond:6,joy:5},r:n=>`${n} burrows into the wool and stays there, shaking, long after the shadow is gone. It doesn't let go of your sleeve all afternoon.`},
   {t:'Stand and shout at the sky',fx:{traits:{bold:2},bond:5},r:n=>`Your voice cracks across the rocks. The hawk wheels away. ${n} stares at you, then tries a shout of its own: a tiny, furious squeak.`},
   {t:'Show it how to hiss and flare',fx:{traits:{fierce:2},bond:5},r:n=>`You puff up and hiss. ${n} copies you, wobbling, every downy feather on end. The sky stays empty. The lesson sticks.`}]},
 {id:'thief',when:()=>stage()===0&&lvl()>=2,title:'The Little Thief',text:n=>`You can't find your keys. ${n} is sitting very still on a pile of something suspiciously jingly.`,opts:[
   {t:'Let it keep one shiny thing',fx:{traits:{mischief:2},bond:5},roll:'relic',r:n=>`${n} chooses with great ceremony, then hides it in the nest and sits on it. You have never seen anything so smug.`},
   {t:'Trade it a treat for the keys',fx:{traits:{gentle:1},bond:4,joy:4},r:n=>`${n} considers the offer, weighs the berry against the keys, and accepts. A fair deal. It watches you pocket the keys like a bank teller.`},
   {t:'Take them back, firmly',fx:{traits:{fierce:1},bond:3},r:n=>`${n} gives you the dirtiest look a hatchling can manage. Then it goes back to sleep on your boots, which is its way of forgiving you.`}]},
 {id:'path',when:()=>stage()>=1&&!S.path,title:'Which Sky?',text:n=>`${n}'s wings are real now: long, strong, impatient. It lifts off the ledge for three whole seconds, then lands on your head. It's time to decide what kind of flyer it wants to be.`,opts:[
   {t:'Sky Hunter: speed and sharp eyes',fx:{path:'hunter',traits:{bold:1}},r:n=>`${n} looks at the far ridge like it has just been given a name. It will be a hunter, quick as a thrown knife and nothing escapes its eye.`},
   {t:'Storm Caller: wind and thunder',fx:{path:'storm',traits:{bold:1}},r:n=>`${n} faces into the wind and opens its beak. The sound it makes isn't a screech yet. But the clouds seem to lean in to listen.`},
   {t:'Guardian: strength and loyalty',fx:{path:'guardian',traits:{fierce:1,gentle:1}},r:n=>`${n} plants itself in front of you, wings half-spread, and stares at the empty sky. It has decided what it is for.`}]},
 {id:'ledge',when:()=>stage()>=1&&lvl()>=4,title:'The Leap',text:n=>`${n} stands at the very edge of the ledge, wings half-open, looking at the drop. Then at you.`,opts:[
   {t:'Hold out your arms to catch it',fx:{traits:{gentle:2},bond:7,growth:4},r:n=>`It jumps, drops like a stone, and you catch an armful of furious feathers. It is mortified. Then it nuzzles your jaw.`},
   {t:'Step back and let it choose',fx:{traits:{bold:2},bond:7,growth:6},r:n=>`You wait. It hesitates, falls, flaps, and three wingbeats above the rocks, finds the air. It circles you once, shrieking with triumph.`},
   {t:'Call to it from the far rock',fx:{traits:{mischief:1,bold:1},bond:6,growth:5},r:n=>`You wave a strip of dried fish from across the gap. It crosses in a gliding, undignified swoop. The fish was a bribe. Both of you know it.`}]},
 {id:'storm',when:()=>stage()>=2,title:'The Storm Season',text:n=>`The great storm of the season rolls in over the peaks. ${n} is on the ledge with its wings wide: thrilled and terrified.`,opts:[
   {t:'Shelter in the cave together',fx:{traits:{gentle:2},bond:7,growth:8},r:n=>`You wait out the thunder with ${n} pressed against your side, its heartbeat much faster than yours. By morning it is asleep. By noon it is acting like it wasn't scared at all.`},
   {t:"Fly the storm's edge with it",fx:{traits:{bold:2},bond:5,growth:10},r:n=>`${n} rides the leading edge of the storm like a surfer, whooping in a voice that is no longer a chick's. It lands soaked and electric, and wants to do it again.`},
   {t:'Stand with it and face the thunder',fx:{traits:{fierce:2},bond:6,growth:10},r:n=>`You stand side by side on the ledge as the thunder breaks. ${n} answers the sky with a cry that rolls down the whole valley. Somewhere very far away, something answers back.`}]},
 {id:'rival',when:()=>stage()>=2&&lvl()>=5,title:'A Stranger on the Ridge',text:n=>`A wild griffin sits on the far ridge, watching. ${n} has gone completely still.`,opts:[
   {t:'Leave a gift on the rocks',fx:{traits:{gentle:2},bond:5},item:1,r:n=>`You set a fish on a flat stone and back away. In the morning it's gone, and a feather lies in its place. ${n} won't stop looking at the ridge.`},
   {t:`Let it posture at the stranger`,fx:{traits:{fierce:2},bond:5},item:1,r:n=>`${n} puffs itself up, spreads its wings, and screams. The stranger raises one wing in what might be respect, and leaves a feather behind.`},
   {t:'Let them play',fx:{traits:{mischief:2},bond:6,joy:10},item:1,r:n=>`It starts with circling. It ends with both of them tumbling through the air in a ridiculous knot. When the stranger leaves, ${n} is wearing one of its feathers like a trophy.`}]},
 {id:'legend',when:()=>stage()>=3&&!S.legend,title:'The Sky Legend',text:n=>`${n} stands on the ledge where you found a single egg. The wind that took the rest of its kind a hundred winters ago is coming back. You can feel it in your teeth.`,opts:[
   {t:'Let it lead the way',fx:{bond:10},legend:true},{t:'Stand at its side',fx:{bond:10},legend:true}]}];
function legendText(){const n=S.name,d=domTrait(),p=S.path;
  const a={bold:`${n} opens its wings into it without a flicker of doubt.`,gentle:`${n} glances back to check you're there, then opens its wings into it.`,fierce:`${n} meets the wind head-on like an old enemy and opens its wings into it.`,mischief:`${n} grins, in whatever way a griffin grins, and opens its wings into it.`}[d||'bold'];
  const b={hunter:` It rises on the updraft faster than your eye can follow.`,storm:` The clouds gather behind it as it climbs, and the thunder sounds almost like a welcome.`,guardian:` It circles the ruins once, slow and sure, as if marking the borders of a home.`}[p||'guardian'];
  return`${a}${b}<br><br>Far below, from valleys you have never seen, other cries answer. The aerie is not silent anymore.<br><br><i>This is not the end. ${n} will still be hungry in the morning.</i>`}
function checkEvents(){
  if(!S||S.phase!=='alive'||titleUp||modalOpen||preen||training)return;
  const ev=EVENTS.find(e=>!S.done[e.id]&&e.when());if(!ev)return;
  S.done[ev.id]=1;const n=S.name;
  showModal({title:ev.title,html:`<p>${ev.text(n)}</p>`,buttons:ev.opts.map(o=>({t:o.t,fn:()=>{
    closeModal(true);
    if(ev.id==='legend'){S.legend=true;giveItem(ITEM_BY_ID.l_first);apply(o.fx);journal(`The Sky Legend: ${n} took to the wind. The aerie is awake again.`);lastGKey='';
      showModal({title:'The Sky Legend',html:`<p>${legendText()}</p><div class="gift daily">${itemIcon(ITEM_BY_ID.l_first,40)}<div><b style="color:var(--gold2)">Feather of the First Griffin</b><br><small style="color:var(--muted)">Legendary</small></div></div>`,buttons:[{t:'Keep going',cls:'gold'}]},true);save();renderAll();return false}
    apply(o.fx);let extra='';
    if(o.roll||o.item){const it=o.roll?rollItem(o.roll):rollItem('feather',o.item);giveItem(it);extra=`<div class="gift">${itemIcon(it,34)}<div><b style="color:var(--gold2)">${it.n}</b><br><small style="color:var(--muted)">${RARITY[it.r]}</small></div></div>`}
    journal(`${ev.title}: ${o.r(n)}`);lastGKey='';
    showModal({title:ev.title,html:`<p>${o.r(n)}</p>${extra}`,buttons:[{t:'Continue',cls:'gold'}]},true);save();renderAll();return false}}))})}

/* ============================ egg / hatch ============================ */
function eggTap(e){if(S.phase!=='egg'||S.hatching)return;
  S.hatch=Math.min(100,S.hatch+2.6);updateEggProgress();sfx('tick');const [x,y]=sceneXY(e);burst(x,y,'spark',3);
  const w=$('#gwrap');w.classList.remove('wob');void w.offsetWidth;w.classList.add('wob');
  const k=Math.floor(S.hatch/25);const lines=['','Something inside shifts.','A tap. From the inside. Answering you.','The shell is warm now, and it is starting to crack.'];
  if(S.hatch<100){renderHUD();renderGriffin();if(k>0&&k!==eggTap.k){eggTap.k=k;say(lines[k]||'',6000)}if(!eggTap.k0){eggTap.k0=1;say('It is warm under your hands.',4000)}}
  else hatchNow();
  if(Math.round(S.hatch)%8===0)save()}
function hatchNow(){
 const state=S; S.hatching=true;updateEggProgress(); const chosen=S.coatSet?S.coat:Math.floor(Math.random()*5);
 const art=coatArtId(SPEC.id,chosen)||SPEC.id;const reduce=newbornMotion.matches; say('The shell is opening!',3000);
 const show=(k)=>{if(S!==state||!S.hatching)return;const w=$('#gwrap');w.innerHTML=illustratedEggSVG(100,k,art);};
 show(2);sfx('hatch');cry(false);
 setTimeout(()=>{if(S!==state||!S.hatching)return;show(3);const [x,y]=gcenter(0,.1);if(!reduce)burst(x,y,'spark',12);},reduce?250:850);
 setTimeout(()=>{if(S!==state||!S.hatching)return;S.phase='alive';S.hatching=false;S.coat=chosen;S.growth=0;S.last=Date.now();lastGKey='';renderAll();save();askName(true);},reduce?500:1750);
}

function askName(fresh){
  showModal({title:fresh?'It Hatched':'A Name',html:`<p>${fresh?`The shell falls away in two warm halves. Wet, wobbling, and curious about the world, your newborn stares up at you. Its coat settles into <b style="color:var(--gold2)">${COATS[S.coat].n}</b>.</p><p>It chose you the way ducklings do. What will you call it?</p>`:`<p>Your new companion still needs a name.</p>`}<input type="text" id="nm" maxlength="14" placeholder="Name your companion" autocomplete="off"><div style="text-align:center;margin-top:8px"><span class="pill" id="rn" style="cursor:pointer">Surprise me</span></div>`,
    buttons:[{t:'This is its name',cls:'gold',fn:()=>{const v=clean($('#nm').value);if(!v){$('#nm').focus();return false}S.name=v;journal(`The egg hatched. A ${COATS[S.coat].n} chick, named ${v}.`);S.bondXP=Math.max(S.bondXP,10);save();renderAll();say(`${v} blinks up at you. Tap its head or neck to say hello, and feed it when it's hungry.`,12000);setTimeout(checkEvents,800)}}],
    onShow:m=>{$('#rn').onclick=()=>{$('#nm').value=pick(['Aerin','Solenne','Kestrel','Thorne','Vesper','Ember','Skye','Rowan','Talon','Briar','Wren','Altair'])}}})}

/* ============================ title / flow ============================ */
function intro(keeper){
  const slides=SPEC.intro(keeper);
  let i=0;const go=()=>{const s=slides[i];showModal({title:s[0],html:`<p style="text-align:center;font-style:italic">${s[1]}</p>${i===0?'<p class="note" style="text-align:center">Across the sky realms, other mythical creatures are stirring, too. Every egg is a new beginning.</p>':''}`,buttons:[{t:i<2?'Next':'Warm the egg',cls:'gold',fn:()=>{i++;if(i<3){closeModal(true);go();return false}
    S=fresh(keeper);S.species=SPEC.id;journal('You found a single warm egg in the ruins of the old aerie.');save();titleUp=false;$('#title').classList.add('hide');lastGKey='';tab='care';renderAll();say('Tap the egg to warm it.',8000)}}]})};go()}
function beginName(){showModal({title:'Welcome, Keeper',html:`<p style="text-align:center">What should the mountain call you?</p><input type="text" id="kn" maxlength="14" placeholder="Your name" autocomplete="off">`,buttons:[{t:'Continue',cls:'gold',fn:()=>{const v=clean($('#kn').value)||'Keeper';closeModal(true);intro(v);return false}},{t:'Back'}]})}
function cont(){S=load();if(!S)return;applySpecies(S.species||'griffin');S.hatching=false;titleUp=false;$('#title').classList.add('hide');
  const dt=(Date.now()-S.last)/1000;if(S.phase==='alive'){offline(dt)}
  lastGKey='';renderAll();S.last=Date.now();lastT=Date.now();
  if(S.phase==='alive'&&!S.name){askName(true)}
  else if(S.phase==='alive'){say(idleLine(),8000);onOpen(dt)}else say('Tap the egg to warm it.',8000);setTimeout(checkEvents,600)}
function newGame(){showModal({title:'Start Over?',html:`<p style="text-align:center">This erases your current companion and everything it has collected. That can't be undone.</p>`,buttons:[{t:'Erase and start a new egg',fn:()=>{try{localStorage.removeItem(KEY)}catch(e){}S=null;$('#tCont').style.display='none';$('#tNew').style.display='none';closeModal(true);begin();return false}},{t:'Keep my griffin',cls:'gold'}]})}


/* ============================ v2: state model, family, perks ============================ */
const SUB={train:'skills',sky:'map',nest:'decor',bond:'bond'};
const ACTS={};
function extraAct(a,el){const f=ACTS[a];if(!f)return false;f(el);return true}
const stageOf=g=>{let s=0;STAGES.forEach((x,i)=>{if(g>=x.g)s=i});return s};
const lvlOf=x=>{let l=0;BOND.forEach((b,i)=>{if(x>=b.xp)l=i});return l};
function seg(key,opts){return`<div class="seg">${opts.map(o=>`<button data-seg="${key}:${o[0]}" class="${SUB[key]===o[0]?'on':''}">${o[1]}</button>`).join('')}</div>`}

const PERG=['phase','hatch','name','coat','coatSet','growth','bondXP','st','sk','tr','path','sleeping','fav','cd','done','legend','tricks','trickCd','eq','exp','gen','parents','born'];
function griffinDefaults(over){return Object.assign({phase:'egg',hatch:0,name:'',coat:0,coatSet:false,growth:0,bondXP:10,
  st:{hunger:70,feathers:70,rest:80,joy:70},sk:{flight:0,speed:0,strength:0,sight:0,cry:0,vigil:0,song:0,lore:0,grace:0},tr:{bold:0,gentle:0,fierce:0,mischief:0},
  path:null,sleeping:false,fav:Math.floor(Math.random()*4),cd:{greet:0},done:{},legend:false,tricks:{},trickCd:{},
  eq:{neck:null,head:null,wing:null,talon:null},exp:null,gen:1,parents:null,born:0},over||{})}
function sharedDefaults(){return{species:'griffin',keeper:'Keeper',prov:6,hoard:{},seen:{},journal:[],last:Date.now(),daily:'',streak:0,
  nest:{tier:0,slots:[null,null,null,null,null,null,null,null]},gear:{},regions:{},wild:{},roster:[],rides:{n:0,best:0,exped:0},
  set:{music:true,sfx:true,vol:.6},since:Date.now(),stars:0,boons:{},ach:{},cnt:{},bounty:{day:'',base:{},claimed:{}}}}
function migrate(o){const g=griffinDefaults(),sh=sharedDefaults();
  for(const k in sh)if(o[k]===undefined)o[k]=sh[k];
  for(const k in g)if(o[k]===undefined)o[k]=g[k];
  if(!o.nest||typeof o.nest!=='object')o.nest=sh.nest;if(!Array.isArray(o.nest.slots))o.nest.slots=sh.nest.slots;while(o.nest.slots.length<8)o.nest.slots.push(null);if(!o.sk)o.sk={};for(const k in SKILLS)if(typeof o.sk[k]!=='number')o.sk[k]=0;
  for(const id in o.hoard)o.seen[id]=1;
  o.roster=(o.roster||[]).map(r=>{const d=griffinDefaults();for(const k in d)if(r[k]===undefined)r[k]=d[k];for(const k in SKILLS)if(typeof r.sk[k]!=='number')r.sk[k]=0;return r});
  o.v=2;return o}
function fresh(keeper){const o=Object.assign(sharedDefaults(),griffinDefaults(),{keeper});o.v=2;return o}
function snapshot(){const o={};PERG.forEach(k=>o[k]=S[k]);return JSON.parse(JSON.stringify(o))}
function switchTo(i){if(i<0||i>=S.roster.length)return;const cur=snapshot(),t=S.roster.splice(i,1)[0];
  PERG.forEach(k=>{S[k]=t[k]});S.roster.push(cur);S.last=Date.now();lastGKey='';tab='care';lastT=Date.now();
  save();renderAll();
  if(S.phase==='egg')say('Tap the egg to warm it.',6000);else{say(`${S.name} lifts its head and looks for you.`,6000)}
  if(S.phase==='alive'&&!S.name)askName(true);else setTimeout(checkEvents,500)}
function familyHTML(){
  const all=[{cur:true,name:S.name,phase:S.phase,growth:S.growth,bond:S.bondXP,gen:S.gen,parents:S.parents},...S.roster.map((r,i)=>({i,name:r.name,phase:r.phase,growth:r.growth,bond:r.bondXP,gen:r.gen,parents:r.parents}))];
  let h=`<h3 style="margin-top:14px">Family</h3>`;
  all.forEach(g=>{const st=g.phase==='egg'?'Egg':STAGES[stageOf(g.growth)].n;
    h+=`<div class="row"><div class="grow"><b>${g.name||'The Egg'}</b>${g.gen>1?` <span class="pill">Gen ${g.gen}</span>`:''}<small>${st}${g.phase==='egg'?'':' · '+BOND[lvlOf(g.bond)].n}${g.cur?' · with you now':''}${g.parents?` · child of ${g.parents.a} and ${g.parents.b}`:''}</small></div>${g.cur?'':`<button class="btn sbtn" data-act="switch" data-i="${g.i}">${g.phase==='egg'?'Tend':'Switch'}</button>`}</div>`});
  return h+`<p class="note">Only the griffin with you now needs care. The others rest safely in the cliffs until you switch to them.</p>`}
ACTS.switch=el=>{if(modalOpen||training||preen)return;switchTo(+el.dataset.i)};

/* nest tiers + gear perks */
const TIERS=[{n:'Twig Nest',cost:0,slots:3,perk:'A humble start.'},{n:'Moss-Lined Nest',cost:12,slots:4,perk:'Resting restores 25% faster.'},
  {n:'Feathered Aerie',cost:35,slots:5,perk:'Plumage fades 20% slower.'},{n:'Grand Aerie',cost:90,slots:6,perk:'Every bond gain is 10% stronger. Stone arch and banners.'}];
function perk(k){let v=0;for(const s in S.eq){const id=S.eq[s];const g=id&&GEAR_BY_ID[id];if(g&&g.perk&&g.perk[k])v+=g.perk[k]}return v+boonFx(k)+skFx(k)+spFx(k)}
const bannerCol=()=>S&&S.path?PATHS[S.path].aura:'#e3b866';

/* ============================ audio ============================ */
const AU={ctx:null,m:null,mus:null,sfx:null,delay:null,pad:[],padGain:null,ready:false,mode:'home',chord:0,nextChord:0,nextNote:0,nextBeat:0,timer:0};
const CHORDS=[[146.83,174.61,220],[116.54,146.83,174.61],[174.61,220,261.63],[130.81,164.81,196]];
const SCALE=[293.66,349.23,392,440,523.25,587.33,698.46,880];
const musOn=()=>S?S.set.music:true, sfxOn=()=>S?S.set.sfx:true, volNow=()=>S?S.set.vol:.6;
function auInit(){
  if(AU.ctx){if(AU.ctx.state==='suspended')AU.ctx.resume();return}
  try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=AU.ctx=new C();
    AU.m=c.createGain();AU.m.gain.value=volNow();AU.m.connect(c.destination);
    AU.mus=c.createGain();AU.mus.gain.value=.5;AU.mus.connect(AU.m);
    AU.sfx=c.createGain();AU.sfx.gain.value=.9;AU.sfx.connect(AU.m);
    const d=c.createDelay(1.5);d.delayTime.value=.46;const fb=c.createGain();fb.gain.value=.4;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1700;
    d.connect(lp);lp.connect(fb);fb.connect(d);const wet=c.createGain();wet.gain.value=.5;lp.connect(wet);wet.connect(AU.mus);AU.delay=d;
    const pf=c.createBiquadFilter();pf.type='lowpass';pf.frequency.value=650;const pg=c.createGain();pg.gain.value=0;pf.connect(pg);pg.connect(AU.mus);AU.padGain=pg;
    for(let i=0;i<3;i++){const o=c.createOscillator();o.type=i===1?'triangle':'sawtooth';o.frequency.value=CHORDS[0][i];o.detune.value=(i-1)*7;const g=c.createGain();g.gain.value=.33;o.connect(g);g.connect(pf);o.start();AU.pad.push(o)}
    AU.ready=true;AU.timer=setInterval(auSched,250);auSet()
  }catch(e){AU.ctx=null;AU.ready=false}}
function auSet(){if(!AU.ready)return;const t=AU.ctx.currentTime;AU.m.gain.setTargetAtTime(volNow(),t,.1);AU.padGain.gain.setTargetAtTime(musOn()?.1:0,t,.6)}
function isNight(){const h=new Date().getHours();return h>=21||h<6}
function pluck(t){const c=AU.ctx,f=pick(SCALE)*(Math.random()<.2?.5:1);const o=c.createOscillator(),g=c.createGain(),s=c.createGain();o.type='triangle';o.frequency.value=f;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.17,t+.03);g.gain.exponentialRampToValueAtTime(.0008,t+2.2);o.connect(g);g.connect(AU.mus);s.gain.value=.7;g.connect(s);s.connect(AU.delay);o.start(t);o.stop(t+2.4)}
function kick(t){const c=AU.ctx,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(120,t);o.frequency.exponentialRampToValueAtTime(42,t+.14);g.gain.setValueAtTime(.35,t);g.gain.exponentialRampToValueAtTime(.001,t+.2);o.connect(g);g.connect(AU.mus);o.start(t);o.stop(t+.25)}
function auSched(){if(!AU.ready||AU.ctx.state!=='running')return;
  if(!musOn()){AU.nextNote=0;return}
  const c=AU.ctx,t=c.currentTime;
  if(t>=AU.nextChord){const ch=CHORDS[AU.chord%CHORDS.length];AU.chord++;AU.pad.forEach((o,i)=>o.frequency.setTargetAtTime(ch[i],t,.7));AU.nextChord=t+(AU.mode==='ride'?5:9)}
  const ahead=t+.6;if(AU.nextNote<t)AU.nextNote=t+.1;
  while(AU.nextNote<ahead){pluck(AU.nextNote);AU.nextNote+=(AU.mode==='ride'?.22+Math.random()*.22:1.1+Math.random()*2.2)*(isNight()&&AU.mode!=='ride'?1.5:1)}
  if(AU.mode==='ride'){if(AU.nextBeat<t)AU.nextBeat=t+.05;while(AU.nextBeat<ahead){kick(AU.nextBeat);AU.nextBeat+=.5}}}
function tone(f,d,type='sine',v=.2,to=null,at=0){const c=AU.ctx,t=c.currentTime+at,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);
  if(to)o.frequency.exponentialRampToValueAtTime(to,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.0005,t+d);o.connect(g);g.connect(AU.sfx);o.start(t);o.stop(t+d+.05)}
function noise(d,v,fq,at=0,q=1){const c=AU.ctx,t=c.currentTime+at,n=Math.floor(c.sampleRate*d),b=c.createBuffer(1,n,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=Math.random()*2-1;
  const s=c.createBufferSource();s.buffer=b;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=fq;f.Q.value=q;const g=c.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0005,t+d);s.connect(f);f.connect(g);g.connect(AU.sfx);s.start(t)}
function cry(big){if(!AU.ready||!sfxOn()||AU.ctx.state!=='running')return;try{const c=AU.ctx,t=c.currentTime,d=big?1.0:.3;
  const o=c.createOscillator(),g=c.createGain(),bp=c.createBiquadFilter(),lfo=c.createOscillator(),lg=c.createGain();
  o.type=SPEC.wave;const km=SPEC.pitch;const f0=(big?620:1300)*km,f1=(big?1500:1950)*km;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+d*.35);o.frequency.exponentialRampToValueAtTime((big?520:1500)*km,t+d);
  bp.type='bandpass';bp.frequency.value=big?1700:2400;bp.Q.value=3;lfo.frequency.value=big?16:30;lg.gain.value=big?60:90;lfo.connect(lg);lg.connect(o.frequency);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(big?.22:.14,t+.04);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(bp);bp.connect(g);g.connect(AU.sfx);o.start(t);lfo.start(t);o.stop(t+d+.05);lfo.stop(t+d+.05)}catch(e){}}
function sfx(n){if(!AU.ready||!sfxOn()||AU.ctx.state!=='running')return;try{switch(n){
  case'tick':tone(520+Math.random()*120,.08,'triangle',.12);break;
  case'munch':noise(.08,.25,900,0,2);noise(.08,.22,700,.12,2);tone(330,.1,'triangle',.08,420,.2);break;
  case'chirp':tone(1100,.1,'triangle',.14,1600);tone(1500,.12,'triangle',.12,1900,.1);break;
  case'chime':[784,988,1175].forEach((f,i)=>tone(f,.5,'sine',.13,null,i*.09));break;
  case'level':[523,659,784,1046].forEach((f,i)=>tone(f,.6,'triangle',.14,null,i*.11));break;
  case'hatch':noise(.3,.3,1200,0,1);[392,523,659,784].forEach((f,i)=>tone(f,.9,'sine',.14,null,.25+i*.14));break;
  case'whoosh':noise(.35,.12,1400,0,.6);break;
  case'ring':tone(880,.3,'sine',.15);tone(1320,.35,'sine',.12,null,.07);break;
  case'gem':tone(1400,.12,'triangle',.1,1900);break;
  case'hit':noise(.25,.35,200,0,.8);tone(120,.25,'sine',.25,60);break;
  case'win':[523,659,784,1046,1318].forEach((f,i)=>tone(f,.7,'triangle',.14,null,i*.12));break;
  case'craft':tone(300,.1,'square',.07,200);tone(300,.1,'square',.07,200,.14);tone(660,.5,'triangle',.12,null,.3);break}}catch(e){}}

/* ============================ settings ============================ */
function openSettings(){if(modalOpen||!S)return;const s=S.set;
  showModal({title:'Settings',html:`
   ${textSizeControls()}<div class="row"><div class="grow"><b>Music</b></div><button class="btn sbtn" id="tgM">${s.music?'On':'Off'}</button></div>
   <div class="row"><div class="grow"><b>Sound effects</b></div><button class="btn sbtn" id="tgS">${s.sfx?'On':'Off'}</button></div>
   <div class="row"><div class="grow"><b>Volume</b><input type="range" id="vol" min="0" max="100" value="${Math.round(s.vol*100)}" style="width:100%;margin-top:6px"></div></div>
   <div class="row" style="cursor:pointer" id="stCard"><div class="grow"><b>Share ${S.name||'your companion'}</b><small>Make a picture card to send to a friend</small></div></div>
   <div class="row" style="cursor:pointer" id="stCode"><div class="grow"><b>Save code</b><small>Back up your game or move it to another device</small></div></div>
   <div class="row" style="cursor:pointer" id="stNew"><div class="grow"><b>Switch kind / new egg</b><small>Shelve this nest and pick a different creature</small></div></div>${shelfInfo()?`<div class="row" style="cursor:pointer" id="stShelf"><div class="grow"><b>Bring back your shelved nest</b><small>${shelfInfo().name} the ${shelfInfo().sp}. This nest takes its place on the shelf.</small></div></div>`:''}`,
   buttons:[{t:'Close',cls:'gold'}],
   onShow:m=>{bindTextSize(m);auInit();
     $('#tgM',m).onclick=e=>{s.music=!s.music;e.target.textContent=s.music?'On':'Off';auInit();auSet();save()};
     $('#tgS',m).onclick=e=>{s.sfx=!s.sfx;e.target.textContent=s.sfx?'On':'Off';save();if(s.sfx)sfx('chime')};
     $('#vol',m).oninput=e=>{s.vol=e.target.value/100;auSet();save()};
     $('#stCard',m).onclick=()=>{closeModal(true);shareCard()};
     $('#stCode',m).onclick=()=>{closeModal(true);saveCode()};
     $('#stNew',m).onclick=()=>{closeModal(true);newGame()};if($('#stShelf',m))$('#stShelf',m).onclick=()=>restoreShelf()}})}


/* ============================ nest, gear, hoard ============================ */
const SLOT_POS=[[70,268],[98,279],[226,279],[254,268],[42,277],[278,277],[126,284],[198,284]];
function seeded(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function itemInner(it){return originalItemIcon(it,32).replace(/^<svg[^>]*>|<\/svg>$/g,'')}
function nestSVG(tier,slots,banner){tier=tier||0;slots=slots||[];banner=banner||'#e3b866';
  const R=seeded(11+tier*3),rr=(a,b)=>a+R()*(b-a);
  let arch='';
  if(tier>=3)arch=`<g opacity=".6"><rect x="4" y="124" width="30" height="150" fill="#262d6c"/><rect x="286" y="124" width="30" height="150" fill="#262d6c"/>
    <path d="M4 128 Q160 36 316 128 L316 150 Q160 62 4 150 Z" fill="#313a84"/>
    <path d="M62 100 v54 l14 -11 14 11 v-65 Z" fill="${banner}" opacity=".92"/><path d="M230 100 v54 l14 -11 14 11 v-65 Z" fill="${banner}" opacity=".92"/></g>`;
  if(tier>=4)arch+=`<g opacity=".85"><circle cx="160" cy="96" r="58" fill="none" stroke="${banner}" stroke-width="3" opacity=".55"/><circle cx="160" cy="96" r="46" fill="none" stroke="#fff2c0" stroke-width="1.5" opacity=".5"/><path d="M40 150 l8 -22 8 22 z M264 150 l8 -22 8 22 z" fill="#f2d58a"/></g>`;
  if(tier>=5)arch+=`<g>${[0,1,2,3,4,5,6].map(i=>`<circle cx="${40+i*40}" cy="${110-Math.sin(i/6*3.14)*34}" r="4" fill="#fff2c0"><animate attributeName="opacity" values=".3;1;.3" dur="${2+i*.3}s" repeatCount="indefinite"/></circle>`).join('')}</g>`;
  const cols=SPEC.nest;let tw='';
  const nT=34+tier*9;for(let i=0;i<nT;i++){const x=rr(56,264),y=rr(255,272),a=rr(-25,25),l=rr(26,50);
    tw+=`<line x1="${(x-l/2).toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x+l/2).toFixed(0)}" y2="${(y+Math.tan(a*Math.PI/180)*l).toFixed(0)}" stroke="${cols[i%4]}" stroke-width="${rr(2,3.6).toFixed(1)}" stroke-linecap="round"/>`}
  let moss='',down='';
  if(tier>=1)for(let i=0;i<8;i++)moss+=`<ellipse cx="${rr(50,270).toFixed(0)}" cy="${rr(262,272).toFixed(0)}" rx="${rr(9,18).toFixed(0)}" ry="${rr(3,5).toFixed(0)}" fill="#5d7a3c" opacity=".85"/>`;
  if(tier>=2)for(let i=0;i<10;i++)down+=`<ellipse cx="${rr(50,270).toFixed(0)}" cy="${rr(258,272).toFixed(0)}" rx="${rr(5,9).toFixed(0)}" ry="${rr(2,4).toFixed(0)}" fill="#f2ead6" opacity=".88" transform="rotate(${rr(-30,30).toFixed(0)})"/>`;
  let items='';const n=TIERS[tier].slots;
  for(let i=0;i<n;i++){const id=slots[i],it=id&&ITEM_BY_ID[id];if(!it)continue;const p=SLOT_POS[i];const rot=(i%2?8:-8);
    items+=`<g transform="translate(${p[0]-14} ${p[1]-26}) rotate(${rot} 14 26) scale(.88)">${itemInner(it)}</g>`}
  return`${arch}<path d="M0,280 C40,262 100,258 160,260 C230,258 290,264 320,282 L320,300 L0,300 Z" fill="#171d45"/><path d="M0,280 C40,262 100,258 160,260 C230,258 290,264 320,282" stroke="#4a559a" stroke-width="2" fill="none" opacity=".6"/>
  <ellipse cx="160" cy="266" rx="${112+tier*4}" ry="${17+tier}" fill="${tier>=2?'#4a3520':'#3d2a17'}"/>${tw}${moss}${down}
  <path d="M52 266 C70 282 250 282 268 266" stroke="#2c1d0f" stroke-width="5" fill="none" stroke-linecap="round"/>${items}`}

/* gear */
const GEAR=[
 {id:'g_cord',slot:'neck',n:'Braided Cord Collar',st:'cord',col:'#8a5a2c',gem:'#e3b866',reqs:[{prov:4},{kind:'feather',n:2}],perk:{bond:.04},d:'+4% bond gains'},
 {id:'g_bell',slot:'neck',n:'Shepherd-Bell Collar',st:'bell',col:'#7a5a22',gem:'#d6a640',reqs:[{id:'r_bell',n:1},{prov:6}],perk:{joyd:.15},d:'Joy fades 15% slower'},
 {id:'g_chain',slot:'neck',n:'Gilded Chain',st:'chain',col:'#e0b24a',gem:'#c9553d',reqs:[{id:'r_coin',n:2},{id:'r_acorn',n:1}],perk:{treasure:.04},d:'Rarer treasures'},
 {id:'g_circlet',slot:'head',n:'Feather Circlet',st:'circlet',col:'#e3b866',gem:'#f4ead2',reqs:[{kind:'feather',n:4},{prov:6}],perk:{train:.3},d:'Training sometimes gives +1'},
 {id:'g_crest',slot:'head',n:'Hawk-Bone Crest',st:'crest',col:'#eadfc4',gem:'#eadfc4',reqs:[{id:'r_whistle',n:1},{kind:'feather',n:2}],perk:{exped:.1},d:'Expeditions find 10% more'},
 {id:'g_crown',slot:'head',n:'Shard Crown',st:'crown',col:'#e8c068',gem:'#c9553d',reqs:[{id:'r_crown',n:1},{kind:'feather',n:3},{prov:15}],perk:{bond:.1},d:'+10% bond gains'},
 {id:'g_band',slot:'wing',n:'Bronze Wing Band',st:'band',col:'#b9803a',gem:'#e3b866',reqs:[{id:'r_coin',n:1},{prov:5}],perk:{restd:.1},d:'Rest fades 10% slower'},
 {id:'g_cuff',slot:'wing',n:'Wing-Brooch Cuff',st:'band',col:'#c9a35a',gem:'#b83a3a',reqs:[{id:'r_brooch',n:1},{prov:8}],perk:{shield:1},d:'Rides: absorbs one storm hit'},
 {id:'g_star',slot:'wing',n:'Star-Iron Bracer',st:'band',col:'#7d86a6',gem:'#f4ead2',reqs:[{id:'r_nail',n:1},{prov:10}],perk:{rspeed:.1},d:'Rides: 10% faster'},
 {id:'g_ring',slot:'talon',n:'Stone Talon Ring',st:'ring',col:'#8d93a8',gem:'#c9d3e8',reqs:[{id:'r_cairn',n:1},{prov:3}],perk:{hungerd:.12},d:'Hunger fades 12% slower'},
 {id:'g_ember',slot:'talon',n:'Ember-Glass Anklet',st:'ring',col:'#c9553d',gem:'#f2c75c',reqs:[{id:'r_glass',n:1},{prov:8}],perk:{train:.2},d:'Training sometimes gives +1'},
 {id:'g_sun',slot:'talon',n:'Sun-Disc Talon Cap',st:'ring',col:'#e8c068',gem:'#fff4d2',reqs:[{id:'r_sun',n:1},{prov:15}],perk:{bond:.06,hungerd:.08},d:'+6% bond, hunger fades 8% slower'}];
const GEAR_BY_ID=Object.fromEntries(GEAR.map(g=>[g.id,g]));
const SLOT_NAMES={neck:'Collar',head:'Head',wing:'Wing',talon:'Talon'};
function gearSVG(eq){const o={neck:'',head:'',wing:'',talon:''};const g=s=>eq&&eq[s]&&GEAR_BY_ID[eq[s]];let x;
  if(x=g('neck')){const c=x.col,m=x.gem,arc='M199,126 C207,146 233,146 241,124';
    if(x.st==='bell')o.neck=`<path d="${arc}" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M214,143 q5,-10 10,0 z" fill="${m}" stroke="#5a3d10" stroke-width=".8"/><circle cx="219" cy="146.5" r="2" fill="#5a3d10"/>`;
    else if(x.st==='chain')o.neck=`<path d="${arc}" stroke="${c}" stroke-width="3.4" fill="none" stroke-dasharray="4 2.2" stroke-linecap="round"/><circle cx="220" cy="145" r="4.2" fill="${m}" stroke="${c}"/>`;
    else o.neck=`<path d="${arc}" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="220" cy="145" r="3.2" fill="${m}"/>`}
  if(x=g('head')){const c=x.col,m=x.gem;
    if(x.st==='crest')o.head=[0,1,2].map(i=>`<path d="${featherPath(226+i*6,82,22-i*3,4)}" transform="rotate(${-18+i*16} ${226+i*6} 82)" fill="${c}" stroke="#7a6a48" stroke-width=".8"/>`).join('');
    else if(x.st==='crown')o.head=`<path d="M220,86 L224,66 L231,79 L238,62 L245,79 L252,66 L256,86 Z" fill="${c}" stroke="#8a6a22" stroke-width="1"/><circle cx="238" cy="76" r="2.6" fill="${m}"/>`;
    else o.head=`<path d="M216,90 Q238,70 262,90" stroke="${c}" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="238" cy="77" r="3.6" fill="${m}" stroke="${c}"/>`}
  if(x=g('wing')){const c=x.col,m=x.gem;o.wing=`<ellipse cx="146" cy="148" rx="19" ry="6" transform="rotate(-48 146 148)" fill="none" stroke="${c}" stroke-width="5.5"/><circle cx="157" cy="137" r="3.8" fill="${m}" stroke="${c}"/>`}
  if(x=g('talon')){const c=x.col,m=x.gem;o.talon=`<rect x="199" y="236" width="16" height="6.5" rx="3" fill="${c}"/><circle cx="207" cy="239.3" r="2.4" fill="${m}"/><rect x="175" y="236" width="14" height="6" rx="3" fill="${c}" opacity=".85"/>`}
  return o}
function reqText(g){return g.reqs.map(r=>r.prov?`${r.prov} provisions`:r.id?`${ITEM_BY_ID[r.id].n}${r.n>1?' ×'+r.n:''}`:`${r.n} feathers`).join(' · ')}
const placedCount=id=>S.nest.slots.filter(x=>x===id).length;
const freeCount=id=>(S.hoard[id]||0)-placedCount(id);
const featherPool=()=>ITEMS.filter(i=>i.k==='feather'&&i.s).sort((a,b)=>a.r-b.r);
const featherFree=()=>featherPool().reduce((a,i)=>a+Math.max(0,freeCount(i.id)),0);
function gearReqOk(g){return g.reqs.every(r=>r.prov?S.prov>=r.prov:r.id?freeCount(r.id)>=r.n:featherFree()>=r.n)}
function gearConsume(g){g.reqs.forEach(r=>{if(r.prov)S.prov-=r.prov;else if(r.id)S.hoard[r.id]-=r.n;else{let n=r.n;for(const it of featherPool()){while(n>0&&freeCount(it.id)>0){S.hoard[it.id]--;n--}}}})}

/* UI */
function pNest(){
  return seg('nest',[['decor','Decorate'],['gear','Gear'],['hoard','Hoard']])+(SUB.nest==='gear'?pGear():SUB.nest==='hoard'?pHoard():pDecor())}
function pDecor(){const t=S.nest.tier,T=TIERS[t],nx=TIERS[t+1];
  let h=`<h3>${T.n}</h3><p class="note" style="margin:0 0 8px">${T.perk}</p>`;
  if(nx)h+=`<button class="btn ${S.prov>=nx.cost?'gold':'dis'}" style="width:100%" data-act="upnest">Upgrade to ${nx.n}<br><small>${nx.cost} provisions · ${nx.perk}</small></button>`;
  h+=`<h3 style="margin-top:12px">Treasures on display</h3><div class="slots">`;
  for(let i=0;i<Math.max(6,T.slots);i++){const locked=i>=T.slots,id=S.nest.slots[i],it=id&&ITEM_BY_ID[id];
    h+=`<div class="slot ${it?'has':''} ${locked?'lockd':''}" data-act="slot" data-i="${i}">${it?itemIcon(it,30):locked?'🔒':'+'}</div>`}
  return h+`</div><p class="note">Place feathers and relics from your Hoard. They appear in your griffin's nest. More slots open as the nest grows.</p>`}
ACTS.upnest=()=>{const nx=TIERS[S.nest.tier+1];if(!nx)return;if(S.prov<nx.cost){say('Not enough provisions for that yet.',3500);return}
  S.prov-=nx.cost;S.nest.tier++;journal(`The nest grew into a ${nx.n}.`);toast(`${nx.n}!`);sfx('craft');lastGKey='';save();renderAll()};
ACTS.slot=el=>{if(modalOpen)return;const i=+el.dataset.i;if(i>=TIERS[S.nest.tier].slots)return;
  const free=ITEMS.filter(it=>S.hoard[it.id]&&freeCount(it.id)>0);
  const cur=S.nest.slots[i];
  const rows=free.map(it=>`<div class="row" data-pl="${it.id}" style="margin:6px 0;cursor:pointer">${itemIcon(it,34)}<div class="grow"><b>${it.n}</b><small>${RARITY[it.r]}</small></div></div>`).join('')||`<p class="note">Nothing free to place. Everything you own is already on display or used.</p>`;
  showModal({title:'Place a treasure',html:rows,buttons:[...(cur?[{t:'Clear this slot',fn:()=>{S.nest.slots[i]=null;lastGKey='';save();renderAll()}}]:[]),{t:'Close'}],
    onShow:m=>{$$('[data-pl]',m).forEach(e=>e.onclick=()=>{S.nest.slots[i]=e.dataset.pl;lastGKey='';sfx('chime');save();closeModal(true);renderAll()})}})};
function pGear(){let h='';['neck','head','wing','talon'].forEach(sl=>{h+=`<h3 style="margin-top:6px">${SLOT_NAMES[sl]}</h3>`;
  GEAR.filter(g=>g.slot===sl).forEach(g=>{const own=S.gear[g.id],eq=S.eq[sl]===g.id,ok=gearReqOk(g);
    h+=`<div class="row loot-row">${gearArt(g)}<div class="grow"><b>${g.n}</b><small>${g.d}</small>${own?'':`<small class="${ok?'ok':'no'}">${reqText(g)}</small>`}</div>
      ${own?`<button class="btn sbtn ${eq?'gold':''}" data-act="equip" data-id="${g.id}">${eq?'Worn':'Wear'}</button>`:`<button class="btn sbtn ${ok?'gold':'dis'}" data-act="craft" data-id="${g.id}">Craft</button>`}</div>`})});
  return h+`<p class="note">Crafting uses up the treasures and provisions shown. Gear is shown on your griffin, and each piece has a small perk.</p>`}
ACTS.craft=el=>{const g=GEAR_BY_ID[el.dataset.id];if(!g||S.gear[g.id])return;if(!gearReqOk(g)){say('You are missing something for that.',3500);return}
  gearConsume(g);S.gear[g.id]=1;S.eq[g.slot]=g.id;journal(`Crafted the ${g.n} for ${S.name}.`);toast(`Crafted: ${g.n}`);sfx('craft');lastGKey='';save();renderAll()};
ACTS.equip=el=>{const g=GEAR_BY_ID[el.dataset.id];if(!g||!S.gear[g.id])return;S.eq[g.slot]=S.eq[g.slot]===g.id?null:g.id;lastGKey='';sfx('chirp');save();renderAll()};

/* hoard */
function tileX(i){const seen=S.seen[i.id],c=S.hoard[i.id]||0;
  if(!seen)return`<div class="tile" data-act="item" data-id="${i.id}"><div style="font-size:1.25rem;opacity:.5">?</div>${i.k==='feather'?SEASON_NAMES[i.s]:i.k==='wild'?'Wild gift':i.k==='region'?'Region':RARITY[i.r]}</div>`;
  return`<div class="tile found r${i.r}" data-act="item" data-id="${i.id}">${itemIcon(i,34)}<div style="margin-top:2px">${i.n}</div>${c>1?`<div class="ct">×${c}</div>`:''}</div>`}
function pHoard(){const total=ITEMS.length,got=ITEMS.filter(i=>S.seen[i.id]).length;
  const sec=(t,f)=>{const l=ITEMS.filter(f);return l.length?`<h3 style="margin-top:12px">${t}</h3><div class="tgrid">${l.map(tileX).join('')}</div>`:''};
  return`<div class="row"><div class="grow"><b>Provisions</b><small>Spend them on food, nest upgrades, and crafting.</small></div><b style="font-size:1.125rem">${S.prov}</b></div>
  <h3>The Hoard · ${got}/${total}</h3>`+sec('Feathers',i=>i.k==='feather'&&i.s)+sec('Relics',i=>i.k==='relic'||i.k==='legend')+sec('Regional treasures',i=>i.k==='region')+sec('Gifts of the wild',i=>i.k==='wild')+sec('Festival keepsakes',i=>i.k==='fest')+
  `<p class="note">Feathers change with the seasons. Right now it's ${SEASON_NAMES[season()]}. Tap a tile to read about it.</p>`}


/* ============================ training helpers + tricks ============================ */
function timingGame(title,intro,done){
  training=true;let round=0,sum=0,raf=0,t0=performance.now(),fin=false;
  const run=m=>{const mk=$('.mk',m);const loop=now=>{if(fin)return;const sp=2.4+round*.7;const pos=.5+.5*Math.sin((now-t0)/1000*sp-1.57);mk.style.left=(pos*100)+'%';mk._pos=pos;raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop)};
  showModal({title,html:`<p style="text-align:center;font-size:0.875rem;margin:0">${intro}</p><div class="tbar"><div class="zone"></div><div class="zone2"></div><div class="mk"></div></div><p id="tres" style="text-align:center;min-height:22px;color:var(--gold2);margin:0">Round 1 of 3</p>`,
   buttons:[{t:'Strike',cls:'gold',fn:m=>{const mk=$('.mk',m);const d=Math.abs((mk._pos||0)-.5)*2;let q,v;
      if(d<.14){q='Perfect!';v=1}else if(d<.38){q='Good';v=.6}else if(d<.65){q='Close';v=.3}else{q='Miss';v=0}
      sum+=v;round++;sfx(v>0?'tick':'hit');if(round<3){$('#tres').textContent=`${q} — Round ${round+1} of 3`;return false}
      fin=true;cancelAnimationFrame(raf);training=false;setTimeout(()=>done(sum),50);return true}},
     {t:'Cancel',fn:()=>{fin=true;cancelAnimationFrame(raf);training=false}}],onShow:run})}
function doTrain(k){const st=stage(),s=SKILLS[k],n=S.name;
  if(S.sleeping){say('It is asleep.');return}
  if(S.st.rest<20){say(`${n} is too tired to train.`);return}
  if(S.st.hunger<20){say(`${n} is too hungry to focus.`);return}
  if(skLv(k)>=SKILL_CAP[st]){say(`${n} can't learn more until it grows.`);return}
  timingGame(s.t,'Tap <b>Strike</b> when the light crosses the gold.',sum=>finishTrain(k,sum))}
function finishTrain(k,sum){const n=S.name;let pts=Math.max(1,Math.round(sum*1.3));
  if(S.path&&PATHS[S.path].boost.includes(k))pts+=1;
  if(Math.random()<perk('train'))pts+=1;
  cnt('train');const cap=SKILL_CAP[stage()]*6+5;const before=skLv(k);S.sk[k]=Math.min(cap,S.sk[k]+pts);
  stat('rest',-18);stat('hunger',-10);stat('joy',6);addBond(2+(S.path==='guardian'?1:0));S.growth+=3;S.tr[SKILLS[k].tr]+=.4;
  const up=skLv(k)>before;
  say(sum>=2.4?`${n} nails it. It looks insufferably pleased with itself.`:sum>=1.2?`${n} is getting the hang of it.`:`${n} wobbles, recovers, and pretends that was on purpose.`);
  if(up){toast(`${SKILLS[k].n} reached level ${skLv(k)}!`);sfx('level')}else sfx('chime');save();renderAll();setTimeout(checkEvents,500)}

const TRICKS=[
 {id:'bow',n:'Bow',aff:'gentle',req:{st:0,lvl:2},d:'A deep, formal bow.',anim:'t-bow'},
 {id:'dance',n:'Wing Dance',aff:'mischief',req:{st:0,lvl:3},d:'Hop, flap, spin. Zero dignity, total joy.',anim:'t-dance'},
 {id:'roar',n:'Mighty Cry',aff:'fierce',req:{st:1,lvl:3},d:'A cry that rolls down the valley.',anim:'t-roar'},
 {id:'hover',n:'Hover',aff:'bold',req:{st:1,lvl:4},d:'Hold perfectly still in the air.',anim:'t-hover'},
 {id:'fetch',n:'Fetch',aff:'gentle',req:{st:1,lvl:5},d:'Fly out and bring something back.',anim:'t-fetch'},
 {id:'roll',n:'Barrel Roll',aff:'bold',req:{st:2,lvl:5},d:'A full roll in the air.',anim:'t-roll'}];
const TRICK_BY_ID=Object.fromEntries(TRICKS.map(t=>[t.id,t]));
function trickOk(t){return stage()>=t.req.st&&lvl()>=t.req.lvl}
function pTricks(){let h='';
  TRICKS.filter(t=>!t.sp||t.sp===SPEC.id).forEach(t=>{const ok=trickOk(t),m=Math.round(S.tricks[t.id]||0),cd=(S.trickCd[t.id]||0)-Date.now();
    const match=domTrait()===t.aff;
    h+=`<div class="row ${ok?'':'lock'}"><div class="grow"><b>${t.n}</b> ${m>=100?'<span class="pill">Mastered</span>':''}<small>${ok?t.d+(match?' (suits its nature)':''):`Needs ${STAGES[t.req.st].n} and bond level ${t.req.lvl+1}`}</small>
      ${ok?`<div class="bar" style="margin-top:5px"><i style="width:${m}%;background:var(--gold)"></i></div>`:''}</div>
      ${ok?`<div style="display:flex;flex-direction:column;gap:5px"><button class="btn sbtn" data-act="tpractice" data-id="${t.id}">Practice</button>
      <button class="btn sbtn ${m>=50&&cd<=0?'gold':'dis'}" data-act="tperform" data-id="${t.id}">${cd>0?Math.ceil(cd/60000)+'m':'Perform'}</button></div>`:''}</div>`});
  return h+`<p class="note">Practice with the timing game. At 50% mastery it can perform for you, and a griffin learns faster the tricks that suit its nature.</p>`}
function pTrain2(){if(S.exp)return awayCard();return seg('train',[['skills','Skills'],['tricks','Tricks']])+(SUB.train==='tricks'?pTricks():pTrain())}
ACTS.tpractice=el=>{if(!guard())return;const t=TRICK_BY_ID[el.dataset.id],n=S.name;
  if(S.sleeping){say('It is asleep.');return}
  if(S.st.rest<20||S.st.hunger<20){say(`${n} needs food and rest first.`);return}
  timingGame(t.n,`Show ${n} the <b>${t.n}</b>. Tap <b>Strike</b> on the gold.`,sum=>{
    const aff=domTrait()===t.aff?1.5:1;const gain=Math.round((8+sum*7)*aff);const before=S.tricks[t.id]||0;S.tricks[t.id]=Math.min(100,before+gain);
    stat('rest',-10);stat('hunger',-6);stat('joy',4);addBond(1.5);S.growth+=1.5;S.tr[t.aff]+=.3;cnt('tp');
    if(before<50&&S.tricks[t.id]>=50){toast(`${n} can perform ${t.n}!`);sfx('level')}else if(before<100&&S.tricks[t.id]>=100){toast(`${t.n} mastered!`);sfx('level');addStars(4)}else sfx('chime');
    say(sum>=2.4?`${n} gets it perfectly. It looks around for applause.`:`${n} tries it again, tongue out, concentrating.`);save();renderAll()})};
ACTS.tperform=el=>{if(!guard())return;const t=TRICK_BY_ID[el.dataset.id],n=S.name,m=S.tricks[t.id]||0;
  if(S.sleeping){say('It is asleep.');return}
  if(m<50){say('It needs more practice first.');return}
  if((S.trickCd[t.id]||0)>Date.now()){return}
  S.trickCd[t.id]=Date.now()+20*60000;tab='care';
  animG(t.anim,t.ms||(t.id==='fetch'?3700:t.id==='hover'?3300:2500));
  if(t.id==='roar'){cry(true);setTimeout(()=>{const [x,y]=gcenter(.2,-.25);burst(x,y,'spark',10)},350)}else if(t.id==='fetch')sfx('whoosh');else if(t.sfx){sfx(t.sfx);if(t.sfx==='ring'||t.sfx==='hit')cry(true)}else sfx('chirp');
  let line=`${n} performs the ${t.n}.`,extra='';
  stat('joy',8);addBond(1+m/60);S.growth+=1;S.tr[t.aff]+=.2;
  if(t.id==='fetch'&&Math.random()<.7){const it=rollItem(null);giveItem(it);extra=` It comes back with ${it.n}.`;setTimeout(()=>toast(`Fetched: ${it.n}`),3200)}
  else if(t.id==='dance'&&Math.random()<.3){const it=rollItem('feather');giveItem(it);extra=` A feather comes loose: ${it.n}.`;setTimeout(()=>toast(`Found: ${it.n}`),2400)}
  else if((t.id==='roar'||t.id==='roll')&&Math.random()<.5){S.prov+=1;extra=' You find a little something in the nest: +1 provision.'}
  else if(t.id==='hover')S.growth+=2;
  if(t.rw==='stars'){const k=Math.max(1,Math.round(2*(1+perk('stars'))));addStars(k);extra+=` +${k} Starlight.`}
  else if(t.rw==='prov'){S.prov+=2;extra+=' +2 provisions.'}
  else if(t.rw==='growth'){S.growth+=4;extra+=' It seems to stand a little taller.'}
  else if(t.rw==='item'&&Math.random()<.5){const it=rollItem(null,1);giveItem(it);extra+=` Something falls from the sky: ${it.n}.`}
  else if(t.rw==='bond'){addBond(3);extra+=' It leans against you afterward.'}
  say(line+extra+(m>=100?' Flawless.':''),9000);
  setTimeout(()=>{if(!S.exp){burst(...gcenter(.1,-.2),'heart',4)}},1200);save();renderPanel();renderBars()};


/* ============================ world, expeditions, wild griffins, courtship ============================ */
const REGIONS=[
 {id:'ridge',n:'Windward Ridge',x:70,y:300,req:{st:1,lvl:1},relic:'x_ridge',pal:['#7d8fc4','#e8c98c','#59638f','#3d4466','#4a5a3a'],
  d:'Open grass and bare stone where the wind never stops. A good place to learn what wings are for.',
  lm:[['The Singing Stones','Wind plays the holes in the rock like pipes. Your griffin sits and listens.'],['The Old Updraft','A column of warm air, strong enough to carry it up without a single flap.'],['The Eagle Graves','Old feathers, laid in rows. Someone has been keeping them tidy.']],
  vig:['{n} rode the ridge wind and came back with a grin that does not fit on a beak.','{n} chased its own shadow along the stones until the shadow gave up.','{n} found a nest long abandoned, and quietly rearranged it to be better.','{n} stood on the highest rock and called down the whole valley.']},
 {id:'pines',n:'The Hollow Pines',x:140,y:250,req:{st:1,lvl:1,prev:['ridge',25]},relic:'x_pines',pal:['#4f6a4a','#d9c78a','#34503a','#243a2a','#3a2a1a'],
  d:'A dark, resin-scented forest. Griffins are too large for it, which they take as a personal challenge.',
  lm:[['The Fallen Giant','A pine so old that moss grows on the moss. It makes a fine perch.'],['The Hollow Tree','Something once lived here. It left behind a warm, dry nest of feathers.'],['The Sunbeam Glade','One shaft of light reaches the forest floor. Your griffin refuses to leave it.']],
  vig:['{n} squeezed between the trunks, got stuck, and then pretended it had meant to.','{n} returned smelling of pine and quiet.','{n} stalked something through the needles and brought back only a very smug look.','{n} napped in a sunbeam for an hour, then called it exploring.']},
 {id:'ruins',n:'The Sunken Ruins',x:215,y:290,req:{st:2,lvl:2,prev:['pines',25]},relic:'x_ruins',pal:['#a88860','#f0d9a0','#7a5f42','#4b3a2a','#6a5a3a'],
  d:'A fallen hall that once housed the first keepers of the aerie. Stone griffins still watch the doors.',
  lm:[['The Stone Guardians','Carved griffins flank a broken gate. Yours lowers its head to them, respectfully.'],['The Keeper’s Hall','Long tables, long dust. On the wall, a mural of a keeper beside a griffin.'],['The Founding Stair','It climbs to nothing. At the top, a single carved feather, waiting.']],
  vig:['{n} sat in the old hall and looked at the mural for a long, long time.','{n} knocked a stone off a ledge and was very surprised by the sound.','{n} brought back a bit of old gold, held like it was alive.','{n} guarded the broken gate as though the ruins were its own.']},
 {id:'coast',n:'Saltwind Coast',x:60,y:190,req:{st:2,lvl:2,prev:['ridge',50]},relic:'x_coast',pal:['#7a97c9','#f6dcaa','#5b7aa8','#3b4f78','#c9b186'],
  d:'Cliffs, gulls, and a sea that smells like adventure. The gulls are not impressed.',
  lm:[['The Gull Cliffs','Ten thousand gulls scream at your griffin. It screams back, louder.'],['The Tidepools','Small bright worlds in the rock. It pokes each one with a talon, gently.'],['The Wreck','A ship broken on the rocks, its figurehead a griffin with a cracked wing.']],
  vig:['{n} skimmed the waves and came home soaking and thrilled.','{n} lost a staring contest to a gull and refuses to discuss it.','{n} dove for a fish, missed, and tried again until the fish gave up.','{n} watched the sunset over the water, completely still.']},
 {id:'storm',n:'The Stormcrown',x:140,y:130,req:{st:2,lvl:3,prev:['coast',25]},relic:'x_storm',pal:['#4a4f7a','#a8a2c8','#2f3356','#1e2140','#3a3f5a'],
  d:'A mountain that wears thunderheads like a crown. Lightning walks here on foot.',
  lm:[['The Lightning Rod','A tall spire of black stone struck so often it hums. Your griffin’s feathers lift.'],['The Thunder Shelf','A ledge below the cloud where the roar is felt more than heard.'],['The Eye','A calm clearing in the storm, a perfect circle of blue-black sky.']],
  vig:['{n} flew into the storm on purpose and came out electrified and delighted.','{n} counted the seconds between flash and thunder and got bored at four.','{n} sheltered under a stone shelf and watched the rain like a king.','{n} returned with every feather standing straight up.']},
 {id:'spire',n:'The Frostspire',x:240,y:90,req:{st:3,lvl:4,prev:['storm',25]},relic:'x_spire',pal:['#9aa8d4','#f1ecf8','#6c7aa8','#434b78','#b9c2e0'],
  d:'A needle of ice at the roof of the world. The air is thin and the quiet is enormous.',
  lm:[['The First Snow','Untouched white. Your griffin steps in it and looks back at its own prints.'],['The Glass Cavern','A cave of ice where every sound arrives twice.'],['The Crown Ledge','From here the whole world is a map, and it is yours.']],
  vig:['{n} breathed out a cloud and watched it for a very long time.','{n} slid down a snowfield on its belly and refused to elaborate.','{n} stood at the top of the world and decided it was acceptable.','{n} returned with frost on its beak and the look of a legend.']},
 {id:'ember',n:'Emberfall Crater',x:265,y:230,req:{st:3,lvl:5,prev:['ruins',50]},relic:'x_ember',pal:['#8a4a3a','#f2b073','#5a2e2a','#341a1a','#6a3a2a'],
  d:'A crater where the ground glows. Warm updrafts, hot stone, and the smell of old fire.',
  lm:[['The Glowing Seam','A crack in the world, orange and breathing.'],['The Cinder Garden','Black glass flowers, formed when sparks hit cold rock.'],['The Ash Throne','A chair of fused stone. Your griffin sits in it. It fits suspiciously well.']],
  vig:['{n} rode the heat shimmer up and came back warm to the bone.','{n} chased a spark across the crater floor and lost.','{n} bathed in the updraft like it was a hot spring.','{n} returned with ash on its wings and a coal-bright eye.']},
 {id:'sea',n:'The Cloud Sea',x:200,y:40,req:{st:3,lvl:6,prev:['spire',40]},relic:'x_sea',pal:['#d9a46b','#fff1c9','#e8c4a0','#c98f66','#f2ddb0'],
  d:'An ocean of cloud above the highest peaks. Few griffins have ever flown here. Fewer returned the same.',
  lm:[['The Sunrise Shelf','The sun rises below you, gold on white, for as far as there is.'],['The Whale Cloud','A drifting mass of mist the size of a mountain. It sighs when your griffin passes.'],['The Last Light','A lantern someone left on a floating rock, still burning after centuries.']],
  vig:['{n} flew through the sunrise and left a gold wake in the cloud.','{n} hung in the stillness, and for a moment time forgot to move.','{n} found the floor of the sky and stood on it.','{n} came home quiet, and glowing a little.']}];
const RB=Object.fromEntries(REGIONS.map(r=>[r.id,r]));
const EXPED={scout:{n:'Scout',dur:20*60000,cost:0,gain:8,items:1,prov:1,gr:2,d:'A short flight, about 20 minutes.'},
 trek:{n:'Trek',dur:2*3600000,cost:2,gain:22,items:2,prov:3,gr:5,d:'A proper outing, about 2 hours.'},
 voyage:{n:'Voyage',dur:6*3600000,cost:5,gain:50,items:3,prov:7,gr:10,d:'A long journey, about 6 hours.'}};
const fdur=ms=>{const m=Math.max(1,Math.ceil(ms/60000));return m>=60?`${Math.floor(m/60)}h ${m%60}m`:`${m}m`};
const LINKS=[['ridge','pines'],['pines','ruins'],['ridge','coast'],['coast','storm'],['storm','spire'],['ruins','ember'],['spire','sea'],['ember','sea']];
let zoneSel=1;
const rex=id=>(S.regions[id]&&S.regions[id].ex)||0;
function regionOpen(r){const q=r.req;if(stage()<q.st||lvl()<q.lvl)return false;if(q.prev&&rex(q.prev[0])<q.prev[1])return false;return true}
function regionReq(r){const q=r.req,a=[];if(stage()<q.st)a.push(`${STAGES[q.st].n} stage`);if(lvl()<q.lvl)a.push(`bond: ${BOND[q.lvl].n}`);if(q.prev&&rex(q.prev[0])<q.prev[1])a.push(`${q.prev[1]}% of ${RB[q.prev[0]].n}`);return a.join(', ')}
let selR=null,selW=null;
function expDur(k){return Math.round(EXPED[k].dur*(1-clamp(perk('exped'),0,.6))*(1-.015*skLv('flight'))*(S.nest.tier>=4?.9:1))}

/* map */
function mapSVG(){
  const P=REGIONS.filter(r=>(r.zone||1)===zoneSel);let links='',nodes='';
  LINKS.filter(l=>(RB[l[0]].zone||1)===zoneSel&&(RB[l[1]].zone||1)===zoneSel).forEach(([a,b])=>{const A=RB[a],B=RB[b],open=regionOpen(A)&&regionOpen(B);
    links+=`<path d="M${A.x},${A.y} Q${(A.x+B.x)/2+8},${(A.y+B.y)/2-10} ${B.x},${B.y}" stroke="${open?'#e3b866':'#4a4f78'}" stroke-width="2" stroke-dasharray="${open?'':'3 5'}" fill="none" opacity="${open?.8:.55}"/>`});
  P.forEach(r=>{const open=regionOpen(r),e=rex(r.id),sel=selR===r.id;
    nodes+=`<g data-act="region" data-id="${r.id}" style="cursor:pointer"><circle cx="${r.x}" cy="${r.y}" r="26" fill="transparent"/>
     <circle cx="${r.x}" cy="${r.y}" r="${sel?17:14}" fill="${open?r.pal[0]:'#2c3050'}" stroke="${sel?'#fff2c0':open?'#e3b866':'#4a4f78'}" stroke-width="${sel?3:2}"/>
     ${open?`<path d="M${r.x},${r.y-18} a18,18 0 ${e>=50?1:0} 1 ${Math.sin(e/100*6.2832)*18},${18-Math.cos(e/100*6.2832)*18}" stroke="#f2d58a" stroke-width="3" fill="none" stroke-linecap="round" opacity="${e>0?1:0}"/>`:''}
     <text x="${r.x}" y="${r.y+4}" text-anchor="middle" font-size="12" fill="${open?'#fff6dc':'#7a7fa8'}">${open?(e>=100?'★':r.n[0]===('T')?r.n[4]:r.n[0]):'🔒'}</text>
     <text x="${r.x}" y="${r.y+31}" text-anchor="middle" font-size="9.5" fill="${open?'#f2e6c4':'#7a7fa8'}" style="paint-order:stroke;stroke:#14183a;stroke-width:2.4px">${r.n}</text></g>`});
  return`<svg class="wmap" viewBox="0 0 330 340" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2250"/><stop offset="1" stop-color="#2d2f58"/></linearGradient></defs>
   <rect width="330" height="340" rx="14" fill="url(#mg)"/>
   <path d="M0,300 Q60,250 110,280 T220,260 T330,290 V340 H0Z" fill="#232748"/><path d="M0,200 Q80,170 140,200 T330,180 V340 H0Z" fill="#232748" opacity=".5"/>
   ${links}${nodes}</svg>`}
function regionCard(){const r=selR&&RB[selR];if(!r)return`<p class="note">Tap a place on the map to see where ${S.name} can fly.</p>`;
  const open=regionOpen(r),e=Math.round(rex(r.id));
  let h=`<h3 style="margin-top:10px">${r.n}</h3><p class="note" style="margin:0 0 8px">${r.d}</p>`;
  if(!open)return h+`<div class="row lock"><div class="grow"><b>Locked</b><small>Needs ${regionReq(r)}.</small></div></div>`;
  h+=`<div style="display:flex;align-items:center;gap:8px"><span style="font-size:0.75rem;width:78px">Explored ${e}%</span><div class="bar grow"><i style="width:${e}%;background:var(--gold)"></i></div></div>`;
  r.lm.forEach((l,i)=>{const got=e>=[25,50,75][i];h+=`<div class="row ${got?'':'lock'}"><div class="grow"><b>${got?l[0]:'Unexplored'}</b><small>${got?l[1]:'Explore '+[25,50,75][i]+'% to discover.'}</small></div></div>`});
  const it=ITEM_BY_ID[r.relic],got2=S.seen[r.relic];
  h+=`<div class="row ${got2?'':'lock'}"><div class="grow"><b>${got2?it.n:'A hidden treasure'}</b><small>${got2?it.d:'Waits at 100% explored.'}</small></div></div>`;
  if(S.exp)return h;
  h+=`<div style="display:grid;gap:7px;margin-top:8px">`;
  Object.keys(EXPED).forEach(k=>{const x=EXPED[k];if(x.far&&(r.zone||1)<2)return;const ok=S.prov>=x.cost&&S.st.hunger>=25&&!S.sleeping;
    h+=`<button class="btn ${ok?'gold':'dis'}" data-act="exped" data-k="${k}" data-id="${r.id}">${x.n} · ${fdur(expDur(k))}<br><small>${x.cost?x.cost+' provisions · ':''}${x.d}</small></button>`});
  if(S.sleeping)h+=`<p class="note">${S.name} is asleep. Wake it first.</p>`;
  return h+`</div>`}
function awayCard(){const x=S.exp,r=RB[x.rid],tot=x.end-x.start,left=Math.max(0,x.end-Date.now()),pct=clamp((1-left/tot)*100,0,100);
  return`<h3>${S.name} is away</h3><p class="note" style="margin:0 0 8px">Exploring ${r.n} (${EXPED[x.k].n}). It will come home when it's ready, even if you close the game.</p>
   <div class="bar" style="height:12px"><i style="width:${pct}%;background:var(--gold)"></i></div><p class="note" style="text-align:center;margin:8px 0">${left>0?fdur(left)+' remaining':'Coming home...'}</p>
   <button class="btn" style="width:100%" data-act="recall">Call ${S.name} home early</button><p class="note">Coming home early brings back only a little of what it would have found.</p>`}
function startExp(rid,k){const r=RB[rid],x=EXPED[k];
  if(S.exp||S.phase!=='alive'||modalOpen||training||!regionOpen(r))return;
  if(S.sleeping){say(`${S.name} is asleep.`);return}
  if(S.st.hunger<25){say(`${S.name} is too hungry to fly far.`);return}
  if(S.prov<x.cost){say('You need more provisions for that.',3500);return}
  S.prov-=x.cost;const d=expDur(k);S.exp={rid,k,start:Date.now(),end:Date.now()+d};
  journal(`${S.name} set out for ${r.n}.`);sfx('whoosh');cry(false);lastGKey='';save();renderAll();say(`${S.name} spreads its wings and is gone.`,5000)}
function addExplore(rid,amt,out){const R=S.regions[rid]=S.regions[rid]||{ex:0};const b=R.ex;amt*=1;R.ex=Math.min(100,R.ex+amt);const r=RB[rid];
  [25,50,75].forEach((t,i)=>{if(b<t&&R.ex>=t){journal(`Discovered ${r.lm[i][0]} in ${r.n}.`);out.push(`New place: <b>${r.lm[i][0]}</b>`);addStars(2)}});
  if(b<100&&R.ex>=100){const it=ITEM_BY_ID[r.relic];giveItem(it);journal(`${r.n} fully explored. Found ${it.n}.`);out.push(`Fully explored! Found <b>${it.n}</b>`);addStars(10);return it}return null}
function resolveExp(early){const x=S.exp;if(!x)return;const r=RB[x.rid],E=EXPED[x.k],n=S.name;
  const frac=early?clamp((Date.now()-x.start)/(x.end-x.start),0,1)*.2:1;S.exp=null;S.last=Date.now();lastGKey='';
  const notes=[],items=[];
  let gain=Math.round(E.gain*frac*(1+skLv('sight')*.03+skLv('lore')*.04+perk('explore')));let prov=Math.round((E.prov+Math.floor(skLv('strength')/3)+Math.round(perk('prov'))+(S.nest.tier>=5?1:0))*frac);
  S.prov+=prov;
  const nI=early?(frac>.1&&Math.random()<.5?1:0):E.items+(Math.random()<skLv('speed')*.04?1:0);
  for(let i=0;i<nI;i++){const it=rollItem(null,x.k==='voyage'?1:0);giveItem(it);items.push(it)}
  const relic=addExplore(x.rid,gain,notes);if(relic)items.push(relic);
  addStars(Math.round(({scout:1,trek:3,voyage:6,grand:10})[x.k]*frac*(1+perk('stars'))));cnt('exp');stat('hunger',-20*Math.max(.3,frac));stat('rest',-15*Math.max(.3,frac));stat('joy',10);
  addBond(Math.round(3+E.gr*.4*frac));S.growth+=E.gr*frac;S.rides.exped=(S.rides.exped||0)+1;
  S.tr[pick(['bold','bold','mischief','gentle','fierce'])]+=.5*Math.max(.3,frac);
  // chance to meet a wild griffin at home region
  let met=null;
  if(!early&&x.k!=='scout'){WILD.forEach(w=>{if(w.home===x.rid&&!(S.wild[w.id]&&S.wild[w.id].met)&&Math.random()<.55&&stage()>=w.minSt&&rex(x.rid)>=w.minEx)met=w})}
  if(met){S.wild[met.id]=S.wild[met.id]||{fr:0,cd:{}};S.wild[met.id].met=true;journal(`${n} met ${met.n} in ${r.n}.`)}
  const vig=pick(r.vig).replace('{n}',n);
  const txt=early?`${n} comes home early, breathless and a little embarrassed, with only a small find.`:vig;
  journal(txt);
  const itemsHTML=items.map(it=>`<div class="row" style="margin:4px 0">${itemIcon(it,30)}<div class="grow"><b>${it.n}</b><small>${RARITY[it.r]}</small></div></div>`).join('');
  sfx(items.length?'gem':'chime');cry(false);
  showModal({title:early?'Home early':'Welcome back',html:`${realmHero(r,'Expedition report · '+r.n)}<p>${txt}</p>${prov?`<p style="color:var(--gold2)">+${prov} provisions</p>`:''}${gain?`<p class="note">${r.n} explored +${gain}%</p>`:''}${notes.map(t=>`<p style="color:var(--gold2)">${t}</p>`).join('')}${itemsHTML}${met?`${wildPortrait(met)}<p style="color:var(--gold2)"><b>${met.n}</b> was watching from the rocks. A wild griffin! You can visit it in the Sky tab, under Wild.</p>`:''}`,buttons:[{t:'Welcome home',cls:'gold'}]},true);
  save();renderAll()}
ACTS.recall=()=>{if(!S.exp||modalOpen)return;showModal({title:'Call it home?',html:`<p>${S.name} will turn back now and bring only a little of what it would have found.</p>`,buttons:[{t:'Call home',cls:'gold',fn:()=>{resolveExp(true)}},{t:'Let it fly on'}]})};
ACTS.region=el=>{selR=el.dataset.id;sfx('tick');renderPanel()};
ACTS.exped=el=>{startExp(el.dataset.id,el.dataset.k)};

/* wild griffins */
const WILD=[
 {id:'w_sorrel',n:'Sorrel',home:'pines',minSt:1,minEx:10,coat:4,stg:2,temper:'shy',desc:'A pale, gentle griffin who watches from the treetops. She is wary of anyone loud and drawn to anyone patient.',likes:{feed:1.4,play:1,spar:.4,gift:1.2},gift:'feather',line:['Sorrel tilts her head at you, then at the food, then at you.','Sorrel lets you stand a little closer than yesterday.','Sorrel makes a soft, bubbling sound. It might be a laugh.']},
 {id:'w_tempest',n:'Tempest',home:'storm',minSt:2,minEx:10,coat:2,stg:3,temper:'proud',desc:'An iron-grey duelist who lives where lightning lands. He respects strength and nothing else.',likes:{feed:.7,play:.8,spar:1.6,gift:.8},gift:'relic',line:['Tempest sneers, then circles. It is, apparently, interest.','Tempest strikes the air and looks at you. You are expected to do the same.','Tempest grunts. For him, that was a speech.']},
 {id:'w_pip',n:'Pip',home:'ridge',minSt:1,minEx:5,coat:1,stg:1,temper:'playful',desc:'A scrappy, bright young griffin who treats the whole ridge as a playground and every visitor as a toy.',likes:{feed:1,play:1.6,spar:.9,gift:1},gift:'relic',line:['Pip bounces off a rock, upside-down, and says hello.','Pip steals something small from you and presents it back as a gift.','Pip is going to be your friend whether you agree or not.']},
 {id:'w_marrow',n:'Marrow',home:'ruins',minSt:2,minEx:20,coat:3,stg:3,temper:'old',desc:'An ancient, scarred griffin who sits among the ruins and remembers every keeper. She says almost nothing.',likes:{feed:1.1,play:.5,spar:1.1,gift:1.5},gift:'relic',line:['Marrow looks at you for a long time. Then she looks at your griffin.','Marrow shifts, and makes room on the stone.','Marrow says, in a cracked old voice, nothing at all, and means it kindly.']},
 {id:'w_aurelia',n:'Aurelia',home:'sea',minSt:3,minEx:30,coat:5,stg:3,temper:'radiant',desc:'A golden griffin who lives above the clouds. Few have seen her. Fewer have been chosen by her.',likes:{feed:1,play:1.2,spar:1,gift:1.3},gift:'feather',line:['Aurelia descends out of the light, and everything goes quiet.','Aurelia dips a wing, a greeting from one monarch to another.','Aurelia sings a single long note. The clouds seem to listen.']}];
const WB=Object.fromEntries(WILD.map(w=>[w.id,w]));
const FR_TIERS=[[0,'Stranger'],[2,'Curious'],[4,'Friendly'],[6,'Companion'],[8,'Devoted'],[10,'Soulmate']];
const frTier=f=>{let t=0;FR_TIERS.forEach((x,i)=>{if(f>=x[0])t=i});return t};
const WCD={feed:10*60000,play:25*60000,spar:40*60000,gift:0};
function wildSVG(w){return griffinSVG({stage:w.stg,coat:w.coat,iris:IRIS.none,noNest:true,fold:0,eq:{},aura:false})}
function wildURL(w){return `assets/wild/${SPEC.id}/${w.id}.webp`}
function wildPortrait(w){return `<figure class="wild-portrait"><img src="${wildURL(w)}" alt="Portrait of ${w.n}" decoding="async"><figcaption>${w.n} · ${RB[w.home].n}</figcaption></figure>`}
let wildFeedback={id:null,text:'',until:0};
function pWild(){
  const known=WILD.filter(w=>S.wild[w.id]&&S.wild[w.id].met);
  if(selW&&!known.find(w=>w.id===selW))selW=null;
  if(!selW)return `<div class="wild-heading"><h3>Friends Among the Clouds</h3><span class="pill">${known.length}/${WILD.length} met</span></div><p class="note">Meet wild companions on longer expeditions (Treks or Voyages). Each has a favorite activity and a friendship to discover.</p><div class="wild-grid">${WILD.map(w=>{const d=S.wild[w.id],met=!!d?.met;return met?`<button type="button" class="wild-tile" data-act="wsel" data-id="${w.id}"><img src="${wildURL(w)}" alt="" loading="lazy" decoding="async"><span class="wild-info"><b>${w.n}</b><small>${FR_TIERS[frTier(d.fr)][1]} · ${RB[w.home].n}</small><span class="bar"><i style="width:${d.fr*10}%;background:var(--gold)"></i></span><small>${Math.floor(d.fr)}/10 friendship</small></span></button>`:`<div class="wild-tile wild-unknown"><div class="wild-mystery" style="background-image:linear-gradient(#10172c88,#10172ccc),url('${realmURL(w.home)}')"><span>?</span></div><span class="wild-info"><b>Undiscovered</b><small>${RB[w.home].n}</small><small>Meet on an expedition</small></span></div>`}).join('')}</div>`;
  const w=WB[selW],D=S.wild[w.id],f=D.fr,t=frTier(f);
  const cdl=k=>Math.max(0,(D.cd[k]||0)-Date.now());
  const btn=(k,label,sub)=>{const c=cdl(k);return`<button class="btn ${c?'dis':'gold'}" data-act="wact" data-k="${k}">${label}<br><small>${c?fdur(c)+' until again':sub}</small></button>`};
  let h=`<section class="wild-detail"><button class="btn sbtn" data-act="wback">‹ All wild companions</button>${wildPortrait(w)}<div class="wild-heading"><h3>${w.n}</h3><span class="pill">${FR_TIERS[t][1]}</span></div><div class="wild-actions">${btn('feed','Share food','1 provision')}${btn('play','Play','Sky games')}${btn('spar','Spar','Test of skill')}<button class="btn gold" data-act="wact" data-k="gift">Give a gift<br><small>A feather or relic</small></button></div><p class="wild-desc">${w.desc}</p><div class="wild-heading"><b>Friendship</b><small>${f.toFixed(1)}/10</small></div><div class="bar" role="progressbar" aria-label="Friendship" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${f}"><i style="width:${f*10}%;background:var(--joy)"></i></div><div class="wild-tiers">${FR_TIERS.map((tier,i)=>`<span class="${i<=t?'lit':''}">${tier[1]}</span>`).join('')}</div><p class="wild-dialogue" id="wild-response" aria-live="polite"></p><p class="note">Temperament: ${w.temper} · Favored gift: ${w.gift==='feather'?SPEC.id==='wyvern'?'scale':SPEC.id==='phoenix'?'ember':SPEC.id==='pegasus'||SPEC.id==='hippogriff'?'mane hair':'feather':'relic'}</p>`;
  h+=`<p class="note" style="margin-top:8px">${f>=6?`${w.n} is a Companion and may visit ${S.name}'s nest while you are away.`:`At Companion (6), ${w.n} will visit while you are away.`}</p>`;
  if(f>=8&&S.legend){const ok=canCourt(w);h+=`<button class="btn ${ok?'gold':'dis'}" style="width:100%;margin-top:6px" data-act="wcourt">Court ${w.n}<br><small>${ok?'Begin the courtship':courtWhy(w)}</small></button>`}
  else if(f>=8)h+=`<p class="note">When ${S.name} reaches the Legend stage, courtship becomes possible.</p>`;
  return h+'</section>'}
{const old=renderPanel;renderPanel=function(){old();const e=$('#wild-response');if(e&&selW){const w=WB[selW];e.textContent=wildFeedback.id===selW&&Date.now()<wildFeedback.until?wildFeedback.text:pick(w.line)}};}
{const old=say;say=function(t,ms=7000){old(t,ms);if(S&&tab==='sky'&&SUB.sky==='wild'&&selW&&(t.includes(WB[selW].n)||/too tired|asleep|provision to share/i.test(t))){wildFeedback={id:selW,text:t,until:Date.now()+Math.max(ms,18000)};const e=$('#wild-response');if(e)e.textContent=t;}};}
ACTS.wsel=el=>{if(!S.wild[el.dataset.id]?.met)return;selW=el.dataset.id;renderPanel();$('#panel').scrollTop=0};
ACTS.wback=()=>{selW=null;renderPanel();$('#panel').scrollTop=0};
function wildGain(w,k,mult){const D=S.wild[w.id];const before=D.fr;cnt('wild');D.fr=Math.min(10,D.fr+mult*w.likes[k]*(1+perk('friend')));
  const b=frTier(before),a=frTier(D.fr);
  if(a>b){journal(`${w.n} is now ${FR_TIERS[a][1]} to ${S.name}.`);toast(`${w.n}: ${FR_TIERS[a][1]}`);sfx('level');addStars(3)}
  if(D.fr>=8&&!D.gave){D.gave=true;const it=ITEM_BY_ID[w.id];giveItem(it);journal(`${w.n} gave ${S.name} ${it.n}.`);
    showModal({title:`A gift from ${w.n}`,html:`<div style="display:flex;justify-content:center">${itemIcon(it,56)}</div><p style="text-align:center"><b>${it.n}</b></p><p>${it.d}</p>`,buttons:[{t:'Treasure it',cls:'gold'}]},true)}
  save();renderPanel()}
ACTS.wact=el=>{if(modalOpen||training||S.exp||!selW)return;const w=WB[selW],D=S.wild[w.id],k=el.dataset.k;
  if(S.sleeping){say(`${S.name} is asleep.`);return}
  if(D.cd[k]&&D.cd[k]>Date.now())return;
  if(k==='feed'){if(S.prov<1){say('You need a provision to share.',3000);return}S.prov-=1;D.cd.feed=Date.now()+WCD.feed;sfx('munch');wildGain(w,'feed',.9);say(`${w.n} eats. ${S.name} pretends not to be jealous.`,5000)}
  else if(k==='play'){if(S.st.rest<15){say(`${S.name} is too tired to play.`);return}D.cd.play=Date.now()+WCD.play;stat('joy',12);stat('rest',-8);S.growth+=1;sfx('chirp');animG('bounce',600);wildGain(w,'play',1);say(`${S.name} and ${w.n} race along the cliffs.`,5000)}
  else if(k==='spar'){if(S.st.rest<25){say(`${S.name} is too tired to spar.`);return}D.cd.spar=Date.now()+WCD.spar;
    timingGame(`Spar with ${w.n}`,'A friendly bout. Tap <b>Strike</b> on the gold.',sum=>{stat('rest',-15);stat('hunger',-6);S.tr.fierce+=.4;addBond(1);wildGain(w,'spar',.4+sum*.7);say(sum>=2?`${w.n} bows her head. Respect.`:`${S.name} loses gracefully and is quietly delighted.`,6000)})}
  else if(k==='gift'){const list=ITEMS.filter(it=>(it.k==='feather'||it.k==='relic')&&S.hoard[it.id]&&freeCount(it.id)>0);
    const rows=list.map(it=>`<div class="row" data-g="${it.id}" style="margin:5px 0;cursor:pointer">${itemIcon(it,32)}<div class="grow"><b>${it.n}</b><small>${RARITY[it.r]}</small></div></div>`).join('')||'<p class="note">You have nothing free to give.</p>';
    showModal({title:`Gift for ${w.n}`,html:rows,buttons:[{t:'Never mind'}],onShow:m=>{$$('[data-g]',m).forEach(e=>e.onclick=()=>{const it=ITEM_BY_ID[e.dataset.g];
      S.hoard[it.id]--;if(!S.hoard[it.id])delete S.hoard[it.id];const liked=it.k===w.gift;closeModal(true);sfx('chime');wildGain(w,'gift',(liked?1.6:.6)+it.r*.5);say(liked?`${w.n} holds the ${it.n} close. It is exactly right.`:`${w.n} accepts the ${it.n} politely.`,6000)})}})}
  save();renderAll()};

/* courtship + next generation */
function canCourt(w){return S.legend&&!S.exp&&S.roster.length<3&&!S.roster.some(r=>r.phase==='egg')&&(S.wild[w.id].fr>=8)&&Date.now()-(S.wild[w.id].courted||0)>3*86400000}
function courtWhy(w){if(S.roster.length>=3)return'Your cliffs are full (4 griffins).';if(S.roster.some(r=>r.phase==='egg'))return'An egg is already waiting for you.';if(Date.now()-(S.wild[w.id].courted||0)<=3*86400000)return'Give it a few days.';return'Not yet'}
ACTS.wcourt=()=>{if(modalOpen||!selW)return;const w=WB[selW];if(!canCourt(w))return;const n=S.name;
  const steps=[
   {t:'The first meeting',h:`<p>${w.n} lands on the ledge beside ${n}. The two of them regard each other. The air is very still.</p><p>How does ${n} greet ${w.n}?</p>`,o:[['By bowing low, wings open.','gentle'],['By calling out, bold and clear.','bold'],['By offering a feather, the old way.','gentle']]},
   {t:'The dance',h:`<p>${w.n} spreads her wings. It is an invitation. The wind lifts under them both.</p><p>What does ${n} do?</p>`,o:[['Rises to meet her, wingtip to wingtip.','bold'],['Circles slowly, letting her lead.','gentle'],['Makes a daring spiral, showing its strength.','fierce']]},
   {t:'The promise',h:`<p>High above the valley, the two griffins fly side by side until the light goes. Below, the nest is waiting.</p><p>What does ${n} bring home?</p>`,o:[['A stone from the highest peak.','bold'],['Something soft for the nest.','gentle'],['A song, sung together.','mischief']]}];
  const picks=[];const run=i=>{if(i>=3){layEgg(w,picks);return}const s=steps[i];
    showModal({title:s.t,html:wildPortrait(w)+s.h,buttons:s.o.map(o=>({t:o[0],cls:'gold',fn:()=>{picks.push(o[1]);sfx('chime');setTimeout(()=>run(i+1),200);return true}}))})};
  run(0)};
function layEgg(w,picks){const n=S.name;S.wild[w.id].courted=Date.now();
  let coat;if(Math.random()<.14)coat=5;else coat=Math.random()<.5?S.coat:w.coat;
  const tr={bold:0,gentle:0,fierce:0,mischief:0};for(const t in tr)tr[t]=+(S.tr[t]*.3).toFixed(2);
  picks.forEach(p=>{tr[p]+=1.2});
  const sk={};for(const k in S.sk)sk[k]=Math.floor(S.sk[k]*.25);
  const egg=griffinDefaults({phase:'egg',hatch:0,coat,coatSet:true,tr,sk,gen:S.gen+1,parents:{a:n,b:w.n},born:Date.now(),bondXP:10,name:''});
  S.roster.push(JSON.parse(JSON.stringify(egg)));
  journal(`${n} and ${w.n} raised an egg${coat===5?' that gleams gold':''}.`);addBond(10);sfx('hatch');
  showModal({title:'An egg',html:`<div style="display:flex;justify-content:center">${eggSVGSmall(coat)}</div><p>Some days later, ${w.n} leaves a single egg in ${n}'s nest and flies back to the wild. Its shell is ${COATS[coat].n==='Sunforged'?'<b style="color:var(--gold2)">gold, and warm as a hearth</b>':'faintly the color of '+COATS[coat].n}.</p><p>Open the <b>Bond</b> tab and find it under <b>Family</b>. Tap <b>Tend</b> to begin warming it. The others will wait safely in the cliffs.</p>`,buttons:[{t:'Treasure it',cls:'gold'}]});
  save();renderAll()}
function eggSVGSmall(coat){const c=COATS[coat];return`<svg width="90" height="110" viewBox="0 0 90 110"><ellipse cx="45" cy="62" rx="30" ry="40" fill="${c.body}"/><ellipse cx="45" cy="62" rx="30" ry="40" fill="none" stroke="${c.tip}" stroke-width="3"/><ellipse cx="36" cy="46" rx="8" ry="13" fill="${c.belly}" opacity=".55"/><path d="M22,70 q10,8 20,0 t24,2" stroke="${c.tip}" stroke-width="2" fill="none" opacity=".6"/></svg>`}

/* Sky tab */
function pSky(){
  let h=seg('sky',[['map','Map'],['wild','Wild'],['ride','Ride']]);if((!SUB.sky||SUB.sky==='map')&&!S.exp)h+=`<div class="seg" style="margin-top:-2px"><button class="${zoneSel===1?'on':''}" data-act="zone" data-z="1">Homelands</button><button class="${zoneSel===2?'on':''}" data-act="zone" data-z="2">Far Reaches</button><button class=\"${zoneSel===3?'on':''}\" data-act=\"zone\" data-z=\"3\">The Beyond</button></div>`;
  if(SUB.sky==='wild')return h+pWild();
  if(SUB.sky==='ride')return h+pRide();
  if(S.exp)return h+awayCard();
  return h+mapSVG()+regionTextList()+regionCard()}
/* companion visits in away reports */
function companionVisits(out,hrs){
  WILD.forEach(w=>{const D=S.wild[w.id];if(!D||D.fr<6||hrs<.4||Math.random()>.35)return;
    const lines=[`${w.n} dropped by the nest and sat with ${S.name} for a while.`,`${w.n} left a small gift on the ledge and flew off before anyone could say thanks.`,`${w.n} and ${S.name} spent the afternoon trading cries across the valley.`];
    const e={text:pick(lines),items:[],prov:0};stat('joy',8);addBond(2);
    if(Math.random()<.5){const it=rollItem(null,0);giveItem(it);e.items.push(it)}else{S.prov+=2;e.prov=2}
    out.push(e)})}
ACTS.zone=el=>{zoneSel=+el.dataset.z;selR=null;sfx('tick');renderPanel()};


/* ============================ Ride the Sky ============================ */
let rideSel=null,rideRun=null,rideLong=false,rideLoading=false;
const RIDE_DEF=['#6f7fb8','#f2d9a0','#4e5a8c','#343a64','#2e3a2c'];
function rideUnlocked(){return lvl()>=7&&stage()>=2}
function rideWhy(){if(S.phase!=='alive')return'Hatch your companion first.';if(lvl()<7)return`Reach bond level 8 (${BOND[7].n}). It must trust you with its back.`;if(stage()<2)return`${S.name} must grow to a Juvenile before it can carry you.`;if(S.exp)return`${S.name} is away.`;if(S.sleeping)return`${S.name} is asleep.`;if(S.st.hunger<20)return`${S.name} is too hungry to fly with you.`;if(S.st.rest<20)return`${S.name} is too tired to fly with you.`;return''}
function pRide(){
  const open=REGIONS.filter(regionOpen);if(rideSel&&!open.find(r=>r.id===rideSel))rideSel=null;
  let h=`<h3>Ride the Sky</h3><p class="note" style="margin:0 0 8px">Climb on ${S.name}'s back and fly a long, wide run through the sky. Hold the screen to climb. Let go to dive. Gather golden rings and star-gems, and steer clear of storm clouds.</p>`;
  h+=`<div class="row"><div class="grow"><b>Your flights</b><small>${S.rides.n||0} flown · best score ${S.rides.best||0}</small></div></div>`;
  if(!rideUnlocked()||S.exp){return h+`<div class="row lock"><div class="grow"><b>Not yet</b><small>${rideWhy()}</small></div></div>`}
  h+=`<h3 style="margin-top:10px">Where to?</h3><div class="flight-destination">`+[{id:'',n:'Open sky'},...open].map(r=>`<button class="btn ${(rideSel||'')===r.id?'selected':''}" data-act="rideSel" data-id="${r.id}" aria-pressed="${(rideSel||'')===r.id}"><img src="${realmURL(r.id||'sea')}" alt="" loading="lazy"><span>${r.n}</span></button>`).join('')+`</div>`;
  h+=`<div class="seg" style="margin-top:10px"><button class="${rideLong?'':'on'}" data-act="rideLen" data-v="0">Short flight</button><button class="${rideLong?'on':''}" data-act="rideLen" data-v="1">Long flight</button></div>`;
  const why=rideWhy();
  h+=`<button class="btn ${why?'dis':'gold'}" style="width:100%;margin-top:10px" data-act="rideGo">Take flight<br><small>${why||(rideSel?'Flying over '+RB[rideSel].n+' (adds exploration)':rideLong?'About 90 seconds, bigger rewards':'About 40 seconds')}</small></button>`;
  h+=`<p class="note" style="margin-top:8px">Skills help: Flight saves energy, Speed flies faster, Sight spots more gems, Strength brings home more provisions. Your path and gear matter too.</p>`;
  return h}
ACTS.rideLen=el=>{rideLong=el.dataset.v==='1';renderPanel()};
ACTS.rideSel=el=>{rideSel=el.dataset.id||null;sfx('tick');renderPanel()};
ACTS.rideGo=()=>{if(modalOpen||training||rideRun||rideLoading)return;const why=rideWhy();if(why){say(why,4000);return}startRide()};

function rideSprite(fold,cb){return rideImg({stage:Math.max(2,stage()),coat:S.coat,iris:IRIS.none,noNest:true,fold,eq:S.eq,aura:false},cb)}
function rideImg(o,cb){const svg=griffinSVG(o).replace('<svg ','<svg width="320" height="300" ');
  const im=new Image();im.onload=()=>cb(im);im.onerror=()=>cb(null);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}

function startRide(){
  const cv=$('#rideCv'),ov=$('#ride'),ctx=cv.getContext('2d');
  const dpr=Math.min(2,window.devicePixelRatio||1);const W=window.innerWidth,H=window.innerHeight;cv.width=W*dpr;cv.height=H*dpr;
  const pal=(rideSel&&RB[rideSel].pal)||RIDE_DEF;
  const known=WILD.filter(w=>S.wild[w.id]&&S.wild[w.id].met);const rivalW=known.length&&(rideLong||Math.random()<.55)?pick(known):null;
  rideLoading=true;
  const sp={};let pending=2+(rivalW?1:0)+1+(rivalW?1:0)+1;
  const flightSet=(coat,cb)=>{const frames=[];let left=4;for(let i=0;i<4;i++){const img=new Image();img.onload=()=>{frames[i]=img;if(!--left)cb(frames.every(Boolean)?frames:null)};img.onerror=()=>{frames[i]=null;if(!--left)cb(null)};img.src=`assets/flight/${SPEC.id}-${coat}-${i}.webp`;}};
  flightSet(S.coat,frames=>{sp.flight=Object.values(S.eq||{}).some(Boolean)?null:frames;go()});if(rivalW)flightSet(rivalW.coat,frames=>{sp.rivalFlight=frames;go()});
  const go=()=>{if(--pending>0)return;rideLoading=false;begin()};
  const landscape=new Image();landscape.onload=()=>{sp.landscape=landscape;go()};landscape.onerror=()=>go();landscape.src=realmURL(rideSel||'sea');
  rideSprite(0,im=>{sp.up=im;go()});rideSprite(32,im=>{sp.dn=im;go()});if(rivalW)rideImg({stage:rivalW.stg,coat:rivalW.coat,iris:IRIS.none,noNest:true,fold:0,eq:{},aura:false},im=>{sp.rv=im;go()});
  function begin(){
    training=true;AU.mode='ride';ov.classList.add('on');$('#rideLocation').textContent=rideSel&&RB[rideSel]?RB[rideSel].n:'Open sky';$('#rideEnergy').textContent='Energy 100%';$('#rideG').textContent='0 rings · 0 gems';$('#rideTime').textContent=(rideLong?88:42)+'s';$('#rideHint').style.opacity=1;setTimeout(()=>{$('#rideHint').style.opacity=0},3500);
    const flight=skLv('flight'),speedL=skLv('speed'),sightL=skLv('sight');
    const dmgMul=(S.path==='storm'?.6:1)*(1-clamp(perk('shield'),0,.7))*(SPEC.id==='wyvern'?.8:1);const drain=2.1*(1-.035*flight-.02*skLv('grace'))*(S.path==='guardian'?.85:1)*(SPEC.id==='pegasus'?.85:1);
    const R={t:0,dur:rideLong?88:42,x:W*.28,y:H*.5,vy:0,hold:false,en:100,rings:0,gems:0,hits:0,dist:0,inv:0,obs:[],tk:[],next:0.8,sc:0,end:false,par:[],cl:[],hz:[],bolts:[],nextH:7,nextB:14,rv:rivalW?{w:rivalW,x:W*.7,y:H*.45,sc:0}:null,hawkHits:0,boltHits:0};
    const stormy=rideSel&&['storm','anvil','veil','spire'].includes(rideSel);
    for(let i=0;i<14;i++)R.cl.push({x:Math.random()*W,y:Math.random()*H*.6,s:.5+Math.random()*1.2,v:.15+Math.random()*.35});
    for(let i=0;i<26;i++)R.par.push({x:Math.random()*W,y:Math.random()*H,v:60+Math.random()*120,r:1+Math.random()*1.6});
    rideRun=R;
    const dn=e=>{R.hold=true;e.preventDefault&&e.preventDefault()},up=()=>{R.hold=false};
    cv.onpointerdown=dn;cv.onpointerup=up;cv.onpointercancel=up;cv.onpointerleave=up;
    const kd=e=>{if(e.code==='Space')R.hold=true},ku=e=>{if(e.code==='Space')R.hold=false};document.addEventListener('keydown',kd);document.addEventListener('keyup',ku);
    $('#rideQuit').onclick=()=>{R.end=true};
    const mkY=()=>H*.16+Math.random()*H*.62;
    function spawn(){const r=Math.random(),x=W+60;
      if(r<.36){const n=1+Math.floor(Math.random()*3),y=mkY(),big=40+Math.random()*30;for(let i=0;i<n;i++)R.obs.push({x:x+i*50,y:y+(Math.random()-.5)*60,r:big*(.7+Math.random()*.4)})}
      else if(r<.78){const y0=mkY(),n=4+Math.floor(Math.random()*3);for(let i=0;i<n;i++)R.tk.push({x:x+i*46,y:y0+Math.sin(i*.9)*34,k:'ring',got:false})}
      else{R.tk.push({x,y:mkY(),k:'gem',got:false});if(Math.random()<.2+sightL*.05)R.tk.push({x:x+70,y:mkY(),k:'gem',got:false})}
      R.next=R.t+.55+Math.random()*.7}
    let last=performance.now(),raf=0,scroll=0;
    function loop(now){raf=requestAnimationFrame(loop);let dt=Math.min(.05,(now-last)/1000);last=now;
      R.t+=dt;const spd=(200+speedL*9+R.t*2.2);scroll+=spd*dt;R.dist+=spd*dt;
      R.vy+=(R.hold?-1250:1000)*dt;R.vy=clamp(R.vy,-360,380);R.y+=R.vy*dt;
      if(R.y<46){R.y=46;R.vy=0}if(R.y>H-70){R.y=H-70;R.vy=-60;if(R.inv<=0){R.en-=6*dmgMul;R.inv=.8;sfx('hit')}}
      window.__R=R;R.inv=Math.max(0,R.inv-dt);R.en-=drain*dt;
      if(R.t>=R.next&&R.t<R.dur-4)spawn();
      R.obs.forEach(o=>o.x-=spd*dt);R.tk.forEach(o=>o.x-=spd*dt);R.obs=R.obs.filter(o=>o.x>-100);R.tk=R.tk.filter(o=>o.x>-40&&!o.got);
      const px=R.x,py=R.y;
      R.obs.forEach(o=>{if(R.inv<=0&&Math.hypot(o.x-px,o.y-py)<o.r*.72+22){R.en-=20*dmgMul;R.inv=1.3;R.hits++;sfx('hit');if(navigator.vibrate)try{navigator.vibrate(40)}catch(e){}}});
      R.tk.forEach(o=>{if(!o.got&&Math.hypot(o.x-px,o.y-py)<(o.k==='ring'?30:26)*(SPEC.id==='pegasus'?1.25:1)){o.got=true;if(o.k==='ring'){R.rings++;R.en=Math.min(100,R.en+5);R.sc+=10;sfx('ring')}else{R.gems++;R.en=Math.min(100,R.en+3);R.sc+=25;sfx('gem')}}});

      if(R.t>R.nextH&&R.t<R.dur-4){R.hz.push({x:W+50,y:mkY(),vy:0});R.nextH=R.t+3.2+Math.random()*3.2}
      if(R.t>(stormy?8:14)&&R.t>R.nextB&&R.t<R.dur-4){R.bolts.push({x:W*(.4+Math.random()*.5),t0:R.t});R.nextB=R.t+(stormy?4:7)+Math.random()*4}
      R.hz.forEach(h=>{h.x-=(spd+130)*dt;h.vy+=clamp((py-h.y)*.9,-60,60)*dt;h.vy=clamp(h.vy,-70,70);h.y+=h.vy*dt;h.fl=(h.fl||0)+dt*9;
        if(R.inv<=0&&Math.hypot(h.x-px,h.y-py)<30){R.en-=14*dmgMul;R.inv=.9;R.hawkHits++;h.x=-200;sfx('hit');if(navigator.vibrate)try{navigator.vibrate(30)}catch(e){}}});
      R.hz=R.hz.filter(h=>h.x>-80);
      R.bolts.forEach(b=>{const a=R.t-b.t0;b.on=a>1&&a<1.3;if(b.on&&!b.hit&&R.inv<=0&&Math.abs(px-b.x)<26){R.en-=24*dmgMul;R.inv=1.2;b.hit=true;R.boltHits++;sfx('hit');if(navigator.vibrate)try{navigator.vibrate(60)}catch(e){}}});
      R.bolts=R.bolts.filter(b=>R.t-b.t0<1.5);
      if(R.rv){const rv=R.rv;let best=null,bd=1e9;R.tk.forEach(o=>{if(!o.got&&o.x>rv.x-30&&o.x<W){const d=Math.abs(o.x-rv.x)*.4+Math.abs(o.y-rv.y);if(d<bd){bd=d;best=o}}});
        const ty=best?best.y:H*.45+Math.sin(R.t*.8)*H*.15;rv.y+=clamp(ty-rv.y,-120*dt,120*dt);rv.x=W*.68+Math.sin(R.t*.6)*W*.08;
        R.tk.forEach(o=>{if(!o.got&&Math.hypot(o.x-rv.x,o.y-rv.y)<30){o.got=true;rv.sc+=o.k==='ring'?1:2}})}
      R.cl.forEach(c=>{c.x-=(spd*c.v)*dt;if(c.x<-120){c.x=W+120;c.y=Math.random()*H*.6}});R.par.forEach(p=>{p.x-=p.v*dt;if(p.x<0){p.x=W;p.y=Math.random()*H}});
      // draw
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,pal[0]);g.addColorStop(.75,pal[1]);g.addColorStop(1,pal[1]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      if(sp.landscape){const bg=sp.landscape,scale=Math.max(W/bg.width,H/bg.height)*1.06,tw=bg.width*scale,th=bg.height*scale,off=newbornMotion.matches?0:scroll*.085,first=Math.floor(off/tw);for(let i=first;i<=first+Math.ceil(W/tw)+1;i++){const x=i*tw-off;ctx.save();ctx.translate(x+(i%2?tw:0),0);if(i%2)ctx.scale(-1,1);ctx.drawImage(bg,0,(H-th)*.5,tw+.6,th);ctx.restore()}const veil=ctx.createLinearGradient(0,0,0,H);veil.addColorStop(0,'rgba(9,20,52,.20)');veil.addColorStop(.5,'rgba(9,20,52,.27)');veil.addColorStop(1,'rgba(9,20,52,.43)');ctx.fillStyle=veil;ctx.fillRect(0,0,W,H);}
      if(!sp.landscape){
      ctx.fillStyle='rgba(255,246,220,.9)';ctx.beginPath();ctx.arc(W*.78,H*.2,26,0,7);ctx.fill();
      R.cl.forEach(c=>{ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.ellipse(c.x,c.y,60*c.s,16*c.s,0,0,7);ctx.ellipse(c.x+30*c.s,c.y-8*c.s,40*c.s,14*c.s,0,0,7);ctx.fill()});
      const mt=(off,amp,col,sp2,base)=>{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,H);for(let x=0;x<=W+10;x+=10){const u=(x+scroll*sp2)/140;ctx.lineTo(x,base-amp*(.5+.5*Math.sin(u+off))-amp*.4*Math.sin(u*2.3+off*2))}ctx.lineTo(W,H);ctx.fill()};
      mt(0,70,pal[2],.12,H*.82);mt(2,56,pal[3],.28,H*.9);
      ctx.fillStyle=pal[4];ctx.fillRect(0,H-26,W,26);}
      else { /* Soft foreground cloud layer; decorative only. */
        ctx.save();ctx.globalAlpha=.24;R.cl.forEach(c=>{const x=newbornMotion.matches?W*.15+c.s*60:c.x,y=H*.84+(c.y%Math.max(1,H*.14));const fog=ctx.createRadialGradient(x,y,0,x,y,100*c.s);fog.addColorStop(0,'#e9eaff');fog.addColorStop(1,'rgba(225,233,255,0)');ctx.fillStyle=fog;ctx.fillRect(x-100*c.s,y-100*c.s,200*c.s,200*c.s)});ctx.restore();
      }
      R.par.forEach(p=>{ctx.fillStyle='rgba(255,240,200,.35)';ctx.fillRect(p.x,p.y,p.r*3,p.r*.6)});
      R.obs.forEach(o=>{ctx.save();ctx.translate(o.x,o.y);const gg=ctx.createRadialGradient(-o.r*.15,-o.r*.2,1,0,0,o.r);gg.addColorStop(0,'#817b9e');gg.addColorStop(.5,'#3e3b5c');gg.addColorStop(1,'#151a36');ctx.fillStyle=gg;ctx.strokeStyle='#c7b5f0';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,o.r*.85,0,Math.PI*2);ctx.fill();ctx.stroke();for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ctx.beginPath();ctx.arc(Math.cos(a)*o.r*.53,Math.sin(a)*o.r*.47,o.r*.36,0,Math.PI*2);ctx.fill()}ctx.strokeStyle='#ffdf8a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(2,-o.r*.48);ctx.lineTo(-8,1);ctx.lineTo(5,1);ctx.lineTo(-2,o.r*.5);ctx.stroke();ctx.restore()});
      R.tk.forEach(o=>{ctx.save();ctx.translate(o.x,o.y);if(o.k==='ring'){ctx.shadowColor='#ffca49';ctx.shadowBlur=8;ctx.strokeStyle='#6f4315';ctx.lineWidth=8;ctx.beginPath();ctx.ellipse(0,0,10,22,0,0,7);ctx.stroke();const metal=ctx.createLinearGradient(-12,-22,12,22);metal.addColorStop(0,'#fffbd1');metal.addColorStop(.4,'#f5c453');metal.addColorStop(.7,'#a46315');metal.addColorStop(1,'#fff4b4');ctx.strokeStyle=metal;ctx.lineWidth=5;ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle='#fff2b8';ctx.lineWidth=1;ctx.stroke()}else{ctx.shadowColor='#8de8ff';ctx.shadowBlur=8;ctx.fillStyle='#c9f8ff';ctx.strokeStyle='#183d75';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-17);ctx.lineTo(13,-5);ctx.lineTo(9,10);ctx.lineTo(0,17);ctx.lineTo(-9,10);ctx.lineTo(-13,-5);ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#3daef2';ctx.beginPath();ctx.moveTo(0,-17);ctx.lineTo(9,10);ctx.lineTo(0,17);ctx.lineTo(-5,-3);ctx.closePath();ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-13,-5);ctx.lineTo(-5,-3);ctx.lineTo(13,-5);ctx.stroke()}ctx.restore()});
      R.hz.forEach(h=>{ctx.save();ctx.translate(h.x,h.y);ctx.fillStyle='#2a2440';ctx.beginPath();ctx.ellipse(0,0,13,7,0,0,7);ctx.fill();const w=Math.sin(h.fl)*12;ctx.beginPath();ctx.moveTo(-3,0);ctx.lineTo(-20,-14+w);ctx.lineTo(4,-3);ctx.lineTo(18,-14+w);ctx.lineTo(4,2);ctx.fill();ctx.fillStyle='#f2d58a';ctx.beginPath();ctx.arc(-12,-1,2,0,7);ctx.fill();ctx.restore()});
      R.bolts.forEach(b=>{const a=R.t-b.t0;if(a<1){ctx.strokeStyle=`rgba(255,240,180,${.15+.25*Math.abs(Math.sin(a*14))})`;ctx.lineWidth=2;ctx.setLineDash([6,8]);ctx.beginPath();ctx.moveTo(b.x,0);ctx.lineTo(b.x,H);ctx.stroke();ctx.setLineDash([])}
        else if(b.on){ctx.strokeStyle='#fff6c8';ctx.lineWidth=6;ctx.shadowColor='#f2d58a';ctx.shadowBlur=18;ctx.beginPath();ctx.moveTo(b.x,0);let yy=0;while(yy<H){yy+=34;ctx.lineTo(b.x+(Math.random()-.5)*26,yy)}ctx.stroke();ctx.shadowBlur=0}});
      if(R.rv&&(sp.rv||sp.rivalFlight)){const rf=sp.rivalFlight&&sp.rivalFlight[newbornMotion.matches?1:Math.floor(R.t*8+2)%4];if(rf)ctx.drawImage(rf,R.rv.x-60,R.rv.y-48,120,96);else ctx.drawImage(sp.rv,R.rv.x-52,R.rv.y-60,104,98);ctx.fillStyle='rgba(246,236,208,.85)';ctx.font=`${Math.round(12*textScale)}px Georgia`;ctx.textAlign='center';ctx.fillText(R.rv.w.n,R.rv.x,R.rv.y-62, W*.48)}
      if(!newbornMotion.matches){const trailCol={griffin:'#ffe0a0',hippogriff:'#f3d3a1',phoenix:'#ff9b42',pegasus:'#c9c4ff',wyvern:'#a4eaff'}[SPEC.id]||'#fff';ctx.save();for(let i=1;i<=8;i++){ctx.globalAlpha=.32*(1-i/9);ctx.fillStyle=trailCol;ctx.beginPath();ctx.arc(px-25-i*9,py+Math.sin(R.t*7+i*.72)*5-R.vy*i*.012,Math.max(1,4-i*.36),0,Math.PI*2);ctx.fill()}ctx.restore()}
      const im=(Math.floor(R.t*5)%2===0||R.hold)&&!(R.vy>180)?sp.up:sp.dn,sz=118,bob=newbornMotion.matches?0:Math.sin(R.t*7)*2;
      ctx.save();ctx.translate(px,py+bob);ctx.rotate(clamp(R.vy/900,-.4,.4));if(R.inv>0&&Math.floor(R.t*14)%2)ctx.globalAlpha=.45;
      const rate={griffin:8,hippogriff:9,phoenix:10,pegasus:8,wyvern:7}[SPEC.id]||8;
      const phase=newbornMotion.matches||(!R.hold&&R.vy>90)?1:Math.floor(R.t*rate)%4;
      const frame=sp.flight&&sp.flight[phase];
      if(frame){const fw=Math.min(W*.36,stage()>=4?166:stage()===3?152:140),fh=fw*frame.height/frame.width; if(stage()>=4){ctx.shadowColor='#ffdc8b';ctx.shadowBlur=10;}ctx.drawImage(frame,-fw*.5,-fh*.5,fw,fh);ctx.shadowBlur=0;}else if(im)ctx.drawImage(im,-sz*.55,-sz*.62,sz,sz*.94);else{ctx.fillStyle='#d9a22e';ctx.fillRect(-30,-12,60,24)}
      ctx.restore();
      // hud
      $('#rideRace').textContent=R.rv?`${R.rv.w.n} ${R.rv.sc} · You ${R.rings+R.gems*2}`:'';
      $('#rideE').style.width=clamp(R.en,0,100)+'%';$('#rideEnergy').textContent=`Energy ${Math.ceil(clamp(R.en,0,100))}%`;$('#rideG').textContent=`${R.rings} rings · ${R.gems} gems`;$('#rideTime').textContent=Math.ceil(Math.max(0,R.dur-R.t))+'s';
      if(R.en<=0&&SPEC.id==='phoenix'&&!R.reborn){R.reborn=1;R.en=55;R.inv=2.2;sfx('level');toast('Rebirth! It rises from the ash.')}if(R.en<=0||R.t>=R.dur)R.end=true;
      if(R.end){cancelAnimationFrame(raf);document.removeEventListener('keydown',kd);document.removeEventListener('keyup',ku);finishRide(R,ov)}}
    raf=requestAnimationFrame(loop)}}

function finishRide(R,ov){
  rideRun=null;ov.classList.remove('on');training=false;AU.mode='home';cv_off();
  const n=S.name,full=R.t>=R.dur-.1||R.en<=0;const sc=Math.round(R.sc+R.dist/20);
  S.rides.n=(S.rides.n||0)+1;if(R.rv)S.rides.races=(S.rides.races||0)+1;const newBest=sc>(S.rides.best||0);if(newBest)S.rides.best=sc;
  let prov=Math.floor(R.rings/3)+(R.gems>0?1:0)+Math.floor(skLv('strength')/4)+Math.round(perk('prov'));S.prov+=prov;
  const items=[];const nI=Math.min(3,Math.floor(R.gems/2)+(sc>400?1:0));
  for(let i=0;i<nI;i++){const it=rollItem(null,R.gems>=4&&i===0?1:0);giveItem(it);items.push(it)}
  const notes=[];let rivalTxt='';if(R.rv){const mine=R.rings+R.gems*2,w=R.rv.w;if(mine>R.rv.sc){S.rides.raceWins=(S.rides.raceWins||0)+1;addStars(Math.round(3*(1+perk('stars'))));S.wild[w.id].fr=Math.min(10,S.wild[w.id].fr+.5);if(Math.random()<.5){const it=rollItem(null,0);giveItem(it);items.push(it)}rivalTxt=`<p style="color:var(--gold2)">You beat ${w.n}! ${mine} to ${R.rv.sc}. (+3 Starlight, ${w.n} respects you more)</p>`;journal(`Raced ${w.n} and won.`)}else{rivalTxt=`<p>${w.n} won, ${R.rv.sc} to ${mine}. ${w.n} looks smug. Rematch?</p>`;S.wild[w.id].fr=Math.min(10,S.wild[w.id].fr+.2)}}
  let exg=0;if(rideSel&&RB[rideSel]&&regionOpen(RB[rideSel])){exg=Math.min(10,2+Math.floor(sc/70));addExplore(rideSel,exg,notes)}
  addStars(Math.round(Math.floor(sc/110)*(1+perk('stars'))));cnt('ride');stat('rest',-12);stat('hunger',-10);stat('joy',14);addBond(2+Math.min(4,Math.floor(sc/150)));S.growth+=2+Math.min(4,Math.floor(sc/200));S.tr[pick(['bold','bold','mischief','fierce'])]+=.4;S.tr.bold+=.2;
  journal(`Rode the sky with ${n}. Score ${sc}.`);sfx(newBest?'win':'chime');cry(sc>300);
  const itemsHTML=items.map(it=>`<div class="row" style="margin:4px 0">${itemIcon(it,30)}<div class="grow"><b>${it.n}</b><small>${RARITY[it.r]}</small></div></div>`).join('');
  const line=sc>500?`${n} lands, trembling with joy. You will remember that flight forever.`:sc>250?`${n} lands in a flurry of feathers, thrilled.`:`${n} lands softly and looks back at you, already wanting to go again.`;
  showModal({title:newBest&&sc>0?'A new best flight':'Landed',html:`<figure class="flight-report"><img class="flight-view" src="${realmURL(rideSel||'sea')}" alt="Flight landscape">${Object.values(S.eq||{}).some(Boolean)?'':`<img class="flight-companion" src="assets/flight/${SPEC.id}-${S.coat}-1.webp" alt="${SPEC.w} flying">`}<figcaption>${rideSel&&RB[rideSel]?RB[rideSel].n:'Open sky'} · Flight journal</figcaption></figure><p>${line}</p><p style="text-align:center;font-size:1.25rem;color:var(--gold2)">Score ${sc}</p><p class="note" style="text-align:center">${R.rings} rings · ${R.gems} gems · ${R.hits} cloud hits${R.hawkHits?` · ${R.hawkHits} hawk hits`:''}${R.boltHits?` · ${R.boltHits} lightning`:''}</p>${rivalTxt}${prov?`<p style="color:var(--gold2)">+${prov} provisions</p>`:''}${exg?`<p class="note">${RB[rideSel].n} explored +${exg}%</p>`:''}${notes.map(t=>`<p style="color:var(--gold2)">${t}</p>`).join('')}${itemsHTML}`,buttons:[{t:'Home',cls:'gold'}]},true);
  lastGKey='';save();renderAll();setTimeout(checkEvents,600)}
function cv_off(){const cv=$('#rideCv');cv.onpointerdown=cv.onpointerup=cv.onpointercancel=cv.onpointerleave=null}


/* ============================ share card + save code ============================ */
function svgToImg(svg,cb){const im=new Image();im.onload=()=>cb(im);im.onerror=()=>cb(null);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg.replace('<svg ','<svg width="640" height="600" '))}
function shareCard(){
  if(S.phase!=='alive'){toast('Hatch your companion first.');return}
  const st=stage();
  svgToImg(griffinSVG({stage:st,coat:S.coat,sleep:false,iris:IRIS[domTrait()||'none'],aura:st>=3,auraCol:S.path?PATHS[S.path].aura:'#f2d58a',eq:S.eq,nestTier:S.nest.tier,slots:S.nest.slots,banner:bannerCol()}),im=>{
    const W=1080,H=1350,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');
    const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1b2050');g.addColorStop(.55,'#8a4a3a');g.addColorStop(1,'#f0b866');c.fillStyle=g;c.fillRect(0,0,W,H);
    for(let i=0;i<90;i++){c.fillStyle=`rgba(255,244,214,${.15+Math.random()*.5})`;c.beginPath();c.arc(Math.random()*W,Math.random()*H*.55,Math.random()*2.2+.4,0,7);c.fill()}
    c.fillStyle='rgba(255,236,190,.9)';c.beginPath();c.arc(W*.8,200,70,0,7);c.fill();
    c.fillStyle='#2a2a52';c.beginPath();c.moveTo(0,H*.78);for(let x=0;x<=W;x+=20)c.lineTo(x,H*.78-60*Math.abs(Math.sin(x/170))-40*Math.sin(x/70));c.lineTo(W,H);c.lineTo(0,H);c.fill();
    c.strokeStyle='#e3b866';c.lineWidth=6;c.strokeRect(34,34,W-68,H-68);c.lineWidth=1.5;c.strokeRect(50,50,W-100,H-100);
    if(im)c.drawImage(im,W/2-400,262,800,750);
    c.textAlign='center';c.fillStyle='#f6ecd0';c.font='bold 84px Georgia,serif';c.fillText(S.name,W/2,170);
    c.fillStyle='#e3b866';c.font='italic 38px Georgia,serif';c.fillText(titleLine().replace(S.name,'').trim()||STAGES[st].n,W/2,232);
    c.fillStyle='rgba(18,20,50,.72)';c.fillRect(110,1020,W-220,230);c.strokeStyle='#e3b866';c.lineWidth=2;c.strokeRect(110,1020,W-220,230);
    const best=Object.keys(S.regions).reduce((a,k)=>a+Math.floor(S.regions[k].ex||0),0);
    const rows=[[STAGES[st].n+(S.gen>1?' · Gen '+S.gen:''),'Stage'],[BOND[lvl()].n,'Bond'],[Object.keys(S.hoard).length+'/'+ITEMS.length,'Treasures'],[best+'%','Explored (total)']];
    rows.forEach((r,i)=>{const x=110+(W-220)*(i+.5)/4;c.fillStyle='#f6ecd0';c.font='bold 40px Georgia,serif';c.fillText(r[0],x,1120);c.fillStyle='#e3b866';c.font='26px Georgia,serif';c.fillText(r[1],x,1160)});
    const days=Math.max(1,Math.floor((Date.now()-(S.since||Date.now()))/86400000)+1);
    c.fillStyle='#f6ecd0';c.font='italic 30px Georgia,serif';c.fillText(`Day ${days} together · Keeper ${S.keeper}`,W/2,1215);
    c.fillStyle='#fff2c0';c.font='28px Georgia,serif';c.fillText('EVERHATCH · '+SPEC.tag,W/2,1300);
    cv.toBlob(blob=>{
      if(!blob){toast('Could not make the card.');return}
      const file=new File([blob],`${S.name}-everhatch.png`,{type:'image/png'});
      if(navigator.canShare&&navigator.canShare({files:[file]})){navigator.share({files:[file],title:`${S.name} the ${SPEC.w}`,text:`Meet ${S.name}, my ${SPEC.w} in Everhatch: Raise Your Legend.`}).catch(()=>showCard(cv.toDataURL('image/png')))}
      else showCard(cv.toDataURL('image/png'))},'image/png')})}
function showCard(url){showModal({title:`${S.name}'s card`,html:`<img src="${url}" alt="Companion share card" style="width:100%;border-radius:10px;display:block"><p class="note" style="text-align:center">Press and hold the picture to save it, or use the download button.</p>`,
  buttons:[{t:'Download',cls:'gold',fn:()=>{const a=document.createElement('a');a.href=url;a.download=`${S.name}-everhatch.png`;document.body.appendChild(a);a.click();a.remove();return false}},{t:'Close'}]})}

function saveCode(){save();let code='';try{code=btoa(unescape(encodeURIComponent(localStorage.getItem(KEY)||JSON.stringify(S))))}catch(e){}
  showModal({title:'Save code',html:`<p class="note">This long code holds your whole game, every companion included. Keep it somewhere safe, or paste it on another device to continue there.</p><textarea id="scode" readonly style="width:100%;height:110px;background:#10143a;color:var(--ivory);border:1px solid var(--line);border-radius:8px;font-size:0.6875rem;padding:6px">${code}</textarea>`,
   buttons:[{t:'Copy code',cls:'gold',fn:m=>{const t=$('#scode',m);t.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}if(navigator.clipboard)navigator.clipboard.writeText(code).then(()=>toast('Copied')).catch(()=>{});else toast(ok?'Copied':'Select and copy the code');return false}},
    {t:'Load a code',fn:()=>{setTimeout(loadCode,80)}},{t:'Close'}]})}
function loadCode(){showModal({title:'Load a save code',html:`<p class="note">Paste a code below. <b>This replaces the game on this device.</b></p><textarea id="lcode" style="width:100%;height:110px;background:#10143a;color:var(--ivory);border:1px solid var(--line);border-radius:8px;font-size:0.6875rem;padding:6px"></textarea><p id="lerr" class="note" style="color:#e8826a"></p>`,
  buttons:[{t:'Load',cls:'gold',fn:m=>{try{const raw=decodeURIComponent(escape(atob($('#lcode',m).value.trim())));const o=JSON.parse(raw);if(!o||(o.v!==1&&o.v!==2))throw 0;const mo=migrate(o);localStorage.setItem(KEY,JSON.stringify(mo));S=null;location.reload()}catch(e){$('#lerr',m).textContent='That code did not work. Check that you copied all of it.';return false}}},{t:'Cancel'}]})}


/* ============================ v3: expansion content + systems ============================ */
/* ---- bond levels ---- */
BOND[7].u='It trusts you with its back. Unlocks Ride the Sky, once it is a Juvenile.';
BOND.push({n:'Wingmate',xp:1000,u:'It flies as your partner. The Far Reaches open to you.'},{n:'Hearthbound',xp:1350,u:'Home is wherever you are. Its care for you becomes quiet and certain.'},
 {n:'Storm-Kin',xp:1800,u:'It no longer fears the storm, because you are beside it.'},{n:'One Sky',xp:2400,u:'Two creatures, one sky. There is nothing more to prove.'});
/* ---- skills ---- */
Object.assign(SKILLS,{vigil:{n:'Vigil',t:'Night Watch',perk:'Shrugs off storm-cloud hits on rides',tr:'fierce'},
 song:{n:'Song',t:'Dawn Songs',perk:'Joy fades more slowly',tr:'gentle'},
 lore:{n:'Lore',t:'Map Study',perk:'Expeditions explore more of the land',tr:'gentle'},
 grace:{n:'Grace',t:'Glide Practice',perk:'Rides drain less energy',tr:'mischief'}});
function skFx(k){if(!S||!S.sk)return 0;const fe=festNow(new Date());const fb=fe?({bond:.08,stars:.1})[k]||0:0;const a=stage()>=4?({bond:.1,exped:.08,stars:.15,treasure:.03})[k]||0:0;return fb+a+(k==='joyd'?.012*skLv('song'):k==='shield'?.015*skLv('vigil'):k==='exped'?.006*skLv('lore'):0)}
/* ---- starlight and counters ---- */
function addStars(n){if(!n)return;S.stars=(S.stars||0)+n}
function cnt(k){S.cnt[k]=(S.cnt[k]||0)+1}
/* ---- boons ---- */
const BOONS=[
 {id:'b_tail',br:'Wing',n:'Tailwinds',d:'Expeditions return 3% sooner per rank.',max:5,base:4,fx:{exped:.03}},
 {id:'b_storm',br:'Wing',n:'Stormward',d:'Storm clouds hurt 5% less per rank.',max:5,base:5,fx:{shield:.05}},
 {id:'b_keen',br:'Wing',n:'Keen Eyes',d:'Rarer treasures, +2.5% per rank.',max:5,base:5,fx:{treasure:.025}},
 {id:'b_path',br:'Wing',n:'Pathfinder',d:'Expeditions explore 6% more per rank.',max:5,base:4,fx:{explore:.06}},
 {id:'b_mast',br:'Wing',n:'Sky Mastery',d:'Skills can rise 5 levels higher once Legend.',max:3,base:12,fx:{cap:5}},
 {id:'b_warm',br:'Heart',n:'Warm Hearth',d:'Bond grows 5% faster per rank.',max:5,base:4,fx:{bond:.05}},
 {id:'b_joy',br:'Heart',n:'Bright Spirit',d:'Joy fades 6% slower per rank.',max:4,base:4,fx:{joyd:.06}},
 {id:'b_hearty',br:'Heart',n:'Hearty Appetite',d:'Hunger fades 6% slower per rank.',max:4,base:4,fx:{hungerd:.06}},
 {id:'b_slumber',br:'Heart',n:'Deep Slumber',d:'Tiredness comes 6% slower per rank.',max:4,base:4,fx:{restd:.06}},
 {id:'b_tutor',br:'Heart',n:'Patient Teacher',d:'Training sometimes gives extra progress.',max:5,base:5,fx:{train:.08}},
 {id:'b_stock',br:'Aerie',n:'Well-Stocked',d:'+1 provision from every outing per rank.',max:4,base:8,fx:{prov:1}},
 {id:'b_star',br:'Aerie',n:'Starlit Hearth',d:'+12% Starlight from everything per rank.',max:5,base:6,fx:{stars:.12}},
 {id:'b_hand',br:'Aerie',n:'Gentle Hand',d:'Wild griffins warm to you 8% faster per rank.',max:5,base:5,fx:{friend:.08}},
 {id:'b_bless',br:'Aerie',n:'Keeper’s Blessing',d:'+2% bond gain and +2% treasure per rank.',max:5,base:7,fx:{bond:.02,treasure:.02}}];
const BOON_BY_ID=Object.fromEntries(BOONS.map(b=>[b.id,b]));
const boonRank=id=>(S&&S.boons&&S.boons[id])||0;
function boonFx(k){if(!S||!S.boons)return 0;let v=0;BOONS.forEach(b=>{const r=S.boons[b.id]||0;if(r&&b.fx[k])v+=b.fx[k]*r});return v}
const boonCost=b=>Math.round(b.base*(1+boonRank(b.id))*1.4);
function updateCaps(){SKILL_CAP[3]=25+boonFx('cap');SKILL_CAP[4]=40+boonFx('cap')}
ACTS.boon=el=>{const b=BOON_BY_ID[el.dataset.id];if(!b)return;const r=boonRank(b.id);if(r>=b.max)return;const c=boonCost(b);
  if((S.stars||0)<c){say('Not enough Starlight yet.',3000);return}S.stars-=c;S.boons[b.id]=r+1;updateCaps();sfx('craft');toast(`${b.n} ${r+1}/${b.max}`);journal(`A boon was kindled: ${b.n}.`);save();renderPanel()};
function pBoons(){let h=`<h3>Boons <span class="pill">★ ${S.stars||0} Starlight</span></h3><p class="note" style="margin:0 0 8px">Starlight is earned from expeditions, exploring, rides, friendships, deeds and daily tasks. Spend it here on permanent boons that last across every griffin in the family.</p>`;
  let br='';BOONS.forEach(b=>{if(b.br!==br){br=b.br;h+=`<h3 style="margin-top:10px">${br}</h3>`}const r=boonRank(b.id),full=r>=b.max,c=boonCost(b),ok=!full&&(S.stars||0)>=c;
    h+=`<div class="row loot-row">${medalIcon('boon',BOONS.indexOf(b))}<div class="grow"><b>${b.n}</b> <span class="pill">${r}/${b.max}</span><small>${b.d}</small></div><button class="btn sbtn ${full?'dis':ok?'gold':'dis'}" data-act="boon" data-id="${b.id}">${full?'Max':'★ '+c}</button></div>`});return h}
/* ---- deeds ---- */
const nWild=()=>WILD.filter(w=>S.wild[w.id]&&S.wild[w.id].met).length;
const nFr=n=>WILD.filter(w=>S.wild[w.id]&&S.wild[w.id].fr>=n).length;
const nReg=p=>REGIONS.filter(r=>rex(r.id)>=p).length;
const nHoard=()=>Object.keys(S.seen).length;
const sumBoons=()=>Object.values(S.boons||{}).reduce((a,b)=>a+b,0);
const nTricks=p=>TRICKS.filter(t=>(S.tricks[t.id]||0)>=p).length;
const DEEDS=[
 ['d_home','First Roost','Hatch a griffin.',()=>S.phase==='alive',3],
 ['d_fl','Fledged','Reach the Fledgling stage.',()=>stage()>=1,3],
 ['d_juv','Wings Fully Grown','Reach the Juvenile stage.',()=>stage()>=2,5],
 ['d_leg','A Legend Awake','Reach the Legend stage.',()=>stage()>=3,10],
 ['d_b4','Trusting Heart','Reach bond level 4.',()=>lvl()>=3,3],
 ['d_b8','Sky-Bound','Reach bond level 8.',()=>lvl()>=7,6],
 ['d_b12','One Sky','Reach the highest bond level.',()=>lvl()>=11,20],
 ['d_hoard10','Magpie','Collect 10 different treasures.',()=>nHoard()>=10,4],
 ['d_hoard30','Dragon’s Instinct','Collect 30 different treasures.',()=>nHoard()>=30,8],
 ['d_hoard60','Everything Shines','Collect 60 different treasures.',()=>nHoard()>=60,16],
 ['d_ex1','First Flight Out','Return from an expedition.',()=>(S.rides.exped||0)>=1,3],
 ['d_ex20','Wanderer','Return from 20 expeditions.',()=>(S.rides.exped||0)>=20,8],
 ['d_ex60','Born to Roam','Return from 60 expeditions.',()=>(S.rides.exped||0)>=60,16],
 ['d_r1','Cartographer','Fully explore a region.',()=>nReg(100)>=1,6],
 ['d_r4','Mapmaker','Fully explore 4 regions.',()=>nReg(100)>=4,12],
 ['d_r8','Master of the Sky','Fully explore 8 regions.',()=>nReg(100)>=8,20],
 ['d_r16','The Whole World','Fully explore every region.',()=>nReg(100)>=REGIONS.length,40],
 ['d_ride1','Wind in the Feathers','Ride the sky.',()=>(S.rides.n||0)>=1,3],
 ['d_ride25','Sky Rider','Ride the sky 25 times.',()=>(S.rides.n||0)>=25,10],
 ['d_score','Legendary Flight','Score 600 in a single ride.',()=>(S.rides.best||0)>=600,12],
 ['d_w1','A New Friend','Meet a wild griffin.',()=>nWild()>=1,3],
 ['d_w5','Friend of the Wild','Meet 5 wild griffins.',()=>nWild()>=5,8],
 ['d_w10','The Whole Flock','Meet every wild griffin.',()=>nWild()>=WILD.length,16],
 ['d_comp','Companions','Befriend 3 wild griffins to Companion.',()=>nFr(6)>=3,8],
 ['d_soul','Soulmate','Reach full friendship with a wild griffin.',()=>nFr(10)>=1,12],
 ['d_egg','A New Generation','Raise a griffin from an egg.',()=>S.gen>=2||S.roster.some(r=>r.gen>=2),10],
 ['d_sun','Sunforged','Hatch a Sunforged griffin.',()=>S.coat===5||S.roster.some(r=>r.coat===5),12],
 ['d_fam','A Full Aerie','Have 3 or more companions in the family.',()=>S.roster.length>=2,10],
 ['d_t3','Trick Student','Reach 50% in 3 tricks.',()=>nTricks(50)>=3,5],
 ['d_t12','Showstopper','Master every trick.',()=>nTricks(100)>=TRICKS.filter(t=>!t.sp||t.sp===SPEC.id).length,20],
 ['d_nest3','Home Improvement','Grow the nest to the Grand Aerie.',()=>S.nest.tier>=3,8],
 ['d_nest5','Heavenly','Grow the nest to its final form.',()=>S.nest.tier>=5,20],
 ['d_gear','Well Dressed','Craft 6 pieces of gear.',()=>Object.keys(S.gear).length>=6,8],
 ['d_gear2','Dressed to Rule','Craft 16 pieces of gear.',()=>Object.keys(S.gear).length>=16,16],
 ['d_boon','Kindling','Kindle 10 boon ranks.',()=>sumBoons()>=10,6],
 ['d_boon2','Constellation','Kindle 40 boon ranks.',()=>sumBoons()>=40,20],
 ['d_streak','Faithful','Visit three days in a row.',()=>S.streak>=3,5],
 ['d_race','Rival Rider','Win a race against a wild griffin.',()=>(S.rides.races||0)>=1&&(S.rides.raceWins||0)>=1,8],
 ['d_fest','Festival Keeper','Take part in 3 seasonal festivals.',()=>Object.keys(S.cnt).filter(k=>k.startsWith('f_')).length>=3,12]];
function checkDeeds(){if(!S||S.phase==='egg')return;if(S.phase==='alive'&&stage()>=4&&!S.done.ascended&&!modalOpen&&!training&&!titleUp)ascendEvent();let got=0;DEEDS.forEach(d=>{if(!S.ach[d[0]]&&d[3]()){S.ach[d[0]]=1;const st=Math.round(d[4]*(1+perk('stars')));addStars(st);got++;journal(`Deed: ${d[1]}.`);setTimeout(()=>toast(`Deed: ${d[1]}  +${st} ★`),600)}});if(got){sfx('level');save()}}
function pDeeds(){const n=DEEDS.filter(d=>S.ach[d[0]]).length;let h=`<h3>Deeds <span class="pill">${n}/${DEEDS.length}</span></h3>`;
  DEEDS.forEach(d=>{const g=S.ach[d[0]];h+=`<div class="row loot-row ${g?'':'lock'}">${medalIcon('deed',DEEDS.indexOf(d),!g)}<div class="grow"><b>${g?'✓ ':''}${d[1]}</b><small>${d[2]}</small></div><span class="pill">★ ${d[4]}</span></div>`});return h}
/* ---- daily bounties ---- */
const BPOOL=[['feed','Feed your griffin',3],['feed','Feed your griffin',5],['preen','Preen its feathers',2],['train','Finish a training session',2],['train','Finish training sessions',4],['tp','Practice a trick',2],['exp','Return from an expedition',1],['exp','Return from expeditions',3],['ride','Ride the sky',1],['wild','Spend time with a wild griffin',2],['wild','Spend time with wild griffins',4]];
function bountyDay(){if(!S||S.phase==='egg')return;const day=new Date().toDateString();if(S.bounty.day===day)return;
  S.bounty={day,base:Object.assign({},S.cnt),claimed:{},list:[]};let seed=0;for(const c of day)seed=(seed*31+c.charCodeAt(0))>>>0;const used={};
  for(let i=0;i<3;i++){let j,g=0;do{seed=(seed*1103515245+12345)>>>0;j=seed%BPOOL.length;g++}while(used[BPOOL[j][0]]&&g<20);used[BPOOL[j][0]]=1;S.bounty.list.push(j)}save()}
const bprog=i=>{const b=BPOOL[S.bounty.list[i]];return Math.max(0,(S.cnt[b[0]]||0)-(S.bounty.base[b[0]]||0))};
ACTS.claim=el=>{const i=+el.dataset.i,b=BPOOL[S.bounty.list[i]];if(S.bounty.claimed[i]||bprog(i)<b[2])return;S.bounty.claimed[i]=1;const st=Math.round(3*(1+perk('stars')));addStars(st);S.prov+=2;sfx('gem');
  if(S.bounty.list.every((_,k)=>S.bounty.claimed[k])){addStars(6);toast('All three done! +6 ★ bonus')}else toast(`+${st} ★ and 2 provisions`);save();renderAll()};
function pDaily(){bountyDay();const fe=festNow(new Date());if(!S.bounty.list||!S.bounty.list.length)return'<p class="note">Come back once the egg has hatched.</p>';let h=(fe?`<div class="row"><div class="grow"><b>${fe.n} is here</b><small>${fe.d} (+8% bond and +10% Starlight while it lasts)</small></div></div>`:'')+`<h3>Today’s Tasks</h3><p class="note" style="margin:0 0 8px">Three small tasks that refresh every day. Each pays Starlight and provisions.</p>`;
  S.bounty.list.forEach((j,i)=>{const b=BPOOL[j],p=Math.min(b[2],bprog(i)),done=S.bounty.claimed[i],can=!done&&p>=b[2];
    h+=`<div class="row"><div class="grow"><b>${b[1]}</b> <span class="pill">${p}/${b[2]}</span><div class="bar" style="margin-top:5px"><i style="width:${p/b[2]*100}%;background:var(--gold)"></i></div></div><button class="btn sbtn ${done?'dis':can?'gold':'dis'}" data-act="claim" data-i="${i}">${done?'Done':can?'Claim':'...'}</button></div>`});
  return h+`<p class="note">Streak: ${S.streak||0} day${S.streak===1?'':'s'} of visits.</p>`}
function pStory2(){if(SUB.story==='lore')return pLore();if(SUB.story==='record')return pRecord();return seg('story',[['journal','Journal'],['lore','Lore'],['record','Record'],['boons','Boons'],['deeds','Deeds'],['daily','Daily']])+(SUB.story==='boons'?pBoons():SUB.story==='deeds'?pDeeds():SUB.story==='daily'?pDaily():pStory())}
/* ---- far regions ---- */
const FAR=[
 {id:'dunes',zone:2,n:'Gilded Dunes',x:60,y:275,req:{st:3,lvl:8,prev:['sea',50]},relic:'x_dunes',pal:['#d9a55a','#fbe3a8','#b98040','#8a5a2c','#c9a060'],
  d:'An ocean of sand the color of old gold. The heat shimmers, and the sky above it is enormous.',
  lm:[['The Singing Dune','The whole hill hums when the wind crosses it. Your griffin hums back.'],['The Buried Colossus','A stone griffin’s head, half-swallowed by sand, still keeping watch.'],['The Mirage Oasis','Water that is only there when you are not looking. A real spring hides behind it.']],
  vig:['{n} skimmed the dunes so low its talons left a line in the sand.','{n} found shade under the stone head and refused to leave.','{n} chased a mirage for an hour and was not even a little embarrassed.','{n} returned gold-dusted, thrilled, and very, very warm.']},
 {id:'canopy',zone:2,n:'The Canopy',x:140,y:235,req:{st:3,lvl:8,prev:['pines',100]},relic:'x_canopy',pal:['#5f8a4a','#f0e3a0','#3f6a3a','#2c4a2a','#2a3a22'],
  d:'A forest seen from above: a green sea of crowns, loud with birds and thick with fruit.',
  lm:[['The Hanging Gardens','Orchids as wide as shields, gripping branches a hundred feet up.'],['The Parrot Parliament','A thousand birds shout at your griffin all at once. It shouts back.'],['The Heartwood Throne','One tree towers over the rest. In its crown, an old nest, still tidy.']],
  vig:['{n} weaved between the crowns and came back with a leaf stuck on its head.','{n} stole a fruit from a branch and ate it with great ceremony.','{n} listened to the forest for a long, still hour.','{n} returned smelling of rain and flowers.']},
 {id:'mire',zone:2,n:'The Mistmire',x:225,y:290,req:{st:3,lvl:9,prev:['dunes',30]},relic:'x_mire',pal:['#8a8a6a','#d9d2a8','#5f604a','#3f4030','#3a3a2a'],
  d:'A marsh under a roof of fog. Lights bob among the reeds that are definitely not lanterns.',
  lm:[['The Reed Maze','A thousand tall reeds. Your griffin rises above them and watches them sway.'],['The Drowned Bell','An old bell under the water. It rings, once, when you pass.'],['The Lantern Fen','The lights gather around your griffin. They seem friendly.']],
  vig:['{n} followed a light through the fog and came out somewhere new.','{n} stood in the mist, wings open, drinking it in.','{n} found a stone with a face and stared at it until it blinked.','{n} came home damp and mysterious.']},
 {id:'anvil',zone:2,n:'Anvil Heights',x:65,y:170,req:{st:3,lvl:9,prev:['storm',100]},relic:'x_anvil',pal:['#7a5a52','#f0b070','#52403a','#33282a','#5a4036'],
  d:'Mountains ringing with hammers. The smiths here shape iron with thunderlight.',
  lm:[['The Great Forge','A furnace the size of a hall, still burning after a thousand years.'],['The Hammer Stair','Ten thousand steps cut into the cliff. Your griffin takes none of them.'],['The Cooling Pool','Hot iron plunged in steam. The smiths leave your griffin an offering.']],
  vig:['{n} perched above the forge and watched the sparks rise like stars.','{n} was offered a warm bit of metal and carried it home proudly.','{n} sang back at the hammers, in rhythm.','{n} returned with a cinder-bright eye.']},
 {id:'isles',zone:2,n:'The Wandering Isles',x:165,y:120,req:{st:3,lvl:10,prev:['canopy',50]},relic:'x_isles',pal:['#a8b8d8','#fff0c8','#7e90b8','#586890','#8fb070'],
  d:'Islands that drift on the wind, trailing waterfalls that fall forever into cloud.',
  lm:[['The Waterfall That Falls Up','A river that climbs into the sky. Your griffin dives through it.'],['The Moss Cathedral','A whole island grown into a temple. Pillars of root, a roof of leaf.'],['The Floating Library','Books, drifting. Nobody ever finishes them.']],
  vig:['{n} hopped from island to island, never touching the ground.','{n} found a floating nest and rearranged it.','{n} chased a drifting waterfall and caught it.','{n} came home with a crown of cloud.']},
 {id:'veil',zone:2,n:'The Veilfall',x:260,y:170,req:{st:3,lvl:10,prev:['spire',100]},relic:'x_veil',pal:['#2a3068','#c9a060','#3a4a88','#222c5a','#e8d8a0'],
  d:'Curtains of light hang from the dark. The sky here is always in the middle of a story.',
  lm:[['The Lightfall','A ribbon of gold light that falls to the snow and does not melt.'],['The Silent Plain','Ice so wide the stars are reflected in it. Your griffin walks on them.'],['The Winter Throne','Ice shaped like a seat. Something ancient sat here. It left a feather.']],
  vig:['{n} flew through the light and came out glowing.','{n} watched the curtains move for hours and said nothing.','{n} danced across the frozen stars.','{n} returned with frost on its wings and a faraway look.']},
 {id:'titan',zone:2,n:'The Titan’s Rest',x:270,y:255,req:{st:3,lvl:11,prev:['ruins',100]},relic:'x_titan',pal:['#8a7a68','#f0dcb0','#6a5a4a','#463a30','#4a3c2e'],
  d:'The skeleton of something enormous, lying across the land, with forests growing between its ribs.',
  lm:[['The Rib Hall','Ribs like arches of a cathedral. Birds nest in the high bones.'],['The Skull Lake','Rainwater fills the eye. A griffin could bathe in it.'],['The Last Breath','A cave in the chest where the wind still moves as if something sleeps.']],
  vig:['{n} landed on a rib and looked at the sky like a king.','{n} drank from the skull lake and shook out its feathers.','{n} found something old and shiny in the bones.','{n} came home quiet, humbled, and fed.']},
 {id:'first',zone:2,n:'The First Aerie',x:190,y:45,req:{st:3,lvl:11,prev:['isles',60]},relic:'x_first',pal:['#f2c870','#fff6dc','#e0a850','#b87a3a','#f0d890'],
  d:'The place where the first griffin ever hatched. Everything here is gold and quiet. It feels like coming home.',
  lm:[['The Egg Stone','A great stone, shaped like an egg, warm to the touch.'],['The Feather Hall','Every griffin who ever lived left one feather here. Your griffin leaves its own.'],['The Sunrise Seat','From the oldest nest, the dawn comes up gold. Your griffin watches it with you.']],
  vig:['{n} stood in the first nest, perfectly still.','{n} looked at the carvings of every griffin who came before.','{n} sang one long note, and the hall sang it back.','{n} came home glowing from the inside.']}];
FAR.forEach(r=>REGIONS.push(r));Object.assign(RB,Object.fromEntries(FAR.map(r=>[r.id,r])));
LINKS.push(['dunes','mire'],['dunes','canopy'],['canopy','isles'],['anvil','canopy'],['isles','first'],['veil','isles'],['mire','titan'],['veil','titan']);
EXPED.grand={n:'Grand Voyage',dur:12*3600000,cost:8,gain:80,items:4,prov:12,gr:18,far:true,d:'A great journey, about 12 hours.'};
/* ---- items ---- */
ITEMS.push(
 {id:'x_dunes',n:'Sunstone of the Dunes',k:'region',r:2,sh:'glass',c:'#f0b45a',d:'A grain of desert glass, warm all night.'},
 {id:'x_canopy',n:'Parliament Plume',k:'region',r:2,sh:'acorn',c:'#7fae5a',d:'A feather in every shade of green. The birds gave it up reluctantly.'},
 {id:'x_mire',n:'Drowned Bell-Clapper',k:'region',r:2,sh:'bell',c:'#7a7a5a',d:'It rings with a sound like water.'},
 {id:'x_anvil',n:'Thunder-Forged Nail',k:'region',r:2,sh:'stone',c:'#8a6a5a',d:'A single nail hammered under thunderlight. It will never rust.'},
 {id:'x_isles',n:'Cloudroot Seed',k:'region',r:2,sh:'acorn',c:'#bcd0a0',d:'A seed from a floating tree. It rises if you let go.'},
 {id:'x_veil',n:'Bottled Aurora',k:'region',r:2,sh:'glass',c:'#e8c878',d:'A little ribbon of light, folded in glass. It moves.'},
 {id:'x_titan',n:'Titan’s Tooth',k:'region',r:2,sh:'stone',c:'#e0d4b8',d:'Enormous, smooth, and surprisingly light.'},
 {id:'x_first',n:'Egg of the First Aerie',k:'region',r:3,sh:'glass',c:'#f6dc8a',d:'A golden stone shaped like an egg. It is faintly warm, and sometimes it hums.'},
 {id:'w_saffron',n:'Saffron’s Spice-Feather',k:'wild',r:2,c:'#e0a23a',d:'It smells of cinnamon and far places.'},
 {id:'w_bramble',n:'Bramble’s Leaf-Plume',k:'wild',r:2,c:'#6a9a4a',d:'Green at the root, gold at the tip. Bramble pressed it into your hand.'},
 {id:'w_murk',n:'Murk’s Mist-Feather',k:'wild',r:2,c:'#9a9a7a',d:'Damp, grey, and faintly luminous.'},
 {id:'w_ingot',n:'Ingot’s Iron Pinion',k:'wild',r:2,c:'#8a7068',d:'Forged, not molted. Ingot is very proud of this.'},
 {id:'w_halcyon',n:'Halcyon’s Dawn-Plume',k:'wild',r:3,c:'#f2d58a',d:'Gold fading to blue-black. It is the exact color of the minute before sunrise.'},
 {id:'c_1',n:'Smooth River Stone',k:'relic',r:0,sh:'stone',c:'#a8a090',d:'Worn perfectly round. Your griffin likes to hold it.'},
 {id:'c_2',n:'Brass Weathervane',k:'relic',r:0,sh:'disc',c:'#c9a35a',d:'It points at your griffin, no matter which way the wind is blowing.'},
 {id:'c_3',n:'Lantern of Moths',k:'relic',r:1,sh:'bell',c:'#f2d58a',d:'A little glass lamp. The moths inside are only memories of moths.'},
 {id:'c_4',n:'Cracked Compass',k:'relic',r:1,sh:'disc',c:'#b0803a',d:'It points at home.'},
 {id:'c_5',n:'Pressed Skyflower',k:'relic',r:0,sh:'acorn',c:'#d9a0a0',d:'A bloom that grows only at altitude.'},
 {id:'c_6',n:'Hunter’s Horn',k:'relic',r:1,sh:'bell',c:'#d9c9a0',d:'A horn that gives one low note. Your griffin answers it.'},
 {id:'c_7',n:'Golden Thimble',k:'relic',r:1,sh:'glass',c:'#f0c85a',d:'Tiny, perfect, and very shiny.'},
 {id:'c_8',n:'Old Keeper’s Spectacles',k:'relic',r:2,sh:'glass',c:'#c9b080',d:'They show you things as they were.'},
 {id:'c_9',n:'Storm-Eye Marble',k:'relic',r:2,sh:'glass',c:'#8a90b8',d:'A small storm, held perfectly still.'},
 {id:'c_10',n:'Silver Egg-Cup',k:'relic',r:1,sh:'disc',c:'#d0d4e0',d:'A small cup for a very small egg. Or a very small treasure.'},
 {id:'c_11',n:'Painted Wind-Chime',k:'relic',r:1,sh:'bell',c:'#d9783f',d:'Seven clay bells, each in a different color.'},
 {id:'c_12',n:'Compass of Gold Wire',k:'relic',r:2,sh:'disc',c:'#f2c75c',d:'It points at whatever you most need.'});
Object.assign(ITEM_BY_ID,Object.fromEntries(ITEMS.map(i=>[i.id,i])));
/* ---- wild griffins ---- */
WILD.push(
 {id:'w_saffron',n:'Saffron',home:'dunes',minSt:3,minEx:10,coat:0,stg:3,temper:'wise',desc:'A trader among griffins. She carries gifts between the far places and expects fair trade.',likes:{feed:1.1,play:.8,spar:.7,gift:1.7},gift:'relic',line:['Saffron looks at your gift as if appraising it. She smiles.','Saffron tells you a short story. It is almost a lie.','Saffron lets you stand in her shade.']},
 {id:'w_bramble',n:'Bramble',home:'canopy',minSt:3,minEx:10,coat:4,stg:2,temper:'shy',desc:'A small, nimble griffin of the treetops, quick to hide and quick to laugh.',likes:{feed:1.2,play:1.5,spar:.6,gift:1},gift:'feather',line:['Bramble peeks from behind a branch, then vanishes, then peeks again.','Bramble drops a fruit on your griffin’s head. It is affection.','Bramble giggles, in the way griffins do.']},
 {id:'w_murk',n:'Murk',home:'mire',minSt:3,minEx:10,coat:1,stg:3,temper:'odd',desc:'A strange, grey griffin of the fog. It speaks mostly in silences and in the glow of the swamp lights.',likes:{feed:.9,play:.7,spar:.9,gift:1.3},gift:'relic',line:['Murk appears out of the fog, then isn’t there.','Murk blinks slowly. It might mean something.','Murk lets your griffin lean on its shoulder.']},
 {id:'w_ingot',n:'Ingot',home:'anvil',minSt:3,minEx:10,coat:2,stg:3,temper:'proud',desc:'A broad, scarred smith-griffin who has been struck by lightning six times and is very proud of every one.',likes:{feed:1,play:.7,spar:1.6,gift:1},gift:'relic',line:['Ingot raps a talon on the anvil. It sounds like approval.','Ingot shows you a scar and tells you its story in full.','Ingot grins, slow and iron-toothed.']},
 {id:'w_halcyon',n:'Halcyon',home:'veil',minSt:3,minEx:20,coat:5,stg:3,temper:'radiant',desc:'A night-colored griffin who dances in the curtain of light. They say she is the oldest in the north.',likes:{feed:1,play:1.3,spar:.9,gift:1.3},gift:'feather',line:['Halcyon dances, and the light follows.','Halcyon is quiet, and for once the quiet is warm.','Halcyon calls, once. Every star seems to turn.']});
Object.assign(WB,Object.fromEntries(WILD.map(w=>[w.id,w])));
/* ---- gear ---- */
const GR=(id,slot,n,st,col,gem,reqs,perk,d)=>({id,slot,n,st,col,gem,reqs,perk,d});
GEAR.push(
 GR('g_suncol','neck','Sun-Thread Collar','cord','#e8c068','#fff4d2',[{id:'x_dunes',n:1},{prov:12}],{stars:.08},'+8% Starlight'),
 GR('g_vine','neck','Living Vine Collar','cord','#5f8a4a','#d9c78a',[{id:'x_canopy',n:1},{prov:10}],{hungerd:.12},'Hunger fades 12% slower'),
 GR('g_pend','neck','Sea-Glass Pendant','chain','#9db4d8','#f4ead2',[{id:'x_coast',n:1},{prov:12}],{friend:.12},'Wild friends warm 12% faster'),
 GR('g_frost','head','Frost Diadem','circlet','#c9d8f2','#ffffff',[{id:'x_spire',n:1},{prov:15}],{restd:.12},'Tiredness comes 12% slower'),
 GR('g_stormc','head','Stormcaller Crest','crest','#6e7aa8','#f2d58a',[{id:'x_storm',n:1},{prov:15}],{shield:.1},'Storm clouds hurt 10% less'),
 GR('g_firstc','head','Crown of the First Aerie','crown','#f6dc8a','#ffffff',[{id:'x_first',n:1},{prov:40}],{bond:.1,stars:.1},'+10% bond, +10% Starlight'),
 GR('g_iron','wing','Anvil-Forged Bracer','band','#7a5a52','#f0b070',[{id:'x_anvil',n:1},{prov:15}],{train:.2},'Training gives +1 often'),
 GR('g_dawn','wing','Dawnwing Band','band','#f2c75c','#fff4d2',[{id:'x_sea',n:1},{prov:15}],{exped:.08},'Outings return 8% sooner'),
 GR('g_veilc','wing','Veilweave Cuff','band','#3a4a88','#f2d58a',[{id:'x_veil',n:1},{prov:18}],{explore:.1},'Explores 10% more'),
 GR('g_titan','talon','Titan-Bone Ring','ring','#d9cdb0','#fff4d2',[{id:'x_titan',n:1},{prov:20}],{prov:1},'+1 provision per outing'),
 GR('g_cloud','talon','Cloudstone Anklet','ring','#a8b8d8','#f4ead2',[{id:'x_isles',n:1},{prov:16}],{joyd:.1,hungerd:.06},'Joy and hunger fade slower'),
 GR('g_heart','talon','Heartstone Talon Cap','ring','#c9553d','#f2c75c',[{id:'x_ember',n:1},{prov:15}],{bond:.08},'+8% bond gains'));
Object.assign(GEAR_BY_ID,Object.fromEntries(GEAR.map(g=>[g.id,g])));
/* ---- tricks ---- */
TRICKS.push(
 {id:'spin',n:'Spiral Dive',aff:'bold',req:{st:2,lvl:6},d:'A corkscrew dive that ends in a perfect landing.',anim:'t-spiral',ms:2700,sfx:'whoosh',rw:'growth'},
 {id:'sing',n:'Song of Dawn',aff:'gentle',req:{st:2,lvl:6},d:'A long, clear note that makes the morning arrive.',anim:'t-sing',ms:3500,sfx:'chime',rw:'stars'},
 {id:'guard',n:'Sentinel Stance',aff:'fierce',req:{st:2,lvl:7},d:'Wings wide, eyes on the horizon. Nothing gets past.',anim:'t-guard',ms:3100,sfx:'hit',rw:'bond'},
 {id:'loop',n:'Loop the Loop',aff:'mischief',req:{st:3,lvl:8},d:'Three loops, then pretends it meant two.',anim:'t-loop',ms:2900,sfx:'whoosh',rw:'prov'},
 {id:'salute',n:'Skyward Salute',aff:'gentle',req:{st:3,lvl:8},d:'A slow, deep bow to the sun.',anim:'t-salute',ms:2700,sfx:'chime',rw:'stars'},
 {id:'thunder',n:'Thunderclap',aff:'fierce',req:{st:3,lvl:9},d:'A beat of the wings that cracks like a storm.',anim:'t-thunder',ms:1900,sfx:'hit',rw:'item'});
Object.assign(TRICK_BY_ID,Object.fromEntries(TRICKS.map(t=>[t.id,t])));
/* ---- nest tiers ---- */
TIERS.push({n:'Sky Citadel',cost:160,slots:7,perk:'Expeditions return 10% sooner. A golden halo and spires.'},{n:'Heavenly Aerie',cost:320,slots:8,perk:'Every outing brings +1 provision. A starlit canopy.'});
/* ---- events ---- */
const EV=(id,when,title,text,opts)=>EVENTS.push({id,when,title,text,opts:opts.map(o=>({t:o[0],fx:o[1],r:()=>o[2]}))});
const wf=(id,n)=>()=>S.wild[id]&&S.wild[id].fr>=n;
EV('ev_firstride',()=>S.rides.n>=1&&stage()>=2,'After the First Flight',n=>`${n} lands, and for a moment does not fold its wings. It is looking at you the way you look at the sky.`,
 [['Rest your hand on its neck',{bond:5,traits:{gentle:1}},'It leans into your palm. Something passes between you that does not need a name.'],['Laugh, and tell it to go again',{bond:4,traits:{bold:1.5},joy:8},'It launches before you have finished the sentence.']]);
EV('ev_pip',wf('w_pip',3),'Pip’s Dare',n=>`Pip drops a feather in front of ${n}, then hops back, eyes bright. It is a dare. It is definitely a dare.`,
 [['Let ${n} accept'.replace('${n}','it'),{traits:{mischief:2},joy:8,bond:3},'The two of them tear off across the ridge in a scream of laughter and flapping.'],['Calm them both down',{traits:{gentle:1.5},bond:4},'Pip looks put out, then flops down next to your griffin. They watch the clouds together.']]);
EV('ev_marrow',wf('w_marrow',4),'Marrow’s Tale',n=>`Old Marrow shifts on her stone and, for the first time, speaks. She tells ${n} about the last keeper, and the long wait afterward.`,
 [['Listen to the end',{traits:{gentle:2},bond:6},'She falls silent. ${n} presses against her side, and she lets it.'.replace('${n}','Your griffin')],['Promise not to leave',{traits:{bold:1},bond:8},'Marrow says nothing, but she watches you for a long time, and she looks a little less alone.']]);
EV('ev_lostfl',()=>stage()>=2&&(S.rides.exped||0)>=3,'The Lost Fledgling',n=>`${n} returns with a tiny, shivering griffin chick riding on its back. It will not say where it found it.`,
 [['Feed it, then let it go home',{traits:{gentle:2},bond:5,prov:-1},'The chick eats. In the morning it is gone, but a tiny feather has been left on the ledge.'],['Keep it warm for the night',{traits:{gentle:1},bond:7,joy:6},'It sleeps curled in the nest beside your griffin, who does not move all night.']]);
EV('ev_winter',()=>stage()>=2&&lvl()>=3,'The Hungry Winter',n=>`Snow comes early. ${n} stands at the edge of the nest, watching the white world, and then looks at you.`,
 [['Share your own provisions',{bond:6,prov:-2,traits:{gentle:1.5}},'It eats slowly, never taking its eyes off you.'],['Teach it to hunt in the snow',{bond:4,traits:{fierce:1.5,bold:1},growth:6},'The first catch is clumsy. The second is not.']]);
EV('ev_moon',()=>stage()>=1&&lvl()>=6,'Moonrise on the Ledge',n=>`The moon rises huge and gold. ${n} lifts its head and starts, very softly, to sing.`,
 [['Sing along, badly',{traits:{mischief:1.5},bond:6,joy:10},'It stops, looks at you, and sings louder, to drown you out.'],['Sit quietly beside it',{traits:{gentle:2},bond:6},'You sit until the moon is high and small and white.']]);
EV('ev_doubt',()=>lvl()>=8,'A Keeper’s Doubt',n=>`You wonder if you are doing right by ${n}. It nudges your hand, as if it had heard you wonder.`,
 [['Tell it everything',{bond:8,traits:{gentle:1}},'It listens the way only a griffin can: with its whole body.'],['Take it flying',{bond:7,joy:10,traits:{bold:1.5}},'No answer comes, and none was needed.']]);
EV('ev_mark',()=>(S.rides.best||0)>=200,'The Sky-Rider’s Mark',n=>`After a long flight, you find that ${n} has left a deep scratch on the ledge in the shape of a wing.`,
 [['Add your own mark beside it',{bond:5,traits:{bold:1.5}},'Two marks, side by side. They look like a pair.'],['Leave it as it is',{bond:4,traits:{gentle:1}},'It will stay there forever.']]);
EV('ev_dunes',()=>rex('dunes')>=25,'Dunes at Dusk',n=>`${n} sits on the crest of a dune as the sun goes down, watching the whole sky turn gold.`,
 [['Watch with it',{bond:6,traits:{gentle:1.5}},'The sand cools. The stars come out one by one.'],['Race the shadows home',{bond:5,traits:{bold:1.5},joy:8},'It wins by a wingspan.']]);
EV('ev_titan',()=>rex('titan')>=25,'The Titan’s Song',n=>`In the Titan’s ribs, the wind plays a long, low note. ${n} answers it, and for a moment the whole land seems to sing.`,
 [['Let it sing',{bond:7,traits:{bold:1,gentle:1}},'The echo lasts longer than it should.'],['Sing with it',{bond:8,joy:10,traits:{mischief:1}},'The bones hum back.']]);
EV('ev_tempest',wf('w_tempest',5),'Tempest’s Challenge',n=>`Tempest lands hard on the ledge. He does not speak. He opens his wings and waits.`,
 [['Let ${n} accept'.replace('${n}','it'),{traits:{fierce:2},bond:4,growth:6},'It is over quickly. Tempest bows, once, stiffly.'],['Decline politely',{traits:{gentle:1.5},bond:3},'Tempest tilts his head. He has not been refused before. He seems to find it interesting.']]);
EV('ev_longnight',()=>stage()>=3&&lvl()>=10,'The Long Night',n=>`The longest night of the year. ${n} will not sleep. It sits watching the stars with you, wing against your shoulder.`,
 [['Stay up with it',{bond:10,traits:{gentle:2}},'The sky turns slowly. By dawn, you both smell of frost and woodsmoke.'],['Tell it the stories you know',{bond:8,traits:{gentle:1,mischief:1}},'It does not understand a word. It falls asleep to every one.']]);
/* ---- hooks ---- */
updateCaps();


/* ============================ stage 5: Ascendant + The Beyond ============================ */
STAGES.push({n:'Ascendant',g:2400});
SP.push({s:.98,hs:.98,wl:132,wn:14,fl:false,crest:3});
CHAPTERS.push('The Ascendant');
CHAPTER_TXT.push('Past legend, past myth. Your griffin has become something the old stories only hint at: calm, radiant, and utterly at home in the sky. What remains is to see how far it can go.');
SKILL_CAP.push(40);updateCaps();
function ascCoat(c){return Object.assign({},c,{tip:'#e8c068',wing:lightenHex(c.wing,.22),head:lightenHex(c.head,.12)})}
function lightenHex(h,a){const n=parseInt(h.slice(1),16),f=v=>Math.round(v+(255-v)*a);return'#'+[f(n>>16&255),f(n>>8&255),f(n&255)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function ascendSVG(){let m='';for(let i=0;i<14;i++){const a=i/14*6.2832,r=130+(i%3)*14;m+=`<circle cx="${(165+Math.cos(a)*r).toFixed(1)}" cy="${(150+Math.sin(a)*r*.82).toFixed(1)}" r="${(1.6+(i%3)*.7).toFixed(1)}" fill="#fff2c0"><animate attributeName="opacity" values=".2;1;.2" dur="${2.4+i*.17}s" repeatCount="indefinite"/></circle>`}
  return`<g><g><circle cx="165" cy="150" r="148" fill="none" stroke="#f2d58a" stroke-opacity=".35" stroke-width="1.5" stroke-dasharray="3 9"/><circle cx="165" cy="150" r="128" fill="none" stroke="#fff2c0" stroke-opacity=".22" stroke-width="1"/><animateTransform attributeName="transform" type="rotate" from="0 165 150" to="360 165 150" dur="90s" repeatCount="indefinite"/></g>${m}<circle cx="238" cy="100" r="36" fill="none" stroke="#f6dc8a" stroke-width="2.4" opacity=".75"/><circle cx="238" cy="100" r="42" fill="none" stroke="#fff2c0" stroke-width="1" opacity=".45"/></g>`}
ITEMS.push({id:'l_ascend',n:'Heart of the Sky',k:'legend',r:3,c:'#fff2c0',d:'A feather that is also a small, quiet sun. It appeared the moment your griffin ascended.'});
Object.assign(ITEM_BY_ID,{l_ascend:ITEMS[ITEMS.length-1]});
function ascendEvent(){if(S.done.ascended)return;S.done.ascended=1;giveItem(ITEM_BY_ID.l_ascend);addStars(25);const n=S.name;journal(`${n} ascended. The sky itself took notice.`);sfx('win');cry(true);
  showModal({title:'Ascendant',html:`<p>It is not a sound or a light. It is the sky making room.</p><p>${n} rises from the ledge without a flap, wings wide and still, and the air around it thickens and glows. When it settles, the ledge is warm, and ${n} looks at you with eyes that have seen the first dawn.</p><p style="color:var(--gold2)">${n} is now <b>Ascendant</b>. A new place waits beyond the First Aerie: The Beyond. Gift: <b>Heart of the Sky</b>, +25 Starlight. Permanent bonus: more bond, faster outings, more Starlight.</p>`,buttons:[{t:'Rise',cls:'gold'}]},true)}
/* ---- the beyond ---- */
const BEY=[
 {id:'starroad',zone:3,n:'The Star Road',x:190,y:285,req:{st:4,lvl:11,prev:['first',50]},relic:'x_starroad',pal:['#1d2250','#c9a060','#2a3068','#161a40','#e8d8a0'],
  d:'A road of light across the dark, paved with fallen stars. Griffins who ascend are said to walk it first.',
  lm:[['The First Milestone','A pillar of pale fire, marking the first star. Your griffin rests a wing on it.'],['The Comet Ford','A river of ice and light. Your griffin wades in and sparks fly from its feathers.'],['The Lantern Bridge','A span of ten thousand lanterns, each one a griffin that flew before.']],
  vig:['{n} followed the road a little way and came back with starlight in its feathers.','{n} sat at a milestone and watched a comet pass beneath.','{n} flew until the world was a lamp far below, then turned for home.','{n} returned quiet and shining.']},
 {id:'moon',zone:3,n:'The Moonlit Highlands',x:90,y:215,req:{st:4,lvl:11,prev:['starroad',40]},relic:'x_moon',pal:['#3a4070','#e8e0c8','#5a6090','#2c3258','#c8c0a8'],
  d:'Silver peaks under a moon that never sets. Shadows here are long, kind, and slightly alive.',
  lm:[['The Silver Pass','A road of pale stone, and a wind that sounds like a lullaby.'],['The Moon Pool','A mirror-still lake holding two moons. Your griffin cannot tell which is real.'],['The Sleeping Giants','Mountains that breathe. Slowly. Your griffin tiptoes.']],
  vig:['{n} flew through the moonlight and its shadow flew beside it, a perfect twin.','{n} dipped a wingtip in the Moon Pool and made the sky ripple.','{n} sang to the sleeping mountains. One of them murmured back.','{n} came home hushed and silvered.']},
 {id:'gate',zone:3,n:'The Dawn Gate',x:235,y:175,req:{st:4,lvl:11,prev:['moon',60]},relic:'x_gate',pal:['#e89860','#fff0c8','#d07848','#a05a3a','#f2d8a0'],
  d:'A gate of golden stone at the edge of everything. Every sunrise in the world begins here.',
  lm:[['The Waking Stones','Pillars that hum a note a moment before the sun appears.'],['The Gatekeeper’s Seat','A throne built for a griffin. It is exactly your griffin’s size.'],['The First Ray','The very first light of morning, caught in a bowl of stone. Still warm.']],
  vig:['{n} watched the sun rise through the gate and did not blink.','{n} perched on the keystone and called the morning in.','{n} basked in the first ray until its feathers glowed.','{n} came home gilded from beak to tail.']},
 {id:'heart',zone:3,n:'The Heart of the Sky',x:160,y:70,req:{st:4,lvl:11,prev:['gate',70]},relic:'x_heart',pal:['#f6dc8a','#fffbe8','#f2c870','#d9a24a','#fff2c0'],
  d:'The still center of the sky, where the wind stops to listen. Nobody has ever described it correctly.',
  lm:[['The Quiet','A silence so complete that you can hear your own heartbeat, and your griffin’s.'],['The Mirror Sky','Above and below are the same. Your griffin flies upside-down for fun.'],['The Heartbeat','A slow pulse in the light, once a minute, like a great animal asleep.']],
  vig:['{n} hung in the stillness and was, for a moment, completely at peace.','{n} listened to the sky’s heartbeat and matched its own to it.','{n} flew in a perfect circle, once, and the world turned with it.','{n} came home as if from a long, bright dream.']}];
BEY.forEach(r=>REGIONS.push(r));Object.assign(RB,Object.fromEntries(BEY.map(r=>[r.id,r])));
LINKS.push(['starroad','moon'],['moon','gate'],['gate','heart'],['starroad','gate']);
ITEMS.push({id:'x_starroad',n:'Fallen Star',k:'region',r:2,sh:'glass',c:'#f2d58a',d:'A real star, small enough to hold. It is warm, and it hums.'},
 {id:'x_moon',n:'Moon-Pool Pearl',k:'region',r:2,sh:'glass',c:'#e8e0c8',d:'A pearl that holds a little moon inside it.'},
 {id:'x_gate',n:'First Ray in a Bowl',k:'region',r:2,sh:'bell',c:'#f2b073',d:'A handful of the very first light of morning. It never cools.'},
 {id:'x_heart',n:'Heart of the Sky Gem',k:'region',r:3,sh:'glass',c:'#fff2c0',d:'It beats, slowly, in time with something very far away.'},
 {id:'w_solenne',n:'Solenne’s Dawnplume',k:'wild',r:3,c:'#f6dc8a',d:'A feather from the one who keeps the gate. It is the color of the first morning.'});
Object.assign(ITEM_BY_ID,Object.fromEntries(ITEMS.map(i=>[i.id,i])));
WILD.push({id:'w_solenne',n:'Solenne',home:'gate',minSt:4,minEx:10,coat:5,stg:4,temper:'radiant',desc:'The keeper of the Dawn Gate. She is as old as the first morning, and as gentle. She has waited a long time for another like her.',likes:{feed:1,play:1.2,spar:1,gift:1.4},gift:'feather',line:['Solenne bows her head, slowly, with all the weight of the dawn behind it.','Solenne hums a single note. The gate hums it back.','Solenne rests her wing across your griffin’s shoulders, and says nothing at all.']});
Object.assign(WB,Object.fromEntries(WILD.map(w=>[w.id,w])));
GEAR.push(GR('g_halo','head','Halo of the Heart','circlet','#f6dc8a','#fffbe8',[{id:'x_heart',n:1},{prov:60}],{bond:.1,stars:.1},'+10% bond, +10% Starlight'),
 GR('g_starn','neck','Starroad Chain','chain','#f2d58a','#fff2c0',[{id:'x_starroad',n:1},{prov:40}],{stars:.1,treasure:.03},'+10% Starlight, rarer treasures'),
 GR('g_moonw','wing','Moonlit Band','band','#c8c0a8','#e8e0c8',[{id:'x_moon',n:1},{prov:40}],{shield:.08,restd:.08},'Hardier in flight, rests longer'),
 GR('g_dawnt','talon','Dawn-Gate Ring','ring','#f2b073','#fff0c8',[{id:'x_gate',n:1},{prov:40}],{exped:.06,prov:1},'Faster outings, +1 provision'));
Object.assign(GEAR_BY_ID,Object.fromEntries(GEAR.map(g=>[g.id,g])));
TRICKS.push({id:'ascend',n:'Rising Light',aff:'bold',req:{st:4,lvl:11},d:'Rises from the ground without a wingbeat, in a column of gold.',anim:'t-rise',ms:4100,sfx:'level',rw:'item'},
 {id:'starfall',n:'Starfall Dive',aff:'mischief',req:{st:4,lvl:11},d:'A dive that leaves a trail of sparks all the way down.',anim:'t-starfall',ms:2500,sfx:'gem',rw:'stars'},
 {id:'dawnsong',n:'Dawnsong',aff:'gentle',req:{st:4,lvl:11},d:'A song that makes the sky a little lighter.',anim:'t-dawnsong',ms:3900,sfx:'chime',rw:'stars'});
Object.assign(TRICK_BY_ID,Object.fromEntries(TRICKS.map(t=>[t.id,t])));
EV('ev_gate',()=>rex('gate')>=25,'The Gatekeeper',n=>`At the Dawn Gate, Solenne meets ${n} without a word, and the two stand together while the sun rises.`,
 [['Stay and watch with them',{bond:10,traits:{gentle:2}},'The light is on your faces for a long time.'],['Let them fly together',{bond:8,traits:{bold:1.5},joy:10},'You watch two gold shapes cross the sunrise, and you feel it in your chest.']]);
EV('ev_heartsky',()=>rex('heart')>=50,'The Sky’s Heartbeat',n=>`In the stillness, ${n} turns to look at you. It is not asking for anything. It is simply glad you are here.`,
 [['Tell it you are glad too',{bond:12,traits:{gentle:2}},'The sky pulses, once, as if it had heard.'],['Just breathe with it',{bond:10,traits:{gentle:1,bold:1}},'Two hearts, and one quiet sky.']]);
DEEDS.push(['d_asc','Ascendant','Help your griffin ascend beyond Legend.',()=>stage()>=4||S.roster.some(r=>stageOf(r.growth)>=4),30],
 ['d_bey','Beyond the Sky','Fully explore all four regions of The Beyond.',()=>['starroad','moon','gate','heart'].every(id=>rex(id)>=100),40],
 ['d_sol','Keeper of Dawn','Reach full friendship with Solenne.',()=>S.wild.w_solenne&&S.wild.w_solenne.fr>=10,25]);
BOONS.push({id:'b_asc',br:'Aerie',n:'Ascendant’s Grace',d:'+1% bond and +1% Starlight per rank.',max:10,base:16,fx:{bond:.01,stars:.01}});
Object.assign(BOON_BY_ID,Object.fromEntries(BOONS.map(b=>[b.id,b])));

function asCrown(c){let s='';for(let i=0;i<7;i++){const a=-78+i*13;s+=`<path d="${featherPath(236,84,36+(i%2?0:8),5.5)}" transform="rotate(${a} 236 84)" fill="${i%2?'#f6dc8a':c.head}" stroke="#e8c068" stroke-opacity=".7"/>`}return s}
function asMantle(c){let s='';for(let i=0;i<9;i++){const a=70+i*16;s+=`<path d="${featherPath(212,128,28+(i%3)*5,5)}" transform="rotate(${a} 212 128)" fill="${i%2?c.head:'#f6dc8a'}" stroke="#e8c068" stroke-opacity=".5"/>`}return s}
function asPlume(c){let s='';for(let i=0;i<6;i++){const a=-120-i*17;s+=`<path d="${featherPath(34,222,62+(i%2)*14,6)}" transform="rotate(${a} 34 222)" fill="${i%2?'#f6dc8a':c.wing2}" stroke="#e8c068" stroke-opacity=".6"/>`}return s}


/* ============================ seasonal festivals ============================ */
const FESTS=[
 {id:'spring',n:'Spring Awakening',a:[3,20],b:[4,10],d:'The thaw has come, and every cliff is covered in wildflowers.',
  title:'The Thaw',text:n=>`The snow gives way all at once. ${n} sits in a drift of new flowers, sneezing, delighted.`,
  o:[['Weave a flower crown for it',{bond:6,traits:{gentle:1.5}},'fe_spring','It wears the crown with enormous dignity, and then promptly sneezes it off.'],['Chase the thaw-streams together',{bond:5,traits:{bold:1,mischief:1},joy:10},'fe_spring2','You both come back soaked, muddy, and very happy.']]},
 {id:'midsummer',n:'Midsummer',a:[6,18],b:[7,8],d:'The longest days of the year. The sky never quite goes dark.',
  title:'The Longest Day',text:n=>`The sun hangs low and gold for hours. ${n} refuses to sleep, and watches the light slowly move across the peaks.`,
  o:[['Stay up and watch the sun with it',{bond:6,traits:{gentle:1.5}},'fe_sun','You are both asleep before it sets, side by side.'],['Race the fireflies at dusk',{bond:5,traits:{bold:1.5},joy:10},'fe_sun2','It catches one, looks at it carefully, and lets it go.']]},
 {id:'harvest',n:'Harvest Moon',a:[9,20],b:[10,20],d:'A huge golden moon rises each night, and the whole valley smells of bread.',
  title:'The Harvest Moon',text:n=>`The moon rises enormous and orange. ${n} stares at it with its whole body, as if it might be edible.`,
  o:[['Share a warm loaf under the moon',{bond:6,traits:{gentle:1.5},prov:-1},'fe_harv','It takes the crust, politely, and leaves you the crumbs.'],['Fly up toward it',{bond:5,traits:{bold:1.5},joy:8},'fe_harv2','The moon does not get closer. Neither of you minds.']]},
 {id:'thanks',n:'Feast of Thanks',a:[11,15],b:[11,30],d:'A quiet season of gratitude, long evenings, and shared food.',
  title:'A Table by the Fire',text:n=>`You set out a small feast on the ledge. ${n} sits across from you and looks at the food, and then at you, in a way that needs no translation.`,
  o:[['Say what you are thankful for',{bond:8,traits:{gentle:2}},'fe_thanks','It listens to all of it, and rests its chin on your arm.'],['Feed it the best bite first',{bond:6,joy:10},'fe_thanks2','It eats, and gives you a look of pure, profound love.']]},
 {id:'frost',n:'Frostfall',a:[12,15],b:[1,5],d:'The longest nights. Lanterns on every ledge, and snow that glows blue-gold in the dark.',
  title:'The Long Night’s Lanterns',text:n=>`Lanterns have been lit all along the cliffs. ${n} sits in the light of one, watching the snow fall past it.`,
  o:[['Light one for the griffins who came before',{bond:7,traits:{gentle:2}},'fe_frost','Its feathers glow in the lantern light. It does not look away.'],['Carry a lantern and fly with it',{bond:6,traits:{bold:1.5},joy:10},'fe_frost2','Two lights crossing the dark, slow as stars.']]}];
ITEMS.push(
 {id:'fe_spring',n:'Flower Crown',k:'fest',r:2,sh:'acorn',c:'#e0a080',d:'Woven by hand, worn for one afternoon, kept forever.'},
 {id:'fe_spring2',n:'Thaw-Stream Pebble',k:'fest',r:2,sh:'stone',c:'#a8b0a0',d:'Smooth, cold, and polished by the first meltwater of the year.'},
 {id:'fe_sun',n:'Midsummer Garland',k:'fest',r:2,sh:'acorn',c:'#d9c060',d:'Gold flowers and long grass, tied at the longest day.'},
 {id:'fe_sun2',n:'Firefly Lantern',k:'fest',r:2,sh:'bell',c:'#f2e090',d:'A little jar of summer evening. The light is only slightly alive.'},
 {id:'fe_harv',n:'Harvest Loaf',k:'fest',r:2,sh:'disc',c:'#c98a4a',d:'Crusty, golden, and impossible to eat. You keep it as a trophy.'},
 {id:'fe_harv2',n:'Moon-Gold Coin',k:'fest',r:2,sh:'disc',c:'#f2c870',d:'It came down with the harvest moon. It is warm.'},
 {id:'fe_thanks',n:'Gratitude Wreath',k:'fest',r:2,sh:'acorn',c:'#b8823a',d:'Dried leaves and grain. Every strand is a thing someone was glad of.'},
 {id:'fe_thanks2',n:'Cornucopia Horn',k:'fest',r:2,sh:'bell',c:'#d9a35a',d:'A horn of plenty, small enough to hold. Somehow always a little heavier than it should be.'},
 {id:'fe_frost',n:'Memory Lantern',k:'fest',r:3,sh:'bell',c:'#f6dc8a',d:'It was lit for the griffins who came before. It has not gone out.'},
 {id:'fe_frost2',n:'Frostfall Star',k:'fest',r:2,sh:'glass',c:'#e8e0d0',d:'A snowflake that has been very still for a very long time.'});
Object.assign(ITEM_BY_ID,Object.fromEntries(ITEMS.map(i=>[i.id,i])));
function festNow(d){const m=d.getMonth()+1,day=d.getDate(),v=m*100+day;for(const f of FESTS){const a=f.a[0]*100+f.a[1],b=f.b[0]*100+f.b[1];if(a<=b?(v>=a&&v<=b):(v>=a||v<=b))return f}return null}
function festYear(d,f){return f.a[0]*100+f.a[1]>f.b[0]*100+f.b[1]&&d.getMonth()<6?d.getFullYear()-1:d.getFullYear()}
function festCheck(){if(location.search.includes('nofest'))return;if(!S||S.phase!=='alive'||modalOpen||training||titleUp||S.exp)return;const d=new Date(),f=festNow(d);if(!f)return;const key='f_'+f.id+festYear(d,f);if(S.cnt[key])return;S.cnt[key]=1;const n=S.name;
  showModal({title:f.n+': '+f.title,html:`<p class="note">${f.d}</p><p>${f.text(n)}</p>`,buttons:f.o.map(o=>({t:o[0],fn:()=>{closeModal(true);apply(o[1]);const it=ITEM_BY_ID[o[2]];giveItem(it);addStars(Math.round(6*(1+perk('stars'))));sfx('win');journal(`${f.n}: ${it.n}.`);
    showModal({title:f.n,html:`<p>${o[3]}</p><div class="row" style="margin:6px 0">${itemIcon(it,34)}<div class="grow"><b>${it.n}</b><small>${RARITY[it.r]}</small></div></div><p class="note">While ${f.n} lasts, bond and Starlight come a little faster.</p>`,buttons:[{t:'Lovely',cls:'gold'}]},true);save();renderAll();return false}}))})}


/* ============================ species ============================ */
const GCOATS=COATS.slice();
const SUNF=n=>({n:'Sunforged',...n});
const SPECIES={
 griffin:{id:'griffin',w:'griffin',pl:'griffins',chick:'chick',tag:'Guardian of the Skies',pitch:1,wave:'sawtooth',
  blurb:'Eagle and lion. Proud, loyal and fierce. A loyal guardian of the heights.',perkTxt:'Keen eyes and strong talons: rarer treasures and more provisions.',
  perk:{treasure:.06,prov:.05},stages:['Hatchling','Fledgling','Juvenile','Legend'],chapters:['Downy Days','First Wingbeats','The Storm Season','Sky Legend'],
  egg:{a:'#fbf0d4',b:'#dcbf86',c:'#a98445',g:'#ffd98a',s:'#b0873c'},nest:['#6a4a2c','#8a6438','#52381f','#a07a46'],
  intro:k=>[['A Hundred Winters','The aerie fell silent a hundred winters ago. The griffins didn\'t leave. They simply stopped coming back.'],
   ['One Egg',`${k}, you were climbing the ruins above the old pass when you found a nest. One egg, still warm after a century.`],
   ['Keep It Warm','Keep it safe. Keep it fed. Whatever it becomes, it will become because of you.']]},
 hippogriff:{id:'hippogriff',w:'hippogriff',pl:'hippogriffs',chick:'chick',tag:'Heart of the Wind',pitch:.85,wave:'sawtooth',
  blurb:'Eagle in front, horse behind. Gentle and trusting. The easiest to befriend.',perkTxt:'Wild creatures befriend it faster, and every bond grows a little quicker.',
  perk:{friend:.15,bond:.05},stages:['Hatchling','Fledgling','Juvenile','Legend'],chapters:['Downy Days','First Gallop','The Storm Season','Sky Legend'],
  egg:{a:'#f2ead8',b:'#c2ae8c',c:'#7e6a4c',g:'#ffd98a',s:'#8a7556'},nest:['#6a5a3a','#8a7448','#52442a','#a08a56'],
  coats:[{n:'Chestnut Gold',body:'#9a5a2e',belly:'#d0a070',wing:'#d8a860',wing2:'#9a5a2e',tip:'#4a2a14',head:'#f0e0c4',beak:'#d8a038'},
   {n:'Dapple Grey',body:'#8a8f98',belly:'#c4c8cf',wing:'#b8bdc6',wing2:'#8a8f98',tip:'#40454f',head:'#e6e8ec',beak:'#d0a840'},
   {n:'Bay Dusk',body:'#6a3a22',belly:'#a87850',wing:'#8a5a38',wing2:'#6a3a22',tip:'#2a160c',head:'#cdb090',beak:'#c8963a'},
   {n:'Cloud White',body:'#e0dccf',belly:'#f6f2e8',wing:'#f5f1e6',wing2:'#d6d1c3',tip:'#8f98aa',head:'#fffdf6',beak:'#e0b242'},
   {n:'Black Forest',body:'#3a3430',belly:'#6e6258',wing:'#564c44',wing2:'#3a3430',tip:'#14100e',head:'#a89480',beak:'#c0902c'},
   SUNF({body:'#d9a22e',belly:'#f6dc8a',wing:'#f2c75c',wing2:'#d9a22e',tip:'#8a5a12',head:'#fff6dc',beak:'#f0b52e'})],
  intro:k=>[['The Old Road','The riders of the pass kept hippogriffs once, half eagle and half horse, and never fenced them in. One winter they simply stopped coming down the mountain.'],
   ['One Egg',`${k}, you were climbing the ruins above the old pass when you found a nest. One egg, mottled like river stone, still warm after a century.`],
   ['Keep It Warm','Keep it safe. Keep it fed. Whatever it becomes, it will become because of you.']]},
 phoenix:{id:'phoenix',w:'phoenix',pl:'phoenixes',chick:'chick',tag:'Eternal Flame',pitch:1.5,wave:'sine',
  blurb:'A bird of living flame. Generous with Starlight, and it rises again.',perkTxt:'More Starlight from everything. If it falls during a sky ride, it rises once per flight.',
  perk:{stars:.1},stages:['Cinder','Kindling','Blaze','Legend'],chapters:['Cinder Days','First Flames','The Burning Season','Eternal Flame'],
  egg:{a:'#ffd9a0',b:'#e8803a',c:'#a83c1c',g:'#ffb050',s:'#c8501e'},nest:['#6a3a22','#8a4a28','#5a2c18','#b05a2e'],
  coats:[{n:'Sunrise',body:'#d9532a',belly:'#f4b350',wing:'#f08a35',wing2:'#c8402a',tip:'#7a1f12',head:'#f9d98a',beak:'#e8a52a'},
   {n:'Gold Flame',body:'#e0a030',belly:'#f8dc80',wing:'#f6c850',wing2:'#d98a20',tip:'#8a4a10',head:'#fff0b8',beak:'#e89a20'},
   {n:'Ashen Ember',body:'#5e5852',belly:'#948a80',wing:'#8a7e72',wing2:'#6a6058',tip:'#c8501e',head:'#c9b8a4',beak:'#d08a28'},
   {n:'White Fire',body:'#efe2c8',belly:'#fff4d8',wing:'#fff8e4',wing2:'#f0d6a0',tip:'#d98a30',head:'#fffbee',beak:'#e8b040'},
   {n:'Crimson',body:'#a8301e',belly:'#e07a40',wing:'#cc4a28',wing2:'#a8301e',tip:'#4a120a',head:'#f2c890',beak:'#e0a030'},
   SUNF({body:'#f0b030',belly:'#fff0a0',wing:'#ffd860',wing2:'#f09a20',tip:'#b05a10',head:'#fffbe0',beak:'#ffc040'})],
  intro:k=>[['Ash and Embers','The great fires of the mountain went cold a hundred winters ago. The phoenixes did not die. They simply stopped coming back.'],
   ['One Egg',`${k}, you were climbing the ruins above the old pass when you found a nest of ash. In the middle, one egg, glowing faintly, still warm after a century.`],
   ['Keep It Warm','Keep it safe. Keep it fed. Whatever it becomes, it will become because of you.']]},
 pegasus:{id:'pegasus',w:'pegasus',pl:'pegasi',chick:'foal',tag:'Child of Starlight',pitch:1.15,wave:'triangle',
  blurb:'A white-winged horse of the open sky. A natural flyer, light and quick.',perkTxt:'More outings while away, slower tiring on rides, and rings are easier to catch.',
  perk:{exped:.1},stages:['Foal','Yearling','Skyrunner','Legend'],chapters:['Foal Days','First Gallop','The Storm Season','Sky Legend'],
  egg:{a:'#fbf9f2',b:'#d8d4e2',c:'#9a96ae',g:'#fff0c0',s:'#c8bfa0'},nest:['#b89a5a','#d0b46c','#a08444','#e0c884'],
  coats:[{n:'Silver Mist',body:'#cfd3da',belly:'#eceef2',wing:'#f4f5f8',wing2:'#c0c5ce',tip:'#7a8296',head:'#f7f8fa',beak:'#d8d8e0'},
   {n:'Pearl',body:'#efe9dc',belly:'#fbf8ef',wing:'#fffdf8',wing2:'#e4dccb',tip:'#a89870',head:'#fffefb',beak:'#e8dcc0'},
   {n:'Dusk Grey',body:'#6c7080',belly:'#a2a6b4',wing:'#9498a8',wing2:'#727686',tip:'#30333f',head:'#cfd2dc',beak:'#b8bcc8'},
   {n:'Chestnut Wing',body:'#a8643a',belly:'#d9a878',wing:'#f0dcc0',wing2:'#c88a58',tip:'#5a3018',head:'#ecd0a8',beak:'#d8b080'},
   {n:'Storm Black',body:'#3c3f4a',belly:'#6c707e',wing:'#565a68',wing2:'#3c3f4a',tip:'#15161c',head:'#9a9ead',beak:'#7a7e8c'},
   SUNF({body:'#d9a22e',belly:'#f6dc8a',wing:'#fff2c0',wing2:'#e8c060',tip:'#8a5a12',head:'#fff6dc',beak:'#f0b52e'})],
  intro:k=>[['The Empty Stables','The high stables of the winged horses fell silent a hundred winters ago. The pegasi did not leave. They simply stopped coming back.'],
   ['One Egg',`${k}, you were climbing the ruins above the old pass when you found a drift of old hay. In the middle, one pale egg, still warm after a century.`],
   ['Keep It Warm','Keep it safe. Keep it fed. Whatever it becomes, it will become because of you.']]},
 wyvern:{id:'wyvern',w:'wyvern',pl:'wyverns',chick:'hatchling',tag:'Stormborn',pitch:.55,wave:'sawtooth',
  blurb:'A small dragon with a hide like armor. Tough, greedy and fiercely loyal.',perkTxt:'Takes less damage on rides, brings home more provisions, and finds more treasure.',
  perk:{prov:.1,treasure:.04},stages:['Hatchling','Whelp','Drake','Legend'],chapters:['Cold Hearth','First Fire','The Storm Season','Dragon Legend'],
  egg:{a:'#cfd8a0',b:'#7e9a56',c:'#46602c',g:'#e8d890',s:'#3a5222'},nest:['#5a5750','#7a766c','#46433d','#8e897c'],
  coats:[{n:'Moss Scale',body:'#5a7a3a',belly:'#b8c880',wing:'#7a9a4a',wing2:'#4a6a2a',tip:'#2a3c14',head:'#8aa860',beak:'#e8dcb0'},
   {n:'Ember Drake',body:'#9a3a22',belly:'#e0a060',wing:'#c85a30',wing2:'#9a3a22',tip:'#4a1a0e',head:'#c8643a',beak:'#f0d8b0'},
   {n:'Slate',body:'#5a6070',belly:'#a0a6b4',wing:'#7a8294',wing2:'#565c6c',tip:'#262a34',head:'#7e8698',beak:'#e8e0d0'},
   {n:'Bronze',body:'#a87a2c',belly:'#e6c47a',wing:'#c89a40',wing2:'#8a6020',tip:'#4a3010',head:'#c8a050',beak:'#f0e4c0'},
   {n:'Ash Bone',body:'#cdc4b0',belly:'#efe8d8',wing:'#e0d8c4',wing2:'#b8ae98',tip:'#6a604c',head:'#dcd2bc',beak:'#fffaf0'},
   SUNF({body:'#d9a22e',belly:'#f6dc8a',wing:'#f2c75c',wing2:'#c88a20',tip:'#8a5a12',head:'#e8c060',beak:'#fff6dc'})],
  intro:k=>[['Cold Hearths','The deep caves went quiet a hundred winters ago. The wyverns did not die. They simply stopped coming out.'],
   ['One Egg',`${k}, you were climbing the ruins above the old pass when you found a hollow in the rock. One egg, scaled like a stone, still warm after a century.`],
   ['Keep It Warm','Keep it safe. Keep it fed. Whatever it becomes, it will become because of you.']]}};
SPECIES.griffin.coats=GCOATS;
const SPEC_ORDER=['griffin','hippogriff','phoenix','pegasus','wyvern'];
let SPEC=SPECIES.griffin;
const spFx=k=>(SPEC.perk&&SPEC.perk[k])||0;

/* ---- word swapping (text anywhere in the game follows the species) ---- */
let SX=[];
function cs(m,r){return m.length>1&&m===m.toUpperCase()?r.toUpperCase():m[0]===m[0].toUpperCase()?r[0].toUpperCase()+r.slice(1):r}
function buildSX(){SX=[];if(SPEC.id==='griffin')return;
  SX.push([/griffins/gi,m=>cs(m,SPEC.pl)],[/griffin/gi,m=>cs(m,SPEC.w)],[/\bchick(s?)\b/gi,(m,s)=>cs(m,SPEC.chick)+s]);
  if(SPEC.id==='pegasus')SX.push([/\bbeaks?\b/gi,m=>cs(m,'muzzle'+(/s$/i.test(m)?'s':''))],[/\btalons\b/gi,m=>cs(m,'hooves')],[/\btalon\b/gi,m=>cs(m,'hoof')],[/\bpreen feathers\b/gi,m=>cs(m,'preen feathers')]);
  if(SPEC.id==='wyvern')SX.push([/\bbeaks?\b/gi,m=>cs(m,'snout'+(/s$/i.test(m)?'s':''))],[/\btalons\b/gi,m=>cs(m,'claws')],[/\btalon\b/gi,m=>cs(m,'claw')],[/\bpreen feathers\b/gi,m=>cs(m,'polish scales')],[/\bplumage\b/gi,m=>cs(m,'scales')],[/\bfeathers dry\b/gi,m=>cs(m,'scales dry')],[/\bfeathers gleam\b/gi,m=>cs(m,'scales gleam')])}
function sx(t){if(!t||!SX.length)return t;let r=t;for(const [re,f] of SX)r=r.replace(re,f);return r}
const ORIG=new WeakMap();
function fixText(n){if(n.parentNode&&n.parentNode.closest&&n.parentNode.closest('[data-nosx]'))return;const o=ORIG.get(n);const base=(o&&n.nodeValue===o.out)?o.src:n.nodeValue;const v=sx(base);if(v!==n.nodeValue){ORIG.set(n,{src:base,out:v});n.nodeValue=v}else if(o&&v===base)ORIG.delete(n)}
function sxNode(root){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const a=[];let x;while(x=w.nextNode()){const p=x.parentNode;if(p&&/^(SCRIPT|STYLE|TEXTAREA)$/.test(p.tagName))continue;a.push(x)}
  a.forEach(fixText)}
new MutationObserver(ms=>{if(!SX.length)return;for(const m of ms){if(m.type==='characterData'){fixText(m.target)}
  else m.addedNodes.forEach(n=>{if(n.nodeType===3)fixText(n);else if(n.nodeType===1)sxNode(n)})}}).observe(document.body,{childList:true,subtree:true,characterData:true});
function applySpecies(id,quiet){SPEC=SPECIES[id]||SPECIES.griffin;COATS.length=0;SPEC.coats.forEach(c=>COATS.push(c));
  SPEC.stages.forEach((n,i)=>{STAGES[i].n=n});SPEC.chapters.forEach((n,i)=>{CHAPTERS[i]=n});
  document.title='Everhatch: Raise Your Legend';
  buildSX();lastGKey='';if(!quiet)sxNode(document.body)}
/* species switch for previews */
function withSpecies(id,fn){const prev=SPEC.id;applySpecies(id,true);try{return fn()}finally{applySpecies(prev,true)}}

/* ---- bodies ---- */
const horseTail=c=>`<path d="M66,190 C34,186 12,206 10,238 C9,254 16,264 26,270" stroke="${c.wing2}" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M64,194 C40,196 24,214 22,242" stroke="${c.body}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M30,232 C24,248 26,260 34,268" stroke="${c.tip}" stroke-opacity=".5" stroke-width="3" fill="none" stroke-linecap="round"/>`;
const horseHind=c=>`<path d="M92,222 C82,236 78,246 80,256 L98,256 C98,246 104,236 114,224 Z" fill="${c.body}" stroke="${c.tip}" stroke-opacity=".35"/>
    <ellipse cx="98" cy="206" rx="34" ry="30" fill="${c.body}" stroke="${c.tip}" stroke-opacity=".35"/>
    <path d="M70,214 C90,196 118,200 128,222" stroke="${c.tip}" stroke-opacity=".3" fill="none" stroke-width="2"/>
    <path d="M77,255 h23 l3,10 h-29 Z" fill="${c.tip}"/>`;
const SPX={
 griffin:()=>({}),
 hippogriff:c=>({tail:horseTail(c),hind:horseHind(c),
  extra:`<g fill="${c.belly}" opacity=".28"><circle cx="120" cy="178" r="6"/><circle cx="150" cy="188" r="7"/><circle cx="178" cy="176" r="6"/><circle cx="136" cy="210" r="5"/><circle cx="172" cy="206" r="6"/></g>`}),
 pegasus:(c,P)=>({tail:horseTail(c),hind:horseHind(c),
  fore:`<g opacity=".85"><path d="M176,222 h12 l-1,32 h-9 Z" fill="${c.body}" stroke="${c.tip}" stroke-opacity=".3"/><path d="M174,254 h15 l2,10 h-19 Z" fill="${c.tip}"/></g>
    <path d="M200,220 h14 l-1,34 h-11 Z" fill="${c.body}" stroke="${c.tip}" stroke-opacity=".3"/><path d="M198,254 h17 l2,11 h-21 Z" fill="${c.tip}"/>`,
  beak:`<path d="M250,84 C272,80 298,96 297,120 C296,134 284,140 274,136 C262,132 254,122 250,110 Z" fill="${c.head}" stroke="${c.tip}" stroke-opacity=".4"/>
      <ellipse cx="288" cy="121" rx="3" ry="4.5" fill="${c.tip}" opacity=".75"/>
      <path d="M270,134 C278,134 286,132 291,128" stroke="${c.tip}" stroke-opacity=".5" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M237,89 C243,85 254,87 259,94" stroke="${c.tip}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  top:`<path d="M224,84 L219,56 L238,76 Z" fill="${c.head}" stroke="${c.tip}" stroke-opacity=".4"/><path d="M231,80 L233,54 L247,76 Z" fill="${c.head}" stroke="${c.tip}" stroke-opacity=".4"/>
      <path d="M236,80 C247,88 252,100 250,112" stroke="${c.wing2}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M216,96 C206,110 204,128 210,146" stroke="${c.wing2}" stroke-width="12" fill="none" stroke-linecap="round"/>`,
  extra:`<path d="M200,104 C182,122 176,148 184,176" stroke="${c.wing2}" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M196,112 C182,128 180,150 186,170" stroke="${c.tip}" stroke-opacity=".3" stroke-width="3" fill="none"/>`}),
 phoenix:(c,P,o)=>{let tl='',cr='';
  [[-96,70,c.wing],[-114,80,c.wing2],[-132,68,c.wing],[-78,62,c.wing2]].forEach(p=>{tl+=`<path d="${featherPath(66,196,p[1]*(.7+.1*P.crest),8)}" transform="rotate(${p[0]} 66 196)" fill="${p[2]}" stroke="${c.tip}" stroke-opacity=".5"/>`});
  const n=Math.max(2,P.crest+3);for(let i=0;i<n;i++)cr+=`<path d="${featherPath(226,90,26+P.crest*7,6)}" transform="rotate(${-66-i*17} 226 90)" fill="${i%2?c.wing2:c.wing}" stroke="${c.tip}" stroke-opacity=".5"/>`;
  const leg=x=>`<path d="M${x},226 L${x-2},256" stroke="${c.beak}" stroke-width="5" stroke-linecap="round"/><path d="M${x-2},256 q-10,4 -13,10 M${x-2},256 q0,8 -1,12 M${x-2},256 q9,4 12,10" stroke="${c.beak}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  return{tail:`<g class="flick" style="transform-origin:66px 196px">${tl}</g>`,
   hind:`<path d="M96,228 L92,256" stroke="${c.beak}" stroke-width="5" stroke-linecap="round"/><path d="M92,256 q-12,4 -16,10 M92,256 q0,8 -2,12 M92,256 q10,4 14,10" stroke="${c.beak}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <ellipse cx="98" cy="206" rx="34" ry="30" fill="${c.body}" stroke="${c.tip}" stroke-opacity=".35"/><path d="M70,214 C90,196 118,200 128,222" stroke="${c.tip}" stroke-opacity=".3" fill="none" stroke-width="2"/>`,
   fore:`<g opacity=".85">${leg(186)}</g>${leg(209)}`,
   beak:`<path d="M255,94 C270,94 281,102 279,114 C272,110 264,110 258,108 Z" fill="${c.beak}" stroke="${c.tip}" stroke-opacity=".5"/><path d="M256,108 C264,111 272,114 270,121 C264,120 258,116 256,110 Z" fill="${c.beak}" opacity=".85" stroke="${c.tip}" stroke-opacity=".5"/>
      <circle cx="267" cy="101" r="1.4" fill="${c.tip}"/><path d="M237,89 C243,85 254,87 259,94" stroke="${c.tip}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
   top:`<g class="flick" style="transform-origin:226px 90px">${cr}</g>`,
   extra:`<ellipse cx="150" cy="196" rx="54" ry="28" fill="${c.head}" opacity=".18"/><g fill="${c.wing}"><circle class="emb" cx="120" cy="150" r="2.4"/><circle class="emb" style="animation-delay:1.1s" cx="170" cy="146" r="2"/><circle class="emb" style="animation-delay:2.1s" cx="90" cy="170" r="2.2"/><circle class="emb" style="animation-delay:.6s" cx="196" cy="160" r="1.8"/></g>`}},
 wyvern:(c,P,o)=>{
  const wy=(px,py,len,n,a0,a1,mem,edge)=>{const m=Math.max(3,Math.round(n/2)+1),pts=[];for(let i=0;i<m;i++){const t=m===1?0:i/(m-1),a=(a0+(a1-a0)*t)*Math.PI/180,L=len*(.74+.26*Math.sin(Math.PI*(.1+.8*t)));pts.push([px+L*Math.sin(a),py-L*Math.cos(a)])}
    let d=`M${px},${py} L${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;for(let i=1;i<m;i++){const q=pts[i-1],p=pts[i],mx=(q[0]+p[0])/2,my=(q[1]+p[1])/2;d+=` Q${(mx+(px-mx)*.3).toFixed(1)},${(my+(py-my)*.3).toFixed(1)} ${p[0].toFixed(1)},${p[1].toFixed(1)}`}d+=' Z';
    let b='';pts.forEach((p,i)=>{b+=`<path d="M${px},${py} L${p[0].toFixed(1)},${p[1].toFixed(1)}" stroke="${edge}" stroke-width="${i?2:3.4}" stroke-linecap="round" fill="none"/>`});
    const t0=pts[0];b+=`<path d="M${(t0[0]-5).toFixed(1)},${(t0[1]+4).toFixed(1)} L${t0[0].toFixed(1)},${(t0[1]-9).toFixed(1)} L${(t0[0]+5).toFixed(1)},${(t0[1]+4).toFixed(1)} Z" fill="${c.beak}"/>`;
    return`<path d="${d}" fill="${mem}" stroke="${edge}" stroke-opacity=".6" stroke-width="1.4"/>${b}`};
  const hs=.5+.17*P.crest;let sp='';[[92,147],[112,141],[132,139],[152,139],[172,141],[192,147],[208,156]].forEach(p=>{sp+=`<path d="M${p[0]-6},${p[1]+5} L${p[0]},${p[1]-11} L${p[0]+6},${p[1]+5} Z" fill="${c.tip}" opacity=".85"/>`});
  const claws=(x,y,st)=>`<path d="M${x-9},${y} l-3,6 M${x},${y+1} l-1,7 M${x+9},${y} l1,7 M${x+17},${y-1} l4,6" stroke="${c.beak}" stroke-width="3" stroke-linecap="round" fill="none"/>`;
  return{nofl:true,
   w:[wy(152,150,P.wl,P.wn,-6,-94,c.wing,c.tip),wy(138,146,P.wl*.92,P.wn,-20,-104,c.wing2,c.tip),o.stage>=4?wy(138,146,P.wl*1.07,P.wn+3,-34,-122,c.wing2,c.tip):''],
   tail:`<path d="M66,190 C34,198 8,188 10,160 C11,146 18,138 28,136" stroke="${c.body}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M66,190 C34,198 8,188 10,160 C11,146 18,138 28,136" stroke="${c.belly}" stroke-opacity=".3" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M26,138 l-16,-14 l20,0 l8,-14 l2,20 z" fill="${c.tip}"/>`,
   hind:`<path d="M84,226 C78,240 80,252 86,258 L112,258 C112,246 114,236 118,226 Z" fill="${c.body}" stroke="${c.tip}" stroke-opacity=".35"/>
    <ellipse cx="98" cy="206" rx="34" ry="30" fill="${c.body}" stroke="${c.tip}" stroke-opacity=".35"/><path d="M70,214 C90,196 118,200 128,222" stroke="${c.tip}" stroke-opacity=".3" fill="none" stroke-width="2"/>
    <ellipse cx="98" cy="258" rx="22" ry="7" fill="${c.body}" stroke="${c.tip}" stroke-opacity=".4"/>${claws(84,262)}`,
   fore:`<g opacity=".85"><rect x="176" y="224" width="13" height="28" rx="6" fill="${c.body}"/><ellipse cx="183" cy="256" rx="14" ry="6" fill="${c.body}"/>${claws(176,260)}</g>
    <rect x="200" y="222" width="14" height="30" rx="6" fill="${c.body}"/><ellipse cx="207" cy="256" rx="15" ry="6.5" fill="${c.body}"/>${claws(199,260)}`,
   beak:`<path d="M252,90 C272,86 296,98 298,114 C298,124 290,130 280,128 C270,126 262,122 254,114 Z" fill="${c.head}" stroke="${c.tip}" stroke-opacity=".5"/>
      <path d="M256,116 C268,124 280,134 292,132 C288,140 272,142 260,134 Z" fill="${c.belly}" opacity=".9" stroke="${c.tip}" stroke-opacity=".4"/>
      <circle cx="289" cy="106" r="2" fill="${c.tip}"/><path d="M272,127 l3,5 l3,-5 M284,128 l3,4 l3,-5" fill="#fff6e0"/>
      <path d="M236,90 C244,84 256,86 262,94" stroke="${c.tip}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
   top:`<g transform="translate(226 88) scale(${hs.toFixed(2)}) translate(-226 -88)"><path d="M226,84 C212,66 198,60 184,62 C198,70 206,82 216,94 Z" fill="${c.belly}" stroke="${c.tip}" stroke-opacity=".5"/>
      <path d="M238,80 C230,62 218,54 206,54 C216,62 222,74 230,88 Z" fill="${c.belly}" stroke="${c.tip}" stroke-opacity=".5"/><path d="M214,96 l-14,2 l12,8 M220,104 l-12,8 l14,2" fill="${c.tip}" opacity=".8"/></g>`,
   eye:o.sleep?`<path d="M241,99 q6,5 12,0" stroke="#2a1a10" stroke-width="2.6" fill="none" stroke-linecap="round"/>`:`<g class="blink"><ellipse cx="247" cy="98" rx="6.8" ry="6.2" fill="${o.iris}"/><ellipse cx="248" cy="98.5" rx="1.9" ry="5.2" fill="#1a0f0a"/><circle cx="249.6" cy="96.6" r="1.3" fill="#fff"/></g>`,
   extra:`${sp}<path d="M100,216 q18,10 36,0 M134,224 q20,10 40,0 M172,214 q14,8 28,0" stroke="${c.belly}" stroke-opacity=".55" stroke-width="2" fill="none"/>`}}};

/* ---- the choice at the very beginning ---- */
function pickSpecies(){
  let sel=0;const rows=SPEC_ORDER.map((id,i)=>{const sp=SPECIES[id];const svg=withSpecies(id,()=>griffinSVG({stage:3,coat:0,iris:IRIS.none,noNest:true,fold:0,eq:{},aura:false,sp:id})).replace(/bg1/g,'bgp'+i);
    return`<div class="spk${i===0?' on':''}" data-pick="${i}"><div class="pv"><img src="${hatchURL(id,0)}" alt="${sp.w} egg illustration" onerror="this.hidden=true;this.nextElementSibling.style.display='block'"><div style="display:none">${svg}</div></div><div><b>${sp.w[0].toUpperCase()+sp.w.slice(1)}</b><small>${sp.blurb}</small><small style="color:var(--gold2)">${sp.perkTxt}</small></div></div>`}).join('');
  showModal({title:'Which Egg?',html:`<p class="note" style="text-align:center">Every companion has its own appearance, abilities, strengths and story. Choose the egg that calls to you.</p><div data-nosx="1">${rows}</div>`,
    buttons:[{t:'Choose this egg',cls:'gold',fn:()=>{const m=document.querySelector('#modal .spk.on');const id=SPEC_ORDER[+(m?m.dataset.pick:0)];closeModal(true);applySpecies(id);beginName();return false}}],
    onShow:m=>{m.querySelectorAll('.spk').forEach(el=>el.onclick=()=>{m.querySelectorAll('.spk').forEach(x=>x.classList.remove('on'));el.classList.add('on')})}})}
function begin(){pickSpecies()}

/* ---- species tricks, stories, deeds ---- */
TRICKS.push(
 {id:'rear',sp:'hippogriff',n:'Rear and Cry',aff:'bold',req:{st:1,lvl:4},d:'Rears up on its hind legs and screams with both halves of its voice at once.',anim:'t-rear',ms:2500,sfx:'hit',rw:'bond'},
 {id:'canter',sp:'hippogriff',n:'Hill Canter',aff:'gentle',req:{st:2,lvl:6},d:'A slow, rolling canter that ends in a glide.',anim:'t-gallop',ms:2700,sfx:'chime',rw:'stars'},
 {id:'flamedance',sp:'phoenix',n:'Flame Dance',aff:'mischief',req:{st:1,lvl:4},d:'Spins in a ring of small, cheerful fire.',anim:'t-flame',ms:2900,sfx:'chime',rw:'stars'},
 {id:'cinder',sp:'phoenix',n:'Cinderfall',aff:'gentle',req:{st:2,lvl:6},d:'Lets a slow rain of warm sparks fall over the nest.',anim:'t-flame',ms:3200,sfx:'level',rw:'bond'},
 {id:'cloudtrot',sp:'pegasus',n:'Cloud Trot',aff:'gentle',req:{st:1,lvl:4},d:'Trots across the air as if it were a meadow.',anim:'t-cloud',ms:3100,sfx:'chime',rw:'prov'},
 {id:'stargallop',sp:'pegasus',n:'Starlit Gallop',aff:'bold',req:{st:2,lvl:6},d:'A full gallop across the sky, leaving sparks in the dark.',anim:'t-gallop',ms:2700,sfx:'whoosh',rw:'stars'},
 {id:'puff',sp:'wyvern',n:'Ember Puff',aff:'mischief',req:{st:1,lvl:4},d:'A small, proud cloud of smoke. Possibly an accident.',anim:'t-puff',ms:2300,sfx:'hit',rw:'prov'},
 {id:'slam',sp:'wyvern',n:'Tail Slam',aff:'fierce',req:{st:2,lvl:6},d:'One tail strike that shakes pebbles off the ledge.',anim:'t-slam',ms:2000,sfx:'hit',rw:'item'});
Object.assign(TRICK_BY_ID,Object.fromEntries(TRICKS.map(t=>[t.id,t])));
const isSp=id=>()=>S&&S.species===id;
EV('ev_hp_gallop',()=>isSp('hippogriff')()&&stage()>=1,'It Runs Before It Flies',n=>`${n} gallops the length of the ledge, half-flaps, and tumbles in a heap. It looks up at you. The eagle half is thrilled. The horse half is furious.`,
 [['Cheer it on',{bond:5,traits:{bold:1.5},joy:8},'It is up and running again before you finish cheering.'],['Brush the dust off, gently',{bond:5,traits:{gentle:1.5}},'It stands very still and lets you, ears flat with dignity.']]);
EV('ev_hp_road',()=>isSp('hippogriff')()&&stage()>=3,'The Old Road',n=>`${n} stops at the edge of a road you have never noticed, worn into the stone by hooves a very long time ago. It lowers its head and stands there for a while.`,
 [['Stand with it',{bond:7,traits:{gentle:2}},'Neither of you says anything. The wind says it for you.'],['Walk the road together',{bond:6,traits:{bold:1.5},joy:6},'Its hooves find the old grooves exactly, as if the road had been waiting.']]);
EV('ev_px_spark',()=>isSp('phoenix')()&&stage()>=1,'The First Spark',n=>`${n} sneezes, and a small flame jumps out. It stares at the flame. The flame, for a moment, stares back. Then ${n} eats it.`,
 [['Be amazed out loud',{bond:4,joy:10,traits:{mischief:1.5}},'It sneezes again, on purpose this time, to show you it can.'],['Check its feathers for scorch marks',{bond:5,traits:{gentle:1.5}},'There are none. It looks faintly insulted that you checked.']]);
EV('ev_px_burning',()=>isSp('phoenix')()&&stage()>=3,'The Burning',n=>`${n} climbs to the highest ledge at dusk and burns. You cannot look away. When the light fades, there is only a small heap of ash, warm and quiet. Then the ash begins to glow.`,
 [['Hold the ash until it rises',{bond:10,traits:{gentle:2}},'It unfolds in your hands, bigger than before, and looks at you as if nothing happened.'],['Stand and cheer as it burns',{bond:8,traits:{bold:2},joy:10},'The flames get brighter. You are fairly sure it heard you.']]);
EV('ev_pg_cloud',()=>isSp('pegasus')()&&stage()>=1,'A Cloud Underfoot',n=>`${n} steps off the ledge and, for one long moment, stands on a cloud as if it were a floor. Then it remembers it cannot, and drops. It catches itself, deeply offended.`,
 [['Applaud',{bond:4,traits:{mischief:1.5},joy:8},'It takes a bow. It does not mention the drop.'],['Tell it that was brilliant',{bond:5,traits:{bold:1}},'It lifts its head a little higher for the rest of the day.']]);
EV('ev_pg_stars',()=>isSp('pegasus')()&&stage()>=3,'The Winter Stars',n=>`On the clearest night of the year, ${n} gallops across the sky itself, hooves striking tiny sparks from the cold. You will never be sure how much of it you imagined.`,
 [['Watch until it comes home',{bond:7,traits:{gentle:2}},'It lands beside you, steaming slightly, and leans its whole weight on your shoulder.'],['Call out to it',{bond:6,traits:{bold:1.5},joy:8},'It wheels in the dark, answers once, and goes on.']]);
EV('ev_wy_hoard',()=>isSp('wyvern')()&&stage()>=1,'A Small Hoard',n=>`${n} has been dragging shiny things into a corner of the nest. A bottle cap. A button. One of your keys. It sits on the pile and dares you to say something.`,
 [['Add a coin to the pile',{bond:5,traits:{gentle:1}},'It looks at the coin for a long time, then tucks it in as if it were the crown jewel.'],['Ask for your key back',{bond:3,traits:{mischief:1.5}},'It hands it back. Slowly. With a look that says it will remember this.']]);
EV('ev_wy_fire',()=>isSp('wyvern')()&&stage()>=3,'The First Real Fire',n=>`${n} takes a deep breath, and the air in front of it shimmers. A column of gold light rolls out over the cliff and fades. Afterward it is very quiet. Then ${n} looks at you, wanting to know how it did.`,
 [['Tell it that was magnificent',{bond:7,traits:{fierce:1.5}},'It does a small, private victory shuffle and tries to hide that it did.'],['Hold a hand out to feel the warmth',{bond:6,traits:{gentle:1.5}},'The air is still warm. It watches your face the whole time.']]);
DEEDS.push(['d_spt','Born to It','Master both signature tricks of your kind.',()=>{const a=TRICKS.filter(t=>t.sp===SPEC.id);return a.length>0&&a.every(t=>(S.tricks[t.id]||0)>=100)},12]);

/* ---- switching kinds: shelve the current nest instead of erasing it ---- */
const SHELF=KEY+'_shelf';
const shelfInfo=()=>{try{const r=localStorage.getItem(SHELF);if(!r)return null;const o=JSON.parse(r);return{name:o.name||'an egg',sp:(SPECIES[o.species||'griffin']||SPECIES.griffin).w}}catch(e){return null}};
function newGame(){const had=!!(S||load());showModal({title:'Choose a New Egg?',html:`<p style="text-align:center">${had?'Your current nest will be kept safe on a shelf so you can bring it back later from Settings. Only one nest fits on the shelf: starting another new egg replaces whatever is already there.':'Start a new egg.'}</p>`,
  buttons:[{t:'Shelve it and pick a new egg',fn:()=>{try{if(S)save();const cur=localStorage.getItem(KEY);if(cur)localStorage.setItem(SHELF,cur);localStorage.removeItem(KEY)}catch(e){}S=null;$('#tCont').style.display='none';$('#tNew').style.display='none';closeModal(true);begin();return false}},{t:'Keep my nest',cls:'gold'}]})}
function restoreShelf(){try{const sh=localStorage.getItem(SHELF);if(!sh)return;if(S)save();const cur=localStorage.getItem(KEY);localStorage.setItem(KEY,sh);if(cur)localStorage.setItem(SHELF,cur);else localStorage.removeItem(SHELF)}catch(e){return}closeModal(true);cont();toast('Your shelved nest is back.')}
ACTS.shelf=()=>restoreShelf();


/* ============================ bestiary: real history + stats ============================ */
const F=(l,v)=>[l,v,'f'],L=(l,v)=>[l,v,'l'],GM=(l,v)=>[l,v,'g'];
const LORE={
griffin:{aka:'Gryphon, griffon. In Persian, šērdāl, "lion-eagle".',
 intro:'Part lion, part eagle, and one of the oldest imagined animals on Earth. Griffins were drawn in the Near East thousands of years before anyone wrote about them.',
 sheet:[F('Body','Eagle head, wings and talons on a lion body'),F('Name','Greek grýps; Old French griffon. The root is uncertain: maybe grypos ("hooked"), maybe a Semitic loanword'),
  F('Earliest art','Susa (Elam), 4th millennium BC; Egypt c. 3300–3100 BC'),F('First in Greek art','Reappears about 700 BC'),
  F('Meaning in heraldry','Strength, military courage and leadership'),F('Why it is "royal"','The lion is king of beasts and the eagle king of birds'),
  L('Famous job','Guarding gold and treasure'),L('Told to live in','India (Ctesias), Ethiopia (Pliny), the Riphean Mountains (Mela), the Hyperborean mountains (Isidore)'),
  L('Sworn enemy','Horses'),L('Medicine','Claws were said to cure; a feather could restore sight'),
  F('Christian reading','A symbol of Christ\'s dual human and divine nature'),
  GM('Game strengths','+6% rarer treasure, +5% provisions'),GM('Game stages','Hatchling, Fledgling, Juvenile, Legend, Ascendant'),GM('Game rival','Wild griffins race you on rides')],
 time:[['4th millennium BC','A winged lion with a beak and a male lion\'s mane is carved at Susa in Elam.'],['c. 3300–3100 BC','Griffin-like hybrids appear on Egyptian palettes, including the Two Dog Palette.'],['c. 1950–1550 BC','Raptor-headed beasts spread across Syria, the Levant and Anatolia.'],['15th century BC','The Throne Room fresco at Knossos, Crete, shows griffins (restored by Arthur Evans).'],['7th century BC','Aristeas of Proconnesus travels toward the Altai and collects the earliest griffin lore. His poem is lost.'],['c. 700 BC','Griffins return to Greek art, copying Neo-Hittite styles.'],['c. 460 BC','Aeschylus calls them the "silent hounds of Zeus".'],['mid-5th century BC','Herodotus repeats the story: griffins guard gold beyond the one-eyed Arimaspi, who steal it on horseback.'],['5th century BC','Ctesias places griffins in India and calls them four-legged, beaked birds.'],['1st century AD','Pliny the Elder is the first to say griffins have wings and long ears. Pomponius Mela puts them near the Riphean Mountains.'],['d. 235 AD','Aelian adds black back feathers, a red chest and white wings. He is the last ancient author to add new details.'],['636','Isidore of Seville calls them winged four-legged beasts that tear men apart.'],['c. 1100','The bronze Pisa Griffin (about 1.08 m tall, made in al-Andalus) is placed on Pisa Cathedral.'],['1280','Albertus Magnus repeats a medieval claim that griffins set agate in their eggs.'],['1383','An inventory lists two "griffin claws" for St. Cuthbert. The surviving ones are Alpine ibex horns.'],['1555','Trinity College, Oxford, is founded with three gryphons in its crest.'],['22 March 1961','Heraklion adopts a griffin as its official symbol.']],
 facts:['Many "griffin claws" in medieval churches were really horns. Charlemagne\'s drinking horn is bovine, and one at Kornelimünster Abbey is Asian buffalo horn.','Scholars think the Scythian word arimasp may mean "rich in horses". That could explain why griffins hated horses and why the "one-eyed" detail may be a mistake.','British heraldry has a wingless male griffin called a keythong, with a short tusk.','The opinicus has an eagle\'s head and wings, a lion\'s body and a camel\'s tail. It appears in the arms of the Worshipful Company of Barbers.','Fossil theory: Adrienne Mayor (2000) proposed that Scythian gold prospectors saw Protoceratops skeletons in the Gobi and invented the griffin. It is popular but contested: a 2024 paper argues the fossils lie hundreds of kilometres from the nearest gold, and that griffin art is older.','The Iranian airline Iran Air\'s logo comes from a griffin statue at Persepolis. The Saab Gripen fighter is named after the griffin.','Dante\'s Purgatorio has a chariot pulled by a griffin.'],
 sym:['Genoa: two griffins hold a shield with the Cross of St. George.','Perugia: a griffin wearing a mural crown, since the 13th century.','Pomerania: the red griffin of its dukes survives in Mecklenburg-Vorpommern\'s arms.','Purdue University (1969) and the College of William and Mary (mascot since 2010).'],
 kin:[{n:'Golden eagle (the "eagle" half)',rows:[F('Wingspan','1.8–2.34 m'),F('Weight','Males 2.8–4.6 kg, females 3.8–6.7 kg'),F('Heaviest wild eagle recorded','7.7 kg (Wyoming, 2006)'),F('Dive (stoop) speed','240–320 km/h'),F('Soaring speed','45–52 km/h'),F('Hind-claw (talon) length','4.5–6.3 cm'),F('Territory','Usually 20–200 km²'),F('Food per day','About 230–250 g'),F('Eggs / incubation','Up to 4 eggs, about 6 weeks'),F('Fledging','About 66–81 days'),F('Longest wild life','31 years 8 months'),F('Captive record','46 years')]},
  {n:'Lion (the "lion" half)',rows:[F('Head-body length','Females 160–184 cm, males 184–208 cm'),F('Weight','Females about 110–144 kg, males about 160–225 kg'),F('Sprint speed','48–59 km/h; 74.1 km/h recorded in 2018'),F('Roar carries','Up to 8 km'),F('Bite','About 1,594 N at the canine teeth (lioness)'),F('Lifespan','12–17 years wild, 20+ in captivity'),F('Resting','About 20 hours a day'),F('Pregnancy','About 110 days, 1–4 cubs'),F('Pride','About 15 on average, up to 30 seen')]},
  {n:'Protoceratops (the fossil suspect)',rows:[F('Length','Up to 2–2.5 m'),F('Weight','About 62–104 kg'),F('Lived','Late Cretaceous, 75–71 million years ago'),F('Found','2 September 1922, Flaming Cliffs, Mongolia, by James B. Shackelford'),F('Notable','A parrot-like beak and a neck frill')]}],
 src:'Griffin article (Wikipedia), Golden eagle, Lion and Protoceratops articles, A. Mayor (2000), and Witton et al. (2024) on the fossil theory.'},

hippogriff:{aka:'Hippogryph. Not a creature of ancient myth: it has an author.',
 intro:'The hippogriff is the youngest creature here, and the only one with a known inventor. It was born from a joke about impossible things.',
 sheet:[F('Inventor','Ludovico Ariosto, in Orlando Furioso, 1516'),F('Body','Front half eagle, hind half horse'),F('Parents (in the poem)','A griffin father and a mare, a pairing called impossible'),
  F('Name','Greek hippos ("horse") + Italian grifo ("griffin")'),F('First English name','"Griffith horse" (Harington, 1591)'),F('"Hippogriff" in English','Shortly before 1615'),
  F('The proverb behind it','Virgil, Eclogue 8: griffins will mate with mares, meaning "the impossible"'),
  L('Speed','Fast enough to circle the world and reach the Moon'),L('First owner','The sorcerer Atlante'),L('Famous riders','Ruggiero, who frees Angelica on its back; Astolfo, who borrows it to seek Roland\'s lost wits'),
  F('Rival word source','Lucian\'s 2nd-century Vera Historia has "Hippogypians" on the Moon, riding giant three-headed vultures'),
  GM('Game strengths','+15% wild friendship, +5% bond'),GM('Game signature tricks','Rear and Cry, Hill Canter'),GM('Game fun fact','Its wild kin are easier to befriend')],
 time:[['c. 39 BC','Virgil writes Eclogue 8, where griffins mating with mares stands for the impossible.'],['2nd century AD','Lucian of Samosata\'s Vera Historia describes "Hippogypians" riding vultures on the Moon.'],['1516','Ludovico Ariosto publishes Orlando Furioso and invents the hippogriff.'],['1591','John Harington\'s English translation calls it a "Griffith horse".'],['c. 1615','"Hippogriff" enters English.'],['1863','Thomas Bulfinch\'s Legends of Charlemagne describes it with an eagle\'s head and taloned claws.'],['1904','A fake monster called "The Hippogriff" is used in a Lake George, New York, hoax. Sightings revive in 1999, and a replica is shown in August 2002.'],['1922','E. R. Eddison\'s The Worm Ouroboros features hippogriffs.'],['1932–1936','C. S. Lewis writes a poem about the hippogriff.'],['1974','A hippogriff is on the cover of the third booklet of the original Dungeons & Dragons.']],
 facts:['Ariosto\'s hippogriff is a steed. People ride it, and its owner is a sorcerer who rides it around the world.','Gustave Doré drew it often for 19th-century editions.','The Wizarding World of Harry Potter has a roller coaster named "Flight of the Hippogriff", after Buckbeak.','In P. G. Wodehouse, Bertie Wooster calls it a fearsome monster.','The word itself is a joke that came true: a creature built from something the Romans said could never happen.'],
 sym:['Emblem-book and tapestry creature of the Renaissance: a symbol of poetic invention.','Appears in Dungeons & Dragons, Warhammer, My Little Pony: The Movie (2017) and Fate/Apocrypha.'],
 kin:[{n:'Golden eagle (front half)',rows:[F('Wingspan','1.8–2.34 m'),F('Dive speed','240–320 km/h'),F('Hind-claw length','4.5–6.3 cm'),F('Weight','About 3–7 kg')]},
  {n:'Horse (hind half)',rows:[F('Height','Light riding horses 14–16 hands'),F('Weight','Light 380–550 kg, draft 700–1,000 kg'),F('Gallop','Average 40–48 km/h; sprint record 70.76 km/h'),F('Pregnancy','About 340 days (320–370)'),F('Lifespan','25–30 years on average; the oldest verified lived 62'),F('Bones','About 205'),F('Vision','More than 350° around, about 65° binocular'),F('Ears','Each can rotate up to 180°'),F('Sleep','About 2.9 hours a day on average'),F('Domesticated','Around 3500–3000 BC on the steppe')]}],
 src:'Hippogriff, Horse and Golden eagle articles (Wikipedia); Virgil, Eclogue 8; Ariosto, Orlando Furioso.'},

phoenix:{aka:'In Greek, phoinix. The Egyptian ancestor is the Bennu.',
 intro:'The bird that dies in fire and rises again. Behind the Greek story is an older Egyptian bird that made the world with a cry.',
 sheet:[F('Name','Greek phoinix, possibly from a Semitic word for madder, a red dye, tied to the Phoenicians'),F('Egyptian ancestor','The Bennu of Heliopolis, a solar bird'),
  F('Earliest Greek mention','The Precepts of Chiron, attributed to Hesiod (8th century BC)'),
  L('Plumage (Herodotus)','Partly red, partly gold, roughly eagle-sized'),L('Details (Pliny)','A crest on its head and a golden sheen about the neck'),L('Details (Lactantius)','Blue eyes, larger than an ostrich'),L('Details (Ezekiel the Tragedian)','Red legs and yellow eyes'),
  L('Lifespan (Herodotus)','Returns to Egypt every 500 years'),L('Lifespan (Pliny, citing Manilius)','A 540-year cycle (sources differ on its dating)'),L('Lifespan (Hesiod fragment)','About 972 human lifetimes'),L('Lifespan (Tacitus)','A cycle of 500 or 1,461 years'),
  F('Seven rays','Early images give it a sun halo, often with seven rays like Helios'),F('Heraldry','An eagle\'s head, chest and wings rising from flames'),
  F('Cousins','Garuda, Slavic firebird, Persian simorgh, Georgian paskunji, Arabian anqa, Turkish Konrul, Tibetan Me byi karmo, Chinese fenghuang and zhuque'),
  GM('Game strengths','+10% Starlight'),GM('Game rebirth','Rises once per sky ride with 55% energy'),GM('Game stages','Cinder, Kindling, Blaze, Legend, Ascendant')],
 time:[['Old Kingdom Egypt','The Pyramid Texts mention the bnw, a bird tied to Atum. There it is a small singing bird.'],['8th century BC','The Precepts of Chiron, attributed to Hesiod, give the phoenix its huge lifespan.'],['5th century BC','Herodotus says the Heliopolitans described a bird that came every 500 years. He had only seen pictures of it.'],['1st century BC','Pliny, citing Manilius, ties a phoenix appearance to a 540-year cycle. Modern summaries date it to 96 BC, but readings differ.'],['34 AD','Tacitus reports an appearance in Egypt.'],['36 AD','Pliny cites Cornelius Valerianus for an appearance.'],['47 AD','A bird shown in Rome\'s Comitium. Pliny says no one doubted it was a fake.'],['4th century','The Gnostic text On the Origin of the World uses it as a sign of judgment and resurrection.'],['9th century','An Old English poem in the Exeter Book retells it as an allegory for Christ\'s resurrection.'],['14th century','Dante\'s Inferno (Canto XXIV) describes a phoenix dying and being reborn at 500 years.']],
 facts:['The Bennu was "He Who Came Into Being by Himself" and "Lord of Jubilees". His name comes from a verb meaning "to rise in brilliance".','In the Egyptian creation myth, the Bennu flew over the waters of Nun, landed on a rock, and called out what creation would be.','Egyptian sources never say the Bennu burned or died. The fire, pyre and ashes came later, in Greek tradition.','New Kingdom art shows the Bennu as a large grey heron with a two-feather crest. In 1977, human-sized heron remains from the UAE were named the Bennu heron (Ardea bennuides). It died out around 1500 BC and may have inspired the deity.','The Bennu was considered the ba (soul) of the god Ra.','Elizabeth I used the phoenix as an emblem, tied to her unmarried, childless status.','Phoenix fans: the Marvel Phoenix, Fawkes in Harry Potter and Marco in One Piece all draw on this bird.'],
 sym:['Fire, the sun, renewal and resurrection.','Pliny\'s verdict on the one in Rome: nobody would doubt it was a fabrication.','The phoenix is not the Chinese fenghuang. The two are separate birds that share some themes.'],
 kin:[{n:'Grey heron (like the Bennu in art)',rows:[F('Length','84–102 cm'),F('Wingspan','155–195 cm'),F('Weight','1–2 kg'),F('Lifespan','Oldest recorded 23 years; average about 5'),F('Eggs','Usually 3–5, incubated about 25 days'),F('Fledging','7–8 weeks'),F('Nest','Reused year after year until blown down'),F('Colonies','Up to 125 nesting trees (Vandu, Estonia)')]},
  {n:'Bennu heron (extinct)',rows:[F('Size','Human-sized'),F('Found','UAE, 1977'),F('Extinct','About 1500 BC'),F('Named','Ardea bennuides, by Ella Hoch')]}],
 src:'Phoenix (mythology), Bennu and Grey heron articles (Wikipedia); Herodotus, Pliny and Tacitus as summarised there.'},

pegasus:{aka:'In Greek, Pegasos. Named for springs.',
 intro:'The winged horse born from a monster\'s blood. It carried thunderbolts for Zeus, made a spring with one kick, and became a constellation.',
 sheet:[F('Father','Poseidon, in his role as horse-god'),F('Mother','Medusa, one of the three Gorgons'),F('Birth','From Medusa\'s blood when Perseus beheaded her, with his brother Chrysaor'),
  F('Name','Hesiod: from pēgē, "spring", for the springs (pegai) of Okeanos where he was born'),F('A rival idea','1952: from Luwian pihassas, "lightning". Robin Lane Fox (2009) called it implausible'),
  L('Famous rider','Bellerophon, who flew him against the Chimera'),L('Bridle','Athena\'s golden bridle, in the most common account'),L('Spring','Hippocrene, opened on Mount Helicon by a stamp of his hoof'),
  L('Job on Olympus','Carrying Zeus\'s thunderbolts (Hesiod, Theogony, about line 280 onward)'),L('Afterlife','Zeus set him among the stars'),
  F('Constellation size','1,121 square degrees, 7th largest of the 88'),F('Brightest star','Enif, magnitude about 2.4, about 690 light-years away'),F('Great Square','Markab, Scheat, Algenib and Alpheratz'),
  F('Stars listed','177 visible to the naked eye (magnitude 6.5 or brighter)'),GM('Game strengths','+10% outings while away, 15% slower tiring, rings 25% easier to catch'),GM('Game stages','Foal, Yearling, Skyrunner, Legend, Ascendant')],
 time:[['8th–7th century BC','Hesiod\'s Theogony names Pegasus and Chrysaor as born of Medusa\'s blood, and has Pegasus carry Zeus\'s thunderbolts.'],['5th century BC','Pindar\'s Olympian 13 tells of Bellerophon taming Pegasus with Athena\'s bridle.'],['480–460 BC','An Attic red-figure vase from Sicily shows the scene.'],['3rd century BC','Aratus\'s Phaenomena places Pegasus among the stars.'],['300–270 BC','A Hellenistic mosaic from Rhodes shows Bellerophon slaying the Chimera.'],['2nd century AD','Ptolemy lists Pegasus as one of his 48 constellations.'],['1st century AD','A Pompeian fresco depicts the myth.'],['1537','Benvenuto Cellini\'s coin for Cardinal Pietro Bembo makes Pegasus a Tuscan symbol.'],['1930s','Mobil adopts the flying red horse as its logo.'],['1941','British paratroopers adopt a Bellerophon-on-Pegasus badge.'],['5–6 June 1944','The British 6th Airborne captures Pegasus Bridge near Ouistreham.'],['26 April 2013','Ecuador\'s Pegaso satellite is launched. It is later damaged by space debris.']],
 facts:['Corinth put Pegasus on its early coins as a civic symbol, tied to a cult of Athena Hippia.','The star Markab\'s name means "the saddle of the horse" in Arabic.','51 Pegasi, just over 50 light-years away, was the first Sun-like star found with a planet. The planet is a hot Jupiter that orbits every four days. It was found by Michel Mayor and Didier Queloz.','Pegasus is visible to anyone north of 53° south latitude.','The Inner Temple, a London legal society, uses a pegasus rampant in its arms.','Bellerophon fell trying to reach Olympus. Pegasus kept going and was stabled with Zeus\'s horses.'],
 sym:['Poetry and inspiration (Hippocrene, the spring of the Muses).','Airborne troops of the UK.','Pegasus Airlines (Istanbul), TriStar Pictures and the flag of Tuscany.'],
 kin:[{n:'Horse',rows:[F('Height','Light riding horses 14–16 hands'),F('Weight','Light 380–550 kg'),F('Gallop','Average 40–48 km/h; sprint record 70.76 km/h'),F('Pregnancy','About 340 days'),F('Lifespan','25–30 years; oldest verified lived 62'),F('Bones','About 205'),F('Vision','More than 350° around'),F('Ears','Rotate up to 180° each'),F('Sleep','About 2.9 hours a day'),F('Breeds','More than 300')]},
  {n:'Pegasus the constellation',rows:[F('Area','1,121 square degrees (7th of 88)'),F('Enif','Magnitude 2.37–2.45, about 690 ly'),F('Scheat','A red giant, about 196 ly'),F('Markab','Magnitude 2.48, about 133 ly'),F('Algenib','About 391 ly, a Beta Cephei variable'),F('Stars within 32.6 ly','4')]}],
 src:'Pegasus and Pegasus (constellation) articles (Wikipedia); Hesiod, Pindar and Aratus as summarised there.'},

wyvern:{aka:'Wivern, wyver. From the Latin for "viper".',
 intro:'Strictly a heraldic beast: a two-legged dragon whose wings are its front limbs. The name comes from the snake.',
 sheet:[F('Name','Middle English wyver (14th century), from Anglo-French wivre, from Latin vīpera, "viper"'),F('The "-n"','In place by the early 17th century (Guillim, 1610: "wiverne")'),
  F('Classic shape','Two legs, wings, a barbed tail. (A dragon has four legs, but only in English, Welsh, Scottish, French and Irish heraldry.)'),
  F('Earliest heraldic "wyver"','The Banneret\'s Roll of 1312'),F('Rules fixed','16th century: Legh (1562), Guillim (1610), Gibbon (1682: "hath but two Legs")'),
  F('Medieval mix-up','In the 14th–15th centuries, dragon, wyrm and wyver were used interchangeably'),
  F('Ancient cousins','Wadjet, the winged cobra of Egypt; Herodotus\'s winged serpents killed by ibises; Euripides\' Medea (431 BC) has winged serpents pulling Helios\'s chariot; Ovid (8 AD) has winged, fire-breathing serpents'),
  F('Earliest bestiary','A 13th-century manuscript, Harley MS 3244, shows a wyvern'),
  F('Aircraft','The Westland Wyvern, a 1950s strike aircraft used in the 1956 Suez Crisis'),
  F('Our note','The wyvern in this game is drawn with four legs, so heraldically it is a small dragon. It keeps the wyvern name for its snake-like lineage.'),
  GM('Game strengths','20% less ride damage, +10% provisions, +4% treasure'),GM('Game signature tricks','Ember Puff, Tail Slam'),GM('Game stages','Hatchling, Whelp, Drake, Legend, Ascendant')],
 time:[['431 BC','Euripides\' Medea has winged serpents pull the chariot of Helios.'],['8 AD','Ovid\'s Metamorphoses describes winged serpentine creatures with fiery breath.'],['13th century','Harley MS 3244 includes a wyvern, among the earliest known.'],['14th century','The word wyver appears in Middle English.'],['1312','The earliest documented heraldic wyver, in the Banneret\'s Roll.'],['c. 1278–1322','Thomas, Earl of Lancaster and Leicester, is said to have used a wyvern as his crest.'],['1562','Gerard Legh\'s Accedens of Armory sets out the rules.'],['1610','John Guillim writes "wiverne" in his Display of Heraldrie.'],['1619','A silver wyvern is recorded at the Leicestershire heraldic visitation.'],['1682','John Gibbon stresses that a wyvern has only two legs.'],['1845','The Midland Railway adopts the wyvern.'],['1956','The Westland Wyvern flies in the Suez Crisis.']],
 facts:['In heraldry, the two-legs-versus-four rule is mostly an English-speaking habit. Other European countries do not follow it.','A green wyvern is on the emblem of Terni, Italy, locally called "Thyrus".','Two wyverns are supporters in the royal arms of Portugal, and a wyvern is the crest of the House of Braganza.','The Zilant, a winged serpent, is on the coat of arms of Kazan.','The flag of the former Duchy of Masovia features a wyvern.','The US Army\'s 3rd Infantry Division emblem and the WWII 43rd (Wessex) Division insignia use wyverns.','Medieval wyverns had no standard fire: in heraldry they are poisonous snake-dragons first.'],
 sym:['Fierce guardianship and menace.','Mascots: SK Wyverns (Korea Baseball), King\'s College at the University of Queensland, and Yamagata Wyverns (Japan).','Games: Monster Hunter, Ark: Survival Evolved and Terraria.'],
 kin:[{n:'Komodo dragon (a real dragon)',rows:[F('Length','Up to about 3 m'),F('Weight','Up to 87 kg wild; captive record 166 kg'),F('Sprint','Up to about 20 km/h'),F('Teeth','About 60, serrated, up to 2.5 cm'),F('Smell','Carrion at 4–9.5 km'),F('Lifespan','Up to about 30 years'),F('Eggs','Up to about 20, incubated 7–8 months'),F('Young live in trees','Yes, for their first few years'),F('Known to science','1910'),F('Population','About 3,000 (2015)'),F('Status','Endangered')]},
  {n:'Quetzalcoatlus (a real flying giant)',rows:[F('Wingspan','Recent estimates 10–11 m'),F('Weight','Mostly 200–250 kg estimated'),F('Standing height','Shoulders 2–3 m, head over 4 m'),F('Lived','67–66 million years ago'),F('Found','1971, Big Bend National Park, Texas, by Douglas Lawson'),F('Launch','Probably pushing off on four limbs'),F('Modelled flight','Up to 130 km/h')]},
  {n:'Flying dragon lizards (Draco)',rows:[F('Species','About 41'),F('Length','15–40 cm'),F('Glide','Up to 60 m, losing about 10 m of height'),F('Wings','Skin flaps held out by extended ribs'),F('Diet','Ants and termites'),F('Range','Southeast Asia, one species in southern India')]}],
 src:'Wyvern article (Wikipedia); Komodo dragon, Quetzalcoatlus and Draco articles (Wikipedia).'}};
const need=(i,n)=>Math.min(BOND.length-1,Math.floor(i*(BOND.length-1)/Math.max(1,n-1)));
const STAT_TAG={f:'Fact',l:'Legend',g:'Game'};
const statRow=r=>`<div class="st"><span>${r[0]}</span><b>${r[1]}</b><i class="${r[2]}">${STAT_TAG[r[2]]}</i></div>`;
function naturePlate(name){
 const rules=[['Golden eagle','golden-eagle'],['Lion','lion'],['Protoceratops','protoceratops'],['Horse','horse'],['Grey heron','grey-heron'],['Bennu heron','bennu-symbol'],['Komodo dragon','komodo'],['Quetzalcoatlus','quetzalcoatlus'],['Flying dragon','draco'],['Harpy eagle','harpy-eagle'],['Peregrine falcon','peregrine'],['Rhamphorhynchus','rhamphorhynchus']];
 const match=rules.find(r=>name.startsWith(r[0]));
 if(!match)return `<div class="nature-astronomy"><span aria-hidden="true">✧ · ✦ · ✧</span><p>Celestial reference · see the astronomical measurements below. Decorative stars, not a star map.</p></div>`;
 const key=match[1], caption=key==='bennu-symbol'?'Symbolic Bennu-inspired artwork, not a reconstruction of the extinct heron.': ['protoceratops','quetzalcoatlus','rhamphorhynchus'].includes(key)?'Speculative artistic reconstruction; appearance and colors are not established by this artwork.':name.startsWith('Horse domestication')?'Modern horse illustration; not a depiction of an archaeological specimen.':'Modern artistic illustration; not a scientific specimen photograph.';
 const url='assets/lore/nature-'+key+'.webp';return `<figure class="nature-plate"><a href="${url}" target="_blank" rel="noopener" aria-label="Open larger natural-history illustration"><img src="${url}" loading="lazy" alt="${key==='bennu-symbol'?'Symbolic Bennu bird':match[0]}"></a><figcaption>${caption}</figcaption></figure>`;
}

function pLore(){const cur=SUB.lore||S.species;const sp=SPECIES[cur],d=LORE[cur];
  let h=seg('story',[['journal','Journal'],['lore','Lore'],['record','Record'],['boons','Boons'],['deeds','Deeds'],['daily','Daily']]);
  h+=`<div class="chips" data-nosx="1">${SPEC_ORDER.map(id=>`<button class="chip ${id===cur?'on':''}" data-act="loresp" data-id="${id}">${id===S.species?'★ ':''}${SPECIES[id].w[0].toUpperCase()+SPECIES[id].w.slice(1)}</button>`).join('')}</div>`;
  h+=`<div class="lore" data-nosx="1"><div class="lore-heading">The illustrated bestiary · ${SPEC_ORDER.indexOf(cur)+1} of ${SPEC_ORDER.length}</div><figure class="lore-cover"><img src="assets/${cur}.webp" loading="lazy" alt="Fantasy illustration of ${sp.w}"><figcaption>Artist’s interpretation · Aerie</figcaption></figure><h3 style="margin:8px 0 2px">${sp.w[0].toUpperCase()+sp.w.slice(1)}</h3><p class="note" style="margin:0 0 6px"><i>${d.aka}</i></p><p>${d.intro}</p>
   <p class="note"><i class="f">Fact</i> documented history or measured science &nbsp; <i class="l">Legend</i> what the old stories say &nbsp; <i class="g">Game</i> how it works in Everhatch</p>
   <details open><summary>Field guide <span class="pill">${d.sheet.length} stats</span></summary>${d.sheet.map(statRow).join('')}</details>
   <details><summary>Timeline <span class="pill">${d.time.length}</span></summary>${d.time.map(t=>`<div class="tl"><b>${t[0]}</b><span>${t[1]}</span></div>`).join('')}</details>
   <details><summary>Did you know <span class="pill">${d.facts.filter((_,i)=>need(i,d.facts.length)<=lvl()).length}/${d.facts.length} found</span></summary>${d.facts.map((t,i)=>need(i,d.facts.length)<=lvl()?`<p class="fx">${t}</p>`:`<p class="fx" style="opacity:.55">Locked. Reach bond level <b>${BOND[need(i,d.facts.length)].n}</b> to learn this one.</p>`).join('')}</details>
   <details><summary>Symbols and places</summary>${d.sym.map(t=>`<p class="fx">${t}</p>`).join('')}</details>
   <details><summary>Real-world kin and measurements <span class="pill">${d.kin.reduce((a,k)=>a+k.rows.length,0)} numbers</span></summary>${d.kin.map(k=>`<section class="nature-entry"><h4>${k.n}</h4>${naturePlate(k.n)}${k.rows.map(statRow).join('')}</section>`).join('')}</details>
   <p class="note" style="margin-top:8px">Sources: ${d.src} Legends are reported as stories, not as facts.</p></div>`;
  return h}
function recStats(){const n=Math.max(1,Math.floor((Date.now()-(S.since||Date.now()))/86400000)+1);
  const regs=Object.keys(S.regions||{}),ex=regs.reduce((a,k)=>a+Math.floor((S.regions[k]&&S.regions[k].ex)||0),0);
  const wl=S.wild||{},wild=Object.keys(wl).filter(k=>wl[k]&&wl[k].met).length,bff=Object.keys(wl).filter(k=>wl[k]&&wl[k].fr>=10).length;
  const tm=TRICKS.filter(t=>!t.sp||t.sp===SPEC.id),tk=t=>{const v=(S.tricks||{})[t.id];return typeof v==='number'?v:(v&&(v.n||v.xp||v.lv))||0};
  const known=tm.filter(t=>tk(t)>0).length;
  const sk=Object.keys(SKILLS).map(k=>S.sk[k]||0);
  const hv=x=>typeof x==='number'?x:1;const items=ITEMS.filter(i=>S.hoard[i.id]).length,tot=Object.values(S.hoard).reduce((a,b)=>a+hv(b),0);
  const dt=domTrait(),tr=S.tr||{};const boons=Object.values(S.boons||{}).reduce((a,b)=>a+b,0);
  const st=stage(),nx=BOND[lvl()+1],c=S.cnt||{},r=S.rides||{};
  const gp=STAGES[st+1]?Math.round(100*(S.growth-STAGES[st].g)/(STAGES[st+1].g-STAGES[st].g)):100;
  return[['Your '+SPEC.w,[
   ['Name',S.name||'(unnamed)'],['Kind',SPEC.w[0].toUpperCase()+SPEC.w.slice(1)+(COATS[S.coat]?' · '+COATS[S.coat].n:'')],['Days together',n],['Generation',S.gen||1],['Stage',STAGES[st].n],['Growth',Math.round(S.growth)+' pts'+(STAGES[st+1]?' ('+gp+'% to '+STAGES[st+1].n+')':' (final stage)')],
   ['Dominant nature',dt?TRAIT_ADJ[dt]:'Still forming'],['Path',S.path&&PATHS[S.path]?PATHS[S.path].n:'None yet'],['Offspring in the family',(S.roster||[]).length]]],
   ['Bond',[['Bond level',BOND[lvl()].n+' ('+(lvl()+1)+'/'+BOND.length+')'],['Bond points',Math.round(S.bondXP)+(nx?' / '+nx.xp+' next':'')],['Boons kindled',boons],['Deeds earned',Object.keys(S.ach||{}).length+'/'+DEEDS.length],['Visit streak',(S.streak||0)+' days']]],
   ['Nature scores',['bold','gentle','fierce','mischief'].map(k=>[TRAIT_ADJ[k],Math.round(tr[k]||0)])],
   ['Skills',Object.keys(SKILLS).map(k=>[SKILLS[k].n,'Level '+skLv(k)]).concat([['Total skill levels',sk.reduce((a,b)=>a+Math.floor(b/6),0)]])],
   ['Care and training',[['Training sessions',c.train||0],['Trick practices',c.tp||0],['Provisions',Math.round(S.prov||0)],['Starlight',S.stars||0]]],
   ['Tricks',[['Tricks for your kind',tm.length],['Started',known]]],
   ['Sky and travel',[['Expeditions completed',r.exped||0],['Sky rides',r.n||0],['Best ride score',r.best||0],['Races vs wild kin',r.races||0],['Races won',r.raceWins||0],['Places explored',regs.filter(k=>S.regions[k]&&S.regions[k].ex>0).length+'/'+REGIONS.length],['Wild creatures met',wild+'/'+WILD.length],['Best friends',bff]]],
   ['Treasures and nest',[['Treasure types',items+'/'+ITEMS.length],['Treasures held (total)',tot],['Nest tier',(S.nest.tier+1)+'/'+TIERS.length],['Decor placed',S.nest.slots.filter(Boolean).length+'/'+S.nest.slots.length],['Gear worn',Object.values(S.eq||{}).filter(Boolean).length]]]]}
function pRecord(){let h=seg('story',[['journal','Journal'],['lore','Lore'],['record','Record'],['boons','Boons'],['deeds','Deeds'],['daily','Daily']]);
  h+=`<div class="lore">`+recStats().map(g=>`<h4>${g[0]}</h4>${g[1].map(r=>`<div class="st"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}`).join('')+`</div>`;return h}
ACTS.loresp=el=>{SUB.lore=el.dataset.id;renderPanel()};

const WNAMES={hippogriff:['Bracken','Gale','Pip','Marrow','Atlanta'],phoenix:['Ember','Flare','Spark','Ashen','Solara'],pegasus:['Whisper','Bolt','Skip','Hesper','Helia'],wyvern:['Moss','Fang','Nip','Sulfur','Cinder']};
{const base=WILD.map(w=>w.n);const o=applySpecies;applySpecies=function(id,q){o(id,q);const a=WNAMES[id]||base;WILD.forEach((w,i)=>{w.n=a[i]||base[i]})}}


/* ============================ bestiary: deep dive (more sources) ============================ */
const ADD=(id,o)=>{const d=LORE[id];d.sheet.push(...(o.sheet||[]));d.facts.push(...(o.facts||[]));d.sym.push(...(o.sym||[]));d.kin.push(...(o.kin||[]));d.more=o.more||[];d.links=o.links||[]};
ADD('griffin',{
 sheet:[F('Oldest written source','Aristeas of Proconnesus, Arimaspea (lost). Herodotus preserves its outline'),F('Aristeas’s map of the north','Issedones, then one-eyed Arimaspi, then gold-guarding griffins, then the Hyperboreans'),F('Pausanias (2nd c. AD)','Says Aristeas has griffins fighting the Arimaspi for gold beyond the Issedones'),
  F('Aeschylus, Prometheus Bound','Io is warned to avoid the north, where the Arimaspi and griffins live'),F('Herodotus’s own doubt','He did not believe in one-eyed men and gave a Scythian word meaning "one eye" as the name'),
  F('Scythian adoption','Probably took the lion-headed griffin from Mesopotamia after conquering the Near East in the 7th c. BC'),F('Scythian forms','Both eagle-headed (Greek fashion) and lion-headed (West Asian style)'),
  F('Maikop tomb (5th c. BC)','Gold griffin ornaments sewn onto clothing and tall caps as status marks'),F('Pazyryk "Ice Maiden" (5th c. BC)','A shoulder tattoo of a stag whose antlers end in griffin heads'),
  F('Greco-Scythian gold scabbard','About 340–320 BC, probably made in a Greek city such as Pantikapaion (Kerch). Begins with a frieze of horned griffins'),
  F('Red-figure vase','A 4th c. BC Athenian wine jar shows archers in patterned trousers, read as Arimaspeans'),
  F('Contamination of lore','Scholars think India’s "gold-digging ants" story bled into griffin tales'),
  L('Gold story','Griffins dig and guard gold, and the Arimaspi steal it on horseback'),L('Later retellings','Strabo and Pliny repeat the one-eyed gold-thief story')],
 facts:['Herodotus names the griffins and Arimaspi at second hand. He never claims to have seen either, only that Aristeas wrote about them.','Aristeas’s poem is lost. Everything we know comes from people quoting or summarizing it, so even the "oldest" griffin story is a copy of a copy.','On the Scythian gold scabbard, the animals are shown fighting. A deer is attacked by a lion and a griffin together.','The Arimaspi and griffins were a popular pair in Greek art. A vase painter only had to draw trousers, a hat and a bow to say "Arimaspian".','A Heidelberg-hosted article re-examines griffin imagery in art as a test of the fossil theory.','An Oxford article on the Arimaspeans notes that every ancient source goes back to Aristeas. Aeschylus and Herodotus agree they were one-eyed horsemen who pushed the Scythians west.','Lewis Carroll’s Gryphon, who takes Alice to the Mock Turtle, first appeared in 1865.','Gryffindor in Harry Potter is a pun on "griffin d’or", the golden griffin.'],
 sym:['Scythian gold: dress plaques, scabbards and caps.'],
 kin:[{n:'Harpy eagle (largest living eagle talons)',rows:[F('Length','86.5–107 cm'),F('Wingspan','176–224 cm'),F('Weight','Females 6–9 kg, males 4–6 kg'),F('Talon length','About 8.6 cm males, 12.3 cm females'),F('Prey','About 116 species recorded, mostly sloths and monkeys'),F('Can carry','Up to about half its own body weight'),F('Eggs','Two, incubated about 56 days'),F('Chick rearing','One chick every 2–3 years, fledges around 6 months'),F('Status','Vulnerable (IUCN)')]},
  {n:'Peregrine falcon (speed record holder)',rows:[F('Length','34–58 cm'),F('Wingspan','74–120 cm'),F('Weight','Males 330–1,000 g, females 700–1,500 g'),F('Stoop speed','A 2005 recording reported 389 km/h. The highest reliably radar-measured figure is 184 km/h'),F('Flicker-fusion vision','About 129 Hz'),F('Clutch','Usually 3–4 eggs'),F('Incubation','29–33 days'),F('Fledging','42–46 days'),F('Longest wild life','19 years 9 months'),F('DDT recovery','US removed it from the endangered list on 25 August 1999')]}],
 more:[{t:'The story of the gold',k:'p',items:['Aristeas of Proconnesus was a Greek poet who said, in a poem now lost, that he had travelled far to the north, past the Issedones. Beyond them, he said, lived one-eyed men called Arimaspi, and beyond those, griffins that guarded gold.','Herodotus (5th century BC) reported all this carefully and did not vouch for it. He doubted the one-eyed men and offered a Scythian word-play to explain the name.','In the telling, the Arimaspi were horsemen who stole gold from the griffins. Later writers took this to mean that griffins hated horses, an idea that Isidore of Seville still repeats about a thousand years later.','Modern scholars argue about what lay behind it. One idea is that Greeks heard travellers’ stories about gold in the Altai mountains, mixed with Mesopotamian art and perhaps fossil bones. The art itself is much older than the story.']},
  {t:'Names across languages',k:'st',items:[F('Greek','grýps (gen. grypós)'),F('Latin','gryps, grypus'),F('Old French','griffon'),F('Middle Persian','paškuč, "griffin or monster like one"'),F('Persian','šērdāl, "lion-eagle"'),F('Related Persian bird','Sēnmurw, the simurgh')]},
  {t:'Griffins in the wild: where to find them',k:'st',items:[F('Susa, Elam','Earliest winged-lion with beak, 4th millennium BC'),F('Egypt','Two Dog Palette and similar, c. 3300–3100 BC'),F('Knossos, Crete','Throne Room fresco, 15th c. BC (restored)'),F('Maikop, Russia','Gold ornaments, 5th c. BC'),F('Pazyryk, Siberia','Tattooed griffin heads, 5th c. BC'),F('Pisa, Italy','Bronze Pisa Griffin, c. 1100, about 1.08 m tall'),F('Persepolis','Griffin statue that inspired Iran Air’s logo'),F('Oxford','Three gryphons in Trinity College’s crest, 1555'),F('Heraklion','Official symbol from 22 March 1961')]},
  {t:'Griffins in books, games and brands',k:'list',items:['Dante, Purgatorio (c. 1320): a griffin pulls a chariot.','Lewis Carroll, Alice’s Adventures in Wonderland (1865): the Gryphon.','Harry Potter: Gryffindor’s emblem is a lion, but the house name is a griffin pun.','Saab’s Gripen fighter takes its name from the Swedish word for griffin.','Purdue University (1969) and the College of William and Mary (mascot since 2010).']}],
 links:[['Wikipedia: Griffin','https://en.wikipedia.org/wiki/Griffin'],['Met Museum: Scythian art, gold and griffins','https://www.metmuseum.org/essays/scythian-art'],['Theoi: Arimaspoi (ancient quotes)','https://theoi.com/Phylos/Arimaspoi.html'],['Wikipedia: Arimaspi','https://en.wikipedia.org/wiki/Arimaspi'],['Oxford ORA: Who were the Arimaspeans?','https://ora.ox.ac.uk/objects/uuid:5a72cd9a-26ca-4b26-ad21-b0fc71480f73'],['Wikipedia: Harpy eagle','https://en.wikipedia.org/wiki/Harpy_eagle'],['Wikipedia: Peregrine falcon','https://en.wikipedia.org/wiki/Peregrine_falcon']]});
ADD('hippogriff',{
 sheet:[F('First appears','Orlando Furioso, canto IV, stanza 18 (poem first printed 1516)'),F('Ariosto’s claim','Not a magical illusion: a real animal, from a griffin father and a mare'),F('Home (in the poem)','The Riphean Mountains, far beyond the frozen seas, where they are rare'),
  F('Poem written','1506–1532 in three editions (1516, 1521, 1532)'),F('A sequel','Orlando Furioso continues Boiardo’s Orlando Innamorato, published after his death in 1495'),
  F('Ruggiero’s flight','Ruggiero is carried to Alcina’s island, where a myrtle tree turns out to be the knight Astolfo'),F('Atlante','The sorcerer raised Ruggiero in a steel castle to keep him from his fate'),
  F('Astolfo’s flights','He rides it to Ethiopia, meets the emperor Senapo (Prester John), and in canto 34 flies it to the Moon'),F('What he finds on the Moon','Orlando’s lost wits, kept in a jar'),
  F('Bradamante','The Christian woman knight who loves Ruggiero and fights Atlante for him'),F('Illustrators','Gustave Doré (19th c.), Louis-Édouard Rioult (1824), and Ingres’s Roger Rescuing Angelica (1819, Louvre)'),
  F('Link to Lucian','Lucian’s True History (2nd c. AD) has Hippogypians on the Moon, so Ariosto may have been nodding to it'),F('J. K. Rowling','Has said the hippogriff comes from literary tradition, though she never cited Ariosto'),
  L('Impossible mating','Virgil’s proverb: griffins will mate with mares, so never')],
 facts:['The word started life as a joke. Virgil used "griffins mate with mares" to mean the impossible, and Ariosto declared the impossible real.','The 19th-century scholar Thomas Bulfinch retold it in Legends of Charlemagne (1863), which spread the creature into English children’s books.','On Ariosto’s Moon, things lost on Earth are kept, including lost time and the wits of the mad.'],
 sym:['Renaissance emblem of poetic imagination, since it joins what cannot join.','Ingres and Doré: the hippogriff as romantic adventure.'],
 kin:[{n:'Horse domestication (the horse half)',rows:[F('Botai, Kazakhstan','About 3700–3500 BC: bit-like tooth wear and mare’s-milk residue'),F('DOM2 lineage','All modern domestic horses descend from it, about 2200 BC, Volga–Don region'),F('Chariots','Sintashta and Petrovka graves, 2100–1700 BC'),F('Spread','Chariots reach Greece, Egypt and Mesopotamia within about 500 years'),F('Przewalski’s horse','Not the ancestor of domestic horses; may descend from Botai horses (2018, debated)')]}],
 more:[{t:'The story, in short',k:'p',items:['Ruggiero, a young knight, was raised by the sorcerer Atlante in a steel castle. Atlante’s winged horse belonged to the sorcerer. When Bradamante came to break the castle, the hippogriff ended up carrying Ruggiero away.','The beast carried Ruggiero across the world. On Alcina’s island he tied it to a myrtle that cried out. It was Astolfo, an English knight turned into a tree by the sorceress.','Later Astolfo gains the hippogriff himself and uses it to visit Ethiopia and then the Moon, where he recovers the lost wits of Orlando, who had gone mad for love.','Throughout the poem the hippogriff is a means of travel and rescue, not a fighter: Ruggiero uses it to free Angelica.']},
  {t:'Names across languages',k:'st',items:[F('Italian','ippogrifo'),F('French','hippogriffe'),F('Greek roots','hippos ("horse") + grýps ("griffin")'),F('Earliest English','"Griffith horse," in Harington’s 1591 translation')]}],
 links:[['Wikipedia: Hippogriff','https://en.wikipedia.org/wiki/Hippogriff'],['Wikipedia: Orlando Furioso','https://en.wikipedia.org/wiki/Orlando_furioso'],['British Academy: Ariosto, Harry Potter and hippogriffs','https://www.britac.ac.uk/blog/ariosto-harry-potter-and-hippogriffs-weaving-textual-webs'],['Poetry in Translation: Ariosto','https://www.poetryintranslation.com/PITBR/Italian/AriostoCantoVI.php'],['Wikipedia: Horse domestication','https://en.wikipedia.org/wiki/Horse_domestication']]});
ADD('phoenix',{
 sheet:[F('Mycenaean Linear B','The word po-ni-ke probably meant "griffin", but may have meant "palm tree"'),F('Herodotus','Had only seen pictures of it. Did not find the story credible'),F('Tacitus, Annals 6.28','Dates an appearance to 34 AD and lists cycles of 500 or 1,461 years (the Sothic cycle)'),
  F('Cassius Dio 58.26–27','Dates an appearance to 36 AD'),F('Roman showing, 47 AD','A phoenix is displayed in Rome’s Comitium for the city’s 800th anniversary. Pliny says nobody doubted it was a fake'),
  F('Aberdeen Bestiary (c. 1200)','Bird of Arabia, over 500 years old, builds a pyre of aromatic twigs and burns itself'),F('Its name, per the bestiary','From its purple-red color (Phoenician purple), or because only one exists'),
  F('Bestiary moral','Linked to the resurrection of Christ and of the righteous'),F('Exeter Book','A 677-line Old English poem (9th c.) retells it as an allegory of the resurrection'),
  F('Elizabeth I','Adopted the phoenix as an emblem. Nicholas Hilliard painted her with it, 1575–76'),F('Heraldry','Eagle’s head, chest and wings rising from flames. Usually a crest, rarely a shield charge'),
  F('Phoenix constellation','469 square degrees, 37th largest. Brightest star Ankaa, magnitude 2.4, about 77 light years away'),F('Constellation origin','Petrus Plancius, from observations by Keyser and de Houtman. First on a 1597 (or 1598) Amsterdam globe'),
  F('Meteor shower','The Phoenicids peak around 4–5 December, but do not appear every year'),F('Visible','Below the horizon for anyone north of 40° N'),
  L('Details (Claudian)','Tyrian-purple legs and blue-and-gold wings'),L('Carrying its parent','Herodotus: it brings its dead parent to Egypt inside a ball of myrrh')],
 facts:['The Greek word phoinix also meant the color purple-red and the date palm, which is part of why the bird’s true origin is so tangled.','Egyptians never describe the Bennu burning. The fire and ashes are Greek and later.','Herodotus’s phrase is basically "I have only seen paintings." He is the first major writer to flag his own doubt.','In the Aberdeen Bestiary’s first phoenix page, the bird burns itself. The rebirth appears on later pages, and the moral lesson ties it to resurrection.','Different writers could not agree on the cycle: 500 years, 540 years, or 1,461 years, the last being the Egyptian Sothic cycle.','Shakespeare and Fletcher’s Henry VIII uses the phoenix to speak of Elizabeth’s heir.','Thomas Carlyle used the phoenix in Sartor Resartus as a picture of history’s cycles of renewal.','Phoenix the constellation was invented in the 1590s by Dutch sailors charting the southern sky. Its name reuses the old Greek and Egyptian bird.'],
 sym:['Elizabeth I of England: the phoenix stood for her unique, unmarried queenship.','The Phoenix Cluster of galaxies, about 5.7 billion light years away, lies inside the constellation.'],
 kin:[{n:'Peregrine falcon (a real bird that came back from the brink)',rows:[F('Stoop speed','A 2005 recording reported 389 km/h; the highest reliably measured is 184 km/h'),F('DDT collapse','1950s–70s, eggshells thinned and populations crashed'),F('Recovery','After the early-1970s DDT ban, protected nests and releases brought it back'),F('US delisting','25 August 1999'),F('UK count','About 1,402 breeding pairs in 2011')]},
  {n:'Phoenix constellation',rows:[F('Area','469 square degrees (37th of 88)'),F('Ankaa','Orange giant, magnitude about 2.4, 77 ly'),F('Gliese 915','White dwarf about 26 ly away'),F('HLX-1','The first intermediate-mass black hole identified'),F('El Gordo','Galaxy cluster about 7.2 billion ly away'),F('Robert’s Quartet','Four galaxies merging')]}],
 more:[{t:'The story, in layers',k:'p',items:['Egypt: the Bennu, a heron-like bird tied to Atum and Ra, rose from the first waters and called out creation.','Greece: Hesiod and Herodotus turn the Bennu into a long-lived bird from Arabia that visits Heliopolis once every few centuries.','Rome: Pliny, Tacitus and Cassius Dio record supposed visits (34, 36 and 47 AD), often with a skeptical tone.','Christian Europe: the Physiologus and bestiaries, then the Exeter Book poem, make the phoenix an image of resurrection.','Renaissance and later: Elizabeth I, Carlyle, and then fantasy fiction (Fawkes, Marvel’s Phoenix, One Piece’s Marco).']},
  {t:'Phoenix cousins around the world',k:'st',items:[F('Egypt','Bennu'),F('China','Fenghuang and Zhuque (the Vermilion Bird)'),F('India','Garuda and bherunda'),F('Persia','Simurgh'),F('Slavic lands','Firebird and Raróg'),F('Georgia','Paskunji'),F('Arabia','Anqa'),F('Turkey','Konrul (Zümrüdü Anka)'),F('Tibet','Me byi karmo')]},
  {t:'In books and games',k:'list',items:['Harry Potter: Fawkes, Dumbledore’s phoenix, and the Order of the Phoenix.','Marvel: the Phoenix Force, linked to Jean Grey.','One Piece: Marco the Phoenix of the Whitebeard Pirates.','Terry Pratchett, Carpe Jugulum: a search for the phoenix is a subplot.','Neil Gaiman, "Sunbird": eating a phoenix turns the eater to fire.']}],
 links:[['Wikipedia: Phoenix (mythology)','https://en.wikipedia.org/wiki/Phoenix_(mythology)'],['Aberdeen Bestiary: phoenix folio 55r','https://www.abdn.ac.uk/bestiary/ms24/f55r'],['Aberdeen Bestiary: phoenix folio 56r','https://www.abdn.ac.uk/bestiary/ms24/f56r'],['Wikipedia: Bennu','https://en.wikipedia.org/wiki/Bennu'],['Wikipedia: Phoenix (constellation)','https://en.wikipedia.org/wiki/Phoenix_(constellation)'],['Wikipedia: Peregrine falcon','https://en.wikipedia.org/wiki/Peregrine_falcon']]});
ADD('pegasus',{
 sheet:[F('Parents, most accounts','Poseidon and Medusa (Hesiod, Apollodorus, Hyginus, Ovid)'),F('Parents, variants','Pindar and Nonnus name only Medusa. Strabo only says he sprang from her neck'),F('Ovid’s twist','Poseidon mated with Medusa in the form of a bird'),
  F('Birth, per Hesiod','Pegasus and his brother Chrysaor sprang from her blood when Perseus beheaded her'),F('Birth, per Ovid and Nonnus','From her neck, where she was already carrying them'),F('Name','"Of the spring" (pegē) or "sprung forth" (pegazō)'),F('Brother and nephew','Chrysaor; and Chrysaor’s son Geryon, the three-bodied giant'),
  F('Bellerophon, Hesiod','Poseidon gave Pegasus to Bellerophon, and together they killed the Chimera'),F('Bellerophon, Apollodorus','Killed the Chimera from Pegasus’s back with bow and arrows'),F('Pindar, Olympian 13','Bellerophon also fought the Amazons and the Solymi'),
  F('The bridle','Pindar: Athena gave a golden bridle in a dream, and he sacrificed a white bull to Poseidon. Pausanias: Athena bridled Pegasus herself'),F('Where he was caught','At the Peirene spring near Corinth'),
  F('The fall','Pindar: Pegasus threw Bellerophon when he tried to reach heaven. Hyginus: Bellerophon was terrified and fell, and dislocated his hip'),F('After the fall','Pegasus went to Zeus’s stables on Olympus (Pindar). Some later writers made him the horse of Eos (dawn)'),
  F('Springs he made','Hippocrene on Helicon; Peirene near Corinth; a Troezen Hippocrene (Pausanias)'),F('Why Hippocrene','One story: Pegasus kicked Helicon to stop it swelling during the Muses’ contest, on Poseidon’s advice'),
  F('Constellation, ancient','Aratus (3rd c. BC); Ovid says fifteen stars; its rising marked spring and the Greek storm season'),F('Corinthian pottery','Pegasus appears from the 7th century BC'),F('Corinthian coins','From the 6th century BC'),
  F('Art, Greek','A Laconian cup (6th c. BC) shows Bellerophon, Pegasus and the Chimera; an Apulian vase (4th c. BC) shows Pegasus at a spring'),F('Art, Roman','Mosaics at Nîmes (2nd c. AD) and Palmyra (3rd c. AD)'),
  F('Theatre','Euripides’ lost play Bellerophon was parodied in Aristophanes’ Peace (421 BC)'),F('Plato, Critias','Six winged horses draw Poseidon’s chariot in Atlantis'),F('Renaissance art','Pegasus carries Perseus to rescue Andromeda')],
 facts:['In the earliest text, Hesiod says Pegasus "flew away" from the earth. Pindar and Euripides are the first to say plainly that he had wings.','Pegasus is white in later art, but Hesiod never gives his color.','Bellerophon fell, and Pegasus did not. Pindar blames the rider’s ambition, not the horse.','There is a Troezen spring also called Hippocrene, so Boeotia and the Peloponnese both claimed his hoofprint.','A British paratrooper’s Pegasus badge (1941) shows Bellerophon on Pegasus. It is the origin of the name of Pegasus Bridge in 1944.','Mobil’s flying red horse logo has been in use since the 1930s.','The pegasus is the emblem of Tuscany’s flag, the Inner Temple in London, TriStar Pictures and Pegasus Airlines.','Ecuador’s Pegaso satellite launched on 26 April 2013 and was later damaged by space debris.'],
 sym:['Poets and inspiration: the Hippocrene spring and the Muses.','Airborne forces of the UK.'],
 kin:[{n:'Horse domestication (the horse half)',rows:[F('Botai, Kazakhstan','About 3700–3500 BC: bit-like tooth wear and mare’s-milk residue'),F('DOM2 lineage','All modern domestic horses descend from it, about 2200 BC'),F('Chariots','Sintashta and Petrovka graves, 2100–1700 BC'),F('Dental plaque','Horse milk use in Mongolia by about 1200 BC')]}],
 more:[{t:'The story, in short',k:'p',items:['Perseus beheads Medusa, and from her neck or blood spring Pegasus and Chrysaor. Poseidon is the father.','Pegasus flies off to the gods. Later, at the Peirene spring in Corinth, the hero Bellerophon needs help to tame him. Athena gives him a golden bridle.','Together they kill the Chimera, a fire-breathing lion, goat and snake monster. They also fight the Amazons and the Solymi.','Bellerophon grows proud and tries to ride to Olympus. Zeus sends a gadfly (in some tellings), Bellerophon falls, and Pegasus keeps going to Zeus’s stables, where he carries thunderbolts.','Zeus sets Pegasus among the stars, as the constellation.']},
  {t:'Names across languages',k:'st',items:[F('Greek','Pḗgasos (Πήγασος)'),F('Latin','Pegasus'),F('Arabic star names','Markab ("saddle"), Scheat, Algenib, Enif')]}],
 links:[['Theoi: Pegasus','https://theoi.com/Ther/HipposPegasos.html'],['World History Encyclopedia: Pegasus','https://www.worldhistory.org/Pegasus/'],['Britannica: Pegasus','https://www.britannica.com/topic/Pegasus-Greek-mythology'],['Mythopedia: Pegasus','https://mythopedia.com/topics/pegasus/'],['Wikipedia: Pegasus','https://en.wikipedia.org/wiki/Pegasus'],['Wikipedia: Horse domestication','https://en.wikipedia.org/wiki/Horse_domestication']]});
ADD('wyvern',{
 sheet:[F('Alternative origin','William Sayers suggests Old English wiver and Anglo-French guivre meaning "light javelin" merged with the snake image'),F('Related French words','vouivre and guivre, both meaning a serpent-dragon'),
  F('Neo-Assyrian guardians','Palace reliefs of the 9th–7th c. BC show winged serpentine guardians'),F('Wadjet','Egypt’s protective goddess shown as a winged cobra'),
  F('Medieval bestiary','Harley MS 3244 (13th c., after c. 1236) includes a wyvern and an elephant'),F('Guillim (1610)','Says it takes the wings and legs of a fowl and the tail of a serpent'),
  F('Thomas of Lancaster','2nd Earl of Lancaster and Leicester (c. 1278–1322) used a wyvern crest'),F('Leicester, 1619','A silver wyvern with no legs recorded at the heraldic visitation'),F('Midland Railway','Adopted the Leicester wyvern in 1845; the Railway Magazine disputed its Mercia link in 1897'),
  F('Apothecaries','The Worshipful Society of Apothecaries shows a wyvern (disease) beaten by Apollo (medicine)'),F('Tilley family','A black wyvern with raised wings on white'),F('Dr Thomas Kingsbury, 1742','Wyvern on his crest'),
  F('Portugal','Two wyverns are supporters and a demi-wyvern the crest in the royal arms. House of Braganza symbol, also on Brazil’s Imperial Sceptre'),F('Terni, Italy','Green wyvern called Thyrus'),F('Kazan, Russia','Winged serpent Zilant on the city arms'),F('Masovia','Former duchy’s flag'),
  F('Military','43rd (Wessex) Infantry Division in WWII; US Army 3rd Infantry Division emblem; USAF 31st Fighter Wing crest; 51st Operations Support Squadron at Osan Air Base, motto "breathin’ fire!"'),
  F('Sport','Leyton Orient, Carlisle United and Ternana crests; SK Wyverns (2000); Yamagata Wyverns; Old Wesley and East London rugby clubs'),F('Brands','LLVM compiler logo, Lindt chocolate logo, Vauxhall Wyvern car (1950s)'),F('Trail marker','Waymark of the Wessex Ridgeway'),
  F('Aircraft','Westland Wyvern, a British carrier strike aircraft of the 1950s, flew in the 1956 Suez Crisis'),F('Fiction','Fourth Wing, Throne of Glass, The Black Witch Chronicles, Ace Combat’s X-02 Wyvern, Ark, Monster Hunter, Terraria')],
 facts:['In heraldry and folklore the wyvern is rarely fire-breathing. That trait is mostly a modern fantasy addition.','Before the 16th century, "dragon", "wyrm" and "wyver" were used almost interchangeably, so one painter’s wyvern could be another’s dragon.','The legless silver wyvern on Leicester’s 1619 record shows how loose the rules still were.','Fictitious and Symbolic Creatures in Art (on Project Gutenberg) has a chapter on the wyvern, and Fox-Davies’s heraldry guide is there too.'],
 sym:['Fierce protection: the creature on a crest of a house or regiment.','Medicine and disease: the Apothecaries’ wyvern, a poison beaten by healing.'],
 kin:[{n:'Rhamphorhynchus (a real long-tailed flying reptile)',rows:[F('Largest specimen wingspan','About 1.8 m (possibly over 3 m for a fragmentary Ettling find)'),F('Smallest specimen','290 mm'),F('Tail','Stiffened with ligaments, ending in a vane: lancet-shaped in juveniles, diamond-shaped later, triangular in the biggest'),F('Period','Jurassic'),F('Found','Solnhofen limestone, Bavaria, Germany'),F('Teeth','20 upper, 14 lower, needle-like and forward-angled'),F('Diet','Mostly fish, with some cephalopods'),F('First described','Specimen to Sömmerring from Georg Graf zu Münster in 1825; Goldfuss recognized it as a pterosaur in 1831; genus named 1846'),F('First-year growth','130%–173%, slightly faster than alligators')]}],
 more:[{t:'Dragon or wyvern? The heraldry rule',k:'p',items:['English heraldry (and Scottish and Irish) separates two-legged wyverns from four-legged dragons. This was written down in the 16th century by Gerard Legh (1562) and John Guillim (1610), and stressed again by John Gibbon in 1682.','Other countries, including most of continental Europe, do not make the distinction, so a two-legged dragon is just a dragon.','The wyvern in Everhatch has four legs, so strictly it is a small dragon. It keeps the wyvern name for its viper-snake ancestry.']},
  {t:'Names across languages',k:'st',items:[F('Middle English','wyver (14th c.)'),F('Anglo-French','wivre'),F('French','vouivre, guivre'),F('Latin root','vīpera, "viper"')]}],
 links:[['Wikipedia: Wyvern','https://en.wikipedia.org/wiki/Wyvern'],['Fox-Davies: A Complete Guide to Heraldry (Gutenberg)','https://gutenberg.org/cache/epub/41617/pg41617-images.html'],['Fictitious and Symbolic Creatures in Art (Gutenberg)','https://gutenberg.org/cache/epub/40825/pg40825-images.html'],['Folger: Guillim’s Display of Heraldry','https://www.folger.edu/blogs/collation/so-much-for-goats-or-cute-creatures-in-coats-of-arms/'],['Wikipedia: Rhamphorhynchus','https://en.wikipedia.org/wiki/Rhamphorhynchus']]});
{const o=pLore;pLore=function(){let h=o();const d=LORE[SUB.lore||S.species];
 const sec=(d.more||[]).map(m=>`<details><summary>${m.t} <span class="pill">${m.items.length}</span></summary>${m.k==='st'?m.items.map(statRow).join(''):m.k==='p'||m.k==='list'?m.items.map(t=>`<p class="fx">${t}</p>`).join(''):''}</details>`).join('');
 const lk=(d.links||[]).length?`<details><summary>Read more: sources and links <span class="pill">${d.links.length}</span></summary>${d.links.map(l=>`<p class="fx"><a href="${l[1]}" target="_blank" rel="noopener" style="color:var(--gold2)">${l[0]}</a></p>`).join('')}</details>`:'';
 return h.replace('<p class="note" style="margin-top:8px">Sources:',sec+lk+'<p class="note" style="margin-top:8px">Sources:')}}


/* ============================ species flavored regions and treasures ============================ */
const FLM={hippogriff:{ridge:['The Eagle Graves','Old feathers and horsehair, laid in rows. Someone has been keeping them tidy.']},phoenix:{ridge:['The Ash Graves','Old ember-feathers, laid in rows. They are still faintly warm.'],pines:['The Scorched Hollow','Something once lived here. It left behind a warm nest of ash and bright feathers.']},pegasus:{ridge:['The Horseshoe Graves','Old shoes and bridle rings, laid in rows. Someone has been keeping them tidy.'],pines:['The Hollow Tree','Something once lived here. It left behind a warm, dry bed of straw and mane hair.']},wyvern:{ridge:['The Scale Graves','Old shed scales, laid in rows. Someone has been keeping them tidy.'],pines:['The Hollow Tree','Something once lived here. It left behind a warm, dry nest of shed scales.']}};
const FLI={ridge:2,pines:1};
const FLV={
hippogriff:{
 reg:{first:['The First Paddock','The place where the first hippogriff ever hatched. Everything here is gold and quiet. It feels like coming home.'],ridge:['Windward Downs','Open grass and bare stone where the wind never stops. Good galloping country, and better take-off country.'],pines:['The Hollow Pines','A resin-scented forest with wide green rides cut through it. Half the hooves in the valley have walked them.'],ruins:['The Sunken Paddocks','A fallen hall and its old stables. Carved horse-eagles still watch the doors.'],coast:['Saltwind Strand','Wet sand, cliffs and gulls. Perfect for a hard gallop that ends in a leap.'],storm:['The Stormcrown','A peak where lightning lands. Only the surest-footed ever climb it.'],spire:['The Frostspire','Ice and thin air. Your hooves ring on the stone.'],ember:['Emberfall Crater','A warm, ash-grey bowl of old fire. The ground is soft underfoot.'],sea:['The Cloud Sea','A floor of white cloud, with sky all the way up. Rumor says it reaches the Moon.']},
 it:{f_russet:['Russet Mane Hair','Caught on a leaf-fall updraft. Smells of woodsmoke and warm horse.'],f_amber:['Amber Flight Feather','A primary feather that held the last warm light of the year.'],f_harvest:['Harvest-Gold Plume','Long, soft and gold all the way through. Nobody dropped this by accident.'],f_frost:['Frostrime Feather','Stiff with ice crystals. It does not melt in your hand.'],f_snow:['Snowcrest Down','Weightless. It drifts upward when you open your hand.'],f_longwinter:['Long Winter Tailhair','Dusk-colored and enormous. It hums faintly in the wind.'],f_dawnwash:['Dawnwash Feather','Pale gold at the edge, like first light over the downs.'],f_rainbright:['Rainbright Plume','Beads of rain still roll off it.'],f_nestling:['Foal Fluff','From the first foal of the season. Soft enough to make you sentimental.'],f_sunscorch:['Sunscorch Feather','Warm to the touch, as if it remembers noon.'],f_thermal:['Thermal Plume','Ridden a hundred updrafts and shows it.'],f_zenith:['Zenith Feather','From the highest point of the highest flight of the year.'],l_first:['Feather of the First Hippogriff','Older than Ariosto\'s poem, and quieter about it.']}},
phoenix:{
 reg:{first:['The First Flame','The place where the first phoenix ever rose. Everything here is gold and quiet and warm. It feels like coming home.'],ridge:['Kindling Ridge','Warm stone where the wind carries sparks a long way. A fine place to learn what fire and wings are for.'],pines:['The Smoldering Pines','A dark forest where the trees remember burning. New green grows under every black trunk.'],ruins:['The Sunken Temple','A fallen sun temple. Carved fire-birds still watch the doors. It stands near the old city of Heliopolis in the stories.'],coast:['Saltwind Coast','Cliffs, gulls and a sea that reflects the whole sky. The gulls are not impressed.'],storm:['The Stormcrown','Lightning lands here, and your fire answers it.'],spire:['The Frostspire','Ice that hisses when you pass. It is the hardest place to keep warm.'],ember:['Emberfall Crater','The only place hotter than your own heart. Home, for a phoenix.'],sea:['The Cloud Sea','A white floor lit gold by the sun from below the horizon.']},
 it:{f_russet:['Russet Plume','Dropped in a leaf-fall updraft. Smells of woodsmoke.'],f_amber:['Amber Flame-Feather','Glows faintly in the dark, like a coal that forgot to go out.'],f_harvest:['Harvest-Gold Plume','Long, soft and gold all the way through. It stays warm for days.'],f_frost:['Frostrime Ember','A feather of cold fire. It does not melt, and it does not burn.'],f_snow:['Snowcrest Ash','Weightless grey ash that still remembers a flame.'],f_longwinter:['Long Winter Plume','Dusk-colored and enormous. It crackles faintly.'],f_dawnwash:['Dawnwash Feather','Pale gold at the edge, like sunrise.'],f_rainbright:['Rainbright Plume','Steam curls off it where the raindrops land.'],f_nestling:['Cinder Fluff','From the first chick of the season. Soft and faintly warm.'],f_sunscorch:['Sunscorch Feather','Hot to the touch, as if it remembers noon.'],f_thermal:['Thermal Plume','Ridden a hundred updrafts and shows it.'],f_zenith:['Zenith Feather','From the highest point of the highest flight of the year.'],l_first:['Ember of the First Phoenix','The Bennu\'s spark, kept alive since the world began.']}},
pegasus:{
 reg:{first:['The First Spring','The place where the first pegasus ever foaled. Everything here is gold and quiet, and water sings under the stones. It feels like coming home.'],ridge:['Windward Meadows','Open grass where the wind never stops. Good galloping, and better launching.'],pines:['The Hollow Pines','A resin-scented forest with long green rides. Springs rise between the roots.'],ruins:['The Sunken Stables','A fallen hall of an old stable. Carved winged horses still watch the doors.'],coast:['Saltwind Coast','Wet sand and cliffs. A hard gallop here ends in a leap into the sky.'],storm:['The Stormcrown','Thunderbolt country. Zeus\'s horse knows it well.'],spire:['The Frostspire','Ice and thin air. Your hooves ring on the peak.'],ember:['Emberfall Crater','A warm ash bowl with a hidden spring in the middle.'],sea:['The Cloud Sea','A white floor where the stars come down at night. Pegasus the constellation seems closer here.']},
 it:{f_russet:['Russet Mane Hair','Caught on a leaf-fall updraft. Smells of woodsmoke and warm horse.'],f_amber:['Amber Flight Feather','A primary feather that held the last warm light of the year.'],f_harvest:['Harvest-Gold Plume','Long, soft and gold all the way through.'],f_frost:['Frostrime Feather','Stiff with ice crystals. It does not melt in your hand.'],f_snow:['Snowcrest Down','Weightless. It drifts upward when you open your hand.'],f_longwinter:['Long Winter Plume','Dusk-colored and enormous. It hums faintly in the wind.'],f_dawnwash:['Dawnwash Feather','Pale at the edge, like first light on the meadows.'],f_rainbright:['Rainbright Plume','Beads of rain still roll off it.'],f_nestling:['Foal Fluff','From the first foal of the season. Soft enough to make you sentimental.'],f_sunscorch:['Sunscorch Feather','Warm to the touch, as if it remembers noon.'],f_thermal:['Thermal Plume','Ridden a hundred updrafts and shows it.'],f_zenith:['Zenith Feather','From the highest point of the highest flight of the year.'],r_whistle:['Silver Hoof-Pick','Left by someone who loved a horse. Your companion nuzzles it.'],r_glass:['Hippocrene Drop','A bead of spring water that never dries. It tastes like inspiration.'],l_first:['Plume of the First Pegasus','Born of Medusa\'s blood and Poseidon\'s sea, they say. It sparkles.']}},
wyvern:{
 reg:{first:['The First Hoard','The place where the first wyvern ever hatched. Everything here is gold and quiet. It feels like coming home.'],ridge:['Windward Crags','Bare stone where the wind never stops. A fine place to learn what leathery wings are for.'],pines:['The Hollow Pines','A dark forest. Small dragons are the right size for it, which they find smug.'],ruins:['The Sunken Hoard Hall','A fallen hall with an old treasure vault. Carved wyverns still watch the doors.'],coast:['Saltwind Coast','Cliffs with warm rocks to bask on. The gulls keep a safe distance.'],storm:['The Stormcrown','Lightning lands here. Your scales tingle.'],spire:['The Frostspire','Ice and thin air. Hard on a cold-blooded body, but quiet.'],ember:['Emberfall Crater','Warm rock, hot springs and sulfur. A wyvern\'s idea of a spa.'],sea:['The Cloud Sea','A white floor above the world. Nothing up here will bite you, which is rare.']},
 it:{f_russet:['Russet Scale','Shed in a leaf-fall updraft. Smells of woodsmoke.'],f_amber:['Amber Scale','Caught the last warm light of the year and kept it.'],f_harvest:['Harvest-Gold Scale','Large, smooth and gold all the way through. Nobody lost this by accident.'],f_frost:['Frostrime Scale','Stiff with ice crystals. It does not melt in your hand.'],f_snow:['Snowcrest Scale','Pale as snow and light as paper.'],f_longwinter:['Long Winter Spine','Dusk-colored and sharp. It hums in the wind.'],f_dawnwash:['Dawnwash Scale','Pale gold at the edge, like first light.'],f_rainbright:['Rainbright Scale','Beads of rain roll off it.'],f_nestling:['Hatchling Shell Chip','From the first hatchling of the season. Still faintly warm.'],f_sunscorch:['Sunscorch Scale','Warm to the touch, as if it remembers noon.'],f_thermal:['Thermal Membrane Scrap','Ridden a hundred updrafts and shows it.'],f_zenith:['Zenith Scale','From the highest point of the highest flight of the year.'],r_whistle:['Viper-Bone Whistle','Named after the viper that gave wyverns their name. Your companion hears it clearly.'],l_first:['Scale of the First Wyvern','Older than the heralds\' rule about two legs.']}}};
{const rb={},ib={};REGIONS.forEach(r=>rb[r.id]={n:r.n,d:r.d,lm:r.lm.map(x=>x.slice())});ITEMS.forEach(i=>ib[i.id]={n:i.n,d:i.d});
 const o=applySpecies;applySpecies=function(id,q){o(id,q);const f=FLV[id]||{};REGIONS.forEach(r=>{const x=(f.reg||{})[r.id];r.n=x?x[0]:rb[r.id].n;r.d=x?x[1]:rb[r.id].d;const li=FLI[r.id],lo=(FLM[id]||{})[r.id];if(li!==undefined)r.lm[li]=lo?lo.slice():rb[r.id].lm[li].slice()});ITEMS.forEach(i=>{const x=(f.it||{})[i.id];i.n=x?x[0]:ib[i.id].n;i.d=x?x[1]:ib[i.id].d})}}


/* Illustrated Edition v2: growth plates, presentation only. */
{const previousLore=pLore;
pLore=function(){
 const id=SUB.lore||S.species,sp=SPECIES[id];
 const labels=sp.stages.slice(0,4).concat('Ascendant');
 const own=id===S.species&&S.phase==='alive';
 const title=sp.w.charAt(0).toUpperCase()+sp.w.slice(1);
 const plate=`<details class="evolution-plate" open><summary>Life stages <span class="pill">5 forms</span></summary><figure><a href="assets/evolution-${id}.webp" target="_blank" rel="noopener" aria-label="Open full-size ${title} evolution illustration"><img src="assets/evolution-${id}.webp" loading="lazy" alt="${title} in five increasingly mature forms, from ${labels[0]} to Ascendant"></a><figcaption>Illustrated growth study · tap the artwork for full size</figcaption></figure><div class="evolution-labels">${labels.map((label,i)=>`<div class="${own&&stage()===i?'current':''}"><small>0${i+1}</small><b>${label}</b>${own&&stage()===i?'<small>Current</small>':''}</div>`).join('')}</div><p class="note">Five forms, one lifelong companion. This artwork depicts the artist’s interpretation of the growth stages in Everhatch; the creature’s coat and equipment in your nest may differ.</p></details>`;
 return previousLore().replace('<details open><summary>Field guide',plate+'<details open><summary>Field guide');
};}


/* Pass 3 — illustrated newborn expression engine. Existing SVGs are the safe fallback. */
// Illustrated Edition v6: the original coat IDs and save data are unchanged.
function coatArtId(species,coat){
 const c=Number(coat);if(!Number.isInteger(c)||c<0||c>5||!SPECIES[species])return null;
 if(species==='wyvern'&&c<2)return c===0?'wyvern-moss':'wyvern';
 return c===0?species:`${species}-c${c}`;
}
const newbornPoses=['idle','blink','curious','happy'];
const newbornReady={};
const newbornCache=[];
const newbornMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let newbornReactionUntil=0,newbornReaction='idle';
const newbornURL=(id,pose)=>`assets/newborn/${id}-${pose}.webp`;
function newbornKind(){
 if(!S||S.phase!=='alive'||stage()!==0||S.exp||S.sleeping||Object.values(S.eq||{}).some(Boolean))return null;
 return coatArtId(SPEC.id,S.coat);
}
function newbornSetPose(pose){
 const img=document.querySelector('#gwrap .newborn-frame');if(!img)return;
 const id=img.dataset.animal;if(!newbornReady[id])return;
 if(newbornMotion.matches)pose='idle';
 if(img.dataset.pose===pose)return;img.dataset.pose=pose;img.setAttribute('href',newbornURL(id,pose));
}
function newbornReact(pose,ms){newbornReaction=pose;newbornReactionUntil=performance.now()+ms;newbornSetPose(pose)}
{const previous=renderGriffin;
 renderGriffin=function(force){
  previous(force);const id=newbornKind(),w=$('#gwrap');
  if(!id||!requestNewborn(id))return;
  const present=w.querySelector('.newborn-frame');if(present&&present.dataset.animal===id)return;
  const phase=performance.now()<newbornReactionUntil?newbornReaction:'idle';
  const svg=`<svg viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg" aria-label="Illustrated newborn companion">${nestSVG(S.nest.tier,S.nest.slots,bannerCol())}<g class="newborn-body"><image class="newborn-frame" data-animal="${id}" data-pose="idle" href="${newbornURL(id,'idle')}" x="66" y="58" width="188" height="213" preserveAspectRatio="xMidYMax meet"/><ellipse class="newborn-hit" data-spot="3" cx="130" cy="223" rx="28" ry="30"/><ellipse class="newborn-hit" data-spot="2" cx="122" cy="169" rx="38" ry="36"/><ellipse class="newborn-hit" data-spot="1" cx="184" cy="177" rx="25" ry="30"/><ellipse class="newborn-hit" data-spot="0" cx="191" cy="120" rx="31" ry="34"/></g></svg>`;
  w.innerHTML=svg;newbornSetPose(phase);
  w.querySelector('.newborn-frame').addEventListener('error',()=>{newbornReady[id]=false;renderGriffin(true)},{once:true});
 };
}
{const previous=animG;animG=function(cls,ms){previous(cls,ms);if(cls==='bounce'||cls==='nuz'||cls.startsWith('t-'))newbornReact('happy',Math.min(ms,1800));else if(cls==='flinch')newbornReact('blink',ms);};}
{const previous=pet;pet=function(spot,e){const before=lastPet;previous(spot,e);if(lastPet!==before&&S&&!S.sleeping)newbornReact(spot===S.fav?'happy':'curious',spot===S.fav?1400:850);};}
// The cache is populated only after the game's wiring and state are initialized.
const newbornLoading=new Set();
function requestNewborn(id){
 if(newbornReady[id])return true;
 if(newbornLoading.has(id))return false;
 newbornLoading.add(id);let left=newbornPoses.length,failed=false;
 for(const pose of newbornPoses){const im=new Image();newbornCache.push(im);
  const done=ok=>{if(!ok)failed=true;if(--left===0&&!failed){newbornReady[id]=true;if(S&&!titleUp&&newbornKind()===id)renderGriffin(true)}};
  im.onload=()=>done(true);im.onerror=()=>done(false);im.src=newbornURL(id,pose);
 }return false;
}
function loadNewbornArt(){if(existing) {const id=coatArtId(existing.species||'griffin',existing.coat);if(id)requestNewborn(id);}}
let nextBlink=performance.now()+2400,nextCurious=performance.now()+5200,blinkEnd=0,curiousEnd=0;
setInterval(()=>{
 if(document.hidden||!S||titleUp||!newbornKind()||!document.querySelector('#gwrap .newborn-frame'))return;
 const t=performance.now();
 if(t<newbornReactionUntil){newbornSetPose(newbornReaction);return}
 if(t>=nextBlink){blinkEnd=t+180;nextBlink=t+3600+Math.random()*2800;}
 if(t>=nextCurious){curiousEnd=t+720;nextCurious=t+7000+Math.random()*5000;}
 newbornSetPose(t<blinkEnd?'blink':t<curiousEnd?'curious':'idle');
},70);
{const previous=pLore;pLore=function(){const id=SUB.lore||S.species;const art=coatArtId(id,id===S.species?S.coat:0)||coatArtId(id,0);
 const gallery=`<details class="expression-plate"><summary>Newborn expressions <span class="pill">4 poses</span></summary><div class="expression-grid">${newbornPoses.map(p=>`<figure><img loading="lazy" src="${newbornURL(art,p)}" alt="${id} ${p}"><figcaption>${p[0].toUpperCase()+p.slice(1)}</figcaption></figure>`).join('')}</div><p class="note">Illustrated pose studies for the selected coat. Worn equipment retains the original animated artwork. Illustrated resting forms appear below. Older illustrated forms appear in the growth gallery.</p></details>`;return previous().replace('<details open><summary>Field guide',gallery+'<details open><summary>Field guide');};}

/* Illustrated Edition v4 — older forms, procedural motion, and original-renderer fallbacks. */
const growthCache=new Map();
let growthTrickUntil=0,growthTrickTimer=0;
const growthURL=id=>`assets/growth/${id}.webp`;
function growthKind(){
 if(!S||S.phase!=='alive'||stage()<1||S.exp||S.sleeping||Object.values(S.eq||{}).some(Boolean)||performance.now()<growthTrickUntil)return null;
 const id=coatArtId(SPEC.id,S.coat);
 return id?`${id}-${stage()}`:null;
}
function requestGrowth(id){
 if(growthCache.has(id))return growthCache.get(id).ready;
 const im=new Image(),entry={im,ready:false};growthCache.set(id,entry);
 im.onload=()=>{entry.ready=true;if(S&&!titleUp&&growthKind()===id)renderGriffin(true)};
 im.onerror=()=>{entry.ready=false};im.src=growthURL(id);return false;
}
{const previous=renderGriffin;renderGriffin=function(force){
 const w=$('#gwrap'),old=w.querySelector('.growth-frame'),id=growthKind();
 // Restore the full original creature whenever sleep, equipment, or a trick needs it.
 previous(force||!!(old&&!id));
 if(!id||!requestGrowth(id))return;
 const present=w.querySelector('.growth-frame');if(present&&present.dataset.animal===id)return;
 const st=stage(),width=[0,208,246,284,310][st],height=width*310/370,x=(320-width)/2,y=267-height;
 const headX=x+width*.76,headY=y+height*.29;
 const aura=st>=3?`<ellipse class="growth-glow" cx="160" cy="190" rx="${width*.43}" ry="${height*.42}" fill="${S.path?PATHS[S.path].aura:'#f2d58a'}" opacity=".16"/>`:'';
 w.innerHTML=`<svg viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg" aria-label="Illustrated ${SPEC.w}, ${STAGES[st].n}"><defs><filter id="growthBlur"><feGaussianBlur stdDeviation="18"/></filter></defs>${nestSVG(S.nest.tier,S.nest.slots,bannerCol())}${aura}<g class="growth-reaction"><g class="growth-body"><image class="growth-frame" data-animal="${id}" href="${growthURL(id)}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMax meet"/><ellipse class="newborn-hit" data-spot="3" cx="${x+width*.39}" cy="${y+height*.79}" rx="${width*.16}" ry="${height*.17}"/><ellipse class="newborn-hit" data-spot="2" cx="${x+width*.38}" cy="${y+height*.45}" rx="${width*.25}" ry="${height*.28}"/><ellipse class="newborn-hit" data-spot="1" cx="${x+width*.70}" cy="${y+height*.58}" rx="${width*.13}" ry="${height*.21}"/><ellipse class="newborn-hit" data-spot="0" cx="${headX}" cy="${headY}" rx="${width*.13}" ry="${height*.19}"/></g></g></svg>`;
 w.querySelector('.growth-frame').addEventListener('error',()=>{const e=growthCache.get(id);if(e)e.ready=false;renderGriffin(true)},{once:true});
};}
{const previous=animG;animG=function(cls,ms){
 // Detailed wing/head/limb animations remain on the original rig for tricks.
 if(cls.startsWith('t-')&&S&&S.phase==='alive'&&stage()>0){
  growthTrickUntil=performance.now()+ms+60;clearTimeout(growthTrickTimer);renderGriffin(true);
  growthTrickTimer=setTimeout(()=>{growthTrickUntil=0;if(S&&!titleUp)renderGriffin(true)},ms+90);
 }
 previous(cls,ms);
};}
{const previous=pet;pet=function(spot,e){const before=lastPet;previous(spot,e);if(lastPet===before)return;const w=$('#gwrap');if(!w.querySelector('.growth-frame'))return;const cl=spot===S.fav?'growth-delight':'growth-attend';w.classList.remove(cl);void w.offsetWidth;w.classList.add(cl);setTimeout(()=>w.classList.remove(cl),900);};}
// Keep visual growth and wake-up in sync even if the change came from passive care ticks.
{const previous=renderHUD;renderHUD=function(){previous();if(S&&S.phase==='alive'&&!titleUp)renderGriffin();};}
{const previous=pLore;pLore=function(){const id=SUB.lore||S.species,sp=SPECIES[id],art=coatArtId(id,id===S.species?S.coat:0)||coatArtId(id,0);
 const gallery=`<details class="expression-plate"><summary>Living growth forms <span class="pill">4 older designs</span></summary><div class="expression-grid">${[1,2,3,4].map(st=>`<figure><img loading="lazy" src="${growthURL(art+'-'+st)}" alt="${sp.w} ${st===4?'Ascendant':sp.stages[st]}"><figcaption>${st===4?'Ascendant':sp.stages[st]}</figcaption></figure>`).join('')}</div><p class="note">These illustrated forms are used in the nest for every coat, with breathing and care reactions. Equipment and detailed tricks use the original animated rig. Illustrated resting forms appear below.</p></details>`;
 return previous().replace('<details open><summary>Field guide',gallery+'<details open><summary>Field guide');};}


/* Illustrated Edition v5 — sleeping poses for every growth form and care feedback. */
const sleepCache=new Map();
const sleepURL=id=>`assets/sleep/${id}.webp`;
function sleepKind(){
 if(!S||S.phase!=='alive'||!S.sleeping||S.exp||Object.values(S.eq||{}).some(Boolean))return null;
 const id=coatArtId(SPEC.id,S.coat);
 return id?`${id}-${stage()}`:null;
}
function requestSleep(id){
 if(sleepCache.has(id))return sleepCache.get(id).ready;
 const im=new Image(),entry={im,ready:false};sleepCache.set(id,entry);
 im.onload=()=>{entry.ready=true;if(S&&!titleUp&&sleepKind()===id)renderGriffin(true)};
 im.onerror=()=>{entry.ready=false};im.src=sleepURL(id);return false;
}
{const previous=renderGriffin;renderGriffin=function(force){
 if(!S)return;const w=$('#gwrap'),old=w.querySelector('.care-sleep-frame'),id=sleepKind();
 previous(force||!!(old&&!id));
 if(!id||!requestSleep(id))return;
 const present=w.querySelector('.care-sleep-frame');if(present&&present.dataset.animal===id)return;
 const st=stage(),width=[178,208,246,284,310][st],height=width*240/370,x=(320-width)/2,y=265-height;
 w.innerHTML=`<svg viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg" aria-label="Sleeping ${SPEC.w}">${nestSVG(S.nest.tier,S.nest.slots,bannerCol())}<g class="care-sleep-body"><image class="care-sleep-frame" data-animal="${id}" href="${sleepURL(id)}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMax meet"/></g></svg>`;
 w.querySelector('.care-sleep-frame').addEventListener('error',()=>{const e=sleepCache.get(id);if(e)e.ready=false;renderGriffin(true)},{once:true});
};}
const careTimers={};
function careVisual(cls,ms){const w=$('#gwrap');if(!w.querySelector('.growth-frame,.newborn-frame'))return;clearTimeout(careTimers[cls]);w.classList.remove(cls);void w.offsetWidth;w.classList.add(cls);careTimers[cls]=setTimeout(()=>w.classList.remove(cls),ms);}
function careMotes(kind,x,y,n=5){if(newbornMotion.matches)return;for(let i=0;i<n;i++){const el=document.createElement('span');el.className='care-particle';el.textContent=kind==='food'?['•','✦','·'][i%3]:'✧';el.style.left=x+'px';el.style.top=y+'px';el.style.setProperty('--dx',`${(Math.random()-.5)*44}px`);el.style.setProperty('--dy',`${-12-Math.random()*32}px`);el.style.animationDelay=`${i*55}ms`;$('#fx').appendChild(el);setTimeout(()=>el.remove(),1300);}}
{const previous=feed;feed=function(id){const state=S,before=S?.cnt?.feed||0;previous(id);if(S===state&&S?.cnt?.feed>before){careVisual('care-feeding',1300);careMotes('food',...gcenter(.23,-.08),7);}};}
{const previous=startPreen;startPreen=function(){previous();if(preen)$('#gwrap').classList.add('care-grooming');};}
{const previous=preenMove;preenMove=function(e){const before=S?.st?.feathers||0;previous(e);if(preen&&S.st.feathers>before){const [x,y]=sceneXY(e);careMotes('groom',x,y,2);}};}
{const previous=endPreen;endPreen=function(){previous();$('#gwrap').classList.remove('care-grooming');};}
{const previous=doRest;doRest=function(){const sleeping=S.sleeping;previous();if(sleeping&&!S.sleeping)careVisual('care-wake',1250);};}
{const previous=doGreet;doGreet=function(){const before=S.cd.greet;previous();if(S.cd.greet!==before)careVisual('care-greet',1250);};}
{const previous=tick;tick=function(dt){const was=S.sleeping;previous(dt);if(was&&!S.sleeping&&!titleUp){renderAll();careVisual('care-wake',1250);}};}
{const previous=pLore;pLore=function(){const id=SUB.lore||S.species,sp=SPECIES[id],art=coatArtId(id,id===S.species?S.coat:0)||coatArtId(id,0);
 const gallery=`<details class="expression-plate"><summary>Resting forms <span class="pill">5 poses</span></summary><div class="expression-grid">${[0,1,2,3,4].map(st=>`<figure><img loading="lazy" src="${sleepURL(art+'-'+st)}" alt="Sleeping ${sp.w}"><figcaption>${st===4?'Ascendant':sp.stages[st]}</figcaption></figure>`).join('')}</div><p class="note">Each growth form has its own sleeping illustration with gentle breathing. Equipped companions keep their original sleeping rig.</p></details>`;
 return previous().replace('<details open><summary>Field guide',gallery+'<details open><summary>Field guide');};}

/* v6 — a read-only illustrated coat atlas; not a coat unlock or changing system. */
{const previous=pLore;pLore=function(){
 const id=SUB.lore||S.species,sp=SPECIES[id],own=id===S.species;
 const stageTitle=st=>st===4?'Ascendant':sp.stages[st];
 const gallery=`<details class="coat-atlas" data-nosx="1"><summary>Coat collection <span class="pill">6 palettes · 30 forms</span></summary><p class="note">Explore every coat and life stage. These studies are a reference, not an unlock or a way to change your companion’s coat. Sunforged remains rare.</p><div class="coat-grid">${sp.coats.map((c,i)=>{const art=coatArtId(id,i);return `<details class="coat-card"><summary><img src="${growthURL(art+'-2')}" loading="lazy" alt="${c.n} ${sp.w}"><b>${c.n}</b>${own&&S.coat===i?'<small class="coat-current">Your coat</small>':i===5?'<small>Rare</small>':''}</summary><div class="coat-stages">${[0,1,2,3,4].map(st=>`<figure><figcaption>${stageTitle(st)}</figcaption><div><img loading="lazy" src="${st===0?newbornURL(art,'idle'):growthURL(art+'-'+st)}" alt="${c.n} ${stageTitle(st)} awake"><img loading="lazy" src="${sleepURL(art+'-'+st)}" alt="${c.n} ${stageTitle(st)} sleeping"></div><small>Awake · Resting</small></figure>`).join('')}</div></details>`}).join('')}</div></details>`;
 return previous().replace('<details open><summary>Field guide',gallery+'<details open><summary>Field guide');
};}

/* v7 — text sizing is stored independently of the companion/save slot. */
const TEXT_LEVELS=[100,115,130,150,175,200],TEXT_NAMES=['Standard','Comfortable','Large','Extra large','Very large','Maximum'];
const TEXT_KEY='aerie.text-size.v1';let textScale=1;
function setTextSize(pct){pct=Number(pct);if(!TEXT_LEVELS.includes(pct))pct=100;textScale=pct/100;document.documentElement.style.fontSize=(16*textScale)+'px';document.documentElement.style.setProperty('--text-scale',textScale);document.documentElement.toggleAttribute('data-large-text',pct>=130);try{localStorage.setItem(TEXT_KEY,String(pct))}catch(e){}}
function textSizeControls(){return `<div class="text-size-control" data-nosx="1"><label for="textSize">Text size</label><select id="textSize">${TEXT_LEVELS.map((v,i)=>`<option value="${v}" ${v===Math.round(textScale*100)?'selected':''}>${TEXT_NAMES[i]} · ${v}%</option>`).join('')}</select><p class="text-preview">A little bigger, a little easier to read.</p><small>Applies to this device, including menus, lore and flight information. Your saved companion is unchanged.</small></div>`;}
function bindTextSize(m){const el=$('#textSize',m);if(el)el.onchange=()=>setTextSize(el.value);}
function openTextSize(){showModal({title:'Reading comfort',html:textSizeControls(),buttons:[{t:'Done',cls:'gold'}],onShow:bindTextSize});}
try{setTextSize(localStorage.getItem(TEXT_KEY)||100)}catch(e){setTextSize(100)}
$('#tText').onclick=openTextSize;
function regionTextList(){return `<details class="region-text-list" ${textScale>=1.3?'open':''}><summary>Region list · easier to read</summary>${REGIONS.filter(r=>(r.zone||1)===zoneSel).map(r=>`<button class="btn ${selR===r.id?'gold':''}" data-act="region" data-id="${r.id}">${r.n}<small>${regionOpen(r)?Math.round(rex(r.id))+'% explored':'Locked · '+regionReq(r)}</small></button>`).join('')}</details>`;}
const eggCache=new Map();
const hatchURL=(id,k)=>`assets/eggs/${id}-${k}.webp`;
function preloadEgg(id,k){const url=hatchURL(id,k);if(eggCache.has(url))return eggCache.get(url);const im=new Image();const entry={im,ready:false};eggCache.set(url,entry);im.onload=()=>{entry.ready=true;if(S?.phase==='egg'&&!S.hatching&&SPEC.id===id&&k<2)renderGriffin(true)};im.src=url;return entry;}
function illustratedEggSVG(h,k,art=SPEC.id){const E=SPEC.egg,r=k>=2?art:SPEC.id;return `<svg viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg" aria-label="${SPEC.w} ${k===0?'egg':k===1?'cracked egg':k===2?'emerging from its shell':'newly hatched'}"><defs><radialGradient id="hatchGlow"><stop offset="0" stop-color="${E.g}" stop-opacity="${.18+h*.006}"/><stop offset="1" stop-color="${E.g}" stop-opacity="0"/></radialGradient></defs><circle class="egg-glow" cx="160" cy="185" r="125" fill="url(#hatchGlow)"/>${nestSVG(S.nest.tier,S.nest.slots,bannerCol())}<g class="${k<2?'eggpulse':'egg-reveal'}"><image class="egg-art" href="${hatchURL(r,k)}" x="${k<2?44:25}" y="${k<2?86:55}" width="${k<2?232:270}" height="${k<2?181:211}" preserveAspectRatio="xMidYMax meet"/><ellipse cx="160" cy="188" rx="90" ry="90" fill="transparent" data-egg="1"/></g></svg>`;}
{const previous=eggSVG;eggSVG=function(h){const k=h>=25?1:0;preloadEgg(SPEC.id,0);preloadEgg(SPEC.id,1);if(!preloadEgg(SPEC.id,k).ready)return previous(h);return illustratedEggSVG(h,k);};}
function updateEggProgress(){const m=$('.egg-meter'),t=$('.egg-status'),b=$('.egg-warm');if(m){m.setAttribute('aria-valuenow',Math.round(S.hatch));m.firstElementChild.style.width=S.hatch+'%'}if(t)t.textContent=Math.round(S.hatch)+'% warm';if(b&&S.hatching){b.disabled=true;b.textContent='Hatching…'}}
ACTS.warmEgg=()=>{const r=$('#scene').getBoundingClientRect();eggTap({clientX:r.left+r.width/2,clientY:r.top+r.height*.65});};
// Preload relevant color forms on entry to the egg scene, without waiting on network to allow play.
{const previous=renderGriffin;renderGriffin=function(force){if(S?.phase==='egg'){if(S.hatching)return;for(const c of (S.coatSet?[S.coat]:[0,1,2,3,4])){const art=coatArtId(SPEC.id,c);if(art){preloadEgg(art,2);preloadEgg(art,3)}}}previous(force);};}
{const previous=pLore;pLore=function(){const id=SUB.lore||S.species,sp=SPECIES[id];const gallery=`<details class="expression-plate" data-nosx="1"><summary>The miracle of hatching <span class="pill">4 illustrations</span></summary><div class="expression-grid">${['Intact egg','Cracked shell','Emerging newborn','First moments'].map((t,k)=>`<figure><img loading="lazy" src="${hatchURL(id,k)}" alt="${sp.w} ${t}"><figcaption>${t}</figcaption></figure>`).join('')}</div><p class="note">The egg responds to your warmth. These are illustrations of an Everhatch hatching, not a claim about real animal development.</p></details>`;return previous().replace('<details open><summary>Field guide',gallery+'<details open><summary>Field guide');};}


/* v9 — sanctuary display only: preserve tier costs, perks, inventory and save keys. */
const SAN_DESCS=['A quiet nest on the edge of the clouds. Every legend starts somewhere.','Soft moss, sheltered roots and a comfortable place to rest.','A feather-lined terrace surrounded by flowers and ancient arches.','Banners and gold stonework welcome a growing legend.','A shining citadel above the cloud sea.','A crystal sanctuary beneath a canopy of stars.'];
const sanPhoto=$('#sanctuary-photo'),sanScene=$('#scene'),sanLayer=$('#sanctuary');
let sanTier=-1,sanReady=false,sanRendering=0,sanLastPhase='';
const sanURL=t=>`assets/sanctuary/tier-${t}.webp`;
function syncSanctuary(){if(!S||titleUp)return false;const t=clamp(Math.floor(Number(S.nest.tier)||0),0,TIERS.length-1);if(t!==sanTier){sanTier=t;sanReady=false;sanScene.classList.remove('sanctuary-ready');sanPhoto.onload=()=>{if(sanTier!==t)return;sanReady=true;sanScene.classList.add('sanctuary-ready');if(S&&!titleUp&&!S.hatching)renderGriffin(true);};sanPhoto.onerror=()=>{if(sanTier!==t)return;sanReady=false;sanScene.classList.remove('sanctuary-ready');if(S&&!titleUp&&!S.hatching)renderGriffin(true);};sanPhoto.src=sanURL(t);}return sanReady;}
function refreshSanAtmosphere(){if(document.hidden||!S||titleUp)return;const d=new Date(),h=d.getHours()+d.getMinutes()/60,sn=season(d);const phase=h<5.5||h>=20?'night':h<8?'dawn':h>=17.5?'dusk':'day';const key=sn+'-'+phase+'-'+sanTier;if(key===sanLastPhase)return;sanLastPhase=key;sanScene.dataset.season=sn;const night=phase==='night';const final=sanTier===5;const seasonal={spring:'saturate(1.04)',summer:'saturate(1.08)',autumn:'sepia(.13) saturate(1.08)',winter:'saturate(.78)'}[sn];sanLayer.style.setProperty('--san-filter',seasonal+' '+(night?(final?'brightness(.88)':'brightness(.60) saturate(.78)'):phase==='dusk'?'brightness(.86)':'brightness(1)'));sanLayer.style.setProperty('--san-light',night?'linear-gradient(145deg,#171c5d6c,#313e7130 55%,#080e2b35)':phase==='dusk'?'linear-gradient(145deg,#c0642f36,transparent 65%,#221b4238)':phase==='dawn'?'linear-gradient(145deg,#f9cb8744,transparent 65%)':sn==='winter'?'linear-gradient(145deg,#e3f5ff30,transparent 60%)':'transparent');sanLayer.style.setProperty('--san-particle',{winter:'#edf6ff',spring:'#ffcfdf',summer:'#ffe8a1',autumn:'#e9a454'}[sn]);}
for(let i=0;i<12;i++){const mote=document.createElement('i');mote.className='san-mote';mote.style.setProperty('--x',`${(i*37+11)%100}%`);mote.style.setProperty('--s',`${3+(i%4)}px`);mote.style.setProperty('--d',`${12+i%7*2}s`);mote.style.setProperty('--delay',`${-i*1.7}s`);mote.style.setProperty('--drift',`${i%2?32:-24}px`);$('#sanctuary-particles').appendChild(mote);}
// Only replace the procedural nest in the home scene, never in sharing cards or other SVGs.
{const previous=nestSVG;nestSVG=function(tier,slots,banner){if(!sanRendering||!sanReady)return previous(tier,slots,banner);tier=clamp(tier||0,0,TIERS.length-1);slots=slots||[];let items='';for(let i=0;i<TIERS[tier].slots;i++){const it=ITEM_BY_ID[slots[i]];if(!it)continue;const p=SLOT_POS[i],rot=i%2?8:-8;items+=`<g transform="translate(${p[0]-14} ${p[1]-26}) rotate(${rot} 14 26) scale(.88)">${itemInner(it)}</g>`;}return `<ellipse cx="160" cy="269" rx="112" ry="10" fill="#10192f" opacity=".18"/>${items}`;};}
{const previous=renderGriffin;renderGriffin=function(force){if(!S)return;syncSanctuary();refreshSanAtmosphere();sanRendering++;try{return previous(force);}finally{sanRendering--;}};}
{const previous=illustratedEggSVG;illustratedEggSVG=function(...args){sanRendering++;try{return previous(...args);}finally{sanRendering--;}};}
setInterval(refreshSanAtmosphere,30000);
{const previous=pDecor;pDecor=function(){const t=S.nest.tier;const now=`<div class="san-card"><img src="${sanURL(t)}" alt="${TIERS[t].n}"><div><p class="san-caption">Your sanctuary · ${t+1} of ${TIERS.length}</p><h3>${TIERS[t].n}</h3><p>${SAN_DESCS[t]}</p><p>${TIERS[t].perk}</p></div></div>`;const gallery=`<details class="san-gallery"><summary>Sanctuary journey · six illustrated homes</summary><div class="san-grid">${TIERS.map((v,i)=>`<figure class="${i===t?'current':''}"><img src="${sanURL(i)}" loading="lazy" alt="${v.n}"><figcaption>${v.n}<small>${i===t?'Current home':i<t?'Unlocked':'Future upgrade · '+v.cost+' provisions'}</small></figcaption></figure>`).join('')}</div><p class="note">Your sanctuary grows when you purchase an upgrade. The gallery is a preview, not an unlock.</p></details>`;return now+previous().replace(/^<h3>[^<]*<\/h3><p class="note"[^>]*>[^<]*<\/p>/,'').replace("your griffin's nest","your companion’s sanctuary")+gallery;};}


/* ============================ v10 illustrated realms ============================ */
const REALM_ART=new Set(['ridge', 'pines', 'ruins', 'coast', 'storm', 'spire', 'ember', 'sea', 'dunes', 'canopy', 'mire', 'anvil', 'isles', 'veil', 'titan', 'first', 'starroad', 'moon', 'gate', 'heart']);
const realmURL=id=>`assets/realms/${id}.webp`;
const realmZone=z=>['','Homelands','Far Reaches','The Beyond'][z]||'The skies';
function realmHero(r,caption){if(!r||!REALM_ART.has(r.id))return '';return `<figure class="realm-hero"><img src="${realmURL(r.id)}" alt="Illustrated landscape of ${r.n}" decoding="async"><figcaption>${caption||r.n}</figcaption></figure>`;}
function realmAtlas(){const list=REGIONS.filter(r=>(r.zone||1)===zoneSel);const done=list.filter(r=>rex(r.id)>=100).length;return `<div class="realm-heading"><h3>${realmZone(zoneSel)}</h3><small>${done}/${list.length} fully explored</small></div><p class="note realm-overall" style="margin:4px 0 8px">World atlas · ${REGIONS.filter(r=>rex(r.id)>=100).length}/${REGIONS.length} regions fully explored</p><div id="realm-atlas" class="realm-grid">${list.map(r=>{const open=regionOpen(r),e=Math.round(rex(r.id)),selected=selR===r.id;return `<button type="button" class="realm-tile ${open?'':'locked'} ${selected?'selected':''}" data-act="region" data-id="${r.id}" aria-pressed="${selected}">${REALM_ART.has(r.id)?`<img src="${realmURL(r.id)}" alt="" decoding="async" loading="lazy">`:`<span class="realm-placeholder" style="--realm-color:${r.pal[0]}" aria-hidden="true"></span>`}<span class="realm-info"><b>${r.n}</b><small>${open?e>=100?'Fully explored':e+'% explored':'Locked · '+regionReq(r)}</small>${open?`<span class="bar" aria-hidden="true"><i style="width:${e}%;background:var(--gold)"></i></span>`:''}</span></button>`}).join('')}</div>`;}
{const previous=regionCard;regionCard=function(){const r=selR&&RB[selR];if(!r)return '';return `<section class="realm-detail" aria-label="Selected region">${realmHero(r,realmZone(r.zone||1)+' · '+r.n)}${previous()}<button class="btn realm-back" style="margin:10px 0 0" data-act="realmBack">Back to region atlas</button></section>`;};}
{const previous=awayCard;awayCard=function(){const r=S.exp&&RB[S.exp.rid];return `<section class="realm-journey">${realmHero(r,'Exploring · '+(r?r.n:''))}${previous()}</section>`;};}
{const previous=pSky;pSky=function(){if(SUB.sky==='wild'||SUB.sky==='ride'||S.exp)return previous();const zones=`<div class="seg" style="margin-top:-2px">${[1,2,3].map(z=>`<button type="button" class="${zoneSel===z?'on':''}" data-act="zone" data-z="${z}">${realmZone(z)}</button>`).join('')}</div>`;return seg('sky',[['map','Map'],['wild','Wild'],['ride','Ride']])+zones+regionCard()+realmAtlas()+`<details class="realm-map"><summary>Route map · connected paths</summary>${mapSVG()}</details><p class="note">Choose a region to view its landmarks, unlock requirements and expeditions. Your companion brings back treasures as you explore.</p>`;};}
{const previous=ACTS.region;ACTS.region=function(el){previous(el);const p=$('#panel');if(p)p.scrollTop=0;};}
{const previous=ACTS.zone;ACTS.zone=function(el){previous(el);const p=$('#panel');if(p)p.scrollTop=0;};}
ACTS.realmBack=()=>{selR=null;renderPanel();$('#panel').scrollTop=0;};


/* v13 — preserve the full original lore registry, organize it into readable chapters. */
const BOOK_PLATES={
 griffin:[['griffin-gold','The guardians of gold','An imagined scene inspired by the accounts of gold-guarding griffins.','Legend'],['griffin-shield','The griffin in heraldry','An original decorative heraldic study, not a reproduction of a specific coat of arms.','Illustration']],
 hippogriff:[['hippogriff-rider','Ariosto’s flying steed','An imagined scene from the literary tradition of Orlando Furioso.','Legend'],['hippogriff-parents','The impossible pairing','A griffin and mare illustrate the literary idea behind the hippogriff.','Legend']],
 phoenix:[['phoenix-bennu','The Egyptian Bennu','A modern artistic interpretation of the heron-like sacred bird, not an ancient Egyptian artifact.','Illustration'],['phoenix-rebirth','Out of the flames','An imagined scene of the later fiery rebirth tradition.','Legend']],
 pegasus:[['pegasus-chimera','Bellerophon and the Chimera','A retelling in pictures of the Greek hero’s legendary encounter.','Legend'],['pegasus-stars','Among the stars','A symbolic constellation illustration, not a navigational star chart.','Illustration']],
 wyvern:[['wyvern-shield','A heraldic wyvern','A decorative fantasy shield inspired by heraldic beasts, not an authentic historical crest.','Illustration'],['wyvern-manuscript','The medieval winged serpent','A modern manuscript-style interpretation, not a scanned historical manuscript. Limb conventions vary; see the heraldry chapter.','Illustration']]
};
const BOOK_ANATOMY={griffin:[['Head and forequarters','Eagle-like hooked beak and talons.'],['Hindquarters','Lion-like body and tail.'],['Wings','Feathered wings in the traditional composite creature.']],hippogriff:[['Forequarters','Eagle-like head, wings and talons.'],['Hindquarters','Horse-like legs, hooves and tail.'],['Literary origin','The unusual combination is central to Ariosto’s story.']],phoenix:[['Body','Bird-like form; descriptions vary across stories.'],['Plumage','Red and gold occur in ancient accounts.'],['Fire','Fiery rebirth belongs to later traditions and fantasy, not real biology.']],pegasus:[['Body','A horse with feathered wings.'],['Hooves','The spring of Hippocrene is linked to a hoof strike in myth.'],['Flight','Winged flight is a legendary trait, not a measured animal ability.']],wyvern:[['Historical form','A two-legged winged creature under the familiar English heraldic convention.'],['Everhatch form','Our companion has four legs and separate wings.'],['Tail and scales','Serpentine features in traditional and fantasy depictions.']]};
const BOOK_CHAPTERS=[['guide','Field guide','Body, traits and reference facts'],['myths','Myths & stories','Illustrated traditional tales'],['history','Across the ages','Timeline and historical records'],['culture','Symbols & culture','Heraldry, places and names'],['nature','Real-world comparisons','Animals, fossils and measurements'],['game','Everhatch galleries','Growth, coats, eggs and care'],['discover','Discoveries','Bond-unlocked facts'],['sources','Sources & reading','Original references and links']];
let bookChapter='guide';
function bookPlate(p){return `<figure class="book-plate"><a href="assets/lore/${p[0]}.webp" target="_blank" rel="noopener" aria-label="Open larger illustration: ${p[1]}"><img src="assets/lore/${p[0]}.webp" loading="lazy" alt="${p[1]}"></a><figcaption><b>${p[1]}</b><small>${p[3]} · Original art</small><br>${p[2]}</figcaption></figure>`;}
function bookClass(d){const t=d.querySelector('summary')?.textContent.trim()||'';if(/^Field guide/.test(t))return 'guide';if(/^Timeline/.test(t))return 'history';if(/^Did you know/.test(t))return 'discover';if(/^Real-world/.test(t))return 'nature';if(/^Read more/.test(t))return 'sources';if(/Life stages|Newborn expressions|Living growth forms|Resting forms|Coat collection|miracle of hatching/.test(t))return 'game';if(/The story|Dragon or wyvern/.test(t))return 'myths';if(/where to find|historical|Across the ages/i.test(t))return 'history';return 'culture';}
{const old=pLore;pLore=function(){
 const id=SUB.lore||S.species;const sp=SPECIES[id],d=LORE[id];const tpl=document.createElement('template');tpl.innerHTML=old();const lore=tpl.content.querySelector('.lore');if(!lore)return old();
 const groups=Object.fromEntries(BOOK_CHAPTERS.map(c=>[c[0],[]]));
 const cover=lore.querySelector('.lore-cover');if(cover){const c=cover.querySelector('figcaption');if(c)c.textContent='Original fantasy illustration · Everhatch';}
 for(const detail of [...lore.querySelectorAll(':scope > details')]){const key=bookClass(detail);if(key==='guide'||key==='history'||key==='nature'||key==='myths')detail.open=true;else detail.open=false;groups[key].push(detail.outerHTML);detail.remove();}
 const footer=[...lore.querySelectorAll(':scope > p')].find(p=>p.textContent.startsWith('Sources:'));if(footer){groups.sources.push(footer.outerHTML);footer.remove();}
 const g=BOOK_ANATOMY[id];groups.guide.unshift(`<section class="book-anatomy"><h4>Creature anatomy · illustrated tradition</h4><p class="book-note">A descriptive guide to a mythical form, not evidence of a real species or its physiology.</p>${g.map(x=>`<p><b>${x[0]}.</b> ${x[1]}</p>`).join('')}</section>`);
 const plates=BOOK_PLATES[id];groups.myths.unshift(`<p class="book-note">Traditional tales and literary stories are not historical evidence that these creatures existed.</p><div class="book-plates">${plates.map(bookPlate).join('')}</div>`);
 groups.nature.unshift('<p class="book-kin-note">These are comparisons with real animals, fossils or (for Pegasus) astronomy. Their measurements do not describe the mythical creature itself. Extinct forms are known from fossils.</p>');
 groups.game.unshift('<p class="book-note">Game reference · Explore the existing growth stages, coat palettes, newborn expressions, sleeping poses and hatching sequences. Viewing a gallery does not unlock or change a companion.</p>');
 groups.sources.unshift('<p class="book-note">The new art is an original interpretation, not documentary evidence. The original reference links and source notes are retained; individual historical claims have not been independently re-verified in this visual update.</p>');
 const head=`<section class="lore-book" data-nosx="1"><div class="book-intro"><p class="book-kicker">EVERHATCH · LIBRARY OF LEGENDS</p><h2>The Grand Illustrated Bestiary</h2><p class="book-note">Five species. Eight chapters each. Explore the stories, history and living world behind your companion.</p></div><div class="book-contents" aria-label="Bestiary chapters">${BOOK_CHAPTERS.map(c=>`<button class="${c[0]===bookChapter?'on':''}" data-book-chapter="${c[0]}" aria-pressed="${c[0]===bookChapter}">${c[1]}<small>${c[2]}</small></button>`).join('')}</div><label class="book-search-label" for="bookSearch">Find a topic in this species</label><input class="book-search" id="bookSearch" type="search" placeholder="Search the chapters…" autocomplete="off"><p class="book-status" aria-live="polite"></p></section>`;
 const body=`<div class="book-chapters" data-nosx="1">${BOOK_CHAPTERS.map(c=>`<section class="book-chapter" data-book-page="${c[0]}" ${c[0]===bookChapter?'':'hidden'}><button type="button" class="btn book-back" data-book-contents="1">↑ Chapter contents</button><h3>${c[1]}</h3>${groups[c[0]].join('')}</section>`).join('')}</div><div class="book-nav-bottom"><button class="btn" data-book-step="-1">Previous chapter</button><button class="btn" data-book-step="1">Next chapter</button></div>`;
 // Keep the original species tabs, cover, intro, legend and all existing detail content.
 lore.insertAdjacentHTML('beforebegin',head);lore.insertAdjacentHTML('beforeend',body);return tpl.innerHTML;
};}
function showBookPage(id){if(!BOOK_CHAPTERS.some(c=>c[0]===id))return;bookChapter=id;const p=$('#panel');const inp=p.querySelector('#bookSearch');if(inp)inp.value='';p.querySelectorAll('[data-book-page]').forEach(x=>x.hidden=x.dataset.bookPage!==id);p.querySelectorAll('[data-book-chapter]').forEach(x=>{const on=x.dataset.bookChapter===id;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on);});const msg=p.querySelector('.book-status');if(msg)msg.textContent='';const chapter=p.querySelector(`[data-book-page="${id}"]`);if(chapter)chapter.scrollIntoView({block:'start'});}
$('#panel').addEventListener('click',e=>{const back=e.target.closest('[data-book-contents]');if(back){$('#panel .lore-book')?.scrollIntoView({block:'start'});return;}const c=e.target.closest('[data-book-chapter]');if(c){showBookPage(c.dataset.bookChapter);return;}const step=e.target.closest('[data-book-step]');if(step){const i=BOOK_CHAPTERS.findIndex(c=>c[0]===bookChapter);showBookPage(BOOK_CHAPTERS[(i+Number(step.dataset.bookStep)+BOOK_CHAPTERS.length)%BOOK_CHAPTERS.length][0]);}});
$('#panel').addEventListener('input',e=>{if(e.target.id!=='bookSearch')return;const q=e.target.value.trim().toLowerCase();let n=0;$('#panel').querySelectorAll('[data-book-page]').forEach(x=>{const hit=q?x.textContent.toLowerCase().includes(q):x.dataset.bookPage===bookChapter;x.hidden=!hit;if(hit)n++;if(q&&hit)x.querySelectorAll(':scope > details').forEach(d=>{if(d.textContent.toLowerCase().includes(q))d.open=true;});});const msg=$('#panel .book-status');if(msg)msg.textContent=q?(n?`${n} matching chapter${n===1?'':'s'}`:'No matching chapters in this species.') :'';});

/* ============================ wiring ============================ */
$('#tBegin').onclick=()=>{if(load()){newGame()}else begin()};
$('#tCont').onclick=cont;$('#tNew').onclick=newGame;
$('#tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S||S.phase!=='alive')return;if(preen)endPreen();tab=b.dataset.tab;renderPanel();$('#panel').scrollTop=0});
$('#panel').addEventListener('click',e=>{const sg=e.target.closest('[data-seg]');if(sg){const [k,v]=sg.dataset.seg.split(':');SUB[k]=v;renderPanel();$('#panel').scrollTop=0;return}const el=e.target.closest('[data-act]');if(!el)return;if(el.dataset.act==='donepreen'){endPreen();return}act(el.dataset.act,el)});
const gw=$('#gwrap');
gw.addEventListener('pointerdown',e=>{if(!S||titleUp)return;if(S.phase==='egg'){if(e.target.closest('svg'))eggTap(e);return}
  if(preen){preen.down=true;const [x,y]=sceneXY(e);preen.lx=x;preen.ly=y;return}
  const sp=e.target.dataset&&e.target.dataset.spot;if(sp!==undefined)pet(+sp,e);else if(e.target.closest('svg')&&S.phase==='alive'&&!modalOpen&&!S.sleeping){const [x,y]=sceneXY(e);burst(x,y,'spark',2)}});
gw.addEventListener('pointermove',e=>{if(preen)preenMove(e)});
window.addEventListener('pointerup',()=>{if(preen)preen.down=false});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(S&&!titleUp)save()}else{lastT=Date.now()}});
window.addEventListener('pagehide',()=>{if(S&&!titleUp){S.last=Date.now();save()}});
window.addEventListener('resize',resize);
$('#cog').onclick=openSettings;
['pointerdown','pointerup','keydown'].forEach(ev=>document.addEventListener(ev,()=>auInit(),{passive:true}));

/* main loop */
let sec=0;
setInterval(()=>{if(!S||titleUp)return;const n=Date.now();let dt=(n-lastT)/1000;lastT=n;
  if(S.phase!=='alive')return;
  if(dt>25){offline(dt);S.last=n;onOpen(dt);renderAll();return}
  tick(dt);S.last=n;sec++;renderBars();if(sec%3===0){updateCaps();checkDeeds();bountyDay();festCheck()}if(S.exp&&n>=S.exp.end){resolveExp();return}if(S.exp&&sec%5===0&&(tab==='care'||tab==='train'||tab==='sky'))renderPanel();
  if(sec%5===0){if(S.sleeping)zz();checkEvents();save()}
  if(sec%3===0&&S.sleeping&&S.rest>=100)renderAll();
  if(Date.now()>lastSpeechAt&&!preen&&!modalOpen){say(idleLine(),13000)}
  if(sec%10===0)renderHUD();
  if(sec%60===0&&S.daily!==todayStr()&&!modalOpen&&!preen&&!training){onOpen(0)}
  if(sec%30===0&&tab==='care')renderPanel();
},1000);
function zz(){const [x,y]=gcenter(.25,-.15);const e=document.createElement('div');e.className='zz';e.textContent='z';e.style.left=x+'px';e.style.top=y+'px';e.style.fontSize=(rnd(16,26)/16)+'rem';$('#fx').appendChild(e);setTimeout(()=>e.remove(),3100)}


/* v17 — all 23 authored trick presentations; no progression changes. */
const TRICK_CHOREO={
 bow:['ground','gold',[[0,0,0,1],[0,9,12,.97],[0,9,12,.97],[0,0,0,1]]],
 dance:['ground','petal',[[0,0,0,1],[-17,-24,-8,1],[18,-12,8,1],[-12,-28,-8,1],[0,0,0,1]]],
 roar:['ground','wave',[[0,0,0,1],[-4,0,-8,1.05],[4,0,-5,1.09],[0,0,0,1]]],
 hover:['air','gold',[[0,0,0,1],[0,-42,-6,1],[0,-65,0,1],[0,-54,3,1],[0,0,0,1]]],
 fetch:['air','trail',[[0,0,0,1],[70,-62,-10,.8],[115,-35,0,.55],[-55,-45,8,.8],[0,0,0,1]]],
 roll:['air','trail',[[0,0,0,1],[-15,-45,-25,.86],[0,-80,180,.75],[18,-40,335,.86],[0,0,360,1]]],
 spin:['air','trail',[[0,0,0,1],[-45,-75,-25,.82],[20,-100,150,.72],[38,-40,330,.83],[0,0,360,1]]],
 sing:['ground','notes',[[0,0,0,1],[0,-3,-7,1.02],[0,-7,-9,1.025],[0,0,0,1]]],
 guard:['ground','shield',[[0,0,0,1],[0,-4,-3,1.08],[0,-4,0,1.08],[0,0,0,1]]],
 loop:['air','trail',[[0,0,0,1],[-40,-44,-90,.75],[0,-95,-180,.72],[40,-44,-270,.75],[0,-10,-360,.9],[-30,-55,-450,.75],[0,-84,-540,.72],[30,-45,-630,.75],[0,0,-720,1]]],
 salute:['ground','gold',[[0,0,0,1],[0,-7,-8,1.03],[0,7,10,.98],[0,0,0,1]]],
 thunder:['ground','bolt',[[0,0,0,1],[-5,0,-4,1.03],[5,-4,4,1.06],[-4,0,-3,1],[0,0,0,1]]],
 ascend:['ground','pillar',[[0,0,0,1],[0,-50,0,.95],[0,-100,0,.85],[0,-75,0,.92],[0,0,0,1]]],
 starfall:['air','stars',[[0,0,0,1],[-20,-105,-15,.74],[20,-68,30,.82],[35,-7,12,1],[0,0,0,1]]],
 dawnsong:['ground','sun',[[0,0,0,1],[0,-8,-8,1.025],[0,-12,-10,1.04],[0,0,0,1]]],
 rear:['ground','wave',[[0,0,0,1],[-5,-8,-16,1.04],[-5,-15,-23,1.04],[0,0,0,1]]],
 canter:['air','gold',[[0,0,0,1],[-25,-10,-4,.93],[15,-30,4,.96],[45,-42,-5,.9],[0,0,0,1]]],
 flamedance:['ground','fire',[[0,0,0,1],[-16,-18,-9,1],[16,-12,9,1],[-10,-10,-5,1],[0,0,0,1]]],
 cinder:['ground','embers',[[0,0,0,1],[0,-30,-3,.98],[0,-18,3,.99],[0,0,0,1]]],
 cloudtrot:['air','cloud',[[0,0,0,1],[-30,-24,-3,.92],[-10,-38,3,.92],[20,-24,-3,.92],[40,-38,3,.92],[0,0,0,1]]],
 stargallop:['air','stars',[[0,0,0,1],[-45,-25,-8,.9],[-10,-60,-5,.86],[60,-45,4,.8],[0,0,0,1]]],
 puff:['ground','smoke',[[0,0,0,1],[-8,2,-3,.94],[9,-3,5,1.07],[0,0,0,1]]],
 slam:['ground','dust',[[0,0,0,1],[0,-12,-8,1],[0,7,9,1.04],[-5,0,-2,1],[0,0,0,1]]]
};
const trickStage=document.createElement('div');trickStage.id='trick-stage';trickStage.setAttribute('aria-hidden','true');$('#scene').appendChild(trickStage);
let trickRun=null;
const trickColors={gold:'#ffe4a0',petal:'#ffbde2',wave:'#ffe5ac',trail:'#b9eaff',notes:'#f8e0a3',shield:'#a2dfff',bolt:'#a9c7ff',pillar:'#fff0b1',stars:'#d2c5ff',sun:'#ffda86',fire:'#ff9b46',embers:'#ffbd52',cloud:'#d7eaff',smoke:'#bbb1c4',dust:'#cbb38a'};
function stopTrickStage(){if(!trickRun)return;clearTimeout(trickRun.timer);clearInterval(trickRun.frames);trickRun=null;trickStage.classList.remove('on');$('#scene').classList.remove('trick-active');trickStage.replaceChildren();}
function trickValid(){return trickRun&&S===trickRun.state&&!titleUp&&S.phase==='alive'&&!S.sleeping&&!S.exp&&SPEC.id===trickRun.species&&S.coat===trickRun.coat&&stage()===trickRun.stage&&!Object.values(S.eq||{}).some(Boolean)&&tab==='care';}
function trickFX(kind){const c=trickColors[kind], particles=Array.from({length:12},(_,i)=>{const a=i*Math.PI/6,x=160+Math.cos(a)*82,y=185+Math.sin(a)*64;return `<circle cx="${x}" cy="${y}" r="${i%3+2}" fill="${c}" opacity=".85"/>`}).join('');
 const ring=`<ellipse cx="160" cy="245" rx="95" ry="23" fill="none" stroke="${c}" stroke-width="3" opacity=".8"/>`;
 const special=kind==='bolt'?`<path d="M210 35L181 91L209 87L162 159L177 105L151 109L180 35Z" fill="${c}"/>`:kind==='pillar'?`<path d="M105 245L135 20H185L215 245Z" fill="${c}" opacity=".2"/>`:kind==='shield'?`<path d="M160 65L246 101V169Q235 234 160 256Q85 234 74 169V101Z" stroke="${c}" stroke-width="3" fill="${c}" fill-opacity=".1"/>`:kind==='notes'?`<text x="200" y="110" fill="${c}" font-size="30">♪ ♫</text>`:kind==='smoke'?`<g fill="${c}" opacity=".5"><circle cx="243" cy="146" r="15"/><circle cx="269" cy="132" r="20"/><circle cx="290" cy="108" r="17"/></g>`:kind==='sun'?`<circle cx="160" cy="95" r="65" stroke="${c}" stroke-width="3" fill="${c}" fill-opacity=".15"/>`:'';
 return `<g class="trick-fx" opacity="0">${ring}${particles}${special}</g>`;}
function startTrickStage(t,ms){const cfg=TRICK_CHOREO[t.id],w=$('#gwrap'),src=w.querySelector('.growth-frame,.newborn-frame');if(!cfg||!src||!S||S.sleeping||S.exp||Object.values(S.eq||{}).some(Boolean))return false;
 stopTrickStage();const [mode,kind,moves]=cfg,st=stage(),width=[188,208,246,284,310][st],height=width*310/370,href=src.getAttribute('href');
 const r={state:S,species:SPEC.id,coat:S.coat,stage:st,timer:0,frames:0};trickRun=r;
 trickStage.innerHTML=`<svg viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg">${trickFX(kind)}<g class="trick-body"><image href="${href}" x="${(320-width)/2}" y="${267-height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMax meet"/></g></svg><div class="trick-banner"></div>`;
 trickStage.querySelector('.trick-banner').textContent=t.n;trickStage.classList.add('on');$('#scene').classList.add('trick-active');
 const reduced=newbornMotion.matches,body=trickStage.querySelector('.trick-body'),fx=trickStage.querySelector('.trick-fx'),im=body.querySelector('image');
 if(!reduced){body.animate(moves.map(([x,y,a,z])=>({transform:`translate(${x}px,${y}px) rotate(${a}deg) scale(${z})`})),{duration:ms,easing:'ease-in-out'});fx.animate([{opacity:0,transform:'scale(.6)'},{opacity:.85,transform:'scale(1)'},{opacity:.65,transform:'scale(1.15)'},{opacity:0,transform:'scale(1.35)'}],{duration:ms,easing:'ease-out'});
 if(mode==='air'){const frames=Array.from({length:4},(_,i)=>{const a=new Image();a.src=`assets/flight/${r.species}-${r.coat}-${i}.webp`;return a});let i=0;const start=performance.now();r.frames=setInterval(()=>{if(trickRun!==r)return;const elapsed=performance.now()-start;if(elapsed>ms*.84){im.setAttribute('href',href);return}if(elapsed>ms*.12&&frames.every(a=>a.complete&&a.naturalWidth))im.setAttribute('href',frames[i++%4].getAttribute('src'));},125);}}
 r.timer=setTimeout(()=>{if(trickRun===r)stopTrickStage()},ms+40);return true;}
// Use the actual trick ID, since two distinct Phoenix tricks share a legacy class.
let performingTrick=null;
{const previous=ACTS.tperform;ACTS.tperform=function(el){performingTrick=TRICK_BY_ID[el.dataset.id];try{return previous(el)}finally{performingTrick=null}};}
{const previous=animG;animG=function(cls,ms){if(performingTrick&&cls===performingTrick.anim&&startTrickStage(performingTrick,ms))return;return previous(cls,ms);};}
{const previous=renderGriffin;renderGriffin=function(force){if(trickRun&&!trickValid())stopTrickStage();return previous(force);};}
{const previous=renderPanel;renderPanel=function(){if(trickRun&&!trickValid())stopTrickStage();return previous();};}
{const previous=pTricks;pTricks=function(){return previous().replace('Practice with the timing game.','Perform mastered tricks to see your companion’s illustrated magical choreography. Practice with the timing game.');};}


/* v19 — illustrated topology, original region IDs and connections. */
function paintedMap(){const P=REGIONS.filter(r=>(r.zone||1)===zoneSel), ids=new Set(P.map(r=>r.id));const prefix='carto-'+zoneSel+'-';const backdrop=['','sea','isles','heart'][zoneSel];const defs=P.map(r=>`<clipPath id="${prefix}${r.id}"><circle cx="${r.x}" cy="${r.y}" r="20"/></clipPath>`).join('');const links=LINKS.filter(([a,b])=>ids.has(a)&&ids.has(b)).map(([a,b])=>{const A=RB[a],B=RB[b],ok=regionOpen(A)&&regionOpen(B),d=`M${A.x} ${A.y} Q${(A.x+B.x)/2+8} ${(A.y+B.y)/2-10} ${B.x} ${B.y}`;return `<path d="${d}" fill="none" stroke="#10172e" stroke-width="6"/><path d="${d}" fill="none" stroke="${ok?'#f2d58a':'#9da9bb'}" opacity="${ok?1:.65}" stroke-width="2.5" stroke-dasharray="${ok?'none':'4 5'}"/>`}).join('');const nodes=P.map((r,i)=>{const open=regionOpen(r),e=rex(r.id),sel=selR===r.id;return `<g class="map-node" data-act="region" data-id="${r.id}" role="button" tabindex="0" aria-label="${r.n}: ${open?Math.round(e)+' percent explored':'locked'}" style="cursor:pointer"><title>${r.n} · ${open?Math.round(e)+'% explored':'Locked'}</title><circle cx="${r.x}" cy="${r.y}" r="25" fill="#0a1329"/><image href="${realmURL(r.id)}" x="${r.x-20}" y="${r.y-20}" width="40" height="40" preserveAspectRatio="xMidYMid slice" clip-path="url(#${prefix}${r.id})" opacity="${open?1:.55}"/><circle class="map-ring" cx="${r.x}" cy="${r.y}" r="22" fill="none" stroke="${sel?'#fff':open?'#eace87':'#8995b4'}" stroke-width="${sel?3:2}"/>${open&&e>0?`<circle cx="${r.x}" cy="${r.y}" r="25" fill="none" stroke="#f5dc9c" stroke-width="2.5" pathLength="100" stroke-dasharray="${Math.min(100,e)} 100" transform="rotate(-90 ${r.x} ${r.y})"/>`:''}<circle cx="${r.x+17}" cy="${r.y+17}" r="9" fill="#17213c" stroke="#eace87"/><text x="${r.x+17}" y="${r.y+20}" fill="#fff1c5" font-size="8" text-anchor="middle">${e>=100?'★':i+1}</text></g>`}).join('');return `<svg class="wmap" viewBox="0 0 330 340" xmlns="http://www.w3.org/2000/svg" aria-label="Illustrated route map of ${realmZone(zoneSel)}"><defs>${defs}<radialGradient id="${prefix}shade"><stop stop-color="#142345" stop-opacity=".58"/><stop offset="1" stop-color="#090f27" stop-opacity=".9"/></radialGradient></defs><image href="${realmURL(backdrop)}" width="330" height="340" preserveAspectRatio="xMidYMid slice"/><rect width="330" height="340" fill="url(#${prefix}shade)"/><rect x="5" y="5" width="320" height="330" rx="12" fill="none" stroke="#eace87" stroke-opacity=".65"/><g fill="none" stroke="#eace87" opacity=".35"><circle cx="28" cy="28" r="15"/><path d="M28 8V48M8 28H48M19 19L37 37M19 37L37 19"/></g>${links}${nodes}</svg>`;}
function cartography(){const zones=[['sea',1],['isles',2],['heart',3]];const P=REGIONS.filter(r=>(r.zone||1)===zoneSel);return `<div class="map-zones">${zones.map(([id,z])=>{const a=REGIONS.filter(r=>(r.zone||1)===z);return `<button class="btn ${zoneSel===z?'gold':''}" data-act="zone" data-z="${z}" aria-pressed="${zoneSel===z}"><img src="${realmURL(id)}" alt=""><b>${realmZone(z)}</b><small>${a.filter(r=>rex(r.id)>=100).length}/${a.length} explored</small></button>`}).join('')}</div><details class="cartograph" ${selR?'':'open'}><summary style="padding:12px;color:var(--gold2);cursor:pointer">Illustrated route map · ${realmZone(zoneSel)}</summary>${paintedMap()}<div class="map-key"><span><i></i>Available</span><span><i class="locked-key"></i>Locked</span><span><i class="done-key"></i>Exploration progress</span></div><p class="note">Select a landmark on the map, or use the numbered region cards below. Some regions depend on discoveries in another part of the world.</p></details>`;}
{const old=pSky;pSky=function(){if(SUB.sky==='wild'||SUB.sky==='ride'||S.exp)return old();return seg('sky',[['map','Map'],['wild','Wild'],['ride','Ride']])+cartography()+regionCard()+realmAtlas().replace(/<span class="realm-info"><b>/g,()=>'<span class="realm-info"><b>')+`<p class="note">Choose a region to see its landmarks, access requirements and expeditions.</p>`;};}
{const old=realmAtlas;realmAtlas=function(){let i=0;return old().replace(/(<span class="realm-info"><b>)/g,m=>m+(++i)+'. ');};}
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest('.map-node')){e.preventDefault();ACTS.region(e.target.closest('.map-node'));}});
{const old=pCare;pCare=function(){const stats=[['hunger','Food'],['feathers','Care'],['rest','Rest'],['joy','Joy']];let h=old();const glyphs={feed:'✦',preen:'❧',rest:'☾',greet:'♥'};h=h.replace(/(data-act="(feed|preen|rest|greet)">)/g,(_,a,k)=>a+`<span class="care-glyph" aria-hidden="true">${glyphs[k]}</span>`);return `<section class="care-polish" aria-label="Companion care"><div class="care-quick">${stats.map(([k,n])=>`<span>${n}: ${Math.round(S.st[k]||0)}%</span>`).join('')}</div>${h}</section>`;};}
{const old=pGear;pGear=function(){const slots=['neck','head','wing','talon'];return `<h3 class="gear-summary-title">Current equipment</h3><div class="gear-summary">${slots.map(k=>{const g=GEAR_BY_ID[S.eq[k]];return `<div>${g?gearArt(g)||'<span class="empty-gear">✧</span>':'<span class="empty-gear">◇</span>'}<span><b>${SLOT_NAMES[k]}</b><small>${g?g.n:'Empty'}</small></span></div>`}).join('')}</div>`+old().replace('Gear is shown on your griffin','Gear is shown on your companion');};}


/* Final pass: semantic navigation, keyboard accessible settings and dialog focus. */
{const old=renderPanel;renderPanel=function(){const out=old();$$('#tabs button').forEach(b=>{if(b.classList.contains('on'))b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});return out;};}
let releaseFocus=null;
{const old=renderModal;renderModal=function(cfg){releaseFocus=document.activeElement;old(cfg);const card=$('#modal .card');if(!card)return;card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');const h=card.querySelector('h2');if(h){h.id='dialog-heading';card.setAttribute('aria-labelledby',h.id)}card.tabIndex=-1;card.focus({preventScroll:true});};}
{const old=closeModal;closeModal=function(noNext){const prev=releaseFocus;old(noNext);if(!modalOpen&&prev?.isConnected&&prev!==document.body)prev.focus({preventScroll:true});};}
document.addEventListener('keydown',e=>{if(!modalOpen||e.key!=='Tab')return;const card=$('#modal .card');if(!card)return;const f=Array.from(card.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href],summary,[tabindex="0"]')).filter(x=>x.getClientRects().length);if(!f.length){e.preventDefault();return}const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f.at(-1).focus()}else if(!e.shiftKey&&(i<0||i===f.length-1)){e.preventDefault();f[0].focus()}});
{const old=openSettings;openSettings=function(){old();for(const id of ['stCard','stCode','stNew','stShelf']){const el=document.getElementById(id);if(!el)continue;el.tabIndex=0;el.setAttribute('role','button');el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click()}});}};}

/* v21 · Companion Life Update. Retains the v2 save format and all v20 progression. */
const v21FreeFoods=[
 {id:'herbs',n:'Tender Meadow Herbs',cost:0,h:13,joy:4,f:2,g:1,tr:'gentle',d:'Free • Soft greens from the sanctuary garden.'},
 {id:'beetles',n:'Crunchy Glow Beetles',cost:0,h:16,joy:5,f:0,g:1,tr:'mischief',d:'Free • A lively, crackling little snack.'},
 {id:'minnows',n:'Little River Minnows',cost:0,h:18,joy:3,f:1,g:1,tr:'bold',d:'Free • Caught in the shallows near home.'},
 {id:'roots',n:'Sweet Wild Roots',cost:0,h:15,joy:4,f:0,g:1,tr:'fierce',d:'Free • Something satisfying to crunch.'},
 {id:'sunseeds',n:'Golden Sunseeds',cost:0,h:12,joy:6,f:0,g:1,tr:'gentle',d:'Free • A bright treat for curious companions.'},
 {id:'mushrooms',n:'Mooncap Mushrooms',cost:0,h:11,joy:8,f:1,g:1,tr:'mischief',d:'Free • Little silver mushrooms from the ledge.'}
];
FOODS.splice(1,0,...v21FreeFoods);
FOODS.push(
 {id:'catch',n:'Fresh Foraged Fish',pantry:'catch',cost:0,h:31,joy:6,f:3,g:2,tr:'bold',d:'Gather by the stream • A real meal.'},
 {id:'nectar',n:'Golden Honeycomb',pantry:'nectar',cost:0,h:22,joy:15,f:2,g:2,tr:'gentle',d:'Gather near the flower terraces • A special sweet.'},
 {id:'glowfruit',n:'Glowfruit',pantry:'glowfruit',cost:0,h:24,joy:12,f:1,g:2,tr:'mischief',d:'Gather in the shaded grove • Rare and delicious.'}
);
function v21State(){if(!S)return;S.pantry??={};S.careCd??={};for(const k of ['catch','nectar','glowfruit'])S.pantry[k]=Math.max(0,Number(S.pantry[k])||0);}
{const before=migrate;migrate=function(o){const out=before(o);out.pantry??={};out.careCd??={};return out};}
{const before=fresh;fresh=function(k){const out=before(k);out.pantry={};out.careCd={};return out};}
const v21TraitColors={gentle:'#9ad2b4',fierce:'#ef9c75',bold:'#a7c7f7',mischief:'#d4afea'};
function v21Nature(){v21State();const personality=domTrait();const top=personality?TRAIT_ADJ[personality]:'Still discovering itself';const values=Object.keys(TRAIT_ADJ).map(k=>Math.max(0,S.tr[k]||0));const max=Math.max(12,...values);return `<section class="nature-focus" aria-label="Companion personality"><header><strong>✧ ${S.name}'s Nature</strong><span class="nature-title">${top}</span></header><div class="nature-bars">${Object.entries(TRAIT_ADJ).map(([k,n])=>{const v=Math.max(0,S.tr[k]||0),p=clamp(v/max*100,0,100);return `<div class="nature-line"><b>${n}</b><small>${v.toFixed(1)}</small><div class="track" role="progressbar" aria-label="${n} nature" aria-valuemin="0" aria-valuemax="${max.toFixed(1)}" aria-valuenow="${v.toFixed(1)}"><i style="width:${p}%;background:${v21TraitColors[k]}"></i></div></div>`}).join('')}</div><p>Every choice shapes your companion. Gentle, Fierce, Bold, and Mischievous can all grow together.</p></section>`;}
function v21Remaining(k){v21State();return Math.max(0,(S.careCd[k]||0)-Date.now());}
function v21Ready(k){return !v21Remaining(k)}
function v21Button(id,title,desc,symbol,disabled=false){const remain=v21Remaining(id);return `<button class="btn ${id==='feed'?'gold':''}" data-act="${id}" ${disabled?'disabled':''}><b><span class="act-glyph" aria-hidden="true">${symbol}</span>${title}</b><small>${remain?Math.ceil(remain/1000)+'s until ready':desc}</small></button>`;}
function v21Care(){v21State();const l=lvl(),gr=Date.now()<S.cd.greet,off=S.sleeping,feathers=SPEC.id==='wyvern'?'scales':'feathers';return `<section class="care-polish"><button type="button" class="focus-open-care" data-act="focusCreature">↗ View & Pet<small>See ${S.name} up close without shrinking text</small></button>${v21Nature()}<div class="care-pantry"><b>Free everyday food</b> is always available. Forage to collect more filling treats without flying.<div>Gathered: 🐟 ${S.pantry.catch} fish · 🍯 ${S.pantry.nectar} honeycomb · ✨ ${S.pantry.glowfruit} glowfruit · <b>${S.prov}</b> provisions</div></div><h3 class="care-section-heading">Everyday care</h3><div class="care-action-grid">${v21Button('feed','Feed','Many free foods + gathered treats','✦',off)}${v21Button('forageCare','Forage','Find fresh food near your nest','❀',off)}${v21Button('washCare',SPEC.id==='wyvern'?'Polish Scales':'Freshen Up',`Gently clean ${feathers}`,'❧',off||!v21Ready('washCare'))}${v21Button('rest',off?'Wake Up':'Let Rest',off?'Wake your companion':'Curl up and sleep','☾')}
</div><h3 class="care-section-heading">Play, connect & grow</h3><div class="care-action-grid">${v21Button('playCare','Play Together','Chase a glowing feather','★',off||!v21Ready('playCare'))}${v21Button('talkCare','Talk Together','Shape your companion’s nature','♬',off||!v21Ready('talkCare'))}${v21Button('cuddleCare','Cuddle','A quiet moment of trust','♥',off||!v21Ready('cuddleCare'))}${v21Button('drinkCare','Offer Water','A cool drink from the spring','◈',off||!v21Ready('drinkCare'))}${v21Button('stretchCare','Wing Stretches','Practice growing stronger','➶',off||!v21Ready('stretchCare'))}${v21Button('discoverCare','Explore the Nest','Find something interesting','⌕',off||!v21Ready('discoverCare'))}${v21Button('preen',SPEC.id==='wyvern'?'Deep Scale Care':'Deep Preening',l<2?'Trusting bond needed':'Swipe across your companion','✧',off||l<2)}${v21Button('greet','Greeting',l<3?'Nuzzling bond needed':gr?'Cooling down':'Nuzzle and bond','♡',off||l<3||gr)}${v21Button('trickshow','Magic Theater','Watch spectacular trick previews','✹',off)}</div><p class="care-note">Tap ${S.name} directly to pet its favorite spot. Forage and play work before the first flight. Free foods restore less than premium meals, so provisions still matter.</p></section>`;}
pCare=v21Care;
function v21CareGuard(id){if(!guard())return false;if(S.sleeping){say(`${S.name} is sleeping. Wake your companion first.`);return false}if(!v21Ready(id)){say(`Ready again in ${Math.ceil(v21Remaining(id)/1000)} seconds.`);return false}return true;}
function v21FinishCare(id,cooldown,feedback,fx){S.careCd[id]=Date.now()+cooldown*1000;S.growth+=fx.growth||0;stat('joy',fx.joy||0);stat('rest',fx.rest||0);stat('feathers',fx.feathers||0);if(fx.trait)S.tr[fx.trait]+=fx.traitGain||.45;addBond(fx.bond||1);if(fx.prov)S.prov+=fx.prov;const oldStage=stageOf(S.growth-(fx.growth||0));if(stage()>oldStage)onStageUp();if(fx.anim)careVisual(fx.anim,1150);burst(...gcenter(.15,-.18),fx.heart?'heart':'spark',fx.heart?6:8);sfx('chime');say(feedback,7000);save();renderAll();checkEvents();}
ACTS.forageCare=()=>{if(!v21CareGuard('forageCare'))return;const places=[['The sparkling stream','catch','🐟 Fresh Foraged Fish','bold'],['The flower terrace','nectar','🍯 Golden Honeycomb','gentle'],['The shaded grove','glowfruit','✨ Glowfruit','mischief']];showModal({title:'Forage near home',html:`<p>Choose where to gather free treats for ${S.name}. No wings or provisions required.</p><p class="note">Each trip takes a little time to recover from. You can keep caring for your companion while foraging cools down.</p>`,buttons:[...places.map(([place,key,label,trait])=>({t:`${place} · ${label}`,fn:()=>{v21State();const count=1+(Math.random()<.3?1:0);S.pantry[key]=Math.min(12,S.pantry[key]+count);v21FinishCare('forageCare',70,`${S.name} explores with you. You gather ${count} ${key==='catch'?'fresh fish':key==='nectar'?'honeycomb pieces':'glowfruit'}!`,{joy:4,bond:1,rest:-2,growth:.6,trait,traitGain:.3,anim:'care-play'});}})),{t:'Not right now'}]});};
ACTS.playCare=()=>{if(!v21CareGuard('playCare'))return;v21FinishCare('playCare',75,pick([`${S.name} chases a golden ribbon, spins around and begs to do it again.`,`${S.name} plays until it is breathless, then bumps your hand for another round.`,`${S.name} leaps at the drifting feathers and lands looking deeply pleased.`]),{joy:12,rest:-4,growth:1.2,bond:2,trait:'mischief',traitGain:.7,anim:'care-play'});};
ACTS.cuddleCare=()=>{if(!v21CareGuard('cuddleCare'))return;v21FinishCare('cuddleCare',110,`${S.name} settles close, warm and trusting. This is what home feels like.`,{joy:8,rest:4,bond:2.4,trait:'gentle',traitGain:.7,anim:'care-cuddle',heart:true});};
ACTS.drinkCare=()=>{if(!v21CareGuard('drinkCare'))return;v21FinishCare('drinkCare',90,`${S.name} drinks from the spring, shakes off the droplets and looks refreshed.`,{joy:3,rest:5,bond:1,feathers:1,growth:.3,anim:'care-cuddle'});};
ACTS.washCare=()=>{if(!v21CareGuard('washCare'))return;v21FinishCare('washCare',120,`${S.name}'s ${SPEC.id==='wyvern'?'scales gleam like polished copper':'plumage shines in the sunlight'}.`,{joy:5,feathers:10,bond:1.8,trait:'gentle',traitGain:.45,anim:'care-cuddle'});};
ACTS.stretchCare=()=>{if(!v21CareGuard('stretchCare'))return;v21FinishCare('stretchCare',110,`${S.name} stretches its wings as far as they will go. One day, the sky will be waiting.`,{joy:5,rest:-4,growth:2,bond:1,trait:'bold',traitGain:.65,anim:'care-stretch'});};
ACTS.discoverCare=()=>{if(!v21CareGuard('discoverCare'))return;const surprise=Math.random()<.3?1:0;v21FinishCare('discoverCare',100,`${S.name} noses beneath the nesting stones. ${surprise?'You find a provision tucked away!':'You uncover a curious old pebble and a very happy companion.'}`,{joy:7,rest:-2,growth:.7,bond:1,prov:surprise,trait:'mischief',traitGain:.4,anim:'care-play'});};
ACTS.talkCare=()=>{if(!v21CareGuard('talkCare'))return;const opts=[['Tell a gentle story','gentle',`${S.name} listens with soft eyes, then leans close.`],['Dream of adventure','bold',`${S.name} spreads its wings as if the horizon just called.`],['Talk about courage','fierce',`${S.name} lets out a fearless little cry.`],['Make a silly joke','mischief',`${S.name} makes a sound suspiciously like a giggle.`]];showModal({title:`Talk with ${S.name}`,html:`<p>What you say matters. These moments gently shape personality.</p>`,buttons:[...opts.map(([n,trait,line])=>({t:n,fn:()=>v21FinishCare('talkCare',90,line,{joy:6,bond:2,trait,traitGain:1,anim:'care-cuddle',heart:trait==='gentle'})})),{t:'Maybe later'}]});};
const originalV21Feed=feed;
feed=function(id){const f=FOODS.find(x=>x.id===id);if(!f)return;v21State();if(f.pantry){if(S.pantry[f.pantry]<1){say('Forage nearby to gather more of that treat.');return}if(S.st.hunger>=92||S.sleeping){say(`${S.name} is not ready to eat.`);return}S.pantry[f.pantry]-=1;}originalV21Feed(id);};
doFeedMenu=function(){if(S.sleeping){say(`${S.name} is sleeping. Wake your companion first.`);return}v21State();const groups=[['Free · Always Available',FOODS.filter(f=>!f.cost&&!f.pantry)],['Foraged · Find Before Flying',FOODS.filter(f=>f.pantry)],['Provisions · Heartier Meals',FOODS.filter(f=>f.cost)]];const html=groups.map(([title,foods])=>`<h3 class="food-group">${title}</h3><div class="food-list">${foods.map(f=>{const qty=f.pantry?S.pantry[f.pantry]:null;const disabled=S.st.hunger>=92||(f.pantry&&qty<1)||(f.cost>S.prov);return `<button class="food-choice" type="button" data-food="${f.id}" ${disabled?'disabled':''}><span><b>${f.n}</b><small>${f.d} · +${f.h} food · +${f.joy} joy</small></span><span class="pill">${f.pantry?'×'+qty:f.cost?f.cost+' provisions':'FREE'}</span></button>`}).join('')}</div>`).join('')+`<p class="note">Forage from the Care tab to gather special treats without flying. Expeditions, daily moments and quests also provide provisions. Full companions prefer to play instead of eating.</p>`;showModal({title:'A Feast of Choices',html,buttons:[{t:'Close'}],onShow:m=>{$$('[data-food]',m).forEach(b=>b.onclick=()=>{if(b.disabled)return;closeModal(true);feed(b.dataset.food)})}});};
/* More impressive illustrated trick performances, including a 12-frame wyvern fire-breath animation. */
function v21PreviewTrick(t){if(!guard())return;if(S.sleeping){say('Wake your companion to watch the trick.');return}tab='care';renderPanel();const ms=t.ms||2850;if(!startTrickStage(t,ms)){animG(t.anim,ms)}say(`${S.name} demonstrates ${t.n}! This is a preview; mastery and rewards are earned through training.`,ms+1300);}
ACTS.trickshow=()=>{if(!v21CareGuard('trickshow'))return;const arr=TRICKS.filter(t=>!t.sp||t.sp===SPEC.id);showModal({title:'Magic Theater',html:`<p class="note">Watch the animations for ${SPEC.w} tricks. Previewing is free; unlocking performance rewards still requires practice.</p><div class="food-list">${arr.map(t=>`<button type="button" class="food-choice" data-preview="${t.id}"><span><b>✦ ${t.n}</b><small>${t.d}</small></span><span class="pill">Preview</span></button>`).join('')}</div>`,buttons:[{t:'Close'}],onShow:m=>{$$('[data-preview]',m).forEach(b=>b.onclick=()=>{const t=TRICK_BY_ID[b.dataset.preview];closeModal(true);v21PreviewTrick(t)})}});};
ACTS.tpreview=el=>{const t=TRICK_BY_ID[el.dataset.id];if(t)v21PreviewTrick(t)};
pTricks=function(){let h=`<p class="note">Practice to earn mastery. Tap <b>Preview</b> to watch the special move without using resources or a cooldown.</p>`;TRICKS.filter(t=>!t.sp||t.sp===SPEC.id).forEach(t=>{const ok=trickOk(t),m=Math.round(S.tricks[t.id]||0),cd=(S.trickCd[t.id]||0)-Date.now(),match=domTrait()===t.aff;h+=`<div class="row trick-card ${ok?'':'lock'}"><div class="grow"><b>${t.n}</b> ${m>=100?'<span class="pill">Mastered</span>':''}<small>${ok?t.d+(match?' · suits its nature':''):`Needs ${STAGES[t.req.st].n} and bond level ${t.req.lvl+1}`}</small>${ok?`<div class="bar" style="margin-top:5px"><i style="width:${m}%;background:var(--gold)"></i></div>`:''}</div><div class="trick-actions"><button class="btn" data-act="tpreview" data-id="${t.id}">Preview ✨</button>${ok?`<button class="btn" data-act="tpractice" data-id="${t.id}">Practice</button><button class="btn ${m>=50&&cd<=0?'gold':'dis'}" data-act="tperform" data-id="${t.id}">${cd>0?Math.ceil(cd/60000)+'m':'Perform'}</button>`:''}</div></div>`});return h};
let v21FxRAF=0,v21FrameInterval=0;
const v21StopTrick=stopTrickStage;
stopTrickStage=function(){cancelAnimationFrame(v21FxRAF);clearInterval(v21FrameInterval);v21FxRAF=0;v21FrameInterval=0;v21StopTrick();};
function v21Vfx(t,ms,r){const canvas=document.createElement('canvas');canvas.className='v21-fxcanvas';canvas.width=640;canvas.height=600;trickStage.appendChild(canvas);const ctx=canvas.getContext('2d');if(!ctx)return;
 const kind=TRICK_CHOREO[t.id]?.[1]||'gold',color=trickColors[kind]||'#ffe4a0',start=performance.now(),reduced=newbornMotion.matches;
 function frame(now){if(trickRun!==r)return;const p=clamp((now-start)/ms,0,1);const glow=Math.sin(p*Math.PI);ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,320,300);const drawStar=(x,y,rad,opacity)=>{ctx.globalAlpha=opacity;ctx.fillStyle=color;ctx.beginPath();for(let q=0;q<8;q++){const a=q*Math.PI/4,rr=q%2?rad*.3:rad,px=x+Math.cos(a)*rr,py=y+Math.sin(a)*rr;q?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.closePath();ctx.fill()};
 ctx.save();ctx.globalCompositeOperation='screen';
 if(['wave','bolt','dust','shield','pillar','sun','fire','smoke'].includes(kind)){for(let i=0;i<4;i++){const rr=24+((p*1.2+i*.24)%1)*140;ctx.strokeStyle=color;ctx.globalAlpha=glow*.55*(1-rr/200);ctx.lineWidth=i%2?3:5;ctx.beginPath();if(kind==='dust')ctx.ellipse(160,250,rr,rr*.17,0,0,Math.PI*2);else ctx.arc(170,158,rr,0,Math.PI*2);ctx.stroke()}}
 if(['bolt','fire','embers','sun','pillar','stars','trail','gold','smoke','notes','petal','cloud'].includes(kind)){for(let i=0;i<32;i++){const a=i*2.399+Math.floor(i/5)*.2;const dist=20+((p*.75+i*.07)%1)*145;const x=162+Math.cos(a+p*3)*dist,y=164+Math.sin(a-p*2)*dist*.68;drawStar(x,y,(i%5+3)*(kind==='fire'?1.7:1),glow*.62)}}
 if(kind==='shield'){ctx.globalAlpha=glow*.85;ctx.strokeStyle='#8bd9ff';ctx.lineWidth=4;ctx.beginPath();for(let i=0;i<7;i++){const a=(i/6)*Math.PI*2-Math.PI/2;const x=160+95*Math.cos(a),y=162+105*Math.sin(a);i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();ctx.stroke()}
 if(kind==='bolt'){ctx.strokeStyle='#bde8ff';ctx.globalAlpha=glow;ctx.lineWidth=5;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(90+i*70,40);ctx.lineTo(80+i*70,110);ctx.lineTo(96+i*70,120);ctx.lineTo(75+i*70,192);ctx.stroke()}}
 if(kind==='notes'){ctx.globalAlpha=glow*.9;ctx.fillStyle=color;ctx.font='bold 36px serif';['♪','♫','♬'].forEach((x,i)=>ctx.fillText(x,215+i*20,145-i*43-p*32))}
 if(kind==='sun'||kind==='pillar'){const g=ctx.createRadialGradient(160,115,15,160,115,120);g.addColorStop(0,'#fff9d9a8');g.addColorStop(1,'#ffaf2300');ctx.globalAlpha=glow*.45;ctx.fillStyle=g;ctx.fillRect(0,0,320,250)}
 if(kind==='smoke'||t.id==='puff'){for(let i=0;i<15;i++){ctx.globalAlpha=glow*.35;ctx.fillStyle=i%2?'#f9ad58':'#aaa2b6';ctx.beginPath();ctx.arc(245+i*3,154+Math.sin(i*1.7+p*7)*17-p*25,8+i%4*3,0,Math.PI*2);ctx.fill()}}
 if(kind==='dust'||t.id==='slam'){ctx.strokeStyle='#e5c790';ctx.globalAlpha=glow*.9;ctx.lineWidth=3;for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.beginPath();ctx.moveTo(160+Math.cos(a)*25,255+Math.sin(a)*13);ctx.lineTo(160+Math.cos(a)*(35+p*100),255+Math.sin(a)*(10+p*40));ctx.stroke()}}
 if(kind==='trail'||kind==='stars'||kind==='cloud'){ctx.lineWidth=5;for(let i=0;i<7;i++){ctx.strokeStyle=i%2?'#f2dc9e':'#b7e2ff';ctx.globalAlpha=glow*.65;ctx.beginPath();ctx.arc(160,170,30+i*15,-Math.PI*.95+p*6,-Math.PI*.5+p*6);ctx.stroke()}}
 ctx.restore();if(!reduced&&p<1)v21FxRAF=requestAnimationFrame(frame);else if(reduced){ctx.clearRect(0,0,320,300)}}
 v21FxRAF=requestAnimationFrame(frame);
}
const v21StartTrick=startTrickStage;
startTrickStage=function(t,ms){const ok=v21StartTrick(t,ms);if(!ok)return false;const r=trickRun;v21Vfx(t,ms,r);if(t.id==='puff'&&SPEC.id==='wyvern'){const originalBody=trickStage.querySelector('.trick-body');if(originalBody)originalBody.style.visibility='hidden';const im=document.createElement('img');im.className='wyvern-frame';im.alt='';trickStage.appendChild(im);const coat=S.coat;let k=0;const frames=Array.from({length:12},(_,i)=>{const src=`assets/tricks/wyvern-puff-${coat}-${i}.webp`;const image=new Image();image.src=src;return src;});im.src=frames[0];v21FrameInterval=setInterval(()=>{if(trickRun!==r){clearInterval(v21FrameInterval);return}k=Math.min(11,k+1);im.src=frames[k];if(k===11)clearInterval(v21FrameInterval)},Math.max(95,Math.floor(ms/12)));}
 return true;};

/* v21.1 Companion View: text settings and pet interaction are independent. */
let creatureViewOpen=false;
function setCreatureView(next){
 if(next&&(!S||titleUp||S.phase!=='alive'||modalOpen))return;
 creatureViewOpen=!!next;
 const app=$('#app');app.classList.toggle('creature-focus',creatureViewOpen);
 $('#focusControls').hidden=!creatureViewOpen;
 $('#focusName').textContent=creatureViewOpen?(S.name||'Your companion'):'';
 $('#companionOpen').setAttribute('aria-expanded',String(creatureViewOpen));
 if(creatureViewOpen){$('#focusBack').focus({preventScroll:true});}
 else{if(tab==='care'&&!$('#app').classList.contains('reading')){const b=$('#panel .focus-open-care');if(b)b.focus({preventScroll:true});}}
}
{const previous=renderPanel;renderPanel=function(){const result=previous();$('#companionOpen').hidden=!(S&&S.phase==='alive');return result;};}
ACTS.focusCreature=()=>setCreatureView(true);
$('#companionOpen').addEventListener('click',()=>setCreatureView(true));
$('#focusBack').addEventListener('click',()=>setCreatureView(false));
$$('[data-focus-spot]').forEach(b=>b.addEventListener('click',()=>{
 if(!creatureViewOpen||!S||S.sleeping){say(S?.sleeping?'Wake your companion before petting.':'Your companion is not available.',3500);return}
 const sc=$('#scene').getBoundingClientRect(),c=gcenter(0,-.1);
 pet(Number(b.dataset.focusSpot),{clientX:sc.left+c[0],clientY:sc.top+c[1]});
}));
$('#gwrap').addEventListener('pointerdown',e=>{
 // The sprite artwork often has no SVG hotspot: make the whole visible companion tappable.
 if(!creatureViewOpen||!S||S.phase!=='alive'||S.sleeping||preen||modalOpen)return;
 if(e.target.dataset&&e.target.dataset.spot!==undefined)return;
 const r=$('#gwrap').getBoundingClientRect();
 if(!r.width||!r.height)return;
 const px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
 const spot=py<.34?0:px<.44?2:py<.62?1:3;
 pet(spot,e);
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&creatureViewOpen&&!modalOpen){e.preventDefault();setCreatureView(false)}});
{const prev=textSizeControls;textSizeControls=function(){return prev().replace('Your saved companion is unchanged.','Your saved companion is unchanged. The View & Pet button keeps your creature large without changing this setting.');};}

/* boot */
resize();requestAnimationFrame(drawBG);
const existing=load();if(existing){applySpecies(existing.species||'griffin');$('#tCont').style.display='';$('#tNew').style.display='';$('#tBegin').style.display='none'}
S=null;
loadNewbornArt();
if(DEBUG){const d=document.createElement('div');d.className='dbg';document.body.appendChild(d);
  const add=(t,f)=>{const b=document.createElement('button');b.className='btn';b.textContent=t;b.onclick=()=>{if(S){f();renderAll();save()}};d.appendChild(b)};
  add('+stage',()=>{if(S.phase==='egg'){S.hatch=99}else{const s=stage();if(s<4)S.growth=STAGES[s+1].g+1}});
  add('+bond',()=>{S.bondXP+=60});add('+3h away',()=>{S.last-=3*3600*1000;const dt=3*3600;offline(dt);S.last=Date.now();onOpen(dt)});
  add('+1 day',()=>{S.daily='';onOpen(0)});add('fill',()=>{for(const k in S.st)S.st[k]=100;S.prov+=10});
  add('events',()=>{checkEvents()});
  window.AD={get S(){return S},act,ACTS,renderPanel,renderAll,openSettings,griffinSVG,gearSVG,GEAR,TRICKS,resolveExp,startExp,WILD,REGIONS,layEgg,switchTo,festNow,festCheck,BOONS,DEEDS,checkDeeds,STAGES,boonCost,applySpecies,SPECIES,SPEC_ORDER,pickSpecies,sx,get SPEC(){return SPEC},eggSVG,renderAll,checkEvents,cont,begin,stage,lvl,tickN:n=>{for(let i=0;i<n;i++)tick(60)}}}
})();
