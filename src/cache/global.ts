import { getGlobalTag } from "./helpers";

export type GLOBAL_TAG =
  | "leagues"
  | "splits"
  | "splits-matchdays"
  | "player-roles"
  | "player-votes"
  | "players"
  | "teams"
  | "tactical-modules"
  | "bonus-malus";

export const getLeagueGlobalTag = () => getGlobalTag("leagues");
export const getSplitsTag = () => getGlobalTag("splits");
export const getSplitsMatchdaysTag = () => getGlobalTag("splits-matchdays");
export const getPlayerRolesTag = () => getGlobalTag("player-roles");
export const getPlayerVotesTag = () => getGlobalTag("player-votes");
export const getPlayersTag = () => getGlobalTag("players");
export const getTeamsTag = () => getGlobalTag("teams");
export const getTacticalModulesTag = () => getGlobalTag("tactical-modules");
export const getBonusMalusTag = () => getGlobalTag("bonus-malus");
