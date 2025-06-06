import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Globe, Lock } from "iconoir-react";
import { useFormContext } from "react-hook-form";

export default function LeagueTypeField({
  className = "",
}: {
  className?: string;
}) {
  const form = useFormContext<{ visibility: "public" | "private" }>();

  return (
    <FormField
      control={form.control}
      name="visibility"
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>Tipo di Lega</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            <label
              className={`flex flex-col items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                field.value === "private"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/30"
              }`}
            >
              <input
                type="radio"
                value="private"
                checked={field.value === "private"}
                onChange={() => field.onChange("private")}
                className="sr-only"
              />
              <Lock
                className={`w-6 h-6 mb-2 ${
                  field.value === "private"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  field.value === "private" ? "text-primary" : ""
                }`}
              >
                Privata
              </span>
              <span className="text-xs text-center text-muted-foreground mt-1">
                Solo su invito
              </span>
            </label>

            <label
              className={`flex flex-col items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                field.value === "public"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/30"
              }`}
            >
              <input
                type="radio"
                value="public"
                checked={field.value === "public"}
                onChange={() => field.onChange("public")}
                className="sr-only"
              />
              <Globe
                className={`w-6 h-6 mb-2 ${
                  field.value === "public"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  field.value === "public" ? "text-primary" : ""
                }`}
              >
                Pubblica
              </span>
              <span className="text-xs text-center text-muted-foreground mt-1">
                Aperta a tutti
              </span>
            </label>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
