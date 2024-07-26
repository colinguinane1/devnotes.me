"use client";
import { UserProfile } from "@clerk/nextjs";
import prisma from "@/prisma/db";
import { useUser } from "@clerk/nextjs";
export default function AccountPage() {
  const clerkUser = useUser();

  return (
    <main className="grid  h-screen overflow-y-auto place-items-center">
      <div className="overflow-y-auto">
        <h1 className="text-center py-3">UUID: {clerkUser.user?.id}</h1>
        <h1 className="text-center py-3  text-wrap">
          IMG:
          <p className="max-w-10 text-wrap">
            {clerkUser.user?.imageUrl.toString()}
          </p>
        </h1>
        <UserProfile></UserProfile>
      </div>
    </main>
  );
}
