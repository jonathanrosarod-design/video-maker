# AscendCrew brand kit (Remotion)

Style: one ink on one ground. The reference studio (worktohard.std) prints every
identity in a single ink on a single coloured paper, with halftone dots for
shading, and presents it as a sticker sheet of lockups. AscendCrew uses three
colours in total and never more than two in one piece:

| Colourway | Ground | Ink |
| --- | --- | --- |
| clay (primary) | `#C4562B` clay | `#F3E8D3` chalk |
| chalk (paper) | `#F3E8D3` chalk | `#1E3B35` pine |

The full brand book, tokens and the SVG lockups live in the AscendCrew design
system artifact.

## Files

| File | What |
| --- | --- |
| `src/brand/ascendcrew.ts` | Colour tokens (`AC`, `COLORWAY`) and font stacks (`FONT`) |
| `src/brand/fonts.ts` | Loads the self-hosted fonts from `public/fonts` |
| `src/brand/lockups.tsx` | Every lockup as a single-ink SVG component (`ink`, `paper` props) |
| `src/AscendCrewSheet.tsx` | 1080x1350 sticker sheet still, `colorway` prop |
| `src/AscendCrewBrand.tsx` | 15-second brand reveal (1920x1080, 450 frames) |
| `public/brand/` | Every lockup exported as SVG in both colourways |
| `public/fonts/` | Anton 400, Kaushan Script 400, Oswald 600 (woff2) |

## Render

```bash
npm start                                                   # Remotion Studio
npx remotion render AscendCrewBrand out/ascendcrew-brand.mp4
npx remotion still AscendCrewSheet out/sheet-clay.png
npx remotion still AscendCrewSheetChalk out/sheet-chalk.png
```

## Props

`AscendCrewBrand` takes `handle` (under the CTA) and `services` (three uppercase
labels). `AscendCrewSheet` takes `colorway: 'clay' | 'chalk'`. Defaults are in
`src/Root.tsx`.

## Rules in one breath

Pick a colourway and print everything in it. Anton uppercase for display,
Kaushan Script for the one soft line, Oswald tracked for the second word.
Halftone dots for shading, never a tint. Everything stamps in with a spring,
hard cuts between scenes, colourway changes only at a cut. The mascot is the
one piece to commission from an illustrator; the brief is in the brand book.
