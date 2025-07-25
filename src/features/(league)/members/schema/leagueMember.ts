import { leagueMemberRoles } from "@/drizzle/schema";
import { getUUIdSchema } from "@/schema/helpers";
import { z } from "zod";

export const memberActionSchema = z.object({
  memberId: getUUIdSchema("ID membro non valido"),
  userId: getUUIdSchema("ID utente non valido"),
  leagueId: getUUIdSchema("ID lega non valido"),
});

export const setMemberRoleSchema = memberActionSchema.extend({
  role: z.enum(leagueMemberRoles, { message: "Ruolo invalido" }),
});

export const banMemberSchema = memberActionSchema.extend({
  reason: z
    .string()
    .min(10, "La ragione del ban deve essere superiore ai 10 caratteri")
    .max(200, "La ragione del ban non deve essere superiore ai 200 caratteri")
    .nullable(),
});

export const unBanMemberSchema = memberActionSchema
  .omit({ memberId: true })
  .extend({
    banId: getUUIdSchema("ID ban non valido"),
  });

export type MemberActionSchema = z.infer<typeof memberActionSchema>;

export type SetRoleMemberSchema = z.infer<typeof setMemberRoleSchema>;
export type BanMemberSchema = z.infer<typeof banMemberSchema>;
export type UnBanMemberSchema = z.infer<typeof unBanMemberSchema>;
