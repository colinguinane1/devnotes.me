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
    // Get the current post's tags from the database
    const existingPost = await prisma.post.findUnique({
      where: { slug },
      include: { tags: true },
    });

    if (!existingPost) {
      throw new Error(`Post with slug ${slug} not found`);
    }

    // Find tags to disconnect (those in the database but not in the updated list)
    const tagsToDisconnect = existingPost.tags.filter(
      (existingTag) => !tags.some((tag) => tag.id === existingTag.id)
    );

    // Find tags to connect (newly added tags)
    const tagPromises = tags.map(async (tag) => {
      let existingTag = await prisma.tag.findUnique({
        where: { name: tag.name },
      });

      if (!existingTag) {
        // Create the tag if it doesn't exist
        existingTag = await prisma.tag.create({
          data: { name: tag.name },
        });
      }

      return existingTag;
    });

    const resolvedTags = await Promise.all(tagPromises);

    // Update the post with both connect and disconnect operations
    const updatedPost = await prisma.post.update({
      where: { slug },
      data: {
        title,
        content,
        description,
        updatedAt: new Date(),
        tags: {
          connect: resolvedTags.map((tag) => ({ id: tag.id })), // Connect new tags
          disconnect: tagsToDisconnect.map((tag) => ({ id: tag.id })), // Disconnect removed tags
        },
      },
    });

    return updatedPost;
  } catch (error: any) {
    throw new Error("Failed to update post: " + error.message);
  }
}

export async function publishPost(id: string ) {
  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        published: true,
        createdAt: new Date(),
      },
    });

    return post;
  } catch (error: any) {
    throw new Error("Failed to publish post: " + error.message);
  }
}

