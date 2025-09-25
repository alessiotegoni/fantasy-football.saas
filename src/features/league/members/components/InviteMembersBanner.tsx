import { Banner } from "@/components/banner";
import { InviteButton } from "@/features/league/leagues/components/InviteButton";
import { ShareAndroid } from "iconoir-react";

export default function InviteMembersBanner() {
  return (
    <Banner
      icon={<ShareAndroid className="text-white size-5" />}
      title="Invita nuovi membri"
      description="Nella lega devono essere presenti alemeno 4 squadre"
      className="mb-4 sm:mb-8"
    >
      <InviteButton variant="gradient" className="w-30">Invita</InviteButton>
    </Banner>
  );
}
