import { PlayersListProvider } from "@/contexts/PlayersListProvider";
import { db } from "@/drizzle/db";
import {
  leagueMemberTeamPlayers,
  leagueMemberTeams,
  players,
} from "@/drizzle/schema";
import { getLeagueAvailablePlayersTag } from "@/features/(league)/leagues/db/cache/league";
import VirtualizedPlayersList from "@/features/players/components/VirtualizedPlayersList";
import PlayersListSearchBar from "@/features/players/components/PlayersListSearchBar";
import PlayersRolesFilters from "@/features/players/components/PlayersRolesFilters";
import { getPlayersRoles } from "@/features/players/queries/player";
import TeamsFilters from "@/features/teams/components/TeamsFilters";
import { getTeams } from "@/features/teams/queries/team";
import { eq, notInArray } from "drizzle-orm";
import { ArrowLeft } from "iconoir-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { Suspense } from "react";

export default async function LeaguePlayersListPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  // const players = await getLeagueAvailablePlayers(leagueId);

  return (
    <div className="max-w-[700px] mx-auto md:p-4">
      <div className="flex items-center mb-4 md:mb-8 md:hidden">
        <Link href={`/leagues/${leagueId}`} className="mr-3">
          <ArrowLeft className="size-5" />
        </Link>
        <h2 className="text-2xl font-heading">Listone</h2>
      </div>
      <h2 className="hidden md:block text-3xl font-heading mb-8">Listone</h2>
      <PlayersListProvider players={mockPlayers}>
        <PlayersListSearchBar />
        <Suspense>
          <TeamsFilters teamsPromise={getTeams()} />
          <PlayersRolesFilters playersRolesPromise={getPlayersRoles()} />
        </Suspense>
        <VirtualizedPlayersList leagueId={leagueId} />
      </PlayersListProvider>
    </div>
  );
}

const mockPlayers = [
  {
    id: "b21f3c1c-b9f3-40e3-9982-8fc7e9f1a01a",
    displayName: "Luca Rossi",
    roleId: 1,
    teamId: 3,
    avatarUrl: "/avatars/luca_rossi.png",
  },
  {
    id: "f8d0dcb2-77d3-4a64-8432-d4f0e3a9d4f6",
    displayName: "Marco Bianchi",
    roleId: 2,
    teamId: 5,
    avatarUrl: "/avatars/marco_bianchi.png",
  },
  {
    id: "3e1e74de-96ff-49a0-a4f6-788cdcf834e2",
    displayName: "Giovanni Verdi",
    roleId: 3,
    teamId: 7,
    avatarUrl: "/avatars/giovanni_verdi.png",
  },
  {
    id: "7f3d449d-3247-4021-ace5-5cbe1d7a9d51",
    displayName: "Alessandro Neri",
    roleId: 4,
    teamId: 9,
    avatarUrl: "/avatars/alessandro_neri.png",
  },
  {
    id: "91042e16-50d1-4e4e-a5d2-1d4df33b13d8",
    displayName: "Simone Gialli",
    roleId: 5,
    teamId: 11,
    avatarUrl: "/avatars/simone_gialli.png",
  },
  {
    id: "e45b6f8c-5613-422e-b7c0-fadf0c81b730",
    displayName: "Matteo Rosa",
    roleId: 1,
    teamId: 4,
    avatarUrl: "/avatars/matteo_rosa.png",
  },
  {
    id: "71f842f1-0ee1-4552-8c44-0435f4a52e56",
    displayName: "Andrea Blu",
    roleId: 2,
    teamId: 6,
    avatarUrl: "/avatars/andrea_blu.png",
  },
  {
    id: "b75c802a-85ee-47b5-a1c6-44cf02aa1e4b",
    displayName: "Davide Viola",
    roleId: 3,
    teamId: 8,
    avatarUrl: "/avatars/davide_viola.png",
  },
  {
    id: "5b3f5b6c-2c23-4f4b-8c86-53faac34b291",
    displayName: "Stefano Marrone",
    roleId: 4,
    teamId: 10,
    avatarUrl: "/avatars/stefano_marrone.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
  {
    id: "02b9f702-b6b6-4e62-ae54-88f186bd45a6",
    displayName: "Riccardo Grigio",
    roleId: 5,
    teamId: 14,
    avatarUrl: "/avatars/riccardo_grigio.png",
  },
];

async function getLeagueAvailablePlayers(leagueId: string) {
  "use cache";
  cacheTag(getLeagueAvailablePlayersTag(leagueId));

  const takenPlayersSubquery = await db
    .select({
      playerId: leagueMemberTeamPlayers.playerId,
    })
    .from(leagueMemberTeamPlayers)
    .innerJoin(
      leagueMemberTeams,
      eq(leagueMemberTeamPlayers.memberTeamId, leagueMemberTeams.id)
    )
    .where(eq(leagueMemberTeams.leagueId, leagueId));

  const availablePlayers = await db
    .select({
      id: players.id,
      displayName: players.displayName,
      roleId: players.roleId,
      teamId: players.teamId,
      avatarUrl: players.avatarUrl,
    })
    .from(players)
    .where(
      notInArray(
        players.id,
        takenPlayersSubquery.map((player) => player.playerId)
      )
    );

  return availablePlayers;
}
