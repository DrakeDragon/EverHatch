/* Everhatch v32 — original-art-matched facial detail animation.
 * Non-destructive, per-age & coat 2D face overlays. Saves are NOT modified. */
(function(){
 'use strict';
 const registry=window.EVERHATCH_RIG;
 const stageIds=['griffin','hippogriff','phoenix','pegasus','wyvern'];
 const modes=['blink','pleased','curious','wary'];
 const cache=new Map();
 let getGame=()=>null;
 let raf=0,lastDraw=0,canvas=null;
 let emotion='',emotionUntil=0,nextBlink=0,blinkEnd=0;
 let failed=0,opened=0,frames=0;
 const media=window.matchMedia('(prefers-reduced-motion: reduce)');
 const file=(sp,st,coat,mode)=>`assets/expressions/${sp}-${st}-${coat}-${mode}.webp`;
 const makeKey=(sp,st,coat,mode)=>`${sp}-${st}-${coat}-${mode}`;
 const valid=(g)=>Boolean(g&&g.state&&g.species&&g.alive&&!g.sleeping&&!g.away&&!g.title&&!g.equipped&&stageIds.includes(g.species));
 function acquire(sp,st,coat,mode){
   if(!modes.includes(mode))return null;
   const key=makeKey(sp,st,coat,mode);
   if(cache.has(key))return cache.get(key).image;
   const image=new Image();const item={image:null,loaded:false,failed:false};cache.set(key,item);
   image.onload=()=>{item.image=image;item.loaded=true;opened++};
   image.onerror=()=>{item.failed=true;failed++};
   image.src=file(sp,st,coat,mode);
   if(cache.size>56){for(const k of cache.keys()){if(k!==key){cache.delete(k);break}}}
   return null;
 }
 function warm(sp,st,coat){for(const m of modes)acquire(sp,st,coat,m)}
 function react(mode,duration=1150){
   if(media.matches)return;
   if(!['pleased','curious','wary'].includes(mode))mode='curious';
   emotion=mode;emotionUntil=performance.now()+duration;
 }
 function sampleState(now){
   if(media.matches)return null;
   if(!nextBlink)nextBlink=now+2600+Math.random()*3000;
   if(now>=nextBlink){blinkEnd=now+170;nextBlink=now+3000+Math.random()*4300;}
   if(now<blinkEnd)return {mode:'blink',opacity:1};
   if(now<emotionUntil&&emotion)return {mode:emotion,opacity:Math.min(1,(emotionUntil-now)/190)};
   return null;
 }
 function paintRig(ctx,model,action,p,rect,options={}){
   const display=sampleState(performance.now());if(!display)return;
   const im=acquire(model.sp,model.st,model.coat,display.mode);if(!im)return;
   // Follow the precise head pivot and transform used by the cutout rig itself.
   const m=registry.params(action,p,model.sp,model.st,options.mode||'care').head;
   const hp=model.metadata.pivot.head;
   ctx.save();
   ctx.globalAlpha=display.opacity;
   ctx.translate(rect.x,rect.y);
   ctx.scale(rect.w/370,rect.h/310);
   ctx.translate(hp[0],hp[1]);
   ctx.translate(m.x||0,m.y||0);
   ctx.rotate(m.r||0);
   ctx.translate(-hp[0],-hp[1]);
   ctx.drawImage(im,0,0,370,310);
   ctx.restore();frames++;
 }
 function repaint(now){
   raf=requestAnimationFrame(repaint);
   if(now-lastDraw<55)return;
   lastDraw=now;
   const g=getGame();
   const wrap=document.getElementById('gwrap');
   if(!wrap||!valid(g)||media.matches){if(canvas){canvas.remove();canvas=null;}return;}
   const sp=g.species,st=g.stage,coat=g.coat;
   warm(sp,st,coat);
   if(!canvas||!canvas.isConnected){
     canvas=document.createElement('canvas');canvas.width=640;canvas.height=600;canvas.className='v32-eye-layer';
     canvas.setAttribute('aria-hidden','true');wrap.appendChild(canvas);
   }
   const ctx=canvas.getContext('2d');if(!ctx)return;
   ctx.clearRect(0,0,640,600);
   const expr=sampleState(now);
   if(!expr||wrap.classList.contains('v30-active'))return;
   const el=wrap.querySelector('svg image.growth-frame,svg image.newborn-frame');
   if(!el)return;
   const im=acquire(sp,st,coat,expr.mode);if(!im)return;
   const x=Number(el.getAttribute('x')||0),y=Number(el.getAttribute('y')||0);
   const w=Number(el.getAttribute('width')||0),h=Number(el.getAttribute('height')||0);
   if(w<1||h<1)return;
   ctx.save();ctx.scale(2,2);ctx.globalAlpha=expr.opacity;
   ctx.drawImage(im,x,y,w,h);
   ctx.restore();frames++;
 }
 function attach(){
   if(!registry||registry.__expressionsAttached)return;
   const original=registry.draw;
   registry.draw=function(ctx,model,action,p,rect,options){
     const ret=original.call(this,ctx,model,action,p,rect,options);
     if(!media.matches)paintRig(ctx,model,action,p,rect,options);
     return ret;
   };
   registry.__expressionsAttached=true;
 }
 function start(readGame){
   getGame=readGame;
   attach();
   if(!raf)raf=requestAnimationFrame(repaint);
 }
 function stop(){if(raf)cancelAnimationFrame(raf);raf=0;if(canvas){canvas.remove();canvas=null;}}
 function status(){return {version:'v32',types:modes.slice(),coats:6,stages:5,species:stageIds.slice(),opened,failed,frames,reducedMotion:media.matches,currentEmotion:emotion};}
 window.EVERHATCH_FACE={version:'v32',start,stop,react,warm,status,load:acquire,file,getEmotion:()=>emotion};
})();
