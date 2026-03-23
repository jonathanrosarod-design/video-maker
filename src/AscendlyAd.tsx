import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';

// Brand colors
const BRAND = '#FF6B2C';
const BRAND_DARK = '#E55A1B';
const NAVY = '#0A1628';
const NAVY_LIGHT = '#1A2A44';
const GREEN = '#10B981';
const BLUE = '#3B82F6';
const WHITE = '#FFFFFF';

// ─── Shared spring helper ─────────────────────────────────────────────────────
function useSpring(frame: number, fps: number, damping = 14, stiffness = 100) {
  return spring({ fps, frame, config: { damping, stiffness } });
}

// ─── Scene 1: The Problem ─────────────────────────────────────────────────────
function ToolBadge({
  label,
  price,
  delay,
  x,
  y,
  color,
}: {
  label: string;
  price: string;
  delay: number;
  x: number;
  y: number;
  color: string;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSpring(Math.max(0, frame - delay), fps, 12, 80);
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(s, [0, 1], [0.5, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        transform: `scale(${scale})`,
        background: 'rgba(255,255,255,0.06)',
        border: `1px solid ${color}33`,
        borderRadius: 16,
        padding: '16px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        backdropFilter: 'blur(8px)',
        minWidth: 180,
      }}
    >
      <span style={{ fontSize: 18, fontWeight: 700, color: WHITE, fontFamily: 'sans-serif' }}>
        {label}
      </span>
      <span style={{ fontSize: 15, color, fontWeight: 600, fontFamily: 'sans-serif' }}>
        {price}/mo
      </span>
    </div>
  );
}

function SceneProblem() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = useSpring(frame, fps, 14, 90);
  const titleY = interpolate(titleSpring, [0, 1], [60, 0]);
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const chaosOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const tools = [
    { label: 'Website Builder', price: '$29', color: BLUE, x: 80, y: 220, delay: 20 },
    { label: 'CRM Software', price: '$49', color: '#8B5CF6', x: 320, y: 160, delay: 30 },
    { label: 'Email Marketing', price: '$39', color: GREEN, x: 580, y: 240, delay: 40 },
    { label: 'AI Chatbot', price: '$49', color: '#F59E0B', x: 820, y: 180, delay: 50 },
    { label: 'Review Platform', price: '$29', color: '#EC4899', x: 1060, y: 250, delay: 60 },
    { label: 'SMS Marketing', price: '$25', color: BRAND, x: 1300, y: 160, delay: 70 },
    { label: 'Scheduling Tool', price: '$15', color: '#06B6D4', x: 200, y: 440, delay: 80 },
    { label: 'Social Planner', price: '$29', color: '#A78BFA', x: 700, y: 420, delay: 90 },
  ];

  const totalOpacity = interpolate(frame, [100, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      {/* Subtle grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,107,44,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,44,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: `${BRAND}22`,
            color: BRAND,
            fontSize: 18,
            fontWeight: 700,
            padding: '8px 20px',
            borderRadius: 100,
            fontFamily: 'sans-serif',
            marginBottom: 20,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          The Problem
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: WHITE,
            fontFamily: 'sans-serif',
            lineHeight: 1.1,
          }}
        >
          Too many tools.
          <br />
          <span style={{ color: BRAND }}>Not enough results.</span>
        </div>
      </div>

      {/* Tool badges */}
      <div style={{ opacity: chaosOpacity }}>
        {tools.map((t) => (
          <ToolBadge key={t.label} {...t} />
        ))}
      </div>

      {/* Total cost */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: totalOpacity,
        }}
      >
        <span
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'sans-serif',
            fontWeight: 600,
          }}
        >
          You&apos;re paying{' '}
        </span>
        <span
          style={{
            fontSize: 48,
            color: '#EF4444',
            fontFamily: 'sans-serif',
            fontWeight: 900,
          }}
        >
          $264+/month
        </span>
        <span
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'sans-serif',
            fontWeight: 600,
          }}
        >
          {' '}for 8 disconnected tools.
        </span>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 2: The Solution ────────────────────────────────────────────────────
function DashCard({
  label,
  value,
  change,
  color,
  delay,
}: {
  label: string;
  value: string;
  change: string;
  color: string;
  delay: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSpring(Math.max(0, frame - delay), fps, 16, 100);
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(s, [0, 1], [30, 0]);

  return (
    <div
      style={{
        flex: 1,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '24px 28px',
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.4)',
          fontFamily: 'sans-serif',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 900,
          color,
          fontFamily: 'sans-serif',
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 14, color: GREEN, fontWeight: 600, fontFamily: 'sans-serif' }}>
        {change}
      </div>
    </div>
  );
}

