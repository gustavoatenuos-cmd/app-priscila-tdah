"use client";

import { motion } from "framer-motion";

interface AnimatedBrainProps {
  size?: number;
  className?: string;
  state?: "idle" | "thinking";
}

export function AnimatedBrain({ size = 40, className = "", state = "idle" }: AnimatedBrainProps) {
  const pulseSpeed = state === "thinking" ? 0.5 : 1.6;

  // Neural connection paths
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

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rotating dashed outer ring */}
        <motion.circle
          cx={20} cy={20} r={18}
          stroke="#84A59D"
          strokeWidth="0.5"
          strokeDasharray="4 3"
          strokeOpacity="0.35"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "20px 20px" }}
        />

        {/* Brain silhouette */}
        <path
          d="M20 8
             C14 8 10 12 10 17
             C8 17 6 19 8 22
             C6 25 8 28 11 28
             C12 32 16 34 20 33
             C24 34 28 32 29 28
             C32 28 34 25 32 22
             C34 19 32 17 30 17
             C30 12 26 8 20 8Z"
          stroke="#84A59D"
          strokeWidth="1.2"
          strokeLinejoin="round"
          fill="#84A59D"
          fillOpacity="0.08"
        />

        {/* Hemisphere divider */}
        <path
          d="M20 9 C20 18 20 24 20 33"
          stroke="#84A59D"
          strokeWidth="0.6"
          strokeDasharray="2 2"
          opacity="0.35"
        />

        {/* Neural paths — animated */}
        {neuralPaths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="#84A59D"
            strokeWidth="0.8"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.7, 0.7, 0] }}
            transition={{
              duration: pulseSpeed * 1.5,
              delay: i * (pulseSpeed / 3),
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Synapse dots */}
        {synapses.map((pt, i) => (
          <motion.circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r="1.3"
            fill="#84A59D"
            animate={{
              scale: [1, state === "thinking" ? 2.2 : 1.7, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: pulseSpeed,
              delay: i * 0.18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
          />
        ))}

        {/* Central pulse */}
        <motion.circle
          cx={20} cy={20} r="2.2"
          fill="#84A59D"
          animate={{ scale: [1, 1.7, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: pulseSpeed, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}
