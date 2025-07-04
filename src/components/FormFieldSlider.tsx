"use client";

import React, { ComponentProps } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import FormFieldTooltip from "@/components/FormFieldTooltip";
import { useFormContext } from "react-hook-form";
import Slider from "./Slider";

type Props<T> = {
  label: string;
  tip?: string;
  name: keyof T & string;
  className?: string;
} & Omit<ComponentProps<typeof Slider>, "value" | "onChange" | "className">;

export default function FormSliderField<T>({
  name,
  label,
  tip,
  className,
  ...sliderProps
}: Props<T>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormFieldTooltip
            label={label}
            tip={tip}
            classNames={{ label: "mb-4" }}
          >
            <FormControl>
              <Slider {...sliderProps} {...field} />
            </FormControl>
            <FormMessage className="mt-2" />
          </FormFieldTooltip>
        </FormItem>
      )}
    />
  );
}
