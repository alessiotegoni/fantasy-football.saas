import { FinalPhaseAccess } from "../../admin/calendar/final-phase/utils/calendar";

export function getFinalPhaseColor(phase: keyof FinalPhaseAccess) {
  switch (phase) {
    case "final":
      return "bg-yellow-500";
    case "semifinal":
      return "bg-blue-500";
    case "quarterfinal":
      return "bg-green-500";
    case "playIn":
      return "bg-purple-500";
    case "excluded":
      return "bg-destructive";
    default:
      return "bg-transparent";
  }
}
