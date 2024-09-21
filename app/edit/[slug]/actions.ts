'use server'
import prisma from "@/prisma/db";
import { createClient } from "@/app/utils/supabase/server";
import { Tag } from "@prisma/client";

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
      author: true,
      tags: true
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
export async function updatePost(
  slug: string,
  title: string,
  content: string,
  description: string,
  tags: Tag[]
) {
  try {
    // Iterate over the tags and either find them or create them
    const tagPromises = tags.map(async (tag) => {
      let existingTag = await prisma.tag.findUnique({
        where: { name: tag.name }, // Assuming `name` is unique in your Tag model
      });

      if (!existingTag) {
        // Create the tag if it doesn't exist
        existingTag = await prisma.tag.create({
          data: { name: tag.name },
        });
      }

      return existingTag; // Return the existing or newly created tag
    });

    // Wait for all the tags to be resolved
    const resolvedTags = await Promise.all(tagPromises);

    // Update the post with the resolved tags
    const updatedPost = await prisma.post.update({
      where: {
        slug,
      },
      data: {
        title,
        content,
        description,
        tags: {
          connect: resolvedTags.map((tag) => ({ id: tag.id })), // Connect the tags by ID
        },
      },
    });

    return updatedPost;
  } catch (error: any) {
    throw new Error("Failed to update post: " + error.message);
  }
}
