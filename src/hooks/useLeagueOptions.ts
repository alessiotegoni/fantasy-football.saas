"use client";

import { useTransition } from "react";
import {
  BonusMalusSchema,
  GeneralOptionsSchema,
  MarketOptionsSchema,
  RosterModulesSchema,
} from "@/features/(league)/options/schema/leagueOptions";
import {
  updateBonusMalusOptions,
  updateGeneralOptions,
  updateMarketOptions,
  updateRosterModuleOptions,
} from "@/features/(league)/options/actions/leagueOptions";
import useActionToast from "./useActionToast";

export function useLeagueOptions(leagueId: string) {
  const toast = useActionToast();

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
      toast(res);
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

  const saveMarketOptions = async (data: MarketOptionsSchema) => {
    return wrapAction(updateMarketOptions, data);
  };

  return {
    saveGeneralOptions,
    saveRosterModuleOptions,
    saveBonusMalusOptions,
    saveMarketOptions,
    loading,
  };
}
