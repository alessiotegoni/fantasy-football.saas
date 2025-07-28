type Props = {
  homePoints: number;
  awayPoints: number;
  isHomeWinner: boolean;
  isAwayWinner: boolean;
};

export default function MatchPoints({
  homePoints,
  awayPoints,
  isHomeWinner,
  isAwayWinner,
}: Props) {
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
