import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Series,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import './brand/fonts';
import {COLORWAY, FONT} from './brand/ascendcrew';
import {Grain} from './AscendCrewSheet';
import {StampLabel} from './brand/lockups';

/**
 * Video Content Made Easy: horizontal animated sales-page video.
 * 1920x1080, 30 fps, about 104 seconds, with voiceover, music and sound effects.
 * Every scene length and animation cue is timed to the voiceover clips in
 * public/vcme-audio (cue frames are measured from the processed clips).
 * Style follows the brand kit: one ink on one ground, stamp-in springs,
 * hard cuts, colourway changes only at a cut.
 */
export type VCMESalesVideoProps = {
  price: string;
  foundingPrice: string;
  totalValue: string;
  cta: string;
  brandLine: string;
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const CLAY = COLORWAY.clay;
const CHALK = COLORWAY.chalk;

/** Frames of air before each scene's voiceover starts. */
const LEAD = 10;

// ─── Audio helpers ────────────────────────────────────────────────────────────
const a = (name: string) => staticFile(`vcme-audio/${name}.mp3`);

type SfxName = 'stamp' | 'whoosh' | 'strike' | 'tick' | 'cash' | 'impact' | 'chime';
const SFX_VOL: Record<SfxName, number> = {stamp: 0.32, whoosh: 0.28, strike: 0.4, tick: 0.35, cash: 0.45, impact: 0.5, chime: 0.4};

const Sfx: React.FC<{at: number; name: SfxName; volume?: number}> = ({at, name, volume}) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={75} layout="none">
    <Audio src={a(`sfx-${name}`)} volume={volume ?? SFX_VOL[name]} />
  </Sequence>
);

const Vo: React.FC<{clip: string; at?: number}> = ({clip, at = LEAD}) => (
  <Sequence from={at} layout="none">
    <Audio src={a(`vo-${clip}`)} volume={1} />
  </Sequence>
);

// ─── Motion helpers ───────────────────────────────────────────────────────────
const useIn = (delay: number, damping = 200) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({fps, frame: frame - delay, config: {damping}});
};

