import { SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

const SignInManager = () => {
  return (
    <>
      <SignedOut>
        <Button>
          <SignInButton />
        </Button>
      </SignedOut>
      <SignedIn>
        <Button variant={"secondary"}>
          {" "}
          <UserButton showName />
        </Button>
      </SignedIn>
    </>
  );
};
export default SignInManager;
