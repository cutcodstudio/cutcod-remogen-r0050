import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence,
  spring,
  random,
} from "remotion";

/**
 * ExampleScene - Demonstrates common Remotion patterns for AI-assisted video creation
 *
 * Key patterns shown:
 * 1. useCurrentFrame() for animation timing
 * 2. interpolate() for smooth value transitions
 * 3. spring() for physics-based animations
 * 4. Sequence for timeline-based content
 * 5. random() with seed for deterministic randomness
 * 6. data-element attributes for AI debugging
 */

// ============================================================================
// COMPONENTS
// ============================================================================

const AnimatedText: React.FC<{
  text: string;
  delay?: number;
}> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for scale
  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Fade in opacity
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      data-element="animated-text"
      style={{
        fontSize: 72,
        fontWeight: 700,
        color: "#FFFFFF",
        transform: `scale(${scale})`,
        opacity,
        textShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      {text}
    </div>
  );
};

const FloatingParticle: React.FC<{
  index: number;
}> = ({ index }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Use deterministic random for consistent renders
  const startX = random(`particle-${index}-x`) * width;
  const startY = random(`particle-${index}-y`) * height;
  const speed = 0.5 + random(`particle-${index}-speed`) * 1.5;
  const size = 4 + random(`particle-${index}-size`) * 8;

  // Animate upward with slight horizontal drift
  const y = startY - frame * speed;
  const x = startX + Math.sin(frame * 0.05 + index) * 20;

  // Fade out as it rises
  const opacity = interpolate(y, [height * 0.2, 0], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      data-element={`particle-${index}`}
      style={{
        position: "absolute",
        left: x,
        top: y % height, // Wrap around
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "#32CD32",
        opacity: opacity * 0.6,
      }}
    />
  );
};

// ============================================================================
// MAIN SCENE
// ============================================================================

export const ExampleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Background gradient animation
  const gradientRotation = interpolate(frame, [0, 150], [0, 360]);

  return (
    <AbsoluteFill
      data-element="example-scene"
      style={{
        background: `linear-gradient(${gradientRotation}deg, #1a1a2e, #16213e, #0f3460)`,
      }}
    >
      {/* Floating particles layer */}
      <AbsoluteFill data-element="particles-layer">
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} index={i} />
        ))}
      </AbsoluteFill>

      {/* Content sequences */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* First text appears at frame 0 */}
        <Sequence from={0} durationInFrames={60}>
          <AnimatedText text="Welcome to Remogen" />
        </Sequence>

        {/* Second text appears at frame 45 */}
        <Sequence from={45} durationInFrames={60}>
          <AnimatedText text="AI-Powered Video Creation" delay={0} />
        </Sequence>

        {/* Third text appears at frame 90 */}
        <Sequence from={90} durationInFrames={60}>
          <AnimatedText text="Built with Remotion + Gemini" delay={0} />
        </Sequence>
      </AbsoluteFill>

      {/* Frame counter for debugging */}
      <div
        data-element="frame-counter"
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          color: "rgba(255,255,255,0.3)",
          fontSize: 14,
          fontFamily: "monospace",
        }}
      >
        Frame: {frame}
      </div>
    </AbsoluteFill>
  );
};
