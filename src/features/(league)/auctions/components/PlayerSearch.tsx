"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ScrollArea from "@/components/ui/scroll-area"

interface Player {
  id: number
  name: string
  team: string
  role: string
  price: number
  image: string | null
}

interface PlayerSearchProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  roleFilter: string
  setRoleFilter: (role: string) => void
  filteredPlayers: Player[]
  selectedPlayer: Player | null
  setSelectedPlayer: (player: Player) => void
}

export function PlayerSearch({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  filteredPlayers,
  selectedPlayer,
  setSelectedPlayer,
}: PlayerSearchProps) {
  return (
    <div className="space-y-4">
      {/* Search Card */}
      <div className="bg-card border rounded-lg p-4">
        <h3 className="text-sm font-heading font-bold mb-3">Ricerca Giocatori</h3>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca giocatore..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtra per ruolo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i ruoli</SelectItem>
              <SelectItem value="P">Portieri</SelectItem>
              <SelectItem value="D">Difensori</SelectItem>
              <SelectItem value="C">Centrocampisti</SelectItem>
              <SelectItem value="A">Attaccanti</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Players List Card */}
      <div className="bg-card border rounded-lg">
        <div className="p-4 border-b">
          <h3 className="text-sm font-heading font-bold">Lista Giocatori</h3>
        </div>
        <ScrollArea className="h-64">
          <div className="space-y-1 p-3">
            {filteredPlayers.map((player) => (
              <div
                key={player.id}
                className={`p-2 rounded-md cursor-pointer transition-colors hover:bg-muted ${
                  selectedPlayer?.id === player.id ? "bg-primary/10 border border-primary/20" : ""
                }`}
                onClick={() => setSelectedPlayer(player)}
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {player.role}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{player.name}</p>
                    <p className="text-xs text-muted-foreground">{player.team}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
