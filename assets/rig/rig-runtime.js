/* Everhatch v34 (continuous movement polish) layered over v31: five-family layered raster cutout rigs. Cutouts retain the original art's
 * exact life stage and coat; this is not a manually drawn multi-angle rig. */
(function(){
  'use strict';
  const manifest=window.EVERHATCH_RIG_MANIFEST;
  if(!manifest || !manifest.models) return;
  const W=370,H=310, cache=new Map(), z=manifest.z_order;
  const style={
    griffin:{head:1.0,wing:1.0,tail:.78,fore:1.0,hind:.78},
    wyvern:{head:1.10,wing:1.18,tail:1.30,fore:1.08,hind:.85},
    hippogriff:{head:1.12,wing:1.20,tail:1.00,fore:1.28,hind:1.24},
    phoenix:{head:1.20,wing:1.28,tail:1.45,fore:.82,hind:.95},
    pegasus:{head:1.06,wing:1.16,tail:1.32,fore:1.32,hind:1.18}
  };
  const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const ease=t=>t*t*(3-2*t);
  const sin=t=>Math.sin(t*Math.PI);
  let failures=0, drawn=0;
  const url=(sp,st,coat,part)=>`assets/rig/${sp}-${st}-${coat}-${part}.webp`;
  const sourceUrl=(sp,st,coat)=>`assets/motion/${sp}-${st}-${coat}-0.webp`;
  function supports(sp){return ['griffin','wyvern','hippogriff','phoenix','pegasus'].includes(sp)}
  function imageFor(src){return new Promise((resolve,reject)=>{
    const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Rig image missing: '+src));img.src=src;
  })}
  function load(sp,st,coat){
    const id=`${sp}-${st}-${coat}`;
    if(!manifest.models[id])return Promise.reject(Error('No rig for '+id));
    if(cache.has(id))return cache.get(id);
    const request=Promise.all([...z.map(part=>imageFor(url(sp,st,coat,part))),imageFor(url(sp,st,coat,'socket')),imageFor(sourceUrl(sp,st,coat)),imageFor(`assets/joints-v34/${id}.webp`)]).then(images=>{
      const layers={};z.forEach((part,i)=>layers[part]=images[i]);layers.socket=images[z.length];
      layers.glaze=images[z.length+2];return {id,sp,st,coat,metadata:manifest.models[id],layers,source:images[z.length+1]};
    }).catch(e=>{cache.delete(id);failures++;throw e});
    cache.set(id,request);
    // Older pending requests remain valid, but limit retained resolved cache size.
    if(cache.size>12){const first=cache.keys().next().value;if(first!==id)cache.delete(first)}
    return request;
  }
  function legacyParams(action,p,sp,st,mode='care'){
    const u=clamp(p,0,1),b=sin(u),sw=Math.sin(Math.PI*2*u),pulse=Math.sin(Math.PI*4*u);
    const child=lerp(.68,1,st/4),f=style[sp]||style.griffin;
    let head=0,wing=0,tail=.025*sw,fore=0,hind=0,headY=0,wingY=0,foreY=0,bodyY=0,scale=1;
    switch(action){
      case 'feed':case 'drink': head=.13*b+.015*pulse;headY=4*b;wing=-.02*b;tail=.045*sw;break;
      case 'pet':case 'cuddle':head=-.065*b;headY=-2*b;wing=.025*b;tail=.085*sw;break;
      case 'groom':head=.05*b;wing=-.145*b+.025*pulse;tail=.04*sw;fore=-.025*b;break;
      case 'play':head=.04*pulse;wing=-.13*b+.02*pulse;tail=.11*sw;fore=-.09*b;foreY=-8*b;hind=.05*b;bodyY=-4*b;break;
      case 'stretch':head=-.08*b;wing=-.17*b;tail=.1*sw;fore=-.085*b;foreY=-6*b;break;
      case 'call':case 'roar':head=-.14*b;headY=-3*b;wing=-.12*b;tail=.07*sw;break;
      case 'flight':head=-.035*b;wing=-.19*sw;tail=.14*sw;fore=-.075*b;foreY=-6*b;bodyY=-5*b;break;
      case 'impact':head=.09*b;wing=.08*b;tail=-.14*b;fore=.12*b;foreY=8*b;bodyY=3*b;break;
      case 'sing':head=-.09*b;wing=-.07*b;tail=.1*sw;break;
      case 'magic':head=-.09*b;wing=-.18*b+.03*pulse;tail=.13*sw;fore=-.075*b;bodyY=-6*b;break;
      case 'rearing':head=-.08*b;wing=-.15*b;tail=.1*sw;fore=-.11*b;foreY=-9*b;bodyY=-3*b;break;
      case 'sleep':head=.07*b;headY=3*b;wing=.055*b;tail=.045*sw;break;
      case 'wake':head=-.08*b;headY=-3*b;wing=-.11*b;tail=.08*sw;fore=-.04*b;break;
      default:head=.02*sw;wing=-.025*sw;tail=.03*sw;
    }
    // Physically different species should not share the same silhouette choreography.
    // Hippogriff: four-legged canter and eagle-neck reaction.
    if(sp==='hippogriff'){
      if(['play','flight','rearing'].includes(action)){fore-=.07*b;hind+=.07*sw;foreY-=5*b;tail+=.05*sw}
      if(action==='call'||action==='roar'){head-=.075*b;wing-=.06*b}
      if(action==='feed'){head+=.08*b;hind+=.03*b}
    }
    // Phoenix: the wings and long flame tail express most of the motion.
    if(sp==='phoenix'){
      if(['magic','flight','sing','play'].includes(action)){wing-=.10*b+.04*sw;tail+=.14*sw;head-=.045*b}
      if(action==='feed'){head+=.09*b;tail+=.06*sw}
      if(action==='sleep'){wing+=.06*b;tail+=.04*sw}
    }
    // Pegasus: a controlled galloping motion, smooth mane/tail swing, airy wingbeats.
    if(sp==='pegasus'){
      if(['play','flight','rearing'].includes(action)){fore-=.11*b;hind+=.06*sw;foreY-=6*b;bodyY-=3*b;tail+=.07*sw}
      if(action==='pet'||action==='cuddle'){head-=.045*b;tail+=.06*sw}
      if(action==='stretch'){wing-=.07*b;fore-=.045*b}
    }
    if(mode==='trick'){wing*=1.13;tail*=1.10;fore*=1.06;bodyY*=1.1}
    return {head:{r:head*f.head*child,y:headY},wing:{r:wing*f.wing*child,y:wingY},tail:{r:tail*f.tail*child},fore:{r:fore*f.fore*child,y:foreY},hind:{r:hind*f.hind*child},base:{y:bodyY,scale}};
  }
  // v34 motion director: independently timed body zones, anticipation and follow-through.
  // All clips return to neutral at their endpoints so the creature never snaps to a new pose.
  const motionTiming={
    feed:[.02,.95],drink:[.02,.95],pet:[.02,.95],cuddle:[.02,.95],
    groom:[.03,.98],play:[.015,.97],stretch:[.03,.97],call:[.04,.97],
    roar:[.04,.98],flight:[0,1],impact:[.03,.97],sing:[.04,.96],
    magic:[.02,.97],rearing:[.03,.96],sleep:[.03,.98],wake:[.03,.99]
  };
  const shifts={head:[.07,.95],wing:[.0,.89],tail:[.13,1.0],fore:[.04,.91],hind:[.08,.96],base:[0,.94]};
  function params(action,p,sp,st,mode='care'){
    if(!motionTiming[action])return legacyParams(action,p,sp,st,mode);
    const u=clamp(p,0,1);
    const [clipStart,clipEnd]=motionTiming[action];
    const result={};
    for(const name of ['head','wing','tail','fore','hind','base']){
      const [a,b]=shifts[name];
      // Shifted local action clocks keep wings, legs, head and tail from reaching peak together.
      const local=clamp((u-clipStart-a*.32)/(clipEnd-clipStart-(a*.32)-(1-b)*.30),0,1);
      const eased=ease(local);
      const source=legacyParams(action,eased,sp,st,mode)[name];
      const next={...source};
      // Tiny end-swing of ears, feathers and tails. It fades to zero at the end of the action.
      const settle=Math.sin(2*Math.PI*local)*Math.pow(Math.sin(Math.PI*local),2);
      const child=.70+.30*(st/4);
      if(name==='head')next.r+=(action==='feed'?.009:.007)*settle*child;
      if(name==='tail')next.r+=.033*settle*child;
      if(name==='wing')next.r+=(action==='flight'?.021:.012)*settle*child;
      if(name==='fore'&&['play','flight','rearing'].includes(action))next.y=(next.y||0)-1.4*settle*child;
      result[name]=next;
    }
    return result;
  }
  function draw(ctx,model,action,p,rect,options={}){
    const motion=(options.legacy?legacyParams:params)(action,p,model.sp,model.st,options.mode||'care');
    const {pivot}=model.metadata;
    ctx.save();ctx.translate(rect.x,rect.y);ctx.scale(rect.w/W,rect.h/H);
    // A faint original-image underpaint hides occasional gaps opened at the cutout sockets.
    // Its opacity falls to zero in the rest frame to avoid doubled silhouettes.
    const bridge=Math.abs(Math.sin(Math.PI*clamp(p,0,1)));
    if(bridge>0.001){ctx.globalAlpha=bridge*.18;ctx.drawImage(model.source,0,0,W,H);ctx.globalAlpha=bridge*.72;ctx.drawImage(model.layers.socket,0,0,W,H);ctx.globalAlpha=1}
    for(const part of z){
      const image=model.layers[part],m=motion[part]||{},pv=pivot[part]||[W/2,H/2];
      ctx.save();
      ctx.translate(pv[0],pv[1]);
      ctx.translate(m.x||0,m.y||0);
      ctx.rotate(m.r||0);
      ctx.scale(m.scale||1,m.scale||1);
      ctx.translate(-pv[0],-pv[1]);
      ctx.drawImage(image,0,0,W,H);
      ctx.restore();
    }
    // Source-colored feather-soft glaze covers a small amount of exposed joint seam,
    // without repainting the figure or changing its coat/silhouette at rest.
    if(bridge>0.01 && model.layers.glaze){
      ctx.save();ctx.globalAlpha=.23*bridge;
      ctx.drawImage(model.layers.glaze,0,0,W,H);ctx.restore();
    }
    ctx.restore();drawn++;
  }
  window.EVERHATCH_RIG={version:'v34',kind:'five-family staged cutout motion with joint glaze',supports,load,draw,params,legacyParams,url,manifest,suspended:false,
    metrics:()=>({drawn,failures,models:Object.keys(manifest.models).length,cache:cache.size})};
})();
