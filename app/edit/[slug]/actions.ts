'use server'
import prisma from "@/prisma/db";
import { createClient } from "@/app/utils/supabase/server";

export async function getBlogBySlug(slug: string) {
      const supabase = createClient();

  // Get the logged-in user
  const { data: { user } } = await supabase.auth.getUser();

 if (!user) {
    console.log('User not found');
 
 }
  const blog = await prisma.post.findUnique({
    where: {
      slug
    },
    include: {
      author: true
    }
  });
 if(user?.id !== blog?.author.id ){
    throw new Error("User is not the author of this post");
  }
 
  if (!blog) {
    throw new Error(`No blog found for slug: ${slug}`);
  }

  return blog;
}
export async function updatePost(slug: string, title: string, content: string, description: string) {
  try {
    const updatedPost = await prisma.post.update({
      where: {
        slug,
      },
      data: {
        title,
        content,
        description,
      },
    });

    return updatedPost;
  } catch (error: any) {
    throw new Error("Failed to update post: " + error.message);
  }
}