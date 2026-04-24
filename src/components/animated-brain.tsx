"use client";

import { motion } from "framer-motion";

interface AnimatedBrainProps {
  size?: number;
  className?: string;
  state?: "idle" | "thinking";
}

export function AnimatedBrain({ size = 40, className = "", state = "idle" }: AnimatedBrainProps) {
  const pulseSpeed = state === "thinking" ? 0.5 : 1.8;

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Left hemisphere ── */}
        <path
          d="M32 10
             C28 10 22 12 19 16
             C16 14 12 15 11 19
             C8  19 6  22 7  26
             C5  28 5  32 7  35
             C6  39 8  42 12 43
             C13 47 17 50 21 50
             C24 52 28 52 32 51"
          stroke="#84A59D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="#84A59D"
          fillOpacity="0.12"
        />

        {/* ── Right hemisphere ── */}
        <path
          d="M32 10
             C36 10 42 12 45 16
             C48 14 52 15 53 19
             C56 19 58 22 57 26
             C59 28 59 32 57 35
             C58 39 56 42 52 43
             C51 47 47 50 43 50
             C40 52 36 52 32 51"
          stroke="#84A59D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="#84A59D"
          fillOpacity="0.12"
        />

        {/* ── Centre divider (corpus callosum) ── */}
        <motion.path
          d="M32 11 C31 22 31 34 32 51"
          stroke="#84A59D"
          strokeWidth="1"
          strokeDasharray="3 3"
          strokeOpacity="0.5"
          strokeLinecap="round"
          animate={{ strokeOpacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: pulseSpeed, repeat: Infinity }}
        />

        {/* ── Left hemisphere folds ── */}
        <path d="M19 22 Q15 26 17 32" stroke="#84A59D" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
        <path d="M14 30 Q13 35 17 38" stroke="#84A59D" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
        <path d="M21 16 Q18 20 20 26" stroke="#84A59D" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
        <path d="M22 36 Q19 40 22 44" stroke="#84A59D" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />

        {/* ── Right hemisphere folds ── */}
        <path d="M45 22 Q49 26 47 32" stroke="#84A59D" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
        <path d="M50 30 Q51 35 47 38" stroke="#84A59D" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
        <path d="M43 16 Q46 20 44 26" stroke="#84A59D" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
        <path d="M42 36 Q45 40 42 44" stroke="#84A59D" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />

        {/* ── Neural sparks (left side) ── */}
        {[
          { cx: 16, cy: 24, d: 0 },
          { cx: 13, cy: 32, d: 0.3 },
          { cx: 18, cy: 40, d: 0.6 },
          { cx: 23, cy: 20, d: 0.9 },
        ].map((pt, i) => (
          <motion.circle
            key={`l${i}`}
            cx={pt.cx}
            cy={pt.cy}
            r="1.8"
            fill="#84A59D"
            animate={{ scale: [1, state === "thinking" ? 2.5 : 1.8, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: pulseSpeed, delay: pt.d, repeat: Infinity }}
            style={{ transformOrigin: `${pt.cx}px ${pt.cy}px` }}
          />
        ))}

        {/* ── Neural sparks (right side) ── */}
        {[
          { cx: 48, cy: 24, d: 0.2 },
          { cx: 51, cy: 32, d: 0.5 },
          { cx: 46, cy: 40, d: 0.8 },
          { cx: 41, cy: 20, d: 1.1 },
        ].map((pt, i) => (
          <motion.circle
            key={`r${i}`}
            cx={pt.cx}
            cy={pt.cy}
            r="1.8"
            fill="#84A59D"
            animate={{ scale: [1, state === "thinking" ? 2.5 : 1.8, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: pulseSpeed, delay: pt.d, repeat: Infinity }}
            style={{ transformOrigin: `${pt.cx}px ${pt.cy}px` }}
          />
        ))}

        {/* ── Central pulse (corpus centre) ── */}
        <motion.circle
          cx={32}
          cy={31}
          r="2.5"
          fill="#84A59D"
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: pulseSpeed * 0.8, repeat: Infinity }}
        />

        {/* ── Outer glow ring ── */}
        <motion.circle
          cx={32} cy={31} r={28}
          stroke="#84A59D"
          strokeWidth="0.6"
          strokeDasharray="5 4"
          strokeOpacity="0.25"
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "32px 31px" }}
        />
      </svg>
    </div>
  );
}
