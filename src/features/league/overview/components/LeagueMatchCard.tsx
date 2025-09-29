import LinkButton from "@/components/LinkButton";
import { Match } from "../../admin/calendar/regular/queries/calendar";
import MatchCard from "../../matches/components/MatchCard";
import { ComponentProps } from "react";

type Props = {
  title?: string;
  leagueId: string;
  match: Match;
  buttonProps: Omit<ComponentProps<typeof LinkButton>, "href">;
};

export default function LeagueMatchCard({
  leagueId,
  match,
  buttonProps,
  title,
}: Props) {
  return (
    <div className="flex w-full flex-col items-center gap-2 p-4 bg-muted rounded-2xl">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <div className="w-full">
        <MatchCard
          {...match}
          leagueId={leagueId}
          isLink={false}
          className="bg-transparent"
        />
        <LinkButton
          href={`/league/${leagueId}/matches/${match.id}`}
          className="w-full rounded-t-none"
          {...buttonProps}
        >
          {buttonProps.children}
        </LinkButton>
      </div>
    </div>
  );
}
