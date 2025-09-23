import { FieldValues, Path, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import NumberInput from "@/components/ui/number-input";
import PlayersSelect from "../../admin/players/components/PlayersSelect";
import { Player } from "../../admin/players/queries/player";
import { cn } from "@/lib/utils";
import { MatchdayVote } from "../queries/vote";

type Props = {
  namePrefix?: string;
  vote?: MatchdayVote;
  players?: Player[];
};

export default function VoteFormFields<T extends FieldValues>({
  namePrefix,
  vote,
  players,
}: Props) {
  const form = useFormContext<T>();

  function getFieldName(
    namePrefix: string | undefined,
    fieldName: Path<T>
  ): Path<T> {
    if (!namePrefix) return fieldName;
    return `${namePrefix}.${fieldName}` as Path<T>;
  }

  return (
    <div
      className={cn(
        "grid gap-4 w-full",
        vote ? "sm:grid-cols-[minmax(215px,auto)_1fr]" : "sm:grid-cols-2"
      )}
    >
      <PlayersSelect
        players={players ? players : vote?.player ? [vote.player] : []}
        fieldName={getFieldName(namePrefix, "playerId")}
        disabled={!!vote?.player}
      />
      <FormField
        control={form.control}
        name={getFieldName(namePrefix, "vote")}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voto</FormLabel>
            <FormControl>
              <NumberInput {...field} step={0.5} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
