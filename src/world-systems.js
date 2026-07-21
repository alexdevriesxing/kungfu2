import {LOCATIONS,NPCS,QUESTS,WEAPONS} from './content.js';

const game=globalThis.greenDragonGame;
const enhancementApi=globalThis.greenDragonEnhancements;
const canvas=document.getElementById('game');

const SIDE_QUESTS=[
  {id:'razor-fang-hunt',title:'The Razor at Bamboo Ford',giver:'Lotus “Ink Dagger” Lin',summary:'Defeat Razor Fang, whose collectors are bleeding Golden Carp Market dry.',reward:'220 silver · Lotus joins the party'},
  {id:'bent-reed-oath',title:'The Bent Reed Oath',giver:'Hermit Reed',summary:'Master Willow Step and convince Hermit Reed to leave the bamboo grove.',reward:'Hermit Reed joins the party'},
  {id:'bell-sparrow-oath',title:'A Sparrow Leaves the Bell',giver:'Jin “Bell Sparrow”',summary:'After the Shaolin trial, invite Jin to see the wider jianghu.',reward:'Jin joins the party'},
];

const CONTRACTS=[
  {id:'contract-red-sash',name:'Red Sash Road Tax',summary:'Break a Red Sash patrol collecting illegal tolls.',level:3,reward:95,enemy:{name:'Ma “Toll Wolf” Ren',variant:'crimson',level:3,maxHp:128,power:10,reward:95,weapon:'staff'}},
  {id:'contract-lantern-jackal',name:'Lantern Jackal Extortion',summary:'Protect market traders from an armed extortionist.',level:4,reward:130,enemy:{name:'Deng “Lantern Jackal”',variant:'indigo',level:4,maxHp:154,power:12,reward:130,weapon:'sword'}},
  {id:'contract-stone-ape',name:'Stone Ape Challenge',summary:'Win a sanctioned challenge without killing the mountain fighter.',level:5,reward:165,enemy:{name:'Bao “Stone Ape”',variant:'gold',level:5,maxHp:184,power:14,reward:165,weapon:'none'}},
  {id:'contract-cloud-spear',name:'Cloud Spear Warrant',summary:'Disarm a rogue spear master wanted by three escort houses.',level:6,reward:220,enemy:{name:'Xue “Cloud Spear”',variant:'ashen',level:6,maxHp:216,power:16,reward:220,weapon:'staff'}},
];

const REPUTATION_LABELS={commonfolk:'COMMON FOLK',shaolin:'SHAOLIN',wanderers:'WANDERERS',merchants:'MERCHANTS'};
const masteryTier=value=>Math.min(5,Math.floor((Number(value)||0)/3));
const partyName=member=>member.name.split(' “')[0];

function addQuestDefinitions(){
  for(const quest of SIDE_QUESTS)if(!QUESTS.some(item=>item.id===quest.id))QUESTS.push(quest);
  const guides=enhancementApi?.QUEST_GUIDE;
  if(guides){
    guides['razor-fang-hunt']={location:'bamboo-forest',npc:'razor-fang',objective:'Defeat Razor Fang at Bamboo Ford.'};
    guides['bent-reed-oath']={location:'bamboo-forest',npc:'hermit-reed',objective:'Master Willow Step, then speak to Hermit Reed.'};
    guides['bell-sparrow-oath']={location:'shaolin-courtyard',npc:'jin-ally',objective:'Invite Jin “Bell Sparrow” to travel with you.'};
  }
}

function injectNpc(location,npc){
  NPCS[location]=NPCS[location]||[];
  if(!NPCS[location].some(item=>item.id===npc.id))NPCS[location].push(npc);
}

