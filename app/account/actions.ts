'use server'
import { revalidatePath } from "next/cache";
import { createClient } from "../utils/supabase/server";
import prisma from "@/prisma/db";

export async function checkUsernameExists(username: string) {
    const author = await prisma.author.findUnique({
        where: {
            username,
        }
    })
    if (author) {
        console.log("Username exists")
        return true

    }
     console.log("Username DOESNT exist")

    return false
}

export async function ChangeUsername(formData: FormData) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log('User not found');
        throw new Error("User not authenticated");
    }

    const username = formData.get('username') as string | null;

    if (!username) {
        console.log('Username is missing');
        throw new Error("Username is required");
    }

    if (await checkUsernameExists(username)) {
        console.log('Username already exists' + username);
        throw new Error("Username already exists");
    } else {
        await prisma.author.update({
            where: { id: user.id },
            data: {
                username,
            },
        });

        revalidatePath('/account', 'layout');
    }

   
}

export async function ChangeFirstName(formData: FormData) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log('User not found');
        throw new Error("User not authenticated");
    }

    const first_name = formData.get('first_name') as string | null;

    if (!first_name) {
        console.log('First Name is missing');
        throw new Error("First Name is required");
    }

  
        await prisma.author.update({
            where: { id: user.id },
            data: {
                first_name,
            },
        });

        revalidatePath('/account', 'layout');
    }
export async function ChangeLastName(formData: FormData) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log('User not found');
        throw new Error("User not authenticated");
    }

    const last_name = formData.get('last_name') as string | null;

    if (!last_name) {
        console.log('Last Name is missing');
        throw new Error("Last Name is required");
    }

  
        await prisma.author.update({
            where: { id: user.id },
            data: {
                last_name,
            },
        });

        revalidatePath('/account', 'layout');
    }



export async function ChangeProfilePicture(fileName: string) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log('User not found');
    throw new Error("User not authenticated");
  }

  // Retrieve the public URL for the newly uploaded avatar
  const { data: publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  const image_url = publicUrlData.publicUrl;
  console.log("Public URL:", image_url);

  try {
    await prisma.author.update({
      where: { id: user.id },
      data: {
        image_url,
      },
    });

    revalidatePath('/account', 'layout');
    console.log("Profile picture updated successfully");
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
}
   


