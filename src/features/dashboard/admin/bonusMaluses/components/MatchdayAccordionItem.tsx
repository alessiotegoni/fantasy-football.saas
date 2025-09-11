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

// TODO: fare editBonusMalusDialog che riceva come prop la matchday e il player e mostri
// una select con i bonus da assegnare ed il conteggio (select di bonus riutilizzabile)

// TODO: per la pagina di assegnazione del bonus fetchare la matchday dai searchParams
//  fare una select di tutti i player (riutilizzabile), mettere il select dei bonus ed il conteggio

export default function MatchdayAccordionItem({
  matchday,
  bonusMaluses,
}: Props) {
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
        {bonusMaluses.length > 0 ? (
          <BonusMalusesTable matchday={matchday} bonusMaluses={bonusMaluses} />
        ) : (
          <p className="text-center text-muted-foreground py-4">
            Nessun bonus/malus assegnato per questa giornata.
          </p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
