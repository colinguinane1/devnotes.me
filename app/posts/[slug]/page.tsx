import prisma from "@/prisma/db";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BoldIcon,
  Calendar,
  Eye,
  EyeIcon,
  Heart,
  HeartIcon,
} from "lucide-react";
import { Metadata } from "next";

import { CiWarning } from "react-icons/ci";
import { incrementViews } from "@/lib/actions";
import BlogDropdown from "@/components/buttons/BlogDropdown";
import {
  PostLikedManager,
  RemovePostLikeManager,
} from "@/components/buttons/LikeManager";
import { calculateReadingTime, formatDate } from "@/data/SiteData";
import BlogNotFound from "@/components/global/BlogNotFound";
import { createClient } from "@/app/utils/supabase/server";
import { checkPostLiked, likePost, removeLike } from "./actions";

export default async function blog({ params }: { params: { slug: string } }) {
  const blog = await prisma.post.findUnique({
    where: {
      slug: params.slug,
    },

    include: { author: true },
  });
  if (!blog) {
    return <BlogNotFound />;
  }
  const postLiked = await checkPostLiked(blog.id);

  const supabase = createClient();

  // Get the logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const metadata: Metadata = {
    title: blog.title,
    description: blog.description,
  };

  incrementViews(blog.id);
  return (
    <section className="p-4  py-8 min-h-screen">
      <div>
        <div className="border-b ">
          <div className="flex  items-center">
            <h1 className="text-4xl pb-2 font-bold">{blog.title}</h1>
          </div>
          <div className="flex    p-2 w-full   justify-between items-center  gap-2">
            <div className="flex items-center gap-2">
              <Link
                className="flex items-center gap-2"
                href={`/profile/${blog.author.username}`}
              >
                <Image
                  className="rounded-full"
                  alt="user"
                  src={blog.author.image_url || ""}
                  width={32}
                  height={32}
                ></Image>
                <div className="text-sm">
                  <p>{blog.author.username}</p>{" "}
                  <p className="text-gray-400">{formatDate(blog.createdAt)}</p>
                </div>
              </Link>
            </div>{" "}
            <div className="flex items-center">
              {user ? (
                <div>
                  {postLiked ? (
                    <PostLikedManager postId={blog.id} />
                  ) : (
                    <RemovePostLikeManager postId={blog.id} />
                  )}
                </div>
              ) : (
                <Button size={"icon"}>
                  <Link href="/login">
                    <Heart />
                  </Link>
                </Button>
              )}
              <BlogDropdown slug={blog.slug} author={blog.author} />
            </div>
          </div>
        </div>{" "}
        <div className=" text-sm text-gray-400">
          <div className="justify-between mt-1 flex items-center">
            <div className="flex items-center gap-2">
              {" "}
              <p className="flex items-center gap-1">
                <EyeIcon size={15} />
                {blog.views}{" "}
              </p>
              <p className="flex items-center gap-1">
                <Heart size={15} />
                {blog.likes}{" "}
              </p>
            </div>
            <div>
              {" "}
              <p>{calculateReadingTime(blog.content)} minute read</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div
            className="prose text-black  dark:text-gray-400 dark:prose-headings:text-white "
            dangerouslySetInnerHTML={{ __html: blog.content }}
          ></div>
        </div>
      </div>
    </section>
  );
}
