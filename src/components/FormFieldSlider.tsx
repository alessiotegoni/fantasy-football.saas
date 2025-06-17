"use client";

import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import FormFieldTooltip from "@/components/FormFieldTooltip";
import { useFormContext } from "react-hook-form";
import { NumberInputProps } from "./ui/number-input";

type Props<T> = {
  label: string;
  tip?: string;
  name: keyof T & string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  className?: string;
  renderNumberInput?: (props: NumberInputProps) => React.ReactNode;
};

export default function FormSliderField<T>({
  name,
  label,
  tip,
  min,
  max,
  step = 1,
  unit,
  className,
  renderNumberInput,
}: Props<T>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem className={className}>
          <FormFieldTooltip label={label} tip={tip} classNames={{ label: "mb-4" }}>
            <FormControl>
              <div className="space-y-3">
                <Slider
                  min={min}
                  max={max}
                  step={step}
                  value={[value]}
                  onValueChange={(value) => onChange(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{min}</span>
                  {renderNumberInput?.({ value, onChange, min, max, containerClassName: "my-3" }) ?? (
                    <span className="font-medium text-white">{value} {unit}</span>
                  )}
                  <span>{max}</span>
                </div>
              </div>
            </FormControl>
            <FormMessage className="mt-2" />
          </FormFieldTooltip>
        </FormItem>
      )}
    />
  );
}
