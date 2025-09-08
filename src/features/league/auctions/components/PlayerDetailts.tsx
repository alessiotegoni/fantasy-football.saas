"use client";

import { useAuction } from "@/contexts/AuctionProvider";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, User, Xmark } from "iconoir-react";
import Avatar from "@/components/Avatar";
import PlayerRoleBadge from "@/components/PlayerRoleBadge";
import Link from "next/link";

export default function PlayerDetails() {
  const { auction, toggleSelectPlayer, selectedPlayer, currentNomination } =
    useAuction();

  const player = currentNomination?.player || selectedPlayer;

  return (
    <div
      className={`relative rounded-3xl h-full p-4 sm:p-6 ${
        auction.status === "ended" ? "bg-muted/30" : "bg-card border"
      }`}
    >
      {selectedPlayer && !currentNomination && (
        <Button
          variant="destructive"
          className="w-fit absolute top-4 right-4 rounded-full size-7"
          onClick={toggleSelectPlayer.bind(null, null)}
        >
          <Xmark className="size-4" />
        </Button>
      )}
      {player ? (
        <div className="lg:text-center h-full flex lg:flex-col lg:justify-center items-center gap-2">
          <div className="relative size-20">
            <Avatar
              imageUrl={player.avatarUrl}
              name={player.displayName}
              renderFallback={() => <User className="size-8" />}
              className="size-18 ring-1 ring-zinc-700"
            />
            {player.role && (
              <PlayerRoleBadge
                role={player.role}
                className="absolute size-6 bottom-2 right-2"
              />
            )}
          </div>

          <div>
            <Link
              href={`/players/${player.id}`}
              className="relative hover:underline"
            >
              <h2>{player.displayName}</h2>
              <ArrowUpRight className="size-3 absolute top-0 -right-3" />
            </Link>
            <p className="text-sm text-muted-foreground">
              {player.team.displayName}
            </p>
          </div>
        </div>
      ) : (
        <PlayerEmptyState />
      )}
    </div>
  );
}

function PlayerEmptyState() {
  return (
    <div className="h-full flex lg:flex-col lg:justify-center items-center lg:text-center text-muted-foreground gap-2 sm:gap-4">
      <div className="size-20 bg-input rounded-full grid place-content-center">
        <User className="size-10" />
      </div>
      <div>
        <h2 className="text-lg">Giocatore</h2>
        <p className="text-sm">Squadra</p>
      </div>
    </div>
  );
}
