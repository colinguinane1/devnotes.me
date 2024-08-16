import prisma from "@/prisma/db";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { ArrowRight, Calendar, Eye, Heart, HeartIcon } from "lucide-react";
import { Metadata } from "next";

import { CiWarning } from "react-icons/ci";
import { incrementViews } from "@/lib/actions";
import LikeManager from "@/components/buttons/LikeManager";

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
  const metadata: Metadata = {
    title: blog.title,
    description: blog.description,
  };

  incrementViews(blog.id);
  return (
    <section className="p-4 py-8 min-h-screen">
      <div>
        <div className="border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">{blog.title}</h1>
            <LikeManager postId={blog.id} />
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
                  <Eye size={18} /> {blog.views + 1}
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
