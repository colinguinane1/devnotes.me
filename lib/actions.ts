'use server'
import prisma from "@/prisma/db"

export async function createPost(data: { title: string; slug: string; content: string; published?: boolean; userId: string, createdAt: Date, description: string }) {
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
