import {ITEMS,LOCATIONS,NPCS,QUESTS,WEAPONS} from './content.js';
import {render} from './render.js';

const game=globalThis.greenDragonGame;
const canvas=document.getElementById('game');
const DEFAULT_SETTINGS={difficulty:'disciple',screenShake:true,screenFlash:true,textSpeed:'standard',highContrast:false,autoTrack:true};
const DIFFICULTIES={
  disciple:{label:'DISCIPLE',hp:.9,power:.9,defence:.95,reward:1},
  master:{label:'MASTER',hp:1,power:1,defence:1,reward:1.12},
  legend:{label:'LEGEND',hp:1.25,power:1.16,defence:1.12,reward:1.35},
};
const STYLE_ARTS={
  'Green Dragon Fist':{name:'COILING DRAGON PALM',damage:1,guard:1.08,knockback:1.08,restoreGuard:8},
  'Shaolin Long Fist':{name:'ARHAT GATE BREAKER',damage:.94,guard:1.38,knockback:1.28,restoreGuard:4},
  'Wu Dang Soft Palm':{name:'EMPTY LAKE RETURN',damage:.88,guard:1.12,knockback:.9,restoreGuard:18},
};
const ENEMY_PROFILES={
  kuo:{label:'IRON BRUISER',power:1.08,guard:1.18,stamina:.9},
  'novice-jin':{label:'SHAOLIN COUNTER',power:.94,guard:1.25,stamina:1.15},
  'ghost-face':{label:'COURT EXECUTIONER',power:1.12,guard:1.12,stamina:1.2,chi:60},
};
const QUEST_GUIDE={
  ashes:{location:'jade-river',npc:'elder-zhao',objective:'Question Elder Zhao about the murder.'},
  footprints:{location:'bamboo-forest',npc:'hunter-fong',objective:'Search the bamboo forest for crimson cloth.'},
  teahouse:{location:'market-street',npc:'tea-lian',objective:'Find the teahouse witness.'},
  ambush:{location:'mountain-trail',npc:'kuo',objective:'Defeat Kuo “Three Knuckles”.'},
  'silent-bell':{location:'shaolin-courtyard',npc:'novice-jin',objective:'Pass the Shaolin trial.'},
  'moonlit-ink':{location:'market-street',npc:'broker-qiu',objective:'Speak with Broker Qiu about the ledger.'},
  faceless:{location:'wudang-walkway',npc:'ghost-face',objective:'Challenge the Faceless Magistrate.'},
};
const READY=new Set(['idle','walk','block']);
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

function ensureData(target=game){
  const data=target.data;
  data.systemsVersion=1;
  data.settings={...DEFAULT_SETTINGS,...(data.settings||{})};
  const current=data.player?.weapon||'training-staff';
  data.ownedWeapons=[...new Set(['training-staff',current,...(Array.isArray(data.ownedWeapons)?data.ownedWeapons:[])])].filter(id=>WEAPONS.some(item=>item.id===id));
  const tracked=QUESTS.find(item=>item.id===data.trackedQuest&&data.quests?.[item.id]!=='locked');
  if(!tracked){
    const active=QUESTS.find(item=>['active','available'].includes(data.quests?.[item.id]));
    data.trackedQuest=active?.id||QUESTS.find(item=>data.quests?.[item.id]!=='locked')?.id||'ashes';
  }
  target.enhancement=target.enhancement||{mode:null,index:0,padPrev:[],padConnected:false,padName:'',synthetic:[]};
  applyDisplaySettings(target);
}

function applyDisplaySettings(target){
  if(canvas?.style)canvas.style.filter=target.data.settings.highContrast?'contrast(1.18) saturate(1.08) brightness(1.04)':'';
}

function openOverlay(target,mode){
  if(['combat','dialogue','victory','defeat','act-complete'].includes(target.mode))return;
  target.enhancement.mode=mode;
  target.enhancement.index=0;
  target.keys={};
  target.sound.sfx('ok');
}

function closeOverlay(target){
  target.enhancement.mode=null;
  target.enhancement.index=0;
  target.sound.sfx('move');
  target.save(true);
}

function questList(target){return QUESTS.filter(item=>target.data.quests[item.id]!=='locked')}
function ownedWeapons(target){return target.data.ownedWeapons.map(id=>WEAPONS.find(item=>item.id===id)).filter(Boolean)}