function addLivingWorldNpcs(){
  injectNpc('market-street',{id:'lotus',name:'Lotus “Ink Dagger” Lin',x:875,variant:'indigo',role:'recruit',lines:[
    'Razor Fang taxes every bowl, bolt and medicine chest that enters this market.',
    'Bring his collection book back from Bamboo Ford and the merchants will breathe again.',
    'I have hidden behind ledgers long enough. Settle this, and my blades travel with yours.'
  ]});
  injectNpc('bamboo-forest',{id:'razor-fang',name:'Razor Fang',x:845,variant:'crimson',role:'fight',enemy:{name:'Razor Fang',variant:'crimson',level:5,maxHp:185,power:14,reward:220,weapon:'sword'},lines:[
    'Every road belongs to whoever is strong enough to price it.',
    'The little accountant sent you? I will return your answer carved into bamboo.'
  ]});
  injectNpc('shaolin-courtyard',{id:'jin-ally',name:'Jin “Bell Sparrow”',x:835,variant:'gold',sprite:'novice-jin',role:'recruit',lines:[
    'The courtyard feels smaller after crossing hands with you.',
    'Abbot Wu says discipline must eventually leave the gate and meet the world.',
    'Give me a place at your back. I will bring the bell with me in spirit.'
  ]});
}

function ensureWorldData(target=game){
  addQuestDefinitions();
  addLivingWorldNpcs();
  const data=target.data;
  data.livingWorldVersion=1;
  for(const quest of SIDE_QUESTS)if(!data.quests[quest.id])data.quests[quest.id]='locked';
  data.reputation={commonfolk:0,shaolin:0,wanderers:0,merchants:0,...(data.reputation||{})};
  data.bonds={...(data.bonds||{})};
  for(const member of data.party||[])data.bonds[member.id]=Math.max(0,Number(data.bonds[member.id])||0);
  data.mastery={weapons:{staff:0,sword:0,...(data.mastery?.weapons||{})},styles:{...(data.mastery?.styles||{})}};
  data.contracts={completed:0,streak:0,last:null,...(data.contracts||{})};
  data.discoveries=[...new Set([data.location,...(Array.isArray(data.discoveries)?data.discoveries:[])])];
  data.tutorials={explore:false,contracts:false,camp:false,...(data.tutorials||{})};
  data.rested=Math.max(0,Number(data.rested)||0);
  target.worldState=target.worldState||{mode:null,index:0,hintTimer:1.2,lastMode:null};
  for(const member of data.party||[])if(data.bonds[member.id]===undefined)data.bonds[member.id]=0;
  return data;
}

function setQuest(target,id,status,track=true){
  ensureWorldData(target);
  const previous=target.data.quests[id];
  target.data.quests[id]=status;
  if(track&&status==='active'&&target.data.settings?.autoTrack!==false)target.data.trackedQuest=id;
  if(previous!==status)target.save(true);
}

function addReputation(target,key,amount){target.data.reputation[key]=Math.max(0,(target.data.reputation[key]||0)+amount)}

function recruitUnique(target,npc,style,reputationKey){
  if(target.data.party.some(member=>member.id===npc.id))return false;
  if(target.data.party.length>=5){target.say('Your five companion places are full.','warning');return false}
  target.data.party.push({id:npc.id,name:npc.name,variant:npc.variant,sprite:npc.sprite||npc.id,style});
  target.data.bonds[npc.id]=Math.max(1,target.data.bonds[npc.id]||0);
  if(reputationKey)addReputation(target,reputationKey,2);
  target.sound.sfx('recruit');target.flash('#78f39a',.18);target.say(`${partyName(npc)} joined the party.`,'recruit');target.save(true);return true;
}

function openWorldOverlay(target,mode){
  if(target.mode!=='explore'||target.enhancement?.mode)return false;
  target.worldState.mode=mode;target.worldState.index=0;target.keys={};target.sound.sfx('ok');return true;
}
function closeWorldOverlay(target){target.worldState.mode=null;target.worldState.index=0;target.sound.sfx('move');target.save(true)}
function campRows(target){return [{type:'rest',name:'REST AT CAMP',detail:'20 silver · restore HP and Chi · begin next duel focused'},...(target.data.party||[]).map(member=>({type:'bond',member,name:`SHARE TEA: ${partyName(member)}`,detail:`12 silver · bond ${target.data.bonds[member.id]||0}/10`}))]}

