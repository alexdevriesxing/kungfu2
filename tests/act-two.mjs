import fs from 'node:fs';
const fail=message=>{throw new Error(message)};
const mode=process.argv[2]||'runtime';
if(mode==='static'){
  const act=fs.readFileSync('src/act-two.js','utf8');
  for(const token of ['ACT_TWO_LOCATIONS','black-river-docks','ghost-opera-backstage','dragon-gate-arena','imperial-jade-court','censor-wei','Iron Phoenix','Black River Saber','act-two-complete'])if(!act.includes(token))fail(`Act II feature missing: ${token}`);
  const compat=fs.readFileSync('src/act-two-compat.js','utf8');
  if(!compat.includes('syncCommonFolk'))fail('Act II reputation compatibility is missing.');
  const boot=fs.readFileSync('src/bootstrap.js','utf8');
  if(!boot.includes("import('./act-two.js')")||!boot.includes("import('./act-two-compat.js')"))fail('Act II modules are not fully bootstrapped.');
  const serviceWorker=fs.existsSync('sw-act3.js')?'sw-act3.js':'sw-act2.js';
  if(!boot.includes(serviceWorker))fail(`Current service worker ${serviceWorker} is not registered.`);
  const index=fs.readFileSync('index.html','utf8');
  if(!index.includes('data-key="KeyX"'))fail('Act II Chronicle touch control is missing.');
  const sw=fs.readFileSync(serviceWorker,'utf8');
  if(!sw.includes('act-two.js')||!sw.includes('act-two-compat.js')||!/(green-dragon-v5-act2-1|green-dragon-v6-act3)/.test(sw))fail('Current offline cache does not preserve Act II.');
  console.log('Act II wiring validation passed.');
  process.exit(0);
}

const noop=()=>{},gradient={addColorStop:noop};
const context=new Proxy({imageSmoothingEnabled:false,measureText:value=>({width:String(value).length*9}),createLinearGradient:()=>gradient},{get:(object,key)=>key in object?object[key]:noop,set:(object,key,value)=>(object[key]=value,true)});
const canvas={width:960,height:540,getContext:()=>context,style:{}};
const loading={style:{display:'block'}},progress={textContent:'',style:{}};
globalThis.document={getElementById:id=>id==='game'?canvas:id==='loading'?loading:progress,querySelectorAll:()=>[],fullscreenElement:null};
globalThis.window=globalThis;globalThis.addEventListener=noop;globalThis.requestAnimationFrame=()=>0;
Object.defineProperty(globalThis,'navigator',{value:{getGamepads:()=>[]},configurable:true,writable:true});
const saved=new Map;globalThis.localStorage={getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,String(value))};
await import('../src/game.js');await import('../src/enhancements.js');await import('../src/world-systems.js');await import('../src/act-two.js');await import('../src/act-two-compat.js');
const game=globalThis.greenDragonGame,api=globalThis.greenDragonActTwo,passed=[];
const {NPCS,LOCATIONS}=await import('../src/content.js');
const check=(name,value)=>{if(!value)fail(`${name} failed`);passed.push(name);console.log(`PASS ${name}`)};
const find=id=>Object.values(NPCS).flat().find(item=>item.id===id);
const win=id=>{const entry=find(id);game.afterTalk(entry);check(`${id} fight starts`,game.mode==='combat'&&game.combat?.npc?.id===id);game.combat.enemy.hp=0;game.mode='victory';game.finishResult()};
const finishPhase=phase=>{if(mode===phase){console.log(`Act II ${phase} validation passed (${passed.length} checks).`);process.exit(0)}};

check('act two module api',api&&typeof api.unlockActTwo==='function'&&typeof api.ensureActTwo==='function');
finishPhase('module');
game.newGame();
check('fresh save act two enrichment',game.data.actTwo&&game.data.actTwo.version===1&&!game.data.actTwo.unlocked);
finishPhase('fresh-save');
game.data.quests.faceless='completed';api.unlockActTwo(game,true);
check('act two unlocked flag',game.data.actTwo.unlocked===true);
finishPhase('unlock-flag');
check('act two travel handoff',game.data.location==='black-river-docks'&&game.mode==='explore');
finishPhase('unlock-location');
check('eight new regions',LOCATIONS.length>=14&&LOCATIONS.some(item=>item.id==='imperial-jade-court'));
finishPhase('regions');
check('opening quest',game.data.quests['black-river-summons']==='active');
finishPhase('opening');

game.afterTalk(find('captain-yan'));
check('captain advances story',game.data.quests['broken-escort-seal']==='active');
game.afterTalk(find('orphan-mei'));win('salt-shark');
check('river orphan side story',game.data.quests['river-orphans']==='completed');
check('common folk reputation',game.data.reputation.commonfolk>=2&&game.data.reputation.commonFolk===game.data.reputation.commonfolk);
finishPhase('orphans');

game.afterTalk(find('clerk-pei'));
win('needle-crow');
check('needle crow rewards',game.data.quests['ferry-of-whispers']==='active'&&game.data.ownedWeapons.includes('black-river-dao')&&game.data.learnedStyles.includes('Black River Saber'));
finishPhase('river');

game.afterTalk(find('ferrymaster-yun'));
check('ferry clue',game.data.quests['masks-behind-masks']==='active');
game.afterTalk(find('moon-veil'));
win('crimson-mask');
check('opera chapter',game.data.quests['five-clan-council']==='active'&&game.data.learnedStyles.includes('Ghost Lantern Steps'));
finishPhase('opera');

for(const id of ['delegate-shaolin','delegate-wudang','delegate-beggars'])game.afterTalk(find(id));
game.afterTalk(find('grandmaster-tao'));
check('council seals',game.data.actTwo.councilSeals.length===3&&game.data.quests['dragon-gate-qualifier']==='active');
finishPhase('council');

win('jade-mantis');win('laughing-tiger');win('iron-phoenix');
check('tournament progression',game.data.actTwo.tournamentWins===3&&game.data.quests['jade-court-truth']==='active'&&game.data.learnedStyles.includes('Five Banners Fist'));
game.afterTalk(find('archivist-qin'));
win('censor-wei');
check('act two finale',game.data.actTwo.complete&&game.data.quests['jade-court-truth']==='completed'&&game.mode==='act-two-complete');
console.log(`Act II runtime validation passed (${passed.length} checks).`);
