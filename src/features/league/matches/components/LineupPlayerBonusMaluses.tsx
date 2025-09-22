import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useMyLineup from "@/hooks/useMyLineup";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { LineupPlayer } from "../queries/match";

type BonusMalus = LineupPlayer["bonusMaluses"][number];

type Props = {
  className?: string;
} & Pick<LineupPlayer, "bonusMaluses">;

export default function LineupPlayerBonusMaluses(props: Props) {
  const { leagueBonusMalus } = useMyLineup();

  if (!props.bonusMaluses.length) return null;

  return (
    <Dialog>
      <BonusMalusTrigger {...props} />
      <BonusMalusesDialogContent
        {...props}
        leagueBonusMalus={leagueBonusMalus}
      />
    </Dialog>
  );
}

type BonusMalusTriggerProps = {
  bonusMaluses: BonusMalus[];
  className?: string;
};

function BonusMalusTrigger({
  bonusMaluses,
  className,
}: BonusMalusTriggerProps) {
  return (
    <DialogTrigger asChild>
      <div
        className={cn(
          "absolute -top-2 -right-2 flex cursor-pointer",
          className
        )}
      >
        {bonusMaluses.map((bm, i) => (
          <div
            key={bm.id}
            className="relative h-6 w-6"
            style={{
              zIndex: bonusMaluses.length - i,
              marginLeft: i > 0 ? "-8px" : 0,
            }}
          >
            <Image
              src={bm.imageUrl}
              alt={bm.name}
              fill
              className="rounded-full border-2 border-background"
            />
          </div>
        ))}
      </div>
    </DialogTrigger>
  );
}

type BonusMalusesDialogContentProps = {
  bonusMaluses: BonusMalus[];
  leagueBonusMalus: Record<number, number>;
};

function BonusMalusesDialogContent({
  bonusMaluses,
  leagueBonusMalus,
}: BonusMalusesDialogContentProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Dettaglio Bonus e Malus</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {bonusMaluses.map((bm) => (
          <BonusMalusDetails
            key={bm.id}
            bonusMalus={bm}
            points={leagueBonusMalus[bm.id] ?? 0}
          />
        ))}
      </div>
    </DialogContent>
  );
}

type BonusMalusDetailsProps = {
  bonusMalus: BonusMalus;
  points: number;
};

function BonusMalusDetails({ bonusMalus, points }: BonusMalusDetailsProps) {
  const totalPoints = points * bonusMalus.count;
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="relative h-6 w-6">
          <Image
            src={bonusMalus.imageUrl}
            alt={bonusMalus.name}
            fill
            className="rounded-full"
          />
        </div>
        <span className="font-medium">{bonusMalus.name}</span>
      </div>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">x{bonusMalus.count}</p>
        <p
          className={cn(
            "font-semibold",
            totalPoints > 0 ? "text-green-500" : "text-red-500"
          )}
        >
          {totalPoints > 0 ? `+${totalPoints}` : totalPoints} punti
        </p>
      </div>
    </div>
  );
}
