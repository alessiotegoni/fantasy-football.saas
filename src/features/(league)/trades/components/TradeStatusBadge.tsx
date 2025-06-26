import { Badge } from "@/components/ui/badge";
import { TradeStatusTheme } from "../utils/trade";
import { cn } from "@/lib/utils";

export default function TradeStatusBadge({
  theme,
}: {
  theme: TradeStatusTheme;
}) {
  const Icon = theme.badgeIcon;

  return (
    <Badge
      variant="outline"
      className={cn("rounded-full p-2 px-3 text-sm gap-2", theme.badgeBg)}
    >
      <Icon className="!size-5" />
      {theme.badgeText}
    </Badge>
  );
}