function handleWorldOverlayKey(target,key){
  const state=target.worldState;
  const rows=state.mode==='contracts'?CONTRACTS:state.mode==='camp'?campRows(target):[];
  if(key==='Escape'||(state.mode==='contracts'&&key==='KeyB')||(state.mode==='camp'&&key==='KeyC')||(state.mode==='mastery'&&key==='KeyV')){closeWorldOverlay(target);return true}
  if(['ArrowUp','KeyW'].includes(key)){state.index=(state.index+Math.max(1,rows.length)-1)%Math.max(1,rows.length);target.sound.sfx('move');return true}
  if(['ArrowDown','KeyS'].includes(key)){state.index=(state.index+1)%Math.max(1,rows.length);target.sound.sfx('move');return true}
  if(!['Enter','KeyE'].includes(key))return true;
  if(state.mode==='contracts'){
    const contract=CONTRACTS[state.index]||CONTRACTS[0];state.mode=null;
    const npc={id:contract.id,name:contract.enemy.name,x:620,variant:contract.enemy.variant,role:'fight',enemy:{...contract.enemy}};
    target.beginFight(npc);target.combat.contract=contract;target.say(`${contract.name} accepted`,'quest');return true;
  }
  if(state.mode==='camp'){
    const row=rows[state.index]||rows[0],player=target.data.player;
    if(row.type==='rest'){
      if(player.silver<20)return target.say('You need 20 silver to make camp.','warning');
      player.silver-=20;player.hp=player.maxHp;player.chi=player.maxChi;target.data.rested=1;target.sound.sfx('heal');target.flash('#77e89a',.13);target.say('The party rests beneath the jade lanterns.','save');
    }else{
      if(player.silver<12)return target.say('You need 12 silver to share tea.','warning');
      const id=row.member.id,current=target.data.bonds[id]||0;if(current>=10)return target.say('This bond is already unshakable.','system');
      player.silver-=12;target.data.bonds[id]=current+1;target.sound.sfx('recruit');target.say(`Bond with ${partyName(row.member)} deepened to ${current+1}.`,'recruit');
    }
    target.save(true);return true;
  }
  return true;
}

function weaponKind(target){return WEAPONS.find(item=>item.id===target.data.player.weapon)?.kind||'staff'}
function masterySummary(target){const kind=weaponKind(target),weapon=target.data.mastery.weapons[kind]||0,style=target.data.player.style,styleXp=target.data.mastery.styles[style]||0;return {kind,weapon,weaponTier:masteryTier(weapon),style,styleXp,styleTier:masteryTier(styleXp)}}

function applyMasteryToBattle(target){
  const battle=target.combat,summary=masterySummary(target);if(!battle)return;
  battle.mastery=summary;battle.player.power+=summary.weaponTier+summary.styleTier;
  battle.player.maxStamina+=summary.styleTier*3;battle.player.stamina=battle.player.maxStamina;
  battle.player.maxGuard+=summary.weaponTier*2;battle.player.guard=battle.player.maxGuard;
  if(target.data.rested>0){battle.player.maxStamina+=15;battle.player.stamina=battle.player.maxStamina;battle.player.maxGuard+=10;battle.player.guard=battle.player.maxGuard;battle.rested=true;target.data.rested=0}
}

function awardMastery(target,battle){
  const kind=weaponKind(target),style=target.data.player.style;
  target.data.mastery.weapons[kind]=(target.data.mastery.weapons[kind]||0)+1;
  target.data.mastery.styles[style]=(target.data.mastery.styles[style]||0)+1;
  for(const member of target.data.party)target.data.bonds[member.id]=Math.min(10,(target.data.bonds[member.id]||0)+1);
  if(battle?.contract){target.data.contracts.completed++;target.data.contracts.streak++;target.data.contracts.last=battle.contract.id;addReputation(target,'commonfolk',1)}
}

