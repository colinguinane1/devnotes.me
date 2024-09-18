import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-background -mt-1 animate-pulse">
      {/* Blog cover image skeleton */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
        {/* Title Skeleton */}
        <Skeleton className="h-10 w-3/4 mb-4" />

        {/* Tags Skeleton */}
        <div className="flex space-x-2 mb-6">
          <Skeleton className="h-6 w-16 rounded" />
          <Skeleton className="h-6 w-16 rounded" />
        </div>

        {/* Blog content Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-4/6 rounded" />
        </div>

        {/* Comments section skeleton */}
        <div className="mt-12">
          <Skeleton className="h-8 w-1/4 mb-6" />
          <div className="space-y-6">
            <div className="flex space-x-4 items-center">
              {/* Avatar Skeleton */}
              <Skeleton className="h-10 w-10 rounded-full" />
              {/* Author name & date skeleton */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4 rounded" />
                <Skeleton className="h-3 w-1/6 rounded" />
              </div>
            </div>
            <Skeleton className="h-4 w-full rounded" />
          </div>
        </div>
      </div>

      {/* Author card skeleton */}
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16 flex justify-center">
        <div className="w-full max-w-md bg-card p-4 rounded-lg hover:shadow-2xl shadow shrink-0">
          <div className="flex bg items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            </div>
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
