"use client";

import { motion } from "framer-motion";

interface AnimatedBrainProps {
  size?: number;
  className?: string;
  /** "idle" = gentle pulse, "thinking" = faster neural flash */
  state?: "idle" | "thinking";
}

export function AnimatedBrain({ size = 40, className = "", state = "idle" }: AnimatedBrainProps) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;

  // Neural connection paths – drawn relative to a 40×40 grid
  const neuralPaths = [
    "M10 22 Q16 14 22 18",
    "M22 18 Q28 12 32 20",
    "M10 22 Q12 30 18 28",
    "M18 28 Q22 32 28 28",
    "M28 28 Q33 26 32 20",
    "M16 18 Q20 10 26 14",
  ];

  // Synapse dots
  const synapses = [
    { x: 10, y: 22 }, { x: 22, y: 18 }, { x: 32, y: 20 },
    { x: 18, y: 28 }, { x: 28, y: 28 }, { x: 16, y: 18 },
    { x: 26, y: 14 },
  ];

  const pulseSpeed = state === "thinking" ? 0.6 : 1.8;

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Outer glow ring ── */}
        <motion.circle
          cx={cx} cy={cy} r={18}
          stroke="#84A59D"
          strokeWidth="0.5"
          strokeDasharray="4 3"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${cx}px ${cy}px`, opacity: 0.3 }}
        />

        {/* ── Brain silhouette (simplified organic shape) ── */}
        <path
          d="M20 8
             C14 8 10 12 10 17
             C8  17 6  19 8  22
             C6  25 8  28 11 28
             C12 32 16 34 20 33
             C24 34 28 32 29 28
             C32 28 34 25 32 22
             C34 19 32 17 30 17
             C30 12 26 8 20 8Z"
          stroke="#84A59D"
          strokeWidth="1.2"
          strokeLinejoin="round"
          fill="#84A59D"
          fillOpacity="0.06"
        />

        {/* ── Hemisphere divider ── */}
        <path
          d="M20 9 C20 18 20 24 20 33"
          stroke="#84A59D"
          strokeWidth="0.6"
          strokeDasharray="2 2"
          opacity="0.4"
        />

        {/* ── Neural connection paths ── */}
        {neuralPaths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="#84A59D"
            strokeWidth="0.8"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.7, 0.3] }}
            transition={{
              pathLength: { delay: i * 0.2, duration: pulseSpeed, repeat: Infinity, repeatType: "reverse" },
              opacity: { delay: i * 0.2, duration: pulseSpeed, repeat: Infinity, repeatType: "reverse" },
            }}
          />
        ))}

        {/* ── Synapse dots ── */}
        {synapses.map((pt, i) => (
          <motion.circle
            key={i}
            cx={pt.x} cy={pt.y} r="1.2"
            fill="#84A59D"
            animate={{
              scale: state === "thinking" ? [1, 2, 1] : [1, 1.5, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: pulseSpeed * 0.8,
              delay: i * 0.15,
              repeat: Infinity,
            }}
            style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
          />
        ))}

        {/* ── Central pulse dot ── */}
        <motion.circle
          cx={cx} cy={cy} r="2"
          fill="#84A59D"
          animate={{ scale: [1, 1.6, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: pulseSpeed, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
}
