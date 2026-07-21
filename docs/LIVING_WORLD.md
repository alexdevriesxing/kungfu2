# Living world, party and release systems

This milestone extends the playable Act I without replacing the validated exploration, combat or production-art layers.

## New side stories and allies

Three side-quest threads are inserted into the existing mutable content archive:

1. **The Razor at Bamboo Ford** — Lotus asks Shi-An to defeat Razor Fang and end the illegal market tax. Lotus becomes recruitable after the victory.
2. **The Bent Reed Oath** — mastering Willow Step allows Hermit Reed to join the travelling party.
3. **A Sparrow Leaves the Bell** — after the Shaolin trial, Jin can leave the courtyard and join Shi-An.

Together with Mei Lin and Bo, these characters allow a complete five-companion roster.

## Contract Board

Press **B** while exploring to choose a repeatable mission. Contracts have named rivals, recommended levels and explicit silver rewards. Difficulty settings continue to scale the opponent and reward. Completed contracts build a streak and Common Folk reputation, while defeat resets the streak.

## Camp and bonds

Press **C** while exploring. Rest costs 20 silver, restores HP and Chi, and grants increased stamina and guard in the next duel. Sharing tea costs 12 silver and increases a companion bond up to rank 10.

Bond ranks increase assist damage. Individual companions also provide specialized support: Mei Lin damages guard, Bo adds impact damage, Hermit Reed restores stamina, Lotus restores Chi, and Jin restores guard.

## Mastery and reputation

Press **V** to review:

- Staff and sword mastery
- Current fighting-style mastery
- Common Folk, Shaolin, Wanderer and Merchant reputation
- Locations discovered
- Contracts completed

Weapon and style mastery rise after victories. Every three victories grants a mastery tier, up to tier five, which improves power, stamina or guard during combat.

## Save compatibility

The module enriches the existing save object with `livingWorldVersion`, reputation, bonds, mastery, contract records, discoveries and rest state. It does not invalidate the established version 3 save format.

## Offline web build

`sw.js` caches the complete executable core. The cache is versioned so future releases can invalidate old files cleanly. The manifest requests landscape fullscreen presentation and marks the title as a game/entertainment application.
