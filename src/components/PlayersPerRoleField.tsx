"use client";

import { playerRoles, PlayersPerRole } from "@/drizzle/schema";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import FormFieldTooltip from "./FormFieldTooltip";
import NumberInput from "./ui/number-input";

export default function PlayersPerRoleField({
  playersRoles,
}: {
  playersRoles: (typeof playerRoles.$inferSelect)[];
}) {
  const form = useFormContext<{ playersPerRole: PlayersPerRole }>();

  return (
    <div className="space-y-4">
      <FormFieldTooltip
        label="Giocatori per ruolo"
        tip="Numero di giocatori che ogni squadra può avere per ruolo"
      >
        <div className="flex flex-wrap gap-7 sm:gap-0">
          {playersRoles.map((role) => (
            <FormField
              key={role.id}
              control={form.control}
              name={`playersPerRole.${role.id}`}
              render={({ field }) => (
                <FormItem className="basis-1/4">
                  <FormLabel className="text-sm">{role.name}</FormLabel>
                  <FormControl>
                    <NumberInput
                      value={field.value}
                      onChange={field.onChange}
                      min={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </FormFieldTooltip>
    </div>
  );
}
