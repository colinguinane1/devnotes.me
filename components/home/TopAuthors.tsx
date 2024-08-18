import * as React from "react";
import prisma from "@/prisma/db";
import UserCard from "../global/UserCard";

export default async function TopAuthors() {
  const users = await prisma.author.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="w-full overflow-x-auto p-4">
      <h1 className="text-left text-2xl">Top Authors</h1>
      <div className="flex gap-4 py-4 overflow-x-auto overflow-y-hidden h-[17rem]">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
