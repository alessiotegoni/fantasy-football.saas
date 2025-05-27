"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { getUserMetadata } from "../utils/user";
import {
  ArrowSeparateVertical,
  LogOut,
  NavArrowDown,
  Star,
  User as UserIcon,
} from "iconoir-react";
import { User } from "@supabase/supabase-js";
import { FormEvent, use, useState } from "react";
import ActionButton from "@/components/ActionButton";
import { logout } from "@/features/auth/actions/login";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";

export default function UserDropdown({
  userPromise,
  variant = "sidebar",
}: {
  userPromise: Promise<User | null>;
  variant?: "sidebar" | "topbar";
}) {
  const router = useRouter();

  const [isSigninOut, setIsSigninOut] = useState(false);

  const user = use(userPromise);
  if (!user) return;

  const username = getUserMetadata(user, "name");
  const avatarUrl = getUserMetadata(user, "avatar_url");

  async function handleLogout() {
    setIsSigninOut(true);
    await logout();

    router.push("/auth/login");
    setIsSigninOut(false);
  }

  const triggerClass =
    variant === "sidebar" ? "w-full px-3 py-2" : "p-0 m-0 rounded-full gap-1";

  return (
    <DropdownMenu open={isSigninOut ? true : undefined}>
      <DropdownMenuTrigger
        className={`relative group flex justify-between rounded-xl items-center gap-3 ${triggerClass}`}
      >
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={avatarUrl ?? ""} />
            <AvatarFallback className="uppercase">
              {username?.charAt(0) ?? user.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {variant === "sidebar" && (
            <div className="text-left">
              {username && <p className="text-sm font-medium">{username}</p>}
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
      <DropdownMenuContent align="end" className="w-52 rounded-xl">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="group">
          <Link href="/user/profile">
            <UserIcon className="size-4 group-hover:!text-white" /> Profilo
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="group">
          <Link href="/user/premium">
            <Star className="size-4 group-hover:!text-white" /> Premium
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SubmitButton
            onClick={handleLogout}
            loaderCircleClassName="!size-4 text-white"
            isLoading={isSigninOut}
            variant="destructive"
            size="sm"
            className="justify-start"
          >
            <LogOut className="size-4 text-white" /> Esci
          </SubmitButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
