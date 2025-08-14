import { AuctionWithCreator } from "../queries/auction";
import AuctionCard from "./AuctionCard";

type Props = {
  leagueId: string;
  auctions: AuctionWithCreator[];
  isLeagueAdmin?: boolean;
  selectedSplit: { status: string };
};

export default function AuctionsList({
  leagueId,
  auctions,
  isLeagueAdmin = false,
  selectedSplit,
}: Props) {
  const groupedAuctions = Object.groupBy(auctions, (match) => match.type);

  return (
    <div className="space-y-8">
      {Object.entries(groupedAuctions).map(([type, auctions]) => {
        if (!auctions?.length) return null;

        return (
          <section key={type} className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {sectionTitles[type as keyof typeof sectionTitles]}
            </h2>

            <div className="space-y-3">
              {auctions.map((auction) => (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                  leagueId={leagueId}
                  isLeagueAdmin={isLeagueAdmin}
                  canEdit={selectedSplit.status !== "ended"}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

const sectionTitles = {
  classic: "Classica",
  repair: "Di riparazione",
};
