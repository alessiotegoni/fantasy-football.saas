import { Path, useFormContext } from "react-hook-form";
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
  fieldName?: Path<{ playerId: number }>;
  players: Player[];
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
    label: `${player.firstName} ${player.lastName}`,
    subLabel: player.team?.displayName
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
              onSelect={(value) => field.onChange(parseInt(value))}
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
