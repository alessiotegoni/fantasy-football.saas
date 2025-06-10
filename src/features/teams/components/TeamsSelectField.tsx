"use client";

import { FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

type Props = {
  teams: {
    id: string | number;
    name: string;
  }[];
  onSelect?: (teamId: string) => void;
};

export default function TeamsSelectField({ teams, onSelect }: Props) {
  const form = useFormContext<{ memberTeamId: string }>();

  return (
    <FormField
      control={form.control}
      name="memberTeamId"
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
