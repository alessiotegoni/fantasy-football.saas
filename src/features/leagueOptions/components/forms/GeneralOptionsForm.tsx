"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type GeneralOptionsSchema,
  generalOptionsSchema,
} from "../../schema/leagueOptions";
import SubmitButton from "@/components/SubmitButton";
import OptionTooltip from "../OptionTooltip";
import LeagueTypeField from "../../../leagues/components/LeagueTypeField";
import { PasswordInput } from "../../../leagues/components/PasswordInput";
import { useLeagueOptions } from "@/hooks/useLeagueOptions";

export function GeneralOptionsForm({
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
      password: null,
      initialCredits: 500,
      maxMembers: 20,
      isTradingMarketOpen: false,
      description: null,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(saveGeneralOptions)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="initialCredits"
          render={({ field }) => (
            <FormItem>
              <OptionTooltip
                label="Crediti iniziali per squadra"
                tip="Crediti disponibili per ogni squadra all'inizio della
                        stagione"
              >
                <FormControl>
                  <div className="space-y-3">
                    <Slider
                      min={200}
                      max={5000}
                      step={50}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>200</span>
                      <span className="font-medium text-white">
                        {field.value} crediti
                      </span>
                      <span>5000</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </OptionTooltip>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxMembers"
          render={({ field }) => (
            <FormItem>
              <OptionTooltip
                label="Numero massimo membri"
                tip="Numero massimo di partecipanti che possono unirsi alla
                        lega"
              >
                <FormControl>
                  <div className="space-y-3">
                    <Slider
                      min={4}
                      max={20}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>4</span>
                      <span className="font-medium text-white">
                        {field.value} membri
                      </span>
                      <span>20</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </OptionTooltip>
            </FormItem>
          )}
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

        <LeagueTypeField />

        <PasswordInput />

        <SubmitButton loadingText="Salvando impostazioni" isLoading={loading}>
          Salva Impostazioni Generali
        </SubmitButton>
      </form>
    </Form>
  );
}
