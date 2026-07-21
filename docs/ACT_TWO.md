# Act II — The Black River Conspiracy

Act II extends the validated Act I and living-world layers without replacing their save format, combat model, content archives or production-art hooks.

## Campaign structure

The chapter opens after the Faceless Magistrate is defeated. Existing saves with the `faceless` quest already completed unlock Act II automatically.

Eight connected regions are appended to the world road:

1. Black River Docks
2. Black River Escort Agency
3. Willow Ferry Village
4. Ghost Face Opera Quarter
5. Ghost Face Backstage
6. Five-Clan Council Terrace
7. Dragon Gate Tournament
8. Imperial Jade Court

The route is gated until Act I is complete. The map and quest journal receive Act-II-aware overlays so the expanded campaign remains readable after the world grows beyond the original six locations.

## Main story

Nine linked story quests investigate Master Shen’s stolen escort seal, a murdered imperial courier, the Ghost Face Opera’s assassin network, clan testimony, the Dragon Gate Tournament and Censor Wei’s Jade Court conspiracy.

The tournament contains three ordered fights:

- Jade Mantis
- Laughing Tiger
- Mistress Bai “Iron Phoenix”

Winning the final grants the court invitation required for the Act II finale.

## Side stories

- **Rice for the River Orphans** — defeat Salt Shark and improve Common Folk standing.
- **The Fan That Remembered** — recover an opera fan containing a hidden assassin ledger.
- **Old Pine’s Last Debt** — grant an aging messenger one final honorable duel.

These stories also support the Five-Clan Council requirements instead of existing only as disconnected rewards.

## New progression

Act II adds four weapons and three equippable fighting styles:

- Black River Crescent Dao / Black River Saber
- Ghost Lantern Chain / Ghost Lantern Steps
- Iron Phoenix Jian / Five Banners Fist
- Jade Viper Fang

Press **X** after Act II unlocks to open the chapter chronicle, inspect faction influence and equip any learned style.

## Boss presentation

New major rivals receive dedicated tinted production atlases derived from the established named-fighter sheets. Eight unique 960×540 pixel-art stage canvases are generated before the first frame and routed through the existing production-stage interface.

## Save compatibility

Act II stores its state inside `data.actTwo` and adds `learnedStyles`. It does not change the established version 3 save number. Missing fields and quest states are enriched at runtime.

## Validation

`tests/act-two.mjs` has separate static and runtime modes. Static mode checks content wiring, offline caching and controls. Runtime mode plays the critical story path through the Black River, opera, council, tournament and Jade Court finale.
