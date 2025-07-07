import ActionButton from "@/components/ActionButton";
import EmptyState from "@/components/EmptyState";
import { generateCalendar } from "../actions/calendar";
import { ComponentPropsWithoutRef } from "react";

type Props = {
  leagueId: string;
  showButton?: boolean;
} & Partial<ComponentPropsWithoutRef<typeof EmptyState>>;

export default function CalendarEmptyState({
  leagueId,
  description = "Non hai ancora generato un calendario abbinamenti, fallo cliccando sul bottone qui sotto",
  showButton = true,
  ...props
}: Props) {
  return (
    <EmptyState
      title="Nessun calendario trovato"
      description={description}
      renderButton={() =>
        showButton && (
          <ActionButton
            className="w-fit mt-7 !px-5"
            loadingText="Genero calendario"
            action={generateCalendar.bind(null, leagueId)}
          >
            Genera calendario
          </ActionButton>
        )
      }
      {...props}
    />
  );
}
