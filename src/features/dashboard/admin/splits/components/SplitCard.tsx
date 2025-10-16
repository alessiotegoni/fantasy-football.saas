"use client";

import SplitStatus from "./SplitStatus";
import { Split } from "../queries/split";
import LinkButton from "@/components/LinkButton";
import { NavArrowRight } from "iconoir-react";
import { formatDate } from "@/utils/formatters";
import ActionButton from "@/components/ActionButton";
import { deleteSplit, updateSplit } from "../actions/split";
import useHandleSubmit from "@/hooks/useHandleSubmit";
import { SplitStatusType } from "@/drizzle/schema";
import { Href } from "@/utils/helpers";

export default function SplitCard({ split }: { split: Split }) {
  const { isPending, onSubmit } = useHandleSubmit(
    updateSplit.bind(null, split.id)
  );

  async function handleUpdateSplit(status: SplitStatusType) {
    const newSplit = {
      ...split,
      startDate: new Date(split.startDate),
      endDate: new Date(split.endDate),
    };
    onSubmit({ ...newSplit, status });
  }

  return (
    <div className="rounded-3xl border bg-input/30 text-card-foreground shadow-sm w-full">
      <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          {split.name}
        </h3>

        <SplitStatus
          status={split.status}
          onStatusChange={handleUpdateSplit}
          isPending={isPending}
          canUpdate
        />
      </div>
      <div className="p-6 pt-0">
        <div className="flex items-center gap-3 text-sm text-muted-foreground space-y-2">
          {formatDate(split.startDate)}
          <span>•</span>
          {formatDate(split.endDate)}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <ActionButton
            loadingText="Elimino"
            variant="destructive"
            className="min-w-24 max-w-fit"
            action={deleteSplit.bind(null, split.id)}
            requireAreYouSure
          >
            Elimina
          </ActionButton>
          <LinkButton
            href={`/dashboard/admin/splits/${split.id}` as Href}
            className="w-24"
          >
            Vedi
            <NavArrowRight className="size-5" />
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
