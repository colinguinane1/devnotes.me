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
import { MessageCircleIcon, ChevronDownIcon } from "lucide-react";

import VerifiedUser from "@/components/ui/verified";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
    <div className="bg-background">
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src="/gradient.jpg"
          alt="Blog cover image"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
          style={{ aspectRatio: "1920/1080", objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 md:px-6 md:pb-8 lg:px-8 lg:pb-10">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <span>{calculateReadingTime(blog.content)} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <HeartIcon className="h-4 w-4" />
                <span className="sr-only">Comment</span>
              </Button>
              <span>{blog.likes}</span>
              <Button variant="ghost" size="icon">
                <MessageCircleIcon className="h-4 w-4" />
                <span className="sr-only">Comment</span>
              </Button>
              <span>12</span>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
        <article className="prose prose-gray mx-auto dark:prose-invert">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            {blog.title}
          </h1>
          <p className="text-muted-foreground">{blog.description}</p>
          <p dangerouslySetInnerHTML={{ __html: blog.content }}></p>
        </article>
      </div>
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
        <Accordion type="single" collapsible className="grid gap-6">
          <AccordionItem value="comments">
            <AccordionTrigger className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Comments</h3>
                <p className="text-muted-foreground">
                  Share your thoughts on this blog post.
                </p>
              </div>
              <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6">
                <div>
                  <Accordion
                    type="single"
                    collapsible
                    className="mt-4 space-y-4"
                  >
                    <AccordionItem value="comment-1">
                      <AccordionTrigger className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 shrink-0 border">
                          <AvatarImage
                            src="/placeholder-user.jpg"
                            alt="@shadcn"
                          />
                          <AvatarFallback>AC</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Acme Inc</h4>
                            <p className="text-sm text-muted-foreground">
                              2 days ago
                            </p>
                          </div>
                          <p>
                            This blog post is absolutely hilarious! I cant
                            believe the king actually tried to tax jokes. What a
                            ridiculous idea.
                          </p>
                        </div>
                      </AccordionTrigger>
                    </AccordionItem>
                    <AccordionItem value="comment-2">
                      <AccordionTrigger className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 shrink-0 border">
                          <AvatarImage
                            src="/placeholder-user.jpg"
                            alt="@shadcn"
                          />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">John Doe</h4>
                            <p className="text-sm text-muted-foreground">
                              3 days ago
                            </p>
                          </div>
                          <p>
                            I cant wait to read more about Jokester and his
                            adventures. This is such a fun and creative story!
                          </p>
                        </div>
                      </AccordionTrigger>
                    </AccordionItem>
                  </Accordion>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Leave a Comment</h3>
                  <form className="mt-4 space-y-4">
                    <Textarea
                      placeholder="Write your comment here..."
                      className="h-24"
                    />
                    <div className="flex justify-end">
                      <Button type="submit">Submit</Button>
                    </div>
                  </form>
                </div>
                <div className="flex justify-center">
                  <Button variant="outline">Show all comments</Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16 flex justify-center">
        <div className="w-full max-w-md shrink-0">
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
