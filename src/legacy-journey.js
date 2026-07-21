import {LOCATIONS,NPCS,WEAPONS} from './content.js';

const game=globalThis.greenDragonGame;
const LEGACY_START=LOCATIONS.length;
const LEGACY_LOCATION={id:'hall-returning-paths',name:'Hall of Returning Paths',subtitle:'Every victory becomes a question when the road begins again',background:'stage-legacy-returning-paths.webp',music:'mountain-theme',danger:5};
const clone=value=>JSON.parse(JSON.stringify(value??null));
const unique=values=>[...new Set((values||[]).filter(Boolean))];

const RANKS=['AWAKENED','TEMPERED','ASCENDANT','JADE SAGE','GREEN DRAGON'];
const ENDING_GIFTS={
  restoration:{title:'ASHEN CROWN OATH',detail:'Inherited guard and Chi reinforce every duel.',guard:22,chi:20,power:0,stamina:0},
  council:{title:'TEN THOUSAND VOICES',detail:'Inherited stamina and defence reward patient adaptation.',guard:8,chi:0,power:0,stamina:28,defence:3},
  wanderer:{title:'ROAD WITHOUT THRONE',detail:'Inherited power and movement reward decisive freedom.',guard:0,chi:8,power:5,stamina:14},
};
const BLESSINGS=[
  {id:'vitality',name:'Jade Marrow',detail:'Maximum HP +10 per rank',baseCost:3},
  {id:'breath',name:'Dragon Breath',detail:'Maximum Chi +6 per rank',baseCost:3},
  {id:'resolve',name:'Unbroken Resolve',detail:'Power +1 and defence +1 per rank',baseCost:5},
];
const echo=(id,name,level,maxHp,power,weapon,reward,boss=true,variant='ashen')=>({id:`legacy-${id}`,name:`Echo of ${name}`,x:700,variant,role:'boss',lines:[`The Returning Path remembers ${name}.`],enemy:{name:`Echo of ${name}`,level,maxHp,power,weapon,reward,boss}});
const GAUNTLETS=[
  {id:'ashes',name:'ASHES OF THE FIRST ROAD',reward:5,fights:[echo('kuo','Bandit Chief Kuo',9,320,21,'staff',220,false,'gold'),echo('novice-jin','Novice Jin',11,390,24,'staff',260,false,'atlas'),echo('ghost-face','Faceless Magistrate',13,490,28,'sword',340,true,'crimson')]},
  {id:'river',name:'BLACK RIVER REQUIEM',reward:8,fights:[echo('needle-crow','Needle Crow',14,520,29,'sword',360,false,'indigo'),echo('crimson-mask','Crimson Mask',16,620,33,'sword',430,true,'crimson'),echo('iron-phoenix','Iron Phoenix',18,760,37,'sword',520,true,'gold'),echo('censor-wei','Jade Viper',20,900,41,'sword',620,true,'indigo')]},
  {id:'snow',name:'CROWN BENEATH SNOW',reward:10,fights:[echo('stone-vein','Abbot Stone Vein',19,720,37,'staff',500,true),echo('father-no-face','Father No-Face',21,840,42,'staff',600,true,'crimson'),echo('black-star','Black Star Abbot',23,980,46,'staff',700,true,'indigo'),echo('regent-han','Black Dragon Regent',25,1120,50,'sword',820,true,'crimson')]},
  {id:'mandate',name:'JADE AND ASH',reward:12,fights:[echo('gate-general','Gate General Xun',22,860,43,'staff',620,true),echo('half-mask','Lady Half-Mask',24,1020,48,'staff',740,true,'crimson'),echo('throne-warden','Throne Warden',26,1180,53,'staff',860,true),echo('chancellor-sima','Pale Dragon Chancellor',28,1380,58,'sword',1000,true,'indigo')]},
  {id:'grandmaster',name:'FIVE DRAGONS GRANDMASTER CIRCUIT',reward:20,fights:[echo('faceless-grand','Faceless Magistrate',22,780,41,'sword',520,true,'crimson'),echo('jade-viper-grand','Jade Viper',24,920,46,'sword',620,true,'indigo'),echo('black-dragon-grand','Black Dragon Regent',27,1120,52,'sword',760,true,'crimson'),echo('pale-dragon-grand','Pale Dragon Chancellor',30,1420,60,'sword',960,true,'indigo'),echo('shen-shadow','Master Shen’s Shadow',32,1640,64,'staff',1200,true,'gold')]},
];

