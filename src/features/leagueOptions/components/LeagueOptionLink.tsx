"use client";

import NavLink from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useMobile";
import { cn, getItemHref } from "@/lib/utils";
import Link from "next/link";

type Props = {
  option: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  leagueId: string;
  className?: string;
};

export default function LeagueOptionLink({
  option,
  leagueId,
  className,
}: Props) {
  const isMobile = useIsMobile();

  return (
    <NavLink
      href={getItemHref(`/leagues/:leagueId/options/${option.id}`, leagueId)}
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
            <option.icon className="size-5" />
            {option.label}
          </Link>
        </Button>
      )}
    />
  );
}
