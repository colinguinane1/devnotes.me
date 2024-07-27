import Meteors from "../magicui/meteors";
import WordRotate from "../magicui/word-rotate";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteName } from "@/data/NavigationData";

export default function HeroLanding() {
  return (
    <div className="grid mt-[1rem] w-screen place-content-center  text-4xl font-semibold">
      <div className="relative flex h-[500px] w-screen flex-col items-center justify-center overflow-hidden ">
        <Meteors number={20} />
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center md:text-8xl text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
          {siteName}
        </span>
        <p className="py-4 text-center">
          The blog <span className="gradient">for</span> developers,<br></br>{" "}
          <span className="gradient px-2">by </span>
          developers.
        </p>{" "}
        <div className="flex pb-4 justify-center items-center gap-2">
          <h1>No</h1>
          <WordRotate
            className="text-4xl bg-black rounded-full p-1 px-4 text-left font-bold text-white dark:text-black dark:bg-white"
            words={["Paywall", "Ads", "Algorithms"]}
          />
        </div>
        <div className="items-center gap-4 flex-col md:flex justify-center md:flex-row">
          <Button
            className="flex items-center w-[10rem] gap-1"
            variant={"outline"}
          >
            <Link href="/explore" className="flex items-center gap-1">
              Explore <ArrowRight size={12} />
            </Link>
          </Button>
          <Button className="w-[10rem]">
            <Link className="flex items-center gap-1" href="/sign-in">
              {" "}
              Get Started <ArrowRight size={12} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
