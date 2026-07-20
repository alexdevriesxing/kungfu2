import {WEAPONS} from './content.js';

const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const ready=fighter=>['idle','walk','block'].includes(fighter.action)&&fighter.stun<=0;
const art=(id,fallback)=>globalThis.greenDragonAssets?.sprites?.[id]?id:fallback;

const ATTACKS={
  punch:{cost:9,hitAt:.13,duration:.31,range:66,damage:12,guard:17,knockback:20,hitStop:.035},
  kick:{cost:15,hitAt:.19,duration:.45,range:91,damage:18,guard:24,knockback:34,hitStop:.05},
  sword:{cost:18,hitAt:.19,duration:.48,range:119,damage:23,guard:27,knockback:31,hitStop:.06},
  staff:{cost:19,hitAt:.21,duration:.5,range:132,damage:21,guard:30,knockback:39,hitStop:.06},
  chi:{cost:0,chiCost:30,hitAt:.24,duration:.61,range:158,damage:31,guard:42,knockback:57,hitStop:.085},
};

const combatant=(source,extra)=>({
  ...source,
  ...extra,
  action:'idle',
  actionTime:0,
  hit:false,
  block:false,
  wasBlocking:false,
  stamina:100,
  maxStamina:100,
  guard:100,
  maxGuard:100,
  invulnerable:0,
  evadeCooldown:0,
  parryWindow:0,
  stun:0,
  hitFlash:0,
  queued:null,
  queuedTime:0,
});

