'use server'
import prisma from "@/prisma/db";
import { createClient } from "@/app/utils/supabase/server";
import { generateSlug } from "@/data/SiteData";

const supabaseURL = "https://gktuazxnjcwahdrwuchb.supabase.co/storage/v1/object/public/blog-images/";

async function ensureUniqueSlug(baseSlug: string) {
    let slug = baseSlug;
    let count = 1;

    while (await prisma.post.findFirst({ where: { slug } })) {
        slug = `${baseSlug}-${count}`;
        count++;
    }

    return slug;
}

async function handleTags(tags: any) {
    const tagIds = [];
    for (const tag of tags) {
        let existingTag = await prisma.tag.findFirst({ where: { name: tag } });

        if (!existingTag) {
            existingTag = await prisma.tag.create({ data: { name: tag } });
        }

        tagIds.push(existingTag.id);
    }
    return tagIds;
}

export async function createPost(formData: FormData, markdown: boolean, imageUrl: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log('User not found');
        throw new Error("User not authenticated");
    }

    try {
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const content = formData.get('content') as string;
        const tagsString = formData.get('tags') as string;
        const tags = JSON.parse(tagsString) as string[];

        if (!title || !description || !content) {
            throw new Error("All fields are required");
        }

        const baseSlug = generateSlug(title);
        const slug = await ensureUniqueSlug(baseSlug);
        const cover_url = supabaseURL + imageUrl;

        const tagIds = await handleTags(tags);

        // Create the post only once, after handling all tags
        const post = await prisma.post.create({
            data: {
                title,
                cover_url,
                description,
                markdown,
                slug,
                content,
                published: true,
                createdAt: new Date(),
                author: {
                    connect: { id: user.id },
                },
                tags: {
                    connect: tagIds.map(id => ({ id })),
                },
            },
        });

        console.log("Post created successfully", post);
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
}
