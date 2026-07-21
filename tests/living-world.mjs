import fs from 'node:fs';
const mode=process.argv[2]||'all';
const fail=message=>{throw new Error(message)};

if(mode==='all'||mode==='static'){
  const world=fs.readFileSync('src/world-systems.js','utf8');
  for(const feature of ['SIDE_QUESTS','CONTRACTS','bent-reed-oath','razor-fang-hunt','bell-sparrow-oath','mastery','bonds','reputation','rested','KeyB','KeyC','KeyV'])if(!world.includes(feature))fail(`Living-world feature missing: ${feature}`);
  const bootstrap=fs.readFileSync('src/bootstrap.js','utf8');
  if(!bootstrap.includes("import('./world-systems.js')"))fail('Living-world layer is not bootstrapped.');
  if(!bootstrap.includes('serviceWorker.register'))fail('Offline service worker is not registered.');
  const index=fs.readFileSync('index.html','utf8');
  for(const key of ['KeyB','KeyC','KeyV'])if(!index.includes(`data-key="${key}"`))fail(`Mobile control missing: ${key}`);
  const sw=fs.readFileSync('sw.js','utf8');
  if(!sw.includes('world-systems.js')||!sw.includes('green-dragon-v4'))fail('Offline cache does not include the living-world build.');
  console.log('Living-world static wiring passed.');
}

if(mode==='all'||mode==='runtime'){
  const noop=()=>{},gradient={addColorStop:noop};
  const context=new Proxy({imageSmoothingEnabled:false,measureText:value=>({width:String(value).length*9}),createLinearGradient:()=>gradient},{get:(object,key)=>key in object?object[key]:noop,set:(object,key,value)=>(object[key]=value,true)});
  const canvas={width:960,height:540,getContext:()=>context,style:{}};
  const loading={style:{display:'block'}},progress={textContent:'',style:{}};
  globalThis.document={getElementById:id=>id==='game'?canvas:id==='loading'?loading:progress,querySelectorAll:()=>[],fullscreenElement:null};
  globalThis.window=globalThis;globalThis.addEventListener=noop;globalThis.requestAnimationFrame=()=>0;
  Object.defineProperty(globalThis,'navigator',{value:{getGamepads:()=>[]},configurable:true,writable:true});
  const saved=new Map;globalThis.localStorage={getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,String(value))};
  await import('../src/game.js');await import('../src/enhancements.js');await import('../src/world-systems.js');
  const game=globalThis.greenDragonGame,checks=[];const check=(name,value)=>{if(!value)fail(`${name} failed`);checks.push(name)};
  game.newGame();
  check('living save defaults',game.data.livingWorldVersion===1&&game.data.mastery.weapons.staff===0&&game.data.contracts.completed===0);
  check('side quests installed',game.data.quests['razor-fang-hunt']==='locked'&&game.data.quests['bent-reed-oath']==='locked');
  game.press('KeyB');check('contract board opens',game.worldState.mode==='contracts');game.press('Enter');check('contract fight starts',game.mode==='combat'&&game.combat.contract?.id==='contract-red-sash');
  game.mode='explore';game.combat=null;game.worldState.mode=null;game.data.player.silver=100;game.press('KeyC');game.press('Enter');check('camp rest',game.data.rested===1&&game.data.player.silver===80);game.press('Escape');
  game.press('KeyV');check('mastery screen',game.worldState.mode==='mastery');game.press('Escape');
  game.data.flags.willow=1;game.data.location='bamboo-forest';game.data.player.x=690;game.interact();while(game.mode==='dialogue'){game.dialogue.reveal=999;game.dialoguePress('Enter')}check('hermit recruitment',game.data.party.some(member=>member.id==='hermit-reed'));
  console.log(`Living-world runtime passed (${checks.length} checks).`);
}
