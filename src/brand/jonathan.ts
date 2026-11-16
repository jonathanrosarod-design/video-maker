import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

/**
 * Jonathan Rosa brand tokens, taken from his Instagram reels
 * (e.g. the "On Set" episode with Camila Markson):
 * - two-line titles: white on a near-black box, then white on an orange box
 * - small monospace tags in dark boxes, orange viewfinder corner brackets
 * - captions in white with one key word in an orange serif italic
 * - lower third: bold name, monospace role, orange side bar
 */
export const JR = {
  orange: '#FC4810',
  black: '#111214',
  box: '#0B0B0D',
  white: '#FFFFFF',
  mute: '#B9BBC0',
  bgCenter: '#2A2C30',
  bgEdge: '#0C0D0F',
} as const;

export const JR_FONT = {
  title: '"Montserrat", "Arial Black", sans-serif',
  mono: '"JetBrains Mono", "Courier New", monospace',
  serif: '"Instrument Serif", Georgia, serif',
} as const;

// Self-hosted (public/fonts) so renders are deterministic and work offline.
export const jrFontsReady = Promise.all([
  loadFont({family: 'Montserrat', url: staticFile('fonts/Montserrat-800.woff2'), weight: '800'}),
  loadFont({family: 'Montserrat', url: staticFile('fonts/Montserrat-600.woff2'), weight: '600'}),
  loadFont({family: 'Instrument Serif', url: staticFile('fonts/InstrumentSerif-400-italic.woff2'), weight: '400', style: 'italic'}),
  loadFont({family: 'JetBrains Mono', url: staticFile('fonts/JetBrainsMono-500.woff2'), weight: '500'}),
]);
