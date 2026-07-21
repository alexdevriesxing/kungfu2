import {LOCATIONS,NPCS,QUESTS,WEAPONS} from './content.js';

const game=globalThis.greenDragonGame;
const enhancements=globalThis.greenDragonEnhancements;
const ACT_FOUR_START=LOCATIONS.length;

const ACT_FOUR_LOCATIONS=[
  {id:'capital-east-gate',name:'Eastern Capital Gate',subtitle:'Three standards arrive before a city trained to distrust hope',background:'stage-capital-east-gate.webp',music:'mountain-theme',danger:5},
  {id:'lantern-refuge-ward',name:'Lantern Refuge Ward',subtitle:'Refugees keep the city alive beneath confiscated lanterns',background:'stage-capital-lantern-ward.webp',music:'village-theme',danger:4},
  {id:'hall-ten-thousand-petitions',name:'Hall of Ten Thousand Petitions',subtitle:'Every unanswered name waits beneath a roof of ash',background:'stage-capital-petitions.webp',music:'village-theme',danger:4},
  {id:'ghost-schism-temple',name:'Temple of the Divided Mask',subtitle:'The Ghost Face order chooses whether names will be hidden or restored',background:'stage-capital-mask-temple.webp',music:'mountain-theme',danger:5},
  {id:'vermilion-arsenal',name:'Vermilion Arsenal',subtitle:'The capital’s weapons decide whether the army obeys a throne or the people',background:'stage-capital-arsenal.webp',music:'mountain-theme',danger:5},
  {id:'imperial-garden-ruins',name:'Imperial Garden Ruins',subtitle:'A dead emperor’s final testament survives beneath burned plum trees',background:'stage-capital-garden.webp',music:'village-theme',danger:4},
  {id:'empty-throne-hall',name:'Hall of the Empty Throne',subtitle:'A crown waits for someone brave enough to refuse its oldest lies',background:'stage-capital-empty-throne.webp',music:'mountain-theme',danger:5},
  {id:'green-dragon-terrace',name:'Green Dragon Sky Terrace',subtitle:'The empire watches one final duel beneath a dawn without banners',background:'stage-capital-green-terrace.webp',music:'mountain-theme',danger:5},
];

const ACT_FOUR_QUESTS=[
  {id:'march-of-standards',title:'The March of Three Standards',summary:'Enter the capital beside Prince Jian and learn why the eastern gate has been sealed against refugees.'},
  {id:'lantern-ward-siege',title:'Lanterns Against the Gate',summary:'Defeat Gate General Xun and open the capital road without turning the refugee ward into a battlefield.'},
  {id:'ten-thousand-petitions',title:'Ten Thousand Unanswered Names',summary:'Protect the petitions naming the court’s crimes from the Ashen Crow commander.'},
  {id:'masks-at-war',title:'When Masks Choose a Face',summary:'Help Moon Veil end the Ghost Face schism and defeat Lady Half-Mask.'},
  {id:'vermilion-arsenal',title:'The Arsenal Chooses',summary:'Secure the imperial arsenal before Chancellor Sima arms a private palace guard.'},
  {id:'last-emperor-testament',title:'The Testament Beneath Plum Ash',summary:'Recover the late emperor’s sealed testament from the burned imperial garden.'},
  {id:'hall-of-empty-throne',title:'The Hall Without an Emperor',summary:'Carry five capital proofs into the throne hall and defeat its final warden.'},
  {id:'mandate-choice',title:'What the Mandate Serves',summary:'Choose whether the capital follows Prince Jian, a council of provinces or no permanent throne.'},
  {id:'pale-dragon-chancellor',title:'The Pale Dragon Chancellor',summary:'Defeat Chancellor Sima before he destroys the evidence and crowns himself guardian of the empire.'},
  {id:'children-of-lanterns',title:'Children of the Confiscated Lanterns',summary:'Stop the collector taxing refugee families for the right to light their streets.'},
  {id:'ledger-of-stolen-names',title:'The Ledger of Stolen Names',summary:'Recover the register of children erased by the Ghost Face recruitment network.'},
  {id:'master-shen-memorial',title:'One Incense Stick for Master Shen',summary:'Protect Master Shen’s hidden memorial from a court grave robber.'},
];

const ACT_FOUR_WEAPONS=[
  {id:'capital-guardian-halberd',name:'Capital Guardian Halberd',kind:'staff',power:27,price:2600,desc:'A gate weapon whose long reach once protected citizens before it protected decrees.'},
  {id:'mirror-mask-ribbon',name:'Mirror Mask Ribbon Chain',kind:'staff',power:29,price:2950,desc:'A Ghost Face weapon reforged to reveal names rather than erase them.'},
  {id:'vermilion-tiger-jian',name:'Vermilion Tiger Jian',kind:'sword',power:31,price:3400,desc:'The arsenal commander’s blade, balanced for disciplined formation fighting.'},
  {id:'pale-dragon-sealblade',name:'Pale Dragon Sealblade',kind:'sword',power:35,price:4200,desc:'The chancellor’s execution blade, broken free of its disappearing seal.'},
];

