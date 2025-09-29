import { SkeletonText } from "@/components/Skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlayerSkeleton() {
  return (
    <div className="flex gap-2 min-h-11">
      <Skeleton className="size-10 rounded-full shrink-0" />
      <SkeletonText rows={2} />
    </div>
  );
}
