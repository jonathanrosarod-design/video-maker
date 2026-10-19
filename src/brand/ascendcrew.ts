/**
 * AscendCrew brand tokens — v2, "one ink on one ground".
 *
 * The reference (worktohard.std) prints every piece in a single ink on a
 * single coloured paper, with halftone dots for shading. AscendCrew uses
 * three colours in total and never more than two in one piece:
 *   clay  ground + chalk ink   (primary colourway)
 *   chalk ground + pine  ink   (paper colourway)
 */
export const AC = {
  clay: '#C4562B', // rust-orange paper, the primary ground
  chalk: '#F3E8D3', // cream: ink on clay, paper on the chalk colourway
  pine: '#1E3B35', // deep pine: ink on chalk
} as const;

export type Colorway = 'clay' | 'chalk';

export const COLORWAY: Record<Colorway, {ground: string; ink: string}> = {
  clay: {ground: AC.clay, ink: AC.chalk},
  chalk: {ground: AC.chalk, ink: AC.pine},
};

export const FONT = {
  display: '"Anton", "Impact", "Arial Narrow", sans-serif',
  script: '"Kaushan Script", "Brush Script MT", cursive',
  sub: '"Oswald", "Arial Narrow", sans-serif',
} as const;
