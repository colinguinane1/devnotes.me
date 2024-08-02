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
import { ArrowRight, Calendar, Eye, Heart } from "lucide-react";
import { Link } from "next-view-transitions";

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
    <div className="flex flex-col pb-20 px-4">
      <h1 className="py-2 font-semibold text-left">Top Blogs Today</h1>
      <SignedIn />
      <Carousel className="w-full border h-full rounded-md max-w-[17rem]  relative">
        <CarouselContent>
          {posts.map((post) => (
            <CarouselItem className="" key={post.id}>
              <Link href={`/posts/${post.slug}`}>
                {" "}
                <div className="">
                  <Card className="border-none group ">
                    {" "}
                    <div className="w-full h-full absolute bg-gradient-to-t from-secondary to-transparent">
                      <div
                        className=" flex gap-1 border-b border-primary  items-center bottom-4
                 right-10 absolute"
                      >
                        <p>Read More</p>
                        <ArrowRight
                          className="group-hover:mx-1 scale-105 transition-all"
                          size={15}
                        />
                      </div>
                    </div>
                    <CardHeader className="border-b mx-2">
                      <h1 className="font-bold text-xl">{post.title}</h1>
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
                      </div>{" "}
                      <div className="flex items-center gap-2  min-w-fit">
                        <Calendar size={18} /> {formatDate(post.createdAt)}
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
                    <CardContent className="flex aspect-square max-h-40 w-full   p-6">
                      <p
                        className="truncate prose dark:prose-headings:text-white dark:prose-strong:text-white text-xs"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      ></p>
                    </CardContent>
                  </Card>
                </div>
              </Link>{" "}
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselNext />
        <CarouselPrevious />
      </Carousel>
    </div>
  );
}
