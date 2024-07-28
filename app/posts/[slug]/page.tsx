import prisma from "@/prisma/db";

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: {
      slug: params.slug,
    },
  });
  if (!post) {
    return <p>Blog not found!</p>;
  }

  return (
    <section className="py-24">
      <div className="container">
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <div
          className="prose mt-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
      </div>
    </section>
  );
}
