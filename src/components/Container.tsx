"use client";

import { cn } from "@/lib/utils";
import { Href } from "@/utils/helpers";
import { ArrowLeft } from "iconoir-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PropsWithChildren, ReactNode } from "react";

type Props = {
  headerLabel: string;
  showHeader?: boolean;
  headerRight?: ReactNode;
  backLinkHref?: Href;
  className?: string;
};

export default function Container({
  headerLabel,
  className,
  showHeader = true,
  headerRight,
  backLinkHref,
  children,
}: PropsWithChildren<Props>) {
  const params = useParams();
  const leagueId = params.leagueId as string | undefined;

  return (
    <div className={cn("max-w-[700px] mx-auto md:p-4", className)}>
      {showHeader && (
        <header className="flex justify-between items-center gap-2 mb-4 md:mb-8">
          <div className="flex items-center md:hidden">
            <Link
              href={backLinkHref ?? (leagueId ? `/league/${leagueId}` : "/")}
              className="mr-3"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <h2
              className={cn(
                "text-2xl font-heading",
                headerRight && "text-xl xs:text-2xl"
              )}
            >
              {headerLabel}
            </h2>
          </div>
          <h2 className="hidden md:block text-3xl font-heading">
            {headerLabel}
          </h2>
          {headerRight}
        </header>
      )}
      {children}
    </div>
  );
}
