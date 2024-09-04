import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/data/SiteData";
import { Button } from "../ui/button";
import { BsEye, BsHeart, BsThreeDots } from "react-icons/bs";
import { Post } from "@prisma/client";
import { Author } from "@prisma/client";
import { Heart } from "lucide-react";
import BlogDropdown from "../buttons/BlogDropdown";
import VerifiedUser from "../ui/verified";

interface UserCardProps {
  author: Author;
}

export default function UserCard({ author }: UserCardProps) {
  return (
    <div className=" " key={author.id}>
      <Link
        className="flex  mt-4 justify-center gap-2 items-center"
        href={`/profile/${author.username}`}
      >
        <Image
          className="rounded-full"
          src={author.image_url || ""}
          alt="pfp"
          width={50}
          height={50}
        ></Image>
        {author.full_name ? (
          <div>
            <h2 className="text-lg font-bold flex items-center gap-1">
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
    </div>
  );
}
