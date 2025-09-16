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
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

type Props = {
  matchday: SplitMatchday;
  votes: MatchdayVote[];
};

export default function VotesTable(props: Props) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { filteredItems, handleFilter } = useFilter(props.votes, {
    filterFn: filterVotes,
    defaultFilters,
  });

  const sortedItems = useMemo(
    () =>
      filteredItems.toSorted((a, b) => {
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
    [filteredItems]
  );

  const toggleSortOrder = () => {
    setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
  };

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
                <TableHead>
                  <Button variant="ghost" onClick={toggleSortOrder}>
                    Voto
                    <ArrowUpDown className="ml-2 size-4" />
                  </Button>
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto max-h-[800px]">
              {sortedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.player.displayName}</TableCell>
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
