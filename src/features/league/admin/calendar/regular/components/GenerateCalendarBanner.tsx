import { CalendarPlus } from "iconoir-react";
import { Banner } from "@/components/banner";
import ActionButton from "@/components/ActionButton";
import { generateCalendar } from "../actions/calendar";

export default function GenerateCalendarBanner({ leagueId }: { leagueId: string }) {
  return (
    <Banner
      title="Genera il calendario"
      description="Clicca il bottone per generare il calendario abbinamenti"
      icon={<CalendarPlus className="size-8 text-muted-foreground" />}
      className="mb-4 md:mb-8"
    >
      <ActionButton
        className="w-fit !px-5 min-w-36 md:min-w-fit"
        loadingText="Genero"
        action={generateCalendar.bind(null, leagueId)}
      >
        Genera
      </ActionButton>
    </Banner>
  );
}
