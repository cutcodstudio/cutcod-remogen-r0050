import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const CandlestickSurge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  // Spring animation for the surge - starts slow, accelerates
  const surgeProgress = spring({
    frame,
    fps,
    config: {
      mass: 0.8,
      stiffness: 40,
      damping: 12,
    },
  });

  // Candlestick dimensions
  const bodyWidth = 120;
  const wickWidth = 8;

  // OHLC values (as percentages of available height)
  const open = 0.7;  // Opens at 70% from bottom
  const close = 0.15; // Closes at 15% from bottom (big green candle going up)
  const high = 0.1;   // Wick goes up to 10% from top
  const low = 0.75;   // Wick goes down to 75% from bottom

  // Calculate actual pixel positions (inverted because Y goes down)
  const usableHeight = height * 0.8;
  const bottomOffset = height * 0.1;

  const openY = height - bottomOffset - (open * usableHeight);
  const closeY = height - bottomOffset - (close * usableHeight);
  const highY = height - bottomOffset - ((1 - high) * usableHeight);
  const lowY = height - bottomOffset - ((1 - low) * usableHeight);

  // Animate from bottom of screen
  const startY = height + 200;
  const endY = 0;
  const translateY = interpolate(surgeProgress, [0, 1], [startY, endY]);

  // Body of the candle (green = close > open visually, which means closeY < openY)
  const bodyTop = Math.min(openY, closeY);
  const bodyHeight = Math.abs(closeY - openY);

  // Scale effect - starts slightly smaller and grows
  const scale = interpolate(surgeProgress, [0, 1], [0.9, 1]);

  // Glow intensity increases as it surges up
  const glowIntensity = interpolate(surgeProgress, [0.3, 1], [0, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: `translateX(-50%) translateY(${translateY}px) scale(${scale})`,
          transformOrigin: "center bottom",
        }}
      >
        {/* Upper wick */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: highY,
            width: wickWidth,
            height: bodyTop - highY,
            backgroundColor: "#00ff88",
            boxShadow: `0 0 ${glowIntensity}px #00ff88`,
          }}
        />

        {/* Candle body */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: bodyTop,
            width: bodyWidth,
            height: bodyHeight,
            backgroundColor: "#00ff88",
            boxShadow: `0 0 ${glowIntensity * 1.5}px #00ff88, 0 0 ${glowIntensity * 3}px #00ff8855`,
            borderRadius: 4,
          }}
        />

        {/* Lower wick */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: bodyTop + bodyHeight,
            width: wickWidth,
            height: lowY - (bodyTop + bodyHeight),
            backgroundColor: "#00ff88",
            boxShadow: `0 0 ${glowIntensity}px #00ff88`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
