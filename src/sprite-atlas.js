export const FIGHTER_ATLAS = Object.freeze({
  width: 2048,
  height: 1024,
  frameWidth: 256,
  frameHeight: 128,
  columns: 8,
  rows: 8,
  frameCount: 60,
  transparentGutter: 6,
  pivot: { x: 128, y: 118 },
  animations: {
    idle: [0, 1, 2, 3],
    walk: [4, 5, 6, 7, 8, 9, 10, 11],
    punch: [12, 13, 14, 15, 16, 17],
    kick: [18, 19, 20, 21, 22, 23],
    jump: [24, 25, 26, 27, 28],
    crouch: [29, 30, 31, 32, 33],
    sword: [34, 35, 36, 37, 38, 39, 40],
    staff: [41, 42, 43, 44, 45, 46, 47],
    hurt: [48, 49, 50, 51],
    block: [52, 53, 54, 55, 56],
    victory: [57, 58, 59],
  },
});

export const FIGHTER_PALETTES = Object.freeze({
  atlas:   { cloth: '#39745f', trim: '#70bf83', skin: '#efbd86', hair: '#202823', belt: '#e4bd63' },
  crimson: { cloth: '#ae4349', trim: '#e37662', skin: '#efb67f', hair: '#2c2020', belt: '#f0c65f' },
  indigo:  { cloth: '#56519a', trim: '#8783c6', skin: '#e8b47e', hair: '#25243b', belt: '#e2be65' },
  gold:    { cloth: '#b58a36', trim: '#e3bd62', skin: '#efba83', hair: '#30291d', belt: '#f3da82' },
  ashen:   { cloth: '#71817d', trim: '#a9bbb0', skin: '#e8b27d', hair: '#242b29', belt: '#d9bd75' },
});

const ORDER = Object.entries(FIGHTER_ATLAS.animations)
  .flatMap(([action, frames]) => frames.map((frame, phase) => ({ frame, action, phase, count: frames.length })))
  .sort((a, b) => a.frame - b.frame);

// Every drawing primitive stays inside these bounds. The six-pixel cell gutter is never touched.
export const FIGHTER_FRAME_BOUNDS = Object.freeze(ORDER.map(({ frame, action }) => ({
  frame,
  action,
  x: action === 'staff' ? 20 : 28,
  y: 6,
  width: action === 'staff' ? 216 : action === 'sword' ? 205 : 184,
  height: 116,
})));

const pixel = (context, x, y, width, height, fill) => {
  context.fillStyle = fill;
  context.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
};
const polygon = (context, points, fill) => {
  context.fillStyle = fill;
  context.beginPath();
  context.moveTo(points[0][0], points[0][1]);
  for (const [x, y] of points.slice(1)) context.lineTo(x, y);
  context.closePath();
  context.fill();
};
const limb = (context, x1, y1, x2, y2, width, fill, skin) => {
  context.strokeStyle = '#20221f';
  context.lineWidth = width + 4;
  context.beginPath(); context.moveTo(x1, y1); context.lineTo(x2, y2); context.stroke();
  context.strokeStyle = fill;
  context.lineWidth = width;
  context.beginPath(); context.moveTo(x1, y1); context.lineTo(x2, y2); context.stroke();
  pixel(context, x2 - 3, y2 - 3, 7, 7, skin);
};

function pose(action, phase, count) {
  const progress = count <= 1 ? 0 : phase / (count - 1);
  const wave = Math.sin(progress * Math.PI);
  const cycle = Math.sin(progress * Math.PI * 2);
  const result = { bob: 0, bodyY: 0, armFront: 0, armBack: 0, legFront: 0, legBack: 0, lean: 0 };
  if (action === 'idle') result.bob = cycle * 1.5;
  if (action === 'walk') { result.bob = Math.abs(cycle) * 2; result.legFront = cycle * 15; result.legBack = -cycle * 13; result.armFront = -cycle * 10; result.armBack = cycle * 9; }
  if (action === 'punch') { result.armFront = wave * 55; result.lean = wave * 4; }
  if (action === 'kick') { result.legFront = wave * 55; result.lean = -wave * 7; }
  if (action === 'jump') result.bodyY = -wave * 28;
  if (action === 'crouch') result.bodyY = wave * 18;
  if (action === 'sword') { result.armFront = wave * 30; result.lean = wave * 5; }
  if (action === 'staff') { result.armFront = wave * 22; result.armBack = -wave * 14; }
  if (action === 'hurt') { result.lean = -wave * 14; result.bodyY = wave * 4; }
  if (action === 'block') { result.armFront = 15 + wave * 8; result.armBack = 10 + wave * 5; }
  if (action === 'victory') { result.armFront = 38; result.armBack = phase === 2 ? 30 : 15; result.bob = phase === 1 ? -3 : 0; }
  return result;
}

