"use client";

import { useFilter } from "@/hooks/useFilter";
import SearchBar from "@/components/SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MatchdayVote } from "../queries/vote";
import { SplitMatchday } from "../../admin/splits/queries/split";
import VotesRowActions from "./VotesRowActions";

type Props = {
  matchday: SplitMatchday;
  votes: MatchdayVote[];
};

export default function VotesTable({ matchday, votes }: Props) {
  const { filteredItems, handleFilter } = useFilter(votes, {
    filterFn: filterVotes,
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
                <TableHead>Voto</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto max-h-[800px]">
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.player.displayName}</TableCell>
                  <TableCell>{item.vote}</TableCell>
                  <TableCell>
                    <VotesRowActions matchday={matchday} vote={item} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-4">
          Nessun voto trovato
        </p>
      )}
    </>
  );
}

const defaultFilters = { search: "" };

function filterVotes(
  { player, vote }: MatchdayVote,
  { search }: typeof defaultFilters
) {
  if (!search) return true;
  return (
    player.displayName.toLowerCase().includes(search.toLowerCase()) ||
    vote.includes(search)
  );
}
