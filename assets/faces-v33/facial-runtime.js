/* Everhatch v33 — jaw/beak, gaze and crest/ear articulation.
 * Source-derived 2D cutouts, 150 age/coat models, independent of game saves.
 * V32 eyelid/expression art composites OVER this runtime when both are visible. */
(function(){
 'use strict';
 const rig=window.EVERHATCH_RIG;
 const FOLDER='assets/faces-v33/';
 const WIDTH=370,HEIGHT=310;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const cache=new Map();
 const counters={loaded:0,failed:0,frames:0,rigFrames:0,activeModels:0};
 let metadata=null, metadataPromise=null, readGame=()=>null, active=null, raf=0, last=0, idleCanvas=null;
 let reaction={kind:'',started:0,until:0,duration:0};
 let lookTarget=0,lookUntil=0,filteredGaze=0,lastGazeSample=0;
 const specifics={
  griffin:{jaw:.78,ear:.09,gaze:1.5},hippogriff:{jaw:.82,ear:.10,gaze:1.7},
  phoenix:{jaw:.80,ear:.13,gaze:1.4},pegasus:{jaw:.43,ear:.19,gaze:1.6},
  wyvern:{jaw:1.0,ear:.14,gaze:1.8}
 };
 const bounded=(v,a,b)=>Math.max(a,Math.min(b,v));
 const imgLoad=url=>new Promise((resolve,reject)=>{let a=new Image();a.onload=()=>resolve(a);a.onerror=()=>reject(Error('Missing image '+url));a.src=url;});
 const modelId=(sp,st,coat)=>`${sp}-${st}-${coat}`;
 function load(sp,st,coat){
  const id=modelId(sp,st,coat);
  if(cache.has(id))return cache.get(id);
  const promise=Promise.all([metadataPromise||Promise.resolve(),imgLoad(FOLDER+id+'-jaw.webp'),imgLoad(FOLDER+id+'-crest.webp'),imgLoad(FOLDER+id+'-eye-base.webp'),imgLoad(FOLDER+id+'-iris.webp'),imgLoad('assets/interiors-v34/'+id+'.webp')]).then(images=>{
   images=images.slice(1);
   if(!metadata||!metadata.models[id])throw Error('Missing geometry '+id);
   counters.loaded++;return {id,sp,st,coat,info:metadata.models[id],jaw:images[0],crest:images[1],base:images[2],iris:images[3],interior:images[4]};
  }).catch(e=>{cache.delete(id);counters.failed++;throw e;});
  cache.set(id,promise);
  if(cache.size>8){const k=cache.keys().next().value;if(k!==id)cache.delete(k);}
  counters.activeModels=cache.size;
  return promise;
 }
 function react(kind,duration=1250){if(reduced.matches)return;reaction={kind,started:performance.now(),duration,until:performance.now()+duration};}
 function look(x,y){
  if(reduced.matches)return;
  // A touch to the left/right of the creature steers its gaze for a moment.
  if(x==null){lookTarget=.6;lookUntil=performance.now()+1700;return;}
  const w=document.documentElement.clientWidth||400;
  lookTarget=bounded((x/w-.5)*2,-1,1);lookUntil=performance.now()+1500;
 }
 function stateFor(action,p,now,sp){
  const t=reaction.until>now?bounded((now-reaction.started)/Math.max(1,reaction.duration),0,1):0;
  const isReact=reaction.until>now;
  const k=isReact?reaction.kind:'';
  let mouth=0;
  // Chewing uses two clear bites; the call and yawn use a long opening and closing.
  const wave=Math.pow(Math.sin(Math.PI*p),2);
  // Each opening has anticipation and a tapered recovery; no instant open/closed jump.
  if(action==='feed'||action==='drink')mouth=wave*(.14+.31*Math.pow(Math.sin(Math.PI*3*p),2));
  if(action==='roar'||action==='call')mouth=.72*Math.pow(Math.sin(Math.PI*p),1.35);
  if(action==='sing')mouth=wave*(.19+.29*Math.pow(Math.sin(Math.PI*3*p),2));
  if(action==='play')mouth=.14*wave;
  const reactEnv=isReact?Math.pow(Math.sin(Math.PI*t),.85):0;
  if(k==='chew')mouth=Math.max(mouth,reactEnv*(.23+.31*Math.pow(Math.sin(Math.PI*3*t),2)));
  if(k==='roar'||k==='chatter')mouth=Math.max(mouth,reactEnv*(k==='roar'?.86:.51));
  if(k==='yawn')mouth=Math.max(mouth,.88*Math.pow(reactEnv,1.25));
  if(k==='pleased')mouth=Math.max(mouth,.12*reactEnv);
  // v34.1: prevent a visible neck/crest cutout from appearing and disappearing
  // during passive idle animation. The old sine wave briefly crossed the render
  // threshold and produced an on/off sprite flash, especially on Wyverns.
  // Crest motion now happens only during an actual action or emotional reaction,
  // and all movement returns smoothly to neutral.
  const crestActive=['alert','curious','roar','play','chatter','pleased','wary','yawn'].includes(k);
  const crestReact=(isReact&&crestActive)?(.40*Math.sin(Math.PI*t)*Math.sin(t*Math.PI*2)):0;
  const crestAction=(action!=='idle'&&action!=='sleep')?(.018*Math.sin(Math.PI*p)*Math.sin(now/520)):0;
  const crest=crestReact+crestAction;
  const glide=Math.sin(now/1500)+.37*Math.sin(now/2200);
  let gaze=lookUntil>now?lookTarget:bounded(glide*.52,-1,1);
  if(k==='curious'||k==='play')gaze=Math.sin(t*Math.PI*2)*.72;
  if(k==='wary')gaze=-.75;
  if(k==='pleased'||k==='yawn')gaze*=.28;
  // Critically damped gaze prevents a hard jump when the player changes petting spots.
  const ms=lastGazeSample?bounded(now-lastGazeSample,0,130):70;
  lastGazeSample=now;
  filteredGaze+=(gaze-filteredGaze)*(1-Math.exp(-ms/120));
  return {mouth:bounded(mouth,0,1)*(specifics[sp]?.jaw||.7),crest:crest*(specifics[sp]?.ear||.08),gaze:filteredGaze*(specifics[sp]?.gaze||1.5)};
 }
 function paint(ctx,model,action,p,rect,opts={}){
  if(!model||reduced.matches)return;
  const sp=model.sp,info=model.info,now=performance.now();
  const amt=opts.debugState||stateFor(action,p,now,sp);
  ctx.save();ctx.translate(rect.x,rect.y);ctx.scale(rect.w/WIDTH,rect.h/HEIGHT);
  // Match the existing articulated head transform precisely, including the moved pivot.
  if(opts.followHead&&rig&&rig.params){
   const m=rig.params(action,p,sp,model.st,opts.mode||'care').head;
   const h=opts.rigMeta.pivot.head;
   ctx.translate(h[0],h[1]);ctx.translate(m.x||0,m.y||0);ctx.rotate(m.r||0);ctx.translate(-h[0],-h[1]);
  }
  const [cx,cy,rad]=info.eye;
  const [ex0,ey0,ex1,ey1]=info.eyeRect;
  // Subtle eye movement: inpaint source pupil, then reapply its coat-matched iris at a shifted position.
  if(Math.abs(amt.gaze)>.11){
   ctx.save();ctx.globalAlpha=.82;
   ctx.drawImage(model.base,ex0,ey0,ex1-ex0,ey1-ey0);
   ctx.globalAlpha=.98;
   ctx.drawImage(model.iris,ex0+amt.gaze,ey0,ex1-ex0,ey1-ey0);
   ctx.restore();
  }
  // Feather crest, mane tuft or ear, sampled directly from each age and coat.
  if(Math.abs(amt.crest)>.001){
   const [x0,y0,x1,y1]=info.crestRect,[px,py]=info.crestPivot;
   // Fade the patch into motion rather than making the entire rectangular
   // region appear abruptly on the first threshold-crossing frame.
   const alpha=bounded((Math.abs(amt.crest)-.001)/.035,0,1)*.92;
   ctx.save();ctx.translate(px,py);ctx.rotate(amt.crest);ctx.translate(-px,-py);
   ctx.globalAlpha=alpha;ctx.drawImage(model.crest,x0,y0,x1-x0,y1-y0);ctx.restore();
  }
  if(amt.mouth>.018){
   const [x0,y0,x1,y1]=info.jawRect,[px,py]=info.jawPivot;
   const openness=amt.mouth,dy=Math.min(sp==='pegasus'?3:5,Math.max(1,(y1-y0)*.25))*openness;
   // The v34 interior is a small painted palette-matched texture with soft lip edges.
   // This avoids a generic dark polygon across every species and coat.
   ctx.save();ctx.globalAlpha=Math.min(.97,openness*.90);
   if(model.interior){
     ctx.drawImage(model.interior,x0,y0+1,Math.max(3,x1-x0),Math.max(1.1,1.5+dy*1.55));
   } else {
     ctx.fillStyle='rgba(56,25,32,.65)';ctx.fillRect(x0+2,y0+1,x1-x0-4,Math.max(1,dy));
   }
   ctx.restore();
   ctx.save();ctx.translate(px,py);ctx.rotate(openness*(sp==='pegasus'?.06:.105));ctx.translate(-px,-py);
   ctx.globalAlpha=Math.min(.95,.60+.35*openness);
   ctx.drawImage(model.jaw,x0,y0+dy,x1-x0,y1-y0);ctx.restore();
  }
  ctx.restore();counters.frames++;
 }
 function attach(){
  if(!rig||rig.__articulatedFaces33)return;
  const baseDraw=rig.draw;
  rig.draw=function(ctx,model,action,p,rect,opts){
   const r=baseDraw.call(this,ctx,model,action,p,rect,opts);
   const id=modelId(model.sp,model.st,model.coat);
   const ready=active&&active.id===id?active:null;
   if(ready){paint(ctx,ready,action,p,rect,{followHead:true,rigMeta:model.metadata,mode:opts?.mode||'care'});counters.rigFrames++;}
   else{load(model.sp,model.st,model.coat).then(m=>{active=m}).catch(()=>{});}
   return r;
  };
  rig.__articulatedFaces33=true;
 }
 function valid(g){return Boolean(g&&g.alive&&g.state&&!g.sleeping&&!g.away&&!g.title&&!g.equipped&&!reduced.matches)}
 function start(reader){
  readGame=reader;attach();
  if(!metadataPromise){const local=window.EVERHATCH_FACE33_MANIFEST;metadataPromise=local?Promise.resolve().then(()=>{metadata=local;return local;}):fetch(FOLDER+'manifest.json').then(x=>{if(!x.ok)throw Error('Face manifest unavailable');return x.json()}).then(x=>{metadata=x;return x}).catch(e=>{counters.failed++;throw e});}
  if(!raf)raf=requestAnimationFrame(tick);
 }
 function tick(now){
  raf=requestAnimationFrame(tick);if(now-last<65)return;last=now;
  const g=readGame();const wrap=document.getElementById('gwrap');
  if(!valid(g)||!wrap||!metadata){if(idleCanvas){idleCanvas.remove();idleCanvas=null;}return;}
  const id=modelId(g.species,g.stage,g.coat);
  if(!active||active.id!==id){load(g.species,g.stage,g.coat).then(m=>{active=m;}).catch(()=>{});}
  if(wrap.classList.contains('v30-active')){if(idleCanvas){idleCanvas.remove();idleCanvas=null;}return;}
  if(!idleCanvas||!idleCanvas.isConnected){idleCanvas=document.createElement('canvas');idleCanvas.className='v33-face-idle';idleCanvas.width=640;idleCanvas.height=600;idleCanvas.setAttribute('aria-hidden','true');wrap.appendChild(idleCanvas);}
  const ctx=idleCanvas.getContext('2d');if(!ctx)return;ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,320,300);
  const el=wrap.querySelector('svg image.growth-frame,svg image.newborn-frame');if(!el||!active||active.id!==id)return;
  const rect={x:Number(el.getAttribute('x')||0),y:Number(el.getAttribute('y')||0),w:Number(el.getAttribute('width')||0),h:Number(el.getAttribute('height')||0)};
  if(rect.w<1||rect.h<1)return;
  paint(ctx,active,'idle',.25,rect);
 }
 function stop(){if(raf)cancelAnimationFrame(raf);raf=0;if(idleCanvas){idleCanvas.remove();idleCanvas=null;}}
 function status(){return {version:'v34.1',articulatedFeatures:['lower jaw/beak','iris gaze','ear/crest tuft'],loaded:counters.loaded,failed:counters.failed,frames:counters.frames,rigFrames:counters.rigFrames,models:metadata?Object.keys(metadata.models).length:0,reducedMotion:reduced.matches,emotion:reaction.kind};}
 window.EVERHATCH_FACE33={version:'v34.1',start,stop,react,look,status,load,paint,attach,assetUrl:(sp,st,coat,part)=>FOLDER+modelId(sp,st,coat)+'-'+part+'.webp',get metadata(){return metadata;}};
})();
