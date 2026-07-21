import {LOCATIONS,NPCS,QUESTS,WEAPONS} from './content.js';

const game=globalThis.greenDragonGame;
const enhancements=globalThis.greenDragonEnhancements;
const ACT_TWO_START=LOCATIONS.length;

const ACT_TWO_LOCATIONS=[
  {id:'black-river-docks',name:'Black River Docks',subtitle:'Where escort seals vanish beneath rain-black water',background:'stage-river-black-docks.webp',music:'mountain-theme',danger:3},
  {id:'black-river-escort',name:'Black River Escort Agency',subtitle:'Oaths, locked ledgers and sabers above the gate',background:'stage-market-black-river-escort.webp',music:'village-theme',danger:2},
  {id:'willow-ferry',name:'Willow Ferry Village',subtitle:'Every passenger carries a secret across the mist',background:'stage-river-willow-ferry.webp',music:'village-theme',danger:2},
  {id:'ghost-opera-quarter',name:'Ghost Face Opera Quarter',subtitle:'Painted smiles hide the court’s oldest knives',background:'stage-market-ghost-opera.webp',music:'village-theme',danger:3},
  {id:'ghost-opera-backstage',name:'Ghost Face Backstage',subtitle:'Behind the curtain, every mask has a second face',background:'stage-shaolin-ghost-backstage.webp',music:'mountain-theme',danger:4},
  {id:'five-clan-council',name:'Five-Clan Council Terrace',subtitle:'The jianghu gathers where five banners meet the clouds',background:'stage-wudang-five-clan.webp',music:'mountain-theme',danger:3},
  {id:'dragon-gate-arena',name:'Dragon Gate Tournament',subtitle:'Reputation is weighed in bruises before ten thousand eyes',background:'stage-mountain-dragon-gate.webp',music:'mountain-theme',danger:4},
  {id:'imperial-jade-court',name:'Imperial Jade Court',subtitle:'The conspiracy finally speaks with its own voice',background:'stage-wudang-jade-court.webp',music:'mountain-theme',danger:4},
];

const ACT_TWO_QUESTS=[
  {id:'black-river-summons',title:'The Black River Summons',summary:'Meet Captain Yan at the docks and learn why Master Shen’s seal was found on a murdered courier.'},
  {id:'broken-escort-seal',title:'The Broken Escort Seal',summary:'Question Clerk Pei, then defeat Needle Crow before the stolen convoy ledger disappears.'},
  {id:'ferry-of-whispers',title:'The Ferry of Whispers',summary:'Follow the surviving courier’s route to Willow Ferry and question Ferrymaster Yun.'},
  {id:'masks-behind-masks',title:'Masks Behind Masks',summary:'Enter the Ghost Face Opera and expose the assassin hiding behind the Crimson Mask.'},
  {id:'five-clan-council',title:'Five Banners, One Lie',summary:'Earn the testimony of Shaolin, Wu Dang and the Beggar Brotherhood before the council votes.'},
  {id:'dragon-gate-qualifier',title:'The Jade Mantis',summary:'Enter the Dragon Gate Tournament and defeat Jade Mantis in the opening round.'},
  {id:'dragon-gate-semifinal',title:'The Laughing Tiger',summary:'Break Laughing Tiger’s relentless pressure to reach the championship duel.'},
  {id:'dragon-gate-final',title:'Iron Phoenix Ascendant',summary:'Defeat Mistress Bai, the unbeaten Iron Phoenix, and claim the court invitation.'},
  {id:'jade-court-truth',title:'The Jade Viper’s Court',summary:'Recover the imperial archive seal and confront Censor Wei, architect of Master Shen’s murder.'},
  {id:'river-orphans',title:'Rice for the River Orphans',summary:'Drive Salt Shark’s collectors away from the children living beneath Black River pier nine.'},
  {id:'painted-fan',title:'The Fan That Remembered',summary:'Recover an opera fan containing the names of assassins hired by the imperial court.'},
  {id:'old-pine-debt',title:'Old Pine’s Last Debt',summary:'Grant Old Pine Spear one honorable duel before he gives the council his testimony.'},
];

const ACT_TWO_WEAPONS=[
  {id:'black-river-dao',name:'Black River Crescent Dao',kind:'sword',power:13,price:520,desc:'A broad escort saber whose weight rewards committed counterattacks.'},
  {id:'ghost-lantern-chain',name:'Ghost Lantern Chain',kind:'staff',power:14,price:660,desc:'A flexible opera weapon represented through the staff combat discipline.'},
  {id:'phoenix-jian',name:'Iron Phoenix Jian',kind:'sword',power:16,price:820,desc:'Mistress Bai’s balanced tournament blade, quick at the point and heavy at the guard.'},
  {id:'jade-viper-fang',name:'Jade Viper Fang',kind:'sword',power:18,price:1100,desc:'The censor’s ceremonial blade, sharpened for executions rather than ceremony.'},
];

const GUIDE={
  'black-river-summons':{location:'black-river-docks',npc:'captain-yan',objective:'Report to Captain Yan “Stone Oar” at Black River Docks.'},
  'broken-escort-seal':{location:'black-river-docks',npc:'needle-crow',objective:'Question Clerk Pei, then defeat Needle Crow.'},
  'ferry-of-whispers':{location:'willow-ferry',npc:'ferrymaster-yun',objective:'Question Ferrymaster Yun about the masked passengers.'},
  'masks-behind-masks':{location:'ghost-opera-backstage',npc:'crimson-mask',objective:'Meet Moon Veil, then confront the Crimson Mask backstage.'},
  'five-clan-council':{location:'five-clan-council',npc:'grandmaster-tao',objective:'Win the support of three clan delegates and return to Grandmaster Tao.'},
  'dragon-gate-qualifier':{location:'dragon-gate-arena',npc:'jade-mantis',objective:'Defeat Jade Mantis in the tournament qualifier.'},
  'dragon-gate-semifinal':{location:'dragon-gate-arena',npc:'laughing-tiger',objective:'Defeat Laughing Tiger in the semifinal.'},
  'dragon-gate-final':{location:'dragon-gate-arena',npc:'iron-phoenix',objective:'Defeat Iron Phoenix in the final.'},
  'jade-court-truth':{location:'imperial-jade-court',npc:'censor-wei',objective:'Recover the archive seal, then confront Censor Wei.'},
  'river-orphans':{location:'black-river-docks',npc:'salt-shark',objective:'Defeat Salt Shark at pier nine.'},
  'painted-fan':{location:'ghost-opera-backstage',npc:'red-sleeve',objective:'Recover the witness fan from Red Sleeve.'},
  'old-pine-debt':{location:'five-clan-council',npc:'old-pine-spear',objective:'Grant Old Pine Spear an honorable duel.'},
};

