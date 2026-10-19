import React from 'react';
import {AbsoluteFill} from 'remotion';
import './brand/fonts';
import {AscendCrewBadge} from './AscendCrewBadge';

/** Transparent 1200px badge export. Render with `--image-format=png`. */
export const AscendCrewLogo: React.FC = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
    <AscendCrewBadge size={1000} />
  </AbsoluteFill>
);
