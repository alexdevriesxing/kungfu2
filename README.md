# Kung Fu: Return of the Green Dragon Master

A web-first 2D wuxia action RPG combining free-roaming side-scrolling exploration, JRPG interaction and responsive arcade martial-arts battles.

## Playable campaign

The current web build contains three connected acts.

### Act I — The Ashes Speak

Shi-An investigates Master Shen’s murder across Jade River Village, Golden Carp Market, Whispering Bamboo Forest, Cloud-Breaker Trail, Shaolin Monastery and Wu Dang. The act includes story quests, side stories, recruitable companions, merchants, training, weapons and the Faceless Magistrate confrontation.

### Act II — The Black River Conspiracy

Act II adds eight connected regions, nine main quests, three side stories, the Black River Escort Agency, Willow Ferry, Ghost Face Opera, the Five-Clan Council, a three-round Dragon Gate Tournament and the Imperial Jade Court finale.

Major Act II rivals include Needle Crow, the Crimson Mask, Jade Mantis, Laughing Tiger, Iron Phoenix and Censor Wei “Jade Viper.”

### Act III — Crown Beneath Snow

Act III carries Shi-An into the northern war monasteries after the Jade Court archive exposes his hidden birth constellation. Eight new regions connect Northern Star Pass, Iron Prayer Monastery, Snow Lotus Village, the Red Banner War Camp, the first Ghost Face sanctum, the Celestial Archive, the vanished heir’s refuge and the Black Dragon Observatory.

The third act adds nine linked main quests and three side stories, three northern standards, a faction war-balance record, heir trust, the Ghost Face founder, the emperor’s vanished heir and a final confrontation with Regent Han “Black Dragon.”

## Living world and party systems

- Five possible recruited companions
- Companion bonds and specialized assists
- Repeatable Jianghu contracts
- Camp rest and tea conversations
- Weapon and style mastery
- Reputation and discovery records
- Persistent owned-weapon armory
- Quest tracking and directional guidance
- Disciple, Master and Legend difficulty
- Gamepad, touch and keyboard controls
- Accessibility settings and safe save enrichment

## Campaign progression

Act II introduces the Black River Crescent Dao, Ghost Lantern Chain, Iron Phoenix Jian, Jade Viper Fang, Black River Saber, Ghost Lantern Steps and Five Banners Fist.

Act III introduces:

- Iron Prayer War Staff
- Frost Lotus Jian
- First Mask Chain
- Black Dragon Edict Blade
- Iron Prayer Palm
- Snow Lotus Sword
- Heavenly Constellation Boxing
- Three northern standards and war-balance tracking
- Heir trust and the Celestial star map
- A Northern War Council opened with **Z**

## Combat

Combat includes stamina, guard breaks, tap-block parries, buffered attacks, evasions, throws, weapon reach, hit-stop, knockback, impact effects, floating callouts, combo grading, victory ranks, XP, levels, mastery and party assists. Act III adds standard-based combat bonuses and a second-phase Black Dragon Regent encounter.

## Production presentation

Named fighters use fixed-grid animation atlases. Acts II and III add dedicated tinted boss atlases and authored runtime pixel-art stages routed through the same production-stage interface. The deterministic renderer remains available for secondary NPCs and validation.

## Web release

The game is installable as a landscape progressive web app. `sw-act3.js` provides a versioned offline cache for the complete three-act executable core after the first successful load.

## Controls

- Move: WASD or arrows
- Interact/confirm: E or Enter
- Journal: M
- Quest tracker: T
- Armory: R
- Options/accessibility: O
- Contracts: B
- Camp: C
- Mastery/reputation: V
- Act II chronicle and style selection: X
- Northern War Council: Z
- Combat: J punch, K kick, L weapon, I Chi, S block/parry, Space evade, U throw
- Party assists: 1–4
- Quick tonic: Q
- Sound: P
- Fullscreen: F

## Documentation

- [Act III campaign](docs/ACT_THREE.md)
- [Act II campaign](docs/ACT_TWO.md)
- [Living world](docs/LIVING_WORLD.md)
- [Journey systems](docs/JOURNEY_SYSTEMS.md)
- [Production art](docs/PRODUCTION_ART.md)
- [Asset pipeline](docs/ASSET_PIPELINE.md)
- [Polish systems](docs/POLISH.md)

## Validate

```bash
node tests/assets.mjs
node tests/named-art.mjs
node tests/polish.mjs
node tests/systems.mjs
node tests/living-world.mjs static
node tests/living-world.mjs runtime
node tests/act-two.mjs static
node tests/act-two.mjs runtime
node tests/act-three.mjs static
node tests/act-three.mjs runtime
node tests/smoke.mjs
```
