import { Button } from "@/components/ui/button";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Image from "next/image";

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
    <main className=" overflow-y-auto  p-4">
      <div className="">
        <Image
          src={user.image_url || "/default-avatar.png"}
          alt="User Avatar"
          className="rounded-full"
          width={100}
          height={100}
        />
        <h1 className="  font-bold">
          {user.first_name} {user.last_name}
        </h1>

        <p className="text-center py-3">Username: {user.username}</p>

        {/* Add more user profile information as needed */}
      </div>
    </main>
  );
}
