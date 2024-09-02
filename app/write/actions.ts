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



// Server action for creating a post
export async function createPost(formData: FormData) {
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

   
    const slug = generateSlug(title);
    const content = formData.get('content') as string;

    if (!content) {
      throw new Error("Content cannot be null");
    }

    if (await checkSlug(slug)) {
      throw new Error("Slug already exists");
    }

    await prisma.post.create({
      data: {
        title,
        description,
        slug,
        content,
        published: true,
        createdAt: new Date(),
        author: {
          connect: {
            id: user.id,  // Connect the post to the author using the author's ID
          },
        },
      },
    });

    console.log("Post created successfully");
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}