function guideFor(target){
  const id=target.data.trackedQuest;
  if(id==='five-shadows'){
    if(!target.data.party.some(member=>member.id==='mei-lin'))return {id,location:'jade-river',npc:'mei-lin',objective:'Recruit Mei Lin “Falling Petal”.'};
    if(!target.data.party.some(member=>member.id==='bo'))return {id,location:'market-street',npc:'bo',objective:'Recruit Bo “Iron Belly” Gan.'};
    return {id,objective:'Your first circle of allies is assembled.'};
  }
  const rule=QUEST_GUIDE[id];
  if(!rule)return {id,objective:QUESTS.find(item=>item.id===id)?.summary||'Follow the clues in the journal.'};
  return {id,...rule};
}

function navigationHint(target){
  const guide=guideFor(target);
  if(!guide.location)return {text:guide.objective,direction:''};
  const currentIndex=LOCATIONS.findIndex(item=>item.id===target.data.location);
  const targetIndex=LOCATIONS.findIndex(item=>item.id===guide.location);
  if(currentIndex!==targetIndex)return {text:guide.objective,direction:targetIndex>currentIndex?'TRAVEL →':'← TRAVEL'};
  const source=findNpc(guide.location,guide.npc);
  if(!source)return {text:guide.objective,direction:'NEARBY'};
  const delta=source.x-target.data.player.x;
  if(Math.abs(delta)<95)return {text:guide.objective,direction:'OBJECTIVE HERE'};
  return {text:guide.objective,direction:delta>0?'OBJECTIVE →':'← OBJECTIVE'};
}

function findNpc(location,id){return (NPCS[location]||[]).find(item=>item.id===id)||null}
function difficulty(target){return DIFFICULTIES[target.data.settings.difficulty]||DIFFICULTIES.disciple}

function handleOverlayKey(target,key){
  const state=target.enhancement;
  if(['Escape','KeyO','KeyT','KeyR'].includes(key)){
    if((state.mode==='options'&&key==='KeyO')||(state.mode==='quests'&&key==='KeyT')||(state.mode==='equipment'&&key==='KeyR')||key==='Escape'){closeOverlay(target);return true}
  }
  const rows=state.mode==='options'?6:state.mode==='quests'?questList(target).length:ownedWeapons(target).length;
  if(['ArrowUp','KeyW'].includes(key)){state.index=(state.index+Math.max(1,rows)-1)%Math.max(1,rows);target.sound.sfx('move');return true}
  if(['ArrowDown','KeyS'].includes(key)){state.index=(state.index+1)%Math.max(1,rows);target.sound.sfx('move');return true}
  if(state.mode==='options'&&['ArrowLeft','KeyA','ArrowRight','KeyD','Enter','KeyE'].includes(key)){adjustOption(target,state.index,['ArrowLeft','KeyA'].includes(key)?-1:1);return true}
  if(state.mode==='quests'&&['Enter','KeyE'].includes(key)){
    const item=questList(target)[state.index];
    if(item){target.data.trackedQuest=item.id;target.say(`${item.title} tracked`,'quest');target.sound.sfx('quest');target.save(true)}
    return true;
  }
  if(state.mode==='equipment'&&['Enter','KeyE'].includes(key)){
    const item=ownedWeapons(target)[state.index];
    if(item){target.data.player.weapon=item.id;target.say(`${item.name} equipped`,'item');target.sound.sfx('ok');target.save(true)}
    return true;
  }
  return true;
}

function adjustOption(target,index,direction){
  const settings=target.data.settings;
  if(index===0){const values=['disciple','master','legend'],current=values.indexOf(settings.difficulty);settings.difficulty=values[(current+direction+values.length)%values.length]}
  if(index===1)settings.screenShake=!settings.screenShake;
  if(index===2)settings.screenFlash=!settings.screenFlash;
  if(index===3){const values=['standard','fast','instant'],current=values.indexOf(settings.textSpeed);settings.textSpeed=values[(current+direction+values.length)%values.length]}
  if(index===4)settings.highContrast=!settings.highContrast;
  if(index===5)settings.autoTrack=!settings.autoTrack;
  applyDisplaySettings(target);
  target.sound.sfx('ok');
  target.save(true);
}

