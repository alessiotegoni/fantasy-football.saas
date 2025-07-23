import { z } from "zod";
import { Position, PositionId, positions } from "@/drizzle/schema";
import { getSerialIdSchema } from "@/schema/helpers";

const positionIdSchema = z.custom<PositionId>(
  (val) => {
    if (typeof val !== "string") return false;
    const parts = val.split("-");
    if (parts.length !== 2) return false;
    const [pos, num] = parts;
    return positions.includes(pos as Position) && !isNaN(Number(num));
  },
  { message: "Invalid PositionId" }
);

const rolePositionSchema = z.object({
  count: z.number().min(1).max(4),
  roleId: z.number().positive(),
  positionsIds: z.array(positionIdSchema).min(1).max(4),
});

export const tacticalModuleSchema = z.object({
  id: getSerialIdSchema(),
  name: z.string().length(5),
  layout: z.array(rolePositionSchema).length(4),
});
