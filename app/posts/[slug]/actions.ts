// File: /app/actions.ts
'use server'
import prisma from "@/prisma/db";
import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/dist/server/api-utils";

// Server action for liking a post
export async function checkPostLiked(postId: string) {
  const supabase = createClient();

  // Get the logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log('User not found');
    
    return false;
  }

  // Fetch the user's liked posts and check if the postId is included
  const author = await prisma.author.findUnique({
    where: { id: user.id },
    select: { likedPosts: { select: { id: true } } },
  });

  if (author?.likedPosts.some(post => post.id === postId)) {
   
    return true;
  }
 console.log(author?.likedPosts)
  return false;
}

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
        likes: {increment: 1}
      },
    });
    revalidatePath(`/posts/${postId}`)
    console.log("Post liked successfully");
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
}

export async function removeLike(postId: string) {
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
          disconnect: { id: postId }, // Connect the post to the user's likedPosts
        },
      },
    });

    await prisma.post.update({
      where: { id: postId },
      data: {
        likedBy: {
          disconnect: { id: user.id }, // Connect the user to the post's likedBy
        },
        likes: {decrement: 1}
      },
    });

    console.log("Post like removed successfully");
    revalidatePath(`/posts/${postId}`)
  } catch (error) {
    console.error("Error removing liked post:", error);
    throw error;
  }
}



export async function handleLike(postId: string) {
  const supabase = createClient();

  // Get the logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log('User not found');
    throw new Error("User not authenticated");
  }

if(!await checkPostLiked(postId)){  
 await likePost(postId)
 console.log('added like')
}
else{
  await removeLike(postId)
  console.log('removed like')
}
}

export async function addComment(postId: string, content: string){
    const supabase = createClient();

  // Get the logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log('User not found');
    throw new Error("User not authenticated");
  }

  try{
    await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: user.id
    
        }
      })
    }
    catch (error) {
      console.log("Error adding comment:", error);
  }
  console.log("Comment added successfully");
  revalidatePath(`/posts/${postId}`)
}