const GUIDE={
  'march-of-standards':{location:'capital-east-gate',npc:'prince-jian-capital',objective:'Meet Prince Jian at the Eastern Capital Gate.'},
  'lantern-ward-siege':{location:'capital-east-gate',npc:'gate-general-xun',objective:'Defeat Gate General Xun and open the refugee road.'},
  'ten-thousand-petitions':{location:'hall-ten-thousand-petitions',npc:'ashen-crow-commander',objective:'Hear Speaker Ren, then defeat the Ashen Crow commander.'},
  'masks-at-war':{location:'ghost-schism-temple',npc:'lady-half-mask',objective:'Meet Moon Veil and defeat Lady Half-Mask.'},
  'vermilion-arsenal':{location:'vermilion-arsenal',npc:'vermilion-ox',objective:'Question Captain Ruo, then defeat Vermilion Ox.'},
  'last-emperor-testament':{location:'imperial-garden-ruins',npc:'gardener-xu',objective:'Recover the late emperor’s testament from Gardener Xu.'},
  'hall-of-empty-throne':{location:'empty-throne-hall',npc:'throne-warden',objective:'Carry five proofs into the throne hall and defeat its warden.'},
  'mandate-choice':{location:'empty-throne-hall',npc:'prince-jian-throne',objective:'Decide what the mandate will serve.'},
  'pale-dragon-chancellor':{location:'green-dragon-terrace',npc:'chancellor-sima',objective:'Defeat Chancellor Sima on the Green Dragon Sky Terrace.'},
  'children-of-lanterns':{location:'lantern-refuge-ward',npc:'fire-tax-collector',objective:'Defeat the collector confiscating refugee lanterns.'},
  'ledger-of-stolen-names':{location:'hall-ten-thousand-petitions',npc:'cipher-eunuch',objective:'Recover the ledger of erased children.'},
  'master-shen-memorial':{location:'imperial-garden-ruins',npc:'grave-robber-kang',objective:'Protect Master Shen’s hidden memorial.'},
};

const STYLE_ARTS={
  'Lantern Ward Boxing':{name:'TEN THOUSAND LANTERNS RISE',damage:1.3,guard:1.42,knockback:1.28,restoreGuard:20},
  'Mirror Mask Steps':{name:'THE MASK RETURNS ITS NAME',damage:1.36,guard:1.28,knockback:1.42,restoreGuard:12},
  'Mandate Without Throne':{name:'GREEN DRAGON SERVES NO CROWN',damage:1.52,guard:1.45,knockback:1.48,restoreGuard:18},
};

const BOSS_PROFILES={
  'gate-general-xun':{label:'SEALED CAPITAL GATE',guard:1.8,stamina:1.62,power:1.34},
  'ashen-crow-commander':{label:'PETITION BURNER',guard:1.66,stamina:1.72,power:1.38,chi:110},
  'lady-half-mask':{label:'DIVIDED GHOST FACE',guard:1.84,stamina:1.76,power:1.42,chi:125},
  'vermilion-ox':{label:'ARSENAL COMMANDER',guard:1.92,stamina:1.82,power:1.46,chi:120},
  'throne-warden':{label:'EMPTY THRONE WARDEN',guard:2.02,stamina:1.9,power:1.5,chi:135},
  'chancellor-sima':{label:'PALE DRAGON CHANCELLOR',guard:2.2,stamina:2.02,power:1.58,chi:150},
};

const MANDATES=[
  {id:'restoration',title:'RESTORE PRINCE JIAN',detail:'A lawful heir returns under limits written by the northern standards.',bonus:'Guard and Chi favor'},
  {id:'council',title:'COUNCIL OF PROVINCES',detail:'The petitions become the foundation of a rotating provincial council.',bonus:'Stamina and recovery favor'},
  {id:'wanderer',title:'THE WANDERER MANDATE',detail:'No permanent throne. Authority remains distributed among those who defended the people.',bonus:'Power and mobility favor'},
];

const npc=(id,name,x,variant,role,lines,enemyData)=>({id,name,x,variant,role,lines,...(enemyData?{enemy:enemyData}:{})});
const enemy=(name,level,maxHp,power,weapon,reward,boss=false)=>({name,level,maxHp,power,weapon,reward,boss});

