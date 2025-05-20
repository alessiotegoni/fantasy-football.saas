"use client";

import { ArrowLeft } from "iconoir-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Button> {
  backTo?: string;
}

export default function BackButton({ backTo, className = "w-fit text-white" }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/login") return null;

  const content = (
    <>
      <ArrowLeft className="size-4" />
      <p>Indietro</p>
    </>
  );

  return backTo ? (
    <Button variant="link" className={className} asChild>
      <Link href={backTo}>{content}</Link>
    </Button>
  ) : (
    <Button variant="ghost" className={className} onClick={() => router.back()}>
      {content}
    </Button>
  );
}
