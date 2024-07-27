'use server'
import prisma from "@/prisma/db"

export async function createPost(data: { title: string; slug: string; content: string; published?: boolean; userId: string }) {
  try {
    const newPost = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        published: data.published ?? true, 
        userId: data.userId, 
      },
    });
    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error; 
  }
}
