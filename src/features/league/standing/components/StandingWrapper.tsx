"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { StandingData } from "../queries/standing";
import { StandingToggle } from "./StandingToggle";
import StandingTable from "./StandingTable";
import StandingLegend from "./StandingLegend";
import { FinalPhaseAccess } from "../../admin/calendar/final-phase/utils/calendar";
import Disclaimer from "@/components/Disclaimer";

type Props = {
  data: StandingData[];
  finalPhaseAccess: FinalPhaseAccess;
  isSplitEnded?: boolean;
  isDefaultStanding?: boolean;
};

export default function StandingWrapper({
  isSplitEnded = false,
  isDefaultStanding = true,
  ...restProps
}: Props) {
  const [isExtended, setIsExtended] = useLocalStorage(
    "standing-extended-view",
    false
  );

  const props = {
    isExtended,
    isSplitEnded,
    isDefaultStanding,
    ...restProps
  };

  return (
    <>
      <StandingToggle isExtended={isExtended} onToggle={setIsExtended} />
      <StandingTable  {...props} />
      <StandingLegend {...props} />
      <Disclaimer />
    </>
  );
}
