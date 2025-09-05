import type React from "react";
import {
  Settings,
  User,
  Trophy,
  ArrowLeft,
  Suitcase,
  Calculator,
} from "iconoir-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { TooltipProvider } from "@/components/ui/tooltip";
import Disclaimer from "@/components/Disclaimer";
import LeagueSettingLink from "@/features/(league)/settings/components/LeagueSettingLink";

export default async function leagueSettingsLayout({
  children,
  params,
}: LayoutProps<"/leagues/[leagueId]/settings">) {
  const { leagueId } = await params;

  return (
    <div className="flex flex-col h-full">
      {/* Mobile leagueSettings */}
      <div className="md:hidden">
        <div className="flex items-center mb-4">
          <Link href={`/leagues/${leagueId}`} className="mr-3">
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-xl font-heading">Impostazioni Lega</h1>
        </div>
        <Carousel>
          <CarouselContent className="my-1">
            {leagueSettings.map((setting) => (
              <CarouselItem
                key={setting.id}
                className="basis-2/5 first:pl-4 pl-2 xs:basis-1/3"
              >
                <LeagueSettingLink
                  key={setting.id}
                  setting={setting}
                  leagueId={leagueId}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="flex-1 overflow-y-auto py-4 relative">
          <TooltipProvider>
            {children}
            <Disclaimer className="mb-0" />
          </TooltipProvider>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-[1fr_auto] h-full overflow-hidden">
        {/* Sidebar */}

        <div className="p-4 w-full">
          <TooltipProvider>
            {children}
            <Disclaimer />
          </TooltipProvider>
        </div>
        <aside
          className="sticky top-0 w-64 border-r border-border
        rounded-2xl bg-(--sidebar)"
        >
          <div className="p-4">
            <h2 className="text-lg font-heading mb-4">Impostazioni Lega</h2>
            <nav className="space-y-2">
              {leagueSettings.map((setting) => (
                <LeagueSettingLink
                  key={setting.id}
                  setting={setting}
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

const leagueSettings = [
  { id: "general", label: "Generali", icon: Settings },
  { id: "roster", label: "Rose e Moduli", icon: User },
  { id: "bonus", label: "Bonus e Malus", icon: Trophy },
  { id: "calculation", label: "Calcolo", icon: Calculator },
  { id: "market", label: "Mercato", icon: Suitcase },
];
