import React from 'react';
import {AC, FONT} from './brand/ascendcrew';

/**
 * The AscendCrew emblem: a circular apparel-style badge.
 * Drawn in a 400x400 box so it scales cleanly; `size` sets the rendered px.
 * `reveal` (0..1) drives the draw-on of the rope ring and arched text so the
 * badge can animate in without the parent knowing its internals.
 */
export const AscendCrewBadge: React.FC<{
  size?: number;
  reveal?: number;
  topText?: string;
  bottomText?: string;
  ribbonText?: string;
  style?: React.CSSProperties;
}> = ({
  size = 400,
  reveal = 1,
  topText = 'ASCENDCREW',
  bottomText = 'VIRTUAL ASSISTANT AGENCY',
  ribbonText = 'CLIMB HIGHER',
  style,
}) => {
  const ringCirc = 2 * Math.PI * 150;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      style={{display: 'block', overflow: 'visible', ...style}}
    >
      <defs>
        {/* Top arc, read left to right over the crown */}
        <path id="ac-arc-top" d="M 60 200 A 140 140 0 0 1 340 200" fill="none" />
        {/* Bottom arc, read left to right under the base */}
        <path id="ac-arc-bottom" d="M 62 200 A 138 138 0 0 0 338 200" fill="none" />
        <pattern id="ac-halftone" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="3.5" cy="3.5" r="1.4" fill={AC.ink} />
        </pattern>
        <clipPath id="ac-inner">
          <circle cx="200" cy="200" r="118" />
        </clipPath>
      </defs>

      {/* Outer keyline + paper */}
      <circle cx="200" cy="200" r="190" fill={AC.chalk} stroke={AC.ink} strokeWidth="10" />
      {/* Twisted rope ring, draws on with `reveal` */}
      <circle
        cx="200"
        cy="200"
        r="150"
        fill="none"
        stroke={AC.rope}
        strokeWidth="9"
        strokeDasharray={`${ringCirc * reveal} ${ringCirc}`}
        strokeLinecap="butt"
        transform="rotate(-90 200 200)"
      />
      <circle
        cx="200"
        cy="200"
        r="150"
        fill="none"
        stroke={AC.ink}
        strokeWidth="3"
        strokeDasharray="6 9"
        opacity={reveal}
      />

      {/* Inner scene: sky with halftone, sun, two peaks, flag */}
      <g clipPath="url(#ac-inner)">
        <circle cx="200" cy="200" r="118" fill={AC.teal} />
        <rect x="80" y="80" width="240" height="110" fill="url(#ac-halftone)" opacity="0.28" />
        <circle cx="248" cy="150" r="34" fill={AC.gold} stroke={AC.ink} strokeWidth="6" />
        {/* Back peak */}
        <polygon
          points="90,300 190,160 290,300"
          fill={AC.chalk}
          stroke={AC.ink}
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <polygon points="162,199 190,160 218,199 206,190 196,201 184,190 174,201" fill={AC.ink} opacity="0.12" />
        {/* Front peak, the brand orange */}
        <polygon
          points="130,320 232,178 334,320"
          fill={AC.orange}
          stroke={AC.ink}
          strokeWidth="7"
          strokeLinejoin="round"
        />
        {/* Snow cap on front peak */}
        <polygon
          points="206,214 232,178 258,214 248,206 238,216 228,206 218,216"
          fill={AC.chalk}
          stroke={AC.ink}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {/* Summit flag */}
        <line x1="232" y1="178" x2="232" y2="128" stroke={AC.ink} strokeWidth="6" strokeLinecap="round" />
        <polygon points="235,130 272,142 235,154" fill={AC.gold} stroke={AC.ink} strokeWidth="5" strokeLinejoin="round" />
        {/* Ground band */}
        <rect x="60" y="300" width="280" height="40" fill={AC.ink} />
      </g>
      <circle cx="200" cy="200" r="118" fill="none" stroke={AC.ink} strokeWidth="8" />

      {/* Arched type */}
      <g opacity={reveal} style={{fontFamily: FONT.display, letterSpacing: 3}}>
        <text fontSize="38" fill={AC.ink} textAnchor="middle">
          <textPath href="#ac-arc-top" startOffset="50%">
            {topText}
          </textPath>
        </text>
        <text fontSize="19" fill={AC.ink} textAnchor="middle" style={{fontFamily: FONT.sub, fontWeight: 600, letterSpacing: 4}}>
          <textPath href="#ac-arc-bottom" startOffset="50%">
            {bottomText}
          </textPath>
        </text>
      </g>
      {/* Stars at the equator */}
      <g fill={AC.gold} stroke={AC.ink} strokeWidth="3" strokeLinejoin="round" opacity={reveal}>
        <polygon points="44,200 49,189 60,189 51,182 55,171 44,178 33,171 37,182 28,189 39,189" />
        <polygon points="356,200 361,189 372,189 363,182 367,171 356,178 345,171 349,182 340,189 351,189" />
      </g>

      {/* Ribbon */}
      <g opacity={reveal} transform={`translate(0 ${(1 - reveal) * 24})`}>
        <polygon points="70,350 330,350 350,378 330,406 70,406 50,378" fill={AC.orange} stroke={AC.ink} strokeWidth="8" strokeLinejoin="round" />
        <text
          x="200"
          y="388"
          fontSize="28"
          fill={AC.chalk}
          textAnchor="middle"
          style={{fontFamily: FONT.display, letterSpacing: 5}}
        >
          {ribbonText}
        </text>
      </g>
    </svg>
  );
};
