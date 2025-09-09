import { Button } from "@/components/ui/button";
import { default as SplitMatchdayStatus } from "./SplitStatus";
import { SplitMatchday } from "../queries/split";
import { formatDate } from "@/utils/formatters";
import LinkButton from "@/components/LinkButton";
import { NavArrowRight } from "iconoir-react";

export function SplitMatchdayCard({ matchday }: { matchday: SplitMatchday }) {
  return (
    <div className="rounded-3xl border bg-muted/30 text-card-foreground shadow-sm w-full">
      {" "}
      {/* Mimics Card, changed to rounded-lg */}
      <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
        {" "}
        {/* Mimics CardHeader */}
        <h3 className="text-xl font-semibold leading-none tracking-tight">
          Giornata {matchday.number}
        </h3>{" "}
        {/* Mimics CardTitle */}
        {/* <SplitMatchdayStatus status={matchday.status} /> */}
      </div>
      <div className="p-6 pt-0">
        {" "}
        {/* Mimics CardContent */}
        <div className="text-sm text-muted-foreground">
          <p>Type: {matchday.type}</p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground space-y-2">
            {formatDate(matchday.startAt)}
            <span>•</span>
            {formatDate(matchday.endAt)}
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="destructive" className="w-24">
            Elimina
          </Button>
          <LinkButton
            className="w-36"
            href={`/admin/splits/${matchday.splitId}/matchdays/${matchday.id}/edit`}
          >
            Modifica
            <NavArrowRight className="size-5" />
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
