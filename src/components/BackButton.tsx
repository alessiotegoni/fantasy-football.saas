"use client";

import { ArrowLeft } from "iconoir-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <Button variant="ghost" className="w-fit" onClick={() => router.back()}>
      <ArrowLeft className="size-4" />
      <p>Indietro</p>
    </Button>
  );
}
