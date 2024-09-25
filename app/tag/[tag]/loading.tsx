import { Skeleton } from "@/components/ui/skeleton";

export default function TagPageSkeleton() {
  return (
    <div className="min-h-screen min-w-screen">
      <div className="p-4">
        <div className="flex items-center border-b py-4">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="grid gap-4 py-4">
          {/* Create multiple skeletons to simulate loading blog cards */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex gap-4">
              <Skeleton className="h-32 w-48" />
              <div className="flex-1">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
