/**
 * AscendCrew brand tokens.
 *
 * Direction: "Summit Crew" — a mascot/badge apparel-print style
 * (thick ink keylines, flat limited palette, cream paper, arched condensed
 * type, light grain) adapted for a virtual assistant agency: cleaner
 * geometry, less distress, a trust colour (teal) beside the signal orange.
 */
export const AC = {
  ink: '#17161A', // keylines, headline type, dark surface
  chalk: '#F2EBDD', // paper ground
  chalkDeep: '#E4D9C3', // paper shadow / halftone ground
  orange: '#F2652A', // primary signal: flag, CTA, ink offset
  teal: '#1C5C5A', // trust colour: mountain body, secondary fills
  gold: '#E9B949', // sun, stars, highlight
  rope: '#C9A071', // rope ring, tan accents
} as const;

export const FONT = {
  display: '"Anton", "Impact", "Arial Narrow", sans-serif',
  sub: '"Oswald", "Arial Narrow", sans-serif',
  mono: '"IBM Plex Mono", "Courier New", monospace',
} as const;

export const KEYLINE = 10; // px stroke at 400-unit badge scale
