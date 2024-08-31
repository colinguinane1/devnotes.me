import * as React from "react";
import prisma from "@/prisma/db";
import BlogCard from "../global/BlogCard";

export default async function TopBlogCarousel() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
    orderBy: {
      views: "desc",
    },
  });

  return (
    <section className="p-4">
      <h1 className="text-2xl text-center py-4 font-medium">Trending</h1>
      <div className="grid gap-4 place-content-center md:grid-cols-2 ">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} author={post.author} />
        ))}
      </div>
    </section>
  );
}
