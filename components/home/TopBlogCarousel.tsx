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
    <div className="w-full overflow-hidden overflow-x-auto p-4">
      <h1 className="text-left text-2xl">Top Blogs</h1>
      <div className="flex gap-4 py-6 overflow-x-auto overflow-y-hidden h-[17rem]">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} author={post.author} />
        ))}
      </div>
    </div>
  );
}
