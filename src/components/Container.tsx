"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "iconoir-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

type Props = {
  headerLabel: string;
  className?: string;
};

export default function Container({
  headerLabel,
  className,
  children,
}: PropsWithChildren<Props>) {
  const { leagueId } = useParams();

  return (
    <div className={cn("max-w-[700px] mx-auto md:p-4", className)}>
      <div className="flex items-center mb-4 md:mb-8 md:hidden">
        <Link href={`/leagues/${leagueId}`} className="mr-3">
          <ArrowLeft className="size-5" />
        </Link>
        <h2 className="text-2xl font-heading">{headerLabel}</h2>
      </div>
      <h2 className="hidden md:block text-3xl font-heading mb-8">
        {headerLabel}
      </h2>
      {children}
    </div>
  );
}