function pollGamepad(target){
  if(typeof navigator==='undefined'||typeof navigator.getGamepads!=='function')return;
  const pad=[...navigator.getGamepads()].find(Boolean);
  const state=target.enhancement;
  state.padConnected=!!pad;
  state.padName=pad?.id||'';
  const synthetic=[];
  if(!pad){state.padPrev=[];return}
  const axis=pad.axes?.[0]||0;
  if(axis<-.35||pad.buttons?.[14]?.pressed)synthetic.push('KeyA');
  if(axis>.35||pad.buttons?.[15]?.pressed)synthetic.push('KeyD');
  if((pad.axes?.[1]||0)<-.55||pad.buttons?.[12]?.pressed)synthetic.push('KeyW');
  if(pad.buttons?.[4]?.pressed)synthetic.push('KeyS');
  for(const key of synthetic)if(!target.keys[key]){target.keys[key]=2;state.synthetic.push(key)}
  const mapping=[
    [0,()=>target.mode==='combat'?'KeyJ':'KeyE'],[1,()=>target.mode==='combat'?'KeyK':'Escape'],[2,()=>target.mode==='combat'?'KeyL':'KeyR'],
    [3,()=>target.mode==='combat'?'KeyI':'KeyT'],[5,()=>target.mode==='combat'?'Space':'KeyO'],[6,()=>target.mode==='combat'?'KeyU':'KeyQ'],
    [7,()=>target.mode==='combat'?'Digit1':'KeyM'],[8,()=> 'KeyO'],[9,()=> 'KeyM'],
  ];
  for(const [button,resolve] of mapping){
    const pressed=!!pad.buttons?.[button]?.pressed;
    if(pressed&&!state.padPrev[button])target.press(resolve());
    state.padPrev[button]=pressed;
  }
}

function clearSynthetic(target){
  const state=target.enhancement;
  for(const key of state.synthetic)if(target.keys[key]===2)delete target.keys[key];
  state.synthetic=[];
}