const ACT_FOUR_NPCS={
  'capital-east-gate':[
    npc('prince-jian-capital','Prince Jian “Ashen Crown”',185,'atlas','quest',['The standards opened the north, but Chancellor Sima sealed the capital against its own refugees.','Open the gate without becoming the army he expects us to be.']),
    npc('gate-general-xun','Gate General Xun “Iron Portcullis”',770,'ashen','boss',['A sealed gate is mercy. Once the city opens, every grievance will call itself justice.'],enemy('Gate General Xun “Iron Portcullis”',20,980,41,'staff',1500,true)),
  ],
  'lantern-refuge-ward':[
    npc('lantern-runner-lin','Lin “Little Flame”',170,'gold','quest',['The collector takes one copper for every lantern and ten for every family that cannot pay.']),
    npc('fire-tax-collector','Collector Huo “Cold Wick”',455,'crimson','fight',['Dark streets make obedient refugees.'],enemy('Collector Huo “Cold Wick”',17,620,32,'sword',620)),
    npc('speaker-ren','Speaker Ren “Many Voices”',760,'indigo','quest',['Ten thousand petitions name the disappeared and the villages the court burned.','Ashen Crow troops are already moving to destroy them.']),
  ],
  'hall-ten-thousand-petitions':[
    npc('elder-meng','Elder Meng “Ink Hands”',150,'gold','quest',['Paper survives when enough hands carry copies. The originals still bear the court signatures.']),
    npc('scribe-yao','Scribe Yao “Unbroken Brush”',355,'atlas','quest',['A cipher eunuch keeps the ledger of children renamed by Ghost Face recruiters.']),
    npc('cipher-eunuch','Cipher Eunuch Wen',565,'indigo','fight',['Names are inventory. The court merely kept better books.'],enemy('Cipher Eunuch Wen',18,680,34,'sword',720)),
    npc('ashen-crow-commander','Commander Hei “Ashen Crow”',810,'ashen','boss',['Ten thousand petitions make excellent kindling. History remembers decrees, not smoke.'],enemy('Commander Hei “Ashen Crow”',21,1050,43,'staff',1650,true)),
  ],
  'ghost-schism-temple':[
    npc('moon-veil-schism','Moon Veil',205,'indigo','quest',['Half the order wants to reveal every stolen name. The other half would rather serve the next throne.']),
    npc('lady-half-mask','Lady Half-Mask',730,'crimson','boss',['A mask is freedom from the burden of a past. You would chain every child to the name that failed them.'],enemy('Lady Half-Mask',22,1120,45,'staff',1800,true)),
  ],
  'vermilion-arsenal':[
    npc('captain-ruo-capital','Captain Ruo “Unbroken Standard”',190,'gold','quest',['The loyal companies will stand down if the arsenal is freed from Sima’s private guard.']),
    npc('vermilion-ox','General Bao “Vermilion Ox”',760,'crimson','boss',['Armies serve whoever controls the keys to the weapons.'],enemy('General Bao “Vermilion Ox”',23,1210,47,'sword',1950,true)),
  ],
  'imperial-garden-ruins':[
    npc('gardener-xu','Gardener Xu “Plum Ash”',180,'ashen','quest',['The late emperor signed one final testament limiting the throne and naming Jian his surviving witness.']),
    npc('memorial-keeper','Keeper An “Single Incense”',455,'gold','quest',['Master Shen has no public grave. A court robber is breaking every memorial linked to his name.']),
    npc('grave-robber-kang','Kang “Bone Shovel”',740,'indigo','fight',['Memory is valuable only when someone pays to erase it.'],enemy('Kang “Bone Shovel”',19,740,36,'staff',780)),
  ],
  'empty-throne-hall':[
    npc('prince-jian-throne','Prince Jian “Ashen Crown”',285,'atlas','quest',['The throne is empty, but emptiness still commands people to fill it.','Choose what our victory serves before Sima crowns himself above us all.']),
    npc('throne-warden','The Throne Warden',650,'ashen','boss',['Five proofs do not outweigh five centuries of obedience.'],enemy('The Throne Warden',24,1320,49,'staff',2150,true)),
  ],
  'green-dragon-terrace':[
    npc('master-shen-echo','Master Shen’s Memorial Tablet',220,'gold','quest',['The Green Dragon was never a claim to rule. It was a promise to stand between power and those power forgets.']),
    npc('chancellor-sima','Chancellor Sima “Pale Dragon”',720,'indigo','boss',['A nation cannot be governed by petitions, masks and wandering fighters.','You may choose the mandate. I choose whether anyone survives to hear it.'],enemy('Chancellor Sima “Pale Dragon”',26,1580,53,'sword',2600,true)),
  ],
};

function addUnique(list,entries,key='id'){for(const entry of entries)if(!list.some(item=>item[key]===entry[key]))list.push(entry)}
function installContent(){addUnique(LOCATIONS,ACT_FOUR_LOCATIONS);addUnique(QUESTS,ACT_FOUR_QUESTS);addUnique(WEAPONS,ACT_FOUR_WEAPONS);for(const [location,entries] of Object.entries(ACT_FOUR_NPCS)){NPCS[location]=NPCS[location]||[];addUnique(NPCS[location],entries)}if(enhancements?.QUEST_GUIDE)Object.assign(enhancements.QUEST_GUIDE,GUIDE);if(enhancements?.STYLE_ARTS)Object.assign(enhancements.STYLE_ARTS,STYLE_ARTS)}

