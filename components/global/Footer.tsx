"use client";
import Link from "next/link";
import ShimmerButton from "../magicui/shimmer-button";
import { ArrowRight, ChevronRight } from "lucide-react";
import { NavigationData, siteVersion } from "@/data/SiteData";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { BsGithub } from "react-icons/bs";

export default function Footer() {
  const pathname = usePathname();
  return (
    <footer>
      <div className="flex text-gray-500 flex-col items-center justify-center p-4 bg-background border-t ">
        <p className="text-center flex items-center gap-6">
          © 2024 devnotes | All rights reserved.{" "}
        </p>
        <div className="flex gap-4 py-4">
          {NavigationData.map((nav) => (
            <Link href={nav.href} key={nav.href}>
              <Button
                variant={"ghost"}
                className={`${pathname === nav.href && "bg-card"} `}
              >
                {nav.name}
              </Button>
            </Link>
          ))}
        </div>
        <Link className=" flex items-center  gap-1" href="https://c-g.dev">
          <ShimmerButton className="flex text-xs dark:text-white items-center gap-1">
            A project by
            <span className="font-bold flex items-center gap-1">
              Colin <ChevronRight size={12} />
            </span>
          </ShimmerButton>
        </Link>{" "}
        <p className="pt-4">v{siteVersion}</p>
      </div>
    </footer>
  );
}
