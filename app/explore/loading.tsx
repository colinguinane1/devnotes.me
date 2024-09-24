import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="p-4 flex flex-col justify-center items-center gap-4 min-h-screen w-full">
      <section className="w-full max-w-2xl flex flex-col h-full items-center gap-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between w-full">
          <div>
            <Skeleton className="md:h-10 h-8 md:w-48 w-36" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        {/* Search bar skeleton */}
        <div className="relative w-full">
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Tags section skeleton */}
        <div className="border-b overflow-x-auto flex items-center gap-4 pb-4 no-scrollbar w-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-24 rounded-full" />
          ))}
        </div>

        {/* Search results skeleton */}
        <p>
          <Skeleton className="h-6 w-64" />
        </p>

        <p>
          <Skeleton className="h-6 w-64" />
        </p>

        {/* BlogCard skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4 bg-white shadow-md rounded-lg">
              <Skeleton className="h-48 w-full mb-4 rounded-lg" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ))}
        </div>

        {/* UserCard skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4 bg-white shadow-md rounded-lg">
              <Skeleton className="h-10 w-10 rounded-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
