import type React from "react";
import { Settings, User, Trophy, ArrowLeft } from "iconoir-react";
import LeagueOptionLink from "@/features/leagues/components/LeagueOptionLink";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function LeagueOptionsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  return (
    <div className="flex flex-col h-full">
      {/* Mobile LeagueOptions */}
      <div className="md:hidden">
        <div className="flex items-center mb-4">
          <Link href={`/leagues/${leagueId}`} className="mr-3">
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-xl font-heading">Impostazioni Lega</h1>
        </div>
        <Carousel>
          <CarouselContent className="my-1">
            {leagueOptions.map((option) => (
              <CarouselItem
                key={option.id}
                className="basis-2/5 first:pl-4 pl-2 xs:basis-1/3"
              >
                <LeagueOptionLink
                  key={option.id}
                  option={option}
                  leagueId={leagueId}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="flex-1 overflow-y-auto py-4">
          <TooltipProvider>{children}</TooltipProvider>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-[1fr_auto] h-full overflow-hidden">
        {/* Sidebar */}

        <div className="p-4 w-full">
          <TooltipProvider>{children}</TooltipProvider>
        </div>
        <aside className="sticky top-0 w-64 border-r border-border bg-muted/30 rounded-2xl">
          <div className="p-4">
            <h2 className="text-lg font-heading mb-4">Impostazioni Lega</h2>
            <nav className="space-y-2">
              {leagueOptions.map((option) => (
                <LeagueOptionLink
                  key={option.id}
                  option={option}
                  leagueId={leagueId}
                  className="py-2.5 rounded-lg justify-start"
                />
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}

const leagueOptions = [
  { id: "general", label: "Generali", icon: Settings },
  { id: "roster", label: "Rose e Moduli", icon: User },
  { id: "bonus", label: "Bonus e Malus", icon: Trophy },
];

//  activeOption === option.id
//                       ? "bg-primary text-primary-foreground"
//                       : "text-muted-foreground hover:text-foreground hover:bg-muted"
