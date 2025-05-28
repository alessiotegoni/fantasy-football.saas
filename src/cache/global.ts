import { getGlobalTag } from "./helpers";

export type GLOBAL_TAG =
  | "leagues"
  | "seasons"
  | "splits"
  | "split-matchdays"
  | "players"
  | "player-roles"
  | "player-votes"
  | "teams"
  | "presidents"
  | "tactical-modules"
  | "bonus-malus";

export const getLeagueGlobalTag = () => getGlobalTag("leagues");
export const getSeasonsTag = () => getGlobalTag("seasons");
export const getSplitsTag = () => getGlobalTag("splits");
export const getSplitsMatchdaysTag = () => getGlobalTag("split-matchdays");
export const getPlayersTag = () => getGlobalTag("players");
export const getPlayerRolesTag = () => getGlobalTag("player-roles");
export const getPlayerVotesTag = () => getGlobalTag("player-votes");
export const getTeamsTag = () => getGlobalTag("teams");
export const getPresidentsTag = () => getGlobalTag("presidents");
export const getTacticalModulesTag = () => getGlobalTag("tactical-modules");
export const getBonusMalusTag = () => getGlobalTag("bonus-malus");
