import { cn } from "@/lib/utils";
import type { ComponentType } from "react";
import { BR, TR, US, type FlagComponent } from "country-flag-icons/react/1x1";

interface FlagIconProps {
  code: string;
  className?: string;
}

const FLAG_COMPONENTS: Record<
  string,
  FlagComponent
> = {
  US,
  TR,
  BR,
};

export function FlagIcon({ code, className = "h-6 w-6" }: FlagIconProps) {
  const Flag = FLAG_COMPONENTS[code];

  if (!Flag) {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center overflow-hidden rounded-full ring-1 ring-border shadow-[0_4px_10px_rgba(15,23,42,0.25)] bg-background",
        className,
      )}
      aria-hidden="true"
    >
      <Flag className="h-full w-full" />
    </span>
  );
}
