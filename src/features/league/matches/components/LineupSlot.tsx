import { ComponentPropsWithoutRef } from "react";
import PresidentSlot from "./PresidentSlot";
import BenchLineup from "./BenchLineup";

type Props = ComponentPropsWithoutRef<typeof PresidentSlot> &
  ComponentPropsWithoutRef<typeof BenchLineup> & { isAwayTeam: boolean };

function LineupSlot({ className, ...props }: Props) {
  return (
    <>
      <PresidentSlot {...props} />
      <BenchLineup {...props} className={className} />
    </>
  );
}

export const HomeLineupSlot = LineupSlot;
export const AwayLineupSlot = LineupSlot;
