import {loadProductionAssets} from './production-assets.js';

const progress=document.getElementById('loading-progress');
const fill=document.getElementById('loading-fill');
const loading=document.getElementById('loading');

function setProgress(value,label){
  const percent=Math.max(0,Math.min(100,Math.round(value*100)));
  if(progress)progress.textContent=label||`${percent}%`;
  if(fill)fill.style.width=`${percent}%`;
}

try{
  setProgress(.03);
  globalThis.greenDragonAssets=await loadProductionAssets(value=>setProgress(.05+value*.9));
  setProgress(1,'READY');
}catch(error){
  console.error(error);
  globalThis.greenDragonAssets={sprites:{},stages:{},portraits:null,keyArt:null,namedFighters:[]};
  setProgress(1,'FALLBACK ART READY');
  loading?.classList.add('fallback');
}

await new Promise(resolve=>setTimeout(resolve,60));
await import('./game.js');
await import('./enhancements.js');
await import('./world-systems.js');
await import('./act-two.js');
await import('./act-two-compat.js');
await import('./act-three.js');
await import('./act-four.js');
await import('./legacy-journey.js');
await import('./legacy-progression.js');

if('serviceWorker' in navigator&&location.protocol.startsWith('http')){
  navigator.serviceWorker.register('./sw-legacy.js').catch(error=>console.warn('Offline cache unavailable',error));
}
