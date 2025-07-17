import { tradeProposalStatuses } from "@/drizzle/schema";
import { getSerialIdSchema, getUUIdSchema } from "@/schema/helpers";
import { z, ZodIssueCode } from "zod";

const tradeProposalPlayer = z.object({
  id: getSerialIdSchema("Id del giocatore non valido"),
  roleId: getSerialIdSchema("Id del ruolo non valido"),
  offeredByProposer: z.boolean(),
});

export const createTradeProposalSchema = z
  .object({
    leagueId: getUUIdSchema("Id della lega invalido"),
    proposerTeamId: getUUIdSchema(
      "L'id del team che propone lo scambio è invalido"
    ),
    receiverTeamId: getUUIdSchema(
      "L'id del team che riceve lo scambio è invalido"
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
        code: ZodIssueCode.custom,
        message: "Non puoi scambiarti giocatori da solo",
        path: ["proposerTeamId"],
      });
      return;
    }

    if (!data.players.length) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "Devi inserire almeno un giocatore nello scambio",
        path: ["proposerTeamId"],
      });
      return;
    }
  });

  // TODO: Non permettere di mandare la proposta se
  // ci sono solo giocatori proposti e non richiesti e viceversa senza crediti

export const updateTradeProposalSchema = z.object({
  tradeId: getUUIdSchema("Id dello scambio invalido"),
  leagueId: getUUIdSchema("Id della lega invalido"),
  status: z.enum(tradeProposalStatuses),
  players: z.array(tradeProposalPlayer),
});

export const deleteTradeProposalSchema = updateTradeProposalSchema.pick({
  tradeId: true,
  leagueId: true,
});

export type CreateTradeProposalSchema = z.infer<
  typeof createTradeProposalSchema
>;
export type UpdateTradeProposalSchema = z.infer<
  typeof updateTradeProposalSchema
>;
export type DeleteTradeProposalSchema = z.infer<
  typeof deleteTradeProposalSchema
>;
