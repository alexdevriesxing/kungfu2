import { buildFighterAtlases } from './sprite-atlas.js';

export async function loadProductionAssets() {
  return {
    sprites: buildFighterAtlases(),
    stages: {},
    keyArt: null,
  };
}