/** Stamp-in: big to 1 with a damped spring. */
const Stamp: React.FC<{delay: number; from?: number; rotate?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({
  delay,
  from = 1.6,
  rotate = 0,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({fps, frame: frame - delay, config: {damping: 13, stiffness: 170, mass: 0.8}});
  const scale = interpolate(s, [0, 1], [from, 1]);
  const opacity = interpolate(frame - delay, [0, 3], [0, 1], clamp);
  return <div style={{transform: `scale(${scale}) rotate(${rotate}deg)`, opacity, ...style}}>{children}</div>;
};

/** Fade and rise in. */
const Rise: React.FC<{delay: number; dist?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({
  delay,
  dist = 28,
  style,
  children,
}) => {
  const p = useIn(delay);
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * dist}px)`, ...style}}>{children}</div>;
};

const Kicker: React.FC<{color: string; children: React.ReactNode; style?: React.CSSProperties}> = ({color, children, style}) => (
  <div style={{fontFamily: FONT.sub, fontWeight: 600, fontSize: 34, letterSpacing: 14, color, ...style}}>{children}</div>
);

// ─── 1. Hook ──────────────────────────────────────────────────────────────────
// VO: "Most entrepreneurs don't have a content problem. | They have a story they haven't told yet."
const HOOK = {kicker: LEAD, words: 26, wordGap: 14, script: LEAD + 121};

const HookScene: React.FC = () => {
  const {ground, ink} = CLAY;
  const words = ["DON'T", 'HAVE', 'A', 'CONTENT', 'PROBLEM.'];
  return (
    <AbsoluteFill style={{background: ground, alignItems: 'center', justifyContent: 'center'}}>
      <Vo clip="00" />
      {words.map((w, i) => (
        <Sfx key={w} at={HOOK.words + i * HOOK.wordGap} name="stamp" volume={0.22} />
      ))}
      <Sfx at={HOOK.script - 4} name="whoosh" />
      <div style={{textAlign: 'center'}}>
        <Rise delay={HOOK.kicker}>
          <Kicker color={ink}>MOST ENTREPRENEURS</Kicker>
        </Rise>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 34px', maxWidth: 1600, marginTop: 24}}>
          {words.map((w, i) => (
            <Stamp key={w} delay={HOOK.words + i * HOOK.wordGap} from={1.9}>
              <div style={{fontFamily: FONT.display, fontSize: 170, lineHeight: 1.02, color: ink}}>{w}</div>
            </Stamp>
          ))}
        </div>
        <Stamp delay={HOOK.script} from={1.5} rotate={-3}>
          <div style={{fontFamily: FONT.script, fontSize: 76, color: ink, marginTop: 40}}>They have a story they haven't told yet.</div>
        </Stamp>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// ─── 2. Problem ───────────────────────────────────────────────────────────────
// VO: "You're great in person. | But the moment the camera turns on, | you freeze. | And your last post was three weeks ago."
const PROB = {great: LEAD, camera: LEAD + 55, turns: LEAD + 70, freeze: LEAD + 116, last: LEAD + 156};

const Phone: React.FC<{ink: string; ground: string}> = ({ink, ground}) => {
  const frame = useCurrentFrame();
  const ideas = ['Story about my first client', 'Why most people quit', '3 mistakes I made', 'Behind the scenes', 'My morning routine'];
  const cursorOn = Math.floor(frame / 15) % 2 === 0;
  return (
    <div style={{width: 430, height: 820, border: `10px solid ${ink}`, borderRadius: 60, padding: '64px 40px', position: 'relative', background: ground}}>
      <div style={{position: 'absolute', top: 22, left: '50%', width: 120, height: 14, marginLeft: -60, borderRadius: 7, background: ink}} />
      <div style={{fontFamily: FONT.display, fontSize: 52, color: ink}}>VIDEO IDEAS</div>
      <div style={{height: 4, background: ink, margin: '14px 0 22px'}} />
      {ideas.map((t, i) => (
        <Rise key={t} delay={10 + i * 8} dist={12}>
          <div style={{fontFamily: FONT.sub, fontWeight: 600, fontSize: 27, color: ink, padding: '13px 0', borderBottom: `2px dashed ${ink}`, display: 'flex', gap: 14}}>
            <span style={{width: 26, height: 26, border: `3px solid ${ink}`, flexShrink: 0, marginTop: 4}} />
            {t}
          </div>
        </Rise>
      ))}
      <div style={{fontFamily: FONT.sub, fontWeight: 600, fontSize: 24, color: ink, marginTop: 26, opacity: 0.7}}>
        Filmed: 0 {cursorOn ? '|' : ''}
      </div>
    </div>
  );
};

const ProblemScene: React.FC = () => {
  const {ground, ink} = CHALK;
  const lines = [
    {t: 'GREAT IN PERSON.', d: PROB.great},
    {t: 'THEN THE CAMERA', d: PROB.camera},
    {t: 'TURNS ON...', d: PROB.turns},
  ];
  return (
    <AbsoluteFill style={{background: ground}}>
      <Vo clip="01" />
      <Sfx at={0} name="whoosh" />
      <Sfx at={PROB.freeze} name="stamp" />
      <Sfx at={PROB.last} name="stamp" />
      <div style={{position: 'absolute', left: 170, top: 130}}>
        <Stamp delay={0} from={1.2} rotate={-4}>
          <Phone ink={ink} ground={ground} />
        </Stamp>
      </div>
      <div style={{position: 'absolute', left: 780, top: 230}}>
        {lines.map((l) => (
          <Rise key={l.t} delay={l.d}>
            <div style={{fontFamily: FONT.display, fontSize: 120, lineHeight: 1.04, color: ink}}>{l.t}</div>
          </Rise>
        ))}
        <Stamp delay={PROB.freeze} from={2.2} rotate={-5} style={{transformOrigin: 'left center'}}>
          <div style={{fontFamily: FONT.script, fontSize: 110, color: ink, marginTop: 10}}>and you freeze.</div>
        </Stamp>
        <Stamp delay={PROB.last} from={1.8} rotate={3} style={{display: 'inline-block', marginTop: 40}}>
          <div style={{border: `7px solid ${ink}`, padding: '10px 30px', fontFamily: FONT.sub, fontWeight: 600, fontSize: 38, letterSpacing: 8, color: ink}}>
            LAST POST: 3 WEEKS AGO
          </div>
        </Stamp>
      </div>
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

// ─── 3. The four bottlenecks ─────────────────────────────────────────────────
// VO: "That's because every video starts from zero. | Ideas. | Scripts. | Filming. | Editing. |
//      Four bottlenecks between you and the post button. | Let's remove them."
const BOTT = {head: LEAD, labels: [LEAD + 79, LEAD + 111, LEAD + 142, LEAD + 173], footer: LEAD + 203, remove: LEAD + 290, strike: LEAD + 292};

const BottleneckScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {ground, ink} = CLAY;
  const items = ['IDEAS', 'SCRIPTS', 'FILMING', 'EDITING'];
  return (
    <AbsoluteFill style={{background: ground}}>
      <Vo clip="02" />
      {BOTT.labels.map((at) => (
        <Sfx key={at} at={at} name="stamp" />
      ))}
      {items.map((t, i) => (
        <Sfx key={t} at={BOTT.strike + i * 8} name="strike" volume={0.3} />
      ))}
      <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center'}}>
        <Rise delay={BOTT.head}>
          <div style={{fontFamily: FONT.display, fontSize: 130, color: ink}}>EVERY VIDEO STARTS FROM ZERO</div>
        </Rise>
      </div>
      <div style={{position: 'absolute', top: 420, left: 75, display: 'flex', gap: 30}}>
        {items.map((t, i) => {
          const strike = interpolate(frame - (BOTT.strike + i * 8), [0, 10], [0, 1], clamp);
          return (
            <div key={t} style={{position: 'relative'}}>
              <Stamp delay={BOTT.labels[i]} rotate={(i % 2 ? 1 : -1) * 3} from={1.6}>
                <StampLabel ink={ink} paper={ground} width={420} text={t} index={`0${i + 1}`} />
              </Stamp>
              {/* each bottleneck gets crossed out */}
              <svg width={420} height={160} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
                <line x1={30} y1={30} x2={30 + 360 * strike} y2={30 + 100 * strike} stroke={ink} strokeWidth={12} strokeLinecap="round" opacity={strike > 0 ? 1 : 0} />
              </svg>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 780, width: '100%', textAlign: 'center'}}>
        <Rise delay={BOTT.footer}>
          <div style={{fontFamily: FONT.sub, fontWeight: 600, fontSize: 46, letterSpacing: 6, color: ink}}>
            FOUR BOTTLENECKS BETWEEN YOU AND THE POST BUTTON.
          </div>
        </Rise>
        <Stamp delay={BOTT.remove} from={1.6} rotate={-2}>
          <div style={{fontFamily: FONT.script, fontSize: 72, color: ink, marginTop: 26}}>Let's remove them.</div>
        </Stamp>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// ─── 4. Product reveal ───────────────────────────────────────────────────────
// VO: "Introducing | Video Content Made Easy. | Because | your story is your authority."
const REV = {intro: LEAD, title: LEAD + 62, script: LEAD + 106, bar: LEAD + 160};

const RevealScene: React.FC = () => {
  const {ground, ink} = CHALK;
  return (
    <AbsoluteFill style={{background: ground, alignItems: 'center', justifyContent: 'center'}}>
      <Vo clip="03" />
      <Sfx at={REV.title} name="impact" />
      <div style={{textAlign: 'center'}}>
        <Rise delay={REV.intro}>
          <Kicker color={ink}>INTRODUCING</Kicker>
        </Rise>
        <Stamp delay={REV.title} from={2.2}>
          <div style={{fontFamily: FONT.display, fontSize: 250, lineHeight: 0.92, color: ink, marginTop: 20}}>
            VIDEO CONTENT
            <br />
            MADE EASY
          </div>
        </Stamp>
        <Stamp delay={REV.script} from={1.6} rotate={-3}>
          <div style={{fontFamily: FONT.script, fontSize: 84, color: ink, marginTop: 24}}>Your story is your authority.</div>
        </Stamp>
        <Rise delay={REV.bar}>
          <div style={{display: 'inline-block', marginTop: 30, borderTop: `5px solid ${ink}`, paddingTop: 18}}>
            <Kicker color={ink} style={{fontSize: 32, letterSpacing: 10}}>
              8 TRAINING MODULES + 4 WEEKS OF LIVE COACHING
            </Kicker>
          </div>
        </Rise>
      </div>
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

// ─── 5. The method, step by step ─────────────────────────────────────────────
// VO: intro "Here's the Content Authority Method, step by step." then one clip per step.
const STEPS = [
  {title: 'STORY BANK', line: '5 questions turn your life into 30 video ideas.', vo: '05', len: 188},
  {title: 'YOUR VOICE', line: 'Sound like you. AI shapes the structure, never your words.', vo: '06', len: 181},
  {title: 'SCRIPTS IN MINUTES', line: 'Hook. Story. Lesson.', vo: '07', len: 137},
  {title: 'FILM A WEEK', line: 'One sitting. A week of videos.', vo: '08', len: 149},
  {title: 'EDIT FAST', line: 'Branded templates and a five-pass edit.', vo: '09', len: 123},
];
const STEP_START = 163;
const STEP_AT = STEPS.map((_, i) => STEP_START + STEPS.slice(0, i).reduce((s, x) => s + x.len, 0));
const METHOD_LEN = STEP_START + STEPS.reduce((s, x) => s + x.len, 0);

const MethodScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {ground, ink} = CLAY;
  let idx = 0;
  STEP_AT.forEach((at, i) => {
    if (frame >= at) idx = i;
  });
  const trackX = 260;
  const trackW = 1400;
  const gap = trackW / (STEPS.length - 1);
  const fill = interpolate(frame, STEP_AT, STEPS.map((_, i) => i / (STEPS.length - 1)), clamp);
  const step = STEPS[idx];
  return (
    <AbsoluteFill style={{background: ground}}>
      <Vo clip="04" />
      {STEPS.map((s, i) => (
        <React.Fragment key={s.vo}>
          <Vo clip={s.vo} at={STEP_AT[i] + 6} />
          <Sfx at={STEP_AT[i]} name="whoosh" />
          <Sfx at={STEP_AT[i] + 2} name="stamp" volume={0.25} />
        </React.Fragment>
      ))}
      <div style={{position: 'absolute', top: 90, width: '100%', textAlign: 'center'}}>
        <Rise delay={LEAD}>
          <Kicker color={ink}>THE CONTENT AUTHORITY METHOD</Kicker>
        </Rise>
      </div>
      {/* intro title while the method is introduced */}
      {frame < STEP_START ? (
        <div style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center'}}>
          <Stamp delay={LEAD + 4} from={1.6}>
            <div style={{fontFamily: FONT.display, fontSize: 150, lineHeight: 1, color: ink}}>5 STEPS</div>
          </Stamp>
          <Rise delay={LEAD + 30}>
            <div style={{fontFamily: FONT.script, fontSize: 68, color: ink, marginTop: 16}}>From your story to a weekly habit.</div>
          </Rise>
        </div>
      ) : null}
      {/* progress track */}
      <svg width={1920} height={200} style={{position: 'absolute', top: 160, left: 0}}>
        <line x1={trackX} y1={100} x2={trackX + trackW} y2={100} stroke={ink} strokeWidth={4} strokeDasharray="10 12" opacity={frame >= 8 ? 1 : 0} />
        <line x1={trackX} y1={100} x2={trackX + trackW * fill} y2={100} stroke={ink} strokeWidth={12} strokeLinecap="round" />
        {STEPS.map((s, i) => {
          const on = frame >= STEP_AT[i];
          return (
            <g key={s.title}>
              <circle cx={trackX + i * gap} cy={100} r={38} fill={on ? ink : ground} stroke={ink} strokeWidth={8} />
              <text x={trackX + i * gap} y={114} textAnchor="middle" fontSize={40} fill={on ? ground : ink} style={{fontFamily: FONT.display}}>
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
      {/* active step card, re-stamped every step */}
      {frame >= STEP_START ? (
        <div key={idx} style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center'}}>
          <StepCard delay={STEP_AT[idx]} ink={ink} title={step.title} line={step.line} n={idx + 1} />
        </div>
      ) : null}
      <Grain />
    </AbsoluteFill>
  );
};

const StepCard: React.FC<{delay: number; ink: string; title: string; line: string; n: number}> = ({delay, ink, title, line, n}) => (
  <>
    <Stamp delay={delay} from={1.7} rotate={n % 2 ? -2 : 2}>
      <div style={{fontFamily: FONT.sub, fontWeight: 600, fontSize: 34, letterSpacing: 12, color: ink}}>STEP 0{n}</div>
      <div style={{fontFamily: FONT.display, fontSize: 190, lineHeight: 1, color: ink}}>{title}</div>
    </Stamp>
    <Rise delay={delay + 14}>
      <div style={{fontFamily: FONT.script, fontSize: 68, color: ink, marginTop: 16}}>{line}</div>
    </Rise>
  </>
);

// ─── 6. Offer stack ──────────────────────────────────────────────────────────
// VO: "You get eight training modules, | four weeks of live coaching with Jonathan, | the Story Bank workbook, |
//      script formulas, | the prompt vault, | the motion pack, | templates, | and three bonuses."
const STACK: [string, string, number][] = [
  ['8 training modules', '$297', LEAD + 9],
  ['4 weeks of live group coaching', '$297', LEAD + 74],
  ['Story Bank Workbook + Voice Blueprint', '$97', LEAD + 168],
  ['60-second and 25-second script formulas', '$97', LEAD + 227],
  ['Video Prompt Vault', '$67', LEAD + 280],
  ['Motion Pack Vol. 1', '$97', LEAD + 327],
  ['Brand reveal + ad templates', '$147', LEAD + 372],
  ['3 bonuses + private community', '$211', LEAD + 408],
  ['Fast-action video review (first 50)', '$97', LEAD + 438],
];

const StackScene: React.FC = () => {
  const {ground, ink} = CHALK;
  return (
    <AbsoluteFill style={{background: ground}}>
      <Vo clip="10" />
      {STACK.map(([label, , at]) => (
        <Sfx key={label} at={at + 8} name="tick" />
      ))}
      <div style={{position: 'absolute', left: 200, top: 56, width: 1520}}>
        <Rise delay={0}>
          <div style={{fontFamily: FONT.display, fontSize: 96, color: ink}}>EVERYTHING YOU GET</div>
        </Rise>
        <div style={{marginTop: 8}}>
          {STACK.map(([label, value, at]) => (
            <Rise key={label} delay={at} dist={18}>
              <div style={{display: 'flex', alignItems: 'center', borderBottom: `3px solid ${ink}`, padding: '9px 0'}}>
                <Stamp delay={at + 8} from={2}>
                  <svg width={46} height={46} viewBox="0 0 46 46" style={{display: 'block', marginRight: 28}}>
                    <rect x={3} y={3} width={40} height={40} fill="none" stroke={ink} strokeWidth={5} />
                    <polyline points="11,24 20,33 36,13" fill="none" stroke={ink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Stamp>
                <div style={{flex: 1, fontFamily: FONT.sub, fontWeight: 600, fontSize: 40, letterSpacing: 1, color: ink}}>{label}</div>
                <div style={{fontFamily: FONT.display, fontSize: 48, color: ink}}>{value}</div>
              </div>
            </Rise>
          ))}
        </div>
      </div>
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

// ─── 7. Price and guarantee ──────────────────────────────────────────────────
// VO: "That's over fourteen hundred dollars in value. | Today, | it's just forty-seven dollars. |
//      Founding members pay thirty-seven. | And it's backed by a fourteen-day guarantee."
const PRICE = {kicker: LEAD, value: LEAD + 4, strike: LEAD + 70, today: LEAD + 85, price: LEAD + 110, founding: LEAD + 174, badge: LEAD + 248};

const GuaranteeBadge: React.FC<{ink: string; size: number}> = ({ink, size}) => (
  <svg width={size} height={size} viewBox="0 0 320 320" style={{display: 'block', overflow: 'visible'}}>
    <defs>
      <path id="g-top" d="M 50 160 A 110 110 0 0 1 270 160" fill="none" />
      <path id="g-bot" d="M 56 160 A 104 104 0 0 0 264 160" fill="none" />
    </defs>
    <circle cx={160} cy={160} r={152} fill="none" stroke={ink} strokeWidth={8} />
    <circle cx={160} cy={160} r={136} fill="none" stroke={ink} strokeWidth={2} strokeDasharray="5 7" />
    <text fill={ink} fontSize={30} textAnchor="middle" style={{fontFamily: FONT.display, letterSpacing: 4}}>
      <textPath href="#g-top" startOffset="50%">
        POST-MORE GUARANTEE
      </textPath>
    </text>
    <text fill={ink} fontSize={20} textAnchor="middle" style={{fontFamily: FONT.sub, fontWeight: 600, letterSpacing: 4}}>
      <textPath href="#g-bot" startOffset="50%">
        RISK-FREE · FULL REFUND
      </textPath>
    </text>
    <text x={160} y={178} textAnchor="middle" fill={ink} fontSize={92} style={{fontFamily: FONT.display}}>
      14
    </text>
    <text x={160} y={214} textAnchor="middle" fill={ink} fontSize={28} style={{fontFamily: FONT.sub, fontWeight: 600, letterSpacing: 6}}>
      DAYS
    </text>
  </svg>
);

const PriceScene: React.FC<Pick<VCMESalesVideoProps, 'price' | 'foundingPrice' | 'totalValue'>> = ({price, foundingPrice, totalValue}) => {
  const frame = useCurrentFrame();
  const {ground, ink} = CLAY;
  const strike = interpolate(frame, [PRICE.strike, PRICE.strike + 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: ground}}>
      <Vo clip="11" />
      <Sfx at={PRICE.strike} name="strike" />
      <Sfx at={PRICE.price} name="cash" />
      <Sfx at={PRICE.badge} name="stamp" volume={0.4} />
      <div style={{position: 'absolute', left: 170, top: 170}}>
        <Rise delay={PRICE.kicker}>
          <Kicker color={ink}>TOTAL VALUE</Kicker>
        </Rise>
        <Rise delay={PRICE.value}>
          <div style={{position: 'relative', display: 'inline-block', fontFamily: FONT.display, fontSize: 130, color: ink}}>
            {totalValue}
            <div style={{position: 'absolute', left: -10, top: '52%', height: 12, width: `${strike * 104}%`, background: ink, transform: 'rotate(-6deg)'}} />
          </div>
        </Rise>
        <Rise delay={PRICE.today}>
          <Kicker color={ink} style={{marginTop: 30}}>TODAY</Kicker>
        </Rise>
        <Stamp delay={PRICE.price} from={2.4} rotate={-3} style={{transformOrigin: 'left center'}}>
          <div style={{fontFamily: FONT.display, fontSize: 330, lineHeight: 0.95, color: ink}}>{price}</div>
        </Stamp>
        <Rise delay={PRICE.founding}>
          <div style={{fontFamily: FONT.script, fontSize: 64, color: ink, marginTop: 6}}>
            Founding members: {foundingPrice} for the first 50
          </div>
        </Rise>
      </div>
      <div style={{position: 'absolute', left: 1240, top: 270}}>
        <Stamp delay={PRICE.badge} from={1.8} rotate={8}>
          <GuaranteeBadge ink={ink} size={520} />
        </Stamp>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// ─── 8. Call to action ───────────────────────────────────────────────────────
// VO: "You've already lived the content. | Now let's get it out there. | Join Video Content Made Easy today."
const CTA = {head: LEAD, script: LEAD + 66, button: LEAD + 120, brand: LEAD + 150};

const CtaScene: React.FC<Pick<VCMESalesVideoProps, 'cta' | 'brandLine'>> = ({cta, brandLine}) => {
  const frame = useCurrentFrame();
  const {ground, ink} = CHALK;
  const pulse = 1 + 0.03 * Math.sin(Math.max(0, frame - CTA.button - 20) / 6);
  return (
    <AbsoluteFill style={{background: ground, alignItems: 'center', justifyContent: 'center'}}>
      <Vo clip="12" />
      <Sfx at={0} name="whoosh" />
      <Sfx at={CTA.button} name="chime" />
      <div style={{textAlign: 'center'}}>
        <Rise delay={CTA.head}>
          <div style={{fontFamily: FONT.display, fontSize: 150, lineHeight: 1, color: ink}}>
            YOU'VE ALREADY LIVED
            <br />
            THE CONTENT.
          </div>
        </Rise>
        <Stamp delay={CTA.script} from={1.6} rotate={-3}>
          <div style={{fontFamily: FONT.script, fontSize: 84, color: ink, marginTop: 20}}>Now let's get it out there.</div>
        </Stamp>
        <Stamp delay={CTA.button} from={0.5}>
          <div
            style={{
              display: 'inline-block',
              marginTop: 50,
              background: ink,
              color: ground,
              fontFamily: FONT.display,
              fontSize: 76,
              letterSpacing: 8,
              padding: '18px 70px',
              transform: `scale(${pulse})`,
            }}
          >
            {cta}
          </div>
        </Stamp>
        <Rise delay={CTA.brand}>
          <Kicker color={ink} style={{fontSize: 30, letterSpacing: 10, marginTop: 34}}>
            {brandLine}
          </Kicker>
        </Rise>
      </div>
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

// ─── Composition ──────────────────────────────────────────────────────────────
/** Scene lengths in frames: voiceover length plus air on either side. */
export const VCME_SCENES = [231, 248, 355, 232, METHOD_LEN, 494, 364, 263];
export const VCME_DURATION = VCME_SCENES.reduce((s, x) => s + x, 0);

const Music: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  return (
    <Audio
      src={a('music')}
      volume={(f) =>
        interpolate(f, [0, 20, durationInFrames - 75, durationInFrames - 5], [0, 0.16, 0.16, 0], clamp)
      }
    />
  );
};

export const VCMESalesVideo: React.FC<VCMESalesVideoProps> = ({price, foundingPrice, totalValue, cta, brandLine}) => {
  const [hook, problem, bottleneck, reveal, method, stack, priceLen, ctaLen] = VCME_SCENES;
  return (
    <AbsoluteFill style={{background: CLAY.ground}}>
      <Music />
      <Series>
        <Series.Sequence durationInFrames={hook}>
          <HookScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={problem}>
          <ProblemScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={bottleneck}>
          <BottleneckScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={reveal}>
          <RevealScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={method}>
          <MethodScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={stack}>
          <StackScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={priceLen}>
          <PriceScene price={price} foundingPrice={foundingPrice} totalValue={totalValue} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={ctaLen}>
          <CtaScene cta={cta} brandLine={brandLine} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
