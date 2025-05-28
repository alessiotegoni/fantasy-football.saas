"use client";

import { useState, useTransition } from "react";
import { actionToast } from "@/lib/utils";
import {
  BonusMalusSchema,
  GeneralOptionsSchema,
  RosterModulesSchema,
} from "@/features/leagueOptions/schema/leagueOptions";
import {
  updateBonusMalusOptions,
  updateGeneralOptions,
  updateRosterModuleOptions,
} from "@/features/leagueOptions/actions/leagueOptions";

export function useLeagueOptions(leagueId: string) {
  const [loading, startTransition] = useTransition();

  function wrapAction<T>(
    fn: (
      data: T,
      leagueId: string
    ) => Promise<{ error: boolean; message: string }>,
    data: T
  ) {
    startTransition(async () => {
      const res = await fn(data, leagueId);
      actionToast(res);
    });
  }

  const saveGeneralOptions = async (data: GeneralOptionsSchema) => {
    return wrapAction(updateGeneralOptions, data);
  };

  const saveRosterModuleOptions = async (data: RosterModulesSchema) => {
    return wrapAction(updateRosterModuleOptions, data);
  };

  const saveBonusMalusOptions = async (data: BonusMalusSchema) => {
    return wrapAction(updateBonusMalusOptions, data);
  };

  return {
    saveGeneralOptions,
    saveRosterModuleOptions,
    saveBonusMalusOptions,
    loading,
  };
}
