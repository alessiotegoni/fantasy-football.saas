"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Split } from "../queries/split";

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
    !!splits.length && (
      <Select onValueChange={handleChange} defaultValue={defaultSplitId}>
        <SelectTrigger className="cursor-pointer w-[120px] sm:w-[130px] p-3 px-3.5 sm:p-5 sm:py-3.5">
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
    )
  );
}
