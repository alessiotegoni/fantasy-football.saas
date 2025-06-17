import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TradeProposalSchema, tradeProposalSchema } from "../schema/trade";

type Props = {
  leagueId: string;
  proposerTeamId: string;
  receiverTeamId?: string;
};

export default function TradeProposalForm({
  leagueId,
  proposerTeamId,
  receiverTeamId,
}: Props) {
  const form = useForm<TradeProposalSchema>({
    resolver: zodResolver(tradeProposalSchema),
    defaultValues: {
      leagueId,
      creditOfferedByProposer: null,
      creditRequestedByProposer: null,
      proposerTeamId,
      receiverTeamId: receiverTeamId ?? "",
    },
  });

  

  return <div>TradeProposalForm</div>;
}
