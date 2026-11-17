import React from 'react';
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  Series,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import './brand/jonathan';
import {JR, JR_FONT} from './brand/jonathan';

/**
 * Video Content Made Easy: horizontal animated sales-page video for Jonathan Rosa.
 * 1920x1080, 30 fps, about 104 seconds, with voiceover, music and sound effects.
 *
 * Look: Jonathan's Instagram reel style (two-line black/orange title boxes,
 * monospace "on set" tags, orange viewfinder corners, captions with one key
 * word in an orange serif italic, name lower third).
 *
 * Every scene length and animation cue is timed to the voiceover clips in
 * public/vcme-audio; cue frames and caption times are measured from those clips.
 */
export type VCMESalesVideoProps = {
  price: string;
  totalValue: string;
  cta: string;
  handle: string;
  /** Cinematic cut: AI footage behind every scene. */
  cinematic?: boolean;
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const FPS = 30;

/** Frames of air before each scene's voiceover starts. */
const LEAD = 10;

// ─── Audio ────────────────────────────────────────────────────────────────────
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

// ─── Captions (burned in, reel style) ────────────────────────────────────────
// [start second within the clip, text, word(s) to set in orange serif italic]
type Cap = [number, string, string?];
const CLIP_SEC: Record<string, number> = {
  '00': 6.69, '01': 7.11, '02': 10.66, '03': 6.4, '04': 4.75, '05': 5.59, '06': 5.38,
  '07': 3.89, '08': 4.31, '09': 4.57, '10': 14.11, '11': 9.48, '12': 6.43,
};
const CAPTIONS: Record<string, Cap[]> = {
  '00': [[0, "Most entrepreneurs don't have a content problem.", 'problem.'], [4.03, "They have a story they haven't told yet.", 'story']],
  '01': [[0, "You're great in person.", 'person.'], [1.83, 'But the moment the camera turns on,', 'camera'], [3.87, 'you freeze.', 'freeze.'], [5.2, 'And your last post was three weeks ago.', 'three weeks']],
  '02': [[0, 'That\'s because every video starts from zero.', 'zero.'], [2.65, 'Ideas.'], [3.69, 'Scripts.'], [4.73, 'Filming.'], [5.75, 'Editing.'], [6.78, 'Four bottlenecks between you and the post button.', 'post button.'], [9.68, "Let's remove them.", 'remove']],
  '03': [[0, 'Introducing'], [2.13, 'Video Content Made Easy.', 'Easy.'], [3.6, 'Because your story is your authority.', 'authority.']],
  '04': [[0, "Here's the Content Authority Method,", 'Method,'], [3.71, 'step by step.', 'step by step.']],
  '05': [[0, 'One.'], [0.95, 'Build your Story Bank,', 'Story Bank,'], [2.74, 'and turn your life into thirty video ideas.', 'thirty']],
  '06': [[0, 'Two.'], [0.85, 'Find your voice.', 'voice.'], [2.25, 'AI shapes the structure,'], [4.35, 'never your words.', 'words.']],
  '07': [[0, 'Three.'], [0.88, 'Script in minutes.', 'minutes.'], [2.33, 'Hook, story, lesson.', 'lesson.']],
  '08': [[0, 'Four.'], [0.99, 'Film a whole week of videos in one sitting.', 'one sitting.']],
  '09': [[0, 'Five.'], [1.04, 'Edit with AI,', 'AI,'], [2.76, 'in minutes,'], [3.78, 'not hours.', 'not hours.']],
  '10': [[0, 'You get eight training modules,', 'eight'], [2.78, 'four weeks of live coaching with Jonathan,', 'live coaching'], [5.77, 'the Story Bank workbook,'], [7.75, 'script formulas,'], [9.35, 'the prompt vault,'], [10.77, 'the AI editing system,', 'AI editing'], [12.81, 'and three bonuses.', 'bonuses.']],
  '11': [[0, "That's over fourteen hundred dollars in value.", 'value.'], [3.27, 'Today,'], [4.08, "it's just forty-seven dollars.", 'forty-seven'], [6.73, "And it's backed by a fourteen-day guarantee.", 'guarantee.']],
  '12': [[0, "You've already lived the content.", 'lived'], [2.2, "Now let's get it out there.", 'out there.'], [3.99, 'Join Video Content Made Easy today.', 'today.']],
};

const Captions: React.FC<{clip: string; at?: number}> = ({clip, at = LEAD}) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / FPS;
  const caps = CAPTIONS[clip];
  if (t < 0 || t > CLIP_SEC[clip] + 0.4) return null;
  let i = -1;
  caps.forEach(([s], k) => {
    if (t >= s) i = k;
  });
  if (i < 0) return null;
  const [start, text, hl] = caps[i];
  const pop = interpolate(t - start, [0, 0.12], [0.92, 1], clamp);
  const parts = hl && text.includes(hl) ? [text.slice(0, text.indexOf(hl)), hl, text.slice(text.indexOf(hl) + hl.length)] : [text, '', ''];
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 918, textAlign: 'center', transform: `scale(${pop})`}}>
      <span style={{fontFamily: JR_FONT.title, fontWeight: 600, fontSize: 44, color: JR.white, textShadow: '0 3px 12px rgba(0,0,0,0.85)'}}>
        {parts[0]}
        {parts[1] ? (
          <span style={{fontFamily: JR_FONT.serif, fontStyle: 'italic', fontWeight: 400, fontSize: 58, color: JR.orange, letterSpacing: 0.5}}>{parts[1]}</span>
        ) : null}
        {parts[2]}
      </span>
    </div>
  );
};

