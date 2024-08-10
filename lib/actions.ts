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

export async function manageLikes(postId: string, userId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  // Check if the user has already liked the post
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { likedPosts: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if user has already liked the post
  const hasLiked = user.likedPosts.some((p) => p.id === postId);

  if (hasLiked) {
    await prisma.post.update({
    where: { id: postId },
    data: { likes: { decrement: 1 } },
  });

  // Remove post from user's likedPosts
  await prisma.user.update({
    where: { id: userId },
    data: { likedPosts: { disconnect: { id: postId } } },
  });
  }

  // Increment likes on the post
  await prisma.post.update({
    where: { id: postId },
    data: { likes: { increment: 1 } },
  });

  // Add post to user's likedPosts
  await prisma.user.update({
    where: { id: userId },
    data: { likedPosts: { connect: { id: postId } } },
  });
}






// Remove like from a post
