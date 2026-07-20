import {LOCATIONS,NPCS,QUESTS,ITEMS,WEAPONS,FIGHTER_ARCHIVE,WORLD_ARCHIVE,CLANS,STYLES} from './content.js';
import {C,rect,txt,wrap,panel,bar,stage,ambient,fighter,portrait,keyArt} from './art.js';

const W=960,H=540;
const loc=game=>LOCATIONS.find(item=>item.id===game.data.location)||LOCATIONS[0];
const quest=(game,id)=>game.data.quests[id]||'locked';
const shortName=name=>name.split(' “')[0];

export function render(game){
  const context=game.ctx;
  context.save();
  if(game.shake)context.translate((Math.random()-.5)*game.shake,(Math.random()-.5)*game.shake);
  if(game.mode==='title')title(game);
  else if(['combat','victory','defeat'].includes(game.mode))combat(game);
  else if(game.mode==='act-complete')act(game);
  else world(game);
  context.restore();
  screenFx(game);
  if(game.toastTime>0)toast(game);
}

function title(game){
  const context=game.ctx;keyArt(context,game.time);rect(context,0,0,W,H,'rgba(0,0,0,.06)');
  const options=game.hasSave?['CONTINUE','NEW JOURNEY','CHRONICLE','SOUND']:['NEW JOURNEY','CHRONICLE','SOUND'];
  panel(context,48,286,352,204,.94);txt(context,'THE GREEN DRAGON AWAITS',70,302,11,'#68d98a','left','monospace');
  options.forEach((value,index)=>{const y=329+index*39;if(index===game.titleIndex){rect(context,65,y-6,318,32,'#24583a');rect(context,65,y+25,318,2,'#68d98a')}txt(context,(index===game.titleIndex?'◆ ':'  ')+value,84,y,18,index===game.titleIndex?'#fff0bd':'#b6b99f','left','monospace')});
  txt(context,'WASD / ARROWS · ENTER · F FULLSCREEN',224,466,10,'#b4aa87','center','monospace');txt(context,'WEB BUILD · ACT I',932,513,10,'rgba(240,214,155,.72)','right','monospace');
}

function world(game){
  const context=game.ctx,location=loc(game);stage(context,location.background,game.time);ambient(context,location.background,game.time);rect(context,0,0,W,H,'rgba(0,0,0,.03)');
  for(const particle of game.worldParticles){context.globalAlpha=Math.max(0,Math.min(1,particle.life/.35));rect(context,particle.x,particle.y,particle.size,particle.size,particle.color)}context.globalAlpha=1;
  const nearest=game.nearestNpc();
  for(const npc of NPCS[game.data.location]||[]){
    if(game.data.defeated.includes(npc.id))continue;
    const close=npc===nearest&&Math.abs(npc.x-game.data.player.x)<115;
    if(close){context.globalAlpha=.22+.08*Math.sin(game.time*6);context.fillStyle='#7de69a';context.beginPath();context.ellipse(npc.x,452,42,8,0,0,Math.PI*2);context.fill();context.globalAlpha=1}
    fighter(context,{x:npc.x,y:454,variant:npc.variant,sprite:npc.id,dir:npc.x<game.data.player.x?1:-1,action:'idle'},game.time);marker(context,npc,npc.x,286,game.time);txt(context,shortName(npc.name),npc.x,463,11,close?'#fff0bd':'#e5d3aa','center','monospace');
  }
  fighter(context,{...game.data.player,variant:'atlas',sprite:'shi-an',dir:game.facing,action:game.walking?'walk':'idle'},game.time);hud(game);prompt(game);if(game.locationFlash>0)card(game);if(game.mode==='dialogue')dialogue(game);if(game.mode==='menu')menu(game);if(game.mode==='shop')shop(game);if(game.mode==='train')train(game);
}

