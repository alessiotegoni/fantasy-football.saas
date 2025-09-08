import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SplitMatchday } from "@/drizzle/schema/splitMatchdays";
import { StatusBadge } from "./StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface SplitMatchdayCardProps {
  matchday: SplitMatchday;
  splitId: number;
}

export function SplitMatchdayCard({ matchday, splitId }: SplitMatchdayCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Matchday {matchday.number}</CardTitle>
        <StatusBadge status={matchday.status} />
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <p>Type: {matchday.type}</p>
          <p>Start: {format(new Date(matchday.startAt), "PPP p")}</p>
          <p>End: {format(new Date(matchday.endAt), "PPP p")}</p>
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
      </CardContent>
    </Card>
  );
}
