import { useCallback } from "react";
import { useMediaQuery } from "./useMediaQuery";
import { ExternalToast, toast } from "sonner";

export default function useActionToast() {
  const isMobile = useMediaQuery(1024);

  const handleToast = useCallback(
    (
      { error, message }: { error: boolean; message: string },
      toastData?: ExternalToast
    ) => {
      const variant = error ? "error" : "success";

      return toast[variant](message, {
        position: isMobile ? "top-center" : "bottom-right",
        ...toastData,
      });
    },
    [isMobile]
  );

  return handleToast;
}
