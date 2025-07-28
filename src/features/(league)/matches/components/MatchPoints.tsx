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
    return <div className="w-2 h-1 sm:w-3 sm:h-1.5 bg-primary rounded-full" />;
  }

  return (
    <div
      className="bg-primary/20 rounded-full
    px-3 sm:px-4.5 py-1 sm:py-1.5 mb-1.5 sm:mb-2"
    >
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
