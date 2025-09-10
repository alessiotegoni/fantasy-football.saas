"use client";

import { Team } from "@/features/dashboard/admin/teams/queries/team";
import LinkButton from "@/components/LinkButton";
import { deleteTeam } from "@/features/dashboard/admin/teams/actions/team";
import ActionButton from "@/components/ActionButton";

type Props = {
  team: Team;
};

export default function TeamCard({ team }: Props) {
  return (
    <div className="p-4 bg-muted/30 rounded-3xl flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{team.displayName}</h3>
        <p className="text-sm text-muted-foreground">{team.name}</p>
      </div>
      <div className="flex gap-2">
        <ActionButton
          loadingText="Elimino"
          variant="destructive"
          className="min-w-24 max-w-fit"
          action={deleteTeam.bind(null, team.id)}
          requireAreYouSure
        >
          Elimina
        </ActionButton>
        <LinkButton href={`/dashboard/admin/teams/${team.id}`}>
          Modifica
        </LinkButton>
      </div>
    </div>
  );
}
