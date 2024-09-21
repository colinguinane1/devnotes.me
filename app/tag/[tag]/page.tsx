import prisma from "@/prisma/db";

export default async function tagPage({ params }: { params: { tag: string } }) {
    const posts = await prisma.post.findMany({
        where: {
            tags: {
                some: {
                    name: params.tag, // Assuming the tag model has a 'name' field
                },
            },
        },
    });

    return posts;
}
