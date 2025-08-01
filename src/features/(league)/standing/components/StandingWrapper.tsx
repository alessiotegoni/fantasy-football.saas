"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { StandingData } from "../queries/standing";
import { useIsMobile } from "@/hooks/useMobile";
import { StandingToggle } from "./StandingToggle";
import { StandingMobileTable } from "./StandingMobileTable";

export default function StandingWrapper({ data }: { data: StandingData[] }) {
  const [isExtended, setIsExtended] = useLocalStorage(
    "standing-extended-view",
    false
  );

  const isMobile = useIsMobile();

  return (
    <>
      <StandingToggle isExtended={isExtended} onToggle={setIsExtended} />
      {isMobile ? (
        <StandingMobileTable data={data} isExtended={isExtended} />
      ) : null}
    </>
  );
}
