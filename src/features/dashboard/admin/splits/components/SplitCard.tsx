import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { Split } from "../queries/split";
import LinkButton from "@/components/LinkButton";
import { NavArrowRight } from "iconoir-react";

export default function SplitCard({ split }: { split: Split }) {
  const formatter = new Intl.DateTimeFormat("it-IT", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const startDate = formatter.format(new Date(split.startDate));
  const endDate = formatter.format(new Date(split.endDate));

  return (
    <div className="rounded-3xl border bg-input/30 text-card-foreground shadow-sm w-full">
      {" "}
      {/* Mimics Card */}
      <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
        {" "}
        {/* Mimics CardHeader */}
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          {split.name}
        </h3>{" "}
        {/* Mimics CardTitle */}
        <StatusBadge status={split.status} />
      </div>
      <div className="p-6 pt-0">
        {" "}
        {/* Mimics CardContent */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground space-y-2">
          {startDate}
          <span>•</span>
          {endDate}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="destructive" className="w-24">
            Elimina
          </Button>
          <LinkButton href={`/admin/splits/${split.id}`} className="w-24">
            Vedi
            <NavArrowRight className="size-5" />
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
