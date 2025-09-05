"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentPropsWithoutRef } from "react";
import { Button } from "./ui/button";
import { UrlObject } from "url";

type href =
  | __next_route_internal_types__.RouteImpl<
      UrlObject | __next_route_internal_types__.RouteImpl<unknown>
    >;

type Props = {
  render?: ({
    isActive,
    href,
  }: {
    isActive: boolean;
    href: href;
  }) => React.ReactNode;
  activeBasePath?: string;
  exact?: boolean;
} & ComponentPropsWithoutRef<typeof Link>;

export default function NavLink({
  href,
  activeBasePath,
  exact = false,
  children,
  className,
  render,
}: Props) {
  const pathname = usePathname();

  const basePath = getBasePath(activeBasePath, href);
  const isPathEqual = pathname === basePath;

  const isActive = exact
    ? isPathEqual
    : isPathEqual || pathname.startsWith(`${basePath}/`);

  if (render) return render({ isActive, href });

  return (
    <Button
      variant="link"
      asChild
      className={cn(
        isActive ? "text-primary" : "text-muted-foreground",
        className
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}

function getBasePath(activeBasePath: string | undefined, href: href) {
  const searchParamsIndex = href.indexOf("?");
  if (searchParamsIndex === -1) return activeBasePath || href;

  return activeBasePath || href.slice(0, searchParamsIndex);
}
