import Meteors from "../magicui/meteors";
import WordRotate from "../magicui/word-rotate";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, ArrowRightIcon } from "lucide-react";
import { siteName } from "@/data/SiteData";
import TypingAnimation from "../magicui/typing-animation";
import AnimatedShinyText from "../magicui/animated-shiny-text";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import WordPullUp from "../magicui/word-pull-up";
import DotPattern from "../magicui/dot-pattern";
import { FadeText } from "../magicui/fade-text";
import AnimatedGridPattern from "../magicui/animated-grid-pattern";
import { RxMagnifyingGlass } from "react-icons/rx";

export default function HeroLanding() {
  return (
    <div className="grid  w-screen place-content-center -mt-20 text-4xl font-semibold">
      <div className="z-10 flex pb-4  items-center justify-center"></div>{" "}
      <div>
        <div className="relative w-screen flex h-[600px] flex-col items-center justify-center overflow-hidden  ">
          <div
            className={cn(
              "group rounded-full   border  z-10  bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200  dark:bg-neutral-900 dark:hover:bg-neutral-800 "
            )}
          >
            <div className="">
              <AnimatedShinyText className="inline-flex z-10 items-center justify-center px-4 py-1 transition ease-out  hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                <Link href="/posts/introduction">
                  {" "}
                  <span>✨ Read our introduction</span>
                </Link>

                <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedShinyText>
            </div>
          </div>{" "}
          <div className="z-10">
            <p className="z-10 mt-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-black dark:text-white">
              <WordPullUp
                className="text-4xl font-bold tracking-[-0.02em] text-black dark:text-white md:text-7xl md:leading-[5rem]"
                words="Hello World! 👋"
              />
            </p>
            <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-black dark:text-white">
              <FadeText
                direction="up"
                className="text-2xl font-light tracking-[-0.02em]  text-black dark:text-white md:text-3xl md:leading-[5rem]"
                text="Let's get started on your next blog."
              />
            </p>
            <div className="flex justify-between gap-4 p-4 ">
              <Button
                className="flex items-center group z-[100] w-full gap-1"
                variant={"default"}
              >
                <Link href="/explore" className="flex items-center gap-1">
                  <RxMagnifyingGlass
                    className="group-hover:mr-1 transition-all group-hover:scale-125"
                    size={12}
                  />
                  Explore
                </Link>
              </Button>
            </div>
          </div>{" "}
          <AnimatedGridPattern
            numSquares={30}
            maxOpacity={0.1}
            duration={3}
            repeatDelay={1}
            className={cn(
              "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
              "inset-x-0 inset-y-[-30%]  h-[150%] skew-y-12"
            )}
          />
        </div>
      </div>
    </div>
  );
}
