"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Meteors from "@/components/magicui/meteors";
import WordRotate from "@/components/magicui/word-rotate";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import SamplePrismaUser from "@/data/SamplePrismaUser";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/data/NavigationData";

const Home = () => {
  const user = useUser();
  const plugin = React.useRef(Autoplay({ stopOnInteraction: true }));

  return (
    <div className="grid mt-[1rem] w-screen place-content-center  text-4xl font-semibold">
      <div className="relative flex h-[500px] w-screen flex-col items-center justify-center overflow-hidden ">
        <Meteors number={20} />
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center md:text-8xl text-7xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
          Blogchain
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
        <div className="w-[14rem] gap-4 flex justify-between items-center">
          <Button className="flex items-center gap-1" variant={"outline"}>
            <Link href="/explore" className="flex items-center gap-1">
              Explore <ArrowRight size={12} />
            </Link>
          </Button>
          <Button>
            <Link className="flex items-center gap-1" href="/sign-in">
              {" "}
              Get Started <ArrowRight size={12} />
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        {user.user ? (
          <h1 className="py-2">Your Top Blogs, {user.user?.firstName}.</h1>
        ) : (
          <h1 className="py-2">Top Blogs Today</h1>
        )}
        <SignedIn />
        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-xs"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">
                        Top Blog: {index + 1}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselNext />
            <CarouselPrevious />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default Home;
