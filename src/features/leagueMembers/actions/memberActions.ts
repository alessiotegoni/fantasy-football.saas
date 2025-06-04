"use server";

import {
  deleteLeagueMember,
  getError,
  updateLeagueMember,
} from "../db/leagueMember";
import { db } from "@/drizzle/db";
import { leagueMemberRoles, LeagueMemberRoleType } from "@/drizzle/schema";
import { deleteLeagueBan, insertLeagueBan } from "@/features/leagues/db/league";
import { canPerformMemberAction } from "../permissions/leagueMember";
import { removeUserLeagueMetadata } from "@/features/users/utils/user";

export type MemberActionArgs = {
  memberId: string;
  userId: string;
  leagueId: string;
};

export async function setMemberRole(
  args: MemberActionArgs & { role: LeagueMemberRoleType }
) {
  if (!validateMemberAction(args) || !leagueMemberRoles.includes(args.role)) {
    return getError("Impossibile settare il ruolo al membro");
  }

  if (!(await canPerformMemberAction(args))) {
    return getError("Non puoi cambiare ruolo al creatore della lega");
  }

  await updateLeagueMember(args.memberId, { role: args.role });

  return { error: false, message: "Ruolo aggiornato con successo" };
}

export async function kickMember(args: MemberActionArgs) {
  if (!validateMemberAction(args))
    return getError("Impossibile espellere l'utente");

  if (!(await canPerformMemberAction(args))) {
    return getError("Non puoi espellere il creatore della lega");
  }

  await Promise.all([
    deleteLeagueMember(args.memberId),
    removeUserLeagueMetadata(args),
  ]);

  return { error: false, message: "Membro espulso con successo" };
}

export async function banMember(args: MemberActionArgs & { reason?: string }) {
  if (!validateMemberAction(args))
    return getError("Impossibile bannare l'utente");

  if (!(await canPerformMemberAction(args))) {
    return getError("Non puoi bannare il creatore della lega");
  }

  await db.transaction(async (tx) => {
    return await Promise.all([
      deleteLeagueMember(args.memberId, tx),
      insertLeagueBan(args, tx),
      removeUserLeagueMetadata(args),
    ]);
  });

  return { error: false, message: "Membro bannato con successo" };
}

export async function unBanMember(
  args: Omit<MemberActionArgs, "memberId"> & { banId: string }
) {
  if (!validateMemberAction(args))
    return getError("Impossibile sbannare l'utente");

  if (!(await canPerformMemberAction(args))) {
    return getError("Non puoi sbannare il creatore della lega");
  }

  await deleteLeagueBan(args.banId);

  return { error: false, message: "Membro sbannato con successo" };
}

function validateMemberAction<T extends object>(args: T) {
  return Object.values(args).every((arg) => typeof arg === "string");
}
