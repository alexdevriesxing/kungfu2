import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const fail=message=>{throw new Error(message)};

const game=read('src/game.js');
for(const feature of ['SAVE_VERSION=3','migrateSave','completeQuest','hitStop','worldParticles','floatText']){
  if(!game.includes(feature))fail(`Game polish missing: ${feature}`);
}
if(!game.includes("if(this.quest(id)==='completed')return false"))fail('Quest rewards are not protected from repeat farming.');

const combat=read('src/combat.js');
for(const feature of ['parryWindow','queuedTime','PERFECT PARRY','bestCombo','xpReward','hitStop']){
  if(!combat.includes(feature))fail(`Combat polish missing: ${feature}`);
}
if(!combat.includes('chiCost:30'))fail('Chi attacks are not costed inside the attack system.');

const render=read('src/render.js');
for(const feature of ['ambient(','labelledBar','screenFx','RANK ${battle.rank}','DANGER']){
  if(!render.includes(feature))fail(`Presentation polish missing: ${feature}`);
}

const audio=read('src/audio.js');
for(const cue of ['parry','guardbreak','recruit','level','gong']){
  if(!audio.includes(`${cue}:`))fail(`Audio cue missing: ${cue}`);
}

const index=read('index.html');
if(!index.includes('loading-fill'))fail('Loading presentation has no visual progress fill.');
for(const key of ['KeyQ','KeyM','KeyI','KeyU'])if(!index.includes(`data-key="${key}"`))fail(`Touch control missing: ${key}`);

const css=read('styles.css');
if(!css.includes('grid-template-columns:repeat(4'))fail('Premium mobile action controls are not arranged as a four-column wuxia pad.');
for(const feature of ['orientation-hint','ambientSilk','clip-path:polygon','--cinnabar'])if(!css.includes(feature))fail(`Wuxia shell polish missing: ${feature}`);

console.log('Polish validation passed.');
