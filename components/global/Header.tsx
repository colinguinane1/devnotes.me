import { BiMenu } from "react-icons/bi";
import Link from "next/link";

import { ModeToggle } from "../buttons/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { NavigationData } from "@/data/NavigationData";
import Sidebar from "./Sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SignInManager from "../buttons/SignInManager";

const Header = () => {
  const logoText = "<b/>";

  return (
    <div className="fixed w-full bg-secondary px-4 top-0 py-3 border-b">
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
        <div className="hidden md:flex gap-2">
          <ModeToggle />
          <SignInManager />
        </div>
        <Sidebar />
      </ul>
    </div>
  );
};

export default Header;
