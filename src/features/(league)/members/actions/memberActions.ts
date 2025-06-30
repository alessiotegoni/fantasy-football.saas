"use server";

import { deleteLeagueMember, updateLeagueMember } from "../db/leagueMember";
import { db } from "@/drizzle/db";
import { leagueMemberRoles, LeagueMemberRoleType } from "@/drizzle/schema";
import {
  deleteLeagueBan,
  insertLeagueBan,
} from "@/features/(league)/leagues/db/league";
import { canPerformMemberAction } from "../permissions/leagueMember";
import { removeUserLeagueMetadata } from "@/features/users/utils/user";

enum MEMBER_ACTION_MESSAGES {
  SET_ROLE_ERROR = "Impossibile settare il ruolo al membro",
  SET_ROLE_OWNER_ERROR = "Non puoi cambiare ruolo al creatore della lega",
  KICK_ERROR = "Impossibile espellere l'utente",
  KICK_OWNER_ERROR = "Non puoi espellere il creatore della lega",
  BAN_ERROR = "Impossibile bannare l'utente",
  BAN_OWNER_ERROR = "Non puoi bannare il creatore della lega",
  UNBAN_ERROR = "Impossibile sbannare l'utente",
  UNBAN_OWNER_ERROR = "Non puoi sbannare il creatore della lega",

  SET_ROLE_SUCCESS = "Ruolo aggiornato con successo",
  KICK_SUCCESS = "Membro espulso con successo",
  BAN_SUCCESS = "Membro bannato con successo",
  UNBAN_SUCCESS = "Membro sbannato con successo",
}



export async function setMemberRole(
  args: MemberActionArgs & { role: LeagueMemberRoleType }
) {
  const validation = validateSchema<typeof args>(
    MemberActionSchema.extend({ role: z.string() }),
    args,
    MEMBER_ACTION_MESSAGES.SET_ROLE
  );
  if (!validation.isValid) return validation.error;

  if (!leagueMemberRoles.includes(args.role)) {
    return createError(MEMBER_ACTION_MESSAGES.SET_ROLE);
  }

  if (!(await canPerformMemberAction(args))) {
    return createError(MEMBER_ACTION_MESSAGES.SET_ROLE_OWNER);
  }

  await updateLeagueMember(args.memberId, { role: args.role });

  return createSuccess(MEMBER_ACTION_MESSAGES.SET_ROLE, {});
}

export async function kickMember(args: MemberActionArgs) {
  const validation = validateSchema(MemberActionSchema, args, MEMBER_ACTION_MESSAGES.KICK);
  if (!validation.isValid) return validation.error;

  if (!(await canPerformMemberAction(args))) {
    return createError(MEMBER_ACTION_MESSAGES.KICK_OWNER);
  }

  await Promise.all([
    deleteLeagueMember(args.memberId),
    removeUserLeagueMetadata(args),
  ]);

  return createSuccess(MEMBER_ACTION_MESSAGES.KICK, {});
}

export async function banMember(
  args: MemberActionArgs & { reason?: string }
) {
  const validation = validateSchema(MemberActionSchema, args, MEMBER_ACTION_MESSAGES.BAN);
  if (!validation.isValid) return validation.error;

  if (!(await canPerformMemberAction(args))) {
    return createError(MEMBER_ACTION_MESSAGES.BAN_OWNER);
  }

  await db.transaction(async (tx) => {
    await Promise.all([
      deleteLeagueMember(args.memberId, tx),
      insertLeagueBan(args, tx),
      removeUserLeagueMetadata(args),
    ]);
  });

  return createSuccess(MEMBER_ACTION_MESSAGES.BAN, {});
}

export async function unBanMember(
  args: Omit<MemberActionArgs, "memberId"> & { banId: string }
) {
  const validation = validateSchema(
    MemberActionSchema.omit({ memberId: true }).extend({
      banId: z.string().uuid("ID ban non valido"),
    }),
    args,
    MEMBER_ACTION_MESSAGES.UNBAN
  );
  if (!validation.isValid) return validation.error;

  if (!(await canPerformMemberAction(args))) {
    return createError(MEMBER_ACTION_MESSAGES.UNBAN_OWNER);
  }

  await deleteLeagueBan(args.banId);

  return createSuccess(MEMBER_ACTION_MESSAGES.UNBAN, {});
}
