'use server'
import prisma from "@/prisma/db";

export async function incrementViews(postId: string) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  if (!post) {
    throw new Error("Post not found");
  }
  post.views += 1;
  await prisma.post.update({
    where: { id: postId },
    data: { views: post.views },
  });
}

