# Kung Fu: Return of the Green Dragon Master

A web-first 2D wuxia action RPG combining free-roaming side-scrolling exploration, JRPG-style interaction and responsive arcade martial-arts battles.

## Playable build

The current Act I build includes six connected locations, dialogue and investigation quests, recruitable allies, merchants, permanent training, weapons, party assists, save migration and real-time martial-arts combat.

## Combat and feel polish

The combat model now includes:

- Stamina, guard durability and guard breaks
- Tap-block perfect parries
- Buffered attacks for more responsive combinations
- Evasive steps with short invulnerability
- Throws that punish passive guarding
- Weapon-specific reach and knockback
- Hit-stop, screen shake, impact sparks and damage callouts
- Combo grading and victory ranks
- Experience rewards, level-ups and stat growth
- Distinct AI pressure for bosses and normal rivals

The presentation layer adds animated clouds, leaves, petals, lantern glow, water glints, improved HUD labels, quest/recruit/shop markers, safer scene transitions and a responsive nine-button mobile action pad.

## Production artwork

The game boots through a production asset layer that builds distinct fixed-grid animation atlases for Shi-An and seven named allies, rivals and bosses. Every named sheet shares the established 8×8 slicing contract while adding character-specific clothing, silhouettes, weapons and effects. The deterministic renderer remains available for secondary NPCs and automated tests.

See [docs/PRODUCTION_ART.md](docs/PRODUCTION_ART.md), [docs/ASSET_PIPELINE.md](docs/ASSET_PIPELINE.md) and [docs/POLISH.md](docs/POLISH.md).

## Controls

- Move: WASD or arrow keys
- Interact/confirm: E or Enter
- Journal/menu: M or Escape
- Punch / kick / weapon: J / K / L
- Chi technique: I
- Block; tap at impact to parry: S
- Evade: Space
- Throw / punish guard: U
- Party assists: 1–4
- Quick tonic: Q
- Sound: P
- Fullscreen: F

## Validate

```bash
node tests/assets.mjs
node tests/named-art.mjs
node tests/polish.mjs
node tests/smoke.mjs
```