function ensureActFour(target=game){
  const data=target.data;
  data.actFour={version:1,unlocked:false,complete:false,chapter:1,proofs:[],peopleSupport:0,ghostFaceReformed:false,arsenalSecured:false,testament:false,mandateChoice:null,ending:null,bannerUntil:0,...(data.actFour||{})};
  data.actFour.proofs=Array.isArray(data.actFour.proofs)?[...new Set(data.actFour.proofs)]:[];
  data.reputation={...(data.reputation||{}),capital:Number(data.reputation?.capital)||0};
  data.learnedStyles=[...new Set(['Green Dragon Fist',...(Array.isArray(data.learnedStyles)?data.learnedStyles:[]),data.player.style].filter(Boolean))];
  for(const quest of ACT_FOUR_QUESTS)if(!(quest.id in data.quests))data.quests[quest.id]='locked';
  if(data.actThree?.complete&&!data.actFour.unlocked)unlockActFour(target,false);
  target.actFourState=target.actFourState||{mode:null,index:0};
}
function setQuest(target,id,status){target.data.quests[id]=status;if(status==='active'&&target.data.settings?.autoTrack!==false)target.data.trackedQuest=id}
function completeQuest(target,id,nextId,reward=0){if(target.data.quests[id]==='completed')return false;target.data.quests[id]='completed';if(nextId)setQuest(target,nextId,'active');if(reward)target.data.player.silver+=reward;target.questPulse=1.8;target.sound.sfx('quest');target.say(`${QUESTS.find(item=>item.id===id)?.title||'Quest'} completed`,'quest');target.save(true);return true}
function unlockActFour(target=game,travel=true){if(!target.data.actFour)ensureActFour(target);target.data.actFour.unlocked=true;target.data.actFour.chapter=1;target.data.actFour.bannerUntil=(target.time||0)+4;if(target.data.quests['march-of-standards']==='locked')setQuest(target,'march-of-standards','active');for(const id of ['children-of-lanterns','ledger-of-stolen-names','master-shen-memorial'])if(target.data.quests[id]==='locked')target.data.quests[id]='available';if(travel){target.data.location='capital-east-gate';target.data.player.x=80;target.mode='explore';target.locationFlash=2;target.transition=.8}target.say('ACT IV — MANDATE OF JADE AND ASH','quest');target.save(true)}
function addProof(target,id){if(!target.data.actFour.proofs.includes(id)){target.data.actFour.proofs.push(id);target.data.reputation.capital=(target.data.reputation.capital||0)+2;target.say(`${id.toUpperCase()} PROOF SECURED`,'quest')}}
function rewardWeapon(target,id){if(!target.data.ownedWeapons.includes(id))target.data.ownedWeapons.push(id);target.data.player.weapon=id;target.say(`${WEAPONS.find(item=>item.id===id)?.name||id} obtained`,'item')}
function learnStyle(target,name){if(!target.data.learnedStyles.includes(name))target.data.learnedStyles.push(name);target.data.player.style=name;target.say(`${name} learned and equipped`,'quest')}
function canFight(target,id){const q=target.data.quests;if(id==='gate-general-xun')return q['lantern-ward-siege']==='active';if(id==='fire-tax-collector')return q['children-of-lanterns']==='active';if(id==='cipher-eunuch')return q['ledger-of-stolen-names']==='active';if(id==='ashen-crow-commander')return q['ten-thousand-petitions']==='active'&&target.data.flags.act4SpeakerRen;if(id==='lady-half-mask')return q['masks-at-war']==='active'&&target.data.flags.act4MoonVeil;if(id==='vermilion-ox')return q['vermilion-arsenal']==='active'&&target.data.flags.act4CaptainRuo;if(id==='grave-robber-kang')return q['master-shen-memorial']==='active';if(id==='throne-warden')return q['hall-of-empty-throne']==='active'&&target.data.actFour.proofs.length>=5;if(id==='chancellor-sima')return q['pale-dragon-chancellor']==='active'&&!!target.data.actFour.mandateChoice;return true}

