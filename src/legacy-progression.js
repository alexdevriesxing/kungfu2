const game=globalThis.greenDragonGame;
const api=globalThis.greenDragonLegacy;

function ensureApplied(target=game){
  if(!target.data?.legacy)return;
  target.data.legacy.blessings={vitality:0,breath:0,resolve:0,...(target.data.legacy.blessings||{})};
  target.data.legacy.appliedBlessings={
    vitality:target.data.legacy.blessings.vitality||0,
    breath:target.data.legacy.blessings.breath||0,
    resolve:target.data.legacy.blessings.resolve||0,
    ...(target.data.legacy.appliedBlessings||{}),
  };
}

function spendLegacyBlessing(target=game,id){
  api.ensureLegacy(target);ensureApplied(target);
  const blessing=api.BLESSINGS.find(item=>item.id===id);
  if(!blessing)return false;
  const current=target.data.legacy.blessings[id]||0;
  const cost=blessing.baseCost+current*2;
  if(target.data.legacy.essence<cost){target.say(`Requires ${cost} Legacy Essence.`,'warning');return false}
  target.data.legacy.essence-=cost;
  target.data.legacy.blessings[id]=current+1;
  target.data.legacy.appliedBlessings[id]=current+1;
  if(id==='vitality'){target.data.player.maxHp+=10;target.data.player.hp=target.data.player.maxHp}
  if(id==='breath'){target.data.player.maxChi+=6;target.data.player.chi=target.data.player.maxChi}
  if(id==='resolve'){target.data.player.power++;target.data.player.defence++}
  target.legacyBlessingMarker=`${target.data.legacy.blessings.vitality}:${target.data.legacy.blessings.breath}:${target.data.legacy.blessings.resolve}:${target.data.legacy.cycle}`;
  target.say(`${blessing.name} rank ${current+1} awakened.`,'quest');
  target.sound.sfx('train');target.save(true);return true;
}

ensureApplied(game);
const baseSave=game.save.bind(game);game.save=function(silent=false){ensureApplied(this);return baseSave(silent)};
const baseLoad=game.load.bind(game);game.load=function(){const result=baseLoad();ensureApplied(this);return result};
const baseNew=game.newGame.bind(game);game.newGame=function(){const result=baseNew();ensureApplied(this);return result};
const basePress=game.press.bind(game);game.press=function(key){
  if(this.legacyState?.mode==='blessings'&&['Enter','KeyE'].includes(key)){
    const blessing=api.BLESSINGS[this.legacyState.index];
    if(blessing)spendLegacyBlessing(this,blessing.id);
    return;
  }
  return basePress(key);
};
api.spendBlessing=spendLegacyBlessing;
api.ensureAppliedBlessings=ensureApplied;
