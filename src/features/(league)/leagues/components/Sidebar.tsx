import {
  Shield,
  Settings,
  Calculator,
  Calendar,
  Refresh,
  User,
  Community,
  CoinsSwap,
  Coins,
} from "iconoir-react";
import { Star } from "iconoir-react/solid";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SidebarItem from "./SidebarItem";
import { Suspense } from "react";
import LeagueDropdown from "./LeagueDropdown";
import UserDropdown from "@/features/users/components/userDropdown";
import { getUser, getUserId } from "@/features/users/utils/user";
import { getLeagueAdmin, getLeaguePremium } from "../queries/league";
import { cn } from "@/lib/utils";

export default function LeagueSidebar({
  leagueId,
  leagueNamePromise,
}: {
  leagueId: string;
  leagueNamePromise: Promise<string>;
}) {
  return (
    <Sidebar>
      <SidebarHeader className="p-0">
        <LeagueDropdown
          leagueId={leagueId}
          leagueNamePromise={leagueNamePromise}
        />
        <div className="p-3">
          <Button asChild>
            <Link href="/user/premium">
              <Star className="size-5" />
              <span className="font-medium">Passa a premium</span>
            </Link>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarSection.map(({ type, items }) => {
          const section = (
            <SidebarSection
              key={type}
              items={items}
              sectionType={type}
              leagueId={leagueId}
            />
          );

          if (section.type === "public") return section;

          return <Suspense key={type}>{section}</Suspense>;
        })}
      </SidebarContent>
      <SidebarFooter className="hidden lg:block">
        <Suspense>
          <UserDropdown userPromise={getUser()} />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}

async function SidebarSection({
  items,
  sectionType,
  leagueId,
}: {
  items: (typeof publicSections)[number][];
  sectionType?: "public" | "private" | "premium";
  leagueId: string;
}) {
  let isPremiumFeaturesUnlocked = true;

  switch (sectionType) {
    case "private":
      const userId = await getUserId();
      if (!userId) return;

      if (!(await getLeagueAdmin(userId, leagueId))) return null;
      break;
    case "premium":
      isPremiumFeaturesUnlocked = await getLeaguePremium(leagueId);
      break;
  }

  return items.map((section) => (
    <SidebarGroup key={section.title} className="p-3">
      <SidebarGroupLabel
        className={cn(
          "font-heading text-lg mb-1",
          !isPremiumFeaturesUnlocked &&
            `mb-0 bg-background rounded-2xl rounded-bl-none rounded-br-none
            px-5 flex-col items-start h-fit pt-4`
        )}
      >
        {!isPremiumFeaturesUnlocked && (
          <div className="flex items-center gap-2 text-primary font-semibold mb-3">
            <Star className="size-5" />
            <p className="text-base">Premium</p>
          </div>
        )}
        {section.title}
      </SidebarGroupLabel>
      <SidebarGroupContent
        className={cn(
          !isPremiumFeaturesUnlocked &&
            "p-2 bg-background rounded-2xl rounded-tl-none rounded-tr-none"
        )}
      >
        <SidebarMenu
          className={cn(!isPremiumFeaturesUnlocked && "pointer-events-none")}
        >
          {section.items.map((item) => (
            <SidebarItem
              key={item.name}
              item={item}
              leagueId={leagueId}
              showLink={isPremiumFeaturesUnlocked}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
}

export const publicSections = [
  {
    title: "Setup lega",
    items: [
      {
        name: "Profilo lega",
        href: "/leagues/:leagueId/profile",
        icon: Shield,
      },
      {
        name: "Impostazioni lega",
        href: "/leagues/:leagueId//general",
        icon: Settings,
        basePath: "/leagues/:leagueId/",
      },
      {
        name: "Partecipanti",
        href: "/leagues/:leagueId/members",
        icon: User,
      },
    ],
  },
  {
    title: "Mercato",
    items: [
      {
        name: "Listone giocatori",
        href: "/leagues/:leagueId/players-list",
        icon: Community,
      },
      {
        name: "I miei scambi",
        href: "/leagues/:leagueId/my-trades",
        icon: CoinsSwap,
      },
      {
        name: "Scambi della lega",
        href: "/leagues/:leagueId/trades",
        icon: Refresh,
      },
    ],
  },
];

export const privateSections = [
  {
    title: "Gestione campionato",
    isPrivate: true,
    items: [
      {
        name: "Calcola giornate",
        href: "/leagues/:leagueId/admin/calculate-matchday",
        icon: Calculator,
      },
      {
        name: "Genera calendario",
        href: "/leagues/:leagueId/admin/generate-calendar",
        icon: Calendar,
      },
      {
        name: "Gestisci Crediti",
        href: "/leagues/:leagueId/admin/handle-credits",
        icon: Coins,
      },
    ],
  },
];

export const premiumSections = [
  {
    title: "Gestione aste",
    items: [
      {
        name: "Aste della lega",
        href: "/leagues/:leagueId/auctions",
        icon: Shield,
      },
      {
        name: "Impostazioni asta",
        href: "/leagues/:leagueId/auctions/settings",
        icon: Settings,
      },
      {
        name: "Partecipanti",
        href: "/leagues/:leagueId/participants",
        icon: User,
      },
    ],
  },
];

const sidebarSection = [
  { items: publicSections, type: "public" },
  { items: privateSections, type: "private" },
  { items: premiumSections, type: "premium" },
] as const;
