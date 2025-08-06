"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { StandingData } from "../queries/standing";
import { StandingToggle } from "./StandingToggle";
import StandingTable from "./StandingTable";
import StandingLegend from "./StandingLegend";
import { FinalPhaseAccess } from "../../(admin)/calendar/final-phase/utils/calendar";

type Props = {
  data: StandingData[];
  isSplitEnded: boolean;
  isDefaultStanding: boolean;
  finalPhaseAccess: FinalPhaseAccess;
};

export default function StandingWrapper(props: Props) {
  const [isExtended, setIsExtended] = useLocalStorage(
    "standing-extended-view",
    false
  );

  return (
    <>
      <StandingToggle isExtended={isExtended} onToggle={setIsExtended} />
      <StandingTable isExtended={isExtended} {...props} />
      <StandingLegend {...props} />
    </>
  );
}
