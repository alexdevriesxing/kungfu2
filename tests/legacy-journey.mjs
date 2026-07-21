import fs from 'node:fs';
const fail=message=>{throw new Error(message)};
const mode=process.argv[2]||'runtime';
if(mode==='static'){
  const legacy=fs.readFileSync('src/legacy-journey.js','utf8');
  for(const token of ['Hall of Returning Paths','GAUNTLETS','FIVE DRAGONS GRANDMASTER CIRCUIT','startLegacyJourney','Legacy Essence','ENDING_GIFTS','legacyRank'])if(!legacy.includes(token))fail(`Legacy feature missing: ${token}`);
  const boot=fs.readFileSync('src/bootstrap.js','utf8');
  if(!boot.includes("import('./legacy-journey.js')"))fail('Legacy Journey module is not bootstrapped.');
  if(!boot.includes('sw-legacy.js'))fail('Legacy service worker is not registered.');
  const index=fs.readFileSync('index.html','utf8');
  if(!index.includes('data-key="KeyG"'))fail('Legacy Ledger touch control is missing.');
  const sw=fs.readFileSync('sw-legacy.js','utf8');
  if(!sw.includes('legacy-journey.js')||!sw.includes('green-dragon-v8-legacy'))fail('Legacy offline cache is incomplete.');
  console.log('Legacy Journey wiring validation passed.');
  process.exit(0);
}

const noop=()=>{},gradient={addColorStop:noop};
const context=new Proxy({imageSmoothingEnabled:false,measureText:value=>({width:String(value).length*9}),createLinearGradient:()=>gradient},{get:(object,key)=>key in object?object[key]:noop,set:(object,key,value)=>(object[key]=value,true)});
const canvas={width:960,height:540,getContext:()=>context,style:{}};
const loading={style:{display:'block'},classList:{add:noop}},progress={textContent:'',style:{}};
globalThis.document={getElementById:id=>id==='game'?canvas:id==='loading'?loading:progress,querySelectorAll:()=>[],fullscreenElement:null,createElement:()=>({width:0,height:0,getContext:()=>context})};
globalThis.window=globalThis;globalThis.addEventListener=noop;globalThis.requestAnimationFrame=()=>0;
Object.defineProperty(globalThis,'navigator',{value:{getGamepads:()=>[]},configurable:true,writable:true});
const saved=new Map;globalThis.localStorage={getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,String(value))};
globalThis.greenDragonAssets={sprites:{},stages:{}};
await import('../src/game.js');await import('../src/enhancements.js');await import('../src/world-systems.js');await import('../src/act-two.js');await import('../src/act-two-compat.js');await import('../src/act-three.js');await import('../src/act-four.js');await import('../src/legacy-journey.js');
const game=globalThis.greenDragonGame,api=globalThis.greenDragonLegacy,passed=[];
const {NPCS,LOCATIONS}=await import('../src/content.js');
const check=(name,value)=>{if(!value)fail(`${name} failed`);passed.push(name);console.log(`PASS ${name}`)};
const find=id=>Object.values(NPCS).flat().find(item=>item.id===id);
const finishPhase=phase=>{if(mode===phase){console.log(`Legacy Journey ${phase} validation passed (${passed.length} checks).`);process.exit(0)}};

check('legacy module api',api&&typeof api.startLegacyJourney==='function'&&typeof api.startGauntlet==='function'&&typeof api.spendBlessing==='function');
finishPhase('module');
game.newGame();
check('fresh save legacy enrichment',game.data.legacy?.version===1&&!game.data.legacy.unlocked&&game.data.legacy.cycle===0);
finishPhase('fresh-save');
game.data.actFour.complete=true;game.data.actFour.ending='council';game.data.legacyReady=true;api.ensureLegacy(game);
check('campaign completion unlocks legacy',game.data.legacy.unlocked&&game.data.legacy.inheritedEnding==='council');
api.enterHall(game);
check('legacy hall installed',game.data.location==='hall-returning-paths'&&LOCATIONS.some(item=>item.id==='hall-returning-paths')&&find('keeper-returning-paths'));
finishPhase('hall');

const beforeEssence=game.data.legacy.essence;
api.startGauntlet(game,'ashes');
check('gauntlet begins',game.mode==='combat'&&game.combat.legacyGauntlet==='ashes'&&game.combat.legacyTotal===3&&game.combat.enemy.maxHp>320);
for(let step=0;step<3;step++){
  check(`gauntlet fight ${step+1}`,game.mode==='combat');
  game.combat.enemy.hp=0;game.mode='victory';game.finishResult();
}
check('gauntlet completion',game.mode==='explore'&&game.data.location==='hall-returning-paths'&&game.data.legacy.gauntletClears.ashes===1&&game.data.legacy.essence>beforeEssence&&game.data.legacy.bestGauntlet===3);
finishPhase('gauntlet');

game.data.legacy.essence=20;const oldHp=game.data.player.maxHp;
check('legacy blessing purchase',api.spendBlessing(game,'vitality')&&game.data.legacy.blessings.vitality===1&&game.data.player.maxHp>=oldHp+10);
finishPhase('blessing');

game.data.ownedWeapons=['training-staff','pale-dragon-sealblade'];game.data.learnedStyles=['Green Dragon Fist','Mandate Without Throne'];game.data.player.weapon='pale-dragon-sealblade';game.data.player.style='Mandate Without Throne';game.data.player.level=20;game.data.player.maxHp=390;game.data.player.hp=390;game.data.player.maxChi=190;game.data.player.chi=190;game.data.player.power=32;game.data.player.defence=22;game.data.player.silver=4000;game.data.party=[{id:'mei-lin',name:'Mei Lin',style:'White Crane Wing'}];game.data.bonds={'mei-lin':4};game.data.mastery={weapons:{staff:12,sword:18},styles:{'Mandate Without Throne':9}};
check('legacy cycle starts',api.startLegacyJourney(game));
check('legacy inheritance',game.data.legacy.active&&game.data.legacy.cycle===1&&game.data.legacy.inheritedEnding==='council'&&game.data.legacy.endingHistory.includes('council')&&game.data.ownedWeapons.includes('pale-dragon-sealblade')&&game.data.learnedStyles.includes('Mandate Without Throne')&&game.data.party.some(item=>item.id==='mei-lin')&&game.data.location==='jade-river');
check('campaign reset',game.data.quests.ashes!=='completed'&&!game.data.actFour.complete&&game.data.legacy.unlocked);
finishPhase('cycle');

const kuo=find('kuo');game.beginFight(kuo);
check('cycle enemy escalation',game.mode==='combat'&&game.combat.legacyRank==='AWAKENED'&&game.combat.enemy.maxHp>kuo.enemy.maxHp&&game.combat.enemy.power>kuo.enemy.power);
check('council inheritance gift',game.combat.inheritedGift==='TEN THOUSAND VOICES'&&game.combat.player.maxStamina>100&&game.combat.player.defence>game.data.player.defence);
console.log(`Legacy Journey runtime validation passed (${passed.length} checks).`);
