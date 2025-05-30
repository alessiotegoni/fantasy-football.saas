import {
  Shield,
  Settings,
  UserPlus,
  Calculator,
  Calendar,
  Database,
  Refresh,
  User,
  List,
  LotOfCash,
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
import { isAuctionUnlocked } from "@/features/auctions/permissions/auction";
import LeagueDropdown from "./LeagueDropdown";
import UserDropdown from "@/features/users/components/userDropdown";
import { isLeagueAdmin } from "../permissions/league";
import { getUser, getUserId } from "@/features/users/utils/user";

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
        <SidebarSections
          sections={publicSections}
          sectionType="public"
          leagueId={leagueId}
        />
        <Suspense>
          <SidebarSections
            sections={privateSections}
            sectionType="private"
            leagueId={leagueId}
          />
        </Suspense>
        <Suspense>
          <SidebarSections
            sections={premiumSections}
            sectionType="premium"
            leagueId={leagueId}
          />
        </Suspense>
      </SidebarContent>
      <SidebarFooter className="hidden lg:block">
        <Suspense>
          <UserDropdown userPromise={getUser()} />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}

async function SidebarSections({
  sections,
  sectionType,
  leagueId,
}: {
  sections: (typeof publicSections)[number][];
  sectionType?: "public" | "private" | "premium";
  leagueId: string;
}) {
  switch (sectionType) {
    case "private":
      const userId = await getUserId();
      if (!userId) return;

      if (!(await isLeagueAdmin(userId, leagueId))) return null;
      break;
    case "premium":
      if (!(await isAuctionUnlocked(leagueId))) return null;
      break;
  }

  return sections.map((section) => (
    <SidebarGroup key={section.title} className="p-3">
      <SidebarGroupLabel className="font-heading text-lg mb-1">
        {section.title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {section.items.map((item) => (
            <SidebarItem key={item.name} item={item} leagueId={leagueId} />
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
        href: "/leagues/:leagueId/options/general",
        icon: Settings,
        basePath: "/leagues/:leagueId/options",
      },
      {
        name: "Partecipanti",
        href: "/leagues/:leagueId/participants",
        icon: User,
      },
    ],
  },
  {
    title: "Mercato",
    items: [
      {
        name: "Svincolati",
        href: "/leagues/:leagueId/free-agents",
        icon: UserPlus,
      },
      {
        name: "Listone",
        href: "/leagues/:leagueId/player-list",
        icon: List,
      },
      {
        name: "Scambi",
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
        href: "/leagues/:leagueId/calculate-matchday",
        icon: Calculator,
      },
      {
        name: "Genera calendario",
        href: "/leagues/:leagueId/generate-calendar",
        icon: Calendar,
      },
      {
        name: "Gestione rose",
        href: "/leagues/:leagueId/team-management",
        icon: Database,
      },
      {
        name: "Crediti",
        href: "/leagues/:leagueId/credits",
        icon: LotOfCash,
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
        href: "/leagues/:leagueId/profile",
        icon: Shield,
      },
      {
        name: "Impostazioni lega",
        href: "/leagues/:leagueId/options",
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
