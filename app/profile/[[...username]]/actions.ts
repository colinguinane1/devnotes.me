'use server'
import { createClient } from "@/app/utils/supabase/server";
import prisma from "@/prisma/db";
import { revalidatePath } from "next/cache";


export async function uploadProfilePicture(userId: string, file: File) {
const supabase = createClient();
const filePath = `/${userId}/profile/${file.name}`;

try{
    const { error } = await supabase.storage.from("profile-pictures").upload(filePath, file)
    if (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
    const { data } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);
    if(!data){
        console.error("Error getting public URL:", error);
        throw error;
    }

    await prisma.author.update({
        where: { id: userId },
        data: {
            image_url: data.publicUrl
        }
    });

    return { success: true, publicUrl: data.publicUrl}
    } catch(error)
    {
        console.error("Error uploading profile picture:", error);
        throw error;
    }
}





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

