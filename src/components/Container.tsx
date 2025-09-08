import { cn } from "@/lib/utils";
import { ArrowLeft } from "iconoir-react";
import Link from "next/link";
import { PropsWithChildren } from "react";

type Props = {
  leagueId: string;
  headerLabel: string;
  showHeader?: boolean;
  renderHeaderRight?: () => React.ReactNode;
  className?: string;
};

export default function Container({
  leagueId,
  headerLabel,
  className,
  showHeader = true,
  renderHeaderRight,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={cn("max-w-[700px] mx-auto md:p-4", className)}>
      {showHeader && (
        <header className="flex justify-between items-center gap-2 mb-4 md:mb-8">
          <div className="flex items-center md:hidden">
            <Link href={`/league/${leagueId}`} className="mr-3">
              <ArrowLeft className="size-5" />
            </Link>
            <h2
              className={cn(
                "text-2xl font-heading",
                renderHeaderRight && "text-xl xs:text-2xl"
              )}
            >
              {headerLabel}
            </h2>
          </div>
          <h2 className="hidden md:block text-3xl font-heading">
            {headerLabel}
          </h2>
          {renderHeaderRight?.()}
        </header>
      )}
      {children}
    </div>
  );
}
