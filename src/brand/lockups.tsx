import React from 'react';
import {FONT} from './ascendcrew';

/**
 * Single-ink lockups. Every component takes `ink` and `paper` and draws with
 * nothing else, so a lockup can sit on either colourway. Sizes are in SVG
 * user units; scale with `width`.
 */
export type InkProps = {ink: string; paper: string; width?: number; style?: React.CSSProperties};

const svgStyle = (style?: React.CSSProperties): React.CSSProperties => ({display: 'block', overflow: 'visible', ...style});

/** Halftone dot pattern in a given colour; `id` must be unique per document. */
const Halftone: React.FC<{id: string; color: string; pitch?: number; r?: number}> = ({id, color, pitch = 6, r = 1.5}) => (
  <pattern id={id} width={pitch} height={pitch} patternUnits="userSpaceOnUse">
    <circle cx={pitch / 2} cy={pitch / 2} r={r} fill={color} />
  </pattern>
);

// ─── The mark: two peaks, a flag, halftone on the shadow side ────────────────
export const MountainMark: React.FC<InkProps & {uid?: string}> = ({ink, paper, width = 200, uid = 'mm', style}) => (
  <svg width={width} height={width * 0.8} viewBox="0 0 200 160" style={svgStyle(style)}>
    <defs>
      <Halftone id={`${uid}-ht`} color={paper} pitch={7} r={1.7} />
      <clipPath id={`${uid}-front`}>
        <polygon points="62,150 128,52 194,150" />
      </clipPath>
    </defs>
    {/* back peak: outline only */}
    <polygon points="6,150 70,66 118,130" fill="none" stroke={ink} strokeWidth="7" strokeLinejoin="round" />
    {/* front peak: solid ink */}
    <polygon points="62,150 128,52 194,150" fill={ink} stroke={ink} strokeWidth="7" strokeLinejoin="round" />
    {/* shadow side shaded with paper-coloured halftone */}
    <rect x="62" y="52" width="66" height="100" fill={`url(#${uid}-ht)`} clipPath={`url(#${uid}-front)`} opacity="0.55" />
    {/* snow cap carved in paper */}
    <polygon points="108,82 128,52 148,82 140,76 132,86 124,76 116,86" fill={paper} />
    {/* summit flag */}
    <line x1="128" y1="52" x2="128" y2="16" stroke={ink} strokeWidth="5" strokeLinecap="round" />
    <polygon points="130,18 160,27 130,36" fill={ink} />
    {/* ground */}
    <line x1="0" y1="152" x2="200" y2="152" stroke={ink} strokeWidth="5" strokeLinecap="round" />
  </svg>
);

// ─── Roundel: arched name around the mark ────────────────────────────────────
export const Roundel: React.FC<InkProps & {uid?: string; top?: string; bottom?: string}> = ({
  ink,
  paper,
  width = 320,
  uid = 'rd',
  top = 'ASCENDCREW',
  bottom = 'VIRTUAL ASSISTANT AGENCY',
  style,
}) => (
  <svg width={width} height={width} viewBox="0 0 320 320" style={svgStyle(style)}>
    <defs>
      <path id={`${uid}-top`} d="M 52 160 A 108 108 0 0 1 268 160" fill="none" />
      <path id={`${uid}-bot`} d="M 56 160 A 104 104 0 0 0 264 160" fill="none" />
    </defs>
    <circle cx="160" cy="160" r="152" fill="none" stroke={ink} strokeWidth="8" />
    <circle cx="160" cy="160" r="136" fill="none" stroke={ink} strokeWidth="2" strokeDasharray="5 7" />
    <circle cx="160" cy="160" r="76" fill="none" stroke={ink} strokeWidth="5" />
    <g transform="translate(100 112) scale(0.6)">
      <MountainMark ink={ink} paper={paper} width={200} uid={`${uid}-m`} />
    </g>
    <text fill={ink} fontSize="34" textAnchor="middle" style={{fontFamily: FONT.display, letterSpacing: 5}}>
      <textPath href={`#${uid}-top`} startOffset="50%">
        {top}
      </textPath>
    </text>
    <text fill={ink} fontSize="15" textAnchor="middle" style={{fontFamily: FONT.sub, fontWeight: 600, letterSpacing: 3.5}}>
      <textPath href={`#${uid}-bot`} startOffset="50%">
        {bottom}
      </textPath>
    </text>
    <g fill={ink}>
      <polygon points="38,160 42,151 52,151 44,145 47,135 38,141 29,135 32,145 24,151 34,151" />
      <polygon points="282,160 286,151 296,151 288,145 291,135 282,141 273,135 276,145 268,151 278,151" />
    </g>
  </svg>
);

