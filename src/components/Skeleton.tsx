import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { buttonVariants } from "./ui/button";

export function SkeletonButton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        buttonVariants({
          variant: "secondary",
          className: "pointer-events-none animate-pulse w-24",
        }),
        className
      )}
    />
  );
}

export function SkeletonArray({
  amount,
  children,
}: {
  amount: number;
  children: ReactNode;
}) {
  return Array.from({ length: amount }, () => children);
}

export function SkeletonText({
  rows = 1,
  size = "md",
  className,
}: {
  rows?: number;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <SkeletonArray amount={rows}>
        <div
          className={cn(
            "w-full rounded-sm",
            rows > 1 && "last:w-3/4",
            size === "md" && "h-3.5",
            size === "lg" && "h-5",
            className
          )}
        />
      </SkeletonArray>
    </div>
  );
}