const STYLE_ARTS={
  'Black River Saber':{name:'BLACK TIDE CRESCENT',damage:1.12,guard:1.15,knockback:1.35,restoreGuard:4},
  'Ghost Lantern Steps':{name:'LANTERN WITHOUT SHADOW',damage:.96,guard:1.08,knockback:1.04,restoreGuard:16},
  'Five Banners Fist':{name:'FIVE BANNERS DESCEND',damage:1.2,guard:1.28,knockback:1.22,restoreGuard:10},
};

const BOSS_PROFILES={
  'needle-crow':{label:'NEEDLE STORM',guard:1.08,stamina:1.18,power:1.05},
  'crimson-mask':{label:'OPERA ASSASSIN',guard:1.2,stamina:1.16,power:1.1,chi:60},
  'jade-mantis':{label:'MANTIS COUNTER',guard:1.28,stamina:1.12,power:1.02},
  'laughing-tiger':{label:'TIGER PRESSURE',guard:1.05,stamina:1.32,power:1.12},
  'iron-phoenix':{label:'PHOENIX CHAMPION',guard:1.35,stamina:1.24,power:1.16,chi:70},
  'censor-wei':{label:'JADE VIPER',guard:1.4,stamina:1.3,power:1.2,chi:80},
};

const npc=(id,name,x,variant,role,lines,enemyData)=>({id,name,x,variant,role,lines,...(enemyData?{enemy:enemyData}:{})});
const enemy=(name,level,maxHp,power,weapon,reward,boss=false)=>({name,level,maxHp,power,weapon,reward,boss});

const ACT_TWO_NPCS={
  'black-river-docks':[
    npc('captain-yan','Captain Yan “Stone Oar”',170,'gold','quest',['Master Shen once carried our highest escort seal. Three nights ago that seal was found beside a dead imperial courier.','The killer fled with our convoy ledger. Clerk Pei saw the thief before the rain erased the tracks.']),
    npc('clerk-pei','Clerk Pei “Counting Rain”',365,'indigo','quest',['The thief wore crow feathers beneath a boatman’s cloak. He called himself Needle Crow.','He waits by the eastern crane for a buyer from the Ghost Face Opera.']),
    npc('orphan-mei','Mei “Little Bowl”',545,'atlas','quest',['Salt Shark takes half the rice meant for pier nine. We hide what remains beneath the old ferry rope.','Please do not tell him I asked a wandering hero for help.']),
    npc('salt-shark','Salt Shark',710,'ashen','fight',['Pier nine belongs to whoever has the fists to collect its rent.'],enemy('Salt Shark',5,175,12,'staff',170)),
    npc('needle-crow','Needle Crow',875,'indigo','boss',['One dead master, one stolen seal, and now one curious orphan. The court pays well for clean endings.'],enemy('Needle Crow',6,230,15,'sword',260,true)),
  ],
  'black-river-escort':[
    npc('madam-luo','Madam Luo “Gate of Sabers”',220,'crimson','train',['An escort survives by reading intention before steel leaves the sheath.','Bring back our stolen ledger and I will teach you the Black River Saber.']),
    npc('wounded-courier','Courier Deng “Half a Map”',510,'ashen','quest',['The convoy did not die at the docks. We were betrayed at Willow Ferry.','A woman in an opera mask paid the ferryman with an imperial jade token.']),
    npc('quartermaster-shao','Quartermaster Shao',790,'gold','shop',['Our best weapons are not sold. They are earned by returning alive.']),
  ],
  'willow-ferry':[
    npc('ferrymaster-yun','Ferrymaster Yun “Mist Oar”',270,'ashen','quest',['Six masked passengers crossed before dawn. None spoke, but one hummed the funeral aria of the Ghost Face Opera.','Their leader carried a crimson mask and a court archive seal.']),
    npc('widow-fan','Widow Fan “Willow Lantern”',620,'indigo','quest',['The river remembers every body. It also remembers every boat that carried a murderer upstream.']),
  ],
  'ghost-opera-quarter':[
    npc('moon-veil','Moon Veil',210,'indigo','quest',['The Ghost Face Opera was once theatre. Now the court uses our masks to hire killers without names.','The Crimson Mask rehearses alone backstage. Enter through the prop corridor when the third gong sounds.']),
    npc('prop-master-du','Prop Master Du “Paper Moon”',505,'gold','quest',['A painted fan vanished from my locked cabinet. Its ribs contain the names of twelve hired blades.','Red Sleeve took it backstage. Bring it back before tonight’s performance.']),
    npc('mask-merchant','Madam Sui “Hundred Faces”',790,'crimson','shop',['A mask should reveal the truth its wearer fears, not merely hide a face.']),
  ],
  'ghost-opera-backstage':[
    npc('red-sleeve','Red Sleeve',260,'crimson','fight',['The fan is only paper. Your blood will make it memorable.'],enemy('Red Sleeve',6,205,14,'sword',210)),
    npc('crimson-mask','The Crimson Mask',700,'crimson','boss',['Master Shen discovered the court’s tournament was choosing assassins, not champions.','You will die before the five clans hear his accusation.'],enemy('The Crimson Mask',7,285,17,'sword',340,true)),
  ],
  'five-clan-council':[
    npc('delegate-shaolin','Monk Hai “Bronze Bell”',130,'gold','quest',['Shaolin will testify if Shi-An has protected the helpless, not merely won duels.']),
    npc('delegate-wudang','Qiao “Cloud Thread”',330,'indigo','quest',['Wu Dang heard Master Shen’s warning. We need proof the imperial archive seal reached the opera.']),
    npc('delegate-beggars','Beggar King Lu “Empty Bowl”',525,'ashen','quest',['The poor already know the court is rotten. Show me you remember their names.']),
    npc('old-pine-spear','Old Pine Spear',700,'gold','fight',['I carried messages for Master Shen and failed him once. Let me repay that debt with one honest duel.'],enemy('Old Pine Spear',7,250,15,'staff',240)),
    npc('grandmaster-tao','Grandmaster Tao “Cloud Between Peaks”',875,'atlas','quest',['Five clans can expose the court, but only if three speak before the Dragon Gate Tournament begins.','Earn their seals. Then win the tournament invitation that opens the Jade Court.']),
  ],
  'dragon-gate-arena':[
    npc('jade-mantis','Jade Mantis',220,'indigo','fight',['Every strike has a hinge. I only need to find yours.'],enemy('Jade Mantis',8,260,17,'sword',300)),
    npc('laughing-tiger','Laughing Tiger',485,'gold','fight',['Ha! A funeral orphan in a champion’s ring. Give the crowd a good fall.'],enemy('Laughing Tiger',9,310,19,'staff',360)),
    npc('iron-phoenix','Mistress Bai “Iron Phoenix”',760,'crimson','boss',['I know why the court wants you dead. Beat me, and I will give you the invitation they gave me.'],enemy('Iron Phoenix',10,380,21,'sword',480,true)),
  ],
  'imperial-jade-court':[
    npc('archivist-qin','Archivist Qin “Dustless Sleeve”',250,'ashen','quest',['Censor Wei erased Master Shen from the official record, but the execution orders remain beneath the jade floor.','Take this archive seal. The inner court will open, though it may not let you leave.']),
    npc('censor-wei','Censor Wei “Jade Viper”',750,'indigo','boss',['Master Shen mistook mercy for virtue. Empires are preserved by removing dangerous names.','Your true name is more dangerous than his ever was.'],enemy('Censor Wei “Jade Viper”',12,470,24,'sword',700,true)),
  ],
};

