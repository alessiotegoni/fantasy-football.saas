import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuctionType } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { Globe, Hammer } from "iconoir-react";
import { useFormContext } from "react-hook-form";

export default function AuctionTypeField({
  isSplitLive = false,
}: {
  isSplitLive: boolean | undefined;
}) {
  const form = useFormContext<{ type: AuctionType }>();

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo di asta</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            <label
              className={cn(
                `flex flex-col items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                  field.value === "classic"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/30"
                }`,
                !isSplitLive
                  ? "cursor-pointer"
                  : "cursor-not-allowed select-none *:text-muted-foreground/50"
              )}
            >
              <input
                type="radio"
                value="private"
                checked={field.value === "classic"}
                onChange={() => !isSplitLive && field.onChange("classic")}
                className="sr-only"
                disabled={isSplitLive}
              />
              <Globe
                className={`size-6 mb-2 ${
                  field.value === "classic"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  field.value === "classic" ? "text-primary" : ""
                }`}
              >
                Classica
              </span>
              <span className="text-xs text-center text-muted-foreground mt-1">
                Asta di inizio campionato
              </span>
            </label>

            <label
              className={cn(
                `flex flex-col items-center p-4 border rounded-xl transition-colors ${
                  field.value === "repair" && isSplitLive
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/30"
                }`,
                isSplitLive
                  ? "cursor-pointer"
                  : "cursor-not-allowed select-none *:text-muted-foreground/50"
              )}
            >
              <input
                type="radio"
                value="public"
                checked={field.value === "repair"}
                onChange={() => isSplitLive && field.onChange("repair")}
                className="sr-only"
                disabled={!isSplitLive}
              />
              <Hammer
                className={`size-6 mb-2 ${
                  field.value === "repair" && isSplitLive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  field.value === "repair" ? "text-primary" : ""
                }`}
              >
                Riparazione
              </span>
              <span className="text-xs text-center text-muted-foreground mt-1">
                Asta di meta campionato
              </span>
            </label>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
