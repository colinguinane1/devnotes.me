import { UserProfile } from "@clerk/nextjs";
export default function AccountPage() {
  return (
    <main className="grid h-screen place-items-center">
      <UserProfile></UserProfile>
    </main>
  );
}
