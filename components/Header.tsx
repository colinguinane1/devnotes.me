"use client";
import { SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import { BiMenu } from "react-icons/bi";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";
import { ModeToggle } from "./ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { User } from "@clerk/nextjs/server";
import { NavigationData } from "@/data/NavigationData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const [open, setOpen] = useState(false);
  const logoText = "<b/>";

  const toggleOpen = () => {
    setOpen(!open);
  };
  return (
    <div className="fixed w-full px-4 top-0 py-3 border-b">
      <ul className="flex items-center  text-lg font-semibold justify-between">
        <div className="">
          <h1 className="font-extrabold dark:text-secondary-dark text-primary-light ">
            {logoText}
          </h1>
        </div>
        <div className=" gap-4 hidden md:flex">
          {NavigationData.map((nav, index) => (
            <Link
              className=" transition hover:underline"
              key={index}
              href={nav.href}
            >
              {nav.name}
            </Link>
          ))}
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
        </div>
        <div className="block md:hidden">
          <Sheet>
            <SheetTrigger>
              <Button>
                <BiMenu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Blogchain</SheetTitle>
                <SheetDescription>
                  <div className=" gap-2 flex flex-col">
                    {NavigationData.map((nav, index) => (
                      <Button key={index}>
                        <Link href={nav.href}>{nav.name}</Link>
                      </Button>
                    ))}{" "}
                    <DropdownMenuSeparator />
                    <div className="flex justify-between items-center">
                      {" "}
                      <ModeToggle />
                      <SignedOut>
                        <Button color="#BF00FF">
                          <SignInButton />
                        </Button>
                      </SignedOut>
                      <SignedIn>
                        <UserButton showName />
                      </SignedIn>
                    </div>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </ul>
    </div>
  );
};

export default Header;
