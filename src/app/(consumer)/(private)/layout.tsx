import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";

export default function PrivateLayout({ children }: LayoutProps<"/">) {
  return (
    <Suspense
      fallback={
        <div className="size-full">
          <LoaderCircle className="animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
