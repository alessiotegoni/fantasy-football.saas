"use client";

import { Button } from "@/components/ui/button";
import SplitStatus from "./SplitStatus";
import { Split } from "../queries/split";
import LinkButton from "@/components/LinkButton";
import { NavArrowRight } from "iconoir-react";
import { formatDate } from "@/utils/formatters";

export default function SplitCard({ split }: { split: Split }) {
  return (
    <div className="rounded-3xl border bg-input/30 text-card-foreground shadow-sm w-full">
      <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          {split.name}
        </h3>
        <SplitStatus
          status={split.status}
          onStatusChange={() =>
            new Promise((resolve) => resolve({ error: false, message: "dwd" }))
          }
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
          <Button variant="destructive" className="w-24">
            Elimina
          </Button>
          <LinkButton
            href={`/dashboard/admin/splits/${split.id}`}
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
