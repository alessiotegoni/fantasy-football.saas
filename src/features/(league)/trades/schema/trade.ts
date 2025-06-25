import { getSerialIdSchema, getUUIdSchema } from "@/schema/helpers";
import { z } from "zod";

const tradeProposalPlayer = z.object({
  id: getSerialIdSchema("Id del giocatore non valido"),
  offeredByProposer: z.boolean(),
});

export const createTradeProposalSchema = z
  .object({
    leagueId: getUUIdSchema("Id della lega invalido"),
    proposerTeamId: getUUIdSchema(
      "L'id del team che propone lo scambio e' invalido"
    ),
    receiverTeamId: getUUIdSchema(
      "L'id del team che riceve lo scambio e' invalido"
    ),
    creditOfferedByProposer: z
      .number({ message: "Deve essere un numero valido" })
      .positive("Deve essere un numero maggiore di 0")
      .transform((num) => num || null)
      .nullable(),
    creditRequestedByProposer: z
      .number({ message: "Deve essere un numero valido" })
      .positive("Deve essere un numero maggiore di 0")
      .transform((num) => num || null)
      .nullable(),
    players: z.array(tradeProposalPlayer),
  })
  .superRefine((data, ctx) => {
    if (data.proposerTeamId === data.receiverTeamId) {
      ctx.addIssue({
        code: "custom",
        message: "Non puoi scambiarti giocatori da solo",
        path: [0],
      });
      return;
    }

    if (!data.players.length) {
      ctx.addIssue({
        code: "custom",
        message: "Devi inserire almeno un giocatore nello scambio",
        path: [0],
      });
      return;
    }
  });

export type CreateTradeProposalSchema = z.infer<typeof createTradeProposalSchema>;
