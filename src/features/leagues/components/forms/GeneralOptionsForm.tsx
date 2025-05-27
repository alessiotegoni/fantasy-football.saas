"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoCircle } from "iconoir-react";
import {
  generalOptionsSchema,
  type GeneralOptionsSchema,
} from "../../schema/leagueOptions";
import SubmitButton from "@/components/SubmitButton";

export function GeneralOptionsForm({
  initialData,
}: {
  initialData?: GeneralOptionsSchema;
}) {
  const form = useForm<GeneralOptionsSchema>({
    resolver: zodResolver(generalOptionsSchema),
    defaultValues: initialData ?? {
      initialCredits: 500,
      maxMembers: 20,
      isTradingMarketOpen: false,
    },
  });

  const onSubmit = async (data: GeneralOptionsSchema) => {
    // await onSave(data);
  };

  return (
    <div className="max-w-[700px] mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <h2 className="text-lg font-heading">Generali</h2>
        <Tooltip>
          <TooltipTrigger>
            <InfoCircle className="size-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Impostazioni generali della lega</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="initialCredits"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormLabel>Crediti iniziali per squadra</FormLabel>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircle className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Crediti disponibili per ogni squadra all'inizio della
                        stagione
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
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
                      <span className="font-medium">{field.value} crediti</span>
                      <span>5000</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxMembers"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormLabel>Numero massimo membri</FormLabel>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircle className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Numero massimo di partecipanti che possono unirsi alla
                        lega
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
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
                      <span className="font-medium">{field.value} membri</span>
                      <span>20</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isTradingMarketOpen"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-2xl border p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <FormLabel className="text-base cursor-pointer">
                      Mercato scambi aperto
                    </FormLabel>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircle className="size-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Permetti agli utenti di scambiare giocatori tra loro
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormDescription>
                    Attiva/disattiva la possibilità di scambiare giocatori
                  </FormDescription>
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

          <SubmitButton> Salva Impostazioni Generali</SubmitButton>
        </form>
      </Form>
    </div>
  );
}
