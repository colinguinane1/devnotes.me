import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function ProfilePage({
  params,
}: {
  params: { username?: string[] };
}) {
  const username = params.username?.[0] || "";

  // Fetch user data from Prisma
  const user = await prisma.user.findUnique({
    where: { username },
  });

  // If user not found, return a 404 page
  if (!user) {
    return notFound();
  }

  return (
    <main className="grid h-screen overflow-y-auto place-items-center p-4">
      <div className="overflow-y-auto">
        <h1 className="text-center py-3 text-2xl font-bold">
          {user.first_name} {user.last_name}
        </h1>
        <img
          src={user.image_url || "/default-avatar.png"}
          alt="User Avatar"
          className="rounded-full"
          width={100}
          height={100}
        />
        <p className="text-center py-3">Username: {user.username}</p>

        {/* Add more user profile information as needed */}
      </div>
    </main>
  );
}
