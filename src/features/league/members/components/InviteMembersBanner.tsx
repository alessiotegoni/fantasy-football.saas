"use client";

import { Banner } from "@/components/banner";
import { InviteButton } from "@/features/league/leagues/components/InviteButton";
import { ShareAndroid } from "iconoir-react";

export function InviteMembersBanner() {
  return (
    <Banner
      icon={<ShareAndroid className="text-white size-5" />}
      title="Invita nuovi membri"
      description="Copia il link d'invito e condividilo con chi vuoi per far entrare nuovi membri nella lega."
      className="mb-4 sm:mb-8"
    >
      <InviteButton variant="gradient" className="w-30">Invita</InviteButton>
    </Banner>
  );
}
