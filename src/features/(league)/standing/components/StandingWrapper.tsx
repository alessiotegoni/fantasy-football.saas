"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { StandingData } from "../queries/standing";
import { StandingToggle } from "./StandingToggle";
import StandingTable from "./StandingTable";
import StandingLegend from "./StandingLegend";
import { FinalStageAccess } from "../../(admin)/calendar/final-phase/utils/calendar";

type Props = {
  data: StandingData[];
  isSplitEnded: boolean;
  finalPhaseAccess: FinalStageAccess
};

export default function StandingWrapper({ data, isSplitEnded }: Props) {
  const [isExtended, setIsExtended] = useLocalStorage(
    "standing-extended-view",
    false
  );

  return (
    <>
      <StandingToggle isExtended={isExtended} onToggle={setIsExtended} />
      <StandingTable
        data={data}
        isExtended={isExtended}
        isSplitEnded={isSplitEnded}
      />
      <StandingLegend />
    </>
  );
}
