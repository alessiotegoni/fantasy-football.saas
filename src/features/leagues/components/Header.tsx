import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export default function Header({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <header
      className={cn(
        `bg-gradient-to-b from-primary to-secondary px-6
           w-full mb-12 mx-auto max-w-[2000px] rounded-bl-4xl rounded-br-4xl`,
        className
      )}
    >
      {children}
    </header>
  );
}