function handleTalk(target,npcEntry){
  const id=npcEntry.id,q=target.data.quests;
  if(id==='prince-jian-capital'){if(q['march-of-standards']==='active'){completeQuest(target,'march-of-standards','lantern-ward-siege',350);return}return target.say('Open the gate, then carry the people’s evidence toward the throne.','system')}
  if(id==='lantern-runner-lin'){if(q['children-of-lanterns']==='available')setQuest(target,'children-of-lanterns','active');target.say('Collector Huo waits beside the confiscated lantern cart.','quest');target.save(true);return}
  if(id==='speaker-ren'){target.data.flags.act4SpeakerRen=1;target.say('Ashen Crow troops are marching on the petition hall.','quest');target.save(true);return}
  if(id==='elder-meng'){target.say('Protect the originals. Copies alone cannot expose the signatures.','quest');return}
  if(id==='scribe-yao'){if(q['ledger-of-stolen-names']==='available')setQuest(target,'ledger-of-stolen-names','active');target.say('Cipher Eunuch Wen keeps the stolen-name register in the eastern stacks.','quest');target.save(true);return}
  if(id==='moon-veil-schism'){target.data.flags.act4MoonVeil=1;target.say('Lady Half-Mask waits behind the hall of unpainted faces.','quest');target.save(true);return}
  if(id==='captain-ruo-capital'){target.data.flags.act4CaptainRuo=1;target.say('Vermilion Ox commands the arsenal floor.','quest');target.save(true);return}
  if(id==='gardener-xu'){if(q['last-emperor-testament']==='active'){target.data.actFour.testament=true;addProof(target,'testament');completeQuest(target,'last-emperor-testament','hall-of-empty-throne',520);return}target.say('The plum ashes have already yielded their final record.','system');return}
  if(id==='memorial-keeper'){if(q['master-shen-memorial']==='available')setQuest(target,'master-shen-memorial','active');target.say('Kang searches the western wall for Master Shen’s stone.','quest');target.save(true);return}
  if(id==='prince-jian-throne'){if(q['mandate-choice']==='active'){target.mode='act-four-choice';target.actFourState.index=Math.max(0,MANDATES.findIndex(item=>item.id===target.data.actFour.mandateChoice));target.sound.sfx('ok');return}target.say('The choice has been made. Now it must survive Sima.','system');return}
  if(id==='master-shen-echo'){target.say('A master is remembered by the lives that continue beyond him.','system');return}
  if(npcEntry.enemy){if(!canFight(target,id))return target.say('This opponent will not face you yet. Follow the tracked quest.','warning');target.beginFight(npcEntry)}
}

function chooseMandate(target,index){const safeIndex=Math.max(0,Math.min(MANDATES.length-1,index));const choice=MANDATES[safeIndex];target.data.actFour.mandateChoice=choice.id;target.actFourState.index=safeIndex;completeQuest(target,'mandate-choice','pale-dragon-chancellor',600);target.mode='explore';target.data.location='green-dragon-terrace';target.data.player.x=80;target.locationFlash=2;target.transition=.8;target.say(`${choice.title} — the mandate is declared.`,'quest');target.save(true);return choice}

function resolveVictory(target,id){
  if(id==='gate-general-xun'){completeQuest(target,'lantern-ward-siege','ten-thousand-petitions',900);rewardWeapon(target,'capital-guardian-halberd');learnStyle(target,'Lantern Ward Boxing');addProof(target,'people');target.data.actFour.chapter=2;return}
  if(id==='fire-tax-collector'){completeQuest(target,'children-of-lanterns',null,420);target.data.actFour.peopleSupport+=2;return}
  if(id==='cipher-eunuch'){completeQuest(target,'ledger-of-stolen-names',null,520);target.data.actFour.peopleSupport++;addProof(target,'names');return}
  if(id==='ashen-crow-commander'){completeQuest(target,'ten-thousand-petitions','masks-at-war',1050);addProof(target,'petitions');target.data.actFour.peopleSupport+=2;return}
  if(id==='lady-half-mask'){completeQuest(target,'masks-at-war','vermilion-arsenal',1200);rewardWeapon(target,'mirror-mask-ribbon');learnStyle(target,'Mirror Mask Steps');target.data.actFour.ghostFaceReformed=true;addProof(target,'masks');target.data.actFour.chapter=3;return}
  if(id==='vermilion-ox'){completeQuest(target,'vermilion-arsenal','last-emperor-testament',1350);rewardWeapon(target,'vermilion-tiger-jian');target.data.actFour.arsenalSecured=true;addProof(target,'army');target.data.actFour.chapter=4;return}
  if(id==='grave-robber-kang'){completeQuest(target,'master-shen-memorial',null,560);target.data.actFour.peopleSupport++;return}
  if(id==='throne-warden'){completeQuest(target,'hall-of-empty-throne','mandate-choice',1500);target.data.actFour.chapter=5;return}
  if(id==='chancellor-sima'){completeQuest(target,'pale-dragon-chancellor',null,3000);rewardWeapon(target,'pale-dragon-sealblade');learnStyle(target,'Mandate Without Throne');target.data.actFour.complete=true;target.data.actFour.chapter=6;target.data.actFour.ending=target.data.actFour.mandateChoice;target.data.legacyReady=true;target.mode='act-four-complete';target.save(true)}
}

