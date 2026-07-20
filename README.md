# Kung Fu: Return of the Green Dragon Master

A web-first 2D wuxia action RPG combining free-roaming side-scrolling exploration, JRPG-style interaction and arcade martial-arts battles.

## Playable build

The current build includes exploration across six connected locations, dialogue, investigation quests, recruitable allies, merchants, training, weapons, party assists, saving and real-time martial-arts combat.

## Named fighter art milestone

The game now boots through a production asset layer that builds distinct, fixed-grid animation atlases for Shi-An and seven named allies, rivals and bosses. Every named sheet shares the established 8×8 slicing contract while adding character-specific clothing, silhouettes, weapons and effects. The deterministic renderer remains available for the many secondary NPCs and for automated tests.

The combat layer now includes stamina management, regenerating guard, guard breaks, evasive steps, throws, weapon reach, Chi attacks and party assists. See [docs/PRODUCTION_ART.md](docs/PRODUCTION_ART.md) and [docs/ASSET_PIPELINE.md](docs/ASSET_PIPELINE.md).

## Controls

- Move: WASD or arrow keys
- Interact/confirm: E or Enter
- Journal/menu: M or Escape
- Combat: J punch, K kick, L weapon, I Chi technique, S block
- Evade: Space
- Throw / punish guard: U
- Party assists: 1–4
- Quick tonic: Q

## Validate

```bash
node tests/assets.mjs
node tests/named-art.mjs
node tests/smoke.mjs
```