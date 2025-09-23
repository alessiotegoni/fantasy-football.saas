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
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

type Props = {
  matchday: SplitMatchday;
  votes: MatchdayVote[];
};

export default function VotesTable(props: Props) {
  const { filteredItems, handleFilter } = useFilter(props.votes, {
    filterFn: filterVotes,
    defaultFilters,
  });

  const { sortedItems, toggleSortOrder } = useSortVotes(filteredItems);

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
                <TableHead className="px-0">
                  <Button
                    variant="ghost"
                    onClick={toggleSortOrder}
                    className="p-0 justify-start hover:bg-transparent"
                  >
                    <div
                      className="flex items-center transition-colors
                      rounded-lg gap-2 p-2 hover:bg-primary"
                    >
                      Voto
                      <ArrowUpDown className="ml-2 size-4" />
                    </div>
                  </Button>
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto max-h-[800px]">
              {sortedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.player.firstName} {item.player.lastName}
                  </TableCell>
                  <TableCell>{item.vote}</TableCell>
                  <TableCell>
                    <VotesRowActions vote={item} {...props} />
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

function useSortVotes(items: MatchdayVote[]) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedItems = useMemo(
    () =>
      items.toSorted((a, b) => {
        const voteA = parseFloat(a.vote);
        const voteB = parseFloat(b.vote);

        if (isNaN(voteA) || isNaN(voteB)) {
          return 0;
        }

        if (sortOrder === "asc") {
          return voteA - voteB;
        } else {
          return voteB - voteA;
        }
      }),
    [items, sortOrder]
  );

  const toggleSortOrder = useCallback(
    () => setSortOrder((current) => (current === "asc" ? "desc" : "asc")),
    []
  );

  return { sortedItems, toggleSortOrder };
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
