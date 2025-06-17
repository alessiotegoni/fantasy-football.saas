"use client";

import { FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldValues, Path, useFormContext } from "react-hook-form";

type Props<T> = {
  name: Path<T>
  teams: {
    id: string | number;
    name: string;
  }[];
  onSelect?: (teamId: string) => void;
};

export default function TeamsSelectField<T extends FieldValues>({ name, teams, onSelect }: Props<T>) {
  const form = useFormContext<T>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onSelect?.(value);
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona una squadra" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id.toString()}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
