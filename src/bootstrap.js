import { loadProductionAssets } from './production-assets.js';
const progress=document.getElementById('loading-progress');
try{
  globalThis.greenDragonAssets=await loadProductionAssets(value=>{if(progress)progress.textContent=`${Math.round(value*100)}%`;});
}catch(error){
  console.error(error);
  globalThis.greenDragonAssets={sprites:{},stages:{},keyArt:null,namedFighters:[]};
}
await import('./game.js');