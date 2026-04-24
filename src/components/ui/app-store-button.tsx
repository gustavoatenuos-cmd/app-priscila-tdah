import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppStoreButtonProps = React.ComponentProps<typeof Button>;

export function AppStoreButton({
  className,
  ...props
}: Omit<AppStoreButtonProps, "children">) {
  return (
    <Button className={cn("h-14 gap-3 bg-[#1F2937] text-white hover:bg-black rounded-2xl px-6", className)} {...props}>
      <AppleIcon className="size-6" />
      <div className="text-left flex flex-col items-start justify-center">
        <span className="text-[9px] font-black uppercase tracking-widest leading-none opacity-60">
          Download on the
        </span>
        <p className="text-lg font-black leading-tight tracking-tight">App Store</p>
      </div>
    </Button>
  );
}

export function GooglePlayButton({
    className,
    ...props
  }: Omit<AppStoreButtonProps, "children">) {
    return (
      <Button className={cn("h-14 gap-3 bg-[#1F2937] text-white hover:bg-black rounded-2xl px-6", className)} {...props}>
        <PlayIcon className="size-6" />
        <div className="text-left flex flex-col items-start justify-center">
          <span className="text-[9px] font-black uppercase tracking-widest leading-none opacity-60">
            GET IT ON
          </span>
          <p className="text-lg font-black leading-tight tracking-tight">Google Play</p>
        </div>
      </Button>
    );
  }

function AppleIcon({
  fill = "currentColor",
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill={fill} {...props}>
        <path d="M18.546,12.763c0.024-1.87,1.004-3.597,2.597-4.576c-1.009-1.442-2.64-2.323-4.399-2.378    c-1.851-0.194-3.645,1.107-4.588,1.107c-0.961,0-2.413-1.088-3.977-1.056C6.122,5.927,4.25,7.068,3.249,8.867    c-2.131,3.69-0.542,9.114,1.5,12.097c1.022,1.461,2.215,3.092,3.778,3.035c1.529-0.063,2.1-0.975,3.945-0.975    c1.828,0,2.364,0.975,3.958,0.938c1.64-0.027,2.674-1.467,3.66-2.942c0.734-1.041,1.299-2.191,1.673-3.408    C19.815,16.788,18.548,14.879,18.546,12.763z" />
        <path d="M15.535,3.847C16.429,2.773,16.87,1.393,16.763,0c-1.366,0.144-2.629,0.797-3.535,1.829    c-0.895,1.019-1.349,2.351-1.261,3.705C13.352,5.548,14.667,4.926,15.535,3.847z" />
    </svg>
  );
}

function PlayIcon({
    fill = "currentColor",
    ...props
  }: React.ComponentProps<"svg">) {
    return (
      <svg viewBox="0 0 24 24" fill={fill} {...props}>
          <path d="M3,20.5V3.5C3,2.2,4.5,1.4,5.6,2.2L19.4,11.2C20.2,11.7,20.2,12.3,19.4,12.8L5.6,21.8C4.5,22.6,3,21.8,3,20.5z" />
      </svg>
    );
  }
