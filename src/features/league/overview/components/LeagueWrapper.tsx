"use client";

import { Split } from "@/features/dashboard/admin/splits/queries/split";
import { LeagueTeam } from "../../teams/queries/leagueTeam";
import TeamsCarousel from "../../teams/components/TeamsCarousel";
import { StandingData } from "../../standing/queries/standing";
import { Match } from "../../admin/calendar/regular/queries/calendar";
import StandingTable from "../../standing/components/StandingTable";
import {
  FinalPhaseAccess,
  getFinalPhaseAccess,
} from "../../admin/calendar/final-phase/utils/calendar";
import LeagueMatches from "./LeagueMatches";
import EmptyState from "@/components/EmptyState";
import { CalendarXmark } from "iconoir-react";
import { Skeleton } from "@/components/ui/skeleton";
import LeagueWidget from "./LeagueWidget";
import { groupMatches } from "@/features/league/overview/utils/match";
import LastFiveMatches from "./LastFiveMatches";
import UserMatches from "./UserMatches";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useMobile";

type Props = {
  leagueId: string;
  leagueTeams: LeagueTeam[];
  userTeam?: LeagueTeam;
  standingData: StandingData[];
  isDefaultStanding?: boolean;
  calendar?: Match[];
  matches?: ReturnType<typeof groupMatches>;
  lastSplit?: Split;
  userId?: string;
};

export default function LeagueWrapper({
  calendar,
  standingData,
  matches,
  ...restProps
}: Props) {
  const isMobile = useIsMobile(768);

  const finalPhaseAccess = getFinalPhaseAccess(standingData);
  const sidebarProps = {
    standingData,
    finalPhaseAccess,
    ...restProps,
  };

  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="basis-10/12 grow">
        <LeagueWidget {...restProps} matches={matches} />
        {!isMobile && (
          <div className="mt-4 md:flex gap-4 2xl:block">
            <div className="hidden md:block basis-10/12">
              {calendar ? (
                calendar.length > 0 && matches ? (
                  <LeagueMatches {...restProps} matches={matches} />
                ) : (
                  <EmptyState
                    icon={CalendarXmark}
                    title="Calendario non disponibile"
                    description="Il calendario per questa lega non è stato ancora generato, contatta un admin della lega per generarlo"
                  />
                )
              ) : (
                <Skeleton className="size-full min-h-80" />
              )}
            </div>
            <Sidebar
              {...sidebarProps}
              className="hidden md:flex flex-col-reverse justify-end gap-4 2xl:hidden max-w-80"
            />
          </div>
        )}
      </div>
      {!isMobile && (
        <Sidebar
          {...sidebarProps}
          className="hidden 2xl:flex max-w-70 xl:max-w-80 2xl:max-w-90"
        />
      )}
      {isMobile && (
        <div className="space-y-4">
          {matches ? (
            <>
              <UserMatches matches={matches} {...restProps} />
              <LastFiveMatches matches={matches} {...restProps} />
            </>
          ) : (
            <Skeleton className="h-44" />
          )}
        </div>
      )}
    </div>
  );
}

function Sidebar({
  className,
  standingData,
  lastSplit,
  isDefaultStanding = true,
  ...restProps
}: Props & { finalPhaseAccess: FinalPhaseAccess; className: string }) {
  return (
    <div className={cn("flex-col gap-4 basis-1/12", className)}>
      <TeamsCarousel {...restProps} />
      {standingData.length > 0 && (
        <StandingTable
          data={standingData}
          isExtended={false}
          isSplitEnded={lastSplit?.status === "ended"}
          isDefaultStanding={isDefaultStanding}
          {...restProps}
        />
      )}
    </div>
  );
}
