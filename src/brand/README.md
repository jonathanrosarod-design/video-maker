# AscendCrew brand kit (Remotion)

Style: "Summit Crew". A mascot-and-badge apparel-print look (thick ink keylines,
flat limited palette, cream paper, arched condensed type, light grain) adapted
for a virtual assistant agency. The full brand book, tokens and component
previews live in the AscendCrew design system artifact.

## Files

| File | What |
| --- | --- |
| `src/brand/ascendcrew.ts` | Colour tokens (`AC`) and font stacks (`FONT`) |
| `src/brand/fonts.ts` | Loads the self-hosted fonts from `public/fonts` |
| `src/AscendCrewBadge.tsx` | The emblem as an SVG React component (`size`, `reveal`, text props) |
| `src/AscendCrewBrand.tsx` | 15-second brand reveal (`AscendCrewBrand`, 1920x1080, 450 frames) |
| `src/AscendCrewLogo.tsx` | 1200px transparent logo still (`AscendCrewLogo`) |
| `public/brand/ascendcrew-badge.svg` | Standalone badge SVG for web and print |
| `public/fonts/` | Anton 400, Oswald 600, IBM Plex Mono 600 (woff2) |

## Render

```bash
npm start                                   # Remotion Studio
npx remotion render AscendCrewBrand out/ascendcrew-brand.mp4
npx remotion still AscendCrewLogo out/ascendcrew-logo.png --image-format=png
```

## Props

`AscendCrewBrand` takes `handle` (shown under the CTA) and `services`
(three uppercase patch labels). Edit the defaults in `src/Root.tsx`.

## Rules in one breath

Ink keylines on chalk paper. One orange signal per frame, teal for trust,
gold for the highlight. Anton uppercase for headlines, Oswald for sublines,
Plex Mono for stamps. Hard offset shadows, never blur. Everything arrives by
stamping (spring from 1.7x to 1), hard cuts between scenes.
