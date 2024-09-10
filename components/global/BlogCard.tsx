import Image from "next/image";
import Link from "next/link";
import { formatDate, getTagColor } from "@/data/SiteData";
import { Button } from "../ui/button";
import { BsEye, BsHeart, BsThreeDots } from "react-icons/bs";
import { Post } from "@prisma/client";
import { Author } from "@prisma/client";
import { Heart } from "lucide-react";
import BlogDropdown from "../buttons/BlogDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { defaultAvatar } from "@/data/SiteData";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { EyeIcon, HeartIcon } from "lucide-react";
import VerifiedUser from "../ui/verified";
interface BlogCardProps {
  post: Post;
  author: Author;
}

export default function BlogCard({ post, author }: BlogCardProps) {
  return (
    <Card
      className="w-full max-w-lg rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
      key={post.id}
    >
      <Link
        href={`/posts/${post.slug}`}
        className="group block relative overflow-hidden"
        prefetch={false}
      >
        <Image
          src="/gradient.jpg"
          width={800}
          height={450}
          alt="Blog Post Image"
          className="w-full h-52 object-cover transition-all group-hover:scale-105"
          style={{ aspectRatio: "800/450", objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
      </Link>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Link href={`/posts/${post.slug}`} className="block" prefetch={false}>
            <h3 className="text-xl font-semibold transition-colors group-hover:text-primary">
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
              <span className="font-medium flex gap-1 items-center">
                {author.username}
                {author.verified && <VerifiedUser />}
              </span>
              <span className="text-sm text-muted-foreground">
                Published on {formatDate(post.createdAt)}
              </span>
            </div>
          </Link>
          {post.tags && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => {
                const tagColor = getTagColor(tag);
                return (
                  <Badge key={tag} variant="outline">
                    #{tag}
                  </Badge>
                );
              })}
            </div>
          )}
          <div className="flex items-center justify-between gap-10">
            <div className="flex items-center gap-2 text-muted-foreground">
              <EyeIcon className="w-4 h-4" />
              <span>{post.views}</span>{" "}
              <div className="flex items-center gap-2 text-muted-foreground">
                <HeartIcon className="w-4 h-4" />
                <span>{post.likes}</span>
              </div>
            </div>
            <div>
              <BlogDropdown slug={post.slug} author={author} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
