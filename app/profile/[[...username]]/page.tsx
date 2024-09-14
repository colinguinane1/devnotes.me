import { Button } from "@/components/ui/button";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatCommentDate, formatDate } from "@/data/SiteData";
import BlogCard from "@/components/global/BlogCard";
import { createClient } from "@/app/utils/supabase/server";
import { subscribe } from "./actions";
import ProfilePictureUpload from "@/components/buttons/ProfilePictureUpload";
import {
  SubscribeButton,
  UnsubscribeButton,
} from "@/components/buttons/SubscribeButton";
import UserCard from "@/components/global/UserCard";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { defaultAvatar } from "@/data/SiteData";
import * as Tabs from "@radix-ui/react-tabs";
import {
  TwitterIcon,
  LinkedinIcon,
  GithubIcon,
  HeartIcon,
  Heart,
  Link2,
  Link2Off,
  ArrowBigRight,
  ChevronRight,
  ChevronRightIcon,
  CheckCircle,
  ChevronLeft,
  Settings,
  Lock,
  LockIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { CalendarDaysIcon } from "lucide-react";
import FollowingDrawer from "@/components/profile/FollowingDrawer";
import { AiTwotoneCheckCircle } from "react-icons/ai";
import VerifiedUser from "@/components/ui/verified";

const prisma = new PrismaClient();

export default async function ProfilePage({
  params,
}: {
  params: { username?: string[] };
}) {
  const username = params.username?.[0] || "";
  const supabase = createClient();

  // Get the logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user data from Prisma
  const author = await prisma.author.findUnique({
    where: { username },
  });
  if (!author) {
    return notFound();
  }

  const posts = await prisma.post.findMany({
    where: {
      user_id: author.id,
    },
    include: {
      author: true,
    },
  });

  const likedPosts = await prisma.post.findMany({
    where: {
      likedBy: {
        some: {
          id: author.id,
        },
      },
    },
    include: {
      author: true,
    },
  });

  const isSubscribed = user
    ? await prisma.subscription.findFirst({
        where: {
          subscribedToId: author.id,
          subscriberId: user?.id,
        },
      })
    : null;

  const authorFollowing = await prisma.subscription.findMany({
    where: {
      subscriberId: author.id,
    },
    include: {
      subscribedTo: true, // Include the full Author object
    },
  });

  const authorComments = await prisma.comment.findMany({
    where: {
      authorId: author.id,
    },
    include: {
      post: true,
    },
  });

  const authorDrafts = await prisma.post.findMany({
    where: {
      user_id: author.id,
      published: false,
    },
    include: {
      author: true,
    },
  });

  const authorFollowers = await prisma.subscription.findMany({
    where: {
      subscribedToId: author.id,
    },
    include: {
      subscriber: true, // Include the full Author object
    },
  });

  const tabData = [
    { value: "posts" },
    { value: "liked" },
    { value: "followers" },
    { value: "following" },
    { value: "comments" },
  ];

  return (
    <div className="w-full min-h-screen max-w-3xl mx-auto">
      <div className="flex items-center px-4 justify-between">
        <div></div>
        {user?.id === author.id && (
          <Button className="hover:bg-background" asChild variant={"ghost"}>
            <Link
              className="text-gray-600 underline flex items-center gap-1"
              href="/account"
            >
              Account Settings
              <ChevronRight size={20} />
            </Link>
          </Button>
        )}
      </div>
      <div className="flex items-center gap-6 px-4 ">
        {author.image_url && (
          <Avatar className="w-20 h-20">
            <AvatarImage src={author.image_url} alt="@shadcn" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        )}
        <div className="flex flex-col items-center  gap-4">
          {author.full_name ? (
            <div className="mt-4">
              <h2 className=" font-bold flex items-center gap-2">
                {author.full_name} {author.verified && <VerifiedUser />}
              </h2>
              <h2 className="text-sm">@{author.username}</h2>{" "}
              <p className="text-sm">
                {authorFollowers.length} followers | {authorFollowing.length}{" "}
                following
              </p>
            </div>
          ) : (
            <div>
              <h2 className="font-bold">@{author.username}</h2>{" "}
              <p className="text-sm">
                {authorFollowers.length} followers | {authorFollowing.length}{" "}
                following
              </p>
            </div>
          )}{" "}
          <div></div>
        </div>{" "}
      </div>{" "}
      <p className="text-muted-foreground py-2 px-4 text-sm">{author.bio}</p>
      <div className="flex items-center gap-4 p-4 text-muted-foreground">
        <Link href="#" className="hover:underline" prefetch={false}>
          <TwitterIcon className="w-5 h-5" />
        </Link>
        <Link href="#" className="hover:underline" prefetch={false}>
          <LinkedinIcon className="w-5 h-5" />
        </Link>
        <Link href="#" className="hover:underline" prefetch={false}>
          <GithubIcon className="w-5 h-5" />
        </Link>
      </div>{" "}
      <div className="p-4 w-full">
        {user?.id !== author?.id ? (
          <div className="">
            {user ? (
              <div>
                {!isSubscribed ? (
                  <SubscribeButton
                    subscriberId={user.id}
                    subscribeToId={author.id}
                  />
                ) : (
                  <UnsubscribeButton
                    subscriberId={user.id}
                    subscribeToId={author.id}
                  />
                )}
              </div>
            ) : (
              <Button className="w-full">
                <Link href="/login">Follow</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="">
            <Button className="w-full" disabled variant={"outline"}>
              Subscribe
            </Button>
          </div>
        )}
      </div>
      <Tabs.Root defaultValue="posts" className="">
        <Tabs.List className="flex no-scrollbar overflow-x-auto whitespace-nowrap  w-full">
          {tabData.map((tab, index) => (
            <Tabs.Trigger
              key={index}
              className="tabs capitalize"
              value={tab.value}
            >
              {tab.value}
            </Tabs.Trigger>
          ))}
          {user?.id === author.id && (
            <Tabs.Trigger
              className="tabs flex items-center gap-2"
              value="drafts"
            >
              <Lock size={15} /> Drafts
            </Tabs.Trigger>
          )}
        </Tabs.List>
        <div className="p-4">
          <Tabs.Content value="posts">
            <h1 className="pb-4 text-2xl">Posts ({posts.length})</h1>
            <div className="grid gap-6 ">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} author={author} />
              ))}
            </div>
          </Tabs.Content>
          <Tabs.Content value="liked">
            <h1 className="pb-4 text-2xl">Liked Posts ({likedPosts.length})</h1>
            <div className="grid gap-6 ">
              {likedPosts.map((post) => (
                <BlogCard key={post.id} post={post} author={post.author} />
              ))}
            </div>
          </Tabs.Content>
          <Tabs.Content value="followers">
            <h1 className="pb-4 text-2xl">
              Followers ({authorFollowers.length})
            </h1>
            <div className="grid gap-4">
              {authorFollowers.map((subscriber) => (
                <div
                  className="flex items-center justify-between"
                  key={subscriber.id}
                >
                  <UserCard author={subscriber.subscriber} />
                  <Link
                    className="flex items-center"
                    href={`/profile/${subscriber.subscriber.username}`}
                  >
                    <Button variant={"ghost"}>
                      Profile <ChevronRightIcon size={15} />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Tabs.Content>
          <Tabs.Content value="following">
            <h1 className="pb-4 text-2xl">
              Following ({authorFollowing.length})
            </h1>
            <div className="grid gap-4">
              {authorFollowing.map((subscriber) => (
                <div
                  className="flex items-center justify-between"
                  key={subscriber.id}
                >
                  <UserCard author={subscriber.subscribedTo} />
                  <Link
                    className="flex items-center"
                    href={`/profile/${subscriber.subscribedTo.username}`}
                  >
                    <Button className="mt-4" variant={"ghost"}>
                      Profile <ChevronRightIcon size={15} />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Tabs.Content>
          <Tabs.Content value="comments">
            <h1 className="pb-4 text-2xl">
              Comments ({authorComments.length})
            </h1>

            <div className="grid gap-4">
              {authorComments.map((comment) => (
                <div
                  className="flex items-center justify-between"
                  key={comment.id}
                >
                  <div className="flex items-center gap-2">
                    {author.image_url && (
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={author.image_url} alt="@shadcn" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      <p>
                        {formatCommentDate(comment.createdAt)}
                        <span className="text-gray-500">
                          {" "}
                          in{" "}
                          <Link href={`/posts/${comment.post.slug}`}>
                            {comment.post.title}
                          </Link>
                        </span>
                      </p>
                      <p>{comment.content}</p>
                    </div>
                  </div>
                  <div>
                    <Link href={`/posts/${comment.post.slug}`}>
                      <Button variant={"ghost"}>
                        View <ChevronRight size={15} />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Tabs.Content>
          <Tabs.Content value="drafts">
            <h1 className="pb-4 text-2xl">Drafts ({authorDrafts.length})</h1>
            <div className="flex items-center gap-2 p-4 border rounded-md bg-gray-500/50 ">
              <LockIcon />
              <p>This is only visible to you</p>
            </div>
            <div className="grid gap-4">
              {authorDrafts.map((draft) => (
                <div
                  className="flex items-center justify-between"
                  key={draft.id}
                >
                  <BlogCard post={draft} author={draft.author} />
                </div>
              ))}
            </div>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}
