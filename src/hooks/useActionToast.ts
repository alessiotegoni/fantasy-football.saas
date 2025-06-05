import { actionToast } from "@/lib/utils";
import { useIsMobile } from "./useMobile";
import { ExternalToast } from "sonner";

export default function useActionToast() {
  const isMobile = useIsMobile(1024);

  function handleToast(
    actionResult: { error: boolean; message: string },
    toastData?: ExternalToast
  ) {
    return actionToast(actionResult, {
      position: isMobile ? "top-center" : "bottom-right",
      ...toastData,
    });
  }

  return handleToast;
}
