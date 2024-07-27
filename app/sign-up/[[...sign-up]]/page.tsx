import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid h-[80vh] place-items-center">
      <SignUp />
    </div>
  );
}
