import { SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import { BiMenu } from "react-icons/bi";
import Link from "next/link";
const Header = () => {
  const logoText = "<b/>";
  return (
    <nav className="px-4 py-3 border-b">
      <ul className="flex items-center  text-lg font-semibold justify-between">
        <div className="">
          <h1 className="font-extrabold">{logoText}</h1>
        </div>
        <div className=" gap-6 hidden md:flex">
          {" "}
          <li>Home</li>
          <li>Blogs</li>
          <li>Account</li>
        </div>
        <div className="hidden md:block">
          <SignedOut>
            <div className={`bg-black text-white p-1 px-4 rounded-md`}>
              <SignInButton />
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center justify-center scale-125">
              {" "}
              <UserButton />
            </div>
          </SignedIn>
        </div>{" "}
        <button className="border md:hidden rounded-md">
          <BiMenu size={25} color="" />
        </button>
      </ul>
    </nav>
  );
};

export default Header;
