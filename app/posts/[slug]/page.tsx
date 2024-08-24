import prisma from "@/prisma/db";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "next-view-transitions";
import {
  ArrowRight,
  BoldIcon,
  Calendar,
  Eye,
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
import { formatDate } from "@/data/SiteData";
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

  const metadata: Metadata = {
    title: blog.title,
    description: blog.description,
  };

  incrementViews(blog.id);
  return (
    <section className="p-4 py-8 min-h-screen">
      <div>
        <div className="border-b">
          <div className="flex  items-center">
            <h1 className="text-4xl pb-2 font-bold">{blog.title}</h1>
          </div>
          <div className="flex    p-2 w-full   justify-between items-center pr-4 gap-2">
            <div className="flex items-center gap-2">
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
            </div>{" "}
            <div className="flex items-center">
              {postLiked ? (
                <PostLikedManager postId={blog.id} />
              ) : (
                <RemovePostLikeManager postId={blog.id} />
              )}
              <BlogDropdown slug={blog.slug} author={blog.author} />
            </div>
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
