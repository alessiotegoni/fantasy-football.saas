"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LeagueTeamSchema, leagueTeamSchema } from "../schema/leagueTeam";
import ImageField from "@/components/ImageField";
import NameField from "@/components/NameField";
import SubmitButton from "@/components/SubmitButton";
import FormFieldTooltip from "@/components/FormFieldTooltip";
import { createLeagueTeam, updateLeagueTeams } from "../actions/leagueTeam";
import { useRouter, useSearchParams } from "next/navigation";
import useActionToast from "@/hooks/useActionToast";
import MobileButtonsContainer from "@/components/MobileButtonsContainer";
import { Href } from "@/utils/helpers";

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
      ? updateLeagueTeams.bind(null, teamId)
      : createLeagueTeam;

    const res = await action(leagueId, data);
    actionToast(res);

    if (!res.error) {
      const redirectUrl = searchParams.get("redirectUrl");
      router.push((redirectUrl || `/leagues/${leagueId}`) as Href);
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

        <MobileButtonsContainer className="!w-full">
          <SubmitButton
            loadingText={(teamId ? "Modifico" : "Creo") + " squadra"}
          >
            {teamId ? "Modifica" : "Crea"} squadra
          </SubmitButton>
        </MobileButtonsContainer>
      </form>
    </Form>
  );
}
