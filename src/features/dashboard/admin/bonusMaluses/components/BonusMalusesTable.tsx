"use client";

import { useFilter } from "@/hooks/useFilter";
import { MatchdayBonusMalus } from "../queries/bonusMalus";
import SearchBar from "@/components/SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BonusMalusRowActions from "./BonusMalusRowActions";
import { SplitMatchday } from "../../splits/queries/split";
import { BonusMalusType } from "../queries/bonusMalusType";

type Props = {
  matchday: SplitMatchday;
  bonusMaluses: MatchdayBonusMalus[];
  bonusMalusTypes: BonusMalusType[];
};

export default function BonusMalusesTable({
  matchday,
  bonusMaluses,
  bonusMalusTypes,
}: Props) {
  const { filteredItems, handleFilter } = useFilter(bonusMaluses, {
    filterFn: filterBonusMaluses,
    defaultFilters,
  });

  return (
    <>
      <SearchBar
        onSearch={(search) => handleFilter({ search })}
        className="mb-0"
        placeholder="Cerca giocatore o bonus"
      />
      {filteredItems.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Giocatore</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Conteggio</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto max-h-[800px]">
              {filteredItems.map((bm) => (
                <TableRow key={bm.id}>
                  <TableCell>{bm.player.displayName}</TableCell>
                  <TableCell>{bm.bonusMalusType.name}</TableCell>
                  <TableCell>{bm.count}</TableCell>
                  <TableCell>
                    <BonusMalusRowActions
                      matchday={matchday}
                      bonusMalus={bm}
                      bonusMalusTypes={bonusMalusTypes}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-4">
          Nessun bonus/malus trovato
        </p>
      )}
    </>
  );
}

const defaultFilters = { search: "" };

function filterBonusMaluses(
  { player, bonusMalusType }: MatchdayBonusMalus,
  { search }: { search: string }
) {
  if (!search) return true;
  return (
    player.displayName.toLowerCase().includes(search.toLowerCase()) ||
    bonusMalusType.name.toLowerCase().includes(search.toLowerCase())
  );
}
