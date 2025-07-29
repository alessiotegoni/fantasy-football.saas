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
        "space-y-2 mt-2 max-h-[40dvh] xl:max-h-96 pr-2 custom-scrollbar",
        direction === "vertical" ? "overflow-y-auto" : "overflow-x-auto",
        className
      )}
    >
      {children}
    </div>
  );
}
