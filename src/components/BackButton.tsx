"use client";

import { ArrowLeft } from "iconoir-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { ComponentProps, use } from "react";

interface Props extends ComponentProps<typeof Button> {
  backTo?: string;
  showButton?: boolean | Promise<boolean>;
}

export default function BackButton({
  backTo,
  showButton = true,
  className = "w-fit absolute left-2 top-2 text-white",
}: Props) {
  const router = useRouter();
  // const pathname = usePathname();
  if (typeof showButton === "boolean" && !showButton) return null
  if (showButton instanceof Promise && !use(showButton)) return null

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
    <Button variant="link" className={className} onClick={() => router.back()}>
      {content}
    </Button>
  );
}
