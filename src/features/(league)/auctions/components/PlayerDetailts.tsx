"use client";

import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuction } from "@/contexts/AuctionProvider";

export default function PlayerDetails() {
  const { selectedPlayer, currentNomination } = useAuction();

  const player = currentNomination?.player || selectedPlayer;

  return (
    <div className="bg-card border rounded-3xl h-full">
      <div className="p-6">
        {player ? (
          <div className="text-center space-y-4">
            <Avatar className="h-20 w-20 mx-auto">
              <AvatarImage src={player.avatarUrl || undefined} />
              <AvatarFallback className="text-lg">
                {player.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-heading font-bold">{player.displayName}</h3>
              <p className="text-sm text-muted-foreground">
                {player.team.name}
              </p>
              <Badge className="mt-2">{player.role.name}</Badge>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Seleziona un giocatore</p>
          </div>
        )}
      </div>
    </div>
  );
}
