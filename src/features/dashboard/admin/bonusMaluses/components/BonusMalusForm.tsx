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
import BonusMalusTypeSelect from "./BonusMalusTypeSelect";
import NumberInput from "@/components/ui/number-input";
import SubmitButton from "@/components/SubmitButton";

type Props = {
  matchday: SplitMatchday;
  bonusMalus?: MatchdayBonusMalus;
  bonusMalusTypes: BonusMalusType[];
};

export default function BonusMalusForm({
  matchday,
  bonusMalus,
  bonusMalusTypes,
}: Props) {
  const form = useForm<AssignBonusMalusSchema>({
    resolver: zodResolver(assignBonusMalusSchema),
    defaultValues: {
      playerId: bonusMalus?.player.id,
      matchdayId: matchday.id,
      bonusMalusTypeId: bonusMalus?.bonusMalusType.id ?? bonusMalusTypes[0].id,
      count: bonusMalus?.count ?? 1,
    },
  });

  return (
    <Form {...form}>
      <form className="space-y-4 flex flex-col items-end">
        <div className="grid sm:grid-cols-[minmax(215px,auto)_1fr] gap-4 w-full">
          <BonusMalusTypeSelect types={bonusMalusTypes} />
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
