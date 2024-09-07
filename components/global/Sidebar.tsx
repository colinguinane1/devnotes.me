import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { NavigationData } from "@/data/SiteData";

import { BsMenuButton } from "react-icons/bs";
import { CiMenuBurger } from "react-icons/ci";
import { LucideMenu } from "lucide-react";
import UserIcon from "../buttons/UserIcon";
import { ModeToggle } from "../buttons/ThemeSwitcher";
import Image from "next/image";

export default function Sidebar() {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="bg-card" size={"icon"}>
            <LucideMenu />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex flex-col justify-between h-full w-fit rounded-tr-lg rounded-br-lg backdrop-blur-md bg-card/90"
        >
          <div className="flex flex-col gap-6">
            <SheetHeader>
              <SheetTitle className="flex items-baseline gap-2">
                <Image
                  src="/icon8.png"
                  className="shadow-2xl rounded-lg"
                  width={30}
                  height={30}
                  alt={"logo"}
                ></Image>
                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                  devnotes.me
                </span>
              </SheetTitle>
            </SheetHeader>
            {NavigationData.map((nav) => (
              <Button
                className="bg-card"
                variant={"outline"}
                type="submit"
                key={nav.href}
              >
                <SheetClose asChild>
                  <Link className="font-medium w-full h-full" href={nav.href}>
                    {nav.name}
                  </Link>
                </SheetClose>
              </Button>
            ))}
          </div>
          <SheetFooter>
            <div className="flex items-center justify-between gap-2">
              <ModeToggle />
              <UserIcon />
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
