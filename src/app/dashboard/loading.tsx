import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[140px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-[100px]" />
          <Skeleton className="h-9 w-[120px]" />
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[80px] w-full rounded-xl" />
        ))}
      </div>

      {/* Chart */}
      <Skeleton className="h-[220px] w-full rounded-xl" />

      {/* Session list */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-[140px]" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
