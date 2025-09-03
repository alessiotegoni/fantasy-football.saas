import { useEffect, useState, useCallback } from "react";
import useAcquisitionsRoleSlots from "./useAcquisitionsRoleSlots";

export default function useParticipantsAccordion() {
  const { unfilledRolesIds } = useAcquisitionsRoleSlots();

  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    setValue(unfilledRolesIds.map((roleId) => roleId.toString()));
  }, [unfilledRolesIds]);

  const onValueChange = useCallback(setValue, []);

  return { value, onValueChange };
}
