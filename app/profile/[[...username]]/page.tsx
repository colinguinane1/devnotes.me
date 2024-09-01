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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { CalendarDaysIcon } from "lucide-react";
import FollowingDrawer from "@/components/profile/FollowingDrawer";

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

  const posts = await prisma.post.findMany({
    where: {
      user_id: user?.id,
    },
    include: {
      author: true,
    },
  });

  const likedPosts = await prisma.post.findMany({
    where: {
      likedBy: {
        some: {
          id: user?.id,
        },
      },
    },
    include: {
      author: true,
    },
  });

  // If user not found, return a 404 page
  if (!author) {
    return notFound();
  }

  const isSubscribed = await prisma.subscription.findFirst({
    where: {
      subscribedToId: author.id,
      subscriberId: user?.id,
    },
  });

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

  return (
    <div className="w-full min-h-screen mt-10 p-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-6 mb-8">
        {author.image_url && (
          <Avatar className="w-20 h-20">
            <AvatarImage src={author.image_url} alt="@shadcn" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        )}
        <div className="grid gap-2">
          {author.first_name || author.last_name ? (
            <div>
              <h2 className="text-2xl font-bold">
                {author.first_name} {author.last_name}
              </h2>
              <h2 className="">@{author.username}</h2>
            </div>
          ) : (
            <h2 className="text-2xl font-bold">{author.username}</h2>
          )}

          <p className="text-muted-foreground">
            Im a passionate writer and blogger, sharing my thoughts on
            technology, design, and the world around us.
          </p>
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
                    <Link href="/login">Sign In To Subscribe</Link>
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
      <FollowingDrawer authorFollowers={authorFollowers} />
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid grid-cols-4  bg-card gap-2 mb-6">
          <TabsTrigger className="text-sm" value="posts">
            Posts ({posts.length})
          </TabsTrigger>
          <TabsTrigger className="text-sm" value="liked">
            Likes ({likedPosts.length})
          </TabsTrigger>
          <TabsTrigger className="text-sm" value="followers">
            Followers ({authorFollowers.length})
          </TabsTrigger>
          <TabsTrigger className="text-sm" value="following">
            Following({authorFollowing.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <div className="grid gap-6 ">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} author={author} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="liked">
          <div className="grid gap-6 ">
            {likedPosts.map((post) => (
              <BlogCard key={post.id} post={post} author={post.author} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="followers">
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
        </TabsContent>
        <TabsContent value="following">
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
                  <Button variant={"ghost"}>
                    Profile <ChevronRightIcon size={15} />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
