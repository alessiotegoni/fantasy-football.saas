import { getSerialIdSchema, getUUIdSchema } from "@/schema/helpers";
import { z } from "zod";

const assignBonusMalusSchema = z.object({
  playerId: getSerialIdSchema(),
  matchdayId: getSerialIdSchema(),
  bonusMalusTypeId: getSerialIdSchema(),
  count: z.number().positive("Il conteggio deve essere un numero positivo"),
});

export const editBonusMaluSchema = z
  .object({
    id: getUUIdSchema(),
  })
  .merge(assignBonusMalusSchema);

export type CreateBonusMalusSchema = z.infer<typeof assignBonusMalusSchema>;
export type EditBonusMalusSchema = z.infer<typeof editBonusMaluSchema>;
