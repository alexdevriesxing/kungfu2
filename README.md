# Kung Fu: Return of the Green Dragon Master

A web-first 2D wuxia action RPG combining free-roaming side-scrolling exploration, JRPG-style interaction and responsive arcade martial-arts battles.

## Playable build

The current Act I build includes six connected locations, main and side quests, five possible recruited allies, merchants, permanent training, collectible weapons, party assists, paid contracts, camp interactions, mastery progression, save migration and real-time martial-arts combat.

## Living world and party systems

- Three authored side-quest chains introduce Razor Fang, Lotus, Hermit Reed and Jin’s journey beyond Shaolin.
- Shi-An can assemble a full five-fighter companion roster.
- A repeatable Jianghu Contract Board provides level-scaled missions, silver, XP and reputation.
- Camp rest restores the party and grants a focused opening to the next duel.
- Tea conversations build companion bonds; higher bonds improve assists and unlock character-specific support effects.
- Weapon and fighting-style mastery grow through victories and improve combat statistics.
- Common Folk, Shaolin, Wanderer and Merchant reputation records Shi-An’s standing in the jianghu.
- Location discoveries, contract streaks and mastery are saved safely alongside existing version 3 data.

## Progression and accessibility

The build also includes a persistent armory, selectable quest tracking, directional objective guidance, Disciple/Master/Legend difficulty, screen-effect and text-speed controls, high contrast, gamepad support, style-specific Chi techniques and distinct rival combat profiles.

## Combat polish

Combat includes stamina, guard breaks, tap-block parries, buffered attacks, evasions, throws, weapon reach, hit-stop, knockback, impact particles, floating callouts, combo grading, victory ranks, XP, levels and party assists.

## Web release features

The static web build is installable and caches its core files through a versioned service worker for offline replay after the first successful load. GitHub Pages deployment is gated by automated asset, gameplay, systems and living-world validation.

## Controls

- Move: WASD or arrows
- Interact/confirm: E or Enter
- Journal: M
- Quest tracker: T
- Armory: R
- Options/accessibility: O
- Contract Board: B
- Camp: C
- Mastery and reputation: V
- Combat: J punch, K kick, L weapon, I Chi, S block/parry, Space evade, U throw
- Party assists: 1–4
- Quick tonic: Q
- Sound: P
- Fullscreen: F
- Standard browser gamepads are supported

## Validate

```bash
node tests/assets.mjs
node tests/named-art.mjs
node tests/polish.mjs
node tests/systems.mjs
node tests/living-world.mjs
node tests/smoke.mjs
```