function patchGame(target){
  ensureData(target);
  const baseSave=target.save.bind(target);
  target.save=function(silent=false){ensureData(this);return baseSave(silent)};
  const baseLoad=target.load.bind(target);
  target.load=function(){const result=baseLoad();ensureData(this);this.save(true);return result};
  const baseNewGame=target.newGame.bind(target);
  target.newGame=function(){const result=baseNewGame();ensureData(this);this.save(true);return result};
  const baseCompleteQuest=target.completeQuest.bind(target);
  target.completeQuest=function(id,nextId,reward=0){const result=baseCompleteQuest(id,nextId,reward);if(result&&nextId&&this.data.settings.autoTrack){this.data.trackedQuest=nextId;this.save(true)}return result};
  const baseSetQuest=target.setQuest.bind(target);
  target.setQuest=function(id,status){baseSetQuest(id,status);if(status==='active'&&this.data.settings.autoTrack){const current=this.data.quests[this.data.trackedQuest];if(!current||['locked','completed'].includes(current))this.data.trackedQuest=id}};
  const basePress=target.press.bind(target);
  target.press=function(key){
    if(this.enhancement.mode)return handleOverlayKey(this,key);
    if(key==='KeyT'){openOverlay(this,'quests');return}
    if(key==='KeyR'){openOverlay(this,'equipment');return}
    if(key==='KeyO'){openOverlay(this,'options');return}
    return basePress(key);
  };
  const baseUpdate=target.update.bind(target);
  target.update=function(dt){
    const before=this.dialogue?.reveal||0;baseUpdate(dt);
    if(this.mode==='dialogue'&&this.dialogue){if(this.data.settings.textSpeed==='fast')this.dialogue.reveal+=(this.dialogue.reveal-before);if(this.data.settings.textSpeed==='instant')this.dialogue.reveal=999}
  };
  target.shopPress=function(key){
    const stock=[...ITEMS,...WEAPONS.slice(0,5)];
    if(key==='Escape'){this.mode='explore';return}
    if(['ArrowUp','KeyW'].includes(key))this.shop.index=(this.shop.index+stock.length-1)%stock.length;
    if(['ArrowDown','KeyS'].includes(key))this.shop.index=(this.shop.index+1)%stock.length;
    if(!['Enter','KeyE'].includes(key))return;
    const item=stock[this.shop.index];
    if('kind'in item){
      if(this.data.ownedWeapons.includes(item.id)){this.data.player.weapon=item.id;this.say(`${item.name} equipped`,'item');this.sound.sfx('ok');this.save(true);return}
      if(this.data.player.silver<item.price)return this.say('Not enough silver.','warning');
      this.data.player.silver-=item.price;this.data.ownedWeapons.push(item.id);this.data.player.weapon=item.id;this.say(`${item.name} purchased and equipped`,'item');
    }else{
      if(this.data.player.silver<item.price)return this.say('Not enough silver.','warning');
      this.data.player.silver-=item.price;this.data.inventory[item.id]=(this.data.inventory[item.id]||0)+1;this.say(`${item.name} purchased.`,'item');
    }
    this.sound.sfx('coin');this.save(true);
  };
  const baseBeginFight=target.beginFight.bind(target);
  target.beginFight=function(npc){
    baseBeginFight(npc);const battle=this.combat,mode=difficulty(this),profile=ENEMY_PROFILES[npc.id]||{label:'JIANGHU FIGHTER',power:1,guard:1,stamina:1};
    battle.difficulty=mode.label;battle.enemyProfile=profile.label;
    battle.enemy.maxHp=Math.round(battle.enemy.maxHp*mode.hp);battle.enemy.hp=battle.enemy.maxHp;
    battle.enemy.power=Math.max(1,Math.round((battle.enemy.power||8)*mode.power*(profile.power||1)));
    battle.enemy.defence=Math.max(1,Math.round((battle.enemy.defence||2)*mode.defence));
    battle.enemy.maxGuard=Math.round(battle.enemy.maxGuard*(profile.guard||1));battle.enemy.guard=battle.enemy.maxGuard;
    battle.enemy.maxStamina=Math.round(battle.enemy.maxStamina*(profile.stamina||1));battle.enemy.stamina=battle.enemy.maxStamina;
    battle.enemy.chi=Math.max(battle.enemy.chi,profile.chi||0);
    battle.reward=Math.round(battle.reward*mode.reward);battle.xpReward=Math.round(battle.xpReward*mode.reward);
  };
  const baseAttack=target.attack.bind(target);
  target.attack=function(fighter,action){const result=baseAttack(fighter,action);if(result&&action==='chi'){fighter.technique=STYLE_ARTS[fighter.style]||STYLE_ARTS['Green Dragon Fist'];this.floatText(fighter.technique.name,fighter.x+fighter.dir*28,fighter.y-176,'#79f0a0',13)}return result};
  const baseHit=target.hit.bind(target);
  target.hit=function(victim,damage,byPlayer,attacker,spec){
    if(attacker?.action==='chi'&&attacker.technique){const art=attacker.technique;damage=Math.max(1,Math.round(damage*art.damage));spec={...spec,guard:Math.round((spec.guard||damage*2)*art.guard),knockback:Math.round((spec.knockback||30)*art.knockback)};attacker.guard=Math.min(attacker.maxGuard,attacker.guard+(art.restoreGuard||0))}
    return baseHit(victim,damage,byPlayer,attacker,spec);
  };
  const baseAi=target.ai.bind(target);
  target.ai=function(dt){
    const battle=this.combat,enemy=battle?.enemy,player=battle?.player;if(!enemy||!player)return baseAi(dt);const distance=Math.abs(enemy.x-player.x),ready=READY.has(enemy.action)&&enemy.stun<=0;
    if(ready&&battle.enemyProfile==='SHAOLIN COUNTER'&&!READY.has(player.action)&&distance<125&&enemy.guard>20&&Math.random()<dt*.9){enemy.block=true;enemy.wasBlocking=false;enemy.action='block';return}
    if(ready&&battle.enemyProfile==='IRON BRUISER'&&player.block&&distance<82&&Math.random()<dt*.85){this.throwFighter(enemy,player,false);return}
    if(ready&&battle.enemyProfile==='COURT EXECUTIONER'&&enemy.chi>=30&&distance<170&&Math.random()<dt*.65){this.attack(enemy,'chi');return}
    return baseAi(dt);
  };
  target.loop=function(now){
    const dt=Math.min(.034,(now-this.last)/1000);this.last=now;this.time+=dt;pollGamepad(this);
    if(!this.enhancement.mode)this.update(dt);
    const storedShake=this.shake,storedFlash=this.screenFlash;
    if(!this.data.settings.screenShake)this.shake=0;if(!this.data.settings.screenFlash)this.screenFlash=0;
    render(this);drawEnhancements(this);
    this.shake=storedShake;this.screenFlash=storedFlash;clearSynthetic(this);
    requestAnimationFrame(time=>this.loop(time));
  };
}