// ─── Crossed ice axes with the split name ────────────────────────────────────
const Axe: React.FC<{ink: string; paper: string; transform: string}> = ({ink, paper, transform}) => (
  <g transform={transform}>
    <rect x="-6" y="-120" width="12" height="240" rx="6" fill={ink} />
    <rect x="-3" y="-20" width="6" height="90" fill={paper} opacity="0.9" />
    {/* pick head */}
    <path d="M -46 -128 Q 0 -150 44 -128 L 36 -112 Q 0 -126 -34 -108 Z" fill={ink} />
    <path d="M -48 -126 L -72 -118 L -40 -110 Z" fill={ink} />
    {/* spike */}
    <polygon points="-6,120 6,120 0,146" fill={ink} />
  </g>
);

export const CrossedAxes: React.FC<InkProps & {uid?: string; left?: string; right?: string; sub?: string}> = ({
  ink,
  paper,
  width = 440,
  uid = 'ax',
  left = 'ASC',
  right = 'END',
  sub = 'CREW',
  style,
}) => (
  <svg width={width} height={width * 0.68} viewBox="0 0 440 300" style={svgStyle(style)}>
    <defs>
      <Halftone id={`${uid}-ht`} color={ink} pitch={6} r={1.3} />
    </defs>
    <Axe ink={ink} paper={paper} transform="translate(220 150) rotate(32)" />
    <Axe ink={ink} paper={paper} transform="translate(220 150) rotate(-32)" />
    {/* rope coil at the crossing */}
    <circle cx="220" cy="150" r="22" fill="none" stroke={ink} strokeWidth="7" />
    <circle cx="220" cy="150" r="22" fill="none" stroke={paper} strokeWidth="2" strokeDasharray="4 6" />
    <text x="112" y="186" fill={ink} fontSize="96" textAnchor="middle" style={{fontFamily: FONT.display}}>
      {left}
    </text>
    <text x="330" y="186" fill={ink} fontSize="96" textAnchor="middle" style={{fontFamily: FONT.display}}>
      {right}
    </text>
    <line x1="60" y1="256" x2="150" y2="256" stroke={ink} strokeWidth="3" />
    <text x="220" y="266" fill={ink} fontSize="28" textAnchor="middle" style={{fontFamily: FONT.sub, fontWeight: 600, letterSpacing: 12}}>
      {sub}
    </text>
    <line x1="290" y1="256" x2="380" y2="256" stroke={ink} strokeWidth="3" />
  </svg>
);

// ─── Pennant with the script name ────────────────────────────────────────────
export const Pennant: React.FC<InkProps & {text?: string}> = ({ink, paper, width = 440, text = 'AscendCrew', style}) => (
  <svg width={width} height={width * 0.5} viewBox="0 0 440 220" style={svgStyle(style)}>
    {/* tassels */}
    <path d="M 44 54 L 10 30 M 44 166 L 10 190" stroke={ink} strokeWidth="9" strokeLinecap="round" />
    <path d="M 46 58 L 24 44 M 46 162 L 24 176" stroke={ink} strokeWidth="9" strokeLinecap="round" />
    {/* pole band */}
    <rect x="46" y="40" width="26" height="140" rx="4" fill={ink} />
    {/* flag */}
    <polygon points="72,46 428,110 72,174" fill={ink} />
    <polygon points="86,60 400,110 86,160" fill={paper} />
    <text
      x="176"
      y="124"
      fill={ink}
      fontSize="42"
      textAnchor="middle"
      transform="rotate(-6 176 124)"
      style={{fontFamily: FONT.script}}
    >
      {text}
    </text>
  </svg>
);

