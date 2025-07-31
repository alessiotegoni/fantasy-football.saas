"use client";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type MarketOptionsSchema,
  marketOptionsSchema,
} from "../../schema/leagueOptions";
import SubmitButton from "@/components/SubmitButton";
import OptionTooltip from "../../../../../components/FormFieldTooltip";
import { useLeagueOptions } from "@/hooks/useLeagueOptions";
import FormSliderField from "@/components/FormFieldSlider";

export function MarketOptionsForm({
  leagueId,
  initialData,
}: {
  leagueId: string;
  initialData?: MarketOptionsSchema;
}) {
  const { loading, saveMarketOptions } = useLeagueOptions(leagueId);

  const form = useForm<MarketOptionsSchema>({
    resolver: zodResolver(marketOptionsSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(saveMarketOptions)}
        className="space-y-6"
      >
        <FormSliderField<MarketOptionsSchema>
          name="releasePercentage"
          label="Percentuale di svincolo"
          tip="La percentuale di svincolo è la percentuale con cui verranno calcolati i crediti da restituire alla squadra in caso di svincolo di un giocatore"
          min={0}
          max={100}
          step={5}
          unit="%"
        />

        <FormField
          control={form.control}
          name="isTradingMarketOpen"
          render={({ field }) => (
            <FormItem
              className="bg-muted/30 border-border
            flex flex-row items-center justify-between rounded-2xl border p-4"
            >
              <div>
                <OptionTooltip
                  label={`${field.value ? "Chiudi" : "Apri"} mercato scambi`}
                  tip="Permetti ai membri della lega di scambiare giocatori tra loro"
                  classNames={{ label: "md:mb-0 cursor-pointer" }}
                />
              </div>
              <FormControl>
                <Switch
                  className="w-20 h-9"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <SubmitButton loadingText="Salvando impostazioni" isLoading={loading}>
          Salva Impostazioni Generali
        </SubmitButton>
      </form>
    </Form>
  );
}
