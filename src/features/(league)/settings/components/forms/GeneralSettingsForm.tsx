"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type GeneralOptionsSchema,
  generalOptionsSchema,
} from "../../schema/setting";
import SubmitButton from "@/components/SubmitButton";
import { useLeagueOptions } from "@/hooks/useLeagueOptions";
import FormSliderField from "@/components/FormFieldSlider";

export function GeneralSettingsForm({
  leagueId,
  initialData,
}: {
  leagueId: string;
  initialData?: GeneralOptionsSchema;
}) {
  const { loading, saveGeneralOptions } = useLeagueOptions(leagueId);

  const form = useForm<GeneralOptionsSchema>({
    resolver: zodResolver(generalOptionsSchema),
    defaultValues: initialData ?? {
      initialCredits: 500,
      maxMembers: 12,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(saveGeneralOptions)}
        className="space-y-6"
      >
        <FormSliderField<GeneralOptionsSchema>
          name="initialCredits"
          label="Crediti iniziali per squadra"
          tip="Crediti disponibili per ogni squadra all'inizio della
                        stagione"
          min={200}
          max={5000}
          step={50}
          unit="crediti"
        />

        <FormSliderField<GeneralOptionsSchema>
          name="maxMembers"
          label="Numero massimo membri"
          tip="Numero massimo di partecipanti che possono unirsi alla
                        lega"
          min={4}
          max={12}
          step={1}
          unit="membri"
        />

        <SubmitButton loadingText="Salvando impostazioni" isLoading={loading}>
          Salva Impostazioni Generali
        </SubmitButton>
      </form>
    </Form>
  );
}
