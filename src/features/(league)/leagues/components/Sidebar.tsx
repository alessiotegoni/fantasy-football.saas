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
  Hammer,
  DatabaseScriptPlus,
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
      <SidebarContent className="custom-scrollbar">
        {sidebarSections.map(({ type, sections }) => {
          const section = (
            <SidebarSection
              key={type}
              sections={sections}
              type={type}
              leagueId={leagueId}
            />
          );

          if (section.type === "public") return section;

          return <Suspense key={type}>{section}</Suspense>;
        })}
      </SidebarContent>
      <SidebarFooter className="hidden lg:block lg:border lg:border-border">
        <Suspense>
          <UserDropdown userPromise={getUser()} />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}

async function SidebarSection({
  sections,
  type,
  leagueId,
}: {
  sections: (typeof sidebarSections)[number]["sections"];
  type?: "public" | "private" | "premium";
  leagueId: string;
}) {
  let isPremiumFeaturesUnlocked = true;

  switch (type) {
    case "private":
      const userId = await getUserId();
      if (!userId) return;

      if (!(await getLeagueAdmin(userId, leagueId))) return null;
      break;
    case "premium":
      isPremiumFeaturesUnlocked = await getLeaguePremium(leagueId);
      break;
  }

  return sections.map((section) => (
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

export type SidebarSection = {
  title: string;
  isPrivate?: boolean;
  items: {
    name: string;
    href: string;
    icon: React.ElementType;
    basePath?: string;
  }[];
};

export const publicSection: SidebarSection[] = [
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
        href: "/leagues/:leagueId/settings/general",
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

export const privateSection: SidebarSection[] = [
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

export const premiumSection: SidebarSection[] = [
  {
    title: "Gestione aste",
    items: [
      {
        name: "Crea asta",
        href: "/leagues/:leagueId/premium/auctions/create",
        icon: DatabaseScriptPlus,
      },
      {
        name: "Aste della lega",
        href: "/leagues/:leagueId/premium/auctions",
        icon: Hammer,
        basePath: "/leagues/:leagueId/premium/auctions",
      },
    ],
  },
];

export const sidebarSections = [
  { sections: publicSection, type: "public" },
  { sections: privateSection, type: "private" },
  { sections: premiumSection, type: "premium" },
] as const;
