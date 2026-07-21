import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FIGHTER_ATLAS as atlas, FIGHTER_PALETTES as palettes, FIGHTER_FRAME_BOUNDS as bounds } from '../src/sprite-atlas.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const check = (condition, message) => { if (!condition) throw new Error(message); };
const luminance = color => {
  const value = color.replace('#', '');
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

check(atlas.width === 2048 && atlas.height === 1024, 'Fighter atlas must remain 2048x1024');
check(atlas.frameWidth === 256 && atlas.frameHeight === 128, 'Every fighter frame must be 256x128');
check(atlas.columns === 8 && atlas.rows === 8, 'Fighter atlas must use a fixed 8x8 grid');
check(atlas.frameCount === 60, 'Exactly 60 authored fighter frames are required');
check(atlas.transparentGutter === 6, 'A six-pixel transparent gutter is required');
check(bounds.length === atlas.frameCount, 'Every authored frame requires verified bounds');

const animationFrames = Object.values(atlas.animations).flat();
check(animationFrames.length === atlas.frameCount, 'Animation metadata must contain 60 frame references');
check(new Set(animationFrames).size === atlas.frameCount, 'Animation frame references must be unique');
check(Math.min(...animationFrames) === 0 && Math.max(...animationFrames) === 59,
  'Animation frame indices must cover 0 through 59');

for (const frame of bounds) {
  check(frame.x >= atlas.transparentGutter, `Frame ${frame.frame} crosses the left gutter`);
  check(frame.y >= atlas.transparentGutter, `Frame ${frame.frame} crosses the top gutter`);
  check(frame.x + frame.width <= atlas.frameWidth - atlas.transparentGutter,
    `Frame ${frame.frame} crosses the right gutter`);
  check(frame.y + frame.height <= atlas.frameHeight - atlas.transparentGutter,
    `Frame ${frame.frame} crosses the bottom gutter`);
}

for (const [variant, palette] of Object.entries(palettes)) {
  const visible = Object.values(palette);
  const mean = visible.reduce((sum, color) => sum + luminance(color), 0) / visible.length;
  check(mean >= 70, `${variant} palette is too dark: mean luminance ${mean.toFixed(2)}`);
  check(luminance(palette.cloth) >= 48, `${variant} clothing silhouette is too dark`);
  check(luminance(palette.skin) >= 140, `${variant} skin highlights are too dark`);
}

const metadata = JSON.parse(fs.readFileSync(path.join(root, 'assets/production/sprites/fighter-atlas.json'), 'utf8'));
check(metadata.sheet.width === atlas.width && metadata.sheet.height === atlas.height, 'Atlas JSON sheet dimensions differ from runtime');
check(metadata.grid.frameWidth === atlas.frameWidth && metadata.grid.frameHeight === atlas.frameHeight, 'Atlas JSON cell size differs from runtime');
check(metadata.transparentGutter === atlas.transparentGutter, 'Atlas JSON gutter differs from runtime');
check(JSON.stringify(metadata.animations) === JSON.stringify(atlas.animations), 'Atlas JSON animations differ from runtime');

const art = fs.readFileSync(path.join(root, 'src/art.js'), 'utf8');
const render = fs.readFileSync(path.join(root, 'src/render.js'), 'utf8');
check(art.includes("'#6d9795'"), 'Ink-wash daylight sky palette is missing');
check(art.includes("'#e1bd78'"), 'Warm parchment horizon palette is missing');
check(art.includes("'rgba(25,43,36,.2)'"), 'Layered atmospheric fog policy is missing');
check(art.includes('ornatePath') && art.includes('inkMountain'), 'Premium wuxia canvas framing is missing');
check(render.includes("rgba(0,0,0,.03)"), 'World readability tint must remain at three percent');
check(!render.includes("rect(c,0,0,W,H,'rgba(0,0,0,.08)');for(const n"), 'Old eight-percent world dark wash returned');

console.log(`Asset validation passed: ${Object.keys(palettes).length} bright fighter palettes and ${atlas.frameCount} slice-safe frames.`);
