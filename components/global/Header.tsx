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
import { Logo } from "@/data/NavigationData";

const Header = () => {
  return (
    <div className="fixed w-full  z-30 bg-secondary px-4 top-0 py-3 border-b">
      <ul className="flex items-center  text-lg font-semibold justify-between">
        <div className="">
          <Link href="/">
            <h1 className="font-extrabold dark:text-secondary-dark text-primary-light ">
              {Logo}
            </h1>
          </Link>
        </div>
        <div className=" gap-4  hidden md:flex">
          {NavigationData.map((nav, index) => (
            <Link
              className=" transition hover:text-primary-light hover:bg-slate-500 hover:bg-opacity-40 p-2 px-4 rounded-full hover:text-slate-100"
              key={index}
              href={nav.href}
            >
              {nav.name}
            </Link>
          ))}
        </div>
        <div className="hidden items-center md:flex gap-2">
          <ModeToggle />
          <SignInManager />
        </div>
        <Sidebar />
      </ul>
    </div>
  );
};

export default Header;
