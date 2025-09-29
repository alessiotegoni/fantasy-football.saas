import LinkButton from "@/components/LinkButton";
import { Match } from "../../admin/calendar/regular/queries/calendar";
import MatchCard from "../../matches/components/MatchCard";
import { ComponentProps } from "react";

type Props = {
  leagueId: string;
  match: Match;
  buttonProps: Omit<ComponentProps<typeof LinkButton>, "href">;
};

export default function LeagueMatchCard({
  leagueId,
  match,
  buttonProps,
}: Props) {
  return (
    <div className="w-full">
      <MatchCard
        {...match}
        leagueId={leagueId}
        isLink={false}
        className="bg-transparent"
      />
      <LinkButton
        href={`/league/${leagueId}/matches/${match.id}`}
        {...buttonProps}
      >
        {buttonProps.children}
      </LinkButton>
    </div>
  );
}
