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
        <UserButton showName />
      </SignedIn>
    </>
  );
};
export default SignInManager;