function tintAtlas(baseKey,newKey,color,alpha=.42){const source=globalThis.greenDragonAssets?.sprites?.[baseKey];if(!source||typeof document==='undefined'||!document.createElement)return;const canvas=document.createElement('canvas');canvas.width=source.width;canvas.height=source.height;const ctx=canvas.getContext('2d');ctx.drawImage(source,0,0);ctx.globalCompositeOperation='source-atop';ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';globalThis.greenDragonAssets.sprites[newKey]=canvas}
function buildBossArt(){tintAtlas('white-yak-general','gate-general-xun','#586a73',.44);tintAtlas('needle-crow','ashen-crow-commander','#6c6c72',.48);tintAtlas('father-no-face','lady-half-mask','#d9d0c4',.35);tintAtlas('crimson-standard','vermilion-ox','#a3202e',.5);tintAtlas('black-star-abbot','throne-warden','#aa9a78',.4);tintAtlas('regent-han','chancellor-sima','#d6d8dd',.48);tintAtlas('bell-thief','fire-tax-collector','#a94a2c',.4);tintAtlas('censor-wei','cipher-eunuch','#484f76',.4);tintAtlas('deserter-captain','grave-robber-kang','#6b5748',.35)}
function fill(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h)}
function roof(c,x,y,w,color='#382b2b'){c.fillStyle=color;c.beginPath();c.moveTo(x-22,y+28);c.lineTo(x+w/2,y);c.lineTo(x+w+22,y+28);c.closePath();c.fill();fill(c,x,y+26,w,8,'#b2553d')}
function hall(c,x,y,w,h,wall='#76574b'){fill(c,x,y+28,w,h-28,wall);roof(c,x,y,w);for(let i=18;i<w-20;i+=44){fill(c,x+i,y+54,16,h-64,'#292122');fill(c,x+i+4,y+58,8,h-72,'#c6aa6c')}}
function buildStages(){if(typeof document==='undefined'||!document.createElement||!globalThis.greenDragonAssets?.stages)return;const themes=[['stage-capital-east-gate.webp','#87929a','#8a7462','#705044'],['stage-capital-lantern-ward.webp','#876d66','#705448','#65483f'],['stage-capital-petitions.webp','#706a67','#463b36','#65544e'],['stage-capital-mask-temple.webp','#32363e','#4a4140','#494246'],['stage-capital-arsenal.webp','#625b57','#4a3b34','#5c4840'],['stage-capital-garden.webp','#8e8b80','#80705c','#6b5549'],['stage-capital-empty-throne.webp','#4a3e48','#4b3a34','#6d5149'],['stage-capital-green-terrace.webp','#35516a','#625248','#72594e']];themes.forEach(([id,sky,ground,wall],index)=>{const canvas=document.createElement('canvas');canvas.width=960;canvas.height=540;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;fill(c,0,0,960,540,sky);fill(c,0,355,960,185,ground);hall(c,150+(index%3)*45,95+(index%2)*30,660-(index%3)*70,315,wall);for(let i=0;i<10;i++){fill(c,45+i*96,420+(i%2)*12,58,12,index%2?'#9a7b60':'#7c6e62');fill(c,72+i*96,280,5,120,'#362b28')}if(index===1||index===7)for(let i=0;i<8;i++){fill(c,65+i*120,315,20,28,index===7?'#78d39d':'#d24a36');fill(c,71+i*120,320,8,15,'#efb75d')}if(index===2)for(let i=0;i<14;i++){fill(c,170+(i%7)*86,210+Math.floor(i/7)*90,55,65,'#d8c7a2');fill(c,180+(i%7)*86,224+Math.floor(i/7)*90,35,3,'#625449')}if(index===3)for(let i=0;i<10;i++){c.fillStyle=i%2?'#dfd8c8':'#a32e43';c.beginPath();c.arc(250+(i%5)*115,230+Math.floor(i/5)*95,18,0,Math.PI*2);c.fill()}if(index===6){fill(c,397,205,166,165,'#2c2528');fill(c,435,245,90,90,'#a37e49')}globalThis.greenDragonAssets.stages[id]=canvas})}

