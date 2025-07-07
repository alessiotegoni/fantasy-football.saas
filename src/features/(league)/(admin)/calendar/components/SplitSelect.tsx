"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Split } from "@/features/splits/queries/split";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";

export default function SplitSelect({
  splitsPromise,
}: {
  splitsPromise: Promise<Split[]>;
}) {
  const splits = use(splitsPromise);

  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSplitId = searchParams.get("splitId");

  function handleChange(splitId: string) {
    if (currentSplitId === splitId) return;

    router.replace(`?splitId=${splitId}`);
  }

  return (
    <Select
      onValueChange={handleChange}
      defaultValue={currentSplitId ?? undefined}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Seleziona split" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {splits.map((split) => (
            <SelectItem key={split.id} value={split.id.toString()}>
              {split.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
