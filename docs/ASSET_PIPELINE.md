# Production Asset Pipeline

The web build uses an Adobe-free, deterministic asset pipeline designed for crisp 16-bit presentation and reliable slicing.

## Fighter atlases

- Sheet: **2048 × 1024** pixels.
- Fixed grid: **8 columns × 8 rows**.
- Cell size: **256 × 128** pixels.
- Authored cells: **0–59**.
- Reserved transparent cells: **60–63**.
- Transparent safety gutter: **6 pixels on every cell edge**.
- Shared pivot: **(128, 118)** from each cell's top-left corner.
- Filtering: nearest-neighbour only; no interpolation.

All five colourways are generated from the same pose geometry in `src/sprite-atlas.js`. This guarantees identical cell boundaries, pivots and animation timing for Shi-An and every palette variant. `assets/production/sprites/fighter-atlas.json` contains engine-neutral slicing metadata.

Open `tools/export-sprite-atlases.html` in a browser to download a full PNG sheet or any individual 256×128 frame. The exporter produces ordinary transparent PNG files suitable for Aseprite, LibreSprite, Phaser, Godot or Unity.

## Readability policy

- Every fighter palette must pass the automated luminance floor.
- The fallback world renderer uses a brighter daylight sky and warm horizon.
- Atmospheric fog opacity is limited to 12%.
- The free-roaming world uses only a 3% global tint; dark panels are localized to UI regions.

## Validation

```bash
node tests/assets.mjs
node tests/smoke.mjs
```

The asset test rejects wrong dimensions, duplicate or missing frame references, gutter violations, dark palettes, mismatched atlas metadata and a return of the old dark world wash. GitHub Pages runs both tests before deployment.
