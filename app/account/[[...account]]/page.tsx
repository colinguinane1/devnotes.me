import { UserProfile } from "@clerk/nextjs";
import prisma from "@/prisma/db";
import { useUser } from "@clerk/nextjs";
export default async function AccountPage() {
  const clerkUser = useUser();

  const account = await prisma.user.findUnique({
    where: { id: clerkUser.user?.id }, // Using Clerk's user ID to find the corresponding Prisma user
  });
  return (
    <main className="grid  h-screen overflow-y-auto place-items-center">
      <div className="overflow-y-auto">
        <h1 className="text-center py-3">UUID: {clerkUser.user?.id}</h1>
        <h1 className="text-center py-3  text-wrap">
          IMG: <h1>{account?.username}</h1>
          <p className="max-w-10 text-wrap">
            {clerkUser.user?.imageUrl.toString()}
          </p>
        </h1>
        <UserProfile></UserProfile>
      </div>
    </main>
  );
}
