import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SplitMatchday } from "../../splits/queries/split";
import { MatchdayBonusMalus } from "../queries/bonusMalus";
import LinkButton from "@/components/LinkButton";
import { NavArrowDown } from "iconoir-react";

type Props = {
  matchday: SplitMatchday;
  bonusMaluses: MatchdayBonusMalus[];
};

export default function MatchdayAccordionItem(props: Props) {
  return (
    <AccordionItem value={props.matchday.id.toString()} className="border-b-0">
      <MatchdayAccordionTrigger {...props} />
      <MatchdayAccordionContent {...props} />
    </AccordionItem>
  );
}

function MatchdayAccordionContent({}: Props) {
  return (
    <AccordionContent className="bg-muted/30 p-4 my-2 mb-3 rounded-3xl flex flex-col gap-4 text-balance"></AccordionContent>
  );
}

function MatchdayAccordionTrigger({ matchday }: Pick<Props, "matchday">) {
  return (
    <AccordionTrigger
      className="bg-muted/30 px-4 rounded-3xl text-xl font-semibold"
      chevronClassName="hidden"
    >
      Giornata {matchday.number}
      <div className="flex items-center gap-4">
        <LinkButton
          size="sm"
          className="w-fit text-base"
          href={`/dashboard/admin/bonus-maluses/assign?matchdayId=${matchday.id}`}
        >
          Assegna
        </LinkButton>
        <NavArrowDown className="text-muted-foreground size-5 group-[data-state=open]:rotate-180" />
      </div>
    </AccordionTrigger>
  );
}
