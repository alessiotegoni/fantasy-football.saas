import Disclaimer from "@/components/Disclaimer";
import Logo from "@/components/ui/logo";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col p-6">
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-md flex flex-col items-center gap-8">
          <Logo />
          <div className="w-full">{children}</div>
          <Disclaimer />
        </div>
      </div>
    </main>
  );
}
