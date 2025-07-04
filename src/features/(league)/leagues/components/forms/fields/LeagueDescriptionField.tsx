import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { TooltipProvider } from "@/components/ui/tooltip";
import FormFieldTooltip from "@/components/FormFieldTooltip";
import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

export default function LeagueDescriptionField() {
  const form = useFormContext<{ description: string | null }>();

  return (
    <TooltipProvider>
      <FormFieldTooltip
        label="Descrizione"
        tip="La descrizione della lega è visualizzabile da tutti gli utenti"
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field: { value, onChange, ...restField } }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="w-full bg-background border border-border rounded-xl py-4 px-4 focus:outline-none focus:border-primary transition-colors min-h-[100px] resize-none"
                  placeholder="Descrivi la tua lega..."
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value || null)}
                  {...restField}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormFieldTooltip>
    </TooltipProvider>
  );
}
