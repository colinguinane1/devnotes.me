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

  return (
    <div className="w-full min-h-screen mt-10 p-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-6 mb-8">
        {author.image_url && (
          <Avatar className="w-32 h-32">
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

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid grid-cols-4  bg-card gap-2 mb-6">
          <TabsTrigger className="text-sm" value="posts">
            Posts
          </TabsTrigger>
          <TabsTrigger className="text-sm" value="liked">
            Likes
          </TabsTrigger>
          <TabsTrigger className="text-sm" value="followers">
            Followers
          </TabsTrigger>
          <TabsTrigger className="text-sm" value="following">
            Following
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <h1 className="pb-4 text-2xl">Posts ({posts.length})</h1>
          <div className="grid gap-6 ">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} author={author} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="liked">
          <h1 className="pb-4 text-2xl">Liked Posts ({likedPosts.length})</h1>
          <div className="grid gap-6 ">
            {likedPosts.map((post) => (
              <BlogCard key={post.id} post={post} author={post.author} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="followers">
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
        </TabsContent>
        <TabsContent value="following">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
