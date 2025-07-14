import StarterLineupField from "./StarterLineupField";
import { getStarterLineups } from "../queries/match";
import { TacticalModule } from "@/drizzle/schema";

type Props = {
  matchId: string;
  currentMatchdayId: number;
  homeTacticalModule?: TacticalModule;
  awayTacticalModule?: TacticalModule;
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
    <>
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
    </>
  );
}
