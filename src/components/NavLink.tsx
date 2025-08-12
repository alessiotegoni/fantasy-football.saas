"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentPropsWithoutRef } from "react";
import { Button } from "./ui/button";

type Props = {
  href: string;
  render?: ({
    isActive,
    href,
  }: {
    isActive: boolean;
    href: string;
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

  if (render) return render({ isActive, href: href.toString() });

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

function getBasePath(activeBasePath: string | undefined, href: string) {
  const searchParamsIndex = href.indexOf("?");
  if (searchParamsIndex === -1) return activeBasePath || href;

  return activeBasePath || href.slice(0, searchParamsIndex);
}
