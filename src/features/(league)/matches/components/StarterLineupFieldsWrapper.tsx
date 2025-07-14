import StarterLineupField from "./StarterLineupField";
import { getStarterLineups } from "../queries/match";
import { TacticalModule } from "@/drizzle/schema";

type Props = {
  matchId: string;
  currentMatchdayId: number;
  homeTacticalModule: TacticalModule;
  awayTacticalModule: TacticalModule;
  canEditHome: boolean;
  canEditAway: boolean;
};

export default async function StarterLineupFieldsWrapper({
  matchId,
  currentMatchdayId,
  homeTacticalModule,
  awayTacticalModule,
  canEditHome,
  canEditAway,
}: Props) {
  const starterPlayers = await getStarterLineups(matchId, currentMatchdayId);

  return (
    <div className="absolute grid grid-rows-2 sm:grid-rows-none sm:grid-cols-2 w-full min-h-[600px] sm:min-h-[400px]">
      <StarterLineupField
        matchId={matchId}
        currentMatchdayId={currentMatchdayId}
        tacticalModule={homeTacticalModule}
        canEdit={canEditHome}
        starterPlayers={starterPlayers}
      />
      <StarterLineupField
        matchId={matchId}
        currentMatchdayId={currentMatchdayId}
        tacticalModule={awayTacticalModule}
        canEdit={canEditAway}
        starterPlayers={starterPlayers}
      />
    </div>
  );
}
