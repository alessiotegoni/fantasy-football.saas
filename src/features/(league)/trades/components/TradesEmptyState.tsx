import EmptyState from "@/components/EmptyState";
import { Suspense } from "react";
import TradeProposalButton from "./TradeProposalButton";

type Props = {
  title?: string;
  description?: string;
  leagueId: string;
  userTeamId: string;
};

export default function TradesEmptyState({
  title = "Nessuno scambio trovato",
  description = "Non sono ancora state effetuate proposte di scambio in questa lega",
  ...buttonProps
}: Props) {
  return (
    <EmptyState
      title={title}
      description={description}
      renderButton={() => (
        <Suspense>
          <TradeProposalButton {...buttonProps} />
        </Suspense>
      )}
    />
  );
}
