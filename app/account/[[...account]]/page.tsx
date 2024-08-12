"use client";
import { UserProfile } from "@clerk/nextjs";
import prisma from "@/prisma/db";
import { useUser } from "@clerk/nextjs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
export default function AccountPage() {
  const clerkUser = useUser();

  return (
    <main className="grid  h-[110vh] overflow-y-auto place-items-center">
      <div className="overflow-y-auto">
        <UserProfile></UserProfile>
        <Alert className="my-4">
          <AlertTitle>User Id:</AlertTitle>
          <AlertDescription>{clerkUser.user?.id}</AlertDescription>
        </Alert>
      </div>
    </main>
  );
}