function panel(ctx,x,y,w,h,alpha=.98){ctx.fillStyle=`rgba(8,9,13,${alpha})`;ctx.fillRect(x,y,w,h);ctx.strokeStyle='#dfbd70';ctx.lineWidth=3;ctx.strokeRect(x+.5,y+.5,w-1,h-1);ctx.strokeStyle='#664b4a';ctx.lineWidth=1;ctx.strokeRect(x+7.5,y+7.5,w-15,h-15)}
function text(ctx,value,x,y,size=16,color='#f2ead4',align='left',font='Georgia'){ctx.fillStyle=color;ctx.font=`${size}px ${font}`;ctx.textAlign=align;ctx.textBaseline='top';ctx.fillText(String(value),x,y)}
function wrap(ctx,value,x,y,width,lineHeight=22,size=15,color='#d8d3c7',limit=8){ctx.font=`${size}px Georgia`;ctx.fillStyle=color;ctx.textAlign='left';let line='',rows=[];for(const word of String(value).split(' ')){const next=line?`${line} ${word}`:word;if(ctx.measureText(next).width>width&&line){rows.push(line);line=word}else line=next}if(line)rows.push(line);rows.slice(0,limit).forEach((row,index)=>ctx.fillText(row,x,y+index*lineHeight))}
function endingText(choice){if(choice==='restoration')return 'Prince Jian accepts a limited crown beneath the late emperor’s testament. The provincial standards remain outside the throne hall as a warning that inheritance cannot erase consent.';if(choice==='council')return 'The throne becomes a chamber for a rotating council. Prince Jian serves as first witness, and the ten thousand petitions become the empire’s founding record.';return 'Shi-An refuses every crown. Authority is divided among provinces, monasteries, villages and the restored order of names. The Green Dragon returns whenever power forgets who it serves.'}
function drawActFour(target){
  const ctx=target.ctx;if(!ctx||!target.data?.actFour)return;
  if(target.mode==='act-three-complete'){ctx.fillStyle='rgba(3,7,10,.93)';ctx.fillRect(140,416,680,42);text(ctx,'ENTER begins Act IV — Mandate of Jade and Ash',480,429,13,'#8ee6ae','center','monospace')}
  if(target.mode==='explore'&&target.data.actFour.unlocked&&!target.actFourState.mode&&!target.enhancement?.mode){panel(ctx,579,121,367,35,.84);text(ctx,`CAPITAL PROOFS ${target.data.actFour.proofs.length}/5 · SUPPORT ${target.data.actFour.peopleSupport}`,592,132,9,'#e1cf9b','left','monospace');text(ctx,'Y MANDATE',932,132,9,'#81e4ab','right','monospace')}
  if(target.mode==='combat'&&target.combat?.mandateBonus)text(ctx,`MANDATE: ${target.combat.mandateBonus.toUpperCase()}`,480,153,9,'#9de9bb','center','monospace');
  if(target.actFourState.mode==='ledger'){ctx.fillStyle='rgba(0,0,0,.78)';ctx.fillRect(0,0,960,540);panel(ctx,105,48,750,442,.99);text(ctx,'MANDATE LEDGER',480,75,32,'#e7c875','center');text(ctx,`PROOFS ${target.data.actFour.proofs.length}/5 · SUPPORT ${target.data.actFour.peopleSupport} · CAPITAL RENOWN ${target.data.reputation.capital||0}`,480,119,10,'#8fe2b0','center','monospace');const rows=[['PEOPLE','people'],['PETITIONS','petitions'],['STOLEN NAMES','names'],['REFORMED MASKS','masks'],['ARSENAL','army'],['TESTAMENT','testament']];rows.forEach(([label,id],index)=>{const y=165+index*42,w=target.data.actFour.proofs.includes(id);text(ctx,label,150,y,15,w?'#8fe4b1':'#9a9c9a');text(ctx,w?'SECURED':'MISSING',805,y+3,10,w?'#8fe4b1':'#9a9c9a','right','monospace')});const choice=MANDATES.find(item=>item.id===target.data.actFour.mandateChoice);text(ctx,choice?`DECLARED: ${choice.title}`:'MANDATE NOT YET DECLARED',480,428,12,choice?'#efcb76':'#c3b89d','center','monospace');text(ctx,'Y / ESC CLOSE',480,460,10,'#c3b89d','center','monospace')}
  if(target.mode==='act-four-choice'){ctx.fillStyle='rgba(0,0,0,.82)';ctx.fillRect(0,0,960,540);panel(ctx,90,48,780,445,.99);text(ctx,'WHAT WILL THE MANDATE SERVE?',480,72,30,'#e8c975','center');MANDATES.forEach((item,index)=>{const y=140+index*92;if(index===target.actFourState.index){ctx.fillStyle='#3b3028';ctx.fillRect(120,y-10,720,75)}text(ctx,item.title,145,y,20,index===target.actFourState.index?'#fff0bd':'#c8c2b3');wrap(ctx,item.detail,145,y+30,510,20,13,'#d7d0bd',2);text(ctx,item.bonus,815,y+30,10,'#8fe3b0','right','monospace')});text(ctx,'UP / DOWN SELECT · ENTER DECLARE',480,458,10,'#c8bda1','center','monospace')}
  if(target.data.actFour.bannerUntil>(target.time||0)){const remaining=target.data.actFour.bannerUntil-(target.time||0),alpha=Math.max(0,Math.min(1,remaining,4-remaining));ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='rgba(0,0,0,.8)';ctx.fillRect(0,0,960,540);panel(ctx,145,160,670,210,.99);text(ctx,'ACT IV',480,188,45,'#8ee6ae','center');text(ctx,'MANDATE OF JADE AND ASH',480,250,26,'#edcb78','center');text(ctx,'A mandate is a duty, not a possession.',480,310,15,'#ddd7c8','center');ctx.restore()}
  if(target.mode==='act-four-complete'){ctx.fillStyle='rgba(0,0,0,.88)';ctx.fillRect(0,0,960,540);panel(ctx,90,50,780,440,.99);text(ctx,'THE GREEN DRAGON RETURNS',480,78,38,'#8fe7b1','center');text(ctx,'CAMPAIGN COMPLETE',480,132,22,'#efcc78','center');wrap(ctx,endingText(target.data.actFour.ending),150,195,660,27,18,'#e4dac4',8);text(ctx,'Legacy Journey unlocked · ENTER returns to the Green Dragon Terrace',480,446,11,'#efd17f','center','monospace')}
}

