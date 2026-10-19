import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import './brand/fonts';
import {AC, FONT} from './brand/ascendcrew';
import {AscendCrewBadge} from './AscendCrewBadge';

export type AscendCrewBrandProps = {
  handle: string;
  services: [string, string, string];
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ─── Texture helpers ──────────────────────────────────────────────────────────
/** Paper grain: a fixed-seed turbulence so every render is identical. */
const Grain: React.FC<{opacity?: number}> = ({opacity = 0.14}) => (
  <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'multiply'}}>
    <filter id="ac-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#ac-grain)" opacity={opacity} />
  </svg>
);

/** A halftone band, the apparel-print stripe used behind headlines. */
const HalftoneBand: React.FC<{y: number; height: number; color?: string; progress: number}> = ({
  y,
  height,
  color = AC.ink,
  progress,
}) => (
  <svg width="100%" height={height} style={{position: 'absolute', left: 0, top: y}}>
    <defs>
      <pattern id="ac-band-dots" width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="7" cy="7" r="3.2" fill={color} />
      </pattern>
    </defs>
    <rect width={`${progress * 100}%`} height={height} fill="url(#ac-band-dots)" opacity="0.22" />
  </svg>
);

// ─── Scene 1: wordmark slam ───────────────────────────────────────────────────
/** Two-colour "misregistered print": orange underprint offset below ink. */
const SlamLetter: React.FC<{char: string; index: number; size: number}> = ({char, index, size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = Math.max(0, frame - index * 3);
  const s = spring({fps, frame: local, config: {damping: 11, stiffness: 160, mass: 0.7}});
  const scale = interpolate(s, [0, 1], [2.4, 1]);
  const opacity = interpolate(local, [0, 4], [0, 1], clamp);
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        fontFamily: FONT.display,
        fontSize: size,
        lineHeight: 0.9,
        color: AC.ink,
        transform: `scale(${scale})`,
        opacity,
        letterSpacing: 2,
      }}
    >
      <span style={{position: 'absolute', left: 7, top: 7, color: AC.orange, zIndex: -1}}>{char}</span>
      {char}
    </span>
  );
};

const WordmarkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const word = 'ASCENDCREW';
  const bandProgress = interpolate(frame, [0, 24], [0, 1], clamp);
  const subS = spring({fps, frame: frame - 36, config: {damping: 200}});
  const stampS = spring({fps, frame: frame - 48, config: {damping: 12, stiffness: 200}});
  return (
    <AbsoluteFill style={{background: AC.chalk, justifyContent: 'center', alignItems: 'center'}}>
      <HalftoneBand y={395} height={290} progress={bandProgress} />
      <div style={{display: 'flex', position: 'relative', zIndex: 1}}>
        {word.split('').map((c, i) => (
          <SlamLetter key={i} char={c} index={i} size={280} />
        ))}
      </div>
      <div
        style={{
          marginTop: 28,
          fontFamily: FONT.sub,
          fontWeight: 600,
          fontSize: 42,
          letterSpacing: 14,
          color: AC.teal,
          opacity: subS,
          transform: `translateY(${(1 - subS) * 20}px)`,
        }}
      >
        VIRTUAL ASSISTANT AGENCY
      </div>
      {/* Rubber-stamp serial, a nod to the apparel-tag detail */}
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 120,
          fontFamily: FONT.mono,
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: 3,
          color: AC.orange,
          border: `5px solid ${AC.orange}`,
          padding: '10px 22px',
          transform: `rotate(-8deg) scale(${interpolate(stampS, [0, 1], [1.8, 1])})`,
          opacity: stampS,
        }}
      >
        REMOTE CREW · ON CALL
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// ─── Scene 2: badge stamp ─────────────────────────────────────────────────────
const BadgeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slam = spring({fps, frame, config: {damping: 13, stiffness: 180, mass: 0.9}});
  const scale = interpolate(slam, [0, 1], [1.7, 1]);
  const rotate = interpolate(slam, [0, 1], [-18, -6]);
  const reveal = interpolate(frame, [14, 50], [0, 1], clamp);
  const ringBurst = interpolate(frame, [8, 30], [0, 1], clamp);
  const sideS = spring({fps, frame: frame - 40, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background: AC.chalk}}>
      <HalftoneBand y={0} height={1080} progress={1} color={AC.teal} />
      {/* Ink burst ring behind the stamp */}
      <div
        style={{
          position: 'absolute',
          left: 480 - 330,
          top: 540 - 330,
          width: 660,
          height: 660,
          borderRadius: '50%',
          border: `14px solid ${AC.ink}`,
          opacity: 1 - ringBurst,
          transform: `scale(${0.6 + ringBurst * 0.9})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 480 - 270,
          top: 540 - 270,
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          transformOrigin: '50% 50%',
        }}
      >
        <AscendCrewBadge size={540} reveal={reveal} />
      </div>
      {/* Side copy */}
      <div
        style={{
          position: 'absolute',
          left: 900,
          top: 300,
          width: 900,
          opacity: sideS,
          transform: `translateX(${(1 - sideS) * 40}px)`,
        }}
      >
        <div style={{fontFamily: FONT.mono, fontWeight: 600, fontSize: 26, letterSpacing: 4, color: AC.orange}}>
          — THE CREW BEHIND YOUR BUSINESS
        </div>
        <div style={{fontFamily: FONT.display, fontSize: 150, lineHeight: 0.92, color: AC.ink, marginTop: 18}}>
          YOU CLIMB.
          <br />
          WE CARRY
          <br />
          <span style={{color: AC.teal}}>THE LOAD.</span>
        </div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// ─── Scene 3: service patches ─────────────────────────────────────────────────
/** An embroidered-patch chip: keyline, inner stitch, flat fill. */
const Patch: React.FC<{label: string; fill: string; text: string; index: number}> = ({label, fill, text, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({fps, frame: frame - index * 10, config: {damping: 14, stiffness: 150}});
  return (
    <div
      style={{
        width: 500,
        height: 240,
        background: fill,
        border: `10px solid ${AC.ink}`,
        borderRadius: 36,
        boxShadow: `12px 12px 0 ${AC.ink}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transform: `translateY(${(1 - s) * 260}px) rotate(${(index - 1) * 3}deg)`,
        opacity: interpolate(s, [0, 0.2], [0, 1], clamp),
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 10,
          border: `4px dashed ${text}`,
          borderRadius: 24,
          opacity: 0.8,
        }}
      />
      <div style={{fontFamily: FONT.display, fontSize: 56, color: text, letterSpacing: 2, textAlign: 'center', lineHeight: 1, padding: '0 30px'}}>
        {label}
      </div>
      <div
        style={{
          position: 'absolute',
          top: -34,
          left: 32,
          background: AC.chalk,
          border: `6px solid ${AC.ink}`,
          fontFamily: FONT.mono,
          fontWeight: 600,
          fontSize: 20,
          letterSpacing: 3,
          color: AC.ink,
          padding: '4px 14px',
        }}
      >
        0{index + 1}
      </div>
    </div>
  );
};

