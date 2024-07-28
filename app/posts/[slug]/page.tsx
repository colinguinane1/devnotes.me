import prisma from "@/prisma/db";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: {
      slug: params.slug,
    },
    include: { author: true },
  });
  if (!post) {
    return <p>Blog not found!</p>;
  }

  return (
    <section className="p-4 py-8">
      <div>
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <div className="flex items-center my-2 gap-2">
          <Button variant={"outline"}>
            <Link
              className="flex items-center my-2 gap-2"
              href={`/profile/${post.author.username}`}
            >
              <Image
                className="rounded-full"
                width={30}
                height={40}
                //@ts-ignore
                src={post.author.image_url}
              ></Image>
              <h1 className="">{post.author.username}</h1>
            </Link>
          </Button>
        </div>
        <div
          className="prose dark:text-gray-400 mt-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
      </div>
    </section>
  );
}