function drawFrame(context, variant, descriptor) {
  const palette = FIGHTER_PALETTES[variant] || FIGHTER_PALETTES.atlas;
  const { action, phase, count } = descriptor;
  const p = pose(action, phase, count);
  const originX = FIGHTER_ATLAS.pivot.x;
  const originY = FIGHTER_ATLAS.pivot.y + p.bodyY + p.bob;
  context.save();
  context.translate(originX + p.lean, originY);
  context.imageSmoothingEnabled = false;

  pixel(context, -30, -3, 60, 5, 'rgba(28,34,30,.28)');
  limb(context, -11, -45, -16 - p.legBack * .28, -5 + Math.abs(p.legBack) * .08, 10, palette.hair, palette.skin);
  limb(context, 11, -45, 17 + p.legFront, -7 - Math.abs(p.legFront) * .18, 11, palette.cloth, palette.skin);
  polygon(context, [[-24,-87],[0,-99],[24,-87],[19,-43],[-19,-43]], palette.cloth);
  pixel(context, -16, -84, 32, 34, palette.cloth);
  pixel(context, -21, -52, 42, 7, palette.belt);
  pixel(context, -12, -91, 24, 5, palette.trim);

  const block = action === 'block';
  const frontX = block ? 34 : 34 + p.armFront;
  const frontY = block ? -96 : -62 - p.armFront * .12;
  const backX = block ? 19 : -34 + p.armBack;
  const backY = block ? -103 : -62 - p.armBack * .1;
  limb(context, 18, -82, frontX, frontY, 9, palette.cloth, palette.skin);
  limb(context, -18, -82, backX, backY, 9, palette.cloth, palette.skin);

  pixel(context, -14, -107, 28, 25, palette.skin);
  pixel(context, -17, -111, 34, 10, palette.hair);
  pixel(context, -19, -108, 7, 24, palette.hair);
  pixel(context, 5, -99, 3, 3, '#25231f');
  pixel(context, 15, -108, 10, 5, palette.hair);

  if (action === 'sword') {
    context.strokeStyle = '#eef5ed'; context.lineWidth = 4;
    context.beginPath(); context.moveTo(36, -68); context.lineTo(94, -105 + phase * 3); context.stroke();
    pixel(context, 30, -72, 17, 6, palette.belt);
  }
  if (action === 'staff') {
    context.strokeStyle = '#845334'; context.lineWidth = 6;
    context.beginPath(); context.moveTo(-102, -90 + phase * 3); context.lineTo(103, -58 - phase * 2); context.stroke();
    context.strokeStyle = '#d9b86c'; context.lineWidth = 2;
    context.beginPath(); context.moveTo(-102, -90 + phase * 3); context.lineTo(-84, -87 + phase * 3); context.stroke();
  }
  context.restore();
}

export function createFighterAtlas(variant = 'atlas') {
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') return null;
  const canvas = document.createElement('canvas');
  canvas.width = FIGHTER_ATLAS.width;
  canvas.height = FIGHTER_ATLAS.height;
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return null;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = false;
  for (const descriptor of ORDER) {
    const column = descriptor.frame % FIGHTER_ATLAS.columns;
    const row = Math.floor(descriptor.frame / FIGHTER_ATLAS.columns);
    context.save();
    context.translate(column * FIGHTER_ATLAS.frameWidth, row * FIGHTER_ATLAS.frameHeight);
    drawFrame(context, variant, descriptor);
    context.restore();
  }
  return canvas;
}

export function buildFighterAtlases() {
  return Object.fromEntries(Object.keys(FIGHTER_PALETTES)
    .map(variant => [variant, createFighterAtlas(variant)])
    .filter(([, canvas]) => canvas));
}
