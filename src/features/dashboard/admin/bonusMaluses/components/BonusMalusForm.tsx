import { SplitMatchday } from "../../splits/queries/split";
import { MatchdayBonusMalus } from "../queries/bonusMalus";
import { BonusMalusType } from "../queries/bonusMalusType";
import { useForm } from "react-hook-form";
import {
  assignBonusMalusSchema,
  AssignBonusMalusSchema,
} from "../schema/bonusMalus";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import NumberInput from "@/components/ui/number-input";
import SubmitButton from "@/components/SubmitButton";
import { Combobox } from "@/components/ui/combobox";
import PlayersSelect from "../../players/components/PlayersSelect";
import { Player } from "../../players/queries/player";

type Props = {
  matchday: SplitMatchday;
  bonusMalusTypes: BonusMalusType[];
  bonusMalus?: MatchdayBonusMalus;
  players?: Pick<Player, "id" | "displayName">[];
};

export default function BonusMalusForm({
  matchday,
  bonusMalusTypes,
  bonusMalus,
  players,
}: Props) {
  const form = useForm<AssignBonusMalusSchema>({
    resolver: zodResolver(assignBonusMalusSchema),
    defaultValues: {
      playerId: bonusMalus?.player.id ?? players?.[0].id,
      matchdayId: matchday.id,
      bonusMalusTypeId: bonusMalus?.bonusMalusType.id ?? bonusMalusTypes[0].id,
      count: bonusMalus?.count ?? 1,
    },
  });

  return (
    <Form {...form}>
      <form className="space-y-4 flex flex-col items-end">
        <div className="grid sm:grid-cols-[minmax(215px,auto)_1fr] gap-4 w-full">
          <PlayersSelect
            players={
              players ? players : bonusMalus?.player ? [bonusMalus.player] : []
            }
            disabled={!!bonusMalus?.player}
          />
          <FormField
            control={form.control}
            name="bonusMalusTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bonus e malus</FormLabel>
                <FormControl>
                  <Combobox
                    items={bonusMalusTypes.map((type) => ({
                      value: type.id.toString(),
                      label: type.name,
                    }))}
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
          <FormField
            control={form.control}
            name="count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conteggio</FormLabel>
                <FormControl>
                  <NumberInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SubmitButton loadingText="Modifico" className="w-fit">
          Modifica
        </SubmitButton>
      </form>
    </Form>
  );
}
