import {LOCATIONS,NPCS,QUESTS,WEAPONS} from './content.js';

const game=globalThis.greenDragonGame;
const enhancements=globalThis.greenDragonEnhancements;
const ACT_THREE_START=LOCATIONS.length;

const ACT_THREE_LOCATIONS=[
  {id:'northern-pass',name:'Northern Star Pass',subtitle:'Snow buries armies, but never their oaths',background:'stage-snow-northern-pass.webp',music:'mountain-theme',danger:4},
  {id:'iron-prayer-monastery',name:'Iron Prayer Monastery',subtitle:'War monks hammer mercy into unyielding forms',background:'stage-snow-iron-prayer.webp',music:'mountain-theme',danger:4},
  {id:'snow-lotus-village',name:'Snow Lotus Village',subtitle:'Medicine gardens bloom beneath the siege smoke',background:'stage-snow-lotus-village.webp',music:'village-theme',danger:3},
  {id:'red-banner-camp',name:'Red Banner War Camp',subtitle:'Three armies wait for one order to cross the border',background:'stage-snow-red-banner.webp',music:'mountain-theme',danger:5},
  {id:'ghost-founder-sanctum',name:'Sanctum of the First Mask',subtitle:'The Ghost Face founder remembers every stolen name',background:'stage-snow-ghost-sanctum.webp',music:'mountain-theme',danger:5},
  {id:'celestial-archive',name:'Celestial Archive',subtitle:'The imperial constellations preserve forbidden bloodlines',background:'stage-snow-celestial-archive.webp',music:'mountain-theme',danger:3},
  {id:'vanished-heir-refuge',name:'Refuge of the Vanished Heir',subtitle:'A prince without a throne keeps watch beside a small fire',background:'stage-snow-heir-refuge.webp',music:'village-theme',danger:3},
  {id:'black-dragon-observatory',name:'Black Dragon Observatory',subtitle:'The regent measures kingdoms beneath a starless sky',background:'stage-snow-black-dragon.webp',music:'mountain-theme',danger:5},
];

const ACT_THREE_QUESTS=[
  {id:'north-star-summons',title:'The Road Beneath the North Star',summary:'Follow the sealed archive map beyond the Jade Court and meet Scout Lan at Northern Star Pass.'},
  {id:'iron-prayer-trial',title:'The Iron Prayer Trial',summary:'Earn the war monks’ standard by defeating Abbot Stone Vein without surrendering to anger.'},
  {id:'snow-lotus-ambush',title:'Lotus Beneath the Avalanche',summary:'Protect Snow Lotus Village and break White Yak General’s siege line.'},
  {id:'red-banner-siege',title:'The Red Banner Decision',summary:'Enter the border war camp and defeat the commander preparing an unlawful invasion.'},
  {id:'founder-without-face',title:'The Founder Without a Face',summary:'Enter the first Ghost Face sanctum and confront the master who created the order of masks.'},
  {id:'celestial-bloodline',title:'The Forbidden Constellation',summary:'Recover Shi-An’s birth record from the Celestial Archive.'},
  {id:'heir-in-exile',title:'The Prince Beside the Fire',summary:'Find the vanished imperial heir and decide whether the northern standards should support him.'},
  {id:'dragon-constellation',title:'The Dragon Constellation Trial',summary:'Defeat the Black Star Abbot and awaken the complete Green Dragon discipline.'},
  {id:'black-dragon-regent',title:'The Black Dragon Regent',summary:'Climb the observatory and defeat Regent Han before he orders the northern war.'},
  {id:'widows-bell',title:'The Bell for the Border Widows',summary:'Recover the monastery bell stolen from families mourning the border dead.'},
  {id:'frozen-medicine',title:'Medicine Beneath the Ice',summary:'Drive the Ice Jackals away from Snow Lotus Village’s winter medicine stores.'},
  {id:'last-standard',title:'The Last Loyal Standard',summary:'Defeat a deserter captain carrying the final banner of the emperor’s lost guard.'},
];

const ACT_THREE_WEAPONS=[
  {id:'iron-prayer-staff',name:'Iron Prayer War Staff',kind:'staff',power:19,price:1250,desc:'A ringed northern staff built to withstand armored cavalry.'},
  {id:'frost-lotus-jian',name:'Frost Lotus Jian',kind:'sword',power:20,price:1420,desc:'A narrow village blade tempered in snowmelt and herbal smoke.'},
  {id:'founder-mask-chain',name:'First Mask Chain',kind:'staff',power:22,price:1700,desc:'The founder’s flexible weapon, adapted to the staff discipline.'},
  {id:'black-dragon-edict',name:'Black Dragon Edict Blade',kind:'sword',power:25,price:2200,desc:'The regent’s ceremonial command blade, heavy with imperial authority.'},
];

