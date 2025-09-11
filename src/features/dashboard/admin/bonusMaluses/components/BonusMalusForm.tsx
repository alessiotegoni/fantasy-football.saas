import { SplitMatchday } from "../../splits/queries/split";
import { MatchdayBonusMalus } from "../queries/bonusMalus";
import { BonusMalusType } from "../queries/bonusMalusType";
import { useForm } from "react-hook-form";
import {
  assignBonusMalusSchema,
  AssignBonusMalusSchema,
} from "../schema/bonusMalus";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import BonusMalusTypeSelect from "./BonusMalusTypeSelect";

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
      <form>
        <BonusMalusTypeSelect types={bonusMalusTypes} />
      </form>
    </Form>
  );
}
