import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/data/NavigationData";
import { Button } from "../ui/button";
import { BsEye, BsHeart, BsThreeDots } from "react-icons/bs";
import { Post } from "@prisma/client";
import { Author } from "@prisma/client";
import { Heart } from "lucide-react";
import BlogDropdown from "../buttons/BlogDropdown";

interface UserCardProps {
  author: Author;
}

export default function UserCard({ author }: UserCardProps) {
  return (
    <div
      className="bg-card  rounded-lg shadow-lg relative h-full w-[15rem] flex-shrink-0 p-3"
      key={author.id}
    >
      <Link
        className="flex flex-col mt-4 justify-center items-center"
        href={`/profile/${author.username}`}
      >
        <Image
          className="rounded-full"
          src={author.image_url || ""}
          alt="pfp"
          width={100}
          height={100}
        ></Image>
        <h1 className="font-semibold capitalize text-lg ">{author.username}</h1>

        <div className="absolute text-sm bottom-16 right-1">
          {/* <div className="flex items-center gap-1">
            <p className="flex items-center gap-1">
              {post.views} <BsEye />
            </p>
            <p className="flex items-center gap-1">
              {post.likes} <BsHeart size={10} />
            </p>
          </div>{" "} */}
        </div>
      </Link>
      <div className="flex absolute  border-t p-2 w-full bottom-1 left-0  justify-between items-center pr-4 gap-2">
        {" "}
        <p className="font-light relative h-full w-full text-sm text-gray-400">
          Member since:<br></br>
          {formatDate(author.created_at)}
        </p>{" "}
      </div>
    </div>
  );
}
