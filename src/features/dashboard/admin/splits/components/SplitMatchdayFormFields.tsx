"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/datepicker";
import SplitMatchdayType from "./SplitMatchdayType";
import SplitStatus from "./SplitStatus";
import { FieldValues, useFormContext } from "react-hook-form";

type Props = {
  namePrefix?: string;
};

export default function SplitMatchdayFormFields<T extends FieldValues>({
  namePrefix,
}: Props) {
  const form = useFormContext<T>();

  function getFieldName(namePrefix: string | undefined, fieldName: string) {
    if (!namePrefix) return fieldName;
    return `matchdays.${namePrefix}.${fieldName}`;
  }

  return (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name={getFieldName(namePrefix, "status")}
        render={({ field }) => (
          <FormItem className="flex justify-between">
            <FormLabel>Stato</FormLabel>
            <FormControl>
              <SplitStatus
                status={field.value}
                onStatusChange={field.onChange}
                canUpdate
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={getFieldName(namePrefix, "type")}
        render={({ field }) => (
          <FormItem className="flex justify-between">
            <FormLabel>Tipo</FormLabel>
            <FormControl>
              <SplitMatchdayType
                type={field.value}
                onTypeChange={field.onChange}
                canUpdate
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={getFieldName(namePrefix, "number")}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numero giornata</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Numero della giornata"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid sm:grid-cols-2 sm:gap-4">
        <FormField
          control={form.control}
          name={getFieldName(namePrefix, "startAt")}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data di inizio</FormLabel>
              <DatePicker date={field.value} setDate={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={getFieldName(namePrefix, "endAt")}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data di fine</FormLabel>
              <DatePicker date={field.value} setDate={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
