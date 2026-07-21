# Kung Fu: Return of the Green Dragon Master

A web-first 2D wuxia action RPG combining free-roaming side-scrolling exploration, JRPG interaction and responsive arcade martial-arts battles.

## Playable campaign

The current web build contains four connected acts, a completed main campaign and an enduring Legacy Journey postgame.

### Act I — The Ashes Speak

Shi-An investigates Master Shen’s murder across Jade River Village, Golden Carp Market, Whispering Bamboo Forest, Cloud-Breaker Trail, Shaolin Monastery and Wu Dang.

### Act II — The Black River Conspiracy

Eight regions connect the Black River Escort Agency, Willow Ferry, Ghost Face Opera, the Five-Clan Council, a three-round Dragon Gate Tournament and the Imperial Jade Court.

### Act III — Crown Beneath Snow

Eight northern regions introduce three standards, faction war balance, heir trust, the Ghost Face founder, Prince Jian and Regent Han “Black Dragon.”

### Act IV — Mandate of Jade and Ash

Eight capital regions lead to five required proofs, three side stories and a persistent choice between a limited restoration, Council of Provinces or Wanderer Mandate.

## Legacy Journey and New Game Plus

Campaign completion opens the **Hall of Returning Paths** and a save-compatible postgame layer.

- Restart the four-act campaign in escalating Legacy cycles
- Preserve owned weapons, learned styles, companions, bonds and mastery
- Inherit a combat gift based on the selected Act IV mandate
- Retain part of accumulated silver and all permanent Legacy blessings
- Face stronger enemies with higher HP, power, defence, guard and stamina
- Advance through Awakened, Tempered, Ascendant, Jade Sage and Green Dragon ranks
- Record completed cycles, remembered endings, essence and trial performance

Five replayable boss circuits are available:

- Ashes of the First Road
- Black River Requiem
- Crown Beneath Snow
- Jade and Ash
- Five Dragons Grandmaster Circuit

Boss trials award **Legacy Essence**, which can permanently improve Jade Marrow, Dragon Breath and Unbroken Resolve.

## Living world and party systems

- Five recruitable companions with bonds and specialized assists
- Repeatable Jianghu contracts
- Camp rest and tea conversations
- Weapon and style mastery
- Reputation and discovery records
- Persistent owned-weapon armory
- Quest tracking and directional guidance
- Disciple, Master and Legend difficulty
- Gamepad, touch and keyboard controls
- Accessibility settings and safe save enrichment

## Combat

Combat includes stamina, guard breaks, tap-block parries, buffered attacks, evasions, throws, weapon reach, hit-stop, knockback, impact effects, combo grading, victory ranks, XP, levels, mastery and party assists.

Late-campaign and Legacy encounters add faction bonuses, ending inheritance, multi-phase bosses, cycle ranks and escalating enemy attributes.

## Production presentation

Named fighters use fixed-grid animation atlases. Acts II–IV and Legacy Journey add dedicated rival variants and authored runtime pixel-art stages routed through the production-stage interface. The deterministic renderer remains available for secondary NPCs and validation.

## Web release

The game is installable as a landscape progressive web app. `sw-legacy.js` provides a versioned offline cache for the complete campaign and postgame executable core after the first successful load.

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
- Mandate Ledger: Y
- Legacy Journey and Returning Paths: G
- Combat: J punch, K kick, L weapon, I Chi, S block/parry, Space evade, U throw
- Party assists: 1–4
- Quick tonic: Q
- Sound: P
- Fullscreen: F

## Documentation

- [Legacy Journey](docs/LEGACY_JOURNEY.md)
- [Act IV campaign](docs/ACT_FOUR.md)
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
node tests/act-four.mjs static
node tests/act-four.mjs runtime
node tests/legacy-journey.mjs static
node tests/legacy-journey.mjs runtime
node tests/smoke.mjs
```
