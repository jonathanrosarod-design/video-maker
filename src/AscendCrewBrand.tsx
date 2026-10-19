import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import './brand/fonts';
import {COLORWAY, FONT} from './brand/ascendcrew';
import {Grain} from './AscendCrewSheet';
import {
  CrossedAxes,
  ExtrudedWordmark,
  Monogram,
  OvalStars,
  Pennant,
  Roundel,
  ShieldBadge,
  StampLabel,
  TaglineStack,
} from './brand/lockups';

export type AscendCrewBrandProps = {
  handle: string;
  services: [string, string, string];
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Stamp-in: scale from big to 1 with a damped spring, settling into a tilt. */
const Stamp: React.FC<{delay: number; x: number; y: number; rotate?: number; from?: number; children: React.ReactNode}> = ({
  delay,
  x,
  y,
  rotate = 0,
  from = 1.6,
  children,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({fps, frame: frame - delay, config: {damping: 13, stiffness: 170, mass: 0.8}});
  const scale = interpolate(s, [0, 1], [from, 1]);
  const opacity = interpolate(frame - delay, [0, 3], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${scale}) rotate(${rotate}deg)`, opacity}}>
      {children}
    </div>
  );
};

// ─── Scene 1: the wordmark ───────────────────────────────────────────────────
const WordmarkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {ground, ink} = COLORWAY.clay;
  const sub = spring({fps, frame: frame - 30, config: {damping: 200}});
  const script = spring({fps, frame: frame - 46, config: {damping: 14, stiffness: 160}});
  return (
    <AbsoluteFill style={{background: ground}}>
      <Stamp delay={0} x={960 - 520} y={290} from={2}>
        <ExtrudedWordmark ink={ink} paper={ground} width={1040} />
      </Stamp>
      <div
        style={{
          position: 'absolute',
          top: 800,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONT.sub,
          fontWeight: 600,
          fontSize: 38,
          letterSpacing: 16,
          color: ink,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 16}px)`,
        }}
      >
        VIRTUAL ASSISTANT AGENCY
      </div>
      <div
        style={{
          position: 'absolute',
          left: 1290,
          top: 150,
          fontFamily: FONT.script,
          fontSize: 72,
          color: ink,
          transform: `rotate(-8deg) scale(${interpolate(script, [0, 1], [1.8, 1])})`,
          opacity: script,
        }}
      >
        Climb higher
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// ─── Scene 2: the sticker sheet builds up ────────────────────────────────────
const SheetScene: React.FC = () => {
  const {ground, ink} = COLORWAY.clay;
  return (
    <AbsoluteFill style={{background: ground}}>
      <Stamp delay={0} x={90} y={90}>
        <Roundel ink={ink} paper={ground} width={420} uid="v-rd" />
      </Stamp>
      <Stamp delay={10} x={600} y={110}>
        <CrossedAxes ink={ink} paper={ground} width={560} uid="v-ax" />
      </Stamp>
      <Stamp delay={20} x={1260} y={110} rotate={2}>
        <TaglineStack ink={ink} paper={ground} width={560} uid="v-tg" />
      </Stamp>
      <Stamp delay={32} x={80} y={600} rotate={-4}>
        <Pennant ink={ink} paper={ground} width={520} />
      </Stamp>
      <Stamp delay={42} x={680} y={560}>
        <OvalStars ink={ink} paper={ground} width={520} />
      </Stamp>
      <Stamp delay={52} x={1300} y={520}>
        <ShieldBadge ink={ink} paper={ground} width={340} uid="v-sh" />
      </Stamp>
      <Stamp delay={64} x={700} y={830}>
        <Monogram ink={ink} paper={ground} width={150} />
      </Stamp>
      <Grain />
    </AbsoluteFill>
  );
};

// ─── Scene 3: services on the chalk colourway ────────────────────────────────
const ServicesScene: React.FC<{services: AscendCrewBrandProps['services']}> = ({services}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {ground, ink} = COLORWAY.chalk;
  const head = spring({fps, frame, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background: ground}}>
      <div
        style={{
          position: 'absolute',
          top: 170,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONT.display,
          fontSize: 132,
          letterSpacing: 4,
          color: ink,
          opacity: head,
          transform: `translateY(${(1 - head) * -24}px)`,
        }}
      >
        WHAT THE CREW HANDLES
      </div>
      <div
        style={{
          position: 'absolute',
          top: 322,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONT.script,
          fontSize: 56,
          color: ink,
          opacity: head,
        }}
      >
        so you can climb
      </div>
      {services.map((label, i) => (
        <Stamp key={label} delay={14 + i * 10} x={160 + i * 560} y={560} rotate={(i - 1) * 3} from={1.5}>
          <StampLabel ink={ink} paper={ground} width={480} text={label} index={`0${i + 1}`} />
        </Stamp>
      ))}
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

// ─── Scene 4: call to action ─────────────────────────────────────────────────
const CtaScene: React.FC<{handle: string}> = ({handle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {ground, ink} = COLORWAY.clay;
  const head = spring({fps, frame: frame - 6, config: {damping: 200}});
  const btn = spring({fps, frame: frame - 22, config: {damping: 12, stiffness: 180}});
  return (
    <AbsoluteFill style={{background: ground}}>
      <Stamp delay={0} x={170} y={270} rotate={-6}>
        <Roundel ink={ink} paper={ground} width={540} uid="c-rd" />
      </Stamp>
      <div style={{position: 'absolute', left: 820, top: 250, opacity: head, transform: `translateY(${(1 - head) * 24}px)`}}>
        <div style={{fontFamily: FONT.display, fontSize: 210, lineHeight: 0.9, color: ink}}>
          READY TO
          <br />
          CLIMB?
        </div>
        <div
          style={{
            display: 'inline-block',
            marginTop: 54,
            border: `8px solid ${ink}`,
            color: ink,
            fontFamily: FONT.display,
            fontSize: 60,
            letterSpacing: 8,
            padding: '12px 56px',
            transform: `scale(${interpolate(btn, [0, 1], [0.6, 1])})`,
            opacity: btn,
          }}
        >
          BOOK A CALL
        </div>
        <div style={{marginTop: 30, fontFamily: FONT.sub, fontWeight: 600, fontSize: 32, letterSpacing: 6, color: ink, opacity: btn}}>
          {handle}
        </div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// ─── Composition ──────────────────────────────────────────────────────────────
export const AscendCrewBrand: React.FC<AscendCrewBrandProps> = ({handle, services}) => (
  <AbsoluteFill style={{background: COLORWAY.clay.ground}}>
    <Sequence from={0} durationInFrames={100}>
      <WordmarkScene />
    </Sequence>
    <Sequence from={100} durationInFrames={160}>
      <SheetScene />
    </Sequence>
    <Sequence from={260} durationInFrames={110}>
      <ServicesScene services={services} />
    </Sequence>
    <Sequence from={370} durationInFrames={80}>
      <CtaScene handle={handle} />
    </Sequence>
  </AbsoluteFill>
);
