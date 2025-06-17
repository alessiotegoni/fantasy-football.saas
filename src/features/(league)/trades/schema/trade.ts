import { z } from "zod";

const tradeProposalPlayer = z.object({
  id: z.number().positive(),
  offeredByProposer: z.boolean(),
});

export const tradeProposalSchema = z.object({
  leagueId: z.string().uuid("Id della lega invalido"),
  proposerTeamId: z
    .string()
    .uuid("L'id del team che propone lo scambio e' invalido"),
  receiverTeamId: z
    .string()
    .uuid("L'id del team che riceve lo scambio e' invalido"),
  creditOfferedByProposer: z
    .number()
    .positive("Deve essere un numero maggiore di 0")
    .nullable(),
  creditRequestedByProposer: z
    .number()
    .positive("Deve essere un numero maggiore di 0")
    .nullable(),
  players: z.array(tradeProposalPlayer),
});

export type TradeProposalSchema = z.infer<typeof tradeProposalSchema>;
