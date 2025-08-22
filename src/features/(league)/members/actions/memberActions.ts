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
import { createError, createSuccess } from "@/utils/helpers";
import { validateSchema } from "@/schema/helpers";
import {
  banMemberSchema,
  BanMemberSchema,
  memberActionSchema,
  MemberActionSchema,
  setMemberRoleSchema,
  SetRoleMemberSchema,
  unBanMemberSchema,
  UnBanMemberSchema,
} from "../schema/leagueMember";

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

export async function setMemberRole(values: SetRoleMemberSchema) {
  const { isValid, error, data } = validateSchema<SetRoleMemberSchema>(
    setMemberRoleSchema,
    values,
    MEMBER_ACTION_MESSAGES.SET_ROLE_ERROR
  );
  if (!isValid) return error;

  if (!(await canPerformMemberAction(data))) {
    return createError(MEMBER_ACTION_MESSAGES.SET_ROLE_OWNER_ERROR);
  }

  await updateLeagueMember(data.memberId, { role: data.role });

  return createSuccess(MEMBER_ACTION_MESSAGES.SET_ROLE_SUCCESS, null);
}

export async function kickMember(values: MemberActionSchema) {
  const { isValid, error, data } = validateSchema<MemberActionSchema>(
    memberActionSchema,
    values,
    MEMBER_ACTION_MESSAGES.KICK_ERROR
  );
  if (!isValid) return error;

  if (!(await canPerformMemberAction(data))) {
    return createError(MEMBER_ACTION_MESSAGES.KICK_OWNER_ERROR);
  }

  await Promise.all([
    deleteLeagueMember(data.memberId),
    removeUserLeagueMetadata(data),
  ]);

  return createSuccess(MEMBER_ACTION_MESSAGES.KICK_SUCCESS, null);
}

export async function banMember(values: BanMemberSchema) {
  const { isValid, error, data } = validateSchema<BanMemberSchema>(
    banMemberSchema,
    values,
    MEMBER_ACTION_MESSAGES.BAN_ERROR
  );
  if (!isValid) return error;

  if (!(await canPerformMemberAction(data))) {
    return createError(MEMBER_ACTION_MESSAGES.BAN_OWNER_ERROR);
  }

  await db.transaction(async (tx) => {
    await Promise.all([
      deleteLeagueMember(data.memberId, tx),
      insertLeagueBan(data, tx),
      removeUserLeagueMetadata(data),
    ]);
  });

  return createSuccess(MEMBER_ACTION_MESSAGES.BAN_SUCCESS, null);
}

export async function unBanMember(values: UnBanMemberSchema) {
  const { isValid, error, data } = validateSchema<UnBanMemberSchema>(
    unBanMemberSchema,
    values,
    MEMBER_ACTION_MESSAGES.UNBAN_ERROR
  );
  if (!isValid) return error;

  if (!(await canPerformMemberAction(data))) {
    return createError(MEMBER_ACTION_MESSAGES.UNBAN_OWNER_ERROR);
  }

  await deleteLeagueBan(data.banId);

  return createSuccess(MEMBER_ACTION_MESSAGES.UNBAN_SUCCESS, null);
}
