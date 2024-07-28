import prisma from "@/prisma/db";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import rehypePrettyCode from "rehype-pretty-code";

export default async function Post({ params }: { params: { slug: string } }) {
  function formatDate(dateString: Date) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  }

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
        <div className="border-b">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <div className="flex items-center my-2 gap-2">
            <Link className="my-2" href={`/profile/${post.author.username}`}>
              <div className="flex h-full bg-slate-100 dark:bg-gray-900 dark:text-gray-300 rounded-full w-fit  pr-2 md:flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Image
                    className="rounded-full"
                    alt="user"
                    src={post.author.image_url || ""}
                    width={25}
                    height={25}
                  ></Image>
                  <p>{post.author.username} -</p>
                </div>
                <div className="flex items-center gap-2  min-w-fit">
                  <Calendar size={18} /> {formatDate(post.updatedAt)}
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div
          className="prose    dark:text-gray-400 dark:prose-headings:text-white mt-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
      </div>
    </section>
  );
}