const PatchesScene: React.FC<{services: AscendCrewBrandProps['services']}> = ({services}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const head = spring({fps, frame, config: {damping: 200}});
  const fills = [
    {fill: AC.orange, text: AC.chalk},
    {fill: AC.teal, text: AC.chalk},
    {fill: AC.gold, text: AC.ink},
  ];
  return (
    <AbsoluteFill style={{background: AC.chalk, alignItems: 'center'}}>
      <div
        style={{
          marginTop: 150,
          fontFamily: FONT.display,
          fontSize: 120,
          color: AC.ink,
          letterSpacing: 3,
          opacity: head,
          transform: `translateY(${(1 - head) * -30}px)`,
        }}
      >
        WHAT THE CREW HANDLES
      </div>
      <div style={{display: 'flex', gap: 60, marginTop: 160}}>
        {services.map((label, i) => (
          <Patch key={label} label={label} index={i} fill={fills[i].fill} text={fills[i].text} />
        ))}
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// ─── Scene 4: call to action on the ink ground ───────────────────────────────
const CtaScene: React.FC<{handle: string}> = ({handle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const head = spring({fps, frame, config: {damping: 200}});
  const btn = spring({fps, frame: frame - 18, config: {damping: 12, stiffness: 180}});
  const badge = spring({fps, frame: frame - 6, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background: AC.ink, justifyContent: 'center', alignItems: 'center'}}>
      <HalftoneBand y={0} height={1080} progress={1} color={AC.chalk} />
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 540 - 200,
          opacity: badge,
          transform: `rotate(-8deg) scale(${interpolate(badge, [0, 1], [0.8, 1])})`,
        }}
      >
        <AscendCrewBadge size={400} />
      </div>
      <div style={{position: 'absolute', left: 620, top: 270, opacity: head, transform: `translateY(${(1 - head) * 24}px)`}}>
        <div style={{fontFamily: FONT.display, fontSize: 200, lineHeight: 0.9, color: AC.chalk}}>
          READY TO
          <br />
          <span style={{color: AC.gold}}>CLIMB?</span>
        </div>
        <div
          style={{
            display: 'inline-block',
            marginTop: 50,
            background: AC.orange,
            color: AC.chalk,
            border: `8px solid ${AC.chalk}`,
            boxShadow: `12px 12px 0 ${AC.chalk}`,
            fontFamily: FONT.display,
            fontSize: 64,
            letterSpacing: 6,
            padding: '14px 60px',
            transform: `scale(${interpolate(btn, [0, 1], [0.6, 1])})`,
            opacity: btn,
          }}
        >
          BOOK A CALL
        </div>
        <div style={{marginTop: 34, fontFamily: FONT.mono, fontWeight: 600, fontSize: 32, letterSpacing: 5, color: AC.rope, opacity: btn}}>
          {handle}
        </div>
      </div>
      <Grain opacity={0.2} />
    </AbsoluteFill>
  );
};

// ─── Composition ──────────────────────────────────────────────────────────────
export const AscendCrewBrand: React.FC<AscendCrewBrandProps> = ({handle, services}) => {
  return (
    <AbsoluteFill style={{background: AC.chalk}}>
      <Sequence from={0} durationInFrames={100}>
        <WordmarkScene />
      </Sequence>
      <Sequence from={100} durationInFrames={150}>
        <BadgeScene />
      </Sequence>
      <Sequence from={250} durationInFrames={120}>
        <PatchesScene services={services} />
      </Sequence>
      <Sequence from={370} durationInFrames={80}>
        <CtaScene handle={handle} />
      </Sequence>
    </AbsoluteFill>
  );
};
