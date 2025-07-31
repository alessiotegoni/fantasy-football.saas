"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type GeneralSettingsSchema,
  generalSettingsSchema,
} from "../../schema/setting";
import SubmitButton from "@/components/SubmitButton";
import { useLeagueSettings } from "@/hooks/useLeagueSettings";
import FormSliderField from "@/components/FormFieldSlider";

export function GeneralSettingsForm({
  leagueId,
  initialData,
}: {
  leagueId: string;
  initialData: GeneralSettingsSchema;
}) {
  const { loading, saveGeneralSettings } = useLeagueSettings(leagueId);

  const form = useForm<GeneralSettingsSchema>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(saveGeneralSettings)}
        className="space-y-6"
      >
        <FormSliderField<GeneralSettingsSchema>
          name="initialCredits"
          label="Crediti iniziali per squadra"
          tip="Crediti disponibili per ogni squadra all'inizio della
                        stagione"
          min={200}
          max={5000}
          step={50}
          unit="crediti"
        />

        <FormSliderField<GeneralSettingsSchema>
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
