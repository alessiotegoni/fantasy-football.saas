import {
  Shield,
  Settings,
  Calculator,
  Calendar,
  Refresh,
  User as UserIcon,
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
import { League } from "../queries/league";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";

// FIXME: vedi sidebarSection e fixa perche ad ogni section va chiamate inutili,
// utilizzare solita tecnica ovvero come suspense utilizzare scheletro della sidebar
// e poi in suspenseBoundary fare i fetch che servono
// TODO: aggiungere a UserDropdown le sezioni private a seconda del ruolo (admin, content-creator, redazione)

type Props = {
  user?: User;
  league: League;
  isAdmin: boolean;
  leaguePremium: boolean;
};

export default function LeagueSidebar(props: Props) {
  return (
    <Sidebar>
      <SidebarHeader className="p-0">
        <LeagueDropdown {...props} />
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
        {sidebarSections.map(({ type, sections }) => (
          <SidebarSection
            key={type}
            sections={sections}
            type={type}
            {...props}
          />
        ))}
      </SidebarContent>
      <SidebarFooter className="hidden lg:block lg:border lg:border-border">
        <UserDropdown {...props} />
      </SidebarFooter>
    </Sidebar>
  );
}

async function SidebarSection({
  league,
  isAdmin,
  leaguePremium,
  sections,
  type,
}: {
  sections: (typeof sidebarSections)[number]["sections"];
  type?: "public" | "private" | "premium";
} & Props) {
  if (type === "private" && !isAdmin) return null;
  if (type === "premium" && !leaguePremium) return null;

  return sections.map((section) => (
    <SidebarGroup key={section.title} className="p-3">
      <SidebarGroupLabel
        className={cn(
          "font-heading text-lg mb-1",
          !leaguePremium &&
            `mb-0 bg-background rounded-2xl rounded-bl-none rounded-br-none
            px-5 flex-col items-start h-fit pt-4`
        )}
      >
        {!leaguePremium && (
          <div className="flex items-center gap-2 text-primary font-semibold mb-3">
            <Star className="size-5" />
            <p className="text-base">Premium</p>
          </div>
        )}
        {section.title}
      </SidebarGroupLabel>
      <SidebarGroupContent
        className={cn(
          !leaguePremium &&
            "p-2 bg-background rounded-2xl rounded-tl-none rounded-tr-none"
        )}
      >
        <SidebarMenu className={cn(!leaguePremium && "pointer-events-none")}>
          {section.items.map((item) => (
            <SidebarItem
              key={item.name}
              item={item}
              leagueId={league.id}
              showLink={leaguePremium}
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
    exact?: boolean;
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
        icon: UserIcon,
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
        exact: true,
      },
    ],
  },
];

export const sidebarSections = [
  { sections: publicSection, type: "public" },
  { sections: privateSection, type: "private" },
  { sections: premiumSection, type: "premium" },
] as const;
