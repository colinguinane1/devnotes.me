import { SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import { BiMenu } from "react-icons/bi";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ModeToggle } from "./ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { User } from "@clerk/nextjs/server";

const Header = () => {
  const logoText = "<b/>";

  return (
    <div className="fixed w-full px-4 top-0 py-3 border-b">
      <ul className="flex items-center  text-lg font-semibold justify-between">
        <div className="">
          <h1 className="font-extrabold dark:text-secondary-dark text-primary-light ">
            {logoText}
          </h1>
        </div>
        <div className=" gap-6 hidden md:flex">
          {" "}
          <li>Home</li>
          <li>Explore</li>
          <li>Write</li>
        </div>
        <div className="hidden md:flex gap-10">
          <ModeToggle />
          <SignedOut>
            <Button>
              <SignInButton />
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>{" "}
        <button className="border md:hidden rounded-md">
          <BiMenu size={25} color="" />
        </button>
      </ul>
    </div>
  );
};

export default Header;
