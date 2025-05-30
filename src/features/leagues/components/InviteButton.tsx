"use client";

import { ShareAndroid } from "iconoir-react";
import { toast } from "sonner";
import { use, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  leagueCredentialsPromise: Promise<
    { joinCode: string; password: string | null } | undefined
  >;
};

export function InviteButton({ leagueCredentialsPromise }: Props) {
  const credentials = use(leagueCredentialsPromise);
  if (!credentials) return null;

  const [, setCopied] = useState(false);

  const inviteUrl = `${window.location.origin}/leagues/join/private?code=${credentials.joinCode}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast.success("Link copiato!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Errore nel copiare il link");
    }
  }

  async function handleShare() {
    try {
      const message =
        `Unisciti alla mia lega.\n\n` +
        `👉 Link diretto: ${inviteUrl}` +
        (credentials?.password ? `\n🔒 Password: ${credentials.password}` : "");

      if (navigator.share) {
        await navigator.share({
          title: `Unisciti alla mia lega "${name}"!`,
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
      {/* <Button
        onClick={handleCopy}
        variant="link"
        size="sm"
        className="flex-1/2 rounded-lg font-normal text-sm"
      >
        <Copy className="size-4" />
        {copied ? "Copiato!" : "Copia link"}
      </Button> */}
      <Button onClick={handleShare} className=" rounded-lg p-2.5">
        <ShareAndroid className="size-5" />
        Invita i tuoi amici!
      </Button>
    </div>
  );
}
