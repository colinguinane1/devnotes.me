import BlogCard from "@/components/global/BlogCard";
import prisma from "@/prisma/db";

export default async function tagPage({ params }: { params: { tag: string } }) {
  const { tag } = params;

  const tagPage = await prisma.tag.findUnique({
    where: {
      name: tag,
    },
  });

  const tagPosts = await prisma.post.findMany({
    where: {
      tags: {
        some: {
          name: tag,
        },
      },
    },
    include: {
      author: true,
    },
  });

  return (
    <div className="min-h-screen min-w-screen">
      <div className="p-4">
        <div className="flex items-center border-b py-4 justify-center">
          <div>
            <h1 className="font-extrabold text-4xl">#{tagPage?.name}</h1>
            <p>{tagPosts.length} posts</p>
            <p>0 followers</p>
          </div>
        </div>
        <div className="grid gap-4 py-4">
          {tagPosts.map((post) => (
            <BlogCard
              key={post.id}
              horizontal={true}
              post={post}
              author={post.author}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