export const combatMethods={
  beginFight(npc){
    const player=this.data.player;
    const enemy=npc.enemy;
    const weapon=WEAPONS.find(item=>item.id===player.weapon);
    this.combat={
      npc,
      timer:90,
      intro:1.25,
      combo:0,
      comboTime:0,
      bestCombo:0,
      reward:enemy.reward||80,
      xpReward:Math.max(45,(enemy.level||1)*42+(enemy.boss?90:0)),
      assistUsed:{},
      winner:null,
      resultDelay:0,
      rank:'C',
      player:combatant(player,{
        name:'Shi-An',sprite:art('shi-an',null),x:340,y:454,dir:1,variant:'atlas',
        hp:player.hp,maxHp:player.maxHp,chi:player.chi,maxChi:player.maxChi,
        power:player.power,defence:player.defence,weapon:weapon?.kind||'staff',
      }),
      enemy:combatant(enemy,{
        sprite:art(npc.id,null),x:620,y:454,dir:-1,
        hp:enemy.maxHp,maxHp:enemy.maxHp,chi:40,maxChi:60,defence:Math.max(2,enemy.level),
      }),
    };
    this.mode='combat';
    this.particles=[];
    this.floaters=[];
    this.transition=.55;
    this.sound.setMusic('battle');
    this.sound.sfx('gong');
  },

  combatPress(key){
    const battle=this.combat,player=battle?.player;
    if(!player||battle.winner)return;
    if(key==='KeyJ')this.queueAttack(player,'punch');
    if(key==='KeyK')this.queueAttack(player,'kick');
    if(key==='KeyL')this.queueAttack(player,player.weapon==='sword'?'sword':'staff');
    if(key==='KeyI')this.queueAttack(player,'chi');
    if(key==='KeyW'&&ready(player)){player.action='jump';player.actionTime=0;player.block=false}
    if(key==='Space')this.evade(player);
    if(key==='KeyU')this.throwFighter(player,battle.enemy,true);
    if(/^Digit[1-4]$/.test(key))this.assist(+key.slice(-1)-1);
  },

  queueAttack(fighter,action){
    if(this.attack(fighter,action))return true;
    fighter.queued=action;
    fighter.queuedTime=.2;
    return false;
  },

  attack(fighter,action){
    const spec=ATTACKS[action];
    if(!spec||!ready(fighter)||fighter.stamina<spec.cost)return false;
    if(spec.chiCost&&fighter.chi<spec.chiCost)return false;
    fighter.stamina-=spec.cost;
    if(spec.chiCost)fighter.chi-=spec.chiCost;
    fighter.action=action;
    fighter.actionTime=0;
    fighter.hit=false;
    fighter.block=false;
    fighter.wasBlocking=false;
    fighter.queued=null;
    fighter.queuedTime=0;
    this.sound.sfx(action==='chi'?'chi':action);
    return true;
  },

  evade(fighter){
    if(!ready(fighter)||fighter.evadeCooldown>0||fighter.stamina<21)return false;
    fighter.stamina-=21;
    fighter.evadeCooldown=.52;
    fighter.invulnerable=.28;
    fighter.block=false;
    fighter.wasBlocking=false;
    fighter.action='crouch';
    fighter.actionTime=0;
    fighter.x=clamp(fighter.x-fighter.dir*68,70,890);
    this.sound.sfx('evade');
    this.burst(fighter.x,fighter.y-20,'#c7e6d2',8,'dust');
    return true;
  },

  throwFighter(attacker,target,byPlayer){
    if(!ready(attacker)||attacker.stamina<28||Math.abs(attacker.x-target.x)>78||target.invulnerable>0||attacker.stun>0)return false;
    attacker.stamina-=28;
    attacker.action='punch';
    attacker.actionTime=.06;
    attacker.hit=true;
    attacker.block=false;
    attacker.queued=null;
    const bonus=target.block?10:0;
    const damage=Math.max(8,15+attacker.power-Math.floor((target.defence||0)*.35)+bonus);
    target.block=false;
    target.wasBlocking=false;
    target.guard=Math.max(0,target.guard-38);
    target.hp=Math.max(0,target.hp-damage);
    target.action='hurt';
    target.actionTime=0;
    target.hit=false;
    target.stun=.28;
    target.hitFlash=.14;
    target.x=clamp(target.x+attacker.dir*82,70,890);
    this.hitStop=.075;
    this.shake=11;
    this.flash('#f1d37b',.08);
    this.floatText(`THROW  ${damage}`,target.x,target.y-142,'#f1d37b',18);
    this.burst(target.x,target.y-95,'#f0c96c',16,'impact');
    this.sound.sfx('throw');
    if(byPlayer){this.addCombo(1);attacker.chi=Math.min(attacker.maxChi,attacker.chi+10)}
    return true;
  },

  assist(index){
    const battle=this.combat,ally=this.data.party[index];
    if(!ally||battle.assistUsed[index]||battle.winner)return;
    battle.assistUsed[index]=1;
    const damage=18+index*3;
    battle.enemy.hp=Math.max(0,battle.enemy.hp-damage);
    battle.enemy.guard=Math.max(0,battle.enemy.guard-22);
    battle.enemy.hitFlash=.16;
    battle.enemy.stun=.2;
    this.hitStop=.065;
    this.shake=8;
    this.burst(battle.enemy.x,battle.enemy.y-110,'#72ef92',16,'chi');
    this.floatText(`${ally.name.split(' “')[0]} +${damage}`,battle.enemy.x,battle.enemy.y-150,'#72ef92',16);
    this.say(`${ally.name.split(' “')[0]} assists!`,'recruit');
    this.sound.sfx('assist');
    this.addCombo(1);
  },

  addCombo(amount=1){
    const battle=this.combat;
    battle.combo+=amount;
    battle.bestCombo=Math.max(battle.bestCombo,battle.combo);
    battle.comboTime=1.15;
  },

  updateCombat(dt){
    const battle=this.combat;
    if(!battle)return;
    battle.intro=Math.max(0,battle.intro-dt);
    battle.timer-=dt;
    battle.comboTime-=dt;
    if(battle.comboTime<=0)battle.combo=0;
    const player=battle.player,enemy=battle.enemy;

    for(const fighter of [player,enemy]){
      const regen=fighter.block?8:25;
      fighter.stamina=Math.min(fighter.maxStamina,fighter.stamina+regen*dt);
      if(!fighter.block&&fighter.stun<=0)fighter.guard=Math.min(fighter.maxGuard,fighter.guard+8*dt);
      fighter.invulnerable=Math.max(0,fighter.invulnerable-dt);
      fighter.evadeCooldown=Math.max(0,fighter.evadeCooldown-dt);
      fighter.parryWindow=Math.max(0,fighter.parryWindow-dt);
      fighter.stun=Math.max(0,fighter.stun-dt);
      fighter.hitFlash=Math.max(0,fighter.hitFlash-dt);
      fighter.queuedTime=Math.max(0,fighter.queuedTime-dt);
      if(fighter.queuedTime<=0)fighter.queued=null;
    }

    player.dir=player.x<enemy.x?1:-1;
    enemy.dir=enemy.x<player.x?1:-1;

    if(!battle.winner){
      let movement=0;
      if(this.keys.KeyA||this.keys.ArrowLeft)movement--;
      if(this.keys.KeyD||this.keys.ArrowRight)movement++;
      if(movement&&ready(player)&&player.stamina>0){
        player.x=clamp(player.x+movement*195*dt,80,880);
        player.action='walk';
        player.stamina=Math.max(0,player.stamina-3.5*dt);
      }else if(player.action==='walk')player.action='idle';

      const wantsBlock=!!this.keys.KeyS&&ready(player)&&player.guard>0;
      if(wantsBlock){
        if(!player.wasBlocking)player.parryWindow=.115;
        player.block=true;
        player.wasBlocking=true;
        player.action='block';
      }else{
        player.block=false;
        player.wasBlocking=false;
        if(player.action==='block')player.action='idle';
      }

      this.ai(dt);
      this.tickFighter(player,enemy,dt,true);
      this.tickFighter(enemy,player,dt,false);

      if(battle.timer<=0||player.hp<=0||enemy.hp<=0){
        battle.winner=enemy.hp<=0||player.hp>enemy.hp?'player':'enemy';
        battle.resultDelay=.72;
        if(battle.winner==='player'){
          const healthRatio=player.hp/player.maxHp;
          battle.rank=healthRatio>.8&&battle.bestCombo>=4?'S':healthRatio>.55?'A':healthRatio>.3?'B':'C';
        }
      }
    }else if((battle.resultDelay-=dt)<=0){
      this.mode=battle.winner==='player'?'victory':'defeat';
      this.sound.sfx(battle.winner==='player'?'victory':'defeat');
    }
  },

  ai(dt){
    const battle=this.combat,enemy=battle.enemy,player=battle.player;
    if(!ready(enemy)||enemy.stun>0)return;
    const distance=Math.abs(enemy.x-player.x);
    const boss=battle.npc.enemy?.boss;
    const pressure=boss?2.15:1.72;
    if(enemy.stamina<18&&distance<145){enemy.x=clamp(enemy.x-Math.sign(player.x-enemy.x)*62*dt,80,880);return}
    if(player.action&&!ready(player)&&Math.random()<dt*(boss?1.15:.72)&&distance<135&&enemy.evadeCooldown<=0){this.evade(enemy);return}
    if(Math.random()<dt*(distance<155?pressure:.58)){
      if(distance>155)enemy.x+=Math.sign(player.x-enemy.x)*(boss?115:96)*dt;
      else if(player.block&&Math.random()<.42)this.throwFighter(enemy,player,false);
      else if(Math.random()<.24&&enemy.guard>24){
        if(!enemy.wasBlocking)enemy.parryWindow=.09;
        enemy.block=true;enemy.wasBlocking=true;enemy.action='block';
      }else if(enemy.chi>=30&&boss&&Math.random()<.18)this.attack(enemy,'chi');
      else this.attack(enemy,Math.random()<.3&&enemy.weapon?enemy.weapon:Math.random()<.53?'punch':'kick');
    }else if(distance>118)enemy.x+=Math.sign(player.x-enemy.x)*58*dt;
    else if(enemy.block&&Math.random()<dt*2){enemy.block=false;enemy.wasBlocking=false;enemy.action='idle'}
  },

  tickFighter(fighter,opponent,dt,isPlayer){
    if(ready(fighter)){
      if(fighter.queued&&fighter.queuedTime>0)this.attack(fighter,fighter.queued);
      return;
    }
    if(fighter.stun>0)return;
    fighter.actionTime+=dt;
    if(fighter.action==='crouch'){
      if(fighter.actionTime>=.28){fighter.action='idle';fighter.actionTime=0}
      return;
    }
    const spec=ATTACKS[fighter.action]||{hitAt:99,duration:fighter.action==='jump'?.62:.28,range:0,damage:0,guard:0,knockback:0,hitStop:0};
    if(!fighter.hit&&fighter.actionTime>=spec.hitAt){
      fighter.hit=true;
      if(spec.range&&Math.abs(fighter.x-opponent.x)<spec.range){
        const comboScale=isPlayer?Math.max(.72,1-(this.combat.combo-1)*.035):1;
        const damage=Math.max(1,Math.round((spec.damage+fighter.power-(opponent.defence||0))*comboScale));
        this.hit(opponent,damage,isPlayer,fighter,spec);
      }else if(isPlayer)this.floatText('MISS',fighter.x+fighter.dir*70,fighter.y-110,'#9aa89e',12);
    }
    if(fighter.actionTime>=spec.duration){
      fighter.action='idle';fighter.actionTime=0;fighter.hit=false;
      if(fighter.queued&&fighter.queuedTime>0)this.attack(fighter,fighter.queued);
    }
  },

  hit(target,damage,byPlayer,attacker,spec){
    if(target.invulnerable>0){
      this.burst(target.x,target.y-90,'#d5eee0',6,'dust');
      this.floatText('EVADE',target.x,target.y-135,'#d5eee0',14);
      return;
    }

    if(target.block&&target.parryWindow>0){
      target.parryWindow=0;
      target.guard=Math.min(target.maxGuard,target.guard+10);
      target.chi=Math.min(target.maxChi,target.chi+8);
      attacker.stun=.34;
      attacker.action='hurt';attacker.actionTime=0;attacker.hit=false;
      attacker.x=clamp(attacker.x+target.dir*28,70,890);
      this.hitStop=.07;this.shake=5;this.flash('#dfffcf',.075);
      this.burst(target.x,target.y-103,'#dfffcf',12,'spark');
      this.floatText('PERFECT PARRY',target.x,target.y-155,'#dfffcf',17);
      this.sound.sfx('parry');
      return;
    }

    let blocked=false;
    if(target.block&&target.guard>0){
      blocked=true;
      target.guard=Math.max(0,target.guard-(spec.guard||damage*2));
      damage=Math.ceil(damage*.23);
      this.sound.sfx('block');
      if(target.guard<=0){
        blocked=false;damage=Math.max(damage,11);target.block=false;target.wasBlocking=false;target.stun=.48;
        this.say('Guard broken!','warning');
        this.floatText('GUARD BREAK',target.x,target.y-157,'#ffd36f',17);
        this.sound.sfx('guardbreak');
      }
    }else this.sound.sfx('hit');

    target.hp=Math.max(0,target.hp-damage);
    target.action='hurt';target.actionTime=0;target.hit=false;target.hitFlash=.13;
    const push=blocked?(spec.knockback||20)*.35:(spec.knockback||20);
    target.x=clamp(target.x+attacker.dir*push,70,890);
    this.hitStop=blocked?.025:(spec.hitStop||.045);
    this.shake=blocked?4:Math.min(13,6+damage*.16);
    this.flash(blocked?'#e5d179':'#ffffff',blocked?.035:.055);
    this.burst(target.x,target.y-100,blocked?'#e5d179':'#ef694e',blocked?8:12,blocked?'spark':'impact');
    this.floatText(String(damage),target.x,target.y-138,blocked?'#e5d179':'#fff1c2',blocked?14:18);
    if(byPlayer){this.addCombo(1);this.combat.player.chi=Math.min(this.combat.player.maxChi,this.combat.player.chi+(blocked?3:6))}
    else target.chi=Math.min(target.maxChi,target.chi+2);
  },

  burst(x,y,color,count,kind='impact'){
    for(let index=0;index<count;index++){
      const angle=Math.random()*Math.PI*2;
      const speed=(kind==='chi'?115:kind==='dust'?55:165)*(0.45+Math.random()*.75);
      this.particles.push({
        x:x+(Math.random()-.5)*24,y:y+(Math.random()-.5)*30,
        vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-(kind==='dust'?8:22),
        size:(kind==='spark'?2:3)+Math.random()*(kind==='chi'?8:6),color,kind,life:.28+Math.random()*.38,
      });
    }
  },

  finishResult(){
    const battle=this.combat;
    if(this.mode==='defeat'){
      this.data.player.hp=this.data.player.maxHp;
      this.data.player.chi=this.data.player.maxChi;
      this.data.player.silver=Math.max(0,this.data.player.silver-Math.min(25,Math.floor(this.data.player.silver*.05)));
      this.mode='explore';this.combat=null;this.transition=.5;
      this.say('You awaken at a roadside shrine.','warning');
      this.sound.setMusic(this.location().music==='mountain-theme'?'mountain':'village');
      this.save(true);
      return;
    }

    const id=battle.npc.id,player=this.data.player;
    player.hp=Math.max(1,battle.player.hp);
    player.chi=battle.player.chi;
    player.silver+=battle.reward;
    player.exp+=battle.xpReward;
    let levels=0;
    while(player.exp>=player.level*100){
      player.exp-=player.level*100;player.level++;player.maxHp+=12;player.maxChi+=6;player.power++;player.defence++;
      player.hp=player.maxHp;player.chi=player.maxChi;levels++;
    }
    if(levels){this.flash('#7bf39d',.2);this.sound.sfx('level');this.say(`Level ${player.level}! Strength and spirit increased.`,'quest')}
    if(!this.data.defeated.includes(id))this.data.defeated.push(id);
    if(id==='kuo'){this.setQuest('ambush','completed');this.setQuest('silent-bell','active')}
    if(id==='novice-jin'){this.setQuest('silent-bell','completed');this.setQuest('five-shadows','active');player.style='Shaolin Long Fist'}
    if(id==='ghost-face'){this.setQuest('faceless','completed');this.mode='act-complete'}
    else this.mode='explore';
    this.combat=null;this.transition=.6;this.save(true);
    this.sound.setMusic(this.location().music==='mountain-theme'?'mountain':'village');
  },
};
