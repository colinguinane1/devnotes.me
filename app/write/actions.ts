'use server'
import prisma from "@/prisma/db";
import { createClient } from "@/app/utils/supabase/server";
import { generateSlug, generateDescription } from "@/data/SiteData";
import { redirect } from "next/dist/server/api-utils";



export async function checkSlug(slug: string) {
    const post = await prisma.post.findFirst({
        where: {
        slug,
        },
    });
    
    if (post) {
        return true;
    }
    
    return false;
}

export async function createPost(formData: FormData, markdown: boolean) {
  const supabase = createClient();

  // Get the logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log('User not found');
    throw new Error("User not authenticated");
  }

  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const tagsString = formData.get('tags') as string;
    const tags = JSON.parse(tagsString) as string[]; // Parse tags as array

    if (!title || !description || !content) {
      throw new Error("All fields are required");
    }

    const slug = generateSlug(title);

    // Check if the slug already exists
    const existingPost = await prisma.post.findFirst({
      where: { slug },
    });

    if (existingPost) {
      throw new Error("Slug already exists");
    }

    console.log({
  title,
  description,
  tags,
  markdown,
  slug,
  content,
  published: true,
  createdAt: new Date(),
  author: {
    connect: { id: user.id },
  },
});

    await prisma.post.create({
      data: {
        title,
        description,
        tags, // Ensure tags are passed correctly
        markdown,
        slug,
        content,
        published: true,
        createdAt: new Date(),
        author: {
          connect: { id: user.id },
        },
      },
    });

    console.log("Post created successfully");
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}