// ─── Motion helpers ───────────────────────────────────────────────────────────
const useIn = (delay: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({fps, frame: frame - delay, config: {damping: 200}});
};

/** Reel-style pop: a quick scale-in with a little overshoot. */
const Pop: React.FC<{delay: number; from?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({delay, from = 0.82, style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({fps, frame: frame - delay, config: {damping: 14, stiffness: 220, mass: 0.6}});
  const opacity = interpolate(frame - delay, [0, 2], [0, 1], clamp);
  return <div style={{transform: `scale(${interpolate(s, [0, 1], [from, 1])})`, opacity, ...style}}>{children}</div>;
};

const Rise: React.FC<{delay: number; dist?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({delay, dist = 24, style, children}) => {
  const p = useIn(delay);
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * dist}px)`, ...style}}>{children}</div>;
};

// ─── Brand pieces ─────────────────────────────────────────────────────────────
/** Dark filmic set: soft centre light, vignette, fine grain. */
const Backdrop: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 42%, ${JR.bgCenter} 0%, ${JR.black} 55%, ${JR.bgEdge} 100%)`}}>
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, mixBlendMode: 'overlay', opacity: 0.18}}>
      <filter id="jr-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#jr-grain)" />
    </svg>
  </AbsoluteFill>
);

/** Orange viewfinder corners plus the "on set" labels from Jonathan's reels. */
const Frame: React.FC<{left?: string; right?: string}> = ({left = 'VIDEO CONTENT MADE EASY · EP 01', right = 'WITH JONATHAN ROSA'}) => {
  const L = 54;
  const arm = 46;
  const corner = (x: number, y: number, dx: number, dy: number) => (
    <path d={`M${x} ${y + dy * arm}V${y}H${x + dx * arm}`} fill="none" stroke={JR.orange} strokeWidth={5} />
  );
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {corner(L, L, 1, 1)}
        {corner(1920 - L, L, -1, 1)}
        {corner(L, 1080 - L, 1, -1)}
        {corner(1920 - L, 1080 - L, -1, -1)}
      </svg>
      <div style={{position: 'absolute', left: L + 30, top: L + 18}}>
        <Tag size={20}>{left}</Tag>
      </div>
      <div style={{position: 'absolute', right: L + 30, top: L + 18}}>
        <Tag size={20}>{right}</Tag>
      </div>
    </AbsoluteFill>
  );
};

/** Small monospace label in a dark box. */
const Tag: React.FC<{children: React.ReactNode; size?: number; strike?: number; accent?: boolean}> = ({children, size = 34, strike = 0, accent}) => (
  <div style={{position: 'relative', display: 'inline-block', background: accent ? JR.orange : JR.box, color: JR.white, fontFamily: JR_FONT.mono, fontWeight: 500, fontSize: size, letterSpacing: size * 0.18, padding: `${size * 0.32}px ${size * 0.6}px`, lineHeight: 1}}>
    {children}
    {strike > 0 ? (
      <div style={{position: 'absolute', left: size * 0.35, top: '50%', height: Math.max(3, size * 0.12), width: `calc((100% - ${size * 0.7}px) * ${strike})`, background: JR.orange, transform: 'translateY(-50%)'}} />
    ) : null}
  </div>
);

