"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { StandingData } from "../queries/standing";
import { StandingToggle } from "./StandingToggle";
import StandingTable from "./StandingTable";
import StandingLegend from "./StandingLegend";

export default function StandingWrapper({
  data,
  isSplitEnded,
}: {
  data: StandingData[];
  isSplitEnded: boolean;
}) {
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
