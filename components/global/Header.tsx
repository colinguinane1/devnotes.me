import Link from "next/link";

import { ModeToggle } from "../buttons/ThemeSwitcher";
import { NavigationData } from "@/data/SiteData";
import Sidebar from "./Sidebar";

import { Logo } from "@/data/SiteData";
import UserIcon from "../buttons/UserIcon";
import { Button } from "../ui/button";
import { createClient } from "@/app/utils/supabase/server";
import { signOut } from "@/app/login/actions";
import Image from "next/image";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="fixed  w-screen  h-fit  z-30     top-0  ">
      <div className="bg-opacity-85 bg-card/20 border-b backdrop-blur-sm  relative h-fit   px-4 py-1">
        <ul className="flex items-center  text-lg font-semibold justify-between">
          <div className="flex md:hidden items-center gap-2 ">
            <Sidebar /> {!user && <UserIcon />}
          </div>{" "}
          <div className="flex items-center gap-2">
            <Link href="/" className="">
              <h1 className="font-extrabold dark:text-secondary-dark text-primary-light text-blue-400">
                <Image
                  className="rounded-md shadow-3xl"
                  src="/icon8.png"
                  alt="logo"
                  width={40}
                  height={40}
                  quality={100}
                />
              </h1>
            </Link>{" "}
            <div className=" hidden md:flex items-center gap-3">
              <ModeToggle />
            </div>{" "}
            <div className="mt-1 hidden md:flex">
              <UserIcon />
            </div>
          </div>
          <div className="absolute md:hidden flex items-center justify-center w-full">
            {/* <Link href="/">
              <h1 className="font-extrabold dark:text-secondary-dark text-primary-light text-blue-400">
                devnotes
              </h1>
            </Link> */}
          </div>
          <div className=" gap-4  hidden md:flex">
            {NavigationData.map((nav, index) => (
              <Link
                className=" transition hover:text-blue-500 dark:hover:text-blue-300 dark:hover:bg-slate-700 hover:bg-slate-200 hover:bg-opacity-40 p-2 px-4 rounded-md "
                key={index}
                href={nav.href}
              >
                {nav.name}
              </Link>
            ))}
          </div>
          {/* <div className="flex items-center gap-2 z-10">
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
          </div> */}
        </ul>
      </div>
    </div>
  );
}
