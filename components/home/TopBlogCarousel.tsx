import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import prisma from "@/prisma/db";
import Image from "next/image";
import { Calendar, Eye, Heart } from "lucide-react";

function formatDate(dateString: Date) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US");
}

export default async function TopBlogCarousel() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
  });
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="py-2">Top Blogs Today</h1>

      <SignedIn />
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {posts.map((post) => (
            <CarouselItem key={post.id}>
              <div className="p-1">
                <Card>
                  <CardHeader className="border-b mx-2">
                    <h1 className="font-bold text-2xl">{post.title}</h1>
                    <div className="flex h-full bg-slate-100 dark:bg-gray-900 dark:text-gray-300 rounded-full w-fit  pr-2 items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Image
                          className="rounded-full"
                          alt="user"
                          src={post.author.image_url || ""}
                          width={25}
                          height={25}
                        ></Image>
                        <p>{post.author.username}</p>
                      </div>
                      <div className="flex items-center gap-2  min-w-fit">
                        <Calendar size={18} /> {formatDate(post.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {" "}
                      <div className="flex items-center gap-2  min-w-fit">
                        <Eye size={18} /> {post.views}
                      </div>
                      <div className="flex items-center gap-2  min-w-fit">
                        <Heart size={18} /> {post.likes}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex aspect-square   p-6">
                    <p className="">{post.description}</p>
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
  );
}
