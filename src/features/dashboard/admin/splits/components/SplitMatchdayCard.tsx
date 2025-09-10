"use client";

import { Button } from "@/components/ui/button";
import { default as SplitMatchdayStatus } from "./SplitStatus";
import { SplitMatchday } from "../queries/split";
import { formatDate } from "@/utils/formatters";
import LinkButton from "@/components/LinkButton";
import { NavArrowRight } from "iconoir-react";
import { SplitStatusType } from "@/drizzle/schema";
import useHandleSubmit from "@/hooks/useHandleSubmit";

export function SplitMatchdayCard({ matchday }: { matchday: SplitMatchday }) {
  const { isPending, onSubmit } = useHandleSubmit(
    updateMatchday.bind(null, matchday.id)
  );

  async function handleUpdateMatchday(status: SplitStatusType) {
    onSubmit({ ...matchday, status });
  }

  return (
    <div className="rounded-3xl border bg-muted/30 text-card-foreground shadow-sm w-full">
      <div className="flex items-center justify-between p-6 pb-2">
        <h3 className="text-xl font-semibold leading-none tracking-tight">
          Giornata {matchday.number}
        </h3>
        <SplitMatchdayStatus
          status={matchday.status}
          isPending={isPending}
          onStatusChange={handleUpdateMatchday}
          canUpdate
        />
      </div>
      <div className="p-6 pt-0">
        <div className="flex items-center gap-3 text-sm text-muted-foreground space-y-2">
          {formatDate(matchday.startAt, { hour: "numeric", minute: "numeric" })}
          <span>•</span>
          {formatDate(matchday.endAt, { hour: "numeric", minute: "numeric" })}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="destructive" className="w-24">
            Elimina
          </Button>
          <LinkButton
            className="w-36"
            href={`/dashboard/admin/splits/${matchday.splitId}/matchdays/${matchday.id}/edit`}
          >
            Modifica
            <NavArrowRight className="size-5" />
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
