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
import { useRouter } from "next/navigation";

export default function SplitSelect({
  splits,
  defaultSplit,
}: {
  splits: Split[];
  defaultSplit?: Split;
}) {
  const router = useRouter();

  const defaultSplitId = defaultSplit?.id.toString();

  function handleChange(splitId: string) {
    if (defaultSplitId === splitId) return;

    router.replace(`?splitId=${splitId}`);
  }

  return (
    <Select onValueChange={handleChange} defaultValue={defaultSplitId}>
      <SelectTrigger className="w-[140px]">
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
