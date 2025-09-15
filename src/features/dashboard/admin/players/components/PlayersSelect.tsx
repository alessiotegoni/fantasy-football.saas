import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";
import { Player } from "../queries/player";

type Props = {
  fieldName?: string;
  players: Pick<Player, "id" | "displayName">[];
  disabled?: boolean;
};

export default function PlayersSelect({
  fieldName = "playerId",
  players,
  disabled,
}: Props) {
  const form = useFormContext<{ playerId: number }>();

  const items = players.map((player) => ({
    value: player.id.toString(),
    label: player.displayName,
  }));

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Giocatori</FormLabel>
          <FormControl>
            <Combobox
              items={items}
              value={field.value.toString()}
              onSelect={field.onChange}
              disabled={disabled}
              placeholder="Cerca gioatori"
              emptyText="Nessun giocatore trovato"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
