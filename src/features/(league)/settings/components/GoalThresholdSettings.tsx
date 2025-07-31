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

export function GoalThresholdSettings() {
  const form = useFormContext<CalculationSettingsSchema>();
  const { base, interval } = form.watch("goalThreshold") || {
    base: 58,
    interval: 6,
  };

  const thresholds = Array.from({ length: 10 }, (_, i) => base + i * interval);

  return (
    <FormFieldTooltip
      classNames={{ label: "text-xl mb-7" }}
      label="Soglia goal"
    >
      <div className="grid md:grid-cols-2 gap-6 mb-4">
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

      <div>
        <h3 className="text-lg font-medium mb-3">Anteprima soglie goal</h3>
        <ScrollArea direction="horizontal">
          <div className="flex gap-8">
            {thresholds.map((threshold, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="text-sm font-bold text-primary">
                  {i + 1}° GOL
                </div>
                <div className="text-2xl font-heading">{threshold}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </FormFieldTooltip>
  );
}