function sideQuestAfterTalk(target,npc){
  if(npc.id==='lotus'){
    if(target.data.quests['razor-fang-hunt']==='locked'){setQuest(target,'razor-fang-hunt','active');target.say('New side quest: The Razor at Bamboo Ford','quest');return true}
    if(target.data.quests['razor-fang-hunt']==='completed')return recruitUnique(target,npc,'Ink Dagger Twin Blades','merchants');
    target.say('Razor Fang still controls Bamboo Ford.','quest');return true;
  }
  if(npc.id==='hermit-reed'){
    if(target.data.party.some(member=>member.id==='hermit-reed'))return false;
    if(target.data.flags.willow){setQuest(target,'bent-reed-oath','completed',false);return recruitUnique(target,npc,'Drunken Reed','wanderers')}
    if(target.data.quests['bent-reed-oath']==='locked'){setQuest(target,'bent-reed-oath','active');target.say('Master Willow Step, then return to Hermit Reed.','quest')}
  }
  if(npc.id==='jin-ally'){
    if(!target.data.defeated.includes('novice-jin')){target.say('First pass the Shaolin trial in the courtyard.','system');return true}
    setQuest(target,'bell-sparrow-oath','completed',false);return recruitUnique(target,npc,'Shaolin Long Fist','shaolin');
  }
  return false;
}

function patchGame(target){
  ensureWorldData(target);
  const baseSave=target.save.bind(target);target.save=function(silent=false){ensureWorldData(this);return baseSave(silent)};
  const baseLoad=target.load.bind(target);target.load=function(){const result=baseLoad();ensureWorldData(this);this.save(true);return result};
  const baseNew=target.newGame.bind(target);target.newGame=function(){const result=baseNew();ensureWorldData(this);this.say('E interacts · T tracks quests · B opens paid contracts','quest');this.data.tutorials.explore=true;this.save(true);return result};
  const basePress=target.press.bind(target);target.press=function(key){if(this.worldState.mode)return handleWorldOverlayKey(this,key);if(key==='KeyB'){openWorldOverlay(this,'contracts');return}if(key==='KeyC'){openWorldOverlay(this,'camp');return}if(key==='KeyV'){openWorldOverlay(this,'mastery');return}return basePress(key)};
  const baseUpdate=target.update.bind(target);target.update=function(dt){if(this.worldState.mode)return;baseUpdate(dt)};
  const baseAfterTalk=target.afterTalk.bind(target);target.afterTalk=function(npc){if(sideQuestAfterTalk(this,npc))return;return baseAfterTalk(npc)};
  const baseTrainPress=target.trainPress.bind(target);target.trainPress=function(key){const hadWillow=!!this.data.flags.willow,result=baseTrainPress(key);if(!hadWillow&&this.data.flags.willow&&this.data.quests['bent-reed-oath']==='locked')setQuest(this,'bent-reed-oath','active');return result};
  const baseBeginFight=target.beginFight.bind(target);target.beginFight=function(npc){const result=baseBeginFight(npc);ensureWorldData(this);applyMasteryToBattle(this);return result};
  const baseAssist=target.assist.bind(target);target.assist=function(index){const battle=this.combat,member=this.data.party[index],before=battle?.enemy?.hp??0,result=baseAssist(index);if(!member||!battle||before===battle.enemy.hp)return result;const bond=this.data.bonds[member.id]||0,bonus=Math.floor(bond*1.5);battle.enemy.hp=Math.max(0,battle.enemy.hp-bonus);if(member.id==='mei-lin')battle.enemy.guard=Math.max(0,battle.enemy.guard-8-bond);if(member.id==='bo')battle.enemy.hp=Math.max(0,battle.enemy.hp-5);if(member.id==='hermit-reed')battle.player.stamina=Math.min(battle.player.maxStamina,battle.player.stamina+16+bond);if(member.id==='lotus')battle.player.chi=Math.min(battle.player.maxChi,battle.player.chi+10+bond);if(member.id==='jin-ally')battle.player.guard=Math.min(battle.player.maxGuard,battle.player.guard+14+bond);if(bonus)this.floatText(`BOND +${bonus}`,battle.enemy.x,battle.enemy.y-174,'#7ce8a0',12);return result};
  const baseTravel=target.travel.bind(target);target.travel=function(direction){const before=this.data.location,result=baseTravel(direction);if(this.data.location!==before){if(!this.data.discoveries.includes(this.data.location)){this.data.discoveries.push(this.data.location);this.say(`Discovered: ${this.location().name}`,'quest')}this.save(true)}return result};
  const baseFinish=target.finishResult.bind(target);target.finishResult=function(){const won=this.mode==='victory',battle=this.combat,enemyId=battle?.npc?.id,result=baseFinish();ensureWorldData(this);if(won&&battle){awardMastery(this,battle);if(enemyId==='razor-fang'){setQuest(this,'razor-fang-hunt','completed',false);addReputation(this,'merchants',2);this.say('Razor Fang defeated. Return to Lotus.','quest')}if(enemyId==='novice-jin'&&this.data.quests['bell-sparrow-oath']==='locked')setQuest(this,'bell-sparrow-oath','active');if(battle.contract){this.data.defeated=this.data.defeated.filter(id=>id!==enemyId);this.say(`Contract complete · streak ${this.data.contracts.streak}`,'quest')}this.save(true)}else if(!won&&battle?.contract){this.data.contracts.streak=0;this.save(true)}return result};
  const previousLoop=target.loop.bind(target);target.loop=function(now){previousLoop(now);drawWorldSystems(this)};
}

