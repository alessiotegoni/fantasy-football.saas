"use client";

import { useTransition } from "react";
import { actionToast } from "@/lib/utils";
import {
  BonusMalusSchema,
  GeneralOptionsSchema,
  MarketOptionsSchema,
  RosterModulesSchema,
} from "@/features/leagueOptions/schema/leagueOptions";
import {
  updateBonusMalusOptions,
  updateGeneralOptions,
  updateMarketOptions,
  updateRosterModuleOptions,
} from "@/features/leagueOptions/actions/leagueOptions";
import { useIsMobile } from "./useMobile";

export function useLeagueOptions(leagueId: string) {
  const isMobile = useIsMobile();

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
      actionToast(res, { position: isMobile ? "top-center" : "top-right" });
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
