import { Skeleton } from "@/components/ui/skeleton";
import ClientSearchBar from "../SearchBar";

export default function Loading() {
  var hour = new Date().getHours();
  var greet;

  if (hour >= 5 && hour < 11) greet = "Good morning,";
  else if (hour >= 11 && hour < 18) greet = "Good afternoon,";
  else if (hour >= 18 && hour < 23) greet = "Good evening,";
  else if (hour === 23 || hour < 5) greet = "Good morning, ";
  return (
    <main className="p-4 flex flex-col justify-center items-center gap-4 min-h-screen w-full">
      <section className="w-full max-w-2xl flex flex-col h-full items-center gap-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="md:text-4xl text-2xl font-extrabold">{greet}</h1>
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        {/* Search bar skeleton */}
        <ClientSearchBar />

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
            <div key={index} className="p-4 bg-card shadow-md rounded-lg">
              <Skeleton className="h-48 w-full mb-4 rounded-lg" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ))}
        </div>

        {/* UserCard skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4 bg-card shadow-md rounded-lg">
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