const GUIDE={
  'north-star-summons':{location:'northern-pass',npc:'scout-lan',objective:'Meet Scout Lan “Snow Finch” at Northern Star Pass.'},
  'iron-prayer-trial':{location:'iron-prayer-monastery',npc:'abbot-stone-vein',objective:'Defeat Abbot Stone Vein and earn the monastery standard.'},
  'snow-lotus-ambush':{location:'snow-lotus-village',npc:'white-yak-general',objective:'Speak with Healer Ning, then defeat White Yak General.'},
  'red-banner-siege':{location:'red-banner-camp',npc:'crimson-standard',objective:'Question Captain Ruo, then defeat Crimson Standard.'},
  'founder-without-face':{location:'ghost-founder-sanctum',npc:'father-no-face',objective:'Meet Moon Veil, then confront Father No-Face.'},
  'celestial-bloodline':{location:'celestial-archive',npc:'astrologer-luo',objective:'Ask Astrologer Luo to reveal Shi-An’s sealed constellation.'},
  'heir-in-exile':{location:'vanished-heir-refuge',npc:'prince-jian',objective:'Present the three northern standards to Prince Jian.'},
  'dragon-constellation':{location:'black-dragon-observatory',npc:'black-star-abbot',objective:'Defeat the Black Star Abbot beneath the observatory.'},
  'black-dragon-regent':{location:'black-dragon-observatory',npc:'regent-han',objective:'Defeat Regent Han “Black Dragon” before the war order is sent.'},
  'widows-bell':{location:'northern-pass',npc:'bell-thief',objective:'Recover the widows’ bronze bell.'},
  'frozen-medicine':{location:'snow-lotus-village',npc:'ice-jackal',objective:'Defeat the Ice Jackal raiding the medicine stores.'},
  'last-standard':{location:'red-banner-camp',npc:'deserter-captain',objective:'Recover the lost imperial standard.'},
};

const STYLE_ARTS={
  'Iron Prayer Palm':{name:'IRON TEMPLE RESOUNDS',damage:1.18,guard:1.38,knockback:1.18,restoreGuard:18},
  'Snow Lotus Sword':{name:'LOTUS CUTS THE AVALANCHE',damage:1.27,guard:1.14,knockback:1.2,restoreGuard:8},
  'Heavenly Constellation Boxing':{name:'GREEN DRAGON CROSSES HEAVEN',damage:1.38,guard:1.32,knockback:1.34,restoreGuard:14},
};

const BOSS_PROFILES={
  'abbot-stone-vein':{label:'IRON PRAYER',guard:1.5,stamina:1.35,power:1.16},
  'white-yak-general':{label:'AVALANCHE CHARGE',guard:1.3,stamina:1.42,power:1.2},
  'crimson-standard':{label:'RED BANNER COMMAND',guard:1.42,stamina:1.38,power:1.23,chi:80},
  'father-no-face':{label:'FIRST MASK',guard:1.55,stamina:1.48,power:1.27,chi:90},
  'black-star-abbot':{label:'FALLEN CONSTELLATION',guard:1.62,stamina:1.5,power:1.3,chi:100},
  'regent-han':{label:'BLACK DRAGON REGENT',guard:1.75,stamina:1.62,power:1.36,chi:120},
};

const npc=(id,name,x,variant,role,lines,enemyData)=>({id,name,x,variant,role,lines,...(enemyData?{enemy:enemyData}:{})});
const enemy=(name,level,maxHp,power,weapon,reward,boss=false)=>({name,level,maxHp,power,weapon,reward,boss});