const LEGACY_NPCS=[
  {id:'keeper-returning-paths',name:'Keeper Rui “Second Dawn”',x:220,variant:'gold',role:'quest',lines:['A completed road does not disappear. It becomes a mirror.','Open the Legacy Ledger with G to begin another cycle or challenge the echoes.']},
  {id:'mirror-of-rivals',name:'Mirror of Ten Thousand Rivals',x:515,variant:'indigo',role:'fight',lines:['Every rival leaves a shape in the spirit. The mirror can make those shapes strike again.']},
  {id:'jade-legacy-brazier',name:'Jade Legacy Brazier',x:805,variant:'crimson',role:'train',lines:['Legacy Essence can be burned into blessings that survive every returning path.']},
];

function installContent(){
  if(!LOCATIONS.some(item=>item.id===LEGACY_LOCATION.id))LOCATIONS.push(LEGACY_LOCATION);
  NPCS[LEGACY_LOCATION.id]=NPCS[LEGACY_LOCATION.id]||[];
  for(const npc of LEGACY_NPCS)if(!NPCS[LEGACY_LOCATION.id].some(item=>item.id===npc.id))NPCS[LEGACY_LOCATION.id].push(npc);
}

function ensureLegacy(target=game){
  const data=target.data;
  const previous=data.legacy||{};
  const unlocked=Boolean(previous.unlocked||data.legacyReady||data.actFour?.complete);
  data.legacy={version:1,unlocked,active:false,cycle:0,essence:0,totalEssence:0,bestGauntlet:0,gauntletClears:{},endingHistory:[],inheritedEnding:data.actFour?.ending||null,blessings:{vitality:0,breath:0,resolve:0},losses:0,...previous};
  data.legacy.unlocked=Boolean(data.legacy.unlocked||data.legacyReady||data.actFour?.complete);
  data.legacy.cycle=Math.max(0,Math.floor(Number(data.legacy.cycle)||0));
  data.legacy.essence=Math.max(0,Math.floor(Number(data.legacy.essence)||0));
  data.legacy.totalEssence=Math.max(data.legacy.essence,Math.floor(Number(data.legacy.totalEssence)||0));
  data.legacy.bestGauntlet=Math.max(0,Math.floor(Number(data.legacy.bestGauntlet)||0));
  data.legacy.gauntletClears={...(data.legacy.gauntletClears||{})};
  data.legacy.endingHistory=unique(data.legacy.endingHistory);
  data.legacy.blessings={vitality:0,breath:0,resolve:0,...(data.legacy.blessings||{})};
  target.legacyState=target.legacyState||{mode:null,index:0,tab:0,gauntlet:null,step:0,startedAt:0};
  if(!data.legacy.inheritedEnding&&data.actFour?.ending)data.legacy.inheritedEnding=data.actFour.ending;
  applyPermanentBlessings(target);
}

function applyPermanentBlessings(target){
  const legacy=target.data.legacy;if(!legacy)return;
  const marker=`${legacy.blessings.vitality}:${legacy.blessings.breath}:${legacy.blessings.resolve}:${legacy.cycle}`;
  if(target.legacyBlessingMarker===marker)return;
  target.legacyBlessingMarker=marker;
  const player=target.data.player;
  const vitality=legacy.blessings.vitality||0,breath=legacy.blessings.breath||0,resolve=legacy.blessings.resolve||0;
  player.maxHp=Math.max(player.maxHp,120+vitality*10+legacy.cycle*4);
  player.maxChi=Math.max(player.maxChi,70+breath*6+legacy.cycle*2);
  player.power=Math.max(player.power,8+resolve+Math.floor(legacy.cycle/2));
  player.defence=Math.max(player.defence,4+resolve+Math.floor(legacy.cycle/3));
  player.hp=Math.min(player.maxHp,Math.max(1,player.hp));player.chi=Math.min(player.maxChi,Math.max(0,player.chi));
}

