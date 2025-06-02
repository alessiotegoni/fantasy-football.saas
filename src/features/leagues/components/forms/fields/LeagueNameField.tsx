import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import FormFieldTooltip from "@/components/FormFieldTooltip";
import { useFormContext } from "react-hook-form";

export default function LeagueNameField({
  leagueName,
}: {
  leagueName?: string;
}) {
  const form = useFormContext<{ name: string }>();

  return (
    <TooltipProvider>
      <FormFieldTooltip
        label="Nome della Lega"
        tip="Il nome della lega e' visualizzabile da tutti gli utenti e non sara' piu modificabile"
        classNames={{ label: leagueName && "opacity-70" }}
      >
        {leagueName ? (
          <Input value={leagueName} readOnly className="cursor-default select-none" />
        ) : (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Es. Champions League" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </FormFieldTooltip>
    </TooltipProvider>
  );
}