const ACT_THREE_NPCS={
  'northern-pass':[
    npc('scout-lan','Scout Lan “Snow Finch”',175,'indigo','quest',['The archive map names three northern standards: monastery, village and loyal guard.','Regent Han is gathering armies beneath a false imperial decree. Win the standards before he wins the north.']),
    npc('widow-qiao','Widow Qiao “Quiet Bell”',485,'ashen','quest',['Bandits stole the bronze bell that names our border dead.','Bring it back before the snow erases the road to their camp.']),
    npc('bell-thief','Bell Thief Gao',780,'crimson','fight',['The dead have no use for bronze. The living can sell it.'],enemy('Bell Thief Gao',10,310,20,'staff',280)),
  ],
  'iron-prayer-monastery':[
    npc('keeper-iron','Keeper Ming “Nine Rings”',180,'gold','quest',['The Iron Prayer standard is not given to the strongest. It is given to the fighter who can remain merciful while winning.']),
    npc('abbot-stone-vein','Abbot Stone Vein',650,'ashen','boss',['Master Shen once crossed this courtyard and refused to kneel to fear.','Show me that his student can strike like iron without becoming iron inside.'],enemy('Abbot Stone Vein',13,520,27,'staff',620,true)),
  ],
  'snow-lotus-village':[
    npc('healer-ning','Healer Ning “Winter Root”',175,'atlas','quest',['White Yak General buried our terraces beneath siege stones.','The medicine gardens survive, but only until his next charge.']),
    npc('medicine-child','Tao “Small Mortar”',410,'gold','quest',['Ice Jackal steals the dried roots before the wounded can receive them.']),
    npc('ice-jackal','Ice Jackal',625,'indigo','fight',['Medicine is worth more than silver during a siege.'],enemy('Ice Jackal',11,345,21,'sword',320)),
    npc('white-yak-general','White Yak General',840,'ashen','boss',['Villages do not decide wars. Generals decide which villages remain.'],enemy('White Yak General',14,560,29,'staff',700,true)),
  ],
  'red-banner-camp':[
    npc('captain-ruo','Captain Ruo “Unbroken Standard”',170,'gold','quest',['The decree ordering invasion carries Regent Han’s seal, not the emperor’s.','Defeat Crimson Standard and the loyal companies will stand down.']),
    npc('old-guardsman-wei','Guardsman Wei “Last Banner”',390,'ashen','quest',['A deserter captain carries the final standard of the emperor’s lost guard. Recover it, and Prince Jian may believe loyal soldiers remain.']),
    npc('deserter-captain','Deserter Captain Mu',610,'indigo','fight',['An old flag cannot feed a living soldier.'],enemy('Deserter Captain Mu',12,390,23,'sword',380)),
    npc('crimson-standard','Commander Du “Crimson Standard”',830,'crimson','boss',['The north needs one command, one banner and one grave for every dissenter.'],enemy('Crimson Standard',15,610,31,'sword',780,true)),
  ],
  'ghost-founder-sanctum':[
    npc('moon-veil-founder','Moon Veil',210,'indigo','quest',['The first mask was made to protect a child the court wanted erased.','Father No-Face later turned that mercy into an order of assassins.']),
    npc('father-no-face','Father No-Face',720,'crimson','boss',['I gave nameless children a purpose. The court merely gave us targets.','You were the first child hidden beneath the Green Dragon star.'],enemy('Father No-Face',16,690,33,'staff',900,true)),
  ],
  'celestial-archive':[
    npc('astrologer-luo','Astrologer Luo “Ink Comet”',260,'gold','quest',['Your birth record was divided across seven star tables. Regent Han feared the Green Dragon constellation because it marks a protector chosen outside the throne.','The same record names Prince Jian as the emperor’s surviving heir.']),
    npc('archive-guardian','Guardian Su “Bronze Compass”',710,'ashen','quest',['The stars do not command virtue. They only reveal where powerful people tried to hide it.']),
  ],
  'vanished-heir-refuge':[
    npc('prince-jian','Prince Jian “Ashen Crown”',310,'atlas','quest',['I abandoned the capital because every faction wanted my blood more than my judgment.','If monastery, village and loyal guard still stand together, I will return—not as conqueror, but as witness.']),
    npc('royal-physician-mei','Physician Mei “Warm Coal”',690,'gold','healer',['A throne can wait. Frostbite cannot. Rest before climbing the observatory.']),
  ],
  'black-dragon-observatory':[
    npc('black-star-abbot','Black Star Abbot',285,'indigo','boss',['Heaven has no dragon. Only men who convince others to see one.','Defeat me, and perhaps your constellation deserves a final witness.'],enemy('Black Star Abbot',17,760,35,'staff',980,true)),
    npc('regent-han','Regent Han “Black Dragon”',760,'crimson','boss',['The vanished heir offers doubt. I offer order. The north will march because history rewards whoever writes first.','Master Shen died protecting your name. I will erase it with the empire watching.'],enemy('Regent Han “Black Dragon”',19,930,39,'sword',1400,true)),
  ],
};

function addUnique(list,entries,key='id'){for(const entry of entries)if(!list.some(item=>item[key]===entry[key]))list.push(entry)}
function installContent(){
  addUnique(LOCATIONS,ACT_THREE_LOCATIONS);addUnique(QUESTS,ACT_THREE_QUESTS);addUnique(WEAPONS,ACT_THREE_WEAPONS);
  for(const [location,entries] of Object.entries(ACT_THREE_NPCS)){NPCS[location]=NPCS[location]||[];addUnique(NPCS[location],entries)}
  if(enhancements?.QUEST_GUIDE)Object.assign(enhancements.QUEST_GUIDE,GUIDE);
  if(enhancements?.STYLE_ARTS)Object.assign(enhancements.STYLE_ARTS,STYLE_ARTS);
}

