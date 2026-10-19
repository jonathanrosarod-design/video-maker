import React from 'react';
import {AbsoluteFill} from 'remotion';
import './brand/fonts';
import {COLORWAY, type Colorway} from './brand/ascendcrew';
import {
  CrossedAxes,
  ExtrudedWordmark,
  Monogram,
  OvalStars,
  Pennant,
  Roundel,
  ShieldBadge,
  TaglineStack,
} from './brand/lockups';

export type AscendCrewSheetProps = {colorway: Colorway};

/** Paper grain, fixed seed, multiplied over the sheet. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.12}) => (
  <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'multiply'}}>
    <filter id="ac-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#ac-grain)" opacity={opacity} />
  </svg>
);

const Place: React.FC<{x: number; y: number; rotate?: number; children: React.ReactNode}> = ({x, y, rotate = 0, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rotate}deg)`}}>{children}</div>
);

/**
 * The "sticker sheet": every lockup in one ink on one ground, 1080x1350
 * (Instagram portrait). This is the format the reference studio presents
 * every identity in.
 */
export const AscendCrewSheet: React.FC<AscendCrewSheetProps> = ({colorway}) => {
  const {ground, ink} = COLORWAY[colorway];
  const paper = ground;
  return (
    <AbsoluteFill style={{background: ground}}>
      <Place x={60} y={70}>
        <Roundel ink={ink} paper={paper} width={400} uid="s-rd" />
      </Place>
      <Place x={520} y={80}>
        <CrossedAxes ink={ink} paper={paper} width={500} uid="s-ax" />
      </Place>
      <Place x={540} y={420}>
        <TaglineStack ink={ink} paper={paper} width={470} uid="s-tg" />
      </Place>
      <Place x={50} y={520} rotate={-4}>
        <Pennant ink={ink} paper={paper} width={440} />
      </Place>
      <Place x={60} y={790}>
        <OvalStars ink={ink} paper={paper} width={440} />
      </Place>
      <Place x={580} y={760}>
        <ShieldBadge ink={ink} paper={paper} width={300} uid="s-sh" />
      </Place>
      <Place x={40} y={1040}>
        <ExtrudedWordmark ink={ink} paper={paper} width={520} />
      </Place>
      <Place x={900} y={1140}>
        <Monogram ink={ink} paper={paper} width={130} />
      </Place>
      <Grain />
    </AbsoluteFill>
  );
};