function marker(context,npc,x,y,time){
  const map={quest:['◆','#f1d27a'],recruit:['+','#74e69a'],shop:['¤','#eac36a'],train:['✦','#8bd6e8'],fight:['!','#ef7b62'],boss:['!!','#f05a52']},item=map[npc.role];if(!item)return;
  const bob=Math.sin(time*4+npc.x*.01)*4;context.globalAlpha=.78+.2*Math.sin(time*5+npc.x);txt(context,item[0],x,y+bob,18,item[1],'center','monospace');context.globalAlpha=1;
}
function labelledBar(context,label,x,y,w,h,value,max,color,align='left'){txt(context,label,align==='left'?x:x+w,y-11,8,'#d5c69e',align,'monospace');bar(context,x,y,w,h,value,max,color)}
function hud(game){
  const context=game.ctx,player=game.data.player;panel(context,14,14,342,99,.91);portrait(context,'Shi-An',24,24,58,67,'atlas');txt(context,`Shi-An   Lv. ${player.level}`,94,22,17,'#f2d487');labelledBar(context,'HP',94,49,242,13,player.hp,player.maxHp,'#bd4438');labelledBar(context,'CHI',94,72,242,9,player.chi,player.maxChi,'#368eb1');txt(context,`${player.exp}/${player.level*100} XP`,94,88,9,'#8fc69a','left','monospace');txt(context,`${player.silver} silver`,336,88,10,'#e5c767','right','monospace');
  const active=QUESTS.find(item=>quest(game,item.id)==='active'||quest(game,item.id)==='available'),pulse=game.questPulse>0?.08*Math.sin(game.time*18):0;panel(context,646,14,300,73,.87+pulse);txt(context,'CURRENT THREAD',663,25,10,'#67d486','left','monospace');txt(context,active?.title||'The road is quiet',663,42,15,'#f2d58e');if(active)wrap(context,active.summary,663,62,264,13,10,'#b9c5b5',1);
}
function prompt(game){const context=game.ctx,npc=game.nearestNpc();if(npc&&Math.abs(npc.x-game.data.player.x)<88){const width=['fight','boss'].includes(npc.role)?190:170;panel(context,game.data.player.x-width/2,302,width,34,.9);txt(context,`[ E ] ${['fight','boss'].includes(npc.role)?'CHALLENGE':'INTERACT'}`,game.data.player.x,311,12,'#fff1bd','center','monospace')}}
function card(game){const context=game.ctx,location=loc(game),alpha=Math.min(1,game.locationFlash);context.save();context.globalAlpha=alpha;panel(context,245,104,470,82,.96);txt(context,location.name,480,118,25,'#f0d184','center');txt(context,location.subtitle,480,151,12,'#9ec4a8','center','monospace');txt(context,`DANGER ${'◆'.repeat(location.danger)}${'◇'.repeat(Math.max(0,4-location.danger))}`,480,169,9,'#d99b6c','center','monospace');context.restore()}
function dialogue(game){const context=game.ctx,d=game.dialogue,npc=d.npc;panel(context,44,346,872,174,.985);portrait(context,npc.name,59,359,110,132,npc.variant);txt(context,npc.name,188,361,20,'#f0cf7e');txt(context,npc.role.toUpperCase(),188,390,10,'#63d083','left','monospace');wrap(context,d.lines[d.index].slice(0,Math.floor(d.reveal)),188,418,698,24,18,'#f1e4c5',4);txt(context,`${d.index+1}/${d.lines.length}`,879,367,9,'#867c65','right','monospace');txt(context,'E / ENTER',883,492,10,'#b5aa88','right','monospace')}