function addUnique(list,entries,key='id'){for(const entry of entries)if(!list.some(item=>item[key]===entry[key]))list.push(entry)}
function installContent(){
  addUnique(LOCATIONS,ACT_TWO_LOCATIONS);addUnique(QUESTS,ACT_TWO_QUESTS);addUnique(WEAPONS,ACT_TWO_WEAPONS);
  for(const [location,entries] of Object.entries(ACT_TWO_NPCS)){NPCS[location]=NPCS[location]||[];addUnique(NPCS[location],entries)}
  if(enhancements?.QUEST_GUIDE)Object.assign(enhancements.QUEST_GUIDE,GUIDE);
  if(enhancements?.STYLE_ARTS)Object.assign(enhancements.STYLE_ARTS,STYLE_ARTS);
}

function ensureActTwo(target=game){
  const data=target.data;
  data.actTwo={version:1,unlocked:false,complete:false,chapter:1,influence:{blackRiver:0,opera:0,clans:0,court:0},tournamentWins:0,councilSeals:[],archiveSeal:false,bannerUntil:0,...(data.actTwo||{})};
  data.actTwo.influence={blackRiver:0,opera:0,clans:0,court:0,...(data.actTwo.influence||{})};
  data.actTwo.councilSeals=Array.isArray(data.actTwo.councilSeals)?[...new Set(data.actTwo.councilSeals)]:[];
  data.learnedStyles=[...new Set(['Green Dragon Fist',...(Array.isArray(data.learnedStyles)?data.learnedStyles:[]),data.player.style].filter(Boolean))];
  for(const quest of ACT_TWO_QUESTS)if(!(quest.id in data.quests))data.quests[quest.id]='locked';
  if(data.quests.faceless==='completed'&&!data.actTwo.unlocked)unlockActTwo(target,false);
  target.actTwoState=target.actTwoState||{mode:null,index:0};
}
function setQuest(target,id,status){target.data.quests[id]=status;if(status==='active'&&target.data.settings?.autoTrack!==false)target.data.trackedQuest=id}
function completeQuest(target,id,nextId,reward=0){if(target.data.quests[id]==='completed')return false;target.data.quests[id]='completed';if(nextId)setQuest(target,nextId,'active');if(reward)target.data.player.silver+=reward;target.questPulse=1.8;target.sound.sfx('quest');target.say(`${QUESTS.find(item=>item.id===id)?.title||'Quest'} completed`,'quest');target.save(true);return true}
function unlockActTwo(target=game,travel=true){
  if(!target.data.actTwo)ensureActTwo(target);
  target.data.actTwo.unlocked=true;target.data.actTwo.chapter=1;target.data.actTwo.bannerUntil=target.time+4;
  if(target.data.quests['black-river-summons']==='locked')setQuest(target,'black-river-summons','active');
  for(const id of ['river-orphans','painted-fan','old-pine-debt'])if(target.data.quests[id]==='locked')target.data.quests[id]='available';
  if(travel){target.data.location='black-river-docks';target.data.player.x=80;target.mode='explore';target.locationFlash=2;target.transition=.8}
  target.say('ACT II — THE BLACK RIVER CONSPIRACY','quest');target.save(true);
}
function addInfluence(target,faction,amount){target.data.actTwo.influence[faction]=Math.max(0,(target.data.actTwo.influence[faction]||0)+amount)}
function rewardWeapon(target,id){if(!target.data.ownedWeapons.includes(id))target.data.ownedWeapons.push(id);target.data.player.weapon=id;target.say(`${WEAPONS.find(item=>item.id===id)?.name||id} obtained`,'item')}
function learnStyle(target,name){if(!target.data.learnedStyles.includes(name))target.data.learnedStyles.push(name);target.data.player.style=name;target.say(`${name} learned and equipped`,'quest')}
function canFight(target,id){const q=target.data.quests;if(id==='needle-crow')return q['broken-escort-seal']==='active'&&target.data.flags.act2ClerkPei;if(id==='salt-shark')return q['river-orphans']==='active';if(id==='red-sleeve')return q['painted-fan']==='active';if(id==='crimson-mask')return q['masks-behind-masks']==='active'&&target.data.flags.act2MoonVeil;if(id==='old-pine-spear')return q['old-pine-debt']==='active';if(id==='jade-mantis')return q['dragon-gate-qualifier']==='active';if(id==='laughing-tiger')return q['dragon-gate-semifinal']==='active';if(id==='iron-phoenix')return q['dragon-gate-final']==='active';if(id==='censor-wei')return q['jade-court-truth']==='active'&&target.data.actTwo.archiveSeal;return true}

