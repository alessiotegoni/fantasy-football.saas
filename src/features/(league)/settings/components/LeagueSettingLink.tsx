"use client";

import NavLink from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { getItemHref } from "@/utils/helpers";
import Link from "next/link";

type Props = {
  setting: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  leagueId: string;
  className?: string;
};

export default function LeagueSettingLink({
  setting,
  leagueId,
  className,
}: Props) {
  const isMobile = useIsMobile();

  return (
    <NavLink
      href={getItemHref(`/leagues/:leagueId/settings/${setting.id}`, leagueId)}
      render={({ isActive, href }) => (
        <Button
          variant={isMobile ? "outline" : "ghost"}
          asChild
          className={cn(
            "flex items-center p-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
            isActive
              ? `!bg-primary hover:bg-primary/90 text-primary-foreground
          font-semibold font-heading transition-colors hover:text-primary-foreground`
              : "border-transparent text-muted-foreground hover:text-foreground",
            className
          )}
        >
          <Link href={href}>
            <setting.icon className="size-5" />
            {setting.label}
          </Link>
        </Button>
      )}
    />
  );
}
