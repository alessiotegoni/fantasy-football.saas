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
        "space-y-2 custom-scrollbar",
        direction === "vertical" ? "overflow-y-auto pr-2" : "overflow-x-auto pb-2",
        className
      )}
    >
      {children}
    </div>
  );
}