function rankForCycle(cycle){return RANKS[Math.min(RANKS.length-1,Math.max(0,cycle-1))]||RANKS[0]}
function endingGift(target){return ENDING_GIFTS[target.data.legacy?.inheritedEnding]||ENDING_GIFTS.wanderer}
function enterHall(target=game){ensureLegacy(target);if(!target.data.legacy.unlocked)return target.say('Complete the capital campaign to unlock the Returning Paths.','warning');target.mode='explore';target.data.location=LEGACY_LOCATION.id;target.data.player.x=110;target.locationFlash=2;target.transition=.8;target.sound.setMusic('mountain');target.say('THE HALL OF RETURNING PATHS','quest');target.save(true)}

function inheritanceSnapshot(target){
  const data=target.data;
  return {weapons:unique(data.ownedWeapons),styles:unique(data.learnedStyles),weapon:data.player.weapon,style:data.player.style,party:clone(data.party)||[],bonds:clone(data.bonds)||{},mastery:clone(data.mastery)||{},level:data.player.level,exp:data.player.exp,maxHp:data.player.maxHp,maxChi:data.player.maxChi,power:data.player.power,defence:data.player.defence,speed:data.player.speed,silver:data.player.silver,ending:data.actFour?.ending||data.legacy?.inheritedEnding||'wanderer',legacy:clone(data.legacy)};
}

function startLegacyJourney(target=game){
  ensureLegacy(target);if(!target.data.legacy.unlocked)return false;
  const inherited=inheritanceSnapshot(target),nextCycle=(inherited.legacy?.cycle||0)+1;
  const campaignNew=target.legacyCampaignNewGame;if(typeof campaignNew!=='function')return false;
  campaignNew();ensureLegacy(target);
  const legacy={...inherited.legacy,unlocked:true,active:true,cycle:nextCycle,inheritedEnding:inherited.ending,endingHistory:unique([...(inherited.legacy?.endingHistory||[]),inherited.ending]),gauntletClears:{...(inherited.legacy?.gauntletClears||{})},blessings:{vitality:0,breath:0,resolve:0,...(inherited.legacy?.blessings||{})}};
  target.data.legacy=legacy;target.data.legacyReady=true;
  target.data.ownedWeapons=unique(['training-staff',...inherited.weapons]);
  target.data.learnedStyles=unique(['Green Dragon Fist',...inherited.styles]);
  target.data.party=inherited.party;target.data.bonds=inherited.bonds;target.data.mastery=inherited.mastery;
  const player=target.data.player;
  player.level=Math.max(1,inherited.level);player.exp=inherited.exp;player.maxHp=inherited.maxHp;player.hp=player.maxHp;player.maxChi=inherited.maxChi;player.chi=player.maxChi;player.power=inherited.power;player.defence=inherited.defence;player.speed=inherited.speed;player.silver=Math.max(120,Math.floor(inherited.silver*.35));
  player.weapon=target.data.ownedWeapons.includes(inherited.weapon)?inherited.weapon:target.data.ownedWeapons.at(-1);
  player.style=target.data.learnedStyles.includes(inherited.style)?inherited.style:target.data.learnedStyles.at(-1);
  target.legacyBlessingMarker='';applyPermanentBlessings(target);target.data.location='jade-river';player.x=445;target.mode='explore';target.locationFlash=2;target.transition=1;target.say(`LEGACY CYCLE ${nextCycle} — ${rankForCycle(nextCycle)}`,'quest');target.save(true);return true;
}

