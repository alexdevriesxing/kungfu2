# Feel and UX polish milestone

This milestone focuses on responsiveness, readability and reliability rather than simply adding more content.

## Combat feel

The attack system now supports a short input buffer, allowing a follow-up input near the end of an animation to execute as soon as the fighter recovers. Every attack defines stamina cost, active timing, reach, guard damage, knockback and hit-stop independently.

Blocking remains useful, but holding it forever is unsafe. Guard damage can cause a stagger, throws punish close passive defence, and a newly raised guard creates a short perfect-parry window. A successful parry negates damage, restores some Chi and briefly stuns the attacker.

Impact feedback combines:

- brief simulation hit-stop;
- proportional camera shake;
- sprite hit flash;
- sparks, dust or Chi particles;
- floating damage and combat callouts;
- attack-specific procedural sound cues.

## RPG progression

Victories now grant experience in addition to silver. Level thresholds raise maximum health, maximum Chi, power and defence. Save version 3 migrates earlier journals into the new schema while validating location, party size and player resources.

Quest completion is idempotent: speaking to the same giver again cannot repeatedly grant the same silver reward.

## World and interface

Fallback stages now have animated cloud bands, environmental particles, lantern flicker and water glints. NPC role markers communicate quests, recruitment, commerce, training and danger without opening a menu.

The mobile action pad is a landscape-first 3×3 layout containing attacks, Chi, evade, throw, interact, tonic and journal controls. Portrait orientation receives a clear rotation message instead of presenting a cramped or unusable viewport.
