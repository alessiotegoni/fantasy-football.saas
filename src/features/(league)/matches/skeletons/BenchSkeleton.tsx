import { Skeleton } from "@/components/ui/skeleton";
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
        <h2 className="mb-2">Panchina</h2>
        <div className="space-y-2">
          <BenchPlayersSkeletons />
        </div>
      </Skeleton>
    </>
  );
}

function BenchPlayersSkeletons() {
  return Array.from({ length: 8 }).map((_, i) => (
    <div className="flex gap-2 min-h-11" key={i}>
      <Skeleton className="bg-muted size-10 rounded-full shrink-0" />
      <div className="w-full">
        <Skeleton className="w-full h-4 bg-muted mb-1.5 rounded-sm" />
        <Skeleton className="w-1/2 h-4 bg-muted rounded-sm" />
      </div>
    </div>
  ));
}
