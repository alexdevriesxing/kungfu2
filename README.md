# Kung Fu: Return of the Green Dragon Master

A web-first 2D wuxia action RPG combining free-roaming side-scrolling exploration, JRPG interaction and responsive arcade martial-arts battles.

## Playable campaign

The current web build contains four connected acts and a completed main campaign.

### Act I — The Ashes Speak

Shi-An investigates Master Shen’s murder across Jade River Village, Golden Carp Market, Whispering Bamboo Forest, Cloud-Breaker Trail, Shaolin Monastery and Wu Dang. The act includes story quests, side stories, recruitable companions, merchants, training, weapons and the Faceless Magistrate confrontation.

### Act II — The Black River Conspiracy

Eight regions connect the Black River Escort Agency, Willow Ferry, Ghost Face Opera, the Five-Clan Council, a three-round Dragon Gate Tournament and the Imperial Jade Court. Major rivals include Needle Crow, Crimson Mask, Jade Mantis, Laughing Tiger, Iron Phoenix and Censor Wei “Jade Viper.”

### Act III — Crown Beneath Snow

Shi-An enters the northern war monasteries after the Jade Court archive exposes his hidden birth constellation. Eight northern regions introduce three standards, faction war balance, heir trust, the Ghost Face founder, Prince Jian and Regent Han “Black Dragon.”

### Act IV — Mandate of Jade and Ash

The northern alliance enters the capital before Chancellor Sima can erase the evidence gathered across the empire. Eight capital regions connect the refugee gate, Lantern Ward, the Hall of Ten Thousand Petitions, the Ghost Face schism, Vermilion Arsenal, imperial garden, empty throne and Green Dragon Sky Terrace.

Act IV adds five required capital proofs, three side stories, a persistent mandate choice and three different epilogues:

- Restore Prince Jian beneath constitutional limits
- Establish a rotating Council of Provinces
- Refuse a permanent throne through the Wanderer Mandate

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

Act III introduces the Iron Prayer War Staff, Frost Lotus Jian, First Mask Chain, Black Dragon Edict Blade, Iron Prayer Palm, Snow Lotus Sword and Heavenly Constellation Boxing.

Act IV introduces:

- Capital Guardian Halberd
- Mirror Mask Ribbon Chain
- Vermilion Tiger Jian
- Pale Dragon Sealblade
- Lantern Ward Boxing
- Mirror Mask Steps
- Mandate Without Throne
- Capital proofs, people support and capital renown
- Three mandate-based final-battle bonuses
- A Mandate Ledger opened with **Y**
- Persistent campaign ending and `legacyReady` postgame state

## Combat

Combat includes stamina, guard breaks, tap-block parries, buffered attacks, evasions, throws, weapon reach, hit-stop, knockback, impact effects, floating callouts, combo grading, victory ranks, XP, levels, mastery and party assists.

Late-campaign encounters add faction-standard bonuses, multi-phase bosses and a final Chancellor Sima duel whose player bonuses depend on the selected mandate.

## Production presentation

Named fighters use fixed-grid animation atlases. Acts II–IV add dedicated rival variants and authored runtime pixel-art stages routed through the production-stage interface. The deterministic renderer remains available for secondary NPCs and validation.

## Web release

The game is installable as a landscape progressive web app. `sw-act4.js` provides a versioned offline cache for the complete four-act executable core after the first successful load.

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
- Combat: J punch, K kick, L weapon, I Chi, S block/parry, Space evade, U throw
- Party assists: 1–4
- Quick tonic: Q
- Sound: P
- Fullscreen: F

## Documentation

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
node tests/smoke.mjs
```
