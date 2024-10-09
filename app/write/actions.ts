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
    let cover_url = imageUrl ? `${supabaseURL}${imageUrl}` : null;

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
        description,
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
 imageUrl: string, 
 postId?: string | null,
) {
  try {
    console.log(formData)
    // Safely retrieve and cast the title and content from the formData
    const title = formData.get('title') as string;
      const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const tagsString = formData.get('tags') as string | null;
    let cover_url = imageUrl ? `${supabaseURL}${imageUrl}` : null;
      const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();


    // Ensure title and content are not null
    if (!title || !content) {
      throw new Error("Title or content is missing from the form data");
    }

    // Generate slug from the title
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    // Parse tags string if it exists
    const tags = tagsString ? JSON.parse(tagsString) as string[] : [];

    // Prepare the tags input for Prisma
    const tagData = tags.map((tag) => ({
      where: { name: tag },       // Connect to an existing tag by name
      create: { name: tag },      // Create the tag if it doesn't exist
    }));

    if(postId){
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { tags: true },
        });
    
        if (!post) {
            throw new Error("Post not found");
        }
    
        // Update the post in the database
        const updatedDraft = await prisma.post.update({
            where: { id: postId },
            data: {
            title,
            description,
            content,
            cover_url,
            slug, // Add the slug here
            markdown,
             tags: {
          connectOrCreate: tagData, // Use connectOrCreate for the tags relation
        },
            },
        });
    
        console.log("Draft updated successfully", updatedDraft.id);
        return updatedDraft.id; // Return the draft postId
    }

    // Create the draft in the database
    const draft = await prisma.post.create({
      data: {
        title,
        description,
        content,
        cover_url,
        slug, // Add the slug here
        markdown,
        published: false, // Draft is not published yet
        author: { connect: { id: user?.id } }, // Connect the post to the author
        tags: {
          connectOrCreate: tagData, // Use connectOrCreate for the tags relation
        },
      },
    });
 console.log("Draft created successfully", draft.id);
    return draft.id; // Return the draft postId 
   
  } catch (error) {
    console.error("Error creating draft:", error);
    throw error; // Rethrow the error to handle it further up the stack
  }
 
}
