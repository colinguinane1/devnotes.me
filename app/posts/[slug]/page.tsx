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
              <span>{comments.length}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
        <UserCard author={blog.author} />
        <h1 className="text-4xl font-extrabold pb-6 tracking-tight lg:text-5xl">
          {blog.title}
        </h1>{" "}
        <article className="prose-emerald prose  mx-auto dark:prose-invert ">
          <div>
            {blog.tags && (
              <div className="flex items-center wrap gap-2">
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
          <p className="prose">{blog.description}</p>
          {blog.markdown ? (
            <p
              className={`prose prose-a:font-bold prose-invert prose-a:no-underline   dark:prose-invert`}
              dangerouslySetInnerHTML={{ __html: markdownContent }}
            ></p>
          ) : (
            <p
              className={`prose dark:prose-invert`}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            ></p>
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
                    Comments ({comments.length}) <ChevronDownIcon />
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
                          <div className="flex items-start w-full gap-4">
                            <div className="flex-1</div> w-full">
                              <div className="flex items-center w-full gap-2">
                                <Link
                                  className="flex items-center gap-2 no-underline"
                                  href={`/profile/${comment.author.username}`}
                                >
                                  {comment.author.image_url &&
                                  comment.author.username ? (
                                    <Avatar className="flex-shrink-0">
                                      <AvatarImage
                                        className="-mt-[1px]"
                                        src={comment.author.image_url}
                                        alt={comment.author.username}
                                      />
                                    </Avatar>
                                  ) : (
                                    <Avatar className="flex-shrink-0">
                                      <AvatarFallback>
                                        {comment.author.username
                                          ? comment.author.username[0]
                                          : "U"}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {comment.author.username}
                                  </p>
                                </Link>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatCommentDate(comment.createdAt)}
                                </span>
                              </div>
                              <div className="flex justify-between w-full items-center">
                                <p className="mt-1 text-gray-700 dark:text-gray-300">
                                  {comment.content}
                                </p>
                                <ReplyButton
                                  comment={comment}
                                  author={comment.author}
                                />
                              </div>
                            </div>
                          </div>{" "}
                          <div className="flex justify-between mx-4 items-center">
                            <Accordion.Root
                              className="w-full"
                              type="single"
                              id={comment.id}
                            >
                              {comment.Reply.length > 0 && (
                                <Accordion.Trigger
                                  className="-ml-4"
                                  id={comment.id}
                                >
                                  <div className="flex font-bold  items-center min-w-fit w-full">
                                    {comment.Reply.length} replies{" "}
                                    <ChevronDownIcon />
                                  </div>
                                </Accordion.Trigger>
                              )}
                              <Accordion.Content className="w-full -ml-4 border-none data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                                {comment.Reply.map((reply) => (
                                  <Accordion.Item
                                    className="w-full p-2"
                                    key={reply.id}
                                    value={`reply-${reply.id}`}
                                  >
                                    <div className="flex items-start gap-4">
                                      <div className="flex-1</div>">
                                        <div className="flex items-center gap-2">
                                          {" "}
                                          <Link
                                            className="flex items-center gap-2 no-underline"
                                            href={`/profile/${reply.author.username}`}
                                          >
                                            {reply.author.image_url &&
                                            reply.author.username ? (
                                              <Avatar className="flex-shrink-0">
                                                <AvatarImage
                                                  className="-mt-[1px]"
                                                  src={reply.author.image_url}
                                                  alt={reply.author.username}
                                                />
                                              </Avatar>
                                            ) : (
                                              <Avatar className="flex-shrink-0">
                                                <AvatarFallback>
                                                  {reply.author.username
                                                    ? reply.author.username[0]
                                                    : "U"}
                                                </AvatarFallback>
                                              </Avatar>
                                            )}

                                            <p className="font-medium text-gray-900 dark:text-white">
                                              {reply.author.username}
                                            </p>
                                          </Link>
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatCommentDate(reply.createdAt)}
                                          </span>
                                        </div>
                                        <p className="mt-1 text-gray-700 dark:text-gray-300">
                                          {reply.content}
                                        </p>
                                      </div>
                                    </div>{" "}
                                  </Accordion.Item>
                                ))}
                              </Accordion.Content>
                            </Accordion.Root>
                          </div>
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
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16 flex justify-center"></div>
    </div>
  );
}
