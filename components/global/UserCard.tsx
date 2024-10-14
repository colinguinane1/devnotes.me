import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/data/SiteData";
import { Button } from "../ui/button";
import { BsEye, BsHeart, BsThreeDots } from "react-icons/bs";
import { Post } from "@prisma/client";
import { Author } from "@prisma/client";
import { ChevronRight, ChevronRightIcon, Heart } from "lucide-react";
import BlogDropdown from "../buttons/BlogDropdown";
import VerifiedUser from "../ui/verified";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { createClient } from "@/app/utils/supabase/server";
import { SubscribeButton, UnsubscribeButton } from "../buttons/SubscribeButton";
import prisma from "@/prisma/db";

interface UserCardProps {
  author: Author;
  followButton?: boolean;
}

export default async function UserCard({
  author,
  followButton = true,
}: UserCardProps) {
  const supabase = createClient();

  // Get the logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isSubscribed = user
    ? await prisma.subscription.findFirst({
        where: {
          subscribedToId: author.id,
          subscriberId: user?.id,
        },
      })
    : null;
  return (
    <Card
      className="w-full flex items-center active:scale-[0.99] mb-6 h-20 rounded-md overflow-hidden transition-all"
      key={author.id}
    >
      <CardContent className="flex justify-between items-center w-full mt-[22px]">
        <Link
          className="flex gap-2 w-full items-center"
          href={`/profile/${author.username}`}
        >
          {author.image_url && (
            <Avatar className="w-10 h-10">
              <AvatarImage src={author.image_url} alt="@shadcn" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          )}
          {author.full_name ? (
            <div>
              <h2 className="font-bold flex items-center gap-1">
                {author.full_name} {author.verified && <VerifiedUser />}
              </h2>
              <h2 className="">@{author.username?.toLowerCase()}</h2>
            </div>
          ) : (
            <h2 className="flex items-center gap-1">
              @{author.username}
              {author.verified && <VerifiedUser />}
            </h2>
          )}
        </Link>{" "}
        {followButton && (
          <div className="w-fit">
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
              <Link href={`/profile/${author.username}`}>
                <Button
                  className="w-full shadow-2xl"
                  disabled
                  variant={"ghost"}
                >
                  Profile <ChevronRightIcon className="w-4 h-4 mr-1" />
                </Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
