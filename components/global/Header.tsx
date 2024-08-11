import Link from "next/link";

import { ModeToggle } from "../buttons/ThemeSwitcher";
import { NavigationData } from "@/data/NavigationData";
import Sidebar from "./Sidebar";

import SignInManager from "../buttons/SignInManager";
import { Logo } from "@/data/NavigationData";

const Header = () => {
  return (
    <div className="fixed  w-screen   z-30 p-2    top-0 py-3 ">
      <div className="bg-card relative  border-b rounded-lg py-2 px-2 border-secondary">
        <ul className="flex items-center  text-lg font-semibold justify-between">
          <div className="hidden md:block ">
            <Link href="/">
              <h1 className="font-extrabold dark:text-secondary-dark text-primary-light text-blue-400">
                {Logo}
              </h1>
            </Link>
          </div>
          <Sidebar />
          <div className="absolute md:hidden flex items-center justify-center w-full">
            <Link href="/">
              <h1 className="font-extrabold dark:text-secondary-dark text-primary-light text-blue-400">
                devnotes
              </h1>
            </Link>
          </div>
          <div className=" gap-4  hidden md:flex">
            {NavigationData.map((nav, index) => (
              <Link
                className=" transition hover:text-blue-500 dark:hover:text-blue-300 dark:hover:bg-slate-700 hover:bg-slate-200 hover:bg-opacity-40 p-2 px-4 rounded-full "
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
        </ul>
      </div>
    </div>
  );
};

export default Header;
