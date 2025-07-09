type Props = {
  homeScore?: string;
  awayScore?: string;
  isHomeWinner: boolean;
  isAwayWinner: boolean;
};

function Score({ homeScore, awayScore, isHomeWinner, isAwayWinner }: Props) {
  if (!homeScore && !awayScore) return null;

  return (
    <div className="text-sm text-gray-400">
      <span className={isHomeWinner ? "font-extrabold text-white" : ""}>
        {homeScore || "-"}
      </span>
      <span className="mx-2">-</span>
      <span className={isAwayWinner ? "font-extrabold text-white" : ""}>
        {awayScore || "-"}
      </span>
    </div>
  );
}