function handleTalk(target,npcEntry){
  const id=npcEntry.id,q=target.data.quests;
  if(id==='captain-yan'){if(q['black-river-summons']==='active'){completeQuest(target,'black-river-summons','broken-escort-seal',120);addInfluence(target,'blackRiver',1);return}return target.say('The river ledger is still missing. Follow the crow feathers.','system')}
  if(id==='clerk-pei'){target.data.flags.act2ClerkPei=1;target.say('Needle Crow waits by the eastern crane.','quest');target.save(true);return}
  if(id==='orphan-mei'){if(q['river-orphans']==='available')setQuest(target,'river-orphans','active');target.say('Salt Shark waits near pier nine.','quest');target.save(true);return}
  if(id==='madam-luo'){if(q['broken-escort-seal']==='completed')learnStyle(target,'Black River Saber');else target.say('Return the stolen escort ledger first.','system');target.save(true);return}
  if(id==='wounded-courier'){target.say(q['ferry-of-whispers']==='active'?'Willow Ferry. Ask for Yun “Mist Oar”.':'The masked convoy crossed at Willow Ferry.',q['ferry-of-whispers']==='active'?'quest':'system');return}
  if(id==='quartermaster-shao'||id==='mask-merchant'){target.say('Rare weapons are awarded through Act II victories and appear in the Armory.','item');return}
  if(id==='ferrymaster-yun'){if(q['ferry-of-whispers']==='active'){completeQuest(target,'ferry-of-whispers','masks-behind-masks',150);addInfluence(target,'blackRiver',1);return}return target.say('The opera boats still cross after midnight.','system')}
  if(id==='widow-fan'){target.data.inventory['herbal-tonic']=(target.data.inventory['herbal-tonic']||0)+1;target.say('Widow Fan gives you a river-herb tonic.','item');target.save(true);return}
  if(id==='moon-veil'){target.data.flags.act2MoonVeil=1;target.say('The prop corridor opens after the third gong.','quest');target.save(true);return}
  if(id==='prop-master-du'){if(q['painted-fan']==='available')setQuest(target,'painted-fan','active');target.say('Red Sleeve carries the witness fan backstage.','quest');target.save(true);return}
  if(id==='delegate-shaolin'){if((target.data.reputation?.commonFolk||0)>=2||q['river-orphans']==='completed'){if(!target.data.actTwo.councilSeals.includes('shaolin'))target.data.actTwo.councilSeals.push('shaolin');target.say('Shaolin places its bronze seal beside Master Shen’s testimony.','quest')}else target.say('Protect the helpless before asking Shaolin to accuse the court.','warning');target.save(true);return}
  if(id==='delegate-wudang'){if(q['masks-behind-masks']==='completed'){if(!target.data.actTwo.councilSeals.includes('wudang'))target.data.actTwo.councilSeals.push('wudang');target.say('Wu Dang recognizes the archive seal taken from the opera.','quest')}else target.say('Bring proof from the Ghost Face Opera.','warning');target.save(true);return}
  if(id==='delegate-beggars'){if((target.data.contracts?.completed||0)>=1||q['river-orphans']==='completed'){if(!target.data.actTwo.councilSeals.includes('beggars'))target.data.actTwo.councilSeals.push('beggars');target.say('The Beggar Brotherhood adds ten thousand unseen witnesses.','quest')}else target.say('Do one deed the powerful would never notice.','warning');target.save(true);return}
  if(id==='grandmaster-tao'){if(q['five-clan-council']==='active'&&target.data.actTwo.councilSeals.length>=3){completeQuest(target,'five-clan-council','dragon-gate-qualifier',240);addInfluence(target,'clans',3);return}return target.say(`Council seals: ${target.data.actTwo.councilSeals.length}/3.`,'quest')}
  if(id==='archivist-qin'){target.data.actTwo.archiveSeal=true;target.say('The archive seal opens Censor Wei’s inner court.','quest');target.save(true);return}
  if(npcEntry.enemy){if(!canFight(target,id))return target.say('This opponent will not face you yet. Follow the tracked quest.','warning');target.beginFight(npcEntry)}
}

