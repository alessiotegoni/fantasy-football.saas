"use client";

import LinkButton from "@/components/LinkButton";
import SplitStatus from "./SplitStatus";
import { Plus } from "iconoir-react";
import { Split } from "../queries/split";

export default function SplitDetailRight({ split }: { split: Split }) {
  return (
    <div className="flex items-center space-x-4">
      <SplitStatus
        status={split.status}
        onStatusChange={() =>
          new Promise((resolve) => resolve({ error: false, message: "dwd" }))
        }
      />
      <LinkButton
        href={`/admin/splits/${split.id}/matchdays/create`}
        className="w-fit"
      >
        <Plus className="size-5" />
        Crea giornate
      </LinkButton>
    </div>
  );
}
