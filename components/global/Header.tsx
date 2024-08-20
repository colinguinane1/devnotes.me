import Link from "next/link";

import { ModeToggle } from "../buttons/ThemeSwitcher";
import { NavigationData } from "@/data/NavigationData";
import Sidebar from "./Sidebar";

import { Logo } from "@/data/NavigationData";
import UserIcon from "../buttons/UserIcon";
import { Button } from "../ui/button";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/login/actions";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="fixed  w-screen   z-30 p-2    top-0 py-3 ">
      <div className="bg-opacity-85 bg-card/50  backdrop-blur-2xl relative  border rounded-lg p-2">
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
          <div className="flex items-center gap-2 z-10">
            <ModeToggle />
            <div className="">
              {user !== null ? (
                <>
                  <UserIcon />
                </>
              ) : (
                <Button>
                  <Link href="/login">Log In</Link>
                </Button>
              )}
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
}
