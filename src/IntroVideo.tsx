import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';

const BRAND_PURPLE = '#7C3AED';
const BRAND_PINK = '#EC4899';
const BRAND_ORANGE = '#F97316';

function BackgroundGradient() {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const hue = interpolate(frame, [0, durationInFrames], [240, 320], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 70%, 10%) 0%, hsl(${hue + 40}, 60%, 15%) 100%)`,
      }}
    />
  );
}

function FloatingOrb({
  x,
  y,
  size,
  color,
  delay,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scale = spring({
    fps,
    frame: frame - delay,
    config: {damping: 12, stiffness: 80, mass: 1},
  });

  const float = interpolate(
    frame,
    [0, 60, 120, 180, 240],
    [0, -20, 0, 20, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + float,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        opacity: 0.15,
        transform: `scale(${scale})`,
        filter: 'blur(60px)',
      }}
    />
  );
}

function Title() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleSpring = spring({
    fps,
    frame,
    config: {damping: 14, stiffness: 100},
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const y = interpolate(titleSpring, [0, 1], [80, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '35%',
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          fontSize: 120,
          fontWeight: 900,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: `linear-gradient(90deg, ${BRAND_PURPLE}, ${BRAND_PINK}, ${BRAND_ORANGE})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-4px',
          lineHeight: 1,
        }}
      >
        Hello, World.
      </div>
    </div>
  );
}

function Subtitle() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const subtitleSpring = spring({
    fps,
    frame,
    config: {damping: 14, stiffness: 80},
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const y = interpolate(subtitleSpring, [0, 1], [40, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '58%',
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          fontSize: 36,
          fontWeight: 400,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: '8px',
          textTransform: 'uppercase',
        }}
      >
        Built with Remotion
      </div>
    </div>
  );
}

function BottomBar() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scaleX = spring({
    fps,
    frame,
    config: {damping: 20, stiffness: 60},
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 120,
        left: '50%',
        width: 200,
        height: 4,
        borderRadius: 2,
        background: `linear-gradient(90deg, ${BRAND_PURPLE}, ${BRAND_PINK})`,
        transform: `translateX(-50%) scaleX(${scaleX})`,
        transformOrigin: 'center',
      }}
    />
  );
}

function OutroText() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scale = spring({
    fps,
    frame,
    config: {damping: 18, stiffness: 120},
  });

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: 'white',
          transform: `scale(${scale})`,
          textAlign: 'center',
          letterSpacing: '-2px',
        }}
      >
        Let&apos;s build something great.
      </div>
    </AbsoluteFill>
  );
}

export const IntroVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#0a0a0f'}}>
      <BackgroundGradient />

      {/* Decorative orbs */}
      <FloatingOrb x={-100} y={-100} size={600} color={BRAND_PURPLE} delay={0} />
      <FloatingOrb x={1400} y={600} size={500} color={BRAND_PINK} delay={10} />
      <FloatingOrb x={700} y={400} size={400} color={BRAND_ORANGE} delay={20} />

      {/* Main intro scene */}
      <Sequence from={0} durationInFrames={150}>
        <Title />
        <Subtitle />
        <BottomBar />
      </Sequence>

      {/* Outro scene */}
      <Sequence from={150}>
        <OutroText />
      </Sequence>
    </AbsoluteFill>
  );
};
