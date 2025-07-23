import { SplitMatchday } from "@/features/splits/queries/split";
import { LineupPlayer, MatchInfo } from "../queries/match";
import Container from "@/components/Container";
import { Suspense } from "react";
import CalendarMatchCard from "../../(admin)/calendar/components/CalendarMatchCard";
import FootballFieldBg from "./FootballFieldBg";
import StarterLineups from "./StarterLineups";
import BenchLineup from "./BenchLineup";
import MobileButtonsContainer from "@/components/MobileButtonsContainer";
import ModulesSelect from "./ModulesSelect";
import { getTacticalModules } from "../../options/queries/leagueOptions";
import { getLeagueModules } from "../../leagues/queries/league";
import Disclaimer from "@/components/Disclaimer";
import PlayersSelect from "./PlayersSelect";
import { getTeamsPlayers } from "../../teamsPlayers/queries/teamsPlayer";
import { groupLineupsPlayers } from "../utils/match";
import SaveLineupButton from "./SaveLineupButton";

type Props = {
  matchInfo: MatchInfo;
  leagueId: string;
  matchId: string;
  myTeamId?: string | null;
  lineupsPlayers?: LineupPlayer[];
  currentMatchday?: SplitMatchday;
  showLineups?: boolean;
};

export default function MatchWrapper({
  matchInfo,
  myTeamId,
  currentMatchday,
  lineupsPlayers = [],
  showLineups,
  ...ids
}: Props) {
  const isMatchdayClosed =
    matchInfo.splitMatchday.id !== currentMatchday?.id ||
    currentMatchday?.status !== "upcoming";

  const groupedPlayers = groupLineupsPlayers(lineupsPlayers);

  return (
    <Container
      {...ids}
      headerLabel="Partita"
      showHeader={false}
      className="xl:max-w-[800px] 2xl:max-w-[1200px]"
    >
      <div className="2xl:grid gap-5 xl:grid-cols-[180px_1fr_180px]">
        {showLineups && (
          <div className="flex flex-col justify-between gap-5">
            <div className="size-full bg-input/30 rounded-4xl">
              {/*Presidente home*/}
            </div>
            <BenchLineup
              players={groupedPlayers["bench"] ?? []}
              canEditLineup={
                !isMatchdayClosed && matchInfo.homeTeam.id === myTeamId
              }
              className="2xl:border-r"
            />
          </div>
        )}
        <div>
          <CalendarMatchCard
            className="!rounded-4xl border-b border-border"
            homeModule={matchInfo.homeTeam?.lineup?.tacticalModule.name ?? null}
            awayModule={matchInfo.awayTeam?.lineup?.tacticalModule.name ?? null}
            isLink={false}
            {...ids}
            {...matchInfo}
          />
          <FootballFieldBg>
            {!isMatchdayClosed && myTeamId && (
              <MobileButtonsContainer className="sm:size-0">
                <ModulesSelect
                  allowedModulesPromise={getLeagueModules(ids.leagueId)}
                  tacticalModulesPromise={getTacticalModules()}
                />
                <SaveLineupButton {...ids} myTeamId={myTeamId} />
              </MobileButtonsContainer>
            )}
            {showLineups && (
              <Suspense>
                <StarterLineups
                  players={groupedPlayers["starter"] ?? []}
                  match={matchInfo}
                  currentMatchday={currentMatchday}
                  isMatchdayClosed={isMatchdayClosed}
                />
              </Suspense>
            )}
          </FootballFieldBg>
        </div>
        <div className="flex flex-col justify-between gap-5">
          <div className="size-full bg-input/30 rounded-4xl">
            {/*Presidente away*/}
          </div>
          {showLineups && (
            <Suspense>
              <BenchLineup
                players={groupedPlayers["bench"] ?? []}
                canEditLineup={
                  !isMatchdayClosed && matchInfo.awayTeam.id === myTeamId
                }
                className="2xl:border-l"
              />
            </Suspense>
          )}
        </div>
      </div>
      {showLineups && myTeamId && (
        <Suspense>
          <PlayersSelect
            playersPromise={getTeamsPlayers([myTeamId]).then((players) =>
              players.map(({ purchaseCost, leagueTeamId, ...player }) => player)
            )}
          />
        </Suspense>
      )}
      <Disclaimer />
    </Container>
  );
}
