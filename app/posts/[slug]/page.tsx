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
import { Textarea } from "@/components/ui/textarea";

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
import { ClockIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import VerifiedUser from "@/components/ui/verified";

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
    <div className="container  mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
      <div className="grid grid-cols-1   md:grid-cols-[2fr_1fr] gap-8 md:gap-12">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">
                {calculateReadingTime(blog.content)} minute read
              </span>
            </div>
            <div className="flex items-center gap-2">
              <HeartIcon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{blog.likes}</span>
            </div>
            <div className="flex items-center gap-2">
              <EyeIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{blog.views} views</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {blog.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            {blog.description}
          </p>
          <article className="prose min-h-[60vh] dark:prose-invert">
            <p dangerouslySetInnerHTML={{ __html: blog.content }}></p>
          </article>
        </div>
        <div className="mt-8 bg-card rounded-lg p-6 md:p-8 lg:p-10 space-y-4">
          <h3 className="text-lg font-semibold">Leave a Comment</h3>
          <div className="flex gap-2">
            <Textarea
              placeholder="Write your comment..."
              className="flex-1 min-h-[100px]"
            />
            <Button>Submit</Button>
          </div>
        </div>
        <div className="bg-card h-fit rounded-lg p-6 md:p-8 lg:p-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {blog.author.image_url && (
                <Avatar className="w-10 h-10">
                  <AvatarImage src={blog.author.image_url} alt="@shadcn" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              )}
              <div>
                <div className="text-sm font-medium flex items-center gap-1">
                  {blog.author.username}{" "}
                  {blog.author.verified && <VerifiedUser />}
                </div>
                <div className="text-xs text-muted-foreground">
                  Published on {formatDate(blog.createdAt)}
                </div>
              </div>
            </div>
            <Link
              href={`/profile/${blog.author.username}`}
              className="text-sm font-medium text-primary hover:underline"
              prefetch={false}
            >
              Read more
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
