"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { StandingData } from "../queries/standing";
import { StandingToggle } from "./StandingToggle";
import StandingTable from "./StandingTable";

export default function StandingWrapper({ data }: { data: StandingData[] }) {
  const [isExtended, setIsExtended] = useLocalStorage(
    "standing-extended-view",
    false
  );

  return (
    <>
      <StandingToggle isExtended={isExtended} onToggle={setIsExtended} />
      <StandingTable data={data} isExtended={isExtended} />
    </>
  );
}
