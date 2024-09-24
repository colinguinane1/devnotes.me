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
import { redirect } from "next/navigation";

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
import { search } from "./actions";
import ClientSearchBar from "./SearchBar";

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

  let author = null;

  if (user?.id) {
    author = await prisma.author.findUnique({
      where: {
        id: user.id,
      },
    });
  }

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

  const author_first_name = author?.full_name?.split(" ")[0] || "";

  return (
    <main className="p-4 flex flex-col justify-center items-center gap-4 min-h-screen w-full">
      <section className="w-full max-w-2xl flex flex-col items-center gap-4">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="md:text-4xl text-2xl font-extrabold">
              {greet} {author && author_first_name}
            </h1>
          </div>

          <UserIcon />
        </div>
        <div className="relative w-full">
          <ClientSearchBar />
        </div>
        <div className="border-b overflow-x-auto flex items-center gap-4 pb-4 no-scrollbar w-full">
          {tags.map((tag) => (
            <Link
              href={`/tag/${tag.name}`}
              className="flex items-center bg-card p-2 rounded-full px-5 gap-4"
              key={tag.id}
            >
              #{tag.name.toLowerCase()}
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} author={post.author} />
          ))}
        </div>
      </section>
    </main>
  );
}
