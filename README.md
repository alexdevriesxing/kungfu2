# Kung Fu: Return of the Green Dragon Master

A web-first 2D wuxia action RPG combining free-roaming side-scrolling exploration, JRPG-style interaction and arcade martial-arts battles.

## Playable vertical slice

The current milestone includes exploration, dialogue, investigation quests, recruitable allies, merchants, training, weapons, party assists, saving and real-time martial-arts combat.

## Production asset standards

- Adobe-free source and build pipeline.
- Brighter daylight wuxia palette with only a 3% world tint.
- Five fighter variants generated on one fixed **2048×1024**, **8×8** atlas.
- Every fighter cell is **256×128** with a six-pixel transparent gutter.
- Sixty authored animation frames and four reserved transparent cells.
- Shared pivot and engine-neutral JSON animation metadata.
- Browser exporter for complete PNG sheets and individual transparent frames.
- Automated brightness, slicing, metadata and gameplay validation.

See [docs/ASSET_PIPELINE.md](docs/ASSET_PIPELINE.md) for the exact slicing specification.

## Validate

```bash
node tests/assets.mjs
node tests/smoke.mjs
```
