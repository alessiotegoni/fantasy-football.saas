import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Split } from "../queries/split";

interface SplitCardProps {
  split: Split;
}

export function SplitCard({ split }: SplitCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{split.name}</CardTitle>
        <StatusBadge status={split.status} />
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <p>Start Date: {new Date(split.startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(split.endDate).toLocaleDateString()}</p>
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
      </CardContent>
    </Card>
  );
}
