import LinkButton from "@/components/LinkButton";
import { Match } from "../../admin/calendar/regular/queries/calendar";
import MatchCard from "../../matches/components/MatchCard";
import { ComponentProps } from "react";
import { Href } from "@/utils/helpers";

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
    <div className="w-full p-4 bg-input/50 rounded-2xl">
      {title && <h3 className="text-lg font-semibold text-left">{title}</h3>}
      <div className="w-full">
        <MatchCard
          {...match}
          leagueId={leagueId}
          className="bg-transparent"
        />
        <LinkButton
          href={`/league/${leagueId}/matches/${match.id}` as Href}
          className="w-full rouned-xl"
          {...buttonProps}
        >
          {buttonProps.children}
        </LinkButton>
      </div>
    </div>
  );
}
