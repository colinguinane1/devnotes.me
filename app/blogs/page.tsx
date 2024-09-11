import prisma from "@/prisma/db";
import { createClient } from "@/app/utils/supabase/server";
import BlogCard from "@/components/global/BlogCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeletePostDialog from "@/components/buttons/DeleteBlog";
import Link from "next/link";

import ManageBlogDropdown from "@/components/buttons/ManageBlogDropdown";
export default async function BlogsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const posts = await prisma.post.findMany({
    where: {
      user_id: user?.id,
      published: true,
    },
    include: {
      author: true,
    },
  });

  const drafts = await prisma.post.findMany({
    where: {
      user_id: user?.id,
      published: false,
    },
    include: {
      author: true,
    },
  });
  if (!user) {
    return (
      <section className="min-h-screen grid place-content-center">
        <p>Not logged in</p>
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
      </section>
    );
  }
  return (
    <section className="p-4">
      <Tabs defaultValue="published" className="w-full">
        <TabsList className="grid bg-card w-full grid-cols-2">
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>
        <TabsContent value="published">
          <div className="grid place-content-center gap-4 min-h-screen">
            <p className="text-2xl">Published ({posts.length})</p>
            {posts.map((post) => (
              <div className="relative" key={post.id}>
                <BlogCard
                  key={post.id}
                  author={post.author}
                  post={post}
                  horizontal={true}
                  dropdown={"author"}
                />
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="drafts">
          <div className=" grid place-content-center gap-4 min-h-screen">
            <p className="text-2xl">Drafts ({drafts.length})</p>
            {drafts.map((post) => (
              <BlogCard
                key={post.id}
                author={post.author}
                post={post}
                horizontal={true}
                dropdown={"author"}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <div></div>
    </section>
  );
}
