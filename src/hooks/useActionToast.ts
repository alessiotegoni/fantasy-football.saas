import { useIsMobile } from "./useMobile";
import { ExternalToast, toast } from "sonner";

export default function useActionToast() {
  const isMobile = useIsMobile(1024);

  function handleToast(
    { error, message }: { error: boolean; message: string },
    toastData?: ExternalToast
  ) {
    const variant = error ? "error" : "success";

    return toast[variant](message, {
      position: isMobile ? "top-center" : "bottom-right",
      ...toastData,
    });
  }

  return handleToast;
}
