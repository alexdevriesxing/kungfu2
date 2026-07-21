const game=globalThis.greenDragonGame;

function syncCommonFolk(target=game){
  const reputation=target.data.reputation||(target.data.reputation={});
  const value=Math.max(0,Number(reputation.commonfolk)||0,Number(reputation.commonFolk)||0);
  reputation.commonfolk=value;
  reputation.commonFolk=value;
  return value;
}

function patch(target){
  syncCommonFolk(target);
  const baseSave=target.save.bind(target);
  target.save=function(silent=false){syncCommonFolk(this);return baseSave(silent)};
  const baseLoad=target.load.bind(target);
  target.load=function(){const result=baseLoad();syncCommonFolk(this);this.save(true);return result};
  const baseNewGame=target.newGame.bind(target);
  target.newGame=function(){const result=baseNewGame();syncCommonFolk(this);this.save(true);return result};
  const baseAfterTalk=target.afterTalk.bind(target);
  target.afterTalk=function(npc){syncCommonFolk(this);const result=baseAfterTalk(npc);syncCommonFolk(this);return result};
  const baseFinishResult=target.finishResult.bind(target);
  target.finishResult=function(){const result=baseFinishResult();syncCommonFolk(this);this.save(true);return result};
}

patch(game);
globalThis.greenDragonActTwoCompat={syncCommonFolk};
