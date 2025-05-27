import { cn } from "@/lib/utils";

export default function Disclaimer({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-xs text-center text-muted-foreground my-8",
        className
      )}
    >
      App ispirata alla Kings League ma <strong>non ufficiale</strong>
    </p>
  );
}
