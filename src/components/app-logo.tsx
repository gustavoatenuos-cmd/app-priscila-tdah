"use client";

import { cn } from "@/lib/utils";

type AppLogoProps = {
  className?: string;
  imageClassName?: string;
  alt?: string;
};

export function AppLogo({
  className,
  imageClassName,
  alt = "TDAH Constante",
}: AppLogoProps) {
  return (
    <div className={cn("shrink-0 overflow-hidden rounded-full bg-white", className)}>
      <img
        src="/tdah-constante-mark.png"
        alt={alt}
        className={cn("h-full w-full object-cover", imageClassName)}
      />
    </div>
  );
}
