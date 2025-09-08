import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Split } from "@/drizzle/schema/splits";
import { StatusBadge } from "./StatusBadge";

interface SplitCardProps {
  split: Split;
}

export function SplitCard({ split }: SplitCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full"> {/* Mimics Card */}
      <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2"> {/* Mimics CardHeader */}
        <h3 className="text-2xl font-semibold leading-none tracking-tight">{split.name}</h3> {/* Mimics CardTitle */}
        <StatusBadge status={split.status} />
      </div>
      <div className="p-6 pt-0"> {/* Mimics CardContent */}
        <div className="text-sm text-muted-foreground">
          <p>Start Date: {new Date(split.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
          <p>End Date: {new Date(split.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="destructive" size="sm">
            Delete
          </Button>
          <Link href={`/admin/splits/${split.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
