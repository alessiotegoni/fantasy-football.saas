"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TradeProposalSchema, tradeProposalSchema } from "../schema/trade";
import { Form } from "@/components/ui/form";
import TeamsSelectField from "@/features/teams/components/TeamsSelectField";

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

  async function onSubmit(values: TradeProposalSchema) {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <TeamsSelectField<TradeProposalSchema> name="receiverTeamId" />
      </form>
    </Form>
  );
}
