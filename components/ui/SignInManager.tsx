import {
  SignInButton,
  SignedOut,
  SignedIn,
  UserButton,
  SignOutButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

export default async function SignInManager() {
  const user = await currentUser();
  const userImage = await user?.imageUrl;
  return (
    <>
      <SignedOut>
        <Button>
          <SignInButton />
        </Button>
      </SignedOut>
      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"secondary"}>
              {" "}
              <div className="flex gap-2 items-center">
                <h1>{user?.fullName}</h1>
                <Image
                  className="rounded-full"
                  //@ts-ignore
                  src={userImage}
                  alt="User image"
                  width={30}
                  height={30}
                ></Image>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Account Settings</DropdownMenuItem>
            <DropdownMenuItem>Your Blogs</DropdownMenuItem>
            <DropdownMenuItem>
              <SignOutButton></SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>
    </>
  );
}
