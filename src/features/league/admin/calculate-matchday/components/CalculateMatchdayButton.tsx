"use client";

import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";
import ActionButton from "@/components/ActionButton";
import {
  calculateMatchday,
  recalculateMatchday,
} from "../actions/calculate-matchday";

type Props = {
  matchdayId: number;
  calculationId?: string;
} & Omit<React.ComponentPropsWithoutRef<typeof ActionButton>, "action">;

export default function CalculateMatchdayButton({
  matchdayId,
  calculationId,
  className,
  children,
}: PropsWithChildren<Props>) {
  const { leagueId } = useParams<{ leagueId: string }>();

  const action = calculationId
    ? recalculateMatchday.bind(null, calculationId)
    : calculateMatchday;

  return (
    <ActionButton
      action={() => action({ leagueId, matchdayId })}
      loadingText={calculationId ? "Ricalcolo" : "Calcolo"}
      className={className}
    >
      {children}
    </ActionButton>
  );
}
