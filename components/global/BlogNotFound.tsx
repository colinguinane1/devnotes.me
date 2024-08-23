import Link from "next/link";
import { CiWarning } from "react-icons/ci";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
export default function BlogNotFound() {
  return (
    <div className="grid h-[80vh] place-content-center">
      <div className="flex flex-col items-center justify-center">
        <CiWarning color="yellow" size={150}></CiWarning>
        <h1 className="font-semibold text-2xl pb-4">Blog not found!</h1>
        <p className="pb-4 text-center">
          Double check you&apos;re in the right place, or
          <Link
            className="font-bold justify-center underline items-center gap-1 flex"
            href="/support"
          >
            contact support <ArrowRight size={12} />
          </Link>
        </p>
        <Button className="flex items-center group w-[10rem] gap-1">
          <Link href="/explore" className="flex items-center gap-1">
            Explore{" "}
            <ArrowRight
              className="group-hover:ml-1 transition-all scale-105"
              size={12}
            />
          </Link>
        </Button>
      </div>
    </div>
  );
}
