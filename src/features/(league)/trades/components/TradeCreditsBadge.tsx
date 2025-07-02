"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Coins } from "iconoir-react";
import { usePathname } from "next/navigation";

const CREDIT_STYLES = {
  give: "text-red-100 bg-red-500/70 border-red-400",
  receive: "text-green-100 bg-green-500/70 border-green-400",
} as const;

export default function TradeCreditsBadge({
  isTradeOver,
  credits,
  type,
}: {
  isTradeOver: boolean;
  credits: number;
  type: "offered" | "requested" | "give" | "receive";
}) {
  const pathname = usePathname();
  const isMyTrade = pathname.includes("my-trades");

  const isGiving = type === "offered" || type === "give";
  const isReceiving = type === "requested" || type === "receive";

  let styles = "";
  let prefix = "";
  let suffix = "";

  if (isGiving) {
    styles = CREDIT_STYLES.give;
    prefix = "-";
    if (isTradeOver) {
      suffix = isMyTrade ? "(hai perso)" : "(ha perso)";
    } else {
      suffix = isMyTrade ? "(perdi)" : "(perde)";
    }
  } else if (isReceiving) {
    styles = CREDIT_STYLES.receive;
    prefix = "+";
    if (isTradeOver) {
      suffix = isMyTrade ? "(hai guadagnato)" : "(ha guadagnato)";
    } else {
      suffix = isMyTrade ? "(guadagni)" : "(guadagna)";
    }
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
