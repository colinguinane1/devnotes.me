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

  const authorSubscribedTo = await prisma.subscription.findMany({
    where: {
      subscriberId: author.id,
    },
    include: {
      subscribedTo: true, // Include the full Author object
    },
  });

  return (
    <main className=" overflow-y-auto min-h-screen  p-4">
      {author && (
        <div className="">
          <div className="flex items-center gap-4">
            <Image
              src={author?.image_url || "/default-avatar.png"}
              alt="User Avatar"
              className="rounded-full"
              width={100}
              height={100}
            />
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold">
                <h1>{author.first_name !== "Null" && author.first_name}</h1>
                <h1>{author.last_name !== "Null" && author.last_name}</h1>
              </div>
              <p className="">{author.username}</p>
            </div>
          </div>
          <p>Joined on: {formatDate(author?.created_at)}</p>

          {user?.id !== author?.id ? (
            <div className="pt-2">
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
            <div className="pt-2">
              <Button disabled variant={"outline"}>
                Subscribe
              </Button>
            </div>
          )}
          <div className="w-full overflow-hidden overflow-x-auto mt-4">
            <h1 className="text-left text-2xl">User Posts</h1>
            <div className="flex gap-4 py-6 overflow-x-auto overflow-y-hidden h-[17rem]">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} author={author} />
              ))}
            </div>
          </div>
          <div className="w-full overflow-hidden overflow-x-auto mt-4">
            <h1 className="text-left text-2xl">Liked Posts</h1>
            <div className="flex gap-4 py-6 overflow-x-auto overflow-y-hidden h-[17rem]">
              {likedPosts.map((post) => (
                <BlogCard key={post.id} post={post} author={author} />
              ))}
            </div>
          </div>
          <div className="w-full overflow-hidden overflow-x-auto mt-4">
            <h1 className="text-left text-2xl">Subscriptions</h1>
            <div className="flex gap-4 py-6 overflow-x-auto overflow-y-hidden h-[17rem]">
              {authorSubscribedTo.map((subscriptions) => (
                <UserCard
                  key={subscriptions.id}
                  author={subscriptions.subscribedTo}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
