"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RiMenu2Line } from "react-icons/ri";
import { NavigationData } from "@/data/SiteData";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="block md:hidden z-10">
      {" "}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size="icon" className="outline-none">
            <RiMenu2Line size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-transparent backdrop-blur-lg"
          align="start"
        >
          {NavigationData.map((nav) => (
            <DropdownMenuItem
              className={`${pathname === nav.href && "bg-secondary"}`}
              key={nav.href}
            >
              <Link prefetch={false} href={nav.href}>
                {" "}
                {nav.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default Sidebar;
