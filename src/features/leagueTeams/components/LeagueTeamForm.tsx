"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LeagueTeamSchema, leagueTeamSchema } from "../schema/leagueTeam";
import ImageField from "@/components/ImageField";
import NameField from "@/components/NameField";
import SubmitButton from "@/components/SubmitButton";
import FormFieldTooltip from "@/components/FormFieldTooltip";
import { createLeagueTeam, updateLeagueTeam } from "../actions/leagueTeam";
import { actionToast } from "@/lib/utils";

type Props = {
  leagueId: string;
  teamId?: string;
  initialData?: {
    name: string;
    imageUrl: string | null;
    managerName: string;
  };
};

export function LeagueTeamForm({ leagueId, teamId, initialData }: Props) {
  const form = useForm<LeagueTeamSchema>({
    resolver: zodResolver(leagueTeamSchema),
    defaultValues: initialData ?? {
      name: "",
      managerName: "",
      image: null,
    },
  });

  async function onSubmit(data: LeagueTeamSchema) {
    const action = teamId
      ? updateLeagueTeam.bind(null, teamId)
      : createLeagueTeam;

    const res = await action(leagueId, data);
    actionToast(res, { position: "bottom-right" });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ImageField
          label="Logo della squadra"
          tip="Il logo della squadra e' visibile a tutti i membri della lega"
          image={initialData?.imageUrl}
        />

        <NameField
          label="Nome della squadra"
          tip="Il nome della squadra e' visibile a tutti i membri della lega"
          placeholder="Es. Bari FC"
        />

        <FormFieldTooltip
          label="Nome dell'allenatore"
          tip="Il nome dell'allenatore e' visibile a tutti i membri della lega"
        >
          <FormField
            control={form.control}
            name="managerName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Scorbuschio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormFieldTooltip>

        <SubmitButton loadingText="Creo squadra">
          {teamId ? "Modifica" : "Crea"} squadra
        </SubmitButton>
      </form>
    </Form>
  );
}
