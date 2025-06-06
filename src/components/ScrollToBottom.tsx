"use client";

import { useEffect, useState } from "react";
import { NavArrowUp } from "iconoir-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type Props = {
  className?: string;
};

export function ScrollToTopButton({ className }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-25 lg:bottom-6 right-5 lg:right-6 z-50 p-3 rounded-full shadow-lg hover:shadow-xl transition w-fit",
        className
      )}
    >
      <NavArrowUp className="size-6" />
    </Button>
  );
}
