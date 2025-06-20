import { getSerialIdSchema, getUUIdSchema } from "@/schema/helpers";
import { z } from "zod";

const tradeProposalPlayer = z.object({
  id: getSerialIdSchema("Id del giocatore non valido"),
  roleId: getSerialIdSchema("Id del ruolo del giocatore non valido"),
  offeredByProposer: z.boolean(),
});

export const tradeProposalSchema = z
  .object({
    leagueId: getUUIdSchema("Id della lega invalido"),
    proposerTeamId: getUUIdSchema(
      "L'id del team che propone lo scambio e' invalido"
    ),
    receiverTeamId: getUUIdSchema(
      "L'id del team che riceve lo scambio e' invalido"
    ),
    creditOfferedByProposer: z
      .number()
      .positive("Deve essere un numero maggiore di 0")
      .nullable(),
    creditRequestedByProposer: z
      .number()
      .positive("Deve essere un numero maggiore di 0")
      .nullable(),
    players: z.array(tradeProposalPlayer),
  })
  .superRefine((data, ctx) => {
    console.log(data.proposerTeamId === data.receiverTeamId);

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

export type TradeProposalSchema = z.infer<typeof tradeProposalSchema>;
