import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SignInManager from "../buttons/SignInManager";
import { ModeToggle } from "../buttons/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { NavigationData } from "@/data/NavigationData";
import { Logo, siteName } from "@/data/NavigationData";
import { BiMenu } from "react-icons/bi";
import { Link } from "next-view-transitions";
import { MenuIcon } from "lucide-react";
import { RiMenu3Line } from "react-icons/ri";

const Sidebar = () => {
  return (
    <div className="block md:hidden">
      <Sheet>
        <SheetTrigger>
          <Button variant={"ghost"}>
            <RiMenu3Line size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[20rem]" side="right">
          <SheetHeader>
            <SheetTitle>
              <h1 className="text-left font-extrabold">
                {Logo} <span className="font-normal"></span>
                {siteName}
              </h1>
            </SheetTitle>
            <SheetDescription>
              <div className="flex gap-2 w-full h-full justify-between ">
                <div className=" gap-2  justify-between h-full w-full flex flex-col">
                  {NavigationData.map((nav, index) => (
                    <Button variant={"outline"} key={index}>
                      <Link href={nav.href}>{nav.name}</Link>
                    </Button>
                  ))}{" "}
                  <div className="h-full border-b"></div>
                  <div className="flex gap-2 justify-between items-center">
                    {" "}
                    <ModeToggle />
                    <SignInManager />
                  </div>
                </div>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
export default Sidebar;
