import { SkeletonArray } from "@/components/Skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import PlayerSkeleton from "@/features/players/components/skeletons/PlayerSkeleton";
import { cn } from "@/lib/utils";

export default function BenchSkeleton({ className }: { className?: string }) {
  return (
    <>
      <Skeleton className="size-full bg-input/30 rounded-4xl p-4">
        <h2 className="mb-4">Presidente</h2>
        <div className="size-full flex flex-col items-center gap-2.5">
          <Skeleton className="bg-muted size-12 rounded-full shrink-0" />
          <div className="mb-1 w-full">
            <Skeleton className="w-full h-5 bg-muted rounded-md" />
            <Skeleton className="w-1/2 mx-auto h-5 bg-muted rounded-sm mt-1.5" />
          </div>
        </div>
      </Skeleton>
      <Skeleton
        className={cn(
          "bg-input/30 rounded-3xl min-h-[500px] border-border p-4",
          className
        )}
      >
        <h2 className="mb-3">Panchina</h2>
        <div className="space-y-2">
          <SkeletonArray amount={8}>
            <PlayerSkeleton />
          </SkeletonArray>
        </div>
      </Skeleton>
    </>
  );
}