function scaledEcho(target,npc){
  const cycle=Math.max(0,target.data.legacy?.cycle||0),factor=1+cycle*.26;
  return {...npc,enemy:{...npc.enemy,level:npc.enemy.level+cycle*2,maxHp:Math.round(npc.enemy.maxHp*factor),power:Math.round(npc.enemy.power*(1+cycle*.16)),reward:Math.round(npc.enemy.reward*(1+cycle*.12))}};
}
function launchGauntletFight(target){const trial=GAUNTLETS.find(item=>item.id===target.legacyState.gauntlet);const npc=trial?.fights[target.legacyState.step];if(!npc)return finishGauntlet(target);target.data.player.hp=target.data.player.maxHp;target.data.player.chi=target.data.player.maxChi;target.beginFight(scaledEcho(target,npc));if(target.combat){target.combat.legacyGauntlet=trial.id;target.combat.legacyStep=target.legacyState.step+1;target.combat.legacyTotal=trial.fights.length}}
function startGauntlet(target=game,id=GAUNTLETS[0].id){ensureLegacy(target);if(!target.data.legacy.unlocked)return false;const trial=GAUNTLETS.find(item=>item.id===id);if(!trial)return false;target.legacyState.gauntlet=id;target.legacyState.step=0;target.legacyState.startedAt=target.time||0;target.legacyState.mode=null;launchGauntletFight(target);return true}
function finishGauntlet(target){const trial=GAUNTLETS.find(item=>item.id===target.legacyState.gauntlet);if(!trial)return;const duration=Math.max(1,(target.time||0)-target.legacyState.startedAt),cycle=target.data.legacy.cycle||0,reward=trial.reward+cycle*2;target.data.legacy.essence+=reward;target.data.legacy.totalEssence+=reward;target.data.legacy.gauntletClears[trial.id]=(target.data.legacy.gauntletClears[trial.id]||0)+1;target.data.legacy.bestGauntlet=Math.max(target.data.legacy.bestGauntlet,trial.fights.length);target.data.flags[`legacyBest:${trial.id}`]=Math.min(Number(target.data.flags[`legacyBest:${trial.id}`])||Infinity,duration);target.legacyState.gauntlet=null;target.legacyState.step=0;target.mode='explore';target.data.location=LEGACY_LOCATION.id;target.data.player.x=480;target.say(`${trial.name} cleared · +${reward} Legacy Essence`,'quest');target.sound.sfx('level');target.save(true)}
function abortGauntlet(target){if(!target.legacyState.gauntlet)return;target.data.legacy.losses++;target.legacyState.gauntlet=null;target.legacyState.step=0;target.mode='explore';target.data.location=LEGACY_LOCATION.id;target.data.player.x=480;target.say('The mirror releases you. The Returning Path remains.','warning');target.save(true)}
function spendBlessing(target,id){ensureLegacy(target);const blessing=BLESSINGS.find(item=>item.id===id);if(!blessing)return false;const rank=target.data.legacy.blessings[id]||0,cost=blessing.baseCost+rank*2;if(target.data.legacy.essence<cost){target.say(`Requires ${cost} Legacy Essence.`,'warning');return false}target.data.legacy.essence-=cost;target.data.legacy.blessings[id]=rank+1;target.legacyBlessingMarker='';applyPermanentBlessings(target);target.data.player.hp=target.data.player.maxHp;target.data.player.chi=target.data.player.maxChi;target.say(`${blessing.name} rank ${rank+1} awakened.`,'quest');target.sound.sfx('train');target.save(true);return true}