function menu(game){const context=game.ctx,tabs=['INVENTORY','PARTY','QUESTS','MAP','CHRONICLE','CONTROLS'];panel(context,65,42,830,455,.985);tabs.forEach((value,index)=>{if(index===game.menu.tab)rect(context,77+index*133,59,126,34,'#22563a');txt(context,value,140+index*133,69,11,index===game.menu.tab?'#fff2bf':'#9fa995','center','monospace')});[inventory,party,quests,map,chronicle,controls][game.menu.tab](game);txt(context,'Q / E switch tabs · ESC close',860,470,11,'#a9aa91','right','monospace')}
function inventory(game){
  const context=game.ctx,ids=Object.keys(game.data.inventory).filter(id=>game.data.inventory[id]>0);txt(context,'PACK & EQUIPMENT',102,113,24,'#e4c675');txt(context,`Equipped: ${WEAPONS.find(item=>item.id===game.data.player.weapon)?.name||'Bare hands'}`,102,147,14,'#62ce80');if(!ids.length)txt(context,'Your pack is empty.',112,190,16,'#9ba89c');
  ids.forEach((id,index)=>{const item=ITEMS.find(entry=>entry.id===id),y=187+index*45;if(index===game.menu.index%Math.max(1,ids.length))rect(context,95,y-5,700,38,'#18372a');txt(context,`${item?.name||id} × ${game.data.inventory[id]}`,112,y,17,'#f0dab0');txt(context,item?.desc||'',430,y+3,12,'#aab8a8','left','monospace')});txt(context,'ENTER uses selected item',102,423,13,'#c6b27d','left','monospace');
}
function party(game){const context=game.ctx,all=[{name:'Shi-An',variant:'atlas',sprite:'shi-an',style:game.data.player.style},...game.data.party];txt(context,`PARTY ${all.length}/6`,102,113,24,'#e4c675');all.forEach((member,index)=>{const x=103+index*126;portrait(context,member.name,x,159,100,121,member.sprite||member.variant);txt(context,member.style||'Green Dragon Fist',x+50,291,10,'#83ba91','center','monospace')});txt(context,'Keys 1–4 call recruited allies once per duel.',102,374,15,'#bdc8b8')}
function quests(game){const context=game.ctx;txt(context,'QUEST JOURNAL',102,113,24,'#e4c675');QUESTS.forEach((item,index)=>{const status=quest(game,item.id),y=154+index*37,color=status==='completed'?'#64cf81':status==='locked'?'#62665f':'#f0d188';txt(context,`${status==='completed'?'✓':status==='locked'?'·':'◆'} ${item.title}`,110,y,15,color);txt(context,status.toUpperCase(),855,y+2,10,color,'right','monospace')})}
function map(game){
  const context=game.ctx;txt(context,'ROAD OF THE GREEN DRAGON',102,113,24,'#e4c675');context.strokeStyle='#aa8244';context.lineWidth=4;context.beginPath();context.moveTo(145,268);context.lineTo(815,268);context.stroke();
  LOCATIONS.forEach((location,index)=>{const x=145+index*134,current=location.id===game.data.location;context.fillStyle=current?'#4bd17a':'#b88943';context.beginPath();context.arc(x,268,current?13:9,0,Math.PI*2);context.fill();if(current){context.strokeStyle='rgba(90,230,130,.55)';context.lineWidth=2;context.beginPath();context.arc(x,268,19+Math.sin(game.time*5)*3,0,Math.PI*2);context.stroke()}txt(context,location.name.replace(' Monastery','').replace('Whispering ','').replace('Cloud-Breaker ','Cloud '),x,302,10,current?'#83ec9f':'#d7c39a','center','monospace')});txt(context,`${WORLD_ARCHIVE.length} authored location records in the campaign archive.`,102,403,14,'#9fc0a7');
}
function chronicle(game){
  const context=game.ctx;txt(context,'JIANGHU CHRONICLE',102,108,24,'#e4c675');txt(context,`${FIGHTER_ARCHIVE.length} named fighters · ${CLANS.length} clans · ${STYLES.length} styles`,102,141,12,'#65ce82','left','monospace');game.menu.index=Math.max(0,Math.min(FIGHTER_ARCHIVE.length-1,game.menu.index));const start=Math.max(0,Math.min(FIGHTER_ARCHIVE.length-7,game.menu.index-3));
  FIGHTER_ARCHIVE.slice(start,start+7).forEach((item,offset)=>{const index=start+offset,y=174+offset*37;if(index===game.menu.index)rect(context,96,y-4,745,32,'#18372a');txt(context,item.name,110,y,14,'#efd6a4');txt(context,`${item.rank} · ${item.clan}`,825,y+2,10,'#98af9f','right','monospace')});wrap(context,FIGHTER_ARCHIVE[game.menu.index].backstory,102,440,720,18,12,'#bdc8b7',2);
}
function controls(game){
  const context=game.ctx;txt(context,'CONTROLS',102,113,24,'#e4c675');const rows=[['WASD / ARROWS','Move'],['E / ENTER','Interact and confirm'],['M / ESC','Journal / close'],['J / K / L','Punch · kick · weapon'],['I','Chi technique'],['S','Block / tap for perfect parry'],['SPACE','Evade'],['U','Throw / punish guard'],['1–4','Party assist'],['Q','Quick tonic'],['P','Toggle sound'],['F','Fullscreen']];
  rows.forEach((row,index)=>{const column=index>5?1:0,local=index%6,x=120+column*370,y=158+local*38;txt(context,row[0],x,y,13,'#efc96f','left','monospace');txt(context,row[1],x+145,y,13,'#c4ceb8')});
}
function shop(game){const context=game.ctx,stock=[...ITEMS,...WEAPONS.slice(0,5)];panel(context,170,65,620,420,.99);txt(context,'MERCHANT INVENTORY',480,84,25,'#edcc78','center');txt(context,`${game.data.player.silver} silver`,756,91,12,'#6bd687','right','monospace');stock.forEach((item,index)=>{const y=132+index*32;if(index===game.shop.index)rect(context,190,y-4,580,28,'#1d422f');txt(context,item.name,207,y,15,'#f3ddb2');txt(context,String(item.price),744,y+2,13,'#f1c85f','right','monospace')});wrap(context,stock[game.shop.index].desc,205,420,530,18,14,'#b8c8b8',2);txt(context,'ENTER buy/equip · ESC leave',480,458,11,'#a3a78e','center','monospace')}
function train(game){const context=game.ctx,lessons=game.lessons;panel(context,170,75,620,390,.99);txt(context,'TRAINING HALL',480,95,25,'#edcc78','center');lessons.forEach((lesson,index)=>{const y=150+index*48;if(index===game.train.index)rect(context,195,y-6,570,39,'#1d422f');txt(context,`${game.data.flags[lesson[2]]?'✓ ':''}${lesson[0]}`,215,y,17,game.data.flags[lesson[2]]?'#65d184':'#f2dcb1');txt(context,`${lesson[1]} silver`,735,y+2,12,'#edc75e','right','monospace');txt(context,lesson[3],215,y+22,11,'#9db1a0','left','monospace')});txt(context,'Training permanently improves Shi-An.',480,425,12,'#b8bea7','center','monospace')}

