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
import { cn } from "@/lib/utils";

type Props = {
  name?: string;
  placeholder?: string;
} & Omit<React.ComponentPropsWithoutRef<typeof FormFieldTooltip>, "children">;

export default function NameField({
  name,
  placeholder = "Inserisci nome",
  label,
  tip,
  classNames,
}: Props) {
  const form = useFormContext<{ name: string }>();

  return (
    <TooltipProvider>
      <FormFieldTooltip
        label={label}
        tip={tip}
        classNames={{
          ...classNames,
          label: cn(classNames?.label, name && "opacity-70"),
        }}
      >
        {name ? (
          <Input value={name} readOnly className="cursor-default select-none" />
        ) : (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder={placeholder} {...field} />
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
