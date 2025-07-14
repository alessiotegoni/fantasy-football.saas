import { CustomBonusMalus } from "@/drizzle/schema";
import { getCurrentMatchday } from "@/features/splits/queries/split";
import { getUserTeamId } from "@/features/users/queries/user";
import { getUserId } from "@/features/users/utils/user";
import Image from "next/image";
import { formatTeamData } from "../queries/match";

type Team = ReturnType<typeof formatTeamData>;

type Props = {
  leagueId: string;
  homeTeam: Team;
  awayTeam: Team;
  isBye: boolean;
  splitMatchday: {
    id: number;
    splitId: number;
  };
  leagueCustomBonusMalus: CustomBonusMalus;
};

export default async function LineupsWrapper({
  leagueId,
  isBye,
  homeTeam,
  awayTeam,
  leagueCustomBonusMalus,
  splitMatchday,
}: Props) {
  const userId = await getUserId();
  if (!userId) return;

  const [userTeamId, currentMatchday] = await Promise.all([
    getUserTeamId(userId, leagueId),
    getCurrentMatchday(splitMatchday.splitId),
  ]);
  const myTeam = [homeTeam, awayTeam].find((team) => team?.id === userTeamId);

  const canPutLineup = [
    !!myTeam,
    !isBye,
    splitMatchday.id === currentMatchday?.id,
    currentMatchday?.status === "upcoming",
  ].every(Boolean);

  return (
    <div className="relative min-h-[600px] sm:min-h-[400px] rounded-3xl overflow-hidden mt-5">
      <Image
        src="https://tpeehtrlgmfimvwrswif.supabase.co/storage/v1/object/public/kik-league/app-images/football-field-horizontal.jpeg"
        alt="Football field"
        fill
        className="hidden sm:block"
        priority
      />
      <Image
        src="https://tpeehtrlgmfimvwrswif.supabase.co/storage/v1/object/public/kik-league/app-images/football-field-vertical.jpeg"
        alt="Football field"
        fill
        objectFit="cover"
        className="sm:hidden"
        priority
      />
    </div>
  );
}
