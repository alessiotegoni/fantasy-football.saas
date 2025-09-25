"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { League } from "../queries/league";
import Avatar from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { NavArrowRight, Trophy } from "iconoir-react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Props = {
  league: Pick<League, "id" | "name" | "imageUrl">;
};

export default function UserLeagueDropdownItem({ league }: Props) {
  const { leagueId } = useParams();
  const isCurrent = league.id === leagueId;

  const content = <UserLeagueContent league={league} isCurrent={isCurrent} />;

  return (
    <DropdownMenuItem
      key={league.id}
      className="flex justify-between items-center gap-2 group"
      asChild
      disabled={isCurrent}
    >
      {isCurrent ? (
        <div>{content}</div>
      ) : (
        <Link
          href={`/league/${league.id}`}
          className="flex w-full justify-between"
        >
          {content}
          <NavArrowRight className="text-muted-foreground group-hover:text-white" />
        </Link>
      )}
    </DropdownMenuItem>
  );
}

function UserLeagueContent({ league, isCurrent }: Props & { isCurrent: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar
        imageUrl={league.imageUrl}
        name={league.name}
        className="size-12"
        renderFallback={() => (
          <div
            className={cn(
              "flex justify-center items-center rounded-full size-10",
              isCurrent && "bg-primary group-hover:bg-secondary"
            )}
          >
            <Trophy
              className={cn(
                "size-6 text-white",
                isCurrent && "group-hover:text-white"
              )}
            />
          </div>
        )}
      />
      <p className={cn(isCurrent && "font-semibold")}>{league.name}</p>
    </div>
  );
}