function resolveVictory(target,id){
  const q=target.data.quests;
  if(id==='salt-shark'){completeQuest(target,'river-orphans',null,180);addInfluence(target,'blackRiver',1);target.data.reputation.commonFolk=(target.data.reputation.commonFolk||0)+2;return}
  if(id==='needle-crow'){completeQuest(target,'broken-escort-seal','ferry-of-whispers',260);rewardWeapon(target,'black-river-dao');learnStyle(target,'Black River Saber');addInfluence(target,'blackRiver',2);target.data.actTwo.chapter=2;return}
  if(id==='red-sleeve'){completeQuest(target,'painted-fan',null,220);target.data.reputation.merchants=(target.data.reputation.merchants||0)+2;return}
  if(id==='crimson-mask'){completeQuest(target,'masks-behind-masks','five-clan-council',340);rewardWeapon(target,'ghost-lantern-chain');learnStyle(target,'Ghost Lantern Steps');addInfluence(target,'opera',3);target.data.actTwo.chapter=3;return}
  if(id==='old-pine-spear'){completeQuest(target,'old-pine-debt',null,260);addInfluence(target,'clans',1);return}
  if(id==='jade-mantis'){completeQuest(target,'dragon-gate-qualifier','dragon-gate-semifinal',300);target.data.actTwo.tournamentWins=1;return}
  if(id==='laughing-tiger'){completeQuest(target,'dragon-gate-semifinal','dragon-gate-final',360);target.data.actTwo.tournamentWins=2;return}
  if(id==='iron-phoenix'){completeQuest(target,'dragon-gate-final','jade-court-truth',500);rewardWeapon(target,'phoenix-jian');learnStyle(target,'Five Banners Fist');target.data.actTwo.tournamentWins=3;target.data.actTwo.chapter=4;return}
  if(id==='censor-wei'){completeQuest(target,'jade-court-truth',null,800);rewardWeapon(target,'jade-viper-fang');addInfluence(target,'court',4);target.data.actTwo.complete=true;target.data.actTwo.chapter=5;target.mode='act-two-complete';target.save(true)}
}

