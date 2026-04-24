"use client";

import React from "react";
import { motion, useInView, Variant } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineContentProps {
  children: React.ReactNode;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement | null>;
  customVariants?: {
    visible: (i: number) => Variant;
    hidden: Variant;
  };
  className?: string;
  as?: React.ElementType;
}

export function TimelineContent({
  children,
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  as: Component = "div",
}: TimelineContentProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const defaultVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
    hidden: {
      y: 20,
      opacity: 0,
    },
  };

  const variants = customVariants || defaultVariants;

  return (
    <Component
      ref={ref}
      as={motion.div}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      custom={animationNum}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
