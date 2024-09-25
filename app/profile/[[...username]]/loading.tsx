import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePageLoading() {
  return (
    <div className="w-full p-4 min-h-screen mt-4 max-w-3xl mx-auto animate-pulse">
      <div className="flex items-center gap-6 ">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="flex flex-col items-center gap-4">
          <div className="mt-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
      </div>

      <Skeleton className="text-muted-foreground py-2 h-6 w-3/4 mt-4" />

      <div className="flex items-center gap-4 p-4 text-muted-foreground">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>

      <Skeleton className="p-4 m-4  py-4 h-12 rounded-full" />

      <div className="flex no-scrollbar overflow-x-auto items-center justify-center gap-4 whitespace-nowrap w-full py-4">
        <Skeleton className="h-10 w-24 rounded" />
        <Skeleton className="h-10 w-24 rounded" />
        <Skeleton className="h-10 w-24 rounded" />
        <Skeleton className="h-10 w-24 rounded" />
        <Skeleton className="h-10 w-24 rounded" />
      </div>

      <div className="p-4">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="grid gap-6">
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