function patchGame(target){
  ensureActFour(target);
  const baseSave=target.save.bind(target);target.save=function(silent=false){ensureActFour(this);return baseSave(silent)};
  const baseLoad=target.load.bind(target);target.load=function(){const result=baseLoad();ensureActFour(this);return result};
  const baseNew=target.newGame.bind(target);target.newGame=function(){const result=baseNew();ensureActFour(this);return result};
  const basePress=target.press.bind(target);target.press=function(key){if(this.mode==='act-three-complete'&&['Enter','KeyE'].includes(key)){unlockActFour(this,true);return}if(this.mode==='act-four-complete'&&['Enter','KeyE'].includes(key)){this.mode='explore';this.data.location='green-dragon-terrace';this.data.player.x=430;this.save(true);return}if(this.mode==='act-four-choice'){if(['ArrowUp','KeyW'].includes(key)){this.actFourState.index=(this.actFourState.index+MANDATES.length-1)%MANDATES.length;this.sound.sfx('move');return}if(['ArrowDown','KeyS'].includes(key)){this.actFourState.index=(this.actFourState.index+1)%MANDATES.length;this.sound.sfx('move');return}if(['Enter','KeyE'].includes(key)){chooseMandate(this,this.actFourState.index);return}return}if(this.actFourState.mode==='ledger'){if(['Escape','KeyY'].includes(key)){this.actFourState.mode=null;this.sound.sfx('move');this.save(true)}return}if(key==='KeyY'&&this.data.actFour.unlocked&&!['combat','dialogue','victory','defeat'].includes(this.mode)){this.actFourState.mode='ledger';this.sound.sfx('ok');return}return basePress(key)};
  const baseTravel=target.travel.bind(target);target.travel=function(direction){const current=LOCATIONS.findIndex(item=>item.id===this.data.location),next=current+direction;if(next>=ACT_FOUR_START&&!this.data.actFour.unlocked){this.data.player.x=920;this.say('The capital road opens after Regent Han falls.','warning');return}return baseTravel(direction)};
  const baseAfter=target.afterTalk.bind(target);target.afterTalk=function(npcEntry){if(Object.values(ACT_FOUR_NPCS).some(list=>list.some(item=>item.id===npcEntry.id))){handleTalk(this,npcEntry);return}return baseAfter(npcEntry)};
  const baseBegin=target.beginFight.bind(target);target.beginFight=function(npcEntry){baseBegin(npcEntry);const profile=BOSS_PROFILES[npcEntry.id];if(profile&&this.combat){const e=this.combat.enemy;this.combat.enemyProfile=profile.label;e.maxGuard=Math.round(e.maxGuard*(profile.guard||1));e.guard=e.maxGuard;e.maxStamina=Math.round(e.maxStamina*(profile.stamina||1));e.stamina=e.maxStamina;e.power=Math.round((e.power||8)*(profile.power||1));e.chi=Math.max(e.chi,profile.chi||0);if(npcEntry.id==='chancellor-sima')this.combat.timer=150}if(this.combat&&npcEntry.id==='chancellor-sima'){const choice=this.data.actFour.mandateChoice;this.combat.mandateBonus=choice;if(choice==='restoration'){this.combat.player.maxGuard+=28;this.combat.player.guard=this.combat.player.maxGuard;this.combat.player.chi=Math.min(this.combat.player.maxChi,this.combat.player.chi+35)}if(choice==='council'){this.combat.player.maxStamina+=32;this.combat.player.stamina=this.combat.player.maxStamina;this.combat.player.guard=Math.min(this.combat.player.maxGuard,this.combat.player.guard+18)}if(choice==='wanderer'){this.combat.player.power+=7;this.combat.player.maxStamina+=16;this.combat.player.stamina=this.combat.player.maxStamina}}};
  const baseUpdate=target.update.bind(target);target.update=function(dt){baseUpdate(dt);if(this.mode==='combat'&&this.combat?.npc?.id==='chancellor-sima'){const e=this.combat.enemy;if(!this.combat.paleSealOne&&e.hp<=e.maxHp*.62){this.combat.paleSealOne=true;e.power+=7;e.guard=Math.min(e.maxGuard,e.guard+55);e.stamina=e.maxStamina;this.flash('#e1e4e8',.2);this.say('PALE DRAGON SEAL — HISTORY IS MINE','warning')}if(!this.combat.paleSealTwo&&e.hp<=e.maxHp*.28){this.combat.paleSealTwo=true;e.power+=6;e.guard=Math.min(e.maxGuard,e.guard+70);e.stamina=e.maxStamina;e.chi=Math.max(e.chi,80);this.flash('#7fe0a7',.24);this.say('BROKEN MANDATE — THE LAST DECREE','warning')}}};
  const baseFinish=target.finishResult.bind(target);target.finishResult=function(){const victory=this.mode==='victory',id=this.combat?.npc?.id,result=baseFinish();if(victory&&id)resolveVictory(this,id);return result};
  const previousLoop=target.loop.bind(target);target.loop=function(now){previousLoop(now);drawActFour(this)};
}

installContent();buildBossArt();buildStages();patchGame(game);
globalThis.greenDragonActFour={ACT_FOUR_LOCATIONS,ACT_FOUR_QUESTS,GUIDE,MANDATES,unlockActFour,ensureActFour,resolveVictory,chooseMandate};