function ensureActThree(target=game){
  const data=target.data;
  data.actThree={version:1,unlocked:false,complete:false,chapter:1,standards:[],heirTrust:0,warBalance:{monasteries:0,villages:0,loyalists:0},starMap:false,bannerUntil:0,...(data.actThree||{})};
  data.actThree.warBalance={monasteries:0,villages:0,loyalists:0,...(data.actThree.warBalance||{})};
  data.actThree.standards=Array.isArray(data.actThree.standards)?[...new Set(data.actThree.standards)]:[];
  data.reputation={...(data.reputation||{}),northern:Number(data.reputation?.northern)||0};
  data.learnedStyles=[...new Set(['Green Dragon Fist',...(Array.isArray(data.learnedStyles)?data.learnedStyles:[]),data.player.style].filter(Boolean))];
  for(const quest of ACT_THREE_QUESTS)if(!(quest.id in data.quests))data.quests[quest.id]='locked';
  if(data.actTwo?.complete&&!data.actThree.unlocked)unlockActThree(target,false);
  target.actThreeState=target.actThreeState||{mode:null,index:0};
}
function setQuest(target,id,status){target.data.quests[id]=status;if(status==='active'&&target.data.settings?.autoTrack!==false)target.data.trackedQuest=id}
function completeQuest(target,id,nextId,reward=0){if(target.data.quests[id]==='completed')return false;target.data.quests[id]='completed';if(nextId)setQuest(target,nextId,'active');if(reward)target.data.player.silver+=reward;target.questPulse=1.8;target.sound.sfx('quest');target.say(`${QUESTS.find(item=>item.id===id)?.title||'Quest'} completed`,'quest');target.save(true);return true}
function unlockActThree(target=game,travel=true){
  if(!target.data.actThree)ensureActThree(target);
  target.data.actThree.unlocked=true;target.data.actThree.chapter=1;target.data.actThree.bannerUntil=(target.time||0)+4;
  if(target.data.quests['north-star-summons']==='locked')setQuest(target,'north-star-summons','active');
  for(const id of ['widows-bell','frozen-medicine','last-standard'])if(target.data.quests[id]==='locked')target.data.quests[id]='available';
  if(travel){target.data.location='northern-pass';target.data.player.x=80;target.mode='explore';target.locationFlash=2;target.transition=.8}
  target.say('ACT III — CROWN BENEATH SNOW','quest');target.save(true);
}
function addStandard(target,id,faction){if(!target.data.actThree.standards.includes(id))target.data.actThree.standards.push(id);target.data.actThree.warBalance[faction]=(target.data.actThree.warBalance[faction]||0)+1;target.data.reputation.northern=(target.data.reputation.northern||0)+2;target.say(`${id.toUpperCase()} STANDARD WON`,'quest')}
function rewardWeapon(target,id){if(!target.data.ownedWeapons.includes(id))target.data.ownedWeapons.push(id);target.data.player.weapon=id;target.say(`${WEAPONS.find(item=>item.id===id)?.name||id} obtained`,'item')}
function learnStyle(target,name){if(!target.data.learnedStyles.includes(name))target.data.learnedStyles.push(name);target.data.player.style=name;target.say(`${name} learned and equipped`,'quest')}
function canFight(target,id){const q=target.data.quests;if(id==='bell-thief')return q['widows-bell']==='active';if(id==='abbot-stone-vein')return q['iron-prayer-trial']==='active';if(id==='ice-jackal')return q['frozen-medicine']==='active';if(id==='white-yak-general')return q['snow-lotus-ambush']==='active'&&target.data.flags.act3HealerNing;if(id==='deserter-captain')return q['last-standard']==='active';if(id==='crimson-standard')return q['red-banner-siege']==='active'&&target.data.flags.act3CaptainRuo;if(id==='father-no-face')return q['founder-without-face']==='active'&&target.data.flags.act3MoonVeil;if(id==='black-star-abbot')return q['dragon-constellation']==='active';if(id==='regent-han')return q['black-dragon-regent']==='active'&&target.data.actThree.starMap&&target.data.actThree.heirTrust>=1;return true}

function handleTalk(target,npcEntry){
  const id=npcEntry.id,q=target.data.quests;
  if(id==='scout-lan'){if(q['north-star-summons']==='active'){completeQuest(target,'north-star-summons','iron-prayer-trial',220);return}return target.say('Win the three standards before Regent Han gathers the north.','system')}
  if(id==='widow-qiao'){if(q['widows-bell']==='available')setQuest(target,'widows-bell','active');target.say('Bell Thief Gao camps beneath the western cliff.','quest');target.save(true);return}
  if(id==='keeper-iron'){target.say(q['iron-prayer-trial']==='active'?'Abbot Stone Vein waits in the upper courtyard.':'The Iron Prayer standard follows the merciful victor.',q['iron-prayer-trial']==='active'?'quest':'system');return}
  if(id==='healer-ning'){target.data.flags.act3HealerNing=1;target.say('White Yak General prepares another charge beyond the medicine terraces.','quest');target.save(true);return}
  if(id==='medicine-child'){if(q['frozen-medicine']==='available')setQuest(target,'frozen-medicine','active');target.say('Ice Jackal hides beside the frozen herb store.','quest');target.save(true);return}
  if(id==='captain-ruo'){target.data.flags.act3CaptainRuo=1;target.say('Crimson Standard commands the invasion from the eastern command fire.','quest');target.save(true);return}
  if(id==='old-guardsman-wei'){if(q['last-standard']==='available')setQuest(target,'last-standard','active');target.say('Deserter Captain Mu carries the lost loyal standard.','quest');target.save(true);return}
  if(id==='moon-veil-founder'){target.data.flags.act3MoonVeil=1;target.say('Father No-Face waits behind the first unpainted mask.','quest');target.save(true);return}
  if(id==='astrologer-luo'){if(q['celestial-bloodline']==='active'){target.data.actThree.starMap=true;completeQuest(target,'celestial-bloodline','heir-in-exile',400);target.say('The Green Dragon star map reveals Prince Jian’s refuge.','quest');return}target.say('The archive has already spoken your hidden name.','system');return}
  if(id==='archive-guardian'){target.say('A constellation is evidence, not destiny. Your choices remain your own.','system');return}
  if(id==='prince-jian'){if(q['heir-in-exile']==='active'&&target.data.actThree.standards.length>=3){target.data.actThree.heirTrust=Math.max(1,target.data.actThree.heirTrust);completeQuest(target,'heir-in-exile','dragon-constellation',520);target.say('Prince Jian accepts the three northern standards.','quest');return}target.say(`Northern standards: ${target.data.actThree.standards.length}/3.`,'quest');return}
  if(id==='royal-physician-mei'){target.data.player.hp=target.data.player.maxHp;target.data.player.chi=target.data.player.maxChi;target.sound.sfx('heal');target.say('The royal physician restores the party before the final ascent.','save');target.save(true);return}
  if(npcEntry.enemy){if(!canFight(target,id))return target.say('This opponent will not face you yet. Follow the tracked quest.','warning');target.beginFight(npcEntry)}
}

