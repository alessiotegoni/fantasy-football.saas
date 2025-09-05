import Link from "next/link";
import { NavArrowLeft, Search } from "iconoir-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>

        <h1 className="text-2xl font-heading mb-2">Lega non trovata</h1>
        <p className="text-muted-foreground mb-6">
          La lega che stai cercando non esiste o è privata.
        </p>

        <Button asChild variant="gradient" className="w-full mt-2">
          <Link href="/leagues/join/public">
            <NavArrowLeft className="size-5" />
            Torna alle leghe pubbliche
          </Link>
        </Button>
      </div>
    </div>
  );
}
