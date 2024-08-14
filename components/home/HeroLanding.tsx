import Meteors from "../magicui/meteors";
import WordRotate from "../magicui/word-rotate";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, ArrowRightIcon } from "lucide-react";
import { siteName } from "@/data/NavigationData";
import TypingAnimation from "../magicui/typing-animation";
import AnimatedShinyText from "../magicui/animated-shiny-text";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import WordPullUp from "../magicui/word-pull-up";
import DotPattern from "../magicui/dot-pattern";
import { FadeText } from "../magicui/fade-text";
import AnimatedGridPattern from "../magicui/animated-grid-pattern";

export default function HeroLanding() {
  return (
    <div className="grid  w-screen place-content-center -mt-20 text-4xl font-semibold">
      <div className="z-10 flex pb-4  items-center justify-center"></div>{" "}
      <div>
        <div className="relative flex h-[500px]  w-screen flex-col items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl">
          <div
            className={cn(
              "group rounded-full  border  z-10  bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200  dark:bg-neutral-900 dark:hover:bg-neutral-800 "
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
            <div className="flex justify-between gap-4 py-8  mx-16">
              <Button
                className="flex items-center group z-[100] w-[10rem] gap-1"
                variant={"default"}
              >
                <Link href="/explore" className="flex items-center gap-1">
                  Learn More
                  <ArrowRight
                    className="group-hover:ml-1 transition-all scale-105"
                    size={12}
                  />
                </Link>
              </Button>
              <Button
                className="flex items-center group w-[10rem] gap-1"
                variant={"outline"}
              >
                <Link
                  href="/explore"
                  className="flex  text-black dark:text-white items-center gap-1"
                >
                  See Docs
                  <ArrowRight
                    className="group-hover:ml-1 transition-all scale-105"
                    size={12}
                  />
                </Link>
              </Button>
            </div>
          </div>
          <AnimatedGridPattern
            numSquares={30}
            maxOpacity={0.1}
            duration={3}
            repeatDelay={1}
            className={cn(
              "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
              "absolute top-0 left-0 w-full h-full z-0"
            )}
          />
        </div>
      </div>
      {/* <TypingAnimation
            className="lowercase pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-blue-500 to-blue-300 bg-clip-text text-center md:text-8xl text-6xl font-semibold leading-none text-transparent dark:from-white  dark:to-blue-500"
            text={`${siteName}.me`}
            duration={100}
          ></TypingAnimation>
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
            words={[
              "Paywall",
              "Ads",
              "Algorithms",
              "Cookies",
              "Trackers",
              "BS",
            ]}
          />
        </div>
        <div className="items-center gap-4 flex justify-center ">
          <Button
            className="flex items-center group w-[10rem] gap-1"
            variant={"default"}
          >
            <Link href="/explore" className="flex items-center gap-1">
              Explore{" "}
              <ArrowRight
                className="group-hover:ml-1 transition-all scale-105"
                size={12}
              />
            </Link>
          </Button>
          <Button className="w-[10rem] bg-blue-400 group hover:bg-blue-500">
            <Link
              className="flex items-center gap-1 dark:text-white"
              href="/sign-in"
            >
              {" "}
              Get Started{" "}
              <ArrowRight
                className="group-hover:ml-1 transition-all scale-105"
                size={12}
              />
            </Link>
          </Button> */}
    </div>
  );
}
