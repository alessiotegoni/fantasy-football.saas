import { cn } from "@/lib/utils";

type Props = {
  leagueNamePromise: Promise<string>;
  className?: string;
};

export default async function LeagueName({
  leagueNamePromise,
  className,
}: Props) {
  const leagueName = await leagueNamePromise;

  return (
    <h2 className={cn("font-heading text-lg", className)}>{leagueName}</h2>
  );
}
