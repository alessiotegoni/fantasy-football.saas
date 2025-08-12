import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuctionType } from "@/drizzle/schema";
import { Globe, Hammer } from "iconoir-react";
import { useFormContext } from "react-hook-form";

export default function AuctionTypeField() {
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
              className={`flex flex-col items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                field.value === "classic"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/30"
              }`}
            >
              <input
                type="radio"
                value="private"
                checked={field.value === "classic"}
                onChange={() => field.onChange("classic")}
                className="sr-only"
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
              className={`flex flex-col items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                field.value === "repair"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/30"
              }`}
            >
              <input
                type="radio"
                value="public"
                checked={field.value === "repair"}
                onChange={() => field.onChange("repair")}
                className="sr-only"
              />
              <Hammer
                className={`size-6 mb-2 ${
                  field.value === "repair"
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
