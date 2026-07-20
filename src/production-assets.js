import { createNamedFighterAtlas, NAMED_FIGHTERS } from './named-fighters.js';

export async function loadProductionAssets(onProgress=()=>{}) {
  const sprites={};
  for(let i=0;i<NAMED_FIGHTERS.length;i++){
    const key=NAMED_FIGHTERS[i];
    const atlas=createNamedFighterAtlas(key);
    if(atlas)sprites[key]=atlas;
    onProgress((i+1)/NAMED_FIGHTERS.length);
    if(i%2===1)await new Promise(resolve=>setTimeout(resolve,0));
  }
  return {sprites,stages:{},portraits:null,keyArt:null,namedFighters:NAMED_FIGHTERS};
}