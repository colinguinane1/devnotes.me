import prisma from "@/prisma/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Pencil } from "lucide-react";

import Image from "next/image";
import SamplePrismaUser from "@/data/SamplePrismaUser";
import { Button } from "@/components/ui/button";
import { Link } from "next-view-transitions";
import { EditorRoot, EditorContent, useEditor } from "novel";
import { Post } from "@prisma/client";
import { Eye, Heart } from "lucide-react";
import { createClient } from "../utils/supabase/server";
import { Input } from "@/components/ui/input";
import { RxMagnifyingGlass } from "react-icons/rx";
import UserIcon from "@/components/buttons/UserIcon";
import { Badge } from "@/components/ui/badge";
import BlogCard from "@/components/global/BlogCard";

export default async function ExplorePage() {
  function formatDate(dateString: Date) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  }
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
  });
  const supabase = createClient();

  // Get the logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const author = await prisma.author.findUnique({
    where: {
      id: user?.id,
    },
  });

  const tags = await prisma.tag.findMany({
    include: {
      posts: true,
    },
  });

  var hour = new Date().getHours();
  var greet;

  if (hour >= 5 && hour < 11) greet = "Good morning,";
  else if (hour >= 11 && hour < 18) greet = "Good afternoon,";
  else if (hour >= 18 && hour < 23) greet = "Good evening,";
  else if (hour === 23 || hour < 5) greet = "Good morning, ";

  const searchPlaceholder =
    <RxMagnifyingGlass /> + "Search for posts, authors, and more";

  return (
    <main className="p-4 flex flex-col justify-center items-center gap-4 min-h-screen w-full">
      <section className="w-full max-w-2xl flex flex-col items-center gap-4">
        <div className="flex items-center justify-between w-full">
          <div>
{author && 
            <h1 className="text-4xl font-extrabold">
              {greet} {author?.full_name}
            </h1>}
          </div>

          <UserIcon />
        </div>
        <div className="relative w-full">
          <RxMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 rounded-full w-full"
            type="text"
            placeholder="Search for posts, authors, and more"
          />
        </div>
        <div className="border-b overflow-x-auto flex items-center gap-4 pb-4 no-scrollbar w-full">
          {tags.map((tag) => (
            <Link
              href={`/tag/${tag.name}`}
              className="flex items-center bg-card p-2 rounded-full px-5 gap-4"
              key={tag.id}
            >
              {tag.name}
            </Link>
          ))}
        </div>
        <div className="grid gap-4 w-full">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} author={post.author} />
          ))}
        </div>
      </section>
    </main>
  );
}
