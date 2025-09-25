import { Calculator } from "iconoir-react";
import CalculateMatchdayButton from "./CalculateMatchdayButton";
import { SplitMatchday } from "@/features/dashboard/admin/splits/queries/split";
import { Banner } from "@/components/banner";

export default function CalculateMatchdayBanner({
  matchday,
  showBanner,
}: {
  matchday: SplitMatchday;
  showBanner: boolean;
}) {
  if (!showBanner) return null;

  return (
    <Banner
      title={`Giornata ${matchday.number}`}
      description="Calcola subito la giornata e vedi la classifica aggiornata!"
      icon={<Calculator className="size-8 text-muted-foreground" />}
      className="mb-4 md:mb-8"
    >
      <CalculateMatchdayButton
        matchdayId={matchday.id}
        variant="gradient"
        className="w-30 rounded-2xl"
      >
        Calcola
      </CalculateMatchdayButton>
    </Banner>
  );
}
