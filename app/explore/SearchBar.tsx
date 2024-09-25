"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { RxMagnifyingGlass } from "react-icons/rx";
import Loading from "@/components/ui/loader-spinner";

export default function ClientSearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (searchTerm) {
      router.push(`/explore/query=${searchTerm}`);
    }
    setLoading(false);
  };

  return (
    <div className="relative w-full">
      {loading ? (
        <Loading />
      ) : (
        <RxMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      )}

      <form onSubmit={handleSubmit}>
        <Input
          className="pl-10 rounded-full w-full"
          type="text"
          placeholder="Search for posts, authors, and more"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
    </div>
  );
}
