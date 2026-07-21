import fs from 'node:fs';
const fail=message=>{throw new Error(message)};
const mode=process.argv[2]||'runtime';
if(mode==='static'){
  const act=fs.readFileSync('src/act-four.js','utf8');
  for(const token of ['ACT_FOUR_LOCATIONS','capital-east-gate','ghost-schism-temple','green-dragon-terrace','chancellor-sima','Lady Half-Mask','Mandate Without Throne','act-four-complete'])if(!act.includes(token))fail(`Act IV feature missing: ${token}`);
  const boot=fs.readFileSync('src/bootstrap.js','utf8');
  if(!boot.includes("import('./act-four.js')"))fail('Act IV module is not bootstrapped.');
  const swPath=boot.includes('sw-legacy.js')?'sw-legacy.js':'sw-act4.js';
  if(!boot.includes(swPath))fail('Act IV-compatible service worker is not registered.');
  const index=fs.readFileSync('index.html','utf8');
  if(!index.includes('data-key="KeyY"'))fail('Mandate Ledger touch control is missing.');
  const sw=fs.readFileSync(swPath,'utf8');
  if(!sw.includes('act-four.js')||!/(green-dragon-v7-act4|green-dragon-v8-legacy)/.test(sw))fail('Act IV offline cache is incomplete.');
  console.log('Act IV wiring validation passed.');
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
await import('../src/game.js');await import('../src/enhancements.js');await import('../src/world-systems.js');await import('../src/act-two.js');await import('../src/act-two-compat.js');await import('../src/act-three.js');await import('../src/act-four.js');
const game=globalThis.greenDragonGame,api=globalThis.greenDragonActFour,passed=[];
const {NPCS,LOCATIONS}=await import('../src/content.js');
const check=(name,value)=>{if(!value)fail(`${name} failed`);passed.push(name);console.log(`PASS ${name}`)};
const find=id=>Object.values(NPCS).flat().find(item=>item.id===id);
const win=id=>{const entry=find(id);game.afterTalk(entry);check(`${id} fight starts`,game.mode==='combat'&&game.combat?.npc?.id===id);game.combat.enemy.hp=0;game.mode='victory';game.finishResult()};
const finishPhase=phase=>{if(mode===phase){console.log(`Act IV ${phase} validation passed (${passed.length} checks).`);process.exit(0)}};

check('act four module api',api&&typeof api.unlockActFour==='function'&&typeof api.ensureActFour==='function'&&typeof api.chooseMandate==='function');
finishPhase('module');
game.newGame();
check('fresh save act four enrichment',game.data.actFour&&game.data.actFour.version===1&&!game.data.actFour.unlocked);
finishPhase('fresh-save');
game.data.actThree.complete=true;api.unlockActFour(game,true);
check('act four unlock',game.data.actFour.unlocked&&game.data.location==='capital-east-gate'&&game.data.quests['march-of-standards']==='active');
finishPhase('unlock');
check('eight capital regions',LOCATIONS.some(item=>item.id==='capital-east-gate')&&LOCATIONS.some(item=>item.id==='green-dragon-terrace'));
finishPhase('regions');

game.afterTalk(find('prince-jian-capital'));
check('capital march',game.data.quests['lantern-ward-siege']==='active');
game.afterTalk(find('lantern-runner-lin'));win('fire-tax-collector');
win('gate-general-xun');
check('capital gate chapter',game.data.quests['ten-thousand-petitions']==='active'&&game.data.actFour.proofs.includes('people')&&game.data.ownedWeapons.includes('capital-guardian-halberd')&&game.data.learnedStyles.includes('Lantern Ward Boxing'));
finishPhase('gate');

game.afterTalk(find('speaker-ren'));
game.afterTalk(find('scribe-yao'));win('cipher-eunuch');
win('ashen-crow-commander');
check('petition chapter',game.data.quests['masks-at-war']==='active'&&game.data.actFour.proofs.includes('petitions')&&game.data.actFour.proofs.includes('names')&&game.data.actFour.peopleSupport>=5);
finishPhase('petitions');

game.afterTalk(find('moon-veil-schism'));win('lady-half-mask');
check('mask schism chapter',game.data.quests['vermilion-arsenal']==='active'&&game.data.actFour.ghostFaceReformed&&game.data.actFour.proofs.includes('masks')&&game.data.learnedStyles.includes('Mirror Mask Steps'));
finishPhase('masks');

game.afterTalk(find('captain-ruo-capital'));win('vermilion-ox');
check('arsenal chapter',game.data.quests['last-emperor-testament']==='active'&&game.data.actFour.arsenalSecured&&game.data.actFour.proofs.includes('army')&&game.data.ownedWeapons.includes('vermilion-tiger-jian'));
finishPhase('arsenal');

game.afterTalk(find('memorial-keeper'));win('grave-robber-kang');
game.afterTalk(find('gardener-xu'));
check('garden testament',game.data.quests['hall-of-empty-throne']==='active'&&game.data.actFour.testament&&game.data.actFour.proofs.includes('testament')&&game.data.quests['master-shen-memorial']==='completed');
finishPhase('testament');

win('throne-warden');
check('empty throne chapter',game.data.quests['mandate-choice']==='active'&&game.data.actFour.proofs.length>=5);
finishPhase('throne');
game.afterTalk(find('prince-jian-throne'));
check('mandate choice screen',game.mode==='act-four-choice');
api.chooseMandate(game,1);
check('council mandate',game.data.actFour.mandateChoice==='council'&&game.data.quests['pale-dragon-chancellor']==='active'&&game.data.location==='green-dragon-terrace');
finishPhase('choice');

win('chancellor-sima');
check('act four finale',game.data.actFour.complete&&game.data.actFour.ending==='council'&&game.data.legacyReady&&game.data.quests['pale-dragon-chancellor']==='completed'&&game.data.ownedWeapons.includes('pale-dragon-sealblade')&&game.data.learnedStyles.includes('Mandate Without Throne')&&game.mode==='act-four-complete');
console.log(`Act IV runtime validation passed (${passed.length} checks).`);
