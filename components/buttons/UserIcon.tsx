import {
  SignInButton,
  SignedOut,
  SignedIn,
  SignOutButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import { FaSignOutAlt } from "react-icons/fa";

import { RxAvatar } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import prisma from "@/prisma/db";

export default async function UserIcon() {
  const user = await currentUser();

  return (
    <div className="z-10">
      <SignedOut>
        <Button>
          <SignInButton>Sign In</SignInButton>
        </Button>
      </SignedOut>
      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              className="flex border bg-gray-100 items-center z-[100]"
              variant={"ghost"}
              size={"icon"}
            >
              <div className="flex items-center space-x-2">
                {user?.imageUrl && (
                  <Image
                    className="rounded-full"
                    src={user.imageUrl}
                    alt="User image"
                    width={30}
                    height={30}
                  />
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer flex border-b ">
              <Link className="flex items-center" href="/account">
                {user?.imageUrl && (
                  <Image
                    className="rounded-full mr-1"
                    src={user.imageUrl}
                    alt="User image"
                    width={15}
                    height={15}
                  />
                )}
                <span>{user?.username || "Loading..."}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex">
              <Link className="flex items-center" href="/account">
                <CiSettings className="mr-1" />
                Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex">
              <Link
                className="flex items-center"
                href={`/profile/${user?.username}`}
              >
                <RxAvatar className="mr-1" />
                Profile
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
    </div>
  );
}
