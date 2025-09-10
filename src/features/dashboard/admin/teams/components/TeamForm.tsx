"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  teamSchema,
  TeamSchema,
} from "@/features/dashboard/admin/teams/schema/team";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";
import useHandleSubmit from "@/hooks/useHandleSubmit";
import { createTeam, updateTeam } from "@/features/dashboard/admin/teams/actions/team";
import { Team } from "@/features/dashboard/admin/teams/queries/team";

type Props = {
  team?: Team;
};

export default function TeamForm({ team }: Props) {
  const form = useForm<TeamSchema>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: team?.name || "",
      displayName: team?.displayName || "",
    },
  });

  const { isPending, onSubmit } = useHandleSubmit(
    team ? updateTeam.bind(null, team.id) : createTeam,
    {
      isLeaguePrefix: false,
      redirectTo: "/dashboard/admin/teams",
    }
  );

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="Nome visualizzato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton isLoading={isPending}>
          {team ? "Aggiorna team" : "Crea team"}
        </SubmitButton>
      </form>
    </Form>
  );
}
