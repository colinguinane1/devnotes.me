'use server'
import prisma from "@/prisma/db";
export async function createPost(data: { title: string; slug: string; content: string; published?: boolean; userId: string, createdAt: Date, description: string, mdx: boolean }) {
  try {
    const newPost = await prisma.post.create({
      data: {
        title: data.title,
        description: data.description,
        slug: data.slug,
        content: data.content,
        published: data.published ?? true, 
        userId: data.userId,
        createdAt: new Date(), 
      },
    });
    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error; 
  }
}

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

