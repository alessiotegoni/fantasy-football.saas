import { useFormContext } from "react-hook-form";
import { BonusMalusType } from "../queries/bonusMalusType";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";

export default function BonusMalusTypeSelect({
  types,
}: {
  types: BonusMalusType[];
}) {
  const form = useFormContext<{ bonusMalusTypeId: number }>();

  const items = types.map((type) => ({
    value: type.id.toString(),
    label: type.name,
  }));

  return (
    <FormField
      control={form.control}
      name="bonusMalusTypeId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bonus e malus</FormLabel>
          <FormControl>
            <Combobox
              items={items}
              value={field.value.toString()}
              onSelect={field.onChange}
              placeholder="Cerca bonus/malus"
              emptyText="Nessun bonus/malus trovato"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
