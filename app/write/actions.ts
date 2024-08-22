"use server"
import prisma from "@/prisma/db";
import { createClient } from "@/app/utils/supabase/server";

// Server action for creating a post
export async function createPost(formData: FormData) {
    const supabase = createClient();

    // Get the logged-in user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        console.log('User not found');
        throw new Error("User not authenticated");
    }

    try {
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const slug = formData.get('slug') as string;
        const content = formData.get('content') as string;

        await prisma.post.create({
            data: {
                title,
                description,
                slug,
                mdx: false,
                content,
                published: true,
                userId: user.id,
                author: {
                    connect: {
                        id: user.id,
                    },
                },
                createdAt: new Date(),
            },
        });
        console.log("Post created successfully");
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
}
