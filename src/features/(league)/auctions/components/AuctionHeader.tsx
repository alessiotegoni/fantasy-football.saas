"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "iconoir-react";
import { AuctionWithSettings } from "../queries/auction";
import { useSidebar } from "@/components/ui/sidebar";
import AuctionStatus from "./AuctionStatus";
import AuctionDropdownMenu from "./AuctionDropdownMenu";
import { useEffect } from "react";

type Props = {
  auction: NonNullable<AuctionWithSettings>;
  isLeagueAdmin?: boolean;
};

export default function AuctionHeader({ auction, isLeagueAdmin = false }: Props) {
  const { setOpen, toggleSidebar } = useSidebar();

  useEffect(() => {
    setOpen(false);

    return () => setOpen(true);
  }, []);

  return (
    <header className="flex items-center justify-between gap-2 sm:gap-4 pb-4 sm:p-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden lg:block"
        >
          <Menu className="size-5" />
        </Button>
        <h2 className="text-lg lg:text-2xl font-heading font-bold">
          {auction.name}
        </h2>
      </div>
      <div className="flex gap-2">
        <AuctionStatus auction={auction} canUpdate={isLeagueAdmin} />
        {isLeagueAdmin && (
          <AuctionDropdownMenu
            auction={auction}
            canUpdate={isLeagueAdmin}
            leagueId={auction.leagueId}
          />
        )}
      </div>
    </header>
  );
}
