import { StandingData } from "@/features/(league)/standing/queries/standing";

export type FinalPhaseAccess = {
  final: string[];
  semifinal: string[];
  quarterfinal: string[];
  playIn: [string, string][];
  excluded: string[];
};

export function getFinalPhaseAccess(teams: StandingData[]): FinalPhaseAccess {
  const ids = teams.map((t) => t.team.id);
  const length = ids.length;

  const result: FinalPhaseAccess = {
    final: [],
    semifinal: [],
    quarterfinal: [],
    playIn: [],
    excluded: [],
  };

  switch (length) {
    case 4:
      result.final.push(ids[0]);
      result.semifinal.push(ids[1]);
      result.quarterfinal.push(ids[2], ids[3]);
      break;

    case 5:
      result.final.push(ids[0]);
      result.semifinal.push(ids[1]);
      result.quarterfinal.push(ids[2]);
      result.playIn.push([ids[3], ids[4]]);
      break;

    case 6:
      result.final.push(ids[0]);
      result.semifinal.push(ids[1]);
      result.quarterfinal.push(ids[2]);
      result.playIn.push([ids[3], ids[4]]);
      result.excluded.push(ids[5]);
      break;

    case 7:
      result.final.push(ids[0]);
      result.semifinal.push(ids[1]);
      result.quarterfinal.push(ids[2]);
      result.playIn.push([ids[3], ids[4]]);
      result.excluded.push(ids[5], ids[6]);
      break;

    case 8:
      result.semifinal.push(ids[0]);
      result.quarterfinal.push(ids[1], ids[2], ids[3], ids[4], ids[5]);
      result.playIn.push([ids[6], ids[7]]);
      break;

    case 9:
      result.semifinal.push(ids[0]);
      result.quarterfinal.push(ids[1], ids[2], ids[3], ids[4], ids[5]);
      result.playIn.push([ids[6], ids[7]]);
      result.excluded.push(ids[8]);
      break;

    case 10:
      result.semifinal.push(ids[0]);
      result.quarterfinal.push(ids[1], ids[2], ids[3], ids[4], ids[5]);
      result.playIn.push([ids[6], ids[7]]);
      result.excluded.push(ids[8], ids[9]);
      break;

    case 11:
      result.semifinal.push(ids[0]);
      result.quarterfinal.push(ids[1], ids[2], ids[3], ids[4], ids[5]);
      result.playIn.push([ids[6], ids[7]]);
      result.excluded.push(ids[8], ids[9], ids[10]);
      break;

    case 12:
      result.semifinal.push(ids[0]);
      result.quarterfinal.push(ids[1], ids[2], ids[3], ids[4], ids[5]);
      result.playIn.push([ids[6], ids[7]]);
      result.excluded.push(ids[8], ids[9], ids[10], ids[11]);
      break;
  }

  return result;
}
