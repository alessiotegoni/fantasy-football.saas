"use client";

import { toast } from "sonner";
import { ComponentProps, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { League } from "../queries/league";

type Props = {
  league: League;
} & ComponentProps<typeof Button>;

export function InviteButton({ league, children, ...props }: Props) {
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
    <Button onClick={handleShare} {...props}>
      {children}
    </Button>
  );
}
