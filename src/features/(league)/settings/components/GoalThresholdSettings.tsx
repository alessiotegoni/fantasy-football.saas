"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import FormFieldTooltip from "@/components/FormFieldTooltip";
import { CalculationSettingsSchema } from "../schema/setting";
import ScrollArea from "@/components/ui/scroll-area";
import { type GoalThresholdSettings } from "@/drizzle/schema";

export function GoalThresholdSettings() {
  const form = useFormContext<CalculationSettingsSchema>();
  const threshold = form.watch("goalThreshold");

  return (
    <FormFieldTooltip
      classNames={{ label: "text-xl mb-7" }}
      label="Soglia goal"
    >
      <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-4">
        <FormField
          control={form.control}
          name="goalThreshold.base"
          render={({ field }) => (
            <FormItem>
              <FormFieldTooltip
                label="Primo goal a"
                tip="Il punteggio minimo per segnare il primo goal."
              >
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
              </FormFieldTooltip>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="goalThreshold.interval"
          render={({ field }) => (
            <FormItem>
              <FormFieldTooltip
                label="Intervallo goal"
                tip="Ogni quanti punti si segna un goal in più."
              >
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
              </FormFieldTooltip>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <GoalThresholdPreview {...threshold} />
    </FormFieldTooltip>
  );
}

function GoalThresholdPreview({ base, interval }: GoalThresholdSettings) {
  if (!base || !interval) return null;

  const thresholds = Array.from({ length: 10 }, (_, i) => base + i * interval);

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Anteprima soglie goal</h3>
      <ScrollArea direction="horizontal">
        <div className="flex">
          {thresholds.map((threshold, i) => (
            <div key={i} className="basis-1/4">
              <div className="text-sm font-bold text-primary mb-2">
                {i + 1}° GOL
              </div>
              <div className="text-2xl font-heading">{threshold}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
