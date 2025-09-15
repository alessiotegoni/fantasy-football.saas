import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SplitMatchday } from "../../splits/queries/split";
import { MatchdayBonusMalus } from "../queries/bonusMalus";
import LinkButton from "@/components/LinkButton";
import { NavArrowDown } from "iconoir-react";
import BonusMalusesTable from "./BonusMalusesTable";
import { BonusMalusType } from "../queries/bonusMalusType";

type Props = {
  matchday: SplitMatchday;
  bonusMaluses: MatchdayBonusMalus[];
  bonusMalusTypes: BonusMalusType[];
};

export default function MatchdayAccordionItem({ matchday, ...props }: Props) {
  return (
    <AccordionItem value={matchday.id.toString()} className="border-b-0">
      <AccordionTrigger
        className="bg-muted/30 px-4 rounded-3xl text-xl font-semibold items-center"
        chevronClassName="hidden"
      >
        Giornata {matchday.number}
        <div className="flex items-center gap-4">
          {matchday.status !== "upcoming" && (
            <LinkButton
              size="sm"
              className="w-fit text-base"
              href={`/dashboard/admin/bonus-maluses/assign?matchdayId=${matchday.id}`}
            >
              Assegna
            </LinkButton>
          )}
          <NavArrowDown className="text-muted-foreground size-5 group-[data-state=open]:rotate-180" />
        </div>
      </AccordionTrigger>
      <AccordionContent className="bg-muted/30 p-4 my-2 rounded-3xl flex flex-col gap-4 text-balance">
        {props.bonusMaluses.length > 0 ? (
          <BonusMalusesTable matchday={matchday} {...props} />
        ) : (
          <p className="text-center text-muted-foreground py-4">
            Nessun bonus/malus assegnato per questa giornata.
          </p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
