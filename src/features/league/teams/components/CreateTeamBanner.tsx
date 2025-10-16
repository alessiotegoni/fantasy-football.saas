"use client"

import LinkButton from "@/components/LinkButton";
import { NavArrowRight, Search } from "iconoir-react";
import { Banner } from "@/components/banner";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Href } from "@/utils/helpers";

export default function CreateTeamBanner({
  className,
}: {
  className?: string;
}) {
  const { leagueId } = useParams();

  return (
    <Banner
      icon={<Search className="size-8 text-muted-foreground" />}
      title="Non hai ancora una squadra"
      description="Crea la tua squadra per partecipare alla lega"
      className={cn("mb-4 md:mb-8", className)}
    >
      <LinkButton
        variant="gradient"
        className="w-fit mt-6 md:mt-0 gap-4 py-3.5 px-4"
        href={`/league/${leagueId}/teams/create` as Href}
      >
        Crea la tua squadra
        <NavArrowRight className="size-5" />
      </LinkButton>
    </Banner>
  );
}
