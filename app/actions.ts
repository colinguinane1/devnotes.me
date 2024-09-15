'use server'
import prisma from "@/prisma/db";
import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addReply(commentId: string, content: string) {
  const supabase = createClient();

  // Get the logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log('User not found');
    throw new Error("User not authenticated");
  }

  try {
    await prisma.reply.create({
      data: {
        content,
        commentId,
        authorId: user.id
      }
    });
  } catch (error) {
    console.log("Error adding reply:", error);
  }
  console.log("Reply added successfully");
  revalidatePath(`/posts/${commentId}`);
}