function panel(ctx,x,y,w,h,alpha=.98){ctx.fillStyle=`rgba(4,12,9,${alpha})`;ctx.fillRect(x,y,w,h);ctx.strokeStyle='#e0b963';ctx.lineWidth=3;ctx.strokeRect(x+.5,y+.5,w-1,h-1);ctx.strokeStyle='#31563f';ctx.lineWidth=1;ctx.strokeRect(x+7.5,y+7.5,w-15,h-15)}
function text(ctx,value,x,y,size=16,color='#f6e8c4',align='left',font='Georgia'){ctx.fillStyle=color;ctx.font=`${size}px ${font}`;ctx.textAlign=align;ctx.textBaseline='top';ctx.fillText(String(value),x,y)}
function wrap(ctx,value,x,y,width,lineHeight=20,size=14,color='#d8d2bb',limit=5){ctx.font=`${size}px Georgia`;ctx.fillStyle=color;ctx.textAlign='left';let line='',rows=[];for(const word of String(value).split(' ')){const next=line?`${line} ${word}`:word;if(ctx.measureText(next).width>width&&line){rows.push(line);line=word}else line=next}if(line)rows.push(line);rows.slice(0,limit).forEach((row,index)=>ctx.fillText(row,x,y+index*lineHeight))}

function drawWorldSystems(target){
  const ctx=target.ctx,state=target.worldState;if(!ctx||!state)return;
  if(target.mode==='explore'&&!state.mode&&!target.enhancement?.mode){const bonds=target.data.party.reduce((sum,member)=>sum+(target.data.bonds[member.id]||0),0);panel(ctx,14,121,342,35,.84);text(ctx,`PARTY ${target.data.party.length}/5 · BONDS ${bonds} · CONTRACT STREAK ${target.data.contracts.streak}`,28,132,9,'#c8b77e','left','monospace');text(ctx,'B BOARD  C CAMP  V MASTERY',342,132,9,'#73d795','right','monospace')}
  if(target.mode==='combat'&&target.combat?.mastery){const m=target.combat.mastery;text(ctx,`${m.kind.toUpperCase()} MASTERY ${m.weaponTier} · STYLE MASTERY ${m.styleTier}${target.combat.rested?' · RESTED':''}`,480,128,9,'#8ee3a4','center','monospace')}
  if(!state.mode)return;
  ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(0,0,960,540);
  if(state.mode==='contracts')drawContracts(target);if(state.mode==='camp')drawCamp(target);if(state.mode==='mastery')drawMastery(target);
}

