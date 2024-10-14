'use server'
import prisma from "@/prisma/db";
import { createClient } from "@/app/utils/supabase/server";
import { calculateReadingTime, generateSlug } from "@/data/SiteData";

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

export async function createPost(
  formData: FormData, 
  markdown: boolean, 
  imageUrl: string, 
  published: boolean
) {
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

 



if (!title) {
  console.error("Form data received:", formData); // Add this to log form data
  throw new Error("Title is missing from the form data");
}
    const baseSlug = generateSlug(title);
    const slug = await ensureUniqueSlug(baseSlug);
    let cover_url = imageUrl;

    const tagIds = await handleTags(tags);


    // Create or update the post
    const post = await prisma.post.upsert({
      where: { slug: slug }, // Use unique slug or another unique identifier
      create: {
        title,
        cover_url,
        description,
     
        markdown,
        slug,
        content,
        published,
        updatedAt: new Date(),
        createdAt: new Date(),
        author: { connect: { id: user.id } },
        tags: { connect: tagIds.map(id => ({ id })) },
      },
      update: {
        title,
        cover_url,
      
        markdown,
        content,
        published,
        updatedAt: new Date(),
        tags: { set: tagIds.map(id => ({ id })) },
      },
    });

    console.log("Post created or updated successfully", post);
    return post.id; // Return the post ID after creation/upsert
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function createDraft(
  formData: FormData,
  markdown: boolean,
  imageUrl: string | null, 
  postId?: string | null,
) {
  try {
    console.log(formData);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const tagsString = formData.get('tags') as string | null;
    let cover_url = imageUrl;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!title || !content) {
      throw new Error("Title or content is missing from the form data");
    }

    const tags = tagsString ? JSON.parse(tagsString) as string[] : [];

    const tagData = tags.map((tag) => ({
      where: { name: tag },  // Connect to an existing tag by name
      create: { name: tag }, // Create the tag if it doesn't exist
    }));

    if (postId) {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { tags: true },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      // Only generate a new slug if the post doesn't already have one
      const slug = post.slug || generateSlug(title);

      const updatedDraft = await prisma.post.update({
        where: { id: postId },
        data: {
          title,
          description,
          content,
          cover_url,
          slug, // Add the slug if missing
          markdown,
          tags: {
            connectOrCreate: tagData, // Use connectOrCreate for the tags relation
          },
        },
      });

      console.log("Draft updated successfully", updatedDraft.id);
      return updatedDraft.id; // Return the draft postId
    }

    // Create a new draft
    const slug = generateSlug(title);

    const draft = await prisma.post.create({
      data: {
        title,
        description,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
        cover_url,
        slug, // Generate a new slug for the draft
        markdown,
        published: false, // Draft is not published yet
        author: { connect: { id: user?.id } },
        tags: {
          connectOrCreate: tagData, // Use connectOrCreate for the tags relation
        },
      },
    });

    console.log("Draft created successfully", draft.id);
    return draft.id; // Return the draft postId
  } catch (error) {
    console.error("Error creating draft:", error);
    throw error;
  }
}

