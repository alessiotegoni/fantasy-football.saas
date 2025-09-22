import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useMyLineup from "@/hooks/useMyLineup";
import { cn } from "@/lib/utils";
import { LineupPlayer } from "../queries/match";
import { formatPlural } from "@/utils/formatters";

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
  const allBonusMaluses = bonusMaluses.flatMap((bm) =>
    Array.from({ length: bm.count }, () => bm)
  );
  const visibleIcons = allBonusMaluses.toReversed().slice(0, 2);
  const hiddenCount = allBonusMaluses.length - visibleIcons.length;

  return (
    <DialogTrigger
      className={cn(
        "absolute flex-col items-center justify-center -space-y-1 -top-5 -right-2 cursor-pointer",
        className
      )}
    >
      {visibleIcons.map((bm, i) => (
        <img key={i} src={bm.imageUrl} alt={bm.name} className="size-6" />
      ))}
      {hiddenCount > 0 && (
        <div
          className="rounded-full bg-muted size-5 text-[10px]
        grid place-content-center font-heading z-50"
        >
          +{hiddenCount}
        </div>
      )}
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
        <DialogTitle>Tutti bonus e malus</DialogTitle>
        <DialogDescription>
          Questi bonus/malus verrano sommati/sotratti al voto del giocatore
        </DialogDescription>
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
    <div
      className="flex items-center justify-between gap-4
     border-b border-muted pb-2 last:border-none last:pb-0"
    >
      <div className="flex items-center gap-3">
        <img
          src={bonusMalus.imageUrl}
          alt={bonusMalus.name}
          className="size-10"
        />
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
          {totalPoints > 0 ? `+${totalPoints}` : totalPoints}{" "}
          {formatPlural(
            totalPoints === -1 ? 1 : totalPoints,
            { plural: "punti", singular: "punto" },
            { includeCount: false }
          )}
        </p>
      </div>
    </div>
  );
}
