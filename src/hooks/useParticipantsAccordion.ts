"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import useAcquisitionsRoleSlots from "./useAcquisitionsRoleSlots";

export default function useParticipantsAccordion() {
  const { unfilledRolesIds } = useAcquisitionsRoleSlots();

  const roleIds = useMemo(
    () => unfilledRolesIds.map((roleId) => roleId.toString()),
    [unfilledRolesIds]
  );

  const [value, setValue] = useState<string[]>(roleIds);

  useEffect(() => {
    setValue(roleIds);
  }, [unfilledRolesIds]);

  const onValueChange = useCallback(setValue, []);

  return { value, onValueChange };
}