// ─── Oval with stars ─────────────────────────────────────────────────────────
export const OvalStars: React.FC<InkProps & {text?: string}> = ({ink, width = 440, text = 'ASCENDCREW', style}) => (
  <svg width={width} height={width * 0.45} viewBox="0 0 440 198" style={svgStyle(style)}>
    <ellipse cx="220" cy="99" rx="210" ry="88" fill="none" stroke={ink} strokeWidth="9" />
    <text x="220" y="124" fill={ink} fontSize="72" textAnchor="middle" style={{fontFamily: FONT.display, letterSpacing: 2}}>
      {text}
    </text>
    <g fill={ink}>
      <polygon points="52,99 56,88 68,88 58,81 62,70 52,77 42,70 46,81 36,88 48,88" />
      <polygon points="388,99 392,88 404,88 394,81 398,70 388,77 378,70 382,81 372,88 384,88" />
    </g>
  </svg>
);

// ─── Extruded italic wordmark with the tracked second word ───────────────────
export const ExtrudedWordmark: React.FC<InkProps & {word?: string; sub?: string; depth?: number}> = ({
  ink,
  paper,
  width = 560,
  word = 'ASCEND',
  sub = 'CREW',
  depth = 12,
  style,
}) => (
  <svg width={width} height={width * 0.46} viewBox="0 0 560 258" style={svgStyle(style)}>
    <g transform="skewX(-8)">
      {Array.from({length: depth}).map((_, i) => (
        <text
          key={i}
          x={300 + (depth - i)}
          y={168 + (depth - i)}
          fill={ink}
          fontSize="156"
          textAnchor="middle"
          style={{fontFamily: FONT.display, letterSpacing: 4}}
        >
          {word}
        </text>
      ))}
      <text x="300" y="168" fill={paper} stroke={ink} strokeWidth="4" paintOrder="stroke" fontSize="156" textAnchor="middle" style={{fontFamily: FONT.display, letterSpacing: 4}}>
        {word}
      </text>
    </g>
    <line x1="150" y1="226" x2="218" y2="226" stroke={ink} strokeWidth="4" />
    <text x="280" y="238" fill={ink} fontSize="40" textAnchor="middle" style={{fontFamily: FONT.sub, fontWeight: 600, letterSpacing: 18}}>
      {sub}
    </text>
    <line x1="342" y1="226" x2="410" y2="226" stroke={ink} strokeWidth="4" />
  </svg>
);

// ─── Monogram ────────────────────────────────────────────────────────────────
export const Monogram: React.FC<InkProps> = ({ink, paper, width = 160, style}) => (
  <svg width={width} height={width} viewBox="0 0 160 160" style={svgStyle(style)}>
    <circle cx="80" cy="80" r="76" fill={ink} />
    <text x="56" y="118" fill={paper} fontSize="104" textAnchor="middle" style={{fontFamily: FONT.display}}>
      A
    </text>
    <text x="104" y="118" fill={paper} stroke={ink} strokeWidth="5" paintOrder="stroke" fontSize="104" textAnchor="middle" style={{fontFamily: FONT.display}}>
      C
    </text>
  </svg>
);

