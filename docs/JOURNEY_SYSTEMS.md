# Journey systems and accessibility

This milestone adds a non-destructive enhancement layer in `src/enhancements.js`. It boots after the established game and production-art modules, enriches old saves, and wraps only the systems that need additional player-facing behaviour.

## Persistent armory

- Every save receives an `ownedWeapons` collection.
- The currently equipped weapon and the Oiled Ash Staff are always preserved during migration.
- Merchants charge only for weapons not already owned.
- Press **R** to compare owned weapons, inspect power differences and equip one without repurchasing it.

## Quest tracking

- Every save receives a `trackedQuest` field.
- New story threads are tracked automatically unless auto-tracking is disabled.
- Press **T** to select any unlocked quest.
- The exploration HUD shows whether the objective is nearby or requires travel left or right through the connected world.
- Five Shadows at Your Back updates its destination dynamically according to which recruit is still missing.

## Difficulty and accessibility

Press **O** to configure:

- Disciple, Master or Legend difficulty
- Screen shake
- Screen flashes
- Standard, fast or instant dialogue reveal
- High-contrast canvas presentation
- Automatic quest tracking

Difficulty scales enemy health, power, defence, rewards and XP. Enemy identity still matters because named rivals also receive separate behavioural profiles.

## Gamepad input

The browser Gamepad API is polled by the enhancement loop. The default mapping supports movement, interaction, punch, kick, weapon attacks, Chi, block, evade, throw, party assist and menus. Keyboard and touch controls remain active simultaneously.

## Style techniques and rivals

The existing Chi input now resolves through the fighter's learned style:

- Green Dragon Fist — Coiling Dragon Palm
- Shaolin Long Fist — Arhat Gate Breaker
- Wu Dang Soft Palm — Empty Lake Return

Named rivals receive behavioural identities:

- Kuo “Three Knuckles” — Iron Bruiser
- Jin “Bell Sparrow” — Shaolin Counter
- The Faceless Magistrate — Court Executioner

These profiles change guard, stamina, power and tactical decisions without altering the deterministic animation slicing contract.

## Validation

`tests/systems.mjs` checks that the enhancement layer, mobile controls and deployment gate remain connected. `tests/smoke.mjs` exercises save enrichment, auto-tracking, free re-equipping, weapon ownership, settings overlays, difficulty scaling and style techniques.
