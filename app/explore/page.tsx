import prisma from "@/prisma/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Pencil } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import SamplePrismaUser from "@/data/SamplePrismaUser";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EditorRoot, EditorContent, useEditor } from "novel";
import { Post } from "@prisma/client";
import { Eye, Heart } from "lucide-react";
import blog from "../posts/[slug]/page";

export default async function ExplorePage() {
  const user = await currentUser();

  function formatDate(dateString: Date) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  }
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
  });

  const addViews = async (post: Post) => {
    post.views += 1;
    prisma.post.update({
      where: { id: post.id },
      data: { views: post.views },
    });
  };

  return (
    <>
      <div className="flex flex-col gap-2 p-4">
        {posts.map((post) => (
          <Card
            className="w-full h-[12rem] hover:bg-gray-100 dark:hover:bg-gray-900 transition-all truncate  pt-2"
            key={post.id}
          >
            <Link className="truncate" href={`/posts/${post.slug}`}>
              <CardContent>
                <div className="flex flex-col justify-between ">
                  <CardTitle className="capitalize py-1">
                    {post.title}
                  </CardTitle>{" "}
                  <div className="flex h-full bg-slate-100 dark:bg-gray-900 dark:text-gray-300 rounded-full w-fit  pr-2 items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Image
                        className="rounded-full"
                        alt="user"
                        src={post.author.image_url || ""}
                        width={25}
                        height={25}
                      ></Image>
                      <p>{post.author.username} -</p>
                    </div>
                    <div className="flex items-center gap-2  min-w-fit">
                      <Calendar size={18} /> {formatDate(post.createdAt)}
                    </div>
                    <div className="flex items-center gap-2  min-w-fit">
                      <Eye size={18} /> {post.views}
                    </div>
                    <div className="flex items-center gap-2  min-w-fit">
                      <Heart size={18} /> {post.likes}
                    </div>
                  </div>
                </div>
                <CardDescription className="truncate overflow-hidden">
                  <div
                    className="prose dark:prose-headings:text-white  dark:text-gray-200"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  ></div>
                </CardDescription>
              </CardContent>
            </Link>{" "}
          </Card>
        ))}{" "}
      </div>
    </>
  );
}