// ─── Shield badge with banner and rays ───────────────────────────────────────
export const ShieldBadge: React.FC<InkProps & {uid?: string}> = ({ink, paper, width = 320, uid = 'sh', style}) => (
  <svg width={width} height={width * 1.1} viewBox="0 0 320 352" style={svgStyle(style)}>
    <path d="M 22 30 H 298 V 230 Q 298 310 160 340 Q 22 310 22 230 Z" fill="none" stroke={ink} strokeWidth="9" strokeLinejoin="round" />
    <path d="M 40 48 H 280 V 226 Q 280 292 160 320 Q 40 292 40 226 Z" fill="none" stroke={ink} strokeWidth="2" strokeDasharray="5 7" />
    {/* rays behind the mark */}
    <g stroke={ink} strokeWidth="5" strokeLinecap="round">
      <line x1="160" y1="160" x2="160" y2="128" />
      <line x1="118" y1="176" x2="92" y2="158" />
      <line x1="202" y1="176" x2="228" y2="158" />
      <line x1="134" y1="162" x2="120" y2="134" />
      <line x1="186" y1="162" x2="200" y2="134" />
    </g>
    <text x="160" y="92" fill={ink} fontSize="36" textAnchor="middle" style={{fontFamily: FONT.display, letterSpacing: 2}}>
      YOU CLIMB
    </text>
    {/* banner */}
    <polygon points="14,100 306,100 320,124 306,148 14,148 0,124" fill={ink} />
    <text x="160" y="137" fill={paper} fontSize="34" textAnchor="middle" style={{fontFamily: FONT.display, letterSpacing: 6}}>
      ASCENDCREW
    </text>
    <g transform="translate(104 168) scale(0.56)">
      <MountainMark ink={ink} paper={paper} width={200} uid={`${uid}-m`} />
    </g>
    <text x="160" y="284" fill={ink} fontSize="19" textAnchor="middle" style={{fontFamily: FONT.sub, fontWeight: 600, letterSpacing: 2}}>
      WE CARRY THE LOAD
    </text>
  </svg>
);

// ─── Stacked tagline with script sign-off ────────────────────────────────────
export const TaglineStack: React.FC<InkProps & {uid?: string}> = ({ink, width = 480, uid = 'tg', style}) => (
  <svg width={width} height={width * 0.66} viewBox="0 0 480 316" style={svgStyle(style)}>
    <defs>
      <path id={`${uid}-arc`} d="M 60 90 Q 240 24 420 90" fill="none" />
    </defs>
    <text fill={ink} fontSize="50" textAnchor="middle" style={{fontFamily: FONT.display, letterSpacing: 3}}>
      <textPath href={`#${uid}-arc`} startOffset="50%">
        YOU CLIMB
      </textPath>
    </text>
    <line x1="112" y1="116" x2="164" y2="116" stroke={ink} strokeWidth="3" />
    <text x="240" y="124" fill={ink} fontSize="24" textAnchor="middle" style={{fontFamily: FONT.sub, fontWeight: 600, letterSpacing: 7}}>
      WE CARRY
    </text>
    <line x1="316" y1="116" x2="368" y2="116" stroke={ink} strokeWidth="3" />
    <text x="240" y="236" fill={ink} fontSize="108" textAnchor="middle" style={{fontFamily: FONT.display, letterSpacing: 4}}>
      THE LOAD
    </text>
    <text x="240" y="296" fill={ink} fontSize="46" textAnchor="middle" transform="rotate(-4 240 296)" style={{fontFamily: FONT.script}}>
      Climb higher
    </text>
    <path d="M 150 308 Q 240 322 338 302" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
  </svg>
);

/** Rubber-stamp style outlined label: ★ TEXT ★ in a rounded box. */
export const StampLabel: React.FC<InkProps & {text: string; index?: string}> = ({ink, width = 420, text, index, style}) => (
  <svg width={width} height={width * 0.38} viewBox="0 0 420 160" style={svgStyle(style)}>
    <rect x="6" y="6" width="408" height="148" rx="30" fill="none" stroke={ink} strokeWidth="8" />
    <rect x="20" y="20" width="380" height="120" rx="20" fill="none" stroke={ink} strokeWidth="2" strokeDasharray="5 7" />
    {index ? (
      <text x="44" y="56" fill={ink} fontSize="20" style={{fontFamily: FONT.sub, fontWeight: 600, letterSpacing: 3}}>
        {index}
      </text>
    ) : null}
    <text x="210" y="106" fill={ink} fontSize={Math.min(46, Math.round(600 / text.length))} textAnchor="middle" style={{fontFamily: FONT.display, letterSpacing: 2}}>
      {text}
    </text>
  </svg>
);
