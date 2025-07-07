import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export default function MobileButtonsContainer({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "fixed z-50 bottom-[99px] left-1/2 -translate-x-1/2 w-full px-4 sm:px-0 sm:static sm:translate-none sm:w-fit",
        className
      )}
    >
      {children}
    </div>
  );
}
