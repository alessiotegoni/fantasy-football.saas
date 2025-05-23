"use client";

import { ArrowLeft } from "iconoir-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Button> {
  backTo?: string;
}

export default function BackButton({
  backTo,
  className = "w-fit absolute left-2 top-2 text-white",
}: Props) {
  const router = useRouter();

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
