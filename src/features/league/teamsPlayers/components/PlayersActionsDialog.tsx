"use client";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PlayersActionsForm from "./PlayersActionsForm";
import { ZodSchema } from "zod";
import { DefaultValues, FieldValues } from "react-hook-form";
import PlayerCard from "./PlayerCard";
import { usePlayerSelection } from "@/contexts/PlayerSelectionProvider";

type Props<T> = {
  title: string;
  description: string;
  formSchema: ZodSchema<T>;
  formDefaultValues: DefaultValues<T>;
  renderFormFields: (
    pl: ReturnType<typeof usePlayerSelection>
  ) => React.ReactNode;
  renderSubmitButton: (
    pl: ReturnType<typeof usePlayerSelection>
  ) => React.ReactNode;
  onFormSubmit: (values: T) => Promise<{ error: boolean; message: string }>;
};

export default function PlayersActionsDialog<T extends FieldValues>({
  title,
  description,
  formSchema,
  formDefaultValues,
  renderFormFields,
  renderSubmitButton,
  onFormSubmit,
}: Props<T>) {
  const pl = usePlayerSelection();

  return (
    <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      {pl.selectedPlayer && (
        <PlayerCard {...pl.selectedPlayer} showSelectButton={false} />
      )}
      <PlayersActionsForm
        schema={formSchema}
        defaultValues={formDefaultValues}
        submitFn={onFormSubmit}
      >
        {renderFormFields(pl)}
        <DialogFooter className="*:p-2.5 *:px-4 *:rounded-xl">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-fit">
              Chiudi
            </Button>
          </DialogClose>
          {renderSubmitButton(pl)}
        </DialogFooter>
      </PlayersActionsForm>
    </DialogContent>
  );
}
