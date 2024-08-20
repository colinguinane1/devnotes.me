import { Button } from "@/components/ui/button";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatDate } from "@/data/NavigationData";

const prisma = new PrismaClient();

export default async function ProfilePage({
  params,
}: {
  params: { username?: string[] };
}) {
  const username = params.username?.[0] || "";

  // Fetch user data from Prisma
  const user = await prisma.author.findUnique({
    where: { username },
  });

  // If user not found, return a 404 page
  if (!user) {
    return notFound();
  }

  return (
    <main className=" overflow-y-auto min-h-screen  p-4">
      <div className="">
        <Image
          src={user.image_url || "/default-avatar.png"}
          alt="User Avatar"
          className="rounded-full"
          width={100}
          height={100}
        />
        <h1 className="font-bold text-2xl py-3">{user.username}</h1>
        <p>Joined on: {formatDate(user.created_at)}</p>
        <p>UUiD: {user.id}</p>
        <p>Email: {user.email}</p>
      </div>
    </main>
  );
}
