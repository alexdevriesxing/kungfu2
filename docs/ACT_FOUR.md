# Act IV — Mandate of Jade and Ash

Act IV is the concluding campaign arc. Prince Jian, Shi-An, the northern standards and the restored Ghost Face witnesses enter the capital before Chancellor Sima can erase the evidence exposed in the previous acts.

## Campaign route

1. **Eastern Capital Gate** — Prince Jian asks Shi-An to open the city without treating its refugees as an invading army.
2. **Lantern Refuge Ward** — the party protects families charged for the right to light their own streets.
3. **Hall of Ten Thousand Petitions** — the original petitions and a ledger of stolen children’s names must survive an attempted purge.
4. **Temple of the Divided Mask** — Moon Veil forces the Ghost Face order to choose between restoring names and serving another throne.
5. **Vermilion Arsenal** — the loyal companies can stand down only after Sima loses control of the capital’s weapons.
6. **Imperial Garden Ruins** — the late emperor’s testament confirms Prince Jian while limiting the future throne.
7. **Hall of the Empty Throne** — Shi-An carries five capital proofs through the final palace defence.
8. **Green Dragon Sky Terrace** — the declared mandate is defended against Chancellor Sima “Pale Dragon.”

## Main quest line

- The March of Three Standards
- Lanterns Against the Gate
- Ten Thousand Unanswered Names
- When Masks Choose a Face
- The Arsenal Chooses
- The Testament Beneath Plum Ash
- The Hall Without an Emperor
- What the Mandate Serves
- The Pale Dragon Chancellor

## Side stories

- **Children of the Confiscated Lanterns** stops the refugee lantern tax.
- **The Ledger of Stolen Names** restores the identities of children absorbed into the Ghost Face network.
- **One Incense Stick for Master Shen** protects the hidden memorial of Shi-An’s teacher.

## Capital proofs

The final throne-hall route requires five proofs. The full campaign can record six:

- the opened refugee gate
- the ten thousand petitions
- the ledger of stolen names
- the reformed Ghost Face register
- control of the Vermilion Arsenal
- the late emperor’s testament

The **Mandate Ledger**, opened with **Y**, shows the current proof set, people support, capital renown and the chosen ending.

## Three persistent endings

The player chooses one of three mandates before the final battle:

1. **Restore Prince Jian** — a limited hereditary restoration bounded by the testament and northern standards.
2. **Council of Provinces** — a rotating council built from the petitions, with Jian serving as first witness.
3. **The Wanderer Mandate** — no permanent throne; authority remains distributed among provinces, villages, monasteries and restored civic institutions.

The choice changes the final battle bonus and is saved as the campaign ending.

## New combat rewards

Weapons:

- Capital Guardian Halberd
- Mirror Mask Ribbon Chain
- Vermilion Tiger Jian
- Pale Dragon Sealblade

Styles:

- Lantern Ward Boxing
- Mirror Mask Steps
- Mandate Without Throne

Chancellor Sima has two escalation phases and restores guard and stamina as each Pale Dragon seal breaks.

## Save and postgame state

Act IV is added by save enrichment and automatically unlocks for saves that completed Act III. Completion stores the selected ending and unlocks the `legacyReady` postgame flag for a later Legacy Journey or New Game Plus expansion.

## Validation

`tests/act-four.mjs` validates wiring, save enrichment, every major chapter, all three authored side-story routes used by the critical playthrough, mandate selection and the final campaign state. Existing Act I–III and whole-game smoke tests remain deployment gates.
