"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentPropsWithoutRef } from "react";
import { Button } from "./ui/button";
import { Href } from "@/utils/helpers";

type Props = {
  href: Href;
  render?: ({
    isActive,
    href,
  }: {
    isActive: boolean;
    href: Href;
  }) => React.ReactNode;
  activeBasePath?: string;
  exact?: boolean;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href">;

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

function getBasePath(activeBasePath: string | undefined, href: Href) {
  const searchParamsIndex = href.indexOf("?");
  if (searchParamsIndex === -1) return activeBasePath || href;

  return activeBasePath || href.slice(0, searchParamsIndex);
}