function tintAtlas(baseKey,newKey,color,alpha=.34){const source=globalThis.greenDragonAssets?.sprites?.[baseKey];if(!source||typeof document==='undefined'||!document.createElement)return;const canvas=document.createElement('canvas');canvas.width=source.width;canvas.height=source.height;const ctx=canvas.getContext('2d');ctx.drawImage(source,0,0);ctx.globalCompositeOperation='source-atop';ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';globalThis.greenDragonAssets.sprites[newKey]=canvas}
function buildBossArt(){tintAtlas('razor-fang','needle-crow','#4050a8',.42);tintAtlas('ghost-face','crimson-mask','#c32f42',.52);tintAtlas('novice-jin','jade-mantis','#4da66a',.42);tintAtlas('bo','laughing-tiger','#c48b2c',.34);tintAtlas('mei-lin','iron-phoenix','#d04a35',.46);tintAtlas('ghost-face','censor-wei','#6f3a99',.42);tintAtlas('mei-lin','red-sleeve','#b92f55',.4);tintAtlas('bo','salt-shark','#617071',.38);tintAtlas('hermit-reed','old-pine-spear','#8f7544',.32)}
function makeStage(id,draw){if(typeof document==='undefined'||!document.createElement)return;const canvas=document.createElement('canvas');canvas.width=960;canvas.height=540;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;draw(c);globalThis.greenDragonAssets.stages[id]=canvas}
const fill=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
function mountain(c,x,y,w,h,color){c.fillStyle=color;c.beginPath();c.moveTo(x,y+h);c.lineTo(x+w*.48,y);c.lineTo(x+w,y+h);c.closePath();c.fill()}
function lantern(c,x,y,color='#d84b34'){fill(c,x-2,y,4,24,'#362116');fill(c,x-9,y+20,18,25,color);fill(c,x-6,y+24,12,16,'#f3b454')}
function roof(c,x,y,w,color='#202b29'){c.fillStyle=color;c.beginPath();c.moveTo(x-22,y+27);c.lineTo(x+w/2,y);c.lineTo(x+w+22,y+27);c.closePath();c.fill();fill(c,x,y+26,w,8,'#a34a35')}
function hall(c,x,y,w,h,wall='#75503b'){fill(c,x,y+28,w,h-28,wall);roof(c,x,y,w);for(let i=18;i<w-20;i+=42){fill(c,x+i,y+52,16,h-62,'#241d19');fill(c,x+i+4,y+55,8,h-69,'#c6a869')}}
function buildStages(){
  if(!globalThis.greenDragonAssets?.stages)return;
  makeStage('stage-river-black-docks.webp',c=>{const g=c.createLinearGradient(0,0,0,540);g.addColorStop(0,'#182a3a');g.addColorStop(1,'#8b6a54');fill(c,0,0,960,540,g);mountain(c,-60,80,430,250,'#273f43');mountain(c,300,100,460,230,'#344d4b');fill(c,0,335,960,205,'#173f50');for(let i=0;i<36;i++)fill(c,(i*79)%980,355+(i*31)%130,34,3,i%2?'#2d6672':'#6a8f8b');fill(c,0,420,960,120,'#49372a');for(let i=0;i<15;i++)fill(c,i*70,420,48,120,i%2?'#5f4733':'#3f3025');fill(c,760,170,12,250,'#241d18');fill(c,620,178,155,10,'#241d18');c.strokeStyle='#3b2b20';c.lineWidth=5;c.beginPath();c.moveTo(630,190);c.lineTo(700,330);c.stroke();lantern(c,140,330);lantern(c,825,320,'#7f4eaa')});
  makeStage('stage-market-black-river-escort.webp',c=>{fill(c,0,0,960,540,'#6d8790');mountain(c,-50,90,420,240,'#3e6259');mountain(c,560,80,430,250,'#36554f');fill(c,0,350,960,190,'#8c724e');hall(c,220,130,520,280,'#68452f');for(let i=0;i<5;i++){fill(c,120+i*180,410,10,85,'#39261b');fill(c,95+i*180,410,60,8,'#b98a46')}lantern(c,165,270);lantern(c,795,270);fill(c,420,275,120,95,'#171817');fill(c,448,290,64,80,'#2b2922')});
  makeStage('stage-river-willow-ferry.webp',c=>{const g=c.createLinearGradient(0,0,0,540);g.addColorStop(0,'#7797a0');g.addColorStop(1,'#d2b884');fill(c,0,0,960,540,g);mountain(c,0,95,420,220,'#56756c');mountain(c,500,85,470,235,'#49695f');fill(c,0,340,960,200,'#377888');for(let i=0;i<24;i++)fill(c,(i*97)%980,365+(i*41)%120,48,3,'#79aeb0');fill(c,120,405,720,28,'#70513a');for(let i=0;i<12;i++)fill(c,135+i*60,430,18,110,'#493426');for(const x of [80,870]){fill(c,x,210,11,245,'#493829');for(let j=0;j<8;j++){c.strokeStyle='#547b55';c.lineWidth=5;c.beginPath();c.moveTo(x+5,230+j*27);c.quadraticCurveTo(x+(j%2?80:-80),250+j*27,x+(j%2?120:-120),280+j*27);c.stroke()}}fill(c,430,330,140,42,'#4d3425');fill(c,455,310,80,22,'#806149')});
  makeStage('stage-market-ghost-opera.webp',c=>{fill(c,0,0,960,540,'#392c48');mountain(c,-60,100,420,240,'#293844');mountain(c,600,90,410,250,'#26363d');fill(c,0,360,960,180,'#665040');hall(c,245,130,470,270,'#692c35');fill(c,335,218,290,150,'#20151c');fill(c,365,240,230,128,'#8d2434');for(let i=0;i<8;i++){lantern(c,75+i*116,300,i%2?'#c43b36':'#9145a4');fill(c,28+i*128,440,92,30,i%2?'#58352e':'#73473b')}roof(c,245,130,470,'#171b25')});
  makeStage('stage-shaolin-ghost-backstage.webp',c=>{fill(c,0,0,960,540,'#261e2c');fill(c,0,355,960,185,'#4a3029');fill(c,100,70,760,330,'#151317');for(let i=0;i<8;i++){fill(c,100+i*95,70,18,330,'#5f1d2a');fill(c,118+i*95,70,6,330,'#d3a157')}fill(c,235,165,490,215,'#7d2632');fill(c,270,195,420,185,'#1b1118');for(let i=0;i<7;i++){c.fillStyle=i%2?'#e8c17b':'#d75c68';c.beginPath();c.arc(315+i*55,235+(i%2)*58,22,0,Math.PI*2);c.fill();fill(c,305+i*55,232+(i%2)*58,5,5,'#20141a');fill(c,325+i*55,232+(i%2)*58,5,5,'#20141a')}lantern(c,170,280);lantern(c,790,280,'#7b3f9d')});
  makeStage('stage-wudang-five-clan.webp',c=>{const g=c.createLinearGradient(0,0,0,540);g.addColorStop(0,'#476987');g.addColorStop(1,'#d0b77c');fill(c,0,0,960,540,g);mountain(c,-70,70,420,280,'#445e59');mountain(c,280,90,480,250,'#56716a');mountain(c,670,60,370,290,'#354e4d');fill(c,0,365,960,175,'#7d806e');fill(c,90,405,780,30,'#aaa07f');for(let i=0;i<5;i++){const x=160+i*160;fill(c,x,180,8,220,'#382a20');fill(c,x+8,185,70,95,['#b4483f','#d4a347','#437d63','#4f6292','#704c83'][i]);fill(c,x+18,200,50,60,'rgba(240,220,170,.25)')}hall(c,330,210,300,150,'#6a543d')});
  makeStage('stage-mountain-dragon-gate.webp',c=>{fill(c,0,0,960,540,'#6f8791');mountain(c,-80,60,420,280,'#3e5d57');mountain(c,610,50,430,290,'#334e4b');fill(c,0,355,960,185,'#8a704a');fill(c,120,250,720,185,'#5e4431');fill(c,150,275,660,160,'#b18a58');for(let i=0;i<20;i++){fill(c,70+(i%10)*88,190+Math.floor(i/10)*45,34,34,i%3?'#332a25':'#5a2930');fill(c,81+(i%10)*88,178+Math.floor(i/10)*45,12,14,'#d0aa7a')}for(let i=0;i<6;i++){fill(c,180+i*120,120,9,145,'#39271d');fill(c,189+i*120,125,70,70,i%2?'#a9323a':'#d09b3e')}fill(c,420,220,120,36,'#1e1b18')});
  makeStage('stage-wudang-jade-court.webp',c=>{const g=c.createLinearGradient(0,0,0,540);g.addColorStop(0,'#192b48');g.addColorStop(1,'#557a68');fill(c,0,0,960,540,g);c.fillStyle='#dbe1c1';c.beginPath();c.arc(790,90,48,0,Math.PI*2);c.fill();mountain(c,-70,110,430,250,'#233f42');mountain(c,620,100,420,260,'#20383d');fill(c,0,350,960,190,'#52705f');hall(c,180,105,600,300,'#315946');for(let i=0;i<8;i++){fill(c,205+i*74,175,22,220,'#7eb49a');fill(c,210+i*74,185,12,205,'#284b3d')}fill(c,410,250,140,145,'#14251f');for(let i=0;i<50;i++)fill(c,(i*71)%960,(i*37)%350,2,14,'rgba(190,220,210,.32)');lantern(c,145,285,'#4c9a72');lantern(c,815,285,'#8a4c9a')});
}

function drawPanel(ctx,x,y,w,h,a=.98){ctx.fillStyle=`rgba(4,12,9,${a})`;ctx.fillRect(x,y,w,h);ctx.strokeStyle='#e0b963';ctx.lineWidth=3;ctx.strokeRect(x+.5,y+.5,w-1,h-1);ctx.strokeStyle='#31563f';ctx.lineWidth=1;ctx.strokeRect(x+7.5,y+7.5,w-15,h-15)}
function text(ctx,value,x,y,size=16,color='#f6e8c4',align='left',font='Georgia'){ctx.fillStyle=color;ctx.font=`${size}px ${font}`;ctx.textAlign=align;ctx.textBaseline='top';ctx.fillText(String(value),x,y)}
function wrap(ctx,value,x,y,width,lineHeight=20,size=15,color='#d8d2bb',limit=5){ctx.font=`${size}px Georgia`;ctx.fillStyle=color;ctx.textAlign='left';let line='',rows=[];for(const word of String(value).split(' ')){const next=line?`${line} ${word}`:word;if(ctx.measureText(next).width>width&&line){rows.push(line);line=word}else line=next}if(line)rows.push(line);rows.slice(0,limit).forEach((row,index)=>ctx.fillText(row,x,y+index*lineHeight))}
function drawActTwo(target){const ctx=target.ctx,data=target.data,state=target.actTwoState;if(data.actTwo?.unlocked&&target.mode==='explore'){const locIndex=LOCATIONS.findIndex(item=>item.id===data.location);if(locIndex>=ACT_TWO_START){drawPanel(ctx,14,119,260,36,.86);text(ctx,`ACT II · CHAPTER ${data.actTwo.chapter}`,28,129,11,'#79e59a','left','monospace');text(ctx,'X CHRONICLE',258,129,9,'#d4bd7b','right','monospace')}}if(target.mode==='menu'&&target.menu?.tab===3)drawWorldMap(target);if(target.mode==='menu'&&target.menu?.tab===2)drawQuestJournal(target);if(state?.mode==='chronicle'){ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(0,0,960,540);drawChronicle(target)}if(data.actTwo?.bannerUntil>target.time)drawChapterBanner(target);if(target.mode==='act-two-complete')drawActTwoComplete(target)}
function drawWorldMap(target){const ctx=target.ctx;ctx.fillStyle='#07110f';ctx.fillRect(88,105,784,344);text(ctx,'ROAD OF THE GREEN DRAGON',112,118,22,'#e4c675');text(ctx,'ACT I',112,151,10,'#75d592','left','monospace');text(ctx,'ACT II · THE BLACK RIVER CONSPIRACY',500,151,10,'#e3b96a','left','monospace');LOCATIONS.forEach((location,index)=>{const row=index<ACT_TWO_START?0:1,local=row===0?index:index-ACT_TWO_START,count=row===0?ACT_TWO_START:ACT_TWO_LOCATIONS.length,x=125+local*(710/Math.max(1,count-1)),y=row===0?225:350,current=location.id===target.data.location;ctx.strokeStyle=row===0?'#739077':'#9a7041';ctx.lineWidth=3;if(local<count-1){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(125+(local+1)*(710/Math.max(1,count-1)),y);ctx.stroke()}ctx.fillStyle=current?'#5bea86':row===0?'#81a68a':'#c28b49';ctx.beginPath();ctx.arc(x,y,current?11:7,0,Math.PI*2);ctx.fill();text(ctx,location.name.replace('Black River ','').replace('Ghost Face ','').replace('Imperial ',''),x,y+18,8,current?'#8df2a7':'#d4c3a0','center','monospace')});text(ctx,target.data.actTwo?.unlocked?'The eastern road is open.':'Complete Act I to open the eastern road.',112,420,11,target.data.actTwo?.unlocked?'#77df95':'#b98c75','left','monospace')}
function drawQuestJournal(target){const ctx=target.ctx,unlocked=QUESTS.filter(q=>target.data.quests[q.id]!=='locked'),selected=Math.max(0,Math.min(unlocked.length-1,target.menu.index));target.menu.index=selected;const start=Math.max(0,Math.min(unlocked.length-8,selected-3));ctx.fillStyle='#07110f';ctx.fillRect(88,105,784,344);text(ctx,'QUEST JOURNAL · ACT I & II',112,118,22,'#e4c675');unlocked.slice(start,start+8).forEach((q,offset)=>{const index=start+offset,y=158+offset*31,status=target.data.quests[q.id];if(index===selected){ctx.fillStyle='#173b2a';ctx.fillRect(104,y-4,410,26)}text(ctx,`${q.id===target.data.trackedQuest?'◆':'·'} ${q.title}`,116,y,12,status==='completed'?'#68cf82':index===selected?'#fff0bd':'#c8bea3','left','monospace');text(ctx,status.toUpperCase(),500,y+2,8,status==='completed'?'#68cf82':'#d2ad66','right','monospace')});const item=unlocked[selected];if(item){text(ctx,item.title,540,160,18,'#efd083');wrap(ctx,item.summary,540,195,290,21,14,'#d8d0b8',7)}text(ctx,'T opens tracker · arrows browse',112,423,9,'#9ead9f','left','monospace')}
function drawChronicle(target){const ctx=target.ctx,data=target.data,state=target.actTwoState,styles=data.learnedStyles||[];drawPanel(ctx,130,55,700,430,.99);text(ctx,'ACT II CHRONICLE',480,77,29,'#e7c875','center');text(ctx,'THE BLACK RIVER CONSPIRACY',480,113,10,'#7be198','center','monospace');const chapters=['Black River Ledger','Ghost Face Opera','Five-Clan Council','Dragon Gate Tournament','Jade Court Truth'];chapters.forEach((name,index)=>{const y=150+index*31,active=index+1===data.actTwo.chapter,done=index+1<data.actTwo.chapter||data.actTwo.complete;text(ctx,`${done?'✓':active?'◆':'·'} ${name}`,170,y,14,done?'#72d990':active?'#fff0bd':'#777d72')});text(ctx,'INFLUENCE',170,325,10,'#77d993','left','monospace');const inf=data.actTwo.influence;[['Black River',inf.blackRiver],['Opera',inf.opera],['Five Clans',inf.clans],['Court',inf.court]].forEach((row,i)=>text(ctx,`${row[0]} ${'◆'.repeat(Math.min(5,row[1]))}${'◇'.repeat(Math.max(0,5-row[1]))}`,170,347+i*22,11,'#d3c49f','left','monospace'));text(ctx,'LEARNED STYLES',510,150,10,'#77d993','left','monospace');styles.forEach((style,index)=>{const y=177+index*39;if(index===state.index){ctx.fillStyle='#1b4630';ctx.fillRect(496,y-6,285,31)}text(ctx,`${data.player.style===style?'◆':'·'} ${style}`,510,y,14,data.player.style===style?'#79eca0':index===state.index?'#fff0bd':'#c3baa1')});text(ctx,'ENTER equip · X / ESC close',480,454,10,'#b6ab8d','center','monospace')}
function drawChapterBanner(target){const ctx=target.ctx,remaining=target.data.actTwo.bannerUntil-target.time,alpha=Math.min(1,remaining,4-remaining);ctx.save();ctx.globalAlpha=Math.max(0,alpha);ctx.fillStyle='rgba(0,0,0,.76)';ctx.fillRect(0,0,960,540);drawPanel(ctx,155,165,650,200,.98);text(ctx,'ACT II',480,192,45,'#6ee593','center');text(ctx,'THE BLACK RIVER CONSPIRACY',480,252,25,'#edc875','center');text(ctx,'Master Shen’s seal has surfaced beside an imperial corpse.',480,303,15,'#d8d0b8','center');ctx.restore()}
function drawActTwoComplete(target){const ctx=target.ctx;ctx.fillStyle='rgba(0,0,0,.84)';ctx.fillRect(0,0,960,540);drawPanel(ctx,115,65,730,410,.99);text(ctx,'ACT II COMPLETE',480,92,39,'#6de492','center');text(ctx,'THE VIPER SHEDS ITS SKIN',480,145,24,'#efcb74','center');wrap(ctx,'Censor Wei falls, but the archive reveals a greater secret: Shi-An was born beneath the Green Dragon imperial constellation, and Master Shen hid him from an order that has manipulated the clans for a generation. The next road leads toward the northern war monasteries, the Ghost Face founder, and the emperor’s vanished heir.',175,210,610,27,18,'#e4d8bc',8);text(ctx,'ENTER returns to the Jade Court · Act III remains in production',480,435,11,'#efd07d','center','monospace')}

function patchGame(target){
  ensureActTwo(target);
  const baseSave=target.save.bind(target);target.save=function(silent=false){ensureActTwo(this);return baseSave(silent)};
  const baseLoad=target.load.bind(target);target.load=function(){const result=baseLoad();ensureActTwo(this);return result};
  const baseNew=target.newGame.bind(target);target.newGame=function(){const result=baseNew();ensureActTwo(this);return result};
  const basePress=target.press.bind(target);target.press=function(key){if(this.mode==='act-complete'&&['Enter','KeyE'].includes(key)){unlockActTwo(this,true);return}if(this.mode==='act-two-complete'&&['Enter','KeyE'].includes(key)){this.mode='explore';this.data.location='imperial-jade-court';this.data.player.x=400;this.save(true);return}if(this.actTwoState.mode==='chronicle'){const styles=this.data.learnedStyles||[];if(['Escape','KeyX'].includes(key)){this.actTwoState.mode=null;this.save(true);return}if(['ArrowUp','KeyW'].includes(key))this.actTwoState.index=(this.actTwoState.index+styles.length-1)%Math.max(1,styles.length);if(['ArrowDown','KeyS'].includes(key))this.actTwoState.index=(this.actTwoState.index+1)%Math.max(1,styles.length);if(['Enter','KeyE'].includes(key)&&styles[this.actTwoState.index]){this.data.player.style=styles[this.actTwoState.index];this.say(`${this.data.player.style} equipped`,'quest');this.sound.sfx('ok');this.save(true)}return}if(key==='KeyX'&&this.data.actTwo.unlocked&&!['combat','dialogue','victory','defeat'].includes(this.mode)){this.actTwoState.mode='chronicle';this.actTwoState.index=Math.max(0,(this.data.learnedStyles||[]).indexOf(this.data.player.style));this.sound.sfx('ok');return}return basePress(key)};
  const baseTravel=target.travel.bind(target);target.travel=function(direction){const current=LOCATIONS.findIndex(item=>item.id===this.data.location),next=current+direction;if(next>=ACT_TWO_START&&!this.data.actTwo.unlocked){this.data.player.x=920;this.say('The eastern road opens after the Faceless Magistrate falls.','warning');return}return baseTravel(direction)};
  const baseAfter=target.afterTalk.bind(target);target.afterTalk=function(npcEntry){if(Object.values(ACT_TWO_NPCS).some(list=>list.some(item=>item.id===npcEntry.id))){handleTalk(this,npcEntry);return}return baseAfter(npcEntry)};
  const baseBegin=target.beginFight.bind(target);target.beginFight=function(npcEntry){baseBegin(npcEntry);const profile=BOSS_PROFILES[npcEntry.id];if(profile&&this.combat){const e=this.combat.enemy;this.combat.enemyProfile=profile.label;e.maxGuard=Math.round(e.maxGuard*(profile.guard||1));e.guard=e.maxGuard;e.maxStamina=Math.round(e.maxStamina*(profile.stamina||1));e.stamina=e.maxStamina;e.power=Math.round((e.power||8)*(profile.power||1));e.chi=Math.max(e.chi,profile.chi||0);if(npcEntry.id==='censor-wei')this.combat.timer=120}};
  const baseFinish=target.finishResult.bind(target);target.finishResult=function(){const victory=this.mode==='victory',id=this.combat?.npc?.id,result=baseFinish();if(victory&&id)resolveVictory(this,id);return result};
  const previousLoop=target.loop.bind(target);target.loop=function(now){previousLoop(now);drawActTwo(this)};
}

installContent();buildBossArt();buildStages();patchGame(game);
globalThis.greenDragonActTwo={ACT_TWO_LOCATIONS,ACT_TWO_QUESTS,GUIDE,unlockActTwo,ensureActTwo,resolveVictory};
