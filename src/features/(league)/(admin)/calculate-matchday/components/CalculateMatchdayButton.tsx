import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";
import ActionButton from "@/components/ActionButton";

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

  const action = calculationId ? recalculateMatchday : calculateMatchday;

  return (
    <ActionButton
      action={action.bind(null, { calculationId, leagueId, matchdayId })}
      loadingText={calculationId ? "Ricalcolo" : "Calcolo"}
      className={className}
    >
      {children}
    </ActionButton>
  );
}
