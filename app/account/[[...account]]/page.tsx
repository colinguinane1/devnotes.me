"use client";
import { UserProfile } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
export default function AccountPage() {
  const user = useUser();
  return (
    <main className="grid  h-screen overflow-y-auto place-items-center">
      <div className="overflow-y-auto">
        <h1 className="text-center py-3">UUID: {user.user?.id}</h1>
        <UserProfile></UserProfile>
      </div>
    </main>
  );
}
