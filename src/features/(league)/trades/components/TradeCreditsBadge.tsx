import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Coins } from "iconoir-react";

const CREDIT_STYLES = {
  give: "text-red-100 bg-red-500/70 border-red-400",
  receive: "text-green-100 bg-green-500/70 border-green-400",
} as const;

export default function TradeCreditsBadge({
  credits,
  type,
}: {
  credits: number;
  type: "offered" | "requested" | "give" | "receive";
}) {
  const isGiving = type === "offered" || type === "give";
  const isReceiving = type === "requested" || type === "receive";

  let styles = "";
  let prefix = "";
  let suffix = "";

  if (isGiving) {
    styles = CREDIT_STYLES.give;
    prefix = "-";
    suffix = "(perdi)";
  } else if (isReceiving) {
    styles = CREDIT_STYLES.receive;
    prefix = "+";
    suffix = "(guadagni)";
  } else {
    styles = isGiving ? "text-orange-600" : "text-blue-600";
    prefix = isGiving ? "-" : "+";
  }

  return (
    <Badge
      variant="secondary"
      className={cn(
        "text-sm rounded-lg font-semibold flex items-center gap-1",
        styles
      )}
    >
      {prefix}
      {credits}
      <Coins className="!size-4" />
      {suffix && <span className="text-xs">{suffix}</span>}
    </Badge>
  );
}
