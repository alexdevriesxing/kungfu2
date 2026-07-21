const noop=()=>{},gradient={addColorStop:noop};
const context=new Proxy({imageSmoothingEnabled:false,measureText:value=>({width:String(value).length*9}),createLinearGradient:()=>gradient},{get:(object,key)=>key in object?object[key]:noop,set:(object,key,value)=>(object[key]=value,true)});
const canvas={width:960,height:540,getContext:()=>context,style:{}};
const loading={style:{display:'block'}},progress={textContent:'',style:{}};
globalThis.document={getElementById:id=>id==='game'?canvas:id==='loading'?loading:progress,querySelectorAll:()=>[],fullscreenElement:null};
globalThis.window=globalThis;globalThis.addEventListener=noop;globalThis.requestAnimationFrame=()=>0;
const saved=new Map;globalThis.localStorage={getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,String(value))};

await import('../src/game.js');await import('../src/enhancements.js');await new Promise(resolve=>setTimeout(resolve,10));
const game=globalThis.greenDragonGame,passed=[];
const check=(name,value)=>{if(!value)throw Error(`${name} failed`);passed.push(name)};

check('boot',game&&game.mode==='title');check('loader hidden',loading.style.display==='none');game.newGame();check('new journey',game.mode==='explore'&&game.data.location==='jade-river');
check('enhanced save defaults',game.data.systemsVersion===1&&game.data.settings.difficulty==='disciple'&&game.data.ownedWeapons.includes('training-staff')&&game.data.trackedQuest==='ashes');
game.data.player.x=250;game.interact();check('dialogue',game.mode==='dialogue');while(game.mode==='dialogue'){game.dialogue.reveal=999;game.dialoguePress('Enter')}check('quest progression',game.quest('ashes')==='completed'&&game.quest('footprints')==='active');check('quest auto tracking',game.data.trackedQuest==='footprints');
const rewardedSilver=game.data.player.silver;game.interact();while(game.mode==='dialogue'){game.dialogue.reveal=999;game.dialoguePress('Enter')}check('quest reward cannot be farmed',game.data.player.silver===rewardedSilver);

game.data.player.x=520;game.interact();while(game.mode==='dialogue'){game.dialogue.reveal=999;game.dialoguePress('Enter')}check('recruitment',game.data.party.length===1&&game.data.party[0].sprite==='mei-lin');
game.mode='explore';game.data.player.x=760;game.interact();while(game.mode==='dialogue'){game.dialogue.reveal=999;game.dialoguePress('Enter')}check('shop',game.mode==='shop');
game.data.player.silver=1000;game.shop.index=5;const silver=game.data.player.silver;game.shopPress('Enter');check('owned weapon re-equip is free',game.data.player.silver===silver&&game.data.player.weapon==='training-staff');
game.shop.index=6;game.shopPress('Enter');check('owned weapon collection',game.data.ownedWeapons.includes('river-sword')&&game.data.player.weapon==='river-sword'&&game.data.player.silver<silver);

game.mode='explore';game.press('KeyO');check('options overlay',game.enhancement.mode==='options');game.press('Enter');check('difficulty selection',game.data.settings.difficulty==='master');game.press('Escape');
game.press('KeyR');check('armory overlay',game.enhancement.mode==='equipment');game.press('Escape');game.press('KeyT');check('quest overlay',game.enhancement.mode==='quests');game.press('Escape');

game.data.settings.difficulty='legend';game.mode='explore';game.data.location='mountain-trail';game.data.player.x=560;game.interact();while(game.mode==='dialogue'){game.dialogue.reveal=999;game.dialoguePress('Enter')}check('combat begins',game.mode==='combat');check('difficulty scales enemy',game.combat.difficulty==='LEGEND'&&game.combat.enemy.maxHp>150);
game.combat.player.chi=70;game.combat.player.action='idle';game.attack(game.combat.player,'chi');check('style technique',game.combat.player.technique?.name==='COILING DRAGON PALM');
game.combat.player.action='idle';game.combat.player.x=420;game.combat.enemy.x=470;game.combat.enemy.hp=1;game.attack(game.combat.player,'punch');game.combat.player.actionTime=.14;game.tickFighter(game.combat.player,game.combat.enemy,.01,true);check('combat damage',game.combat.enemy.hp===0);game.updateCombat(.01);check('victory queued',game.combat.winner==='player');game.combat.resultDelay=0;game.updateCombat(.01);check('victory screen',game.mode==='victory');game.finishResult();check('quest reward',game.quest('ambush')==='completed');check('experience reward',game.data.player.exp>0||game.data.player.level>1);

game.mode='menu';game.menu={tab:4,index:0};game.ctx=context;import('../src/render.js').then(module=>module.render(game));game.save();check('save',saved.has('greenDragonSave'));
saved.set('greenDragonSave',JSON.stringify({version:2,location:'missing-place',player:{hp:999,maxHp:100,silver:-5,weapon:'river-sword'},inventory:{},party:[],quests:{}}));game.load();check('save migration',game.data.version===3&&game.data.systemsVersion===1&&game.data.location==='jade-river'&&game.data.player.hp===100&&game.data.player.silver===0&&game.data.ownedWeapons.includes('river-sword'));
console.log(`Smoke test passed (${passed.length} checks)`);
