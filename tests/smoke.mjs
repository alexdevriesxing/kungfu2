/**
 * Dependency-free smoke test for the browser game state machine.
 * It supplies minimal DOM/canvas/audio shims, boots the real modules, and
 * exercises exploration, dialogue, quest, party, shop, combat, render and save.
 */
const noop = () => {};
const gradient = { addColorStop: noop };
const context = new Proxy({
  imageSmoothingEnabled: false,
  measureText: value => ({ width: String(value).length * 9 }),
  createLinearGradient: () => gradient,
}, {
  get: (target, property) => property in target ? target[property] : noop,
  set: (target, property, value) => (target[property] = value, true),
});

const canvas = { width: 960, height: 540, getContext: () => context };
const loading = { style: { display: 'block' } };
const progress = { textContent: '' };

globalThis.document = {
  getElementById: id => id === 'game' ? canvas : id === 'loading' ? loading : progress,
  querySelectorAll: () => [],
  createElement: () => ({ width: 0, height: 0, getContext: () => context }),
};
globalThis.window = globalThis;
globalThis.addEventListener = noop;
globalThis.requestAnimationFrame = () => 0;

const store = new Map();
globalThis.localStorage = {
  getItem: key => store.get(key) ?? null,
  setItem: (key, value) => store.set(key, String(value)),
};

class FakeImage {
  constructor() { this.width = 1024; this.height = 840; }
  set src(value) { this._src = value; queueMicrotask(() => this.onload?.()); }
  get src() { return this._src; }
}
globalThis.Image = FakeImage;

class FakeAudio {
  constructor(src = '') { this.src = src; this.dataset = {}; this.currentTime = 0; }
  play() { return Promise.resolve(); }
  pause() {}
  cloneNode() { return new FakeAudio(this.src); }
}
globalThis.Audio = FakeAudio;

await import('../src/game.js');
await new Promise(resolve => setTimeout(resolve, 20));

const game = globalThis.greenDragonGame;
const passed = [];
const check = (name, condition, detail = '') => {
  if (!condition) throw new Error(`${name} failed${detail ? `: ${detail}` : ''}`);
  passed.push(name);
};

check('game initializes', Boolean(game));
check('title mode', game.mode === 'title', game.mode);
check('loading overlay hidden', loading.style.display === 'none');

game.newGame();
check('new journey enters exploration', game.mode === 'explore');
check('starts in Jade River', game.data.location === 'jade-river');

game.data.player.x = 250;
game.interact();
check('Elder Zhao dialogue opens', game.mode === 'dialogue' && game.dialogue.npc.id === 'elder-zhao');
while (game.mode === 'dialogue') {
  game.dialogue.reveal = 9999;
  game.dialoguePress('Enter');
}
check('first quest completes', game.quest('ashes') === 'completed');
check('next investigation activates', game.quest('footprints') === 'active');

game.data.player.x = 520;
game.interact();
while (game.mode === 'dialogue') {
  game.dialogue.reveal = 9999;
  game.dialoguePress('Enter');
}
check('Mei Lin recruited', game.data.party.some(member => member.name.includes('Mei Lin')));

game.mode = 'explore';
game.data.location = 'market-street';
game.data.player.x = 760;
game.interact();
while (game.mode === 'dialogue') {
  game.dialogue.reveal = 9999;
  game.dialoguePress('Enter');
}
check('merchant shop opens', game.mode === 'shop');
const silverBefore = game.data.player.silver;
game.shop.index = 0;
game.shopPress('Enter');
check('shop purchase changes silver', game.data.player.silver < silverBefore);

game.mode = 'explore';
game.data.location = 'mountain-trail';
game.data.player.x = 560;
game.interact();
while (game.mode === 'dialogue') {
  game.dialogue.reveal = 9999;
  game.dialoguePress('Enter');
}
check('Kuo duel begins', game.mode === 'combat' && game.combat.enemy.name.includes('Kuo'));

game.combat.player.x = 400;
game.combat.enemy.x = 460;
game.combat.enemy.hp = 1;
game.startAttack(game.combat.player, 'punch');
game.combat.player.actionTime = game.combat.player.hitAt;
game.updateFighter(game.combat.player, 0.01, game.combat.enemy);
check('combat attack deals damage', game.combat.enemy.hp <= 0);

game.combat.resultDelay = 0;
game.updateCombat(0.02);
check('victory is queued', game.combat.winner === 'player' && game.combat.resultDelay > 0);
game.combat.resultDelay = 0.001;
game.updateCombat(0.01);
check('victory screen reached', ['victory', 'act-complete'].includes(game.mode), game.mode);

game.render();
game.save();
check('save data written', Boolean(store.get('greenDragonSave')));

console.log(`Smoke test passed (${passed.length} checks)`);
