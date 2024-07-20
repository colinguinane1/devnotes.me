import {
  SignInButton,
  SignedOut,
  SignedIn,
  UserButton,
  SignOutButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import { FaSignOutAlt } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function SignInManager() {
  const user = await currentUser();
  const userImage = await user?.imageUrl;
  return (
    <>
      <SignedOut>
        <Button>
          <SignInButton>Sign In</SignInButton>
        </Button>
      </SignedOut>
      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="secondary">
              <div className="flex items-center space-x-2">
                {userImage && (
                  <Image
                    className="rounded-full"
                    src={userImage}
                    alt="User image"
                    width={30}
                    height={30}
                  />
                )}
                <span>{user?.fullName}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem className="cursor-pointer flex">
              <Link className="flex items-center" href="/account">
                <CiSettings className="mr-1" />
                Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <CiBookmark className="mr-1" />
              Blogs
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <FaSignOutAlt color="red" className="mr-1" />
              <SignOutButton>
                <p className="text-red-500">Sign Out</p>
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>
    </>
  );
}
