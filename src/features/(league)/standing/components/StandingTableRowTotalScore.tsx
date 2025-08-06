import { cn } from "@/lib/utils";

type Props = {
  totalScore: string | null;
  isMaxScore: boolean;
  isMinScore: boolean;
  isDefaultStanding: boolean;
  className?: string;
};

export default function StandingTableRowTotalScore({
  totalScore,
  isMaxScore,
  isMinScore,
  isDefaultStanding,
  className,
}: Props) {
  return (
    <p
      className={cn(
        className,
        !isDefaultStanding && isMaxScore && "text-green-500",
        !isDefaultStanding && isMinScore && "text-destructive"
      )}
    >
      {formatTotalScore(totalScore)}
    </p>
  );
}

function formatTotalScore(score: string | null) {
  const number = parseFloat(score ?? "0");
  return Math.ceil(number);
}
