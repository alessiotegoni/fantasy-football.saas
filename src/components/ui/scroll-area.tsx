import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

type Props = {
  direction?: "vertical" | "horizontal";
  className?: string;
};

export default function ScrollArea({
  direction = "vertical",
  className,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div
      className={cn(
        "space-y-2 pr-2 custom-scrollbar",
        direction === "vertical" ? "overflow-y-auto" : "overflow-x-auto",
        className
      )}
    >
      {children}
    </div>
  );
}
