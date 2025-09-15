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
  players: Player[];
  disabled?: boolean;
};

export default function PlayersSelect({ players, disabled }: Props) {
  const form = useFormContext<{ playerId: number }>();

  const items = players.map((player) => ({
    value: player.id.toString(),
    label: player.displayName,
  }));

  return (
    <FormField
      control={form.control}
      name="playerId"
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