function panel(ctx,x,y,w,h,alpha=.97){ctx.fillStyle=`rgba(4,12,9,${alpha})`;ctx.fillRect(x,y,w,h);ctx.strokeStyle='#e0b963';ctx.lineWidth=3;ctx.strokeRect(x+.5,y+.5,w-1,h-1);ctx.strokeStyle='#31563f';ctx.lineWidth=1;ctx.strokeRect(x+7.5,y+7.5,w-15,h-15)}
function text(ctx,value,x,y,size=16,color='#f6e8c4',align='left'){ctx.fillStyle=color;ctx.font=`${size}px Georgia`;ctx.textAlign=align;ctx.textBaseline='top';ctx.fillText(String(value),x,y)}
function mono(ctx,value,x,y,size=12,color='#d7c9a5',align='left'){ctx.fillStyle=color;ctx.font=`${size}px monospace`;ctx.textAlign=align;ctx.textBaseline='top';ctx.fillText(String(value),x,y)}
function wrapped(ctx,value,x,y,width,lineHeight=20,size=15,color='#d8d2bb',limit=5){ctx.font=`${size}px Georgia`;ctx.fillStyle=color;ctx.textAlign='left';let line='',rows=[];for(const word of String(value).split(' ')){const next=line?`${line} ${word}`:word;if(ctx.measureText(next).width>width&&line){rows.push(line);line=word}else line=next}if(line)rows.push(line);rows.slice(0,limit).forEach((row,index)=>ctx.fillText(row,x,y+index*lineHeight))}

function drawEnhancements(target){
  const ctx=target.ctx;
  if(target.mode==='title'){mono(ctx,'T QUESTS  ·  R ARMORY  ·  O OPTIONS',55,505,10,'#8bd3a0');if(target.enhancement.padConnected)mono(ctx,'GAMEPAD READY',905,488,10,'#78e797','right')}
  if(target.mode==='explore'&&!target.enhancement.mode)drawGuide(target);
  if(target.mode==='combat'&&target.combat){mono(ctx,`${target.combat.difficulty} · ${target.combat.enemyProfile}`,931,111,9,'#d8ba72','right')}
  if(target.enhancement.mode){ctx.fillStyle='rgba(0,0,0,.68)';ctx.fillRect(0,0,960,540);if(target.enhancement.mode==='options')drawOptions(target);if(target.enhancement.mode==='quests')drawQuestTracker(target);if(target.enhancement.mode==='equipment')drawEquipment(target)}
}

function drawGuide(target){
  const ctx=target.ctx,hint=navigationHint(target),quest=QUESTS.find(item=>item.id===target.data.trackedQuest);panel(ctx,646,91,300,43,.89);mono(ctx,hint.direction||'TRACKED',661,101,9,'#72df91');text(ctx,quest?.title||'No tracked quest',661,113,12,'#f0d087');mono(ctx,'T',932,102,9,'#8fa897','right');
}

function drawOptions(target){
  const ctx=target.ctx,s=target.data.settings,state=target.enhancement,diff=difficulty(target);panel(ctx,180,58,600,426,.99);text(ctx,'JOURNEY OPTIONS',480,79,28,'#e7c875','center');mono(ctx,'ACCESSIBILITY · DIFFICULTY · INPUT',480,113,10,'#75d592','center');
  const rows=[['Difficulty',diff.label],['Screen shake',s.screenShake?'ON':'OFF'],['Screen flashes',s.screenFlash?'ON':'OFF'],['Dialogue speed',s.textSpeed.toUpperCase()],['High contrast',s.highContrast?'ON':'OFF'],['Auto-track quests',s.autoTrack?'ON':'OFF']];
  rows.forEach((row,index)=>{const y=153+index*44;if(index===state.index){ctx.fillStyle='#1c4631';ctx.fillRect(207,y-7,546,34)}text(ctx,row[0],224,y,17,index===state.index?'#fff0bd':'#d8d0b7');mono(ctx,`‹  ${row[1]}  ›`,728,y+3,12,index===state.index?'#79eca0':'#b9a66f','right')});
  mono(ctx,target.enhancement.padConnected?`GAMEPAD: ${target.enhancement.padName.slice(0,44)}`:'GAMEPAD: connect any standard controller',224,428,10,target.enhancement.padConnected?'#78e797':'#8f9a91');mono(ctx,'ARROWS CHANGE · ENTER CONFIRM · O / ESC CLOSE',480,454,10,'#b6ab8d','center');
}