function resolveVictory(target,id){
  if(id==='bell-thief'){completeQuest(target,'widows-bell',null,300);target.data.actThree.heirTrust++;return}
  if(id==='abbot-stone-vein'){completeQuest(target,'iron-prayer-trial','snow-lotus-ambush',620);rewardWeapon(target,'iron-prayer-staff');learnStyle(target,'Iron Prayer Palm');addStandard(target,'monastery','monasteries');target.data.actThree.chapter=2;return}
  if(id==='ice-jackal'){completeQuest(target,'frozen-medicine',null,340);target.data.actThree.heirTrust++;return}
  if(id==='white-yak-general'){completeQuest(target,'snow-lotus-ambush','red-banner-siege',700);rewardWeapon(target,'frost-lotus-jian');addStandard(target,'village','villages');return}
  if(id==='deserter-captain'){completeQuest(target,'last-standard',null,420);target.data.actThree.heirTrust++;return}
  if(id==='crimson-standard'){completeQuest(target,'red-banner-siege','founder-without-face',780);learnStyle(target,'Snow Lotus Sword');addStandard(target,'loyalist','loyalists');target.data.actThree.chapter=3;return}
  if(id==='father-no-face'){completeQuest(target,'founder-without-face','celestial-bloodline',900);rewardWeapon(target,'founder-mask-chain');target.data.actThree.chapter=4;return}
  if(id==='black-star-abbot'){completeQuest(target,'dragon-constellation','black-dragon-regent',1050);learnStyle(target,'Heavenly Constellation Boxing');target.data.actThree.chapter=5;return}
  if(id==='regent-han'){completeQuest(target,'black-dragon-regent',null,1600);rewardWeapon(target,'black-dragon-edict');target.data.actThree.complete=true;target.data.actThree.chapter=6;target.mode='act-three-complete';target.save(true)}
}

