import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { getMetadataFromUser } from "../utils/user";
import {
  ArrowSeparateVertical,
  DashboardSpeed,
  LogOut,
  NavArrowDown,
  Star,
  User as UserIcon,
} from "iconoir-react";
import { User } from "@supabase/supabase-js";
import { logout } from "@/features/auth/actions/login";
import Avatar from "@/components/Avatar";
import ActionButton from "@/components/ActionButton";

export default async function UserDropdown({
  user,
  variant = "sidebar",
}: {
  user?: User;
  variant?: "sidebar" | "topbar";
}) {
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownTrigger user={user} variant={variant} />

      <DropdownMenuContent align="end" className="w-52 rounded-xl">
        <DropdownMenuLabel>Account</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="group">
          <Link href="/dashboard/user/profile">
            <UserIcon className="size-4 group-hover:!text-white" /> Profilo
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="group">
          <Link href="/dashboard/user/premium">
            <Star className="size-4 group-hover:!text-white" /> Premium
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="group">
          <Link href="/dashboard">
            <DashboardSpeed className="size-4 group-hover:!text-white" />{" "}
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <ActionButton
          action={logout}
          variant="destructive"
          size="sm"
          className="justify-start !px-2 !py-1.5 gap-2 text-sm"
          redirectTo="/auth/login"
          isLeaguePrefix={false}
        >
          <LogOut className="size-4 text-white" /> Esci
        </ActionButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DropdownTrigger({
  user,
  variant,
}: {
  user: User;
  variant?: "sidebar" | "topbar";
}) {
  const { name, avatar_url } = getMetadataFromUser(user);

  const triggerClass =
    variant === "sidebar" ? "w-full px-3 py-2" : "p-0 m-0 rounded-full gap-1";

  return (
    <DropdownMenuTrigger
      className={`relative group flex justify-between rounded-xl items-center gap-3 ${triggerClass}`}
    >
      <div className="flex items-center gap-3">
        <Avatar
          imageUrl={avatar_url}
          name={name || "user avatar"}
          className="size-8"
          renderFallback={() =>
            (name?.charAt(0) ?? user.email?.charAt(0))?.toUpperCase()
          }
        />

        {variant === "sidebar" && (
          <div className="text-left">
            {name && <p className="text-sm font-medium">{name}</p>}
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}
      </div>
      {variant === "sidebar" ? (
        <ArrowSeparateVertical className="size-5" />
      ) : (
        <div
          className="bg-white rounded-full size-4 flex
          justify-center items-center absolute -bottom-2 -right-2"
        >
          <NavArrowDown
            className="group-data-[state=open]:rotate-180
             transition-transform size-3 text-black"
          />
        </div>
      )}
    </DropdownMenuTrigger>
  );
}
