import ActionButton from "@/components/ActionButton";
import EmptyState from "@/components/EmptyState";
import { generateCalendar } from "../actions/calendar";

export default function CalendarEmptyState({ leagueId }: { leagueId: string }) {
  return (
    <EmptyState
      title="Nessun calendario trovato"
      description="Non hai ancora generato un calendario abbinamenti, fallo cliccando sul bottone qui sotto"
      renderButton={() => (
        <ActionButton
          className="w-fit mt-7 !px-5"
          loadingText="Genero calendario"
          action={generateCalendar.bind(null, leagueId)}
        >
          Genera calendario
        </ActionButton>
      )}
    />
  );
}
