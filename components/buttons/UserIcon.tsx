import Image from "next/image";
import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import { FaSignOutAlt } from "react-icons/fa";

import { RxAvatar } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import prisma from "@/prisma/db";
import { signOut } from "@/app/login/actions";

export default async function UserIcon() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userExists = await prisma.author.findUnique({
    where: {
      email: user?.email,
    },
  });

  return (
    <div className="z-10">
      {!user ? (
        <Button>Sign In</Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              className="flex  items-center z-[100]"
              variant={"ghost"}
              size={"icon"}
            >
              <div className="flex items-center space-x-2">
                {userExists?.image_url && (
                  <Image
                    className="rounded-full"
                    src={userExists?.image_url}
                    alt="User image"
                    width={30}
                    height={30}
                  />
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer flex ">
              <Link className="flex items-center" href="/account">
                {userExists?.image_url && (
                  <Image
                    className="rounded-full mr-1"
                    src={userExists?.image_url}
                    alt="User image"
                    width={15}
                    height={15}
                  />
                )}
                <span>{userExists?.username || "Loading..."}</span>
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem className="cursor-pointer flex"> // item disabled as its a clerk leftover
              <Link className="flex items-center" href="/account">
                <CiSettings className="mr-1" />
                Account
              </Link>
            </DropdownMenuItem> */}
            <DropdownMenuItem className="cursor-pointer flex">
              <Link
                className="flex items-center"
                href={`/profile/${userExists?.username}`}
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
              <form>
                <Button variant={"outline"} formAction={signOut}>
                  {" "}
                  <FaSignOutAlt color="red" className="mr-1" />{" "}
                  <p className="text-red-500">Sign Out</p>
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