/** The signature two-line title: black box, then orange box. */
const TitleBlock: React.FC<{line1?: string; line2?: string; size?: number; delay: number; align?: 'center' | 'left'}> = ({line1, line2, size = 110, delay, align = 'center'}) => {
  const box = (text: string, bg: string, d: number) => (
    <Pop delay={d} style={{display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start'}}>
      <div style={{background: bg, color: JR.white, fontFamily: JR_FONT.title, fontWeight: 800, fontSize: size, lineHeight: 1.08, padding: `${size * 0.1}px ${size * 0.24}px ${size * 0.14}px`, letterSpacing: -size * 0.01}}>{text}</div>
    </Pop>
  );
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap: 0}}>
      {line1 ? box(line1, JR.box, delay) : null}
      {line2 ? box(line2, JR.orange, delay + (line1 ? 5 : 0)) : null}
    </div>
  );
};

/** Name lower third with orange side bar. */
const LowerThird: React.FC<{delay: number; name?: string; role?: string}> = ({delay, name = 'JONATHAN ROSA', role = 'CONTENT COACH · YOUR HOST'}) => {
  const p = useIn(delay);
  return (
    <div style={{display: 'flex', opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
      <div style={{width: 10, background: JR.orange}} />
      <div style={{background: JR.box, padding: '16px 28px 18px'}}>
        <div style={{fontFamily: JR_FONT.title, fontWeight: 800, fontSize: 40, color: JR.white, letterSpacing: 1}}>{name}</div>
        <div style={{fontFamily: JR_FONT.mono, fontWeight: 500, fontSize: 20, color: JR.mute, letterSpacing: 4, marginTop: 6}}>{role}</div>
      </div>
    </div>
  );
};

// ─── Cinematic footage (VCMECinematic) ───────────────────────────────────────
/** True when rendering the cinematic version, which puts AI footage behind every scene. */
const CineCtx = React.createContext(false);

/** One footage shot inside a scene: clip number, start frame in the scene, length in frames. */
type Shot = {n: number; at: number; len: number};

/** Real length in seconds of each Higgsfield clip in public/vcme-cine. */
const CINE_SEC: Record<number, number> = {0: 8, 1: 9, 2: 6, 3: 6, 4: 8, 5: 6, 6: 7, 7: 6, 8: 5, 9: 5, 10: 6, 11: 8, 12: 8, 13: 11, 14: 9};

const ShotLayer: React.FC<{n: number; len: number}> = ({n, len}) => {
  const frame = useCurrentFrame();
  // Slow push-in for a cinematic feel; slow the clip down if it is shorter than its slot.
  const scale = interpolate(frame, [0, len], [1.02, 1.08], clamp);
  const rate = Math.min(1, (CINE_SEC[n] * FPS) / len);
  const fade = interpolate(frame, [0, 8], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: fade}}>
      <OffthreadVideo
        src={staticFile(`vcme-cine/shot-${String(n).padStart(2, '0')}.mp4`)}
        muted
        playbackRate={rate}
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`}}
      />
    </AbsoluteFill>
  );
};

const Footage: React.FC<{shots: Shot[]}> = ({shots}) => (
  <AbsoluteFill style={{background: JR.black}}>
    {shots.map((sh) => (
      <Sequence key={`${sh.n}-${sh.at}`} from={sh.at} durationInFrames={sh.len}>
        <ShotLayer n={sh.n} len={sh.len} />
      </Sequence>
    ))}
    {/* darken for legible titles and captions, heavier at the bottom where captions sit */}
    <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 30%, rgba(0,0,0,0.32) 62%, rgba(0,0,0,0.82) 100%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)'}} />
  </AbsoluteFill>
);

const Scene: React.FC<{children: React.ReactNode; left?: string; right?: string; shots?: Shot[]}> = ({children, left, right, shots}) => {
  const cine = React.useContext(CineCtx);
  return (
    <AbsoluteFill>
      {cine && shots ? <Footage shots={shots} /> : <Backdrop />}
      {children}
      <Frame left={left} right={right} />
    </AbsoluteFill>
  );
};

// ─── 1. Hook ──────────────────────────────────────────────────────────────────
const HOOK = {kicker: LEAD, title: LEAD + 14, swap: LEAD + 121};

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const swapped = frame >= HOOK.swap;
  return (
    <Scene shots={[{n: 0, at: 0, len: 231}]}>
      <Vo clip="00" />
      <Captions clip="00" />
      <Sfx at={HOOK.title} name="stamp" volume={0.25} />
      <Sfx at={HOOK.title + 5} name="stamp" volume={0.25} />
      <Sfx at={HOOK.swap - 3} name="whoosh" />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 90}}>
        {!swapped ? (
          <div style={{textAlign: 'center'}}>
            <Rise delay={HOOK.kicker} style={{marginBottom: 26}}>
              <Tag>MOST ENTREPRENEURS</Tag>
            </Rise>
            <TitleBlock delay={HOOK.title} line1="Don't Have A" line2="Content Problem." size={124} />
          </div>
        ) : (
          <div key="b" style={{textAlign: 'center'}}>
            <TitleBlock delay={HOOK.swap} line1="They Have A Story" line2="They Haven't Told Yet." size={112} />
          </div>
        )}
      </AbsoluteFill>
    </Scene>
  );
};

// ─── 2. Problem ───────────────────────────────────────────────────────────────
const PROB = {great: LEAD, camera: LEAD + 55, freeze: LEAD + 116, last: LEAD + 156};

const Phone: React.FC = () => {
  const frame = useCurrentFrame();
  const ideas = ['Story about my first client', 'Why most people quit', '3 mistakes I made', 'Behind the scenes', 'My morning routine'];
  const cursorOn = Math.floor(frame / 15) % 2 === 0;
  return (
    <div style={{width: 400, height: 720, border: `8px solid #3A3C41`, borderRadius: 56, padding: '58px 34px', position: 'relative', background: '#16171A', boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}}>
      <div style={{position: 'absolute', top: 20, left: '50%', width: 110, height: 12, marginLeft: -55, borderRadius: 6, background: '#3A3C41'}} />
      <div style={{fontFamily: JR_FONT.title, fontWeight: 800, fontSize: 40, color: JR.white}}>Video Ideas</div>
      <div style={{height: 4, width: 70, background: JR.orange, margin: '12px 0 18px'}} />
      {ideas.map((t, i) => (
        <Rise key={t} delay={10 + i * 8} dist={12}>
          <div style={{fontFamily: JR_FONT.title, fontWeight: 600, fontSize: 24, color: JR.white, padding: '13px 0', borderBottom: '1px solid #2E3035', display: 'flex', gap: 14}}>
            <span style={{width: 22, height: 22, border: `3px solid ${JR.mute}`, borderRadius: 5, flexShrink: 0, marginTop: 2}} />
            {t}
          </div>
        </Rise>
      ))}
      <div style={{fontFamily: JR_FONT.mono, fontSize: 20, color: JR.orange, marginTop: 24, letterSpacing: 2}}>FILMED: 0 {cursorOn ? '▌' : ''}</div>
    </div>
  );
};

