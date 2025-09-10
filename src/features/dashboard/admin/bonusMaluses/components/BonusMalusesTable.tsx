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

type Props = {
  bonusMaluses: MatchdayBonusMalus[];
};

export default function BonusMalusesTable({ bonusMaluses }: Props) {
  const { filteredItems, handleFilter } = useFilter(bonusMaluses, {
    filterFn: filterBonusMaluses,
    defaultFilters,
  });

  return (
    <>
      <SearchBar
        onSearch={(search) => handleFilter({ search })}
        className="mb-0"
      />
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
          <TableBody>
            {filteredItems.map((bm) => (
              <TableRow key={bm.id}>
                <TableCell>{bm.player.displayName}</TableCell>
                <TableCell>{bm.bonusMalusType.name}</TableCell>
                <TableCell>{bm.count}</TableCell>
                <TableCell>
                  <BonusMalusRowActions bonusMalus={bm} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
