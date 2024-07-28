import prisma from "@/prisma/db";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, Heart, HeartIcon } from "lucide-react";
import rehypePrettyCode from "rehype-pretty-code";
import { Post } from "@prisma/client";
import { Metadata } from "next";

export default async function blog({ params }: { params: { slug: string } }) {
  function formatDate(dateString: Date) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  }

  const blog = await prisma.post.findUnique({
    where: {
      slug: params.slug,
    },

    include: { author: true },
  });
  if (!blog) {
    return <p>Blog not found!</p>;
  }
  const metadata: Metadata = {
    title: blog.title,
    description: blog.description,
  };
  const addLikes = async (blog: Post) => {
    prisma.post.update({
      where: { id: blog.id },
      data: { views: (blog.views += 1) },
    });
  };
  addLikes(blog);

  return (
    <section className="p-4 py-8">
      <div>
        <div className="border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">{blog.title}</h1>
            <Button size={"icon"}>
              <HeartIcon></HeartIcon>
            </Button>
          </div>
          <div className="flex items-center my-2 gap-2">
            <Link className="my-2" href={`/profile/${blog.author.username}`}>
              <div className="flex h-full bg-slate-100 dark:bg-gray-900 dark:text-gray-300 rounded-full w-fit  pr-2 items-center gap-2">
                <div className="flex items-center gap-2">
                  <Image
                    className="rounded-full"
                    alt="user"
                    src={blog.author.image_url || ""}
                    width={25}
                    height={25}
                  ></Image>
                  <p>{blog.author.username} -</p>
                </div>
                <div className="flex items-center gap-2  min-w-fit">
                  <Calendar size={18} /> {formatDate(blog.updatedAt)}
                </div>
                <div className="flex items-center gap-2  min-w-fit">
                  <Eye size={18} /> {blog.views}
                </div>
                <div className="flex items-center gap-2  min-w-fit">
                  <Heart size={18} /> {blog.likes}
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div
          className="prose prose-code:language-javascript   dark:text-gray-400 dark:prose-headings:text-white mt-4"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        ></div>
      </div>
    </section>
  );
}