function tintAtlas(baseKey,newKey,color,alpha=.4){const source=globalThis.greenDragonAssets?.sprites?.[baseKey];if(!source||typeof document==='undefined'||!document.createElement)return;const canvas=document.createElement('canvas');canvas.width=source.width;canvas.height=source.height;const ctx=canvas.getContext('2d');ctx.drawImage(source,0,0);ctx.globalCompositeOperation='source-atop';ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';globalThis.greenDragonAssets.sprites[newKey]=canvas}
function buildBossArt(){tintAtlas('hermit-reed','abbot-stone-vein','#b8c6ca',.44);tintAtlas('bo','white-yak-general','#d7e4e5',.42);tintAtlas('iron-phoenix','crimson-standard','#9f2235',.46);tintAtlas('ghost-face','father-no-face','#e7e1cf',.32);tintAtlas('novice-jin','black-star-abbot','#333f79',.5);tintAtlas('censor-wei','regent-han','#1a2336',.58);tintAtlas('razor-fang','bell-thief','#7d6844',.35);tintAtlas('needle-crow','ice-jackal','#73a9c6',.42);tintAtlas('laughing-tiger','deserter-captain','#58626d',.36)}
function makeStage(id,draw){if(typeof document==='undefined'||!document.createElement||!globalThis.greenDragonAssets?.stages)return;const canvas=document.createElement('canvas');canvas.width=960;canvas.height=540;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;draw(c);globalThis.greenDragonAssets.stages[id]=canvas}
const fill=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
function mountain(c,x,y,w,h,color){c.fillStyle=color;c.beginPath();c.moveTo(x,y+h);c.lineTo(x+w*.48,y);c.lineTo(x+w,y+h);c.closePath();c.fill()}
function snow(c){for(let i=0;i<90;i++){const x=(i*83)%960,y=(i*47)%410;c.fillStyle=i%3?'#dce8e7':'#ffffff';c.fillRect(x,y,2+(i%2),2+(i%2))}}
function roof(c,x,y,w,color='#28323b'){c.fillStyle=color;c.beginPath();c.moveTo(x-20,y+28);c.lineTo(x+w/2,y);c.lineTo(x+w+20,y+28);c.closePath();c.fill();fill(c,x,y+26,w,8,'#8f3b35')}
function hall(c,x,y,w,h,wall='#665446'){fill(c,x,y+28,w,h-28,wall);roof(c,x,y,w);for(let i=18;i<w-20;i+=42){fill(c,x+i,y+52,15,h-62,'#242324');fill(c,x+i+4,y+56,7,h-70,'#b49b69')}}
function banner(c,x,y,color='#a52e39'){fill(c,x,y,7,160,'#30251d');fill(c,x+7,y+10,56,70,color);c.fillStyle='#e3bd63';c.beginPath();c.moveTo(x+7,y+80);c.lineTo(x+35,y+104);c.lineTo(x+63,y+80);c.fill()}
function buildStages(){
  makeStage('stage-snow-northern-pass.webp',c=>{fill(c,0,0,960,540,'#7d98aa');mountain(c,-80,65,480,300,'#435b68');mountain(c,330,45,520,330,'#526b77');mountain(c,690,90,360,270,'#344a59');fill(c,0,335,960,205,'#d7e0dc');fill(c,0,430,960,110,'#69747a');for(let i=0;i<20;i++)fill(c,i*52,420+(i%3)*9,38,15,'#c9d5d1');banner(c,105,240,'#425c8e');snow(c)});
  makeStage('stage-snow-iron-prayer.webp',c=>{fill(c,0,0,960,540,'#8195a0');mountain(c,-90,80,480,280,'#4c6266');mountain(c,570,65,460,295,'#3e555d');fill(c,0,355,960,185,'#d7ddd6');hall(c,210,105,540,295,'#5c5148');for(let i=0;i<8;i++)fill(c,80+i*110,420,70,18,'#59636a');snow(c)});
  makeStage('stage-snow-lotus-village.webp',c=>{fill(c,0,0,960,540,'#91a8b1');mountain(c,-50,105,390,240,'#57706d');mountain(c,650,95,380,250,'#45605f');fill(c,0,348,960,192,'#dce5df');for(let i=0;i<6;i++){hall(c,40+i*155,250-(i%2)*18,120,125,i%2?'#735843':'#665042');fill(c,65+i*155,385,70,24,'#54715f')}for(let i=0;i<18;i++)fill(c,20+i*54,434+(i%2)*12,22,8,'#8ab6aa');snow(c)});
  makeStage('stage-snow-red-banner.webp',c=>{fill(c,0,0,960,540,'#6f7e88');mountain(c,-70,100,440,260,'#414f57');mountain(c,620,80,410,280,'#35434d');fill(c,0,350,960,190,'#c8cfca');for(let i=0;i<7;i++){fill(c,75+i*140,330,100,85,i%2?'#5e493d':'#483a34');roof(c,75+i*140,305,100,'#2d3339');banner(c,105+i*140,245,i%2?'#a52e39':'#7c2633')}fill(c,0,455,960,85,'#6b5143');snow(c)});
  makeStage('stage-snow-ghost-sanctum.webp',c=>{fill(c,0,0,960,540,'#364653');mountain(c,-80,55,500,315,'#26343c');mountain(c,520,50,500,320,'#1f2d35');fill(c,0,355,960,185,'#9da8a6');hall(c,260,125,440,275,'#403d3a');for(let i=0;i<9;i++){c.fillStyle=i%2?'#d7d0bc':'#9b2d3d';c.beginPath();c.arc(315+i*42,270+(i%2)*10,13,0,Math.PI*2);c.fill()}snow(c)});
  makeStage('stage-snow-celestial-archive.webp',c=>{const g=c.createLinearGradient(0,0,0,540);g.addColorStop(0,'#1f3150');g.addColorStop(1,'#8798a5');fill(c,0,0,960,540,g);for(let i=0;i<55;i++)fill(c,(i*137)%960,(i*61)%280,i%5?2:4,i%5?2:4,i%4?'#d8e7ef':'#e8c96f');fill(c,0,350,960,190,'#d5dcda');hall(c,205,155,550,240,'#535361');for(let i=0;i<7;i++){c.strokeStyle='#d5bb68';c.lineWidth=2;c.beginPath();c.arc(280+i*68,285,23,0,Math.PI*2);c.stroke()}snow(c)});
  makeStage('stage-snow-heir-refuge.webp',c=>{fill(c,0,0,960,540,'#708792');mountain(c,-50,70,430,290,'#465e63');mountain(c,570,70,440,290,'#3a535b');fill(c,0,350,960,190,'#d8e2de');hall(c,340,245,280,150,'#5a493d');fill(c,465,390,30,20,'#4a2c1d');fill(c,472,375,16,20,'#dc7436');for(let i=0;i<8;i++)fill(c,110+i*105,430+(i%2)*14,70,16,'#aebbb7');snow(c)});
  makeStage('stage-snow-black-dragon.webp',c=>{const g=c.createLinearGradient(0,0,0,540);g.addColorStop(0,'#101725');g.addColorStop(1,'#4c5c6e');fill(c,0,0,960,540,g);for(let i=0;i<70;i++)fill(c,(i*151)%960,(i*67)%300,i%6?2:4,i%6?2:4,i%5?'#c7d6e5':'#b53246');mountain(c,-90,120,460,250,'#222d3b');mountain(c,610,100,430,270,'#1b2735');fill(c,0,360,960,180,'#8f999d');hall(c,250,135,460,280,'#31333d');banner(c,180,245,'#20293d');banner(c,770,245,'#1f2737');fill(c,445,78,70,70,'#121724');c.strokeStyle='#b83a4d';c.lineWidth=5;c.beginPath();c.arc(480,112,26,0,Math.PI*2);c.stroke();snow(c)});
}

function panel(ctx,x,y,w,h,alpha=.98){ctx.fillStyle=`rgba(4,10,14,${alpha})`;ctx.fillRect(x,y,w,h);ctx.strokeStyle='#d9bd70';ctx.lineWidth=3;ctx.strokeRect(x+.5,y+.5,w-1,h-1);ctx.strokeStyle='#49636c';ctx.lineWidth=1;ctx.strokeRect(x+7.5,y+7.5,w-15,h-15)}
function text(ctx,value,x,y,size=16,color='#f2ead3',align='left',font='Georgia'){ctx.fillStyle=color;ctx.font=`${size}px ${font}`;ctx.textAlign=align;ctx.textBaseline='top';ctx.fillText(String(value),x,y)}
function wrap(ctx,value,x,y,width,lineHeight=22,size=15,color='#d5d7d0',limit=7){ctx.font=`${size}px Georgia`;ctx.fillStyle=color;ctx.textAlign='left';let line='',rows=[];for(const word of String(value).split(' ')){const next=line?`${line} ${word}`:word;if(ctx.measureText(next).width>width&&line){rows.push(line);line=word}else line=next}if(line)rows.push(line);rows.slice(0,limit).forEach((row,index)=>ctx.fillText(row,x,y+index*lineHeight))}
function drawActThree(target){
  const ctx=target.ctx;if(!ctx||!target.data?.actThree)return;
  if(target.mode==='act-two-complete'){ctx.fillStyle='rgba(3,8,12,.92)';ctx.fillRect(145,417,670,40);text(ctx,'ENTER begins Act III — Crown Beneath Snow',480,429,13,'#8fe6c0','center','monospace')}
  if(target.mode==='explore'&&target.data.actThree.unlocked&&!target.actThreeState.mode&&!target.enhancement?.mode){panel(ctx,598,121,348,35,.84);text(ctx,`NORTH STANDARDS ${target.data.actThree.standards.length}/3 · HEIR TRUST ${target.data.actThree.heirTrust}`,612,132,9,'#b9dce2','left','monospace');text(ctx,'Z WAR COUNCIL',932,132,9,'#80e3b2','right','monospace')}
  if(target.mode==='combat'&&target.combat?.northernStandards){text(ctx,`NORTHERN ALLIANCE ${target.combat.northernStandards}/3`,480,142,9,'#9fe8c2','center','monospace')}
  if(target.actThreeState.mode==='council'){ctx.fillStyle='rgba(0,0,0,.76)';ctx.fillRect(0,0,960,540);panel(ctx,100,52,760,435,.99);text(ctx,'NORTHERN WAR COUNCIL',480,78,31,'#e8cb78','center');text(ctx,`STANDARDS ${target.data.actThree.standards.length}/3 · HEIR TRUST ${target.data.actThree.heirTrust} · NORTHERN RENOWN ${target.data.reputation.northern||0}`,480,123,10,'#89e2b3','center','monospace');const labels=[['MONASTERY','monastery','monasteries'],['VILLAGE','village','villages'],['LOYAL GUARD','loyalist','loyalists']];labels.forEach(([label,id,faction],index)=>{const y=178+index*62,textColor=target.data.actThree.standards.includes(id)?'#91e4b4':'#9da7a5';text(ctx,label,155,y,18,textColor);text(ctx,target.data.actThree.standards.includes(id)?'STANDARD WON':'STANDARD MISSING',785,y+3,11,textColor,'right','monospace');text(ctx,`WAR BALANCE ${target.data.actThree.warBalance[faction]||0}`,785,y+25,9,'#c8b77e','right','monospace')});wrap(ctx,target.data.actThree.starMap?'The Celestial Archive confirms Shi-An’s Green Dragon birth constellation and Prince Jian’s claim.':'The forbidden constellation remains sealed inside the Celestial Archive.',155,382,650,21,14,'#d8d5c7',4);text(ctx,'Z / ESC CLOSE',480,454,10,'#c3b89b','center','monospace')}
  if(target.data.actThree.bannerUntil>(target.time||0)){const remaining=target.data.actThree.bannerUntil-(target.time||0),alpha=Math.max(0,Math.min(1,remaining,4-remaining));ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='rgba(0,0,0,.78)';ctx.fillRect(0,0,960,540);panel(ctx,145,160,670,210,.99);text(ctx,'ACT III',480,188,45,'#8fe6c0','center');text(ctx,'CROWN BENEATH SNOW',480,250,27,'#edcb78','center');text(ctx,'Three northern standards stand between the empire and civil war.',480,310,15,'#d9d6c9','center');ctx.restore()}
  if(target.mode==='act-three-complete'){ctx.fillStyle='rgba(0,0,0,.86)';ctx.fillRect(0,0,960,540);panel(ctx,105,58,750,424,.99);text(ctx,'ACT III COMPLETE',480,87,39,'#8fe6c0','center');text(ctx,'THE NORTH REFUSES TO KNEEL',480,141,24,'#efcc78','center');wrap(ctx,'Regent Han falls before the war decree can leave the observatory. Prince Jian returns with three northern standards, not as a conquering emperor but as the witness who can expose the order that hunted Shi-An since birth. The Green Dragon constellation is no longer a secret. Across the empire, hidden masters, rebel governors and the surviving imperial guard now know Shi-An’s name.',165,206,630,27,18,'#e3d9c2',8);text(ctx,'ENTER returns to the Black Dragon Observatory',480,444,11,'#efd17f','center','monospace')}
}

function patchGame(target){
  ensureActThree(target);
  const baseSave=target.save.bind(target);target.save=function(silent=false){ensureActThree(this);return baseSave(silent)};
  const baseLoad=target.load.bind(target);target.load=function(){const result=baseLoad();ensureActThree(this);return result};
  const baseNew=target.newGame.bind(target);target.newGame=function(){const result=baseNew();ensureActThree(this);return result};
  const basePress=target.press.bind(target);target.press=function(key){if(this.mode==='act-two-complete'&&['Enter','KeyE'].includes(key)){unlockActThree(this,true);return}if(this.mode==='act-three-complete'&&['Enter','KeyE'].includes(key)){this.mode='explore';this.data.location='black-dragon-observatory';this.data.player.x=430;this.save(true);return}if(this.actThreeState.mode==='council'){if(['Escape','KeyZ'].includes(key)){this.actThreeState.mode=null;this.sound.sfx('move');this.save(true)}return}if(key==='KeyZ'&&this.data.actThree.unlocked&&!['combat','dialogue','victory','defeat'].includes(this.mode)){this.actThreeState.mode='council';this.sound.sfx('ok');return}return basePress(key)};
  const baseTravel=target.travel.bind(target);target.travel=function(direction){const current=LOCATIONS.findIndex(item=>item.id===this.data.location),next=current+direction;if(next>=ACT_THREE_START&&!this.data.actThree.unlocked){this.data.player.x=920;this.say('The northern road opens after Censor Wei falls.','warning');return}return baseTravel(direction)};
  const baseAfter=target.afterTalk.bind(target);target.afterTalk=function(npcEntry){if(Object.values(ACT_THREE_NPCS).some(list=>list.some(item=>item.id===npcEntry.id))){handleTalk(this,npcEntry);return}return baseAfter(npcEntry)};
  const baseBegin=target.beginFight.bind(target);target.beginFight=function(npcEntry){baseBegin(npcEntry);const profile=BOSS_PROFILES[npcEntry.id];if(profile&&this.combat){const e=this.combat.enemy;this.combat.enemyProfile=profile.label;e.maxGuard=Math.round(e.maxGuard*(profile.guard||1));e.guard=e.maxGuard;e.maxStamina=Math.round(e.maxStamina*(profile.stamina||1));e.stamina=e.maxStamina;e.power=Math.round((e.power||8)*(profile.power||1));e.chi=Math.max(e.chi,profile.chi||0);if(npcEntry.id==='regent-han')this.combat.timer=135}if(this.combat&&this.data.actThree.unlocked){const standards=this.data.actThree.standards.length;this.combat.northernStandards=standards;this.combat.player.power+=standards;this.combat.player.maxGuard+=standards*5;this.combat.player.guard=this.combat.player.maxGuard;this.combat.player.maxStamina+=standards*4;this.combat.player.stamina=this.combat.player.maxStamina}}
  const baseUpdate=target.update.bind(target);target.update=function(dt){baseUpdate(dt);if(this.mode==='combat'&&this.combat?.npc?.id==='regent-han'&&!this.combat.regentAwakened&&this.combat.enemy.hp<=this.combat.enemy.maxHp*.48){this.combat.regentAwakened=true;this.combat.enemy.power+=6;this.combat.enemy.guard=Math.min(this.combat.enemy.maxGuard,this.combat.enemy.guard+35);this.combat.enemy.stamina=this.combat.enemy.maxStamina;this.flash('#9d263c',.22);this.say('BLACK DRAGON DECREE — SECOND SEAL','warning')}};
  const baseFinish=target.finishResult.bind(target);target.finishResult=function(){const victory=this.mode==='victory',id=this.combat?.npc?.id,result=baseFinish();if(victory&&id)resolveVictory(this,id);return result};
  const previousLoop=target.loop.bind(target);target.loop=function(now){previousLoop(now);drawActThree(this)};
}

installContent();buildBossArt();buildStages();patchGame(game);
globalThis.greenDragonActThree={ACT_THREE_LOCATIONS,ACT_THREE_QUESTS,GUIDE,unlockActThree,ensureActThree,resolveVictory};
