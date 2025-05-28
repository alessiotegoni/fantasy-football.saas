"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import NumberInput from "@/components/ui/number-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BonusMalusSchema } from "@/features/leagueOptions/schema/leagueOptions";
import { getBonusMaluses } from "@/features/leagueOptions/queries/leagueOptions";

export function BonusMaluses({
  items,
  canModify = false,
}: {
  items: Awaited<ReturnType<typeof getBonusMaluses>>;
  canModify?: boolean;
}) {
  const form = useFormContext<BonusMalusSchema>();

  return items.map((item) => (
    <FormField
      key={item.id}
      control={form.control}
      name={`customBonusMalus.${item.id}`}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-7 justify-between p-3 border border-border rounded-xl">
            <div className="flex items-center space-x-3">
              <Avatar className="size-8">
                <AvatarImage src={item.imageUrl ?? ""} />
                <AvatarFallback className="uppercase">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-primary/20 rounded-full"></div>
                  </div>
                </AvatarFallback>
              </Avatar>
              <FormLabel className="text-sm font-medium m-0">
                {item.name}
              </FormLabel>
            </div>
            {canModify ? (
              <FormControl>
                <NumberInput
                  value={field.value || item.value}
                  onChange={field.onChange}
                  min={-10}
                  max={10}
                  step={0.5}
                />
              </FormControl>
            ) : (
              field.value
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  ));
}
