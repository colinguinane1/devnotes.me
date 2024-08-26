'use server'
import { createClient } from "@/app/utils/supabase/server";
import prisma from "@/prisma/db";
import { revalidatePath } from "next/cache";


export async function subscribe(subscriberId: string, subscribedToId: string) {
      const supabase = createClient();

  // Get the logged-in user
  const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log('User not found');
        throw new Error("User not authenticated");
    }
try{ await prisma.subscription.create({
    data: {
      subscriberId,
      subscribedToId
    }
  });}
  catch(error){
    console.error("Error subscribing:", error);
    throw error;
  }
  console.log("Subscribed successfully");
  revalidatePath(`/profile/${subscribedToId}`);
 
}

export async function unsubscribe(subscriberId: string, subscribedToId: string) {
      const supabase = createClient();

  // Get the logged-in user
  const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log('User not found');
        throw new Error("User not authenticated");
    }
try{ await prisma.subscription.deleteMany({
    where: {
      subscriberId,
      subscribedToId
    }
  });}
  catch(error){
    console.error("Error ubsubscribing:", error);
    throw error;
  }
  console.log("Unsubscribed successfully");
  revalidatePath(`/profile/${subscribedToId}`);
 
}

