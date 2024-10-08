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

export async function ChangeName(formData: FormData) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log('User not found');
        throw new Error("User not authenticated");
    }

    const name = formData.get('name') as string | null;

    if (!name) {
        console.log('Name is missing');
        throw new Error("Name is required");
    }

  
        await prisma.author.update({
            where: { id: user.id },
            data: {
                full_name: name,
            },
        });

        revalidatePath('/account', 'layout');
    }

    export async function ChangeBio(formData: FormData) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log('User not found');
        throw new Error("User not authenticated");
    }

    const bio = formData.get('bio') as string | null;

    if (!bio) {
        console.log('Name is missing');
        throw new Error("Name is required");
    }

  
        await prisma.author.update({
            where: { id: user.id },
            data: {
                bio,
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

export async function deletePost(slug: string){
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log('User not found');
        throw new Error("User not authenticated");
    }

    const post = await prisma.post.findUnique({
        where: {
            slug
        },
        include: {
            author: true
        }
    });

    if(user?.id !== post?.author.id ){
        throw new Error("User is not the author of this post");
    }

    if (!post) {
        throw new Error(`No post found for slug: ${slug}`);
    }

    try {
        await prisma.comment.deleteMany({
            where: {
                postId: post.id
            }
        })
        await prisma.post.delete({
            where: {
                slug
            }
        });

        revalidatePath('/account', 'layout');
        console.log("Post deleted successfully");
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
}

export async function ChangeSocial(socialLink: string | null, social: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log('User not found');
        throw new Error("User not authenticated");
    }

    const lowerSocial = social.toLowerCase();


  

    await prisma.author.update({
        where: { id: user.id },
        data: {
            [lowerSocial]: socialLink,
        },
    });

    revalidatePath('/account', 'layout');
}
   


