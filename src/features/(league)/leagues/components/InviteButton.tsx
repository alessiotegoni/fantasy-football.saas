"use client";

import { ShareAndroid } from "iconoir-react";
import { toast } from "sonner";
import { use, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { League } from "../queries/league";

export function InviteButton({
  league
}: {
  league: League
}) {
  const [, setCopied] = useState(false);

  const inviteUrl = useMemo(() => {
    const privateLeagueUrl = `private?code=${league.joinCode}`;
    const publicLeagueUrl = `public/${league.id}`;

    return `${window.location.origin}/leagues/join/${
      league.visibility === "public" ? publicLeagueUrl : privateLeagueUrl
    }`;
  }, [league.id, league]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast.success("Link copiato!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Errore nel copiare il link");
    }
  }

  async function handleShare() {
    try {
      const message =
        `Unisciti alla mia lega.\n` +
        `👉 Link diretto: ${inviteUrl}` +
        (league?.password ? `\n🔒 Password: ${league.password}` : "");

      if (navigator.share) {
        await navigator.share({
          title: `Unisciti alla mia lega!`,
          text: message,
          url: inviteUrl,
        });
      } else {
        handleCopy();
        toast.info("Condivisione non supportata, link copiato!");
      }
    } catch (error) {
      toast.error("Condivisione annullata");
    }
  }

  return (
    <div className="flex gap-2 mt-2">
      <Button onClick={handleShare} className=" rounded-lg p-2.5">
        <ShareAndroid className="size-5" />
        Invita i tuoi amici!
      </Button>
    </div>
  );
}
