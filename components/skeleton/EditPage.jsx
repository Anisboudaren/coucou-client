// components/forms/BuildPageSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function BuildPageSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col gap-4 md:flex-row">
      <div className="bg-muted h-full w-full rounded-2xl border border-gray-300 p-6 md:w-1/3">
        <Skeleton className="mb-6 h-6 w-1/2" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="bg-muted h-full w-full rounded-2xl border border-gray-300 p-6 md:w-2/3">
        <Skeleton className="mb-6 h-6 w-1/2" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
