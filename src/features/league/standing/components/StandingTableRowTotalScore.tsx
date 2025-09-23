import { cn } from "@/lib/utils";

type Props = {
  totalScore: number;
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
      {totalScore}
    </p>
  );
}
