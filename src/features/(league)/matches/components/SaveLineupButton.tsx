"use client";

import ActionButton from "@/components/ActionButton";
import useMyLineup from "@/hooks/useMyLineup";

export default function SaveLineupButton({ matchId }: { matchId: string }) {
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
