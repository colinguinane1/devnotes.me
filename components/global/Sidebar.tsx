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

export default function Sidebar() {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size={"icon"}>
            <LucideMenu />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex flex-col justify-between h-full w-fit rounded-lg backdrop-blur-md bg-card/90"
        >
          <div className="flex flex-col gap-6">
            {NavigationData.map((nav) => (
              <SheetClose asChild>
                <Button variant={"outline"} type="submit">
                  <Link className="font-medium" href={nav.href}>
                    {nav.name}
                  </Link>
                </Button>
              </SheetClose>
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