function drawContracts(target){
  const ctx=target.ctx,state=target.worldState,contract=CONTRACTS[state.index]||CONTRACTS[0];panel(ctx,82,45,796,450,.99);text(ctx,'JIANGHU CONTRACT BOARD',110,69,27,'#e7c875');text(ctx,`COMPLETED ${target.data.contracts.completed} · CURRENT STREAK ${target.data.contracts.streak}`,110,105,10,'#72d890','left','monospace');
  CONTRACTS.forEach((item,index)=>{const y=145+index*55;if(index===state.index){ctx.fillStyle='#1c4631';ctx.fillRect(105,y-7,380,43)}text(ctx,item.name,121,y,16,index===state.index?'#fff0bd':'#cec6ae');text(ctx,`Lv ${item.level} · ${item.reward} silver`,467,y+4,10,index===state.index?'#78e797':'#a79367','right','monospace')});
  text(ctx,contract.name,525,151,21,'#f1d489');text(ctx,contract.enemy.name,525,184,12,'#78df96','left','monospace');wrap(ctx,contract.summary,525,221,300,22,15,'#ddd4b9',5);text(ctx,`RECOMMENDED LEVEL ${contract.level}`,525,344,10,'#c7aa68','left','monospace');text(ctx,'Repeatable contracts fund training, medicine and weapons.',525,377,11,'#aeb9ad','left','monospace');text(ctx,'ENTER ACCEPT · B / ESC CLOSE',480,463,10,'#b6ab8d','center','monospace');
}
function drawCamp(target){
  const ctx=target.ctx,state=target.worldState,rows=campRows(target),row=rows[state.index]||rows[0];panel(ctx,90,48,780,444,.99);text(ctx,'CAMP OF FIVE SHADOWS',118,71,27,'#e7c875');text(ctx,`${target.data.player.silver} silver · RESTED ${target.data.rested?'READY':'NO'}`,118,107,10,'#72d890','left','monospace');
  rows.forEach((item,index)=>{const y=148+index*45;if(index===state.index){ctx.fillStyle='#1c4631';ctx.fillRect(112,y-7,385,35)}text(ctx,item.name,128,y,15,index===state.index?'#fff0bd':'#cec6ae');if(item.member)text(ctx,`BOND ${target.data.bonds[item.member.id]||0}/10`,480,y+3,9,'#7bdc98','right','monospace')});
  text(ctx,row.name,535,155,20,'#f1d489');wrap(ctx,row.detail,535,198,280,23,15,'#ddd4b9',5);text(ctx,'High bonds strengthen party assists and add unique support effects.',535,321,11,'#99b7a1','left','monospace');text(ctx,'ENTER CONFIRM · C / ESC CLOSE',480,463,10,'#b6ab8d','center','monospace');
}
function drawMastery(target){
  const ctx=target.ctx,m=masterySummary(target);panel(ctx,112,52,736,436,.99);text(ctx,'MASTERIES & REPUTATION',140,76,27,'#e7c875');text(ctx,'Victory strengthens the weapon and style used in battle.',140,112,10,'#72d890','left','monospace');
  text(ctx,`${m.kind.toUpperCase()} MASTERY`,145,158,18,'#f1d489');text(ctx,`Tier ${m.weaponTier}/5 · ${m.weapon} victories`,145,190,12,'#d6c9aa','left','monospace');text(ctx,m.style.toUpperCase(),145,241,18,'#f1d489');text(ctx,`Tier ${m.styleTier}/5 · ${m.styleXp} victories`,145,273,12,'#d6c9aa','left','monospace');
  text(ctx,'REPUTATION',505,158,18,'#f1d489');Object.entries(REPUTATION_LABELS).forEach(([key,label],index)=>{const value=target.data.reputation[key]||0;text(ctx,label,505,195+index*36,11,'#b8c4b5','left','monospace');text(ctx,String(value).padStart(2,'0'),795,195+index*36,12,value>=5?'#7ce49a':'#d0b96e','right','monospace')});
  text(ctx,`LOCATIONS DISCOVERED ${target.data.discoveries.length}/${LOCATIONS.length}`,145,348,11,'#8ed8a0','left','monospace');text(ctx,`CONTRACTS COMPLETED ${target.data.contracts.completed}`,145,379,11,'#8ed8a0','left','monospace');text(ctx,'V / ESC CLOSE',480,454,10,'#b6ab8d','center','monospace');
}

addQuestDefinitions();addLivingWorldNpcs();patchGame(game);
globalThis.greenDragonWorld={SIDE_QUESTS,CONTRACTS,ensureWorldData,masteryTier};
