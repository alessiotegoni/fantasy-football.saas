import { MatchdayBonusMalus } from "../queries/bonusMalus";
import { BonusMalusType } from "../queries/bonusMalusType";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import NumberInput from "@/components/ui/number-input";
import { Combobox } from "@/components/ui/combobox";
import PlayersSelect from "../../players/components/PlayersSelect";
import { Player } from "../../players/queries/player";
import { cn } from "@/lib/utils";
import {
  AssignBonusMalusSchema,
  CreateBonusMalusSchema,
} from "../schema/bonusMalus";

type NamePrefix = `bonusMaluses.${number}`;

type Props = {
  namePrefix?: NamePrefix;
  bonusMalusTypes: BonusMalusType[];
  bonusMalus?: MatchdayBonusMalus;
  players?: Player[];
};

export default function BonusMalusFormFields({
  namePrefix,
  bonusMalusTypes,
  bonusMalus,
  players,
}: Props) {
  const form = useFormContext<
    AssignBonusMalusSchema | CreateBonusMalusSchema
  >();

  function getFieldName(
    namePrefix: NamePrefix | undefined,
    fieldName: Path<AssignBonusMalusSchema>
  ): Path<AssignBonusMalusSchema> | Path<CreateBonusMalusSchema> {
    if (!namePrefix) return fieldName;
    return `${namePrefix}.${fieldName}`;
  }

  return (
    <div
      className={cn(
        "grid gap-4 w-full",
        bonusMalus ? "sm:grid-cols-[minmax(215px,auto)_1fr]" : "sm:grid-cols-2"
      )}
    >
      <PlayersSelect
        players={
          players ? players : bonusMalus?.player ? [bonusMalus.player] : []
        }
        fieldName={getFieldName(namePrefix, "playerId")}
        disabled={!!bonusMalus?.player}
      />
      <FormField
        control={form.control}
        name={getFieldName(namePrefix, "bonusMalusTypeId")}
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
                onSelect={(value) => field.onChange(parseInt(value))}
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
        name={getFieldName(namePrefix, "count")}
        render={({ field: { value, ...restFields } }) => (
          <FormItem>
            <FormLabel>Conteggio</FormLabel>
            <FormControl>
              <NumberInput
                {...restFields}
                value={typeof value === "number" ? value : undefined}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
