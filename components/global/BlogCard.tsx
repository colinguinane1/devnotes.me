import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/data/SiteData";
import { Button } from "../ui/button";
import { BsEye, BsHeart, BsThreeDots } from "react-icons/bs";
import { Post } from "@prisma/client";
import { Author } from "@prisma/client";
import { Heart } from "lucide-react";
import BlogDropdown from "../buttons/BlogDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { defaultAvatar } from "@/data/SiteData";

interface BlogCardProps {
  post: Post;
  author: Author;
}

export default function BlogCard({ post, author }: BlogCardProps) {
  return (
    <div
      className="bg-card rounded-lg shadow-lg relative h-full w-[15rem] flex-shrink-0 p-3"
      key={post.id}
    >
      <Link href={`/posts/${post.slug}`}>
        <h1 className="font-semibold capitalize text-lg ">{post.title}</h1>
        {/* <p className="font-light relative h-full w-full text-sm text-gray-400"> // disabled atm
          {post.description}
        </p>{" "} */}
        <div className="absolute text-sm bottom-16 right-1">
          <div className="flex items-center gap-1">
            <p className="flex items-center gap-1">
              {post.views} <BsEye />
            </p>
            <p className="flex items-center gap-1">
              {post.likes} <BsHeart size={10} />
            </p>
          </div>{" "}
        </div>
      </Link>
      <div className="flex absolute  border-t p-2 w-full bottom-1 left-0  justify-between items-center pr-4 gap-2">
        <div className="flex items-center gap-2">
          {author.image_url && (
            <Avatar>
              <AvatarImage src={author.image_url}></AvatarImage>
              <AvatarFallback>{defaultAvatar}</AvatarFallback>
            </Avatar>
          )}
          <div className="text-sm">
            <p>{author.username}</p>{" "}
            <p className="text-gray-400">{formatDate(post.createdAt)}</p>
          </div>
        </div>{" "}
        <div>
          <BlogDropdown slug={post.slug} author={author} />
        </div>
      </div>
    </div>
  );
}
