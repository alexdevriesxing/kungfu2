# Named fighter art integration

Milestone 1.5 introduces a runtime production-art layer without weakening the deterministic build and validation pipeline.

## Runtime atlases

Eight named characters now receive distinct **2048×1024**, 8×8 animation atlases:

- Shi-An
- Mei Lin
- Bo “Iron Belly” Gan
- Hermit Reed
- Razor Fang
- Kuo “Three Knuckles”
- Novice Jin
- The Faceless Magistrate

The atlases preserve the common frame order, frame dimensions, transparent gutter and pivot documented in `assets/production/sprites/fighter-atlas.json`. Character-specific overlays add robes, ribbons, beads, masks, claws, gauntlets and supernatural effects without changing slicing coordinates.

## Loader and fallback policy

`src/bootstrap.js` builds named atlases before the game starts and exposes them through `globalThis.greenDragonAssets`. The renderer resolves a named sheet first and then falls back to the established palette renderer for secondary NPCs or test environments.

This makes the web build self-contained and deployable while retaining a clear insertion point for future externally authored PNG/WebP sheets, stage paintings, portraits and key art.

## Combat readability

The same milestone adds stamina, guard durability, guard breaks, invulnerable evasive steps and close-range throws. These systems create more deliberate spacing and defensive decisions while keeping the existing punch, kick, weapon, Chi and party-assist controls.