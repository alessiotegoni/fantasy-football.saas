"use client";

import ActionButton from "@/components/ActionButton";
import { MyLineup } from "@/contexts/MyLineupProvider";
import useMyLineup from "@/hooks/useMyLineup";

type Props = {
  matchId: string;
  leagueId: string;
  myTeamId: string;
};

export default function SaveLineupButton(props: Props) {
  const { isLineupDirty } = useMyLineup();

  return (
    isLineupDirty && (
      <ActionButton
        className="mt-2 sm:mt-0 sm:w-32 sm:rounded-b-none hover:bg-primary h-[50px] sm:h-10
      sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:bottom-0 sm:z-50 xl:h-11 text-xs xl:text-base"
      >
        Salva
      </ActionButton>
    )
  );
}
