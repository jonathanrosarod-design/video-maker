import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Self-hosted (public/fonts) so renders are deterministic and work offline.
// Weights used across the brand: Anton 400, Oswald 600, IBM Plex Mono 600.
export const fontsReady = Promise.all([
  loadFont({family: 'Anton', url: staticFile('fonts/Anton-400.woff2'), weight: '400'}),
  loadFont({family: 'Oswald', url: staticFile('fonts/Oswald-600.woff2'), weight: '600'}),
  loadFont({family: 'IBM Plex Mono', url: staticFile('fonts/IBMPlexMono-600.woff2'), weight: '600'}),
]);
