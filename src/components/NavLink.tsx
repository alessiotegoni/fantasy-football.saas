"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentPropsWithoutRef } from "react";
import { Button } from "./ui/button";

type Props = {
  render?: ({
    isActive,
    href,
  }: {
    isActive: boolean;
    href: string;
  }) => React.ReactNode;
  activeBasePath?: string;
} & ComponentPropsWithoutRef<typeof Link>;

export default function NavLink({
  href,
  activeBasePath,
  children,
  className,
  render,
}: Props) {
  const pathname = usePathname();

  const basePath = activeBasePath || href;
  const isActive = pathname === basePath || pathname.startsWith(`${basePath}/`);

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
