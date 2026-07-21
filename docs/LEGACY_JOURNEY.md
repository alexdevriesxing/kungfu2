# Legacy Journey

Legacy Journey is the postgame and New Game Plus layer unlocked by completing Act IV. It extends the completed campaign without replacing the established save format or creating a disconnected fifth act.

## Hall of Returning Paths

Press **G** after campaign completion or enter through the Act IV epilogue to reach the Hall of Returning Paths. The hall contains:

- Keeper Rui, who opens the complete Legacy ledger
- the Mirror of Ten Thousand Rivals, which starts boss trials
- the Jade Legacy Brazier, where Legacy Essence becomes permanent blessings

The hall is a connected world location with its own generated 960×540 stage and can also be revisited by normal travel after it has been unlocked.

## New Game Plus cycles

Beginning a Returning Path resets story quests, defeated-enemy state, locations and campaign acts while preserving Shi-An’s martial identity:

- level, XP and core combat attributes
- owned weapons and equipped weapon
- learned styles and equipped style
- recruited companions
- companion bonds
- weapon and style mastery
- permanent Legacy blessings
- Legacy Essence and records
- remembered Act IV endings

A portion of silver carries into the new cycle. Enemy HP, power, defence, guard, stamina, XP and silver rewards scale with the active cycle.

Cycle ranks progress through:

1. Awakened
2. Tempered
3. Ascendant
4. Jade Sage
5. Green Dragon

## Ending inheritance

The selected Act IV mandate becomes an inherited combat gift.

- **Restoration — Ashen Crown Oath:** additional guard and Chi
- **Council — Ten Thousand Voices:** additional stamina and defence
- **Wanderer — Road Without Throne:** additional power, stamina and Chi

The ending is also stored in the permanent ending history before the campaign restarts.

## Boss echo trials

Five circuits can be replayed at any time after Legacy unlock:

- **Ashes of the First Road:** Kuo, Novice Jin and the Faceless Magistrate
- **Black River Requiem:** Needle Crow, Crimson Mask, Iron Phoenix and Jade Viper
- **Crown Beneath Snow:** Stone Vein, Father No-Face, Black Star Abbot and Regent Han
- **Jade and Ash:** Gate General Xun, Lady Half-Mask, Throne Warden and Chancellor Sima
- **Five Dragons Grandmaster Circuit:** five escalating endgame echoes ending with Master Shen’s Shadow

Health and Chi are restored between circuit fights. Losing returns Shi-An to the hall, while clearing a circuit grants Legacy Essence and updates persistent clear records.

## Permanent blessings

Legacy Essence can be invested at the Jade Legacy Brazier.

- **Jade Marrow:** maximum HP
- **Dragon Breath:** maximum Chi
- **Unbroken Resolve:** power and defence

Costs rise with blessing rank. Purchased ranks survive all future cycle resets.

## Save compatibility

`legacy` is added through defensive save enrichment. Existing saves remain version 3 and unlock Legacy Journey automatically when `legacyReady` or completed Act IV data is present. Legacy records are normalized on save and load.

## Validation

`tests/legacy-journey.mjs` checks:

- static bootstrap, mobile-control and offline-cache wiring
- fresh-save enrichment
- campaign-completion unlock
- Hall of Returning Paths installation
- complete boss-gauntlet chaining and rewards
- permanent blessing purchases
- New Game Plus reset and inheritance
- cycle enemy scaling
- mandate-specific combat inheritance

All Act I–IV and original smoke tests remain mandatory deployment gates.
