import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SplitMatchday } from "@/drizzle/schema/splitMatchdays";
import { StatusBadge } from "./StatusBadge";

interface SplitMatchdayCardProps {
  matchday: SplitMatchday;
  splitId: number;
}

export function SplitMatchdayCard({ matchday, splitId }: SplitMatchdayCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full"> {/* Mimics Card, changed to rounded-lg */}
      <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2"> {/* Mimics CardHeader */}
        <h3 className="text-xl font-semibold leading-none tracking-tight">Matchday {matchday.number}</h3> {/* Mimics CardTitle */}
        <StatusBadge status={matchday.status} />
      </div>
      <div className="p-6 pt-0"> {/* Mimics CardContent */}
        <div className="text-sm text-muted-foreground">
          <p>Type: {matchday.type}</p>
          <p>Start: {new Date(matchday.startAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</p>
          <p>End: {new Date(matchday.endAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</p>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="destructive" size="sm">
            Delete
          </Button>
          <Link href={`/admin/splits/${splitId}/matchdays/${matchday.id}/edit`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
