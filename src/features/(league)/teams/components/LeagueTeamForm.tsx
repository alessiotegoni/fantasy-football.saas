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
import { useRouter, useSearchParams } from "next/navigation";
import useActionToast from "@/hooks/useActionToast";

type Props = {
  leagueId: string;
  teamId?: string;
  initialData?: {
    name: string;
    imageUrl: string | null;
    managerName: string;
    image: null;
  };
};

export function LeagueTeamForm({ leagueId, teamId, initialData }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const actionToast = useActionToast();

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
    actionToast(res);

    if (!res.error) {
      const redirectUrl = searchParams.get("redirectUrl");
      router.push(redirectUrl || `/leagues/${leagueId}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ImageField
          label="Logo della squadra"
          tip="Il logo della squadra è visibile a tutti i membri della lega"
          image={initialData?.imageUrl}
        />

        <NameField
          label="Nome della squadra"
          tip="Il nome della squadra è visibile a tutti i membri della lega"
          placeholder="Es. Bari FC"
        />

        <FormFieldTooltip
          label="Nome dell'allenatore"
          tip="Il nome dell'allenatore è visibile a tutti i membri della lega"
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

        <SubmitButton loadingText={(teamId ? "Modifico" : "Creo") + " squadra"}>
          {teamId ? "Modifica" : "Crea"} squadra
        </SubmitButton>
      </form>
    </Form>
  );
}
