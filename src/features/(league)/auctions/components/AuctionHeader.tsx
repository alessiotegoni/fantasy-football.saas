"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "iconoir-react";
import { AuctionWithSettings } from "../queries/auction";
import { useSidebar } from "@/components/ui/sidebar";
import AuctionStatus from "./AuctionStatus";
import AuctionDropdownMenu from "./AuctionDropdownMenu";

type Props = {
  auction: NonNullable<AuctionWithSettings>;
  isAdmin: boolean;
};

export default function AuctionHeader({ auction, isAdmin }: Props) {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="size-5" />
        </Button>
        <h1 className="text-xl font-heading font-bold">{auction.name}</h1>
      </div>
      <AuctionStatus auction={auction} canUpdate={isAdmin} />
      {isAdmin && (
        <AuctionDropdownMenu
          auction={auction}
          canUpdate={isAdmin}
          leagueId={auction.leagueId}
        />
      )}
    </header>
  );
}
