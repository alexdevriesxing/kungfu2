import fs from 'node:fs';
const noop=()=>{},gradient={addColorStop:noop};
const context=new Proxy({imageSmoothingEnabled:false,measureText:value=>({width:String(value).length*9}),createLinearGradient:()=>gradient},{get:(object,key)=>key in object?object[key]:noop,set:(object,key,value)=>(object[key]=value,true)});
const canvas={width:960,height:540,getContext:()=>context,style:{}};
const loading={style:{display:'block'}},progress={textContent:'',style:{}};
globalThis.document={getElementById:id=>id==='game'?canvas:id==='loading'?loading:progress,querySelectorAll:()=>[],fullscreenElement:null};
globalThis.window=globalThis;globalThis.addEventListener=noop;globalThis.requestAnimationFrame=()=>0;globalThis.navigator={getGamepads:()=>[]};
const saved=new Map;globalThis.localStorage={getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,String(value))};
try{
  await import('../src/game.js');
  await import('../src/enhancements.js');
  await import('../src/world-systems.js');
  await import('../src/act-two.js');
  const api=globalThis.greenDragonActTwo;
  if(!api||typeof api.unlockActTwo!=='function')throw new Error('Act II module completed without publishing its API.');
  fs.writeFileSync('act-two-debug.txt','Act II initialization succeeded.\n');
}catch(error){
  const detail=error?.stack||String(error);
  fs.writeFileSync('act-two-debug.txt',`${detail}\n`);
  console.error(detail);
  process.exitCode=1;
}
