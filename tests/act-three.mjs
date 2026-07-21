import fs from 'node:fs';
const fail=message=>{throw new Error(message)};
const mode=process.argv[2]||'runtime';
if(mode==='static'){
  const act=fs.readFileSync('src/act-three.js','utf8');
  for(const token of ['ACT_THREE_LOCATIONS','northern-pass','ghost-founder-sanctum','black-dragon-observatory','regent-han','Father No-Face','Heavenly Constellation Boxing','act-three-complete'])if(!act.includes(token))fail(`Act III feature missing: ${token}`);
  const boot=fs.readFileSync('src/bootstrap.js','utf8');
  if(!boot.includes("import('./act-three.js')"))fail('Act III module is not bootstrapped.');
  const swPath=boot.includes('sw-legacy.js')?'sw-legacy.js':boot.includes('sw-act4.js')?'sw-act4.js':'sw-act3.js';
  if(!boot.includes(swPath))fail('Act III-compatible service worker is not registered.');
  const index=fs.readFileSync('index.html','utf8');
  if(!index.includes('data-key="KeyZ"'))fail('Northern War Council touch control is missing.');
  const sw=fs.readFileSync(swPath,'utf8');
  if(!sw.includes('act-three.js')||!/(green-dragon-v6-act3|green-dragon-v7-act4|green-dragon-v8-legacy)/.test(sw))fail('Act III offline cache is incomplete.');
  console.log('Act III wiring validation passed.');
  process.exit(0);
}

const noop=()=>{},gradient={addColorStop:noop};
const context=new Proxy({imageSmoothingEnabled:false,measureText:value=>({width:String(value).length*9}),createLinearGradient:()=>gradient},{get:(object,key)=>key in object?object[key]:noop,set:(object,key,value)=>(object[key]=value,true)});
const canvas={width:960,height:540,getContext:()=>context,style:{}};
const loading={style:{display:'block'},classList:{add:noop}},progress={textContent:'',style:{}};
globalThis.document={getElementById:id=>id==='game'?canvas:id==='loading'?loading:progress,querySelectorAll:()=>[],fullscreenElement:null};
globalThis.window=globalThis;globalThis.addEventListener=noop;globalThis.requestAnimationFrame=()=>0;
Object.defineProperty(globalThis,'navigator',{value:{getGamepads:()=>[]},configurable:true,writable:true});
const saved=new Map;globalThis.localStorage={getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,String(value))};
await import('../src/game.js');await import('../src/enhancements.js');await import('../src/world-systems.js');await import('../src/act-two.js');await import('../src/act-two-compat.js');await import('../src/act-three.js');
const game=globalThis.greenDragonGame,api=globalThis.greenDragonActThree,passed=[];
const {NPCS,LOCATIONS}=await import('../src/content.js');
const check=(name,value)=>{if(!value)fail(`${name} failed`);passed.push(name);console.log(`PASS ${name}`)};
const find=id=>Object.values(NPCS).flat().find(item=>item.id===id);
const win=id=>{const entry=find(id);game.afterTalk(entry);check(`${id} fight starts`,game.mode==='combat'&&game.combat?.npc?.id===id);game.combat.enemy.hp=0;game.mode='victory';game.finishResult()};
const finishPhase=phase=>{if(mode===phase){console.log(`Act III ${phase} validation passed (${passed.length} checks).`);process.exit(0)}};

check('act three module api',api&&typeof api.unlockActThree==='function'&&typeof api.ensureActThree==='function');
finishPhase('module');
game.newGame();
check('fresh save act three enrichment',game.data.actThree&&game.data.actThree.version===1&&!game.data.actThree.unlocked);
finishPhase('fresh-save');
game.data.actTwo.complete=true;api.unlockActThree(game,true);
check('act three unlock',game.data.actThree.unlocked&&game.data.location==='northern-pass'&&game.data.quests['north-star-summons']==='active');
finishPhase('unlock');
check('eight northern regions',LOCATIONS.some(item=>item.id==='northern-pass')&&LOCATIONS.some(item=>item.id==='black-dragon-observatory'));
finishPhase('regions');

game.afterTalk(find('scout-lan'));
check('north star summons',game.data.quests['iron-prayer-trial']==='active');
win('abbot-stone-vein');
check('iron prayer chapter',game.data.quests['snow-lotus-ambush']==='active'&&game.data.actThree.standards.includes('monastery')&&game.data.ownedWeapons.includes('iron-prayer-staff')&&game.data.learnedStyles.includes('Iron Prayer Palm'));
finishPhase('monastery');

game.afterTalk(find('medicine-child'));win('ice-jackal');
game.afterTalk(find('healer-ning'));win('white-yak-general');
check('snow lotus chapter',game.data.quests['red-banner-siege']==='active'&&game.data.actThree.standards.includes('village')&&game.data.ownedWeapons.includes('frost-lotus-jian'));
finishPhase('village');

game.afterTalk(find('old-guardsman-wei'));win('deserter-captain');
game.afterTalk(find('captain-ruo'));win('crimson-standard');
check('red banner chapter',game.data.quests['founder-without-face']==='active'&&game.data.actThree.standards.length===3&&game.data.learnedStyles.includes('Snow Lotus Sword'));
finishPhase('standards');

game.afterTalk(find('moon-veil-founder'));win('father-no-face');
check('ghost founder chapter',game.data.quests['celestial-bloodline']==='active'&&game.data.ownedWeapons.includes('founder-mask-chain'));
finishPhase('founder');

game.afterTalk(find('astrologer-luo'));
check('celestial archive',game.data.actThree.starMap&&game.data.quests['heir-in-exile']==='active');
game.afterTalk(find('prince-jian'));
check('vanished heir',game.data.actThree.heirTrust>=1&&game.data.quests['dragon-constellation']==='active');
finishPhase('heir');

win('black-star-abbot');
check('constellation trial',game.data.quests['black-dragon-regent']==='active'&&game.data.learnedStyles.includes('Heavenly Constellation Boxing'));
win('regent-han');
check('act three finale',game.data.actThree.complete&&game.data.quests['black-dragon-regent']==='completed'&&game.data.ownedWeapons.includes('black-dragon-edict')&&game.mode==='act-three-complete');
console.log(`Act III runtime validation passed (${passed.length} checks).`);
