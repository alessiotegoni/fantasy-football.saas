"use client";

import { Banner } from "@/components/banner";
import { InviteButton } from "@/features/league/leagues/components/InviteButton";
import { RocketIcon } from "lucide-react";

export function InviteMembersBanner() {
  return (
    <Banner
      icon={<RocketIcon className="opacity-80" size={16} />}
      title="Invita nuovi membri"
      description="Copia il link d'invito e condividilo con chi vuoi per far entrare nuovi membri nella lega."
    >
      <InviteButton>Invita</InviteButton>
    </Banner>
  );
}
