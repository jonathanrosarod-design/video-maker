This is a remotion-based video app that uses React to render videos.

Full remotion docs can be found here: https://www.remotion.dev/docs/. Consult these docs often if you're uncertain.

---

## Project Structure

The Root file is usually named `src/Root.tsx` and looks like this:

```tsx
import {Composition} from 'remotion';
import {MyComp} from './MyComp';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComp}
        durationInFrames={120}
        width={1920}
        height={1080}
        fps={30}
        defaultProps={{}}
      />
    </>
  );
};
```

A `<Composition>` defines a video. Defaults: fps=30, height=1080, width=1920, id="MyComp". The `defaultProps` must match the shape of the component's React props.

Inside a component, `useCurrentFrame()` returns the current frame number (starting at 0).

---

## Component Rules

- **Video**: Use `<OffthreadVideo>` (with `startFrom`, `endAt`, `volume` props)
- **Static image**: Use `<Img>`
- **Animated GIF**: Use `<Gif>` from `@remotion/gif`
- **Audio**: Use `<Audio>` (with `startFrom`, `endAt`, `volume` props)
- **Asset from public/ folder**: Use `staticFile('filename')` from remotion
- **Layering**: Use `<AbsoluteFill>` to stack elements
- **Timing**: Use `<Sequence from={N} durationInFrames={N}>` to delay elements; child `useCurrentFrame()` resets to 0 at sequence start
- **Sequential elements**: Use `<Series>` / `<Series.Sequence durationInFrames={N}>`
- **Transitions**: Use `<TransitionSeries>` from `@remotion/transitions` with `.Sequence` and `.Transition` tags interleaved
- **Randomness**: Use `random('seed')` from remotion — `Math.random()` is forbidden (must be deterministic)
- **Interpolation**: Use `interpolate(frame, [inputRange], [outputRange], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })`
- **Composition metadata**: Use `useVideoConfig()` to access `fps`, `durationInFrames`, `height`, `width`
- **Spring animations**: Use `spring({ fps, frame, config: { damping: 200 } })`

---

## Making UI Components

Remotion components are fundamentally different from interactive React components:

| | Remotion | Normal React |
|---|---|---|
| State | `useCurrentFrame()` drives animation | `useState()` for interactivity |
| Animations | `interpolate()` / `spring()` based on frame | CSS transitions, requestAnimationFrame |
| User Input | None — all props at composition time | onClick, forms, gestures |
| Effects | Avoid `useEffect` — keep pure/deterministic | `useEffect` for side effects |

### Best Practices for Remotion Components

1. Always use frame-based animations — never time-based effects
2. Keep components pure — no side effects or external data fetching
3. Use Remotion's hooks: `useCurrentFrame()`, `useVideoConfig()`, etc.
4. Leverage `<Sequence>` for timing different elements
5. No interactive elements — remove all event handlers
6. Ensure deterministic rendering for consistent video output
