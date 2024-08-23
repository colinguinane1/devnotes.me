// File: /app/actions.ts
'use server'
import prisma from "@/prisma/db";
import { createClient } from "@/app/utils/supabase/server";

// Server action for liking a post
export async function likePost(postId: string) {
  const supabase = createClient();

  // Get the logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log('User not found');
    throw new Error("User not authenticated");
  }

  try {
    // Add the blog to the user's likedPosts and add the user to the blog's likedBy
    await prisma.author.update({
      where: { id: user.id },
      data: {
        likedPosts: {
          connect: { id: postId }, // Connect the post to the user's likedPosts
        },
      },
    });

    await prisma.post.update({
      where: { id: postId },
      data: {
        likedBy: {
          connect: { id: user.id }, // Connect the user to the post's likedBy
        },
      },
    });

    console.log("Post liked successfully");
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
}
