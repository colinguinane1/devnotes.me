import { Button } from "@/components/ui/button";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatDate } from "@/data/SiteData";
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

  const authorFollowers = await prisma.subscription.findMany({
    where: {
      subscribedToId: author.id,
    },
    include: {
      subscriber: true, // Include the full Author object
    },
  });

  const tabsData = [];

  return (
    <div className="w-full min-h-screen mt-10  max-w-3xl mx-auto">
      <div className="flex items-center gap-6 p-4 mb-8">
        {author.image_url && (
          <Avatar className="w-20 h-20">
            <AvatarImage src={author.image_url} alt="@shadcn" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        )}
        <div className="grid gap-1">
          {author.full_name ? (
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                {author.full_name} {author.verified && <VerifiedUser />}
              </h2>
              <h2 className="">@{author.username}</h2>
            </div>
          ) : (
            <h2 className="text-2xl font-bold">{author.username}</h2>
          )}
          <p className="text-muted-foreground">{author.bio}</p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link href="#" className="hover:underline" prefetch={false}>
              <TwitterIcon className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:underline" prefetch={false}>
              <LinkedinIcon className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:underline" prefetch={false}>
              <GithubIcon className="w-5 h-5" />
            </Link>
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
                  <Button>
                    <Link href="/login">Follow</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="">
                <Button disabled variant={"outline"}>
                  Subscribe
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Tabs.Root defaultValue="posts" className="">
        <Tabs.List className="flex overflow-x-auto whitespace-nowrap scrollbar-hide w-full border-b">
          <Tabs.Trigger
            className=" px-5 h-[45px] w-[10rem] flex items-center justify-center text-[15px] leading-none text-mauve11 select-none hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]   outline-none cursor-pointer"
            value="posts"
          >
            Posts
          </Tabs.Trigger>
          <Tabs.Trigger
            className=" px-5 h-[45px] w-[10rem] flex items-center justify-center text-[15px] leading-none text-mauve11 select-none hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]   outline-none cursor-pointer"
            value="liked"
          >
            Likes
          </Tabs.Trigger>

          <Tabs.Trigger
            className=" px-5 h-[45px] w-[10rem] flex items-center justify-center text-[15px] leading-none text-mauve11 select-none hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]   outline-none cursor-pointer"
            value="followers"
          >
            Followers
          </Tabs.Trigger>
          <Tabs.Trigger
            className=" px-5 h-[45px] w-[10rem] flex items-center justify-center text-[15px] leading-none text-mauve11 select-none hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]   outline-none cursor-pointer"
            value="following"
          >
            Following
          </Tabs.Trigger>
          <Tabs.Trigger
            className=" px-5 h-[45px] w-[10rem] flex items-center justify-center text-[15px] leading-none text-mauve11 select-none hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]   outline-none cursor-pointer"
            value="comments"
          >
            Comments
          </Tabs.Trigger>
          <Tabs.Trigger
            className=" px-5 h-[45px] w-[10rem] flex items-center justify-center text-[15px] leading-none text-mauve11 select-none hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]   outline-none cursor-pointer"
            value="drafts"
          >
            Drafts
          </Tabs.Trigger>
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
        </div>
      </Tabs.Root>
    </div>
  );
}