const ProblemScene: React.FC = () => {
  const cine = React.useContext(CineCtx);
  return (
  <Scene shots={[{n: 1, at: 0, len: 248}]}>
    <Vo clip="01" />
    <Captions clip="01" />
    <Sfx at={0} name="whoosh" />
    <Sfx at={PROB.freeze} name="stamp" />
    <Sfx at={PROB.last} name="stamp" />
    {cine ? null : (
      <div style={{position: 'absolute', left: 230, top: 150}}>
        <Pop delay={0} from={0.9}>
          <div style={{transform: 'rotate(-3deg)'}}>
            <Phone />
          </div>
        </Pop>
      </div>
    )}
    <div style={{position: 'absolute', left: 760, top: 230}}>
      <Rise delay={PROB.great}>
        <div style={{fontFamily: JR_FONT.title, fontWeight: 800, fontSize: 96, color: JR.white, lineHeight: 1.05, textShadow: '0 4px 22px rgba(0,0,0,0.85)'}}>Great In Person.</div>
      </Rise>
      <Rise delay={PROB.camera}>
        <div style={{fontFamily: JR_FONT.title, fontWeight: 800, fontSize: 60, color: JR.mute, lineHeight: 1.1, marginTop: 14, textShadow: '0 4px 22px rgba(0,0,0,0.85)'}}>Then The Camera Turns On…</div>
      </Rise>
      <div style={{marginTop: 26}}>
        <TitleBlock delay={PROB.freeze} line2="You Freeze." size={104} align="left" />
      </div>
      <Pop delay={PROB.last} style={{marginTop: 34}}>
        <Tag>LAST POST: 3 WEEKS AGO</Tag>
      </Pop>
    </div>
  </Scene>
);
};

