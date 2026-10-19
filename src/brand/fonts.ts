import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Self-hosted (public/fonts) so renders are deterministic and work offline.
export const fontsReady = Promise.all([
  loadFont({family: 'Anton', url: staticFile('fonts/Anton-400.woff2'), weight: '400'}),
  loadFont({family: 'Kaushan Script', url: staticFile('fonts/KaushanScript-400.woff2'), weight: '400'}),
  loadFont({family: 'Oswald', url: staticFile('fonts/Oswald-600.woff2'), weight: '600'}),
]);