function makeStage(){if(typeof document==='undefined'||!document.createElement||!globalThis.greenDragonAssets?.stages)return;const canvas=document.createElement('canvas');canvas.width=960;canvas.height=540;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;const g=c.createLinearGradient(0,0,0,540);g.addColorStop(0,'#101d28');g.addColorStop(1,'#52706c');c.fillStyle=g;c.fillRect(0,0,960,540);for(let i=0;i<64;i++){c.fillStyle=i%5?'#b9d9cf':'#e5c46f';c.fillRect((i*137)%960,(i*73)%300,i%5?2:4,i%5?2:4)}c.fillStyle='#788d82';c.fillRect(0,350,960,190);c.fillStyle='#26342f';c.fillRect(160,155,640,250);c.fillStyle='#151d1b';c.beginPath();c.moveTo(120,185);c.lineTo(480,80);c.lineTo(840,185);c.closePath();c.fill();for(let i=0;i<7;i++){c.fillStyle='#191d1b';c.fillRect(205+i*88,220,20,185);c.fillStyle='#c3a75f';c.fillRect(211+i*88,228,8,166)}for(let i=0;i<5;i++){c.strokeStyle=i===2?'#77e2a4':'#d7bd73';c.lineWidth=3;c.beginPath();c.arc(300+i*90,285,25,0,Math.PI*2);c.stroke()}c.fillStyle='#172421';c.fillRect(405,405,150,65);c.fillStyle='#77d99e';c.fillRect(437,419,86,8);globalThis.greenDragonAssets.stages[LEGACY_LOCATION.background]=canvas}
function panel(ctx,x,y,w,h){ctx.fillStyle='rgba(4,10,13,.97)';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#ddc075';ctx.lineWidth=3;ctx.strokeRect(x+.5,y+.5,w-1,h-1);ctx.strokeStyle='#46715f';ctx.lineWidth=1;ctx.strokeRect(x+7.5,y+7.5,w-15,h-15)}
function text(ctx,value,x,y,size=16,color='#f0ead8',align='left',font='Georgia'){ctx.fillStyle=color;ctx.font=`${size}px ${font}`;ctx.textAlign=align;ctx.textBaseline='top';ctx.fillText(String(value),x,y)}
function wrap(ctx,value,x,y,width,lineHeight=20,size=13,color='#d4d5ca',limit=3){ctx.font=`${size}px Georgia`;ctx.fillStyle=color;ctx.textAlign='left';let line='',rows=[];for(const word of String(value).split(' ')){const next=line?`${line} ${word}`:word;if(ctx.measureText(next).width>width&&line){rows.push(line);line=word}else line=next}if(line)rows.push(line);rows.slice(0,limit).forEach((row,index)=>ctx.fillText(row,x,y+index*lineHeight))}
function drawLegacy(target){const ctx=target.ctx;if(!ctx||!target.data?.legacy)return;const legacy=target.data.legacy;
  if(target.mode==='act-four-complete'&&legacy.unlocked){ctx.fillStyle='rgba(2,8,10,.94)';ctx.fillRect(110,411,740,49);text(ctx,'ENTER enters the Hall of Returning Paths · G opens Legacy Journey',480,427,12,'#91e6b5','center','monospace')}
  if(target.mode==='explore'&&legacy.unlocked&&!target.legacyState.mode&&!target.enhancement?.mode){panel(ctx,604,160,342,34);text(ctx,`LEGACY ${legacy.cycle} · ESSENCE ${legacy.essence}`,618,171,9,'#a9e7c5','left','monospace');text(ctx,'G RETURNING PATHS',932,171,9,'#ebcf7b','right','monospace')}
  if(target.mode==='combat'&&target.combat?.legacyRank){text(ctx,`${target.combat.legacyRank} · CYCLE ${legacy.cycle}`,480,164,10,'#8fe6b5','center','monospace');if(target.combat.legacyGauntlet)text(ctx,`ECHO ${target.combat.legacyStep}/${target.combat.legacyTotal}`,480,181,9,'#e7ca75','center','monospace')}
  if(target.legacyState.mode==='ledger'){ctx.fillStyle='rgba(0,0,0,.8)';ctx.fillRect(0,0,960,540);panel(ctx,82,42,796,452);text(ctx,'LEGACY JOURNEY',480,66,34,'#90e5b4','center');text(ctx,`CYCLE ${legacy.cycle} · ${legacy.cycle?rankForCycle(legacy.cycle):'UNWALKED'} · ESSENCE ${legacy.essence}`,480,111,11,'#ebce7c','center','monospace');const gift=endingGift(target),items=[['BEGIN RETURNING PATH',`Restart Act I with weapons, styles, companions, mastery and ${gift.title}.`],['BOSS ECHO TRIALS','Challenge themed rival sequences for Legacy Essence.'],['PERMANENT BLESSINGS','Spend essence on stats that survive every cycle.'],['LEGACY RECORDS',`${legacy.endingHistory.length} endings remembered · ${Object.values(legacy.gauntletClears).reduce((a,b)=>a+b,0)} trials cleared.`]];items.forEach(([title,detail],index)=>{const y=158+index*67;if(index===target.legacyState.index){ctx.fillStyle='#243c33';ctx.fillRect(118,y-7,724,57)}text(ctx,title,142,y,17,index===target.legacyState.index?'#fff0bd':'#c8c8bd');wrap(ctx,detail,142,y+27,650,18,12,'#cdd2c8',2)});text(ctx,'UP / DOWN · ENTER · G / ESC CLOSE',480,465,10,'#bdb69e','center','monospace')}
  if(target.legacyState.mode==='trials'){ctx.fillStyle='rgba(0,0,0,.82)';ctx.fillRect(0,0,960,540);panel(ctx,75,38,810,462);text(ctx,'MIRROR OF TEN THOUSAND RIVALS',480,63,29,'#e9cc78','center');GAUNTLETS.forEach((trial,index)=>{const y=120+index*66,selected=index===target.legacyState.index,clears=legacy.gauntletClears[trial.id]||0;if(selected){ctx.fillStyle='#29372f';ctx.fillRect(112,y-6,736,55)}text(ctx,trial.name,135,y,16,selected?'#fff0bd':'#cac7b9');text(ctx,`${trial.fights.length} ECHOES · +${trial.reward+(legacy.cycle||0)*2} ESSENCE · CLEARS ${clears}`,815,y+5,9,selected?'#8ee4b1':'#aaa99f','right','monospace');wrap(ctx,trial.fights.map(item=>item.enemy.name.replace('Echo of ','')).join(' · '),135,y+26,650,17,11,'#bfc7bd',2)});text(ctx,'ENTER BEGIN · ESC BACK',480,468,10,'#beb69e','center','monospace')}
  if(target.legacyState.mode==='blessings'){ctx.fillStyle='rgba(0,0,0,.82)';ctx.fillRect(0,0,960,540);panel(ctx,110,70,740,390);text(ctx,'PERMANENT LEGACY BLESSINGS',480,96,28,'#90e5b4','center');BLESSINGS.forEach((item,index)=>{const y=165+index*82,rank=legacy.blessings[item.id]||0,cost=item.baseCost+rank*2;if(index===target.legacyState.index){ctx.fillStyle='#29372f';ctx.fillRect(145,y-9,670,65)}text(ctx,item.name,168,y,20,index===target.legacyState.index?'#fff0bd':'#cbc7b7');text(ctx,`RANK ${rank} · COST ${cost}`,790,y+5,10,'#e8ca77','right','monospace');text(ctx,item.detail,168,y+34,13,'#c8d0c7')});text(ctx,`LEGACY ESSENCE ${legacy.essence} · ENTER AWAKEN · ESC BACK`,480,426,10,'#bdb79f','center','monospace')}
  if(target.legacyState.mode==='records'){ctx.fillStyle='rgba(0,0,0,.82)';ctx.fillRect(0,0,960,540);panel(ctx,105,60,750,410);text(ctx,'RECORD OF RETURNING PATHS',480,87,28,'#e7c976','center');const gift=endingGift(target);text(ctx,`INHERITED MANDATE · ${gift.title}`,480,133,13,'#91e5b4','center','monospace');wrap(ctx,gift.detail,180,163,600,22,15,'#d9d5c8',3);text(ctx,`CYCLES WALKED ${legacy.cycle}`,180,242,16,'#eee2c4');text(ctx,`TOTAL ESSENCE ${legacy.totalEssence}`,180,278,16,'#eee2c4');text(ctx,`BEST GAUNTLET ${legacy.bestGauntlet} ECHOES`,180,314,16,'#eee2c4');text(ctx,`DEFEATS IN THE MIRROR ${legacy.losses}`,180,350,16,'#eee2c4');text(ctx,`ENDINGS REMEMBERED ${legacy.endingHistory.join(' · ')||'none'}`,180,386,13,'#a8dabe');text(ctx,'ESC BACK',480,438,10,'#bdb69e','center','monospace')}
}

function handleLegacyInput(target,key){const state=target.legacyState;if(state.mode==='ledger'){if(['Escape','KeyG'].includes(key)){state.mode=null;target.sound.sfx('move');return true}if(['ArrowUp','KeyW'].includes(key)){state.index=(state.index+3)%4;target.sound.sfx('move');return true}if(['ArrowDown','KeyS'].includes(key)){state.index=(state.index+1)%4;target.sound.sfx('move');return true}if(['Enter','KeyE'].includes(key)){if(state.index===0){startLegacyJourney(target);return true}state.mode=['trials','blessings','records'][state.index-1];state.index=0;target.sound.sfx('ok');return true}return true}if(state.mode==='trials'){if(key==='Escape'){state.mode='ledger';state.index=1;return true}if(['ArrowUp','KeyW'].includes(key)){state.index=(state.index+GAUNTLETS.length-1)%GAUNTLETS.length;return true}if(['ArrowDown','KeyS'].includes(key)){state.index=(state.index+1)%GAUNTLETS.length;return true}if(['Enter','KeyE'].includes(key)){startGauntlet(target,GAUNTLETS[state.index].id);return true}return true}if(state.mode==='blessings'){if(key==='Escape'){state.mode='ledger';state.index=2;return true}if(['ArrowUp','KeyW'].includes(key)){state.index=(state.index+BLESSINGS.length-1)%BLESSINGS.length;return true}if(['ArrowDown','KeyS'].includes(key)){state.index=(state.index+1)%BLESSINGS.length;return true}if(['Enter','KeyE'].includes(key)){spendBlessing(target,BLESSINGS[state.index].id);return true}return true}if(state.mode==='records'){if(['Escape','Enter','KeyE'].includes(key)){state.mode='ledger';state.index=3}return true}return false}

function patchGame(target){ensureLegacy(target);target.legacyCampaignNewGame=target.newGame.bind(target);
  const baseSave=target.save.bind(target);target.save=function(silent=false){ensureLegacy(this);return baseSave(silent)};
  const baseLoad=target.load.bind(target);target.load=function(){const result=baseLoad();ensureLegacy(this);return result};
  const baseNew=target.newGame.bind(target);target.newGame=function(){const result=baseNew();ensureLegacy(this);return result};
  const basePress=target.press.bind(target);target.press=function(key){ensureLegacy(this);if(handleLegacyInput(this,key))return;if(this.mode==='act-four-complete'&&['Enter','KeyE'].includes(key)){enterHall(this);return}if(key==='KeyG'&&this.data.legacy.unlocked&&!['combat','dialogue','victory','defeat'].includes(this.mode)){this.legacyState.mode='ledger';this.legacyState.index=0;this.sound.sfx('ok');return}return basePress(key)};
  const baseTravel=target.travel.bind(target);target.travel=function(direction){const current=LOCATIONS.findIndex(item=>item.id===this.data.location),next=current+direction;if(next>=LEGACY_START&&!this.data.legacy?.unlocked){this.data.player.x=920;this.say('The Returning Paths open after the final mandate.','warning');return}return baseTravel(direction)};
  const baseAfter=target.afterTalk.bind(target);target.afterTalk=function(npc){if(npc.id==='keeper-returning-paths'){this.legacyState.mode='ledger';this.legacyState.index=0;return}if(npc.id==='mirror-of-rivals'){this.legacyState.mode='trials';this.legacyState.index=0;return}if(npc.id==='jade-legacy-brazier'){this.legacyState.mode='blessings';this.legacyState.index=0;return}return baseAfter(npc)};
  const baseBegin=target.beginFight.bind(target);target.beginFight=function(npc){baseBegin(npc);if(!this.combat)return;ensureLegacy(this);const cycle=this.data.legacy.active?this.data.legacy.cycle:0,echoBattle=String(npc.id).startsWith('legacy-');if(cycle||echoBattle){const intensity=Math.max(1,cycle)+(echoBattle?1:0),enemy=this.combat.enemy;enemy.maxHp=Math.round(enemy.maxHp*(1+intensity*.18));enemy.hp=enemy.maxHp;enemy.power+=intensity*3;enemy.defence+=intensity*2;enemy.maxGuard+=intensity*12;enemy.guard=enemy.maxGuard;enemy.maxStamina+=intensity*8;enemy.stamina=enemy.maxStamina;this.combat.xpReward=Math.round(this.combat.xpReward*(1+intensity*.16));this.combat.reward=Math.round(this.combat.reward*(1+intensity*.12));this.combat.legacyRank=rankForCycle(Math.max(1,cycle));const gift=endingGift(this);this.combat.inheritedGift=gift.title;this.combat.player.maxGuard+=gift.guard||0;this.combat.player.guard=this.combat.player.maxGuard;this.combat.player.maxStamina+=gift.stamina||0;this.combat.player.stamina=this.combat.player.maxStamina;this.combat.player.power+=gift.power||0;this.combat.player.defence+=gift.defence||0;this.combat.player.maxChi+=gift.chi||0;this.combat.player.chi=Math.min(this.combat.player.maxChi,this.combat.player.chi+(gift.chi||0))}};
  const baseFinish=target.finishResult.bind(target);target.finishResult=function(){const gauntlet=this.legacyState?.gauntlet,wasDefeat=this.mode==='defeat';const result=baseFinish();if(gauntlet){if(wasDefeat){abortGauntlet(this);return result}this.legacyState.step++;const trial=GAUNTLETS.find(item=>item.id===gauntlet);if(this.legacyState.step<trial.fights.length)launchGauntletFight(this);else finishGauntlet(this)}return result};
  const previousLoop=target.loop.bind(target);target.loop=function(now){previousLoop(now);drawLegacy(this)};
}

installContent();makeStage();patchGame(game);
globalThis.greenDragonLegacy={LEGACY_LOCATION,GAUNTLETS,BLESSINGS,ENDING_GIFTS,ensureLegacy,enterHall,startLegacyJourney,startGauntlet,spendBlessing,rankForCycle};