// ─── 3. The four bottlenecks ─────────────────────────────────────────────────
const BOTT = {head: LEAD, labels: [LEAD + 79, LEAD + 111, LEAD + 142, LEAD + 173], footer: LEAD + 203, remove: LEAD + 290, strike: LEAD + 292};

const BottleneckScene: React.FC = () => {
  const frame = useCurrentFrame();
  const items = ['IDEAS', 'SCRIPTS', 'FILMING', 'EDITING'];
  return (
    <Scene shots={[{n: 2, at: 0, len: 178}, {n: 3, at: 178, len: 177}]}>
      <Vo clip="02" />
      <Captions clip="02" />
      {BOTT.labels.map((at) => (
        <Sfx key={at} at={at} name="stamp" volume={0.26} />
      ))}
      {items.map((t, i) => (
        <Sfx key={t} at={BOTT.strike + i * 8} name="strike" volume={0.3} />
      ))}
      <div style={{position: 'absolute', top: 150, width: '100%'}}>
        <TitleBlock delay={BOTT.head} line1="Every Video" line2="Starts From Zero." size={96} />
      </div>
      <div style={{position: 'absolute', top: 470, width: '100%', display: 'flex', justifyContent: 'center', gap: 28}}>
        {items.map((t, i) => (
          <Pop key={t} delay={BOTT.labels[i]} from={0.7}>
            <Tag size={46} strike={interpolate(frame - (BOTT.strike + i * 8), [0, 9], [0, 1], clamp)}>
              {t}
            </Tag>
          </Pop>
        ))}
      </div>
      <div style={{position: 'absolute', top: 620, width: '100%', textAlign: 'center'}}>
        <Rise delay={BOTT.footer}>
          <Tag size={24}>4 BOTTLENECKS BETWEEN YOU AND THE POST BUTTON</Tag>
        </Rise>
      </div>
      <div style={{position: 'absolute', top: 720, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <Pop delay={BOTT.remove} from={0.6}>
          <Tag size={52} accent>
            = LET'S REMOVE THEM
          </Tag>
        </Pop>
      </div>
    </Scene>
  );
};

// ─── 4. Product reveal ───────────────────────────────────────────────────────
const REV = {intro: LEAD, title: LEAD + 62, script: LEAD + 106, lower: LEAD + 160};

const RevealScene: React.FC = () => (
  <Scene shots={[{n: 4, at: 0, len: 232}]}>
    <Vo clip="03" />
    <Captions clip="03" />
    <Sfx at={REV.title} name="impact" />
    <div style={{position: 'absolute', top: 140, width: '100%', textAlign: 'center'}}>
      <Rise delay={REV.intro}>
        <Tag>INTRODUCING</Tag>
      </Rise>
      <div style={{marginTop: 30}}>
        <TitleBlock delay={REV.title} line1="Video Content" line2="Made Easy" size={128} />
      </div>
      <Rise delay={REV.script}>
        <div style={{fontFamily: JR_FONT.serif, fontStyle: 'italic', fontSize: 76, color: JR.orange, marginTop: 18, textShadow: '0 4px 22px rgba(0,0,0,0.85)'}}>Your story is your authority.</div>
      </Rise>
    </div>
    <div style={{position: 'absolute', left: 110, top: 760}}>
      <LowerThird delay={REV.lower} />
    </div>
  </Scene>
);

// ─── 5. The method, step by step ─────────────────────────────────────────────
const STEPS = [
  {title: 'Story Bank', sub: '30 Video Ideas', vo: '05', len: 188},
  {title: 'Your Voice', sub: 'AI Structure, Your Words', vo: '06', len: 181},
  {title: 'Scripts In Minutes', sub: 'Hook · Story · Lesson', vo: '07', len: 137},
  {title: 'Film A Week', sub: 'In One Sitting', vo: '08', len: 149},
  {title: 'Edit With AI', sub: 'Minutes, Not Hours', vo: '09', len: 163},
];
const STEP_START = 163;
const STEP_AT = STEPS.map((_, i) => STEP_START + STEPS.slice(0, i).reduce((s, x) => s + x.len, 0));
const METHOD_LEN = STEP_START + STEPS.reduce((s, x) => s + x.len, 0);

const MethodScene: React.FC = () => {
  const frame = useCurrentFrame();
  let idx = 0;
  STEP_AT.forEach((at, i) => {
    if (frame >= at) idx = i;
  });
  const trackX = 360;
  const trackW = 1200;
  const gap = trackW / (STEPS.length - 1);
  const fill = interpolate(frame, STEP_AT, STEPS.map((_, i) => i / (STEPS.length - 1)), clamp);
  const step = STEPS[idx];
  return (
    <Scene left="THE CONTENT AUTHORITY METHOD" shots={[{n: 5, at: 0, len: STEP_START}, ...STEPS.map((st, i) => ({n: 6 + i, at: STEP_AT[i], len: st.len}))]}>
      <Vo clip="04" />
      <Captions clip="04" />
      {STEPS.map((s, i) => (
        <React.Fragment key={s.vo}>
          <Vo clip={s.vo} at={STEP_AT[i] + 6} />
          <Captions clip={s.vo} at={STEP_AT[i] + 6} />
          <Sfx at={STEP_AT[i]} name="whoosh" />
          <Sfx at={STEP_AT[i] + 2} name="stamp" volume={0.22} />
        </React.Fragment>
      ))}
      {/* progress track */}
      <svg width={1920} height={140} style={{position: 'absolute', top: 150, left: 0}}>
        <line x1={trackX} y1={70} x2={trackX + trackW} y2={70} stroke="#3A3C41" strokeWidth={6} />
        <line x1={trackX} y1={70} x2={trackX + trackW * fill} y2={70} stroke={JR.orange} strokeWidth={6} />
        {STEPS.map((s, i) => {
          const on = frame >= STEP_AT[i];
          const cx = trackX + i * gap;
          return (
            <g key={s.title}>
              <rect x={cx - 34} y={36} width={68} height={68} fill={on ? JR.orange : JR.box} stroke={on ? JR.orange : '#3A3C41'} strokeWidth={4} />
              <text x={cx} y={84} textAnchor="middle" fontSize={32} fill={JR.white} style={{fontFamily: JR_FONT.mono, fontWeight: 500}}>
                0{i + 1}
              </text>
            </g>
          );
        })}
      </svg>
      {frame < STEP_START ? (
        <div style={{position: 'absolute', top: 400, width: '100%'}}>
          <TitleBlock delay={LEAD + 4} line1="5 Steps" line2="Story → Weekly Habit" size={110} />
        </div>
      ) : (
        <div key={idx} style={{position: 'absolute', top: 360, width: '100%', textAlign: 'center'}}>
          <Rise delay={STEP_AT[idx]}>
            <Tag>STEP 0{idx + 1}</Tag>
          </Rise>
          <div style={{marginTop: 26}}>
            <TitleBlock delay={STEP_AT[idx] + 2} line1={step.title} line2={step.sub} size={116} />
          </div>
        </div>
      )}
    </Scene>
  );
};

// ─── 6. Offer stack ──────────────────────────────────────────────────────────
const STACK: [string, string, number][] = [
  ['8 Training Modules', '$297', LEAD + 9],
  ['4 Weeks Of Live Coaching', '$297', LEAD + 83],
  ['Story Bank + Voice Blueprint', '$97', LEAD + 173],
  ['Script Formulas', '$97', LEAD + 233],
  ['Video Prompt Vault', '$67', LEAD + 281],
  ['AI Editing System', '$247', LEAD + 323],
  ['3 Bonuses + Community', '$211', LEAD + 384],
  ['Fast-Action Video Review', '$97', LEAD + 414],
];

const StackScene: React.FC = () => (
  <Scene shots={[{n: 11, at: 0, len: 231}, {n: 12, at: 231, len: 232}]}>
    <Vo clip="10" />
    <Captions clip="10" />
    {STACK.map(([label, , at]) => (
      <Sfx key={label} at={at + 6} name="tick" />
    ))}
    <div style={{position: 'absolute', top: 120, width: '100%'}}>
      <TitleBlock delay={0} line1="Everything" line2="You Get" size={84} />
    </div>
    <div style={{position: 'absolute', left: 170, top: 400, width: 1580, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 60, rowGap: 14}}>
      {STACK.map(([label, value, at]) => (
        <Rise key={label} delay={at} dist={14}>
          <div style={{display: 'flex', alignItems: 'center', background: 'rgba(11,11,13,0.72)', padding: '14px 22px'}}>
            <Pop delay={at + 6} from={0.4}>
              <div style={{width: 34, height: 34, background: JR.orange, marginRight: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width={22} height={22} viewBox="0 0 22 22">
                  <polyline points="4,11 9,16 18,6" fill="none" stroke={JR.white} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Pop>
            <div style={{flex: 1, fontFamily: JR_FONT.title, fontWeight: 600, fontSize: 32, color: JR.white}}>{label}</div>
            <div style={{fontFamily: JR_FONT.mono, fontWeight: 500, fontSize: 30, color: JR.mute}}>{value}</div>
          </div>
        </Rise>
      ))}
    </div>
  </Scene>
);

// ─── 7. Price and guarantee ──────────────────────────────────────────────────
const PRICE = {kicker: LEAD, value: LEAD + 4, strike: LEAD + 70, today: LEAD + 98, price: LEAD + 122, badge: LEAD + 202};

const GuaranteeBadge: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 320 320" style={{display: 'block', overflow: 'visible'}}>
    <defs>
      <path id="jr-g-top" d="M 50 160 A 110 110 0 0 1 270 160" fill="none" />
      <path id="jr-g-bot" d="M 56 160 A 104 104 0 0 0 264 160" fill="none" />
    </defs>
    <circle cx={160} cy={160} r={152} fill={JR.box} stroke={JR.orange} strokeWidth={8} />
    <circle cx={160} cy={160} r={134} fill="none" stroke="#3A3C41" strokeWidth={2} strokeDasharray="5 7" />
    <text fill={JR.white} fontSize={19} textAnchor="middle" style={{fontFamily: JR_FONT.title, fontWeight: 800, letterSpacing: 2}}>
      <textPath href="#jr-g-top" startOffset="50%">
        POST-MORE GUARANTEE
      </textPath>
    </text>
    <text fill={JR.mute} fontSize={17} textAnchor="middle" style={{fontFamily: JR_FONT.mono, letterSpacing: 3}}>
      <textPath href="#jr-g-bot" startOffset="50%">
        RISK-FREE · FULL REFUND
      </textPath>
    </text>
    <text x={160} y={180} textAnchor="middle" fill={JR.orange} fontSize={96} style={{fontFamily: JR_FONT.title, fontWeight: 800}}>
      14
    </text>
    <text x={160} y={216} textAnchor="middle" fill={JR.white} fontSize={24} style={{fontFamily: JR_FONT.mono, letterSpacing: 6}}>
      DAYS
    </text>
  </svg>
);

const PriceScene: React.FC<Pick<VCMESalesVideoProps, 'price' | 'totalValue'>> = ({price, totalValue}) => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [PRICE.strike, PRICE.strike + 12], [0, 1], clamp);
  return (
    <Scene shots={[{n: 13, at: 0, len: 324}]}>
      <Vo clip="11" />
      <Captions clip="11" />
      <Sfx at={PRICE.strike} name="strike" />
      <Sfx at={PRICE.price} name="cash" />
      <Sfx at={PRICE.badge} name="stamp" volume={0.4} />
      <div style={{position: 'absolute', left: 200, top: 170}}>
        <Rise delay={PRICE.kicker}>
          <Tag>TOTAL VALUE</Tag>
        </Rise>
        <Rise delay={PRICE.value}>
          <div style={{position: 'relative', display: 'inline-block', fontFamily: JR_FONT.title, fontWeight: 800, fontSize: 120, color: JR.mute, marginTop: 10}}>
            {totalValue}
            <div style={{position: 'absolute', left: -8, top: '54%', height: 12, width: `${strike * 104}%`, background: JR.orange}} />
          </div>
        </Rise>
        <Rise delay={PRICE.today} style={{marginTop: 22}}>
          <Tag>TODAY</Tag>
        </Rise>
        <Pop delay={PRICE.price} from={0.6} style={{transformOrigin: 'left center', marginTop: 16}}>
          <div style={{display: 'inline-block', background: JR.orange, color: JR.white, fontFamily: JR_FONT.title, fontWeight: 800, fontSize: 200, lineHeight: 1, padding: '14px 44px 22px'}}>= {price}</div>
        </Pop>
      </div>
      <div style={{position: 'absolute', left: 1270, top: 250}}>
        <Pop delay={PRICE.badge} from={0.6}>
          <div style={{transform: 'rotate(8deg)'}}>
            <GuaranteeBadge size={480} />
          </div>
        </Pop>
      </div>
    </Scene>
  );
};

// ─── 8. Call to action ───────────────────────────────────────────────────────
const CTA = {head: LEAD, script: LEAD + 66, button: LEAD + 120, handle: LEAD + 150};

const CtaScene: React.FC<Pick<VCMESalesVideoProps, 'cta' | 'handle'>> = ({cta, handle}) => {
  const frame = useCurrentFrame();
  const pulse = 1 + 0.025 * Math.sin(Math.max(0, frame - CTA.button - 20) / 6);
  return (
    <Scene shots={[{n: 14, at: 0, len: 263}]}>
      <Vo clip="12" />
      <Captions clip="12" />
      <Sfx at={0} name="whoosh" />
      <Sfx at={CTA.button} name="chime" />
      <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center'}}>
        <TitleBlock delay={CTA.head} line1="You've Already Lived" line2="The Content." size={112} />
        <Rise delay={CTA.script}>
          <div style={{fontFamily: JR_FONT.serif, fontStyle: 'italic', fontSize: 80, color: JR.orange, marginTop: 22, textShadow: '0 4px 22px rgba(0,0,0,0.85)'}}>Now let's get it out there.</div>
        </Rise>
        <Pop delay={CTA.button} from={0.5} style={{marginTop: 34}}>
          <div style={{display: 'inline-block', background: JR.white, color: JR.black, fontFamily: JR_FONT.title, fontWeight: 800, fontSize: 64, padding: '18px 64px', transform: `scale(${pulse})`, boxShadow: `10px 10px 0 ${JR.orange}`}}>{cta}</div>
        </Pop>
        <Rise delay={CTA.handle} style={{marginTop: 40}}>
          <Tag size={24}>{handle}</Tag>
        </Rise>
      </div>
    </Scene>
  );
};

// ─── Composition ──────────────────────────────────────────────────────────────
/** Scene lengths in frames: voiceover length plus air on either side. */
export const VCME_SCENES = [231, 248, 355, 232, METHOD_LEN, 463, 324, 263];
export const VCME_DURATION = VCME_SCENES.reduce((s, x) => s + x, 0);

const Music: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  return <Audio src={a('music')} volume={(f) => interpolate(f, [0, 20, durationInFrames - 75, durationInFrames - 5], [0, 0.16, 0.16, 0], clamp)} />;
};

export const VCMESalesVideo: React.FC<VCMESalesVideoProps> = ({price, totalValue, cta, handle, cinematic = false}) => {
  const [hook, problem, bottleneck, reveal, method, stack, priceLen, ctaLen] = VCME_SCENES;
  return (
    <CineCtx.Provider value={cinematic}>
    <AbsoluteFill style={{background: JR.black}}>
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
          <PriceScene price={price} totalValue={totalValue} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={ctaLen}>
          <CtaScene cta={cta} handle={handle} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
    </CineCtx.Provider>
  );
};
