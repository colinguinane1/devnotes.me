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
  Pencil,
  PencilIcon,
  TagIcon,
} from "lucide-react";
import { Metadata } from "next";
import { Merriweather } from "next/font/google";
import { Textarea } from "@/components/ui/textarea";

import { CiWarning } from "react-icons/ci";
import { incrementViews } from "@/lib/actions";
import BlogDropdown from "@/components/buttons/BlogDropdown";
import {
  PostLikedManager,
  RemovePostLikeManager,
} from "@/components/buttons/LikeManager";
import {
  calculateReadingTime,
  formatCommentDate,
  formatDate,
  formatDateTime,
} from "@/data/SiteData";
import BlogNotFound from "@/components/global/BlogNotFound";
import { createClient } from "@/app/utils/supabase/server";
import { checkPostLiked, likePost, removeLike } from "./actions";
import { ClockIcon } from "lucide-react";
import { MessageCircleIcon, ChevronDownIcon } from "lucide-react";
import { useTheme } from "next-themes";

import VerifiedUser from "@/components/ui/verified";

import * as Accordion from "@radix-ui/react-accordion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { read } from "to-vfile";
import { unified } from "unified";
import { reporter } from "vfile-reporter";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeToc from "rehype-toc";
import AddCommentForm from "@/components/buttons/AddComment";
import { Badge } from "@/components/ui/badge";
import ProgressBar from "@/components/post/progress";
import ReplyButton from "@/components/buttons/ReplyButton";
import UserCard from "@/components/global/UserCard";
import CommentCard from "@/components/post/comment-card";

const mwfont = Merriweather({ subsets: ["latin"], weight: ["400"] });

export default async function blog({ params }: { params: { slug: string } }) {
  const blog = await prisma.post.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      tags: true,
      author: true,
    },
  });
  if (!blog) {
    return <BlogNotFound />;
  }

  const comments = await prisma.comment.findMany({
    where: {
      postId: blog.id,
    },
    include: {
      author: true, // Include the author of the comment
      Reply: {
        include: {
          author: true, // Include the author of each reply
        },
      },
    },
  });

  const postLiked = await checkPostLiked(blog.id);

  const supabase = createClient();

  // Get the logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const tagsWithPosts = await prisma.tag.findMany({
    where: {
      posts: {
        some: {}, // This checks for any associated posts
      },
    },
    include: {
      posts: true, // This includes the posts associated with each tag
    },
  });

  const metadata: Metadata = {
    title: blog.title,
    description: blog.description,
  };

  let markdownContent = "";

  if (blog.markdown) {
    const content = blog.content; // Assuming this is the markdown content stored in the database

    // Process markdown content with pretty code highlighting
    const processedContent = await unified()
      .use(remarkParse) // Parse markdown to an AST
      .use(remarkGfm) // Add support for GitHub flavored markdown (tables, etc.)
      .use(remarkRehype) // Convert markdown AST to HTML AST
      .use(rehypeSlug) // Add unique IDs to headers
      .use(rehypeAutolinkHeadings, {
        behavior: "wrap", // Wrap headings in <a> tags
      })
      .use(rehypePrettyCode, {
        theme: "aurora-x", // Specify a theme
        keepBackground: true, // Optionally keep the code block background color
      })
      .use(rehypeToc, {}) // Add a table of contents
      .use(rehypeDocument) // Add a document structure
      .use(rehypeFormat) // Format the HTML output
      .use(rehypeStringify) // Convert the HTML AST to a string
      .process(content);

    markdownContent = String(processedContent);
  }
  incrementViews(blog.id);
  console.log("Created At:", blog.createdAt);
  console.log("Updated At:", blog.updatedAt);

  return (
    <div className="bg-background">
      <ProgressBar />
      <div className="relative h-[400px] -mt-[4px] md:-mt-0  w-full overflow-hidden">
        <Image
          src={blog.cover_url ? blog.cover_url : "/gradient.jpg"}
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
              {!user ? (
                <Button variant={"ghost"} size={"icon"}>
                  <Link href="/login">
                    {" "}
                    <HeartIcon className="h-4 w-4" />
                  </Link>
                </Button>
              ) : postLiked ? (
                <PostLikedManager postId={blog.id} />
              ) : (
                <RemovePostLikeManager postId={blog.id} />
              )}
              <span>{blog.likes}</span>
              <Button asChild variant="ghost" size="icon">
                <Link href="#comments">
                  <MessageCircleIcon className="h-4 w-4" />
                  <span className="sr-only">Comment</span>
                </Link>
              </Button>
              <span>{comments.length}</span>{" "}
              {blog.author.id === user?.id ? (
                <BlogDropdown
                  author={blog.author}
                  slug={blog.slug}
                  type="author"
                />
              ) : (
                <BlogDropdown
                  author={blog.author}
                  slug={blog.slug}
                  type="user"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          {blog.title}
        </h1>{" "}
        <div className="mt-10 -mb-10">
          {" "}
          <UserCard author={blog.author} />
        </div>
        <article className="prose dark:prose-invert max-w-3xl prose-a:font-bold  prose-a:no-underline ">
          <div>
            {blog.tags && (
              <div className="flex items-center wrap pt-6 gap-2">
                {blog.tags.map((tag, index) => (
                  <Link key={index} href={`/tag/${tag.name}`}>
                    <Badge variant={"outline"} key={index}>
                      <TagIcon size={10} className="mr-1" />
                      {tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <p className="border-b pb-4 text-lg">{blog.description}</p>
          {blog.markdown ? (
            <p dangerouslySetInnerHTML={{ __html: markdownContent }}></p>
          ) : (
            <p dangerouslySetInnerHTML={{ __html: blog.content }}></p>
          )}
          <p className="border-t pt-2 flex items-center gap-1">
            <Calendar size={15} className="mr-1" />{" "}
            {formatDateTime(blog.createdAt)}
          </p>
          {blog.updatedAt &&
            Math.floor(new Date(blog.updatedAt).getTime() / 1000) !==
              Math.floor(new Date(blog.createdAt).getTime() / 1000) && (
              <p className="flex items-center gap-1">
                <Pencil size={15} /> {formatDateTime(blog.updatedAt)}
              </p>
            )}
          <Accordion.Root
            className="transition-all"
            id="comments"
            type="single"
            collapsible
          >
            <Accordion.Item value="comments">
              <Accordion.Trigger className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl flex items-center gap-2  font-bold ">
                    Comments ({comments.length}){" "}
                    <ChevronDownIcon className="data-[state=open]:rotate-180" />
                  </h3>
                </div>
              </Accordion.Trigger>
              <Accordion.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                <div className="space-y-6">
                  <div>
                    <Accordion.Root
                      type="single"
                      collapsible
                      className="mt-4 space-y-4"
                    >
                      {comments.map((comment) => (
                        <Accordion.Item
                          className="py-2"
                          key={comment.id}
                          value={`comment-${comment.id}`}
                        >
                          <CommentCard
                            comment={comment}
                            Reply={comment.Reply}
                          />
                        </Accordion.Item>
                      ))}
                    </Accordion.Root>
                  </div>
                  {user ? (
                    <AddCommentForm postId={blog.id} />
                  ) : (
                    <Button>
                      <Link href="/login">Sign In To Comment</Link>
                    </Button>
                  )}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>{" "}
        </article>{" "}
      </div>
    </div>
  );
}
