"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UseFieldArrayRemove } from "react-hook-form";
import SplitMatchdayFormFields from "./SplitMatchdayFormFields";

type Props = {
  index: number;
  remove: UseFieldArrayRemove;
  isLast: boolean;
};

export default function MatchdayFields({ index, remove, isLast }: Props) {
  return (
    <div className="space-y-6">
      <SplitMatchdayFormFields namePrefix={`matchdays.${index}`} />
      <div className="flex justify-end">
        <Button
          variant="destructive"
          onClick={() => remove(index)}
          className="sm:w-fit"
          type="button"
        >
          Rimuovi
        </Button>
      </div>
      {!isLast && <Separator />}
    </div>
  );
}
