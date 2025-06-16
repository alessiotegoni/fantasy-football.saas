import { cn } from "@/lib/utils";

export default function TeamCreditsBadge({
  credits,
  className,
}: {
  credits: number;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary",
        className
      )}
    >
      {credits} crediti
    </p>
  );
}