function drawQuestTracker(target){
  const ctx=target.ctx,list=questList(target),state=target.enhancement,item=list[state.index]||list[0],status=item?target.data.quests[item.id]:'locked',guide=item?guideFor({...target,data:{...target.data,trackedQuest:item.id}}):null;panel(ctx,85,48,790,444,.99);text(ctx,'QUEST TRACKER',112,70,27,'#e7c875');mono(ctx,'SELECT A THREAD TO PIN TO THE HUD',112,105,10,'#75d592');
  list.forEach((entry,index)=>{const y=140+index*34;if(index===state.index){ctx.fillStyle='#1c4631';ctx.fillRect(105,y-5,355,28)}const tracked=entry.id===target.data.trackedQuest;mono(ctx,`${tracked?'◆':'·'} ${entry.title}`,118,y,11,tracked?'#79eca0':index===state.index?'#fff0bd':'#b9b39e');mono(ctx,target.data.quests[entry.id].toUpperCase(),447,y,9,target.data.quests[entry.id]==='completed'?'#69cf84':'#d4b86e','right')});
  if(item){text(ctx,item.title,500,142,20,'#f1d489');mono(ctx,status.toUpperCase(),820,147,10,status==='completed'?'#69cf84':'#78df96','right');wrapped(ctx,item.summary,500,184,320,22,15,'#ddd4b9',5);mono(ctx,'CURRENT OBJECTIVE',500,293,10,'#72d890');wrapped(ctx,guide?.objective||item.summary,500,313,320,21,14,'#f0dfbd',4);const location=LOCATIONS.find(entry=>entry.id===guide?.location);mono(ctx,location?`DESTINATION: ${location.name.toUpperCase()}`:'DESTINATION: FOLLOW THE JOURNAL',500,401,10,'#c4a966')}
  mono(ctx,'ENTER TRACK · T / ESC CLOSE',480,463,10,'#b6ab8d','center');
}

function drawEquipment(target){
  const ctx=target.ctx,list=ownedWeapons(target),state=target.enhancement,item=list[state.index]||list[0],equipped=target.data.player.weapon;panel(ctx,98,52,764,436,.99);text(ctx,'GREEN DRAGON ARMORY',126,74,27,'#e7c875');mono(ctx,'OWNED WEAPONS · ENTER TO EQUIP',126,108,10,'#75d592');
  list.forEach((weapon,index)=>{const y=145+index*42;if(index===state.index){ctx.fillStyle='#1c4631';ctx.fillRect(118,y-6,360,34)}text(ctx,weapon.name,132,y,16,weapon.id===equipped?'#79eca0':index===state.index?'#fff0bd':'#cbc3a9');mono(ctx,weapon.id===equipped?'EQUIPPED':weapon.kind.toUpperCase(),462,y+4,9,weapon.id===equipped?'#79eca0':'#a59368','right')});
  if(item){text(ctx,item.name,520,148,22,'#f1d489');mono(ctx,`${item.kind.toUpperCase()} · POWER ${item.power}`,520,185,11,'#72d890');wrapped(ctx,item.desc,520,220,286,23,15,'#ddd4b9',5);const current=WEAPONS.find(entry=>entry.id===equipped),delta=item.power-(current?.power||0);mono(ctx,`POWER CHANGE: ${delta>=0?'+':''}${delta}`,520,350,11,delta>0?'#79eca0':delta<0?'#e68a72':'#c8b77e');mono(ctx,`STYLE: ${target.data.player.style.toUpperCase()}`,520,383,10,'#b9a66f')}
  mono(ctx,'ENTER EQUIP · R / ESC CLOSE',480,459,10,'#b6ab8d','center');
}

patchGame(game);
globalThis.greenDragonEnhancements={DEFAULT_SETTINGS,DIFFICULTIES,STYLE_ARTS,QUEST_GUIDE,ensureData};
