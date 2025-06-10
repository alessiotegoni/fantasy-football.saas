"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import LeagueTypeField from "./fields/LeagueTypeField";
import PasswordField from "./fields/PasswordField";
import SubmitButton from "@/components/SubmitButton";
import { updateLeagueProfile } from "../../actions/league";
import LeagueNameField from "../../../../../components/NameField";
import LeagueDescriptionField from "./fields/LeagueDescriptionField";
import LeagueImageField from "../../../../../components/ImageField";
import {
  leagueProfileSchema,
  LeagueProfileSchema,
} from "../../schema/leagueProfile";
import useActionToast from "@/hooks/useActionToast";

export function LeagueProfileForm({
  leagueId,
  initialData,
}: {
  leagueId: string;
  initialData?: LeagueProfileSchema & {
    name: string;
    imageUrl: string | null;
  };
}) {
  const toast = useActionToast();

  const form = useForm<LeagueProfileSchema>({
    resolver: zodResolver(leagueProfileSchema),
    defaultValues: initialData ?? {
      image: null,
      visibility: "private",
      password: null,
      description: null,
    },
  });

  async function onSubmit(data: LeagueProfileSchema) {
    const res = await updateLeagueProfile(data, leagueId);
    toast(res);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <LeagueImageField
          image={initialData?.imageUrl}
          label="Logo della Lega"
          tip="Il logo della lega e' visualizzabile da tutti gli utenti"
        />

        <LeagueNameField
          name={initialData?.name}
          label="Nome della Lega"
          tip="Il nome della lega e' visualizzabile da tutti gli utenti e non sara' piu modificabile"
        />

        <LeagueDescriptionField />

        <LeagueTypeField />

        {form.watch("visibility") === "private" && <PasswordField />}

        <SubmitButton loadingText="Salvando impostazioni">
          Salva info
        </SubmitButton>
      </form>
    </Form>
  );
}
