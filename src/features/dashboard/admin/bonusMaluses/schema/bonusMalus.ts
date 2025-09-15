import { getSerialIdSchema, getUUIdSchema } from "@/schema/helpers";
import { z } from "zod";

export const assignBonusMalusSchema = z.object({
  playerId: getSerialIdSchema(),
  matchdayId: getSerialIdSchema(),
  bonusMalusTypeId: getSerialIdSchema(),
  count: z.number().positive("Il conteggio deve essere un numero positivo"),
});

export const createBonusMalusSchema = z.object({
  bonusMaluses: z.array(assignBonusMalusSchema),
});

export const editBonusMalusSchema = z
  .object({
    id: getUUIdSchema(),
  })
  .merge(assignBonusMalusSchema);

export const deleteBonusMalusSchema = z.object({
  bonusMalusId: getUUIdSchema(),
  matchdayId: getSerialIdSchema()
})

export type AssignBonusMalusSchema = z.infer<typeof assignBonusMalusSchema>;

export type CreateBonusMalusSchema = z.infer<typeof createBonusMalusSchema>;
export type EditBonusMalusSchema = z.infer<typeof editBonusMalusSchema>;
export type DeleteBonusMalusSchema = z.infer<typeof deleteBonusMalusSchema>;
