import {LOCATIONS,NPCS,QUESTS,ITEMS,WEAPONS} from './content.js';
import {Sound} from './audio.js';
import {render} from './render.js';
import {combatMethods} from './combat.js';

const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d',{alpha:false});
const loading=document.getElementById('loading');
ctx.imageSmoothingEnabled=false;

const SAVE_KEY='greenDragonSave';
const SAVE_VERSION=3;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const questDefaults=()=>Object.fromEntries(QUESTS.map((q,i)=>[q.id,i?'locked':'available']));
const fresh=()=>({
  version:SAVE_VERSION,
  playSeconds:0,
  location:'jade-river',
  player:{x:445,y:454,level:1,exp:0,hp:120,maxHp:120,chi:70,maxChi:70,silver:120,weapon:'training-staff',style:'Green Dragon Fist',power:8,defence:4,speed:7},
  inventory:{'herbal-tonic':2,'rice-bowl':1},
  party:[],
  quests:questDefaults(),
  flags:{},
  defeated:[],
});

const memory={};
const store={
  get:key=>{try{return localStorage.getItem(key)}catch{return memory[key]||null}},
  set:(key,value)=>{try{localStorage.setItem(key,value)}catch{memory[key]=value}},
};

function migrateSave(input){
  const base=fresh();
  if(!input||typeof input!=='object')return base;
  const player={...base.player,...(input.player||{})};
  player.maxHp=Math.max(1,Number(player.maxHp)||base.player.maxHp);
  player.hp=clamp(Number(player.hp)||player.maxHp,1,player.maxHp);
  player.maxChi=Math.max(1,Number(player.maxChi)||base.player.maxChi);
  player.chi=clamp(Number(player.chi)||0,0,player.maxChi);
  player.level=Math.max(1,Math.floor(Number(player.level)||1));
  player.exp=Math.max(0,Math.floor(Number(player.exp)||0));
  player.silver=Math.max(0,Math.floor(Number(player.silver)||0));
  player.x=clamp(Number(player.x)||445,20,940);
  const location=LOCATIONS.some(item=>item.id===input.location)?input.location:base.location;
  return {
    ...base,
    ...input,
    version:SAVE_VERSION,
    location,
    playSeconds:Math.max(0,Number(input.playSeconds)||0),
    player,
    inventory:{...base.inventory,...(input.inventory||{})},
    party:Array.isArray(input.party)?input.party.slice(0,5):[],
    quests:{...base.quests,...(input.quests||{})},
    flags:{...(input.flags||{})},
    defeated:Array.isArray(input.defeated)?[...new Set(input.defeated)]:[],
  };
}

