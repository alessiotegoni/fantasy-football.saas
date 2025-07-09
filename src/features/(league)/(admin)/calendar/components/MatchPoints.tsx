type Props = {
  isMatchPlayed: boolean;
  homePoints: number;
  awayPoints: number;
  isHomeWinner: boolean;
  isAwayWinner: boolean;
};

export default function MatchPoints({
  isMatchPlayed,
  homePoints,
  awayPoints,
  isHomeWinner,
  isAwayWinner,
}: Props) {
  if (!isMatchPlayed) {
    return <span className="text-xl font-bold text-primary">-</span>;
  }

  return (
    <div className="bg-primary/20 rounded-full px-4.5 py-1.5 mb-2">
      <span className="text-xl font-bold text-primary">
        <span className={isHomeWinner ? "font-extrabold" : "font-bold"}>
          {homePoints}
        </span>{" "}
        -{" "}
        <span className={isAwayWinner ? "font-extrabold" : "font-bold"}>
          {awayPoints}
        </span>
      </span>
    </div>
  );
}
