import Image from "next/image";
import Link from "next/link";
import { calculateReadingTime, formatDate, getTagColor } from "@/data/SiteData";
import { Button } from "../ui/button";
import { BsEye, BsHeart, BsThreeDots } from "react-icons/bs";
import { Post, Tag } from "@prisma/client";
import { Author } from "@prisma/client";
import { Clock, Heart, MessageCircleIcon, TagIcon } from "lucide-react";
import BlogDropdown from "../buttons/BlogDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { defaultAvatar } from "@/data/SiteData";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { EyeIcon, HeartIcon } from "lucide-react";
import VerifiedUser from "../ui/verified";
import { createClient } from "@/app/utils/supabase/server";
import prisma from "@/prisma/db";
import { BiComment } from "react-icons/bi";
interface BlogCardProps {
  post: Post;
  author: Author;
  showTags?: boolean;
  tags?: Tag[];
  horizontal?: boolean;
  dropdownType?: string;
  borderType?: string;
}

export default async function BlogCard({
  post,
  author,
  tags,
  showTags = true,
  horizontal = false,
  dropdownType = "user",
  borderType = "full",
}: BlogCardProps) {
  const supabase = createClient();

  const comments = await prisma.comment.count({
    where: { postId: post.id },
  });

  // Get the logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <Card
      className={`w-full   group overflow-hidden active:scale-[0.99] bg-card transition-all  ${
        horizontal
          ? "flex w-full border "
          : "max-w-lg border rounded-md"
      }
    `}
      key={post.id}
    >
      <Link
        href={`/posts/${post.slug}`}
        className="group block relative overflow-hidden"
        prefetch={false}
      >
        {!horizontal && (
          <Image
            src={post.cover_url ? post.cover_url : "/gradient.jpg"}
            width={800}
            height={450}
            alt="Blog Post Image"
            className="w-full h-52 object-cover transition-all group-hover:scale-[1.01]"
            style={{ aspectRatio: "800/450", objectFit: "cover" }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent " />
      </Link>
      <CardContent
        className={`space-y-4 w-full ${borderType === "none" ? "p-0" : "p-4"} `}
      >
        <div
          className={`${horizontal ? "flex items-center justify-center" : ""}`}
        >
          <div
            className={`space-y-2  ${
              horizontal
                ? "max-w-[15rem] md:min-w-[20rem] min-w-[15rem] md:max-w-[20rem] px-2"
                : ""
            }`}
          >
            <Link
              href={`/posts/${post.slug}`}
              className="block"
              prefetch={false}
            >
              <h3
                className={` ${
                  horizontal ? "text-base" : "text-xl"
                } font-semibold transition-colors group-hover:text-primary`}
              >
                {post.title}
              </h3>
            </Link>
            <Link
              href={`/profile/${author.username}`}
              className="flex items-center gap-4"
            >
              {author.image_url && (
                <Avatar className="border">
                  <AvatarImage src={author.image_url} alt="Author Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col">
                <span
                  className={`font-medium ${
                    horizontal ? "text-sm" : "text-base"
                  } flex gap-1 items-center`}
                >
                  {author.username}
                  {author.verified && <VerifiedUser />}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </Link>
            {tags && (
              <div className={`flex flex-wrap  gap-2 `}>
                {showTags &&
                  tags.map((tag) => {
                    return (
                      <Link key={tag.id} href={`/tag/${tag.name}`}>
                        <Badge variant={"outline"} key={tag.id}>
                          <TagIcon size={10} className="mr-1" />
                          {tag.name}
                        </Badge>
                      </Link>
                    );
                  })}
              </div>
            )}

            <div className="flex items-center justify-between">
              {" "}
              {horizontal ? (
                <>
                  <p className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readingTime
                      ? post.readingTime
                      : calculateReadingTime(post.content)}{" "}
                    min read
                  </p>
                  <p className="flex items-center gap-1">
                    <EyeIcon className="w-4 h-4" />
                    {post.views}
                  </p>
                </>
              ) : (
                <Link
                  href={`/posts/${post.slug}`}
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center gap-2 pr-2 text-muted-foreground">
                    <EyeIcon className="w-4 h-4" />
                    <span>{post.views}</span>{" "}
                  </div>
                  <div className="flex items-center gap-2 pr-2 text-muted-foreground">
                    <HeartIcon className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-2 pr-2 text-muted-foreground">
                    <MessageCircleIcon className="w-4 h-4" />
                    <span>{comments}</span>
                  </div>
                </Link>
              )}
              {dropdownType === "author" || user?.id === post.user_id ? (
                <BlogDropdown author={author} slug={post.slug} type="author" />
              ) : (
                <BlogDropdown author={author} slug={post.slug} type="user" />
              )}
            </div>
          </div>{" "}
          {horizontal && (
            <div className="w-full h-full">
              <Image
                src={post.cover_url ? post.cover_url : "/gradient.jpg"}
                width={800}
                height={450}
                alt="Blog Post Image"
                className="w-full h-full object-cover transition-all rounded-lg group-hover:scale-[1.01]"
                style={{ aspectRatio: "800/450", objectFit: "cover" }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