function combat(game){
  const context=game.ctx,battle=game.combat,location=loc(game);stage(context,location.background,game.time);ambient(context,location.background,game.time);rect(context,0,456,W,84,'rgba(3,6,5,.6)');
  if(battle){
    fighter(context,battle.player,game.time);fighter(context,battle.enemy,game.time);
    for(const particle of game.particles){const alpha=Math.min(1,particle.life*2.8);context.globalAlpha=alpha;if(particle.kind==='spark'){context.strokeStyle=particle.color;context.lineWidth=2;context.beginPath();context.moveTo(particle.x-particle.vx*.025,particle.y-particle.vy*.025);context.lineTo(particle.x,particle.y);context.stroke()}else rect(context,particle.x,particle.y,particle.size,particle.size,particle.color)}context.globalAlpha=1;
    for(const item of game.floaters){context.globalAlpha=Math.min(1,item.life/.18);txt(context,item.text,item.x,item.y,item.size,item.color,'center','monospace')}context.globalAlpha=1;
    panel(context,14,13,354,112,.92);txt(context,battle.player.name,27,22,19,'#f3d58b');labelledBar(context,'HP',27,50,324,14,battle.player.hp,battle.player.maxHp,'#c34336');labelledBar(context,'CHI',27,75,324,8,battle.player.chi,battle.player.maxChi,'#318eaf');labelledBar(context,'STAMINA',27,94,324,7,battle.player.stamina,battle.player.maxStamina,'#d7a73d');
    panel(context,592,13,354,112,.92);txt(context,battle.enemy.name,932,22,19,'#f3d58b','right');labelledBar(context,'HP',609,50,320,14,battle.enemy.hp,battle.enemy.maxHp,'#b83d33','right');labelledBar(context,'GUARD',609,76,320,8,battle.enemy.guard,battle.enemy.maxGuard,'#79aa78','right');labelledBar(context,'STAMINA',609,95,320,7,battle.enemy.stamina,battle.enemy.maxStamina,'#c59d42','right');
    txt(context,String(Math.max(0,Math.ceil(battle.timer))).padStart(2,'0'),480,22,42,battle.timer<15?'#ff8c6d':'#ffe19a','center','monospace');
    if(battle.combo>1){const grade=battle.combo>=8?'LEGENDARY':battle.combo>=5?'MASTERFUL':battle.combo>=3?'FLOWING':'COMBO';txt(context,`${battle.combo} HIT ${grade}`,480,76,16,battle.combo>=5?'#ffe36f':'#63e58b','center','monospace')}
    if(battle.intro>0){const alpha=Math.min(1,battle.intro*2);context.globalAlpha=alpha;txt(context,battle.intro>.65?'READY':'FIGHT!',480,182,battle.intro>.65?29:48,battle.intro>.65?'#f4d28a':'#72e895','center','monospace');context.globalAlpha=1}
    txt(context,'A/D MOVE · W JUMP · S PARRY/BLOCK · SPACE EVADE · U THROW · J/K/L ATTACK · I CHI',480,513,10,'#ead49b','center','monospace');
  }
  if(game.mode==='victory')overlay(game,'VICTORY',`RANK ${battle.rank}  ·  +${battle.reward} silver  ·  +${battle.xpReward} XP`,'#69df89');
  if(game.mode==='defeat')overlay(game,'DEFEAT','Rise wiser at the roadside shrine.','#d96655');
}
function overlay(game,heading,subheading,color){const context=game.ctx;rect(context,0,0,W,H,'rgba(0,0,0,.68)');panel(context,224,150,512,238,.99);txt(context,heading,480,181,45,color,'center');txt(context,subheading,480,257,17,'#ead7b5','center');if(heading==='VICTORY')txt(context,'HONOR · DISCIPLINE · DESTINY',480,292,11,'#78c98b','center','monospace');else txt(context,'EVERY DEFEAT REVEALS A WEAKNESS',480,292,11,'#c48d82','center','monospace');txt(context,'ENTER / E',480,346,12,'#f0cf82','center','monospace')}
function act(game){const context=game.ctx;keyArt(context,game.time);rect(context,0,0,W,H,'rgba(0,0,0,.8)');panel(context,130,80,700,380,.99);txt(context,'ACT I COMPLETE',480,110,38,'#65db86','center');txt(context,'THE ASHES SPEAK',480,160,25,'#efce76','center');wrap(context,'The Faceless Magistrate was only a blade. The hand that held him sits inside the imperial court—and Master Shen died protecting a secret about Shi-An’s own name. The road now leads toward the Black River escorts, the Ghost Face Opera and a tournament where every clan will be watching.',190,220,580,27,18,'#e5d9bd',7);txt(context,'ENTER returns to free-roam exploration.',480,424,12,'#efd07d','center','monospace')}
function screenFx(game){
  const context=game.ctx;if(game.screenFlash>0){context.save();context.globalAlpha=Math.min(.42,game.screenFlash*4);rect(context,0,0,W,H,game.screenFlashColor);context.restore()}
  if(game.transition>0){const alpha=Math.min(.85,game.transition*1.15);context.save();context.globalAlpha=alpha;rect(context,0,0,W,32,'#020504');rect(context,0,H-32,W,32,'#020504');rect(context,0,0,42,H,'#020504');rect(context,W-42,0,42,H,'#020504');context.restore()}
  const edge='rgba(1,4,3,.3)';rect(context,0,0,W,8,edge);rect(context,0,H-8,W,8,edge);rect(context,0,0,8,H,edge);rect(context,W-8,0,8,H,edge);
}
function toast(game){const context=game.ctx,colors={info:'#fff0bd',quest:'#78e797',warning:'#ffb287',save:'#8bd4e6',recruit:'#78ef9d',item:'#e6cf7a',system:'#c7c8b8'};context.save();context.globalAlpha=Math.min(1,game.toastTime*2);panel(context,270,112,420,49,.97);txt(context,game.toast,480,126,15,colors[game.toastKind]||colors.info,'center','monospace');context.restore()}
