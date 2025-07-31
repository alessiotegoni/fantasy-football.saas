"use client";

import { useTransition } from "react";
import {
  BonusMalusSchema,
  CalculationSettingsSchema,
  GeneralSettingsSchema,
  MarketSettingsSchema,
  RosterModulesSchema,
} from "@/features/(league)/settings/schema/setting";
import {
  calculationSettings,
  updateBonusMalusSettings,
  updateGeneralSettings,
  updateMarketSettings,
  updateRosterModuleSettings,
} from "@/features/(league)/settings/actions/setting";
import useActionToast from "./useActionToast";

export function useLeagueSettings(leagueId: string) {
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

  const saveGeneralSettings = async (data: GeneralSettingsSchema) => {
    return wrapAction(updateGeneralSettings, data);
  };

  const saveRosterModuleSettings = async (data: RosterModulesSchema) => {
    return wrapAction(updateRosterModuleSettings, data);
  };

  const saveCalculationsSettings = async (data: CalculationSettingsSchema) => {
    return wrapAction(calculationSettings, data);
  };

  const saveBonusMalusSettings = async (data: BonusMalusSchema) => {
    return wrapAction(updateBonusMalusSettings, data);
  };

  const saveMarketSettings = async (data: MarketSettingsSchema) => {
    return wrapAction(updateMarketSettings, data);
  };

  return {
    saveGeneralSettings,
    saveRosterModuleSettings,
    saveBonusMalusSettings,
    saveCalculationsSettings,
    saveMarketSettings,
    loading,
  };
}
