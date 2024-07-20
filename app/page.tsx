"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";

const Home = () => {
  const user = useUser();
  const plugin = React.useRef(Autoplay({ stopOnInteraction: true }));
  return (
    <div className="grid mt-[12rem] place-content-center h-40 text-4xl font-semibold">
      <h1 className="py-2">Your Top Blogs, {user.user?.firstName}.</h1>{" "}
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
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Home;
