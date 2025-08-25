import { User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Player {
  id: number
  name: string
  team: string
  role: string
  price: number
  image: string | null
}

interface PlayerDetailsProps {
  selectedPlayer: Player | null
  currentBid: number
}

export function PlayerDetails({ selectedPlayer, currentBid }: PlayerDetailsProps) {
  return (
    <div className="bg-card border rounded-lg h-full">
      <div className="p-6">
        {selectedPlayer ? (
          <div className="text-center space-y-4">
            <Avatar className="h-20 w-20 mx-auto">
              <AvatarImage src={selectedPlayer.image || undefined} />
              <AvatarFallback className="text-lg">{selectedPlayer.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-heading font-bold">{selectedPlayer.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedPlayer.team}</p>
              <Badge className="mt-2">{selectedPlayer.role}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Prezzo base:</span>
                <span className="font-bold">${selectedPlayer.price}</span>
              </div>
              {currentBid > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Offerta attuale:</span>
                  <span className="font-bold text-primary">${currentBid}</span>
                </div>
              )}
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
  )
}
