import Avatar from "@/components/Avatar";
import { StandingData } from "../../standing/queries/standing";
import { LeagueTeam } from "../../teams/queries/leagueTeam";

type Props = {
  standingData?: StandingData[];
  userTeam?: LeagueTeam;
};

export default function UserStats({ userTeam, standingData = [] }: Props) {
  if (!userTeam) return <UserTeamPlaceholder />;

  const userData = standingData.find((data) => data.team.id === userTeam?.id);

  console.log(userData);

  return (
    <div className="h-full flex flex-col justify-between items-center p-4">
      <div className="flex flex-col justify-center items-center gap-3 text-center grow">
        <Avatar
          name={userTeam.name}
          imageUrl={userTeam.imageUrl}
          className="size-20"
          renderFallback={() => null}
        />
        <div>
          <h3 className="text-xl">{userTeam.name}</h3>
          <p className="text-sm mt-1">{userTeam.managerName}</p>
        </div>
      </div>
      {userData && (
        <div className="bg-muted rounded-2xl p-4 flex justify-between items-center w-full">
          <div className="text-xs text-center space-y-1">
            <h4 className="xs:text-sm">{standingData.indexOf(userData) + 1}</h4>
            <p>Posizione</p>
          </div>
          <div className="h-9 w-1 rounded-full bg-card" />
          <div className="text-xs text-center space-y-1">
            <h4 className="xs:text-sm">{userData.points}</h4>
            <p>Punti</p>
          </div>
          <div className="text-xs text-center space-y-1">
            <h4 className="xs:text-sm">
              {userData.wins + userData.losses + userData.draws}
            </h4>
            <p>Partite</p>
          </div>
          <div className="text-xs text-center space-y-1">
            <h4 className="xs:text-sm">{userData.totalScore}</h4>
            <p>Pt. Totali</p>
          </div>
        </div>
      )}
    </div>
  );
}

function UserTeamPlaceholder() {
  return (
    <div className="h-full flex flex-col justify-center items-center gap-3 text-center">
      <div className="size-20 bg-muted rounded-full" />
      <div>
        <h3 className="text-xl">La tua squadra</h3>
        <p className="text-sm mt-1">Il tuo allenatore</p>
      </div>
    </div>
  );
}
