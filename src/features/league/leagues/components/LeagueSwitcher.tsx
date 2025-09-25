'use client';

import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ArrowSeparateVertical, NavArrowRight, Trophy } from "iconoir-react";
import Link from "next/link";

interface LeagueInfo {
  id: string;
  name: string;
  imageUrl: string | null;
}

export default function LeagueSwitcher({
  currentLeague,
  userLeagues,
}: {
  currentLeague: LeagueInfo;
  userLeagues: LeagueInfo[];
}) {
  const isCurrentLeague = (l: LeagueInfo) => currentLeague.id === l.id;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <span className="truncate max-w-48">{currentLeague.name}</span>
          <ArrowSeparateVertical className="!size-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[18rem]">
        <DropdownMenuLabel>Cambia lega</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userLeagues.map((l) => {
          const content = (
            <div className="flex items-center gap-2">
              <Avatar
                imageUrl={l.imageUrl}
                name={l.name}
                className="size-12"
                renderFallback={() => (
                  <div
                    className={cn(
                      "flex justify-center items-center rounded-full size-10",
                      isCurrentLeague(l) && "bg-primary group-hover:bg-secondary"
                    )}
                  >
                    <Trophy
                      className={cn(
                        "size-6 text-white",
                        isCurrentLeague(l) && "group-hover:text-white"
                      )}
                    />
                  </div>
                )}
              />
              <p className={cn(isCurrentLeague(l) && "font-semibold")}>
                {l.name}
              </p>
            </div>
          );

          return (
            <DropdownMenuItem
              key={l.id}
              className="flex justify-between items-center gap-2 group"
              asChild
              disabled={isCurrentLeague(l)}
            >
              {isCurrentLeague(l) ? (
                <div>{content}</div>
              ) : (
                <Link
                  key={l.id}
                  href={`/league/${l.id}`}
                  className="flex w-full justify-between"
                >
                  {content}
                  <NavArrowRight className="text-muted-foreground group-hover:text-white" />
                </Link>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