function SceneSolution() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = useSpring(frame, fps, 14, 100);
  const logoScale = interpolate(logoSpring, [0, 1], [0.6, 1]);
  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const headlineSpring = useSpring(Math.max(0, frame - 15), fps, 14, 90);
  const headlineY = interpolate(headlineSpring, [0, 1], [40, 0]);
  const headlineOpacity = interpolate(frame - 15, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const dashOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const notifSpring = useSpring(Math.max(0, frame - 90), fps, 14, 120);
  const notifX = interpolate(notifSpring, [0, 1], [-60, 0]);
  const notifOpacity = interpolate(frame - 90, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 0%, ${BRAND}14 0%, transparent 60%)`,
        }}
      />

      {/* Logo + headline */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: BRAND,
            fontFamily: 'sans-serif',
            letterSpacing: -1,
          }}
        >
          Ascendly
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 130,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 900,
            color: WHITE,
            fontFamily: 'sans-serif',
            lineHeight: 1.1,
          }}
        >
          One platform.{' '}
          <span style={{ color: BRAND }}>Every tool.</span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'sans-serif',
            fontWeight: 500,
            marginTop: 12,
          }}
        >
          CRM · AI · Automations · Website · Marketing
        </div>
      </div>

      {/* Dashboard mockup */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 80,
          right: 80,
          opacity: dashOpacity,
        }}
      >
        {/* Topbar */}
        <div
          style={{
            background: 'rgba(13,24,38,0.95)',
            borderRadius: '20px 20px 0 0',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
              <div
                key={c}
                style={{ width: 14, height: 14, borderRadius: '50%', background: c }}
              />
            ))}
          </div>
          <div
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'sans-serif',
              fontWeight: 600,
            }}
          >
            Ascendly Dashboard
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            background: 'rgba(13,24,38,0.9)',
            padding: '28px 28px 0',
            display: 'flex',
            gap: 20,
          }}
        >
          <DashCard label="New Leads Today" value="14" change="↑ 32% vs last week" color={GREEN} delay={50} />
          <DashCard label="Deals Closed" value="8" change="↑ 18% vs last week" color={BRAND} delay={60} />
          <DashCard label="Google Reviews" value="4.9★" change="+6 new this week" color="#F59E0B" delay={70} />
          <DashCard label="Revenue Pipeline" value="$12K" change="↑ 24% this month" color={BLUE} delay={80} />
        </div>

        {/* Notification */}
        <div
          style={{
            background: 'rgba(13,24,38,0.9)',
            padding: '20px 28px 28px',
            borderRadius: '0 0 20px 20px',
            opacity: notifOpacity,
            transform: `translateX(${notifX}px)`,
          }}
        >
          <div
            style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 14,
              padding: '16px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: GREEN,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 15,
                color: 'rgba(255,255,255,0.75)',
                fontFamily: 'sans-serif',
              }}
            >
              <strong style={{ color: GREEN }}>New lead!</strong> Sarah M. requested a consultation
              — auto text sent ✓
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 3: Feature Highlights ─────────────────────────────────────────────
function FeatureChip({
  icon,
  label,
  delay,
}: {
  icon: string;
  label: string;
  delay: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSpring(Math.max(0, frame - delay), fps, 16, 120);
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(s, [0, 1], [0.7, 1]);

  return (
    <div
      style={{
        background: 'rgba(255,107,44,0.1)',
        border: `1px solid ${BRAND}40`,
        borderRadius: 100,
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <span style={{ fontSize: 26 }}>{icon}</span>
      <span
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: WHITE,
          fontFamily: 'sans-serif',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function StatBubble({
  value,
  label,
  delay,
  color,
}: {
  value: string;
  label: string;
  delay: number;
  color: string;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSpring(Math.max(0, frame - delay), fps, 12, 80);
  const scale = interpolate(s, [0, 1], [0.5, 1]);
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 900,
          color,
          fontFamily: 'sans-serif',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 16,
          color: 'rgba(255,255,255,0.5)',
          fontFamily: 'sans-serif',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 1,
          textAlign: 'center',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function SceneFeatures() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = useSpring(frame, fps, 14, 90);
  const headlineY = interpolate(headlineSpring, [0, 1], [50, 0]);
  const headlineOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const features = [
    { icon: '🤖', label: 'AI Voice & Chat', delay: 20 },
    { icon: '📞', label: 'Missed Call Text-Back', delay: 30 },
    { icon: '⭐', label: 'Auto Review Requests', delay: 40 },
    { icon: '📅', label: 'Online Booking', delay: 50 },
    { icon: '📊', label: 'Sales Pipeline CRM', delay: 60 },
    { icon: '✉️', label: 'Email & SMS Campaigns', delay: 70 },
    { icon: '🌐', label: 'Website Builder', delay: 80 },
    { icon: '💳', label: 'Invoicing & Payments', delay: 90 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${NAVY} 0%, #0d1f38 100%)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 80% 100%, ${BRAND}10 0%, transparent 55%)`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: WHITE,
            fontFamily: 'sans-serif',
            lineHeight: 1.1,
          }}
        >
          Everything you need.
          <br />
          <span style={{ color: BRAND }}>Nothing you don&apos;t.</span>
        </div>
      </div>

      {/* Feature chips */}
      <div
        style={{
          position: 'absolute',
          top: 260,
          left: 80,
          right: 80,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          justifyContent: 'center',
        }}
      >
        {features.map((f) => (
          <FeatureChip key={f.label} {...f} />
        ))}
      </div>

      {/* Stats row */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 120,
        }}
      >
        <StatBubble value="93%" label="Leads Captured" delay={100} color={GREEN} />
        <StatBubble value="4.8x" label="More Reviews" delay={110} color={BRAND} />
        <StatBubble value="< 30s" label="Lead Response" delay={120} color={BLUE} />
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 4: Testimonials ────────────────────────────────────────────────────
function TestimonialCard({
  quote,
  name,
  role,
  stat,
  delay,
  accentColor,
}: {
  quote: string;
  name: string;
  role: string;
  stat: string;
  delay: number;
  accentColor: string;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSpring(Math.max(0, frame - delay), fps, 16, 90);
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(s, [0, 1], [50, 0]);

  return (
    <div
      style={{
        flex: 1,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${accentColor}30`,
        borderRadius: 20,
        padding: '32px 28px',
        opacity,
        transform: `translateY(${y}px)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {/* Stars */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} style={{ fontSize: 22, color: '#F59E0B' }}>★</span>
        ))}
      </div>
      {/* Quote */}
      <div
        style={{
          fontSize: 17,
          color: 'rgba(255,255,255,0.8)',
          fontFamily: 'sans-serif',
          lineHeight: 1.6,
          fontStyle: 'italic',
          flex: 1,
        }}
      >
        &ldquo;{quote}&rdquo;
      </div>
      {/* Stat pill */}
      <div
        style={{
          display: 'inline-block',
          background: `${accentColor}18`,
          border: `1px solid ${accentColor}40`,
          borderRadius: 100,
          padding: '8px 18px',
          fontSize: 14,
          fontWeight: 700,
          color: accentColor,
          fontFamily: 'sans-serif',
          alignSelf: 'flex-start',
        }}
      >
        {stat}
      </div>
      {/* Author */}
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: WHITE, fontFamily: 'sans-serif' }}>
          {name}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: 'sans-serif', marginTop: 3 }}>
          {role}
        </div>
      </div>
    </div>
  );
}

