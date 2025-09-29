import LinkButton from "@/components/LinkButton";
import { Match } from "../../admin/calendar/regular/queries/calendar";
import MatchCard from "../../matches/components/MatchCard";
import { ComponentProps } from "react";

type Props = {
  leagueId: string;
  match: Match;
  buttonProps: ComponentProps<typeof LinkButton>;
};

export default function LeagueMatchCard({
  leagueId,
  match,
  buttonProps,
}: Props) {
  return (
    <div className="w-full">
      <MatchCard {...match} leagueId={leagueId} isLink={false} />
      <LinkButton
        href={`/league/${leagueId}/matches/${match.id}`}
        className="w-full rounded-t-none"
        {...buttonProps}
      >
        {buttonProps.children}
      </LinkButton>
    </div>
  );
}