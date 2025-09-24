"use client";

import { cn } from "@/lib/utils";
import { Href } from "@/utils/helpers";
import { ArrowLeft } from "iconoir-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PropsWithChildren, ReactNode } from "react";
import { Button } from "./ui/button";

type Props = {
  headerLabel: string;
  showHeader?: boolean;
  headerRight?: ReactNode;
  backLinkHref?: Href;
  className?: string;
};

export default function Container({
  className,
  showHeader = true,
  children,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <div className={cn("max-w-[700px] mx-auto md:p-4", className)}>
      {showHeader && <Header {...props} />}
      {children}
    </div>
  );
}

function Header({
  headerLabel,
  headerRight,
  backLinkHref,
}: Pick<Props, "headerLabel" | "headerRight" | "backLinkHref">) {
  const router = useRouter();
  const params = useParams();

  let button = (
    <Button onClick={() => router.back()} variant="ghost" className="size-8">
      <ArrowLeft className="size-5" />
    </Button>
  );

  const leagueId = params.leagueId as string | undefined;
  if (backLinkHref || leagueId) {
    button = (
      <Button variant="ghost" className="size-8" asChild>
        <Link href={backLinkHref ?? `/league/${leagueId}`}>
          <ArrowLeft className="size-5" />
        </Link>
      </Button>
    );
  }

  return (
    <header className="flex justify-between items-center gap-2 mb-4 md:mb-8">
      <div className="flex gap-2 items-center md:hidden">
        {button}
        <h2
          className={cn(
            "text-2xl font-heading",
            headerRight && "text-xl xs:text-2xl"
          )}
        >
          {headerLabel}
        </h2>
      </div>
      <h2 className="hidden md:block text-3xl font-heading">{headerLabel}</h2>
      {headerRight}
    </header>
  );
}