function SceneTestimonials() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = useSpring(frame, fps, 14, 90);
  const headlineY = interpolate(headlineSpring, [0, 1], [50, 0]);
  const headlineOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const testimonials = [
    {
      quote:
        "We were juggling 6 tools and still losing leads. Ascendly replaced all of them. Our close rate jumped in the first month.",
      name: 'Mike R.',
      role: 'Owner, HVAC Company',
      stat: '+47% more booked jobs',
      accentColor: GREEN,
      delay: 25,
    },
    {
      quote:
        "The AI follow-up is unreal — leads get a text in seconds. I signed 3 new clients in my first week just from missed calls I used to lose.",
      name: 'Jennifer S.',
      role: 'Business Consultant',
      stat: '3 clients week 1',
      accentColor: BRAND,
      delay: 50,
    },
    {
      quote:
        "Our Google reviews went from 12 to 89 in 60 days. Ascendly just asks automatically. It's been a game-changer for new patient trust.",
      name: 'David T.',
      role: 'Director, Medical Spa',
      stat: '12 → 89 reviews',
      accentColor: '#F59E0B',
      delay: 75,
    },
  ];

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 30% 50%, ${BRAND}0C 0%, transparent 55%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,107,44,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,44,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: `${BRAND}22`,
            color: BRAND,
            fontSize: 16,
            fontWeight: 700,
            padding: '7px 18px',
            borderRadius: 100,
            fontFamily: 'sans-serif',
            marginBottom: 18,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}
        >
          Real Results
        </div>
        <div
          style={{
            fontSize: 58,
            fontWeight: 900,
            color: WHITE,
            fontFamily: 'sans-serif',
            lineHeight: 1.1,
          }}
        >
          Businesses growing <span style={{ color: BRAND }}>every day</span>
        </div>
      </div>

      {/* Cards */}
      <div
        style={{
          position: 'absolute',
          top: 250,
          left: 60,
          right: 60,
          bottom: 60,
          display: 'flex',
          gap: 24,
        }}
      >
        {testimonials.map((t) => (
          <TestimonialCard key={t.name} {...t} />
        ))}
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 5: CTA ─────────────────────────────────────────────────────────────
function SceneCTA() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgSpring = useSpring(frame, fps, 20, 60);
  const bgScale = interpolate(bgSpring, [0, 1], [1.1, 1]);

  const logoSpring = useSpring(frame, fps, 14, 100);
  const logoScale = interpolate(logoSpring, [0, 1], [0.5, 1]);
  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const headlineSpring = useSpring(Math.max(0, frame - 10), fps, 14, 80);
  const headlineY = interpolate(headlineSpring, [0, 1], [60, 0]);
  const headlineOpacity = interpolate(frame - 10, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const priceSpring = useSpring(Math.max(0, frame - 25), fps, 12, 90);
  const priceScale = interpolate(priceSpring, [0, 1], [0.3, 1]);
  const priceOpacity = interpolate(frame - 25, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ctaSpring = useSpring(Math.max(0, frame - 45), fps, 18, 100);
  const ctaY = interpolate(ctaSpring, [0, 1], [30, 0]);
  const ctaOpacity = interpolate(frame - 45, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const savingsOpacity = interpolate(frame - 65, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${bgScale})`,
          background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 40%, #c4400a 100%)`,
        }}
      />
      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.12) 0%, transparent 65%)`,
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 900,
            color: WHITE,
            fontFamily: 'sans-serif',
            letterSpacing: -1,
            opacity: 0.9,
          }}
        >
          ascendly
        </div>
      </div>

      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 160,
          left: 80,
          right: 80,
          textAlign: 'center',
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: WHITE,
            fontFamily: 'sans-serif',
            lineHeight: 1.05,
          }}
        >
          Your next client is
          <br />
          looking for you
          <span style={{ opacity: 0.8 }}> right now.</span>
        </div>
      </div>

      {/* Price */}
      <div
        style={{
          position: 'absolute',
          top: 430,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: priceOpacity,
          transform: `scale(${priceScale})`,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 24,
            padding: '28px 60px',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: 'rgba(255,255,255,0.75)',
              fontFamily: 'sans-serif',
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            One flat price. Everything included.
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: WHITE,
              fontFamily: 'sans-serif',
              lineHeight: 1,
            }}
          >
            $127
            <span style={{ fontSize: 32, fontWeight: 500, opacity: 0.7 }}>/mo</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: WHITE,
            color: BRAND,
            fontSize: 28,
            fontWeight: 800,
            padding: '22px 64px',
            borderRadius: 16,
            fontFamily: 'sans-serif',
            letterSpacing: -0.5,
          }}
        >
          Start Your 14-Day Free Trial →
        </div>
      </div>

      {/* Fine print */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: savingsOpacity * 0.7,
        }}
      >
        <span
          style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.75)',
            fontFamily: 'sans-serif',
            fontWeight: 500,
          }}
        >
          No contracts · Cancel anytime · Replace $264/mo of tools
        </span>
      </div>
    </AbsoluteFill>
  );
}

// ─── Root composition ─────────────────────────────────────────────────────────
export const AscendlyAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <Sequence from={0} durationInFrames={150}>
        <SceneProblem />
      </Sequence>

      <Sequence from={150} durationInFrames={150}>
        <SceneSolution />
      </Sequence>

      <Sequence from={300} durationInFrames={150}>
        <SceneFeatures />
      </Sequence>

      <Sequence from={450} durationInFrames={150}>
        <SceneTestimonials />
      </Sequence>

      <Sequence from={600}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