export class Game{
  constructor(){
    this.ctx=ctx;
    this.sound=new Sound;
    this.data=fresh();
    this.hasSave=!!store.get(SAVE_KEY);
    this.mode='title';
    this.time=0;
    this.last=performance.now();
    this.keys={};
    this.titleIndex=0;
    this.facing=1;
    this.walking=false;
    this.locationFlash=2;
    this.dialogue=null;
    this.menu={tab:0,index:0};
    this.shop={index:0};
    this.train={index:0};
    this.combat=null;
    this.particles=[];
    this.worldParticles=[];
    this.floaters=[];
    this.toast='';
    this.toastKind='info';
    this.toastTime=0;
    this.shake=0;
    this.hitStop=0;
    this.screenFlash=0;
    this.screenFlashColor='#ffffff';
    this.transition=0;
    this.footstepTimer=0;
    this.autosaveTimer=0;
    this.questPulse=0;
    this.lessons=[
      ['Willow Step',80,'willow','Speed +1'],
      ['Iron Guard',100,'iron','Defence +1'],
      ['Green Dragon Breath',130,'breath','Maximum Chi +20'],
      ['Staff Circle',150,'staffCircle','Staff damage +3'],
      ['Shaolin Long Fist',180,'shaolin','Power +2'],
    ];
    addEventListener('keydown',event=>{
      if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(event.code))event.preventDefault();
      if(!this.keys[event.code])this.press(event.code);
      this.keys[event.code]=1;
      this.sound.unlock();
    });
    addEventListener('keyup',event=>this.keys[event.code]=0);
    addEventListener('blur',()=>{this.keys={}});
    document.querySelectorAll('[data-key]').forEach(button=>{
      const key=button.dataset.key;
      const down=event=>{
        event.preventDefault();
        button.classList.add('active');
        if(!this.keys[key])this.press(key);
        this.keys[key]=1;
        this.sound.unlock();
      };
      const up=event=>{
        event.preventDefault();
        button.classList.remove('active');
        this.keys[key]=0;
      };
      button.addEventListener('pointerdown',down);
      ['pointerup','pointercancel','pointerleave'].forEach(name=>button.addEventListener(name,up));
    });
  }

  start(){
    loading.style.display='none';
    this.sound.setMusic('village');
    requestAnimationFrame(time=>this.loop(time));
  }

  loop(now){
    const dt=Math.min(.034,(now-this.last)/1000);
    this.last=now;
    this.time+=dt;
    this.update(dt);
    render(this);
    requestAnimationFrame(time=>this.loop(time));
  }

  location(){return LOCATIONS.find(item=>item.id===this.data.location)||LOCATIONS[0]}
  quest(id){return this.data.quests[id]||'locked'}
  setQuest(id,status){this.data.quests[id]=status}

  say(message,kind='info'){
    this.toast=message;
    this.toastKind=kind;
    this.toastTime=2.4;
  }

  flash(color='#ffffff',duration=.1){
    this.screenFlashColor=color;
    this.screenFlash=Math.max(this.screenFlash,duration);
  }

  floatText(text,x,y,color='#fff0bd',size=17){
    this.floaters.push({text,x,y,color,size,life:.85,maxLife:.85});
  }

  save(silent=false){
    this.data.version=SAVE_VERSION;
    store.set(SAVE_KEY,JSON.stringify(this.data));
    this.hasSave=true;
    this.autosaveTimer=0;
    if(!silent)this.say('Journey saved','save');
  }

  load(){
    try{
      const raw=store.get(SAVE_KEY);
      const parsed=raw?JSON.parse(raw):null;
      this.data=migrateSave(parsed);
      this.mode='explore';
      this.locationFlash=2;
      this.transition=.6;
      this.sound.setMusic(this.location().music==='mountain-theme'?'mountain':'village');
      this.say(parsed?.version===SAVE_VERSION?'Journey resumed':'Old save safely upgraded','save');
    }catch(error){
      console.warn('Save could not be loaded',error);
      this.data=fresh();
      this.mode='explore';
      this.say('The old journal was damaged. A new journey begins.','warning');
    }
  }

  newGame(){
    this.data=fresh();
    this.mode='explore';
    this.locationFlash=2;
    this.transition=.65;
    this.save(true);
    this.say('The Green Dragon path begins','quest');
    this.sound.setMusic('village');
  }

  completeQuest(id,nextId,reward=0){
    if(this.quest(id)==='completed')return false;
    this.setQuest(id,'completed');
    if(nextId&&this.quest(nextId)==='locked')this.setQuest(nextId,'active');
    if(reward)this.data.player.silver+=reward;
    this.questPulse=1.8;
    this.sound.sfx('quest');
    const title=QUESTS.find(item=>item.id===id)?.title||'Quest';
    this.say(`${title} completed`,'quest');
    this.save(true);
    return true;
  }

  nearestNpc(){
    let best=null,distance=Infinity;
    for(const npc of NPCS[this.data.location]||[]){
      if(this.data.defeated.includes(npc.id))continue;
      const candidate=Math.abs(npc.x-this.data.player.x);
      if(candidate<distance){distance=candidate;best=npc}
    }
    return best;
  }

  press(key){
    if(key==='KeyP'){
      this.sound.toggle();
      this.say(this.sound.on?'Sound on':'Sound off','system');
      return;
    }
    if(key==='KeyF'){
      const target=document.getElementById('game-shell');
      if(document.fullscreenElement)document.exitFullscreen?.();
      else target?.requestFullscreen?.();
      return;
    }
    if(this.mode==='title')return this.titlePress(key);
    if(this.mode==='dialogue')return this.dialoguePress(key);
    if(this.mode==='menu')return this.menuPress(key);
    if(this.mode==='shop')return this.shopPress(key);
    if(this.mode==='train')return this.trainPress(key);
    if(this.mode==='combat')return this.combatPress(key);
    if(this.mode==='victory'||this.mode==='defeat')return ['Enter','KeyE'].includes(key)&&this.finishResult();
    if(this.mode==='act-complete')return ['Enter','KeyE'].includes(key)&&(this.mode='explore');
    if(['KeyM','Escape'].includes(key)){this.mode='menu';this.menu={tab:0,index:0};return}
    if(key==='KeyE'||key==='Enter')this.interact();
    if(key==='KeyQ')this.useItem('herbal-tonic');
  }

  titlePress(key){
    const options=this.hasSave?['continue','new','chronicle','sound']:['new','chronicle','sound'];
    if(['ArrowUp','KeyW'].includes(key)){this.titleIndex=(this.titleIndex+options.length-1)%options.length;this.sound.sfx('move')}
    if(['ArrowDown','KeyS'].includes(key)){this.titleIndex=(this.titleIndex+1)%options.length;this.sound.sfx('move')}
    if(['Enter','KeyE'].includes(key)){
      const option=options[this.titleIndex];
      this.sound.sfx('ok');
      if(option==='continue')this.load();
      if(option==='new')this.newGame();
      if(option==='chronicle'){this.newGame();this.mode='menu';this.menu={tab:4,index:0}}
      if(option==='sound')this.sound.toggle();
    }
  }

  update(dt){
    if(this.mode!=='title')this.data.playSeconds+=dt;
    this.locationFlash=Math.max(0,this.locationFlash-dt);
    this.toastTime=Math.max(0,this.toastTime-dt);
    this.questPulse=Math.max(0,this.questPulse-dt);
    this.transition=Math.max(0,this.transition-dt);
    this.screenFlash=Math.max(0,this.screenFlash-dt);
    this.shake=Math.max(0,this.shake-dt*28);
    this.autosaveTimer+=this.mode==='explore'?dt:0;
    this.floaters=this.floaters.filter(item=>(item.life-=dt)>0).map(item=>(item.y-=28*dt,item));
    this.particles=this.particles.filter(item=>(item.life-=dt)>0).map(item=>(item.x+=item.vx*dt,item.y+=item.vy*dt,item.vy+=80*dt,item));
    this.worldParticles=this.worldParticles.filter(item=>(item.life-=dt)>0).map(item=>(item.x+=item.vx*dt,item.y+=item.vy*dt,item));
    if(this.autosaveTimer>25)this.save(true);
    if(this.hitStop>0){this.hitStop=Math.max(0,this.hitStop-dt);return}
    if(this.mode==='explore')this.updateExplore(dt);
    if(this.mode==='dialogue')this.dialogue.reveal+=dt*52;
    if(this.mode==='combat')this.updateCombat(dt);
  }

  updateExplore(dt){
    let direction=0;
    if(this.keys.KeyA||this.keys.ArrowLeft)direction--;
    if(this.keys.KeyD||this.keys.ArrowRight)direction++;
    this.walking=!!direction;
    if(direction){
      this.facing=direction;
      this.data.player.x+=direction*(145+this.data.player.speed*4)*dt;
      this.footstepTimer-=dt;
      if(this.footstepTimer<=0){
        this.footstepTimer=.2;
        this.worldParticles.push({x:this.data.player.x-direction*10,y:452,vx:-direction*(18+Math.random()*18),vy:-8-Math.random()*12,size:3+Math.random()*4,color:'rgba(214,190,135,.55)',life:.35});
        this.sound.step();
      }
    }else this.footstepTimer=0;
    if(this.data.player.x<10)this.travel(-1);
    if(this.data.player.x>950)this.travel(1);
  }

  travel(direction){
    const current=LOCATIONS.findIndex(item=>item.id===this.data.location);
    const next=clamp(current+direction,0,LOCATIONS.length-1);
    if(next===current){
      this.data.player.x=direction<0?20:940;
      this.say('The road beyond is not open yet.','system');
      return;
    }
    this.data.location=LOCATIONS[next].id;
    this.data.player.x=direction>0?40:920;
    this.locationFlash=2;
    this.transition=.75;
    this.worldParticles=[];
    this.sound.setMusic(this.location().music==='mountain-theme'?'mountain':'village');
    this.save(true);
  }

  interact(){
    const npc=this.nearestNpc();
    if(!npc||Math.abs(npc.x-this.data.player.x)>92)return this.say('No one is close enough to speak with.','system');
    this.dialogue={npc,lines:npc.lines,index:0,reveal:0};
    this.mode='dialogue';
    this.sound.sfx('ok');
  }

  dialoguePress(key){
    if(!['Enter','KeyE','Space'].includes(key))return;
    const dialogue=this.dialogue;
    const line=dialogue.lines[dialogue.index];
    if(dialogue.reveal<line.length){dialogue.reveal=999;return}
    if(++dialogue.index<dialogue.lines.length){dialogue.reveal=0;this.sound.sfx('move');return}
    const npc=dialogue.npc;
    this.mode='explore';
    this.dialogue=null;
    this.afterTalk(npc);
  }

  afterTalk(npc){
    const id=npc.id;
    if(id==='elder-zhao')this.completeQuest('ashes','footprints',60);
    if(id==='hunter-fong')this.completeQuest('footprints','teahouse',90);
    if(id==='tea-lian')this.completeQuest('teahouse','ambush',120);
    if(id==='mei-lin')this.recruit(npc,'White Crane Wing');
    if(id==='bo')this.recruit(npc,'Iron Ox Body');
    if(['merchant-han','broker-qiu'].includes(id)){this.shop={index:0};this.mode='shop'}
    if(['hermit-reed','abbot-wu'].includes(id)){this.train={index:0};this.mode='train'}
    if(id==='abbot-wu'&&this.quest('ambush')==='completed'&&this.quest('silent-bell')==='locked')this.setQuest('silent-bell','active');
    if(npc.enemy)this.beginFight(npc);
    if(id==='white-brow'){
      if(this.quest('faceless')==='locked')this.setQuest('faceless','active');
      this.say('The executioner waits at the far end of the walkway.','quest');
    }
  }

  recruit(npc,style){
    if(this.data.party.some(member=>member.id===npc.id))return this.say(`${npc.name.split(' “')[0]} already travels with you.`,'system');
    if(this.data.party.length>=5)return this.say('Your five companion places are full.','warning');
    this.data.party.push({id:npc.id,name:npc.name,variant:npc.variant,sprite:npc.id,style});
    this.sound.sfx('recruit');
    this.flash('#78f39a',.18);
    this.say(`${npc.name.split(' “')[0]} joined the party.`,'recruit');
    if(this.data.party.length>=2)this.completeQuest('five-shadows',null,0);
    this.save(true);
  }

  useItem(id){
    if(!(this.data.inventory[id]>0))return this.say('You do not have that item.','warning');
    const player=this.data.player,item=ITEMS.find(entry=>entry.id===id);
    if(!item)return;
    if(item.effect.startsWith('heal'))player.hp=Math.min(player.maxHp,player.hp+(item.effect==='heal'?35:18));
    if(item.effect==='chi')player.chi=Math.min(player.maxChi,player.chi+30);
    this.data.inventory[id]--;
    this.sound.sfx('heal');
    this.flash('#74e69a',.12);
    this.say(`${item.name} used.`,'item');
  }

  menuPress(key){
    if(key==='Escape'||key==='KeyM'){this.mode='explore';return}
    if(key==='KeyQ'){this.menu.tab=(this.menu.tab+5)%6;this.menu.index=0}
    if(key==='KeyE'){this.menu.tab=(this.menu.tab+1)%6;this.menu.index=0}
    if(['ArrowUp','KeyW'].includes(key))this.menu.index=Math.max(0,this.menu.index-1);
    if(['ArrowDown','KeyS'].includes(key))this.menu.index++;
    if(key==='Enter'&&this.menu.tab===0){
      const ids=Object.keys(this.data.inventory).filter(id=>this.data.inventory[id]>0);
      if(ids.length)this.useItem(ids[this.menu.index%ids.length]);
    }
  }

  shopPress(key){
    const stock=[...ITEMS,...WEAPONS.slice(0,5)];
    if(key==='Escape'){this.mode='explore';return}
    if(['ArrowUp','KeyW'].includes(key))this.shop.index=(this.shop.index+stock.length-1)%stock.length;
    if(['ArrowDown','KeyS'].includes(key))this.shop.index=(this.shop.index+1)%stock.length;
    if(key==='Enter'||key==='KeyE'){
      const item=stock[this.shop.index];
      if(this.data.player.silver<item.price)return this.say('Not enough silver.','warning');
      this.data.player.silver-=item.price;
      if('kind'in item){this.data.player.weapon=item.id;this.say(`${item.name} equipped.`,'item')}
      else{this.data.inventory[item.id]=(this.data.inventory[item.id]||0)+1;this.say(`${item.name} purchased.`,'item')}
      this.sound.sfx('coin');
      this.save(true);
    }
  }

  trainPress(key){
    if(key==='Escape'){this.mode='explore';return}
    if(['ArrowUp','KeyW'].includes(key))this.train.index=(this.train.index+this.lessons.length-1)%this.lessons.length;
    if(['ArrowDown','KeyS'].includes(key))this.train.index=(this.train.index+1)%this.lessons.length;
    if(key==='Enter'||key==='KeyE'){
      const [name,cost,flag]=this.lessons[this.train.index],player=this.data.player;
      if(this.data.flags[flag])return this.say('You already mastered this lesson.','system');
      if(player.silver<cost)return this.say('You need more silver for this training.','warning');
      player.silver-=cost;
      this.data.flags[flag]=1;
      if(flag==='willow')player.speed++;
      if(flag==='iron')player.defence++;
      if(flag==='breath'){player.maxChi+=20;player.chi=player.maxChi}
      if(flag==='staffCircle')player.power+=3;
      if(flag==='shaolin'){player.power+=2;player.style='Shaolin Long Fist'}
      this.sound.sfx('train');
      this.flash('#f0c96c',.18);
      this.say(`${name} mastered.`,'quest');
      this.save(true);
    }
  }
}

Object.assign(Game.prototype,combatMethods);
const game=new Game;
globalThis.greenDragonGame=game;
game.start();
