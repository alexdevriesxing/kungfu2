# Wuxia Presentation System

The presentation overhaul establishes one coherent art language across the title screen, exploration, combat, menus, mobile controls and postgame.

## Art direction

The visual hierarchy combines:

- dark ink and lacquer foundations
- jade green for life, guidance and spiritual energy
- imperial gold for mastery, hierarchy and rewards
- cinnabar red for seals, danger and decisive moments
- parchment highlights for readable text
- soft silk pink and blue-grey mist for atmosphere

The renderer remains pixel-aligned, but the composition is inspired by Chinese ink painting, stage opera, carved jade frames and martial-arts title cards.

## Location-aware atmosphere

`src/wuxia-presentation.js` selects a theme from the current location and stage name.

- Villages: peach blossoms and warm lantern haze
- Markets: floating lantern light and gold dust
- Bamboo forests: layered leaves and green atmospheric tint
- Mountain and Wu Dang areas: long mist ribbons and cool ink depth
- Shaolin: warm embers and temple gold
- Rivers and ferries: drifting petals and reflective blue grading
- Ghost Face Opera: crimson silk fragments
- Council and court locations: restrained gold motes
- Northern regions: active snowfall and pale mist
- War camps: rising embers
- Ghost sanctums: ash and violet-grey atmosphere
- Capital regions: imperial gold, smoke and ash
- Hall of Returning Paths: jade motes and spiritual glow

Generated stage canvases receive a one-time enrichment layer with ink mountains, clouds, atmospheric color, foreground grasses and region-specific details. Existing stage composition is preserved.

## Canvas UI language

`src/art.js` provides the shared interface primitives.

- Panels use lacquer gradients and clipped corners
- Gold exterior lines and jade interior lines create hierarchy
- Cinnabar diamonds mark ornamental corners
- HP, Chi, stamina and guard bars use layered enamel gradients
- Portraits use double frames, lower vignette treatment and seal marks
- Text gains controlled shadowing for readability without a heavy outline

## Cinematic events

The presentation layer wraps existing game events without altering campaign logic.

### Rival and boss entrances

Every fight receives a brief ink-brush name card. Bosses receive a longer presentation, black cinematic bars and a red battle seal.

### Travel

Successful travel between regions triggers a fast brush-wipe transition and resets location particles so the next area has the correct atmosphere immediately.

### Chapter completion

Act completion modes produce dedicated scroll banners:

- The Ashes Have Spoken
- The Black River Yields Its Secrets
- The Crown Beneath Snow
- A Legacy Now Awaits

### Victory

The battle rank is stamped into a large cinnabar victory seal.

### Title screen

The title composition adds enso-style rings, floating jade and gold motes, Chinese wuxia titling and a Green Dragon seal while retaining the established key-art scene and menu.

## Responsive shell

`styles.css` adds:

- layered silk and ink page background
- ornamental game-frame corners
- jade glow and gold edge treatment
- premium loading composition with dragon watermark
- angular lacquer touch buttons
- four-column mobile action pad
- improved landscape fitting and safe-area handling
- reduced-motion support for CSS animation

## Performance

- Stage enrichment runs once per generated stage canvas.
- Dynamic particles reuse a fixed array and wrap around the screen.
- No external image requests or additional runtime dependencies are introduced.
- All effects use the existing 960×540 canvas and current animation loop.
- Menus suppress most environmental particle drawing to retain clarity.

## Validation

`tests/wuxia-presentation.mjs` validates:

- module bootstrap and offline caching
- visual theme coverage
- CSS shell and mobile layout
- stage-canvas enrichment
- title and chapter state
- boss entrance state
- victory presentation safety
- travel brush transitions

The full Acts I–IV, Legacy Journey, combat, save and smoke suites remain required before deployment.
