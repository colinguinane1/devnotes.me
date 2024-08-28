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

