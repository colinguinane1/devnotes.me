import { Link } from "next-view-transitions";

import { ModeToggle } from "../buttons/ThemeSwitcher";
import { NavigationData } from "@/data/NavigationData";
import Sidebar from "./Sidebar";

import SignInManager from "../buttons/SignInManager";
import { Logo } from "@/data/NavigationData";

const Header = () => {
  return (
    <div className="fixed w-full  z-30 bg-secondary px-2 top-0 py-3 border-b">
      <ul className="flex items-center  text-lg font-semibold justify-between">
        <div className="">
          <Link href="/">
            <h1 className="font-extrabold dark:text-secondary-dark text-primary-light text-blue-400">
              {Logo}
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
        <Sidebar />
      </ul>
    </div>
  );
};

export default Header;
