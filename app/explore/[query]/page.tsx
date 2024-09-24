import prisma from "@/prisma/db";
import BlogCard from "@/components/global/BlogCard";
import UserIcon from "@/components/buttons/UserIcon";
import ClientSearchBar from "../SearchBar";
import { createClient } from "@/app/utils/supabase/server";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import UserCard from "@/components/global/UserCard";

export default async function QueryPage({
  params,
}: {
  params: { query: string };
}) {
  const queryString = decodeURIComponent(params.query || "");

  const query = queryString.replace("query=", "");

  var hour = new Date().getHours();
  var greet;

  if (hour >= 5 && hour < 11) greet = "Good morning,";
  else if (hour >= 11 && hour < 18) greet = "Good afternoon,";
  else if (hour >= 18 && hour < 23) greet = "Good evening,";
  else if (hour === 23 || hour < 5) greet = "Good morning, ";

  const supabase = createClient();

  // Get the logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let author = null;

  if (user?.id) {
    author = await prisma.author.findUnique({
      where: {
        id: user.id,
      },
    });
  }

  const tags = await prisma.tag.findMany({
    include: {
      posts: true,
    },
  });

  const author_first_name = author?.full_name?.split(" ")[0] || "";

  const PostSearchResults = await prisma.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    include: {
      author: true,
    },
  });
  const AuthorSearchResults = await prisma.author.findMany({
    where: {
      OR: [
        {
          username: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          full_name: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  console.log("Params:", queryString);

  if (!queryString) {
    console.error("no query");
  } else {
    console.log(query);
  }
  return (
    <main className="p-4 flex flex-col justify-center items-center gap-4 min-h-screen w-full">
      <section className="w-full max-w-2xl flex flex-col h-full items-center gap-4">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="md:text-4xl text-2xl font-extrabold">
              {greet} {author && author_first_name}
            </h1>
          </div>

          <UserIcon />
        </div>
        <div className="relative w-full">
          <ClientSearchBar />
        </div>
        <div className="border-b overflow-x-auto flex items-center gap-4 pb-4 no-scrollbar w-full">
          {tags.map((tag) => (
            <Link
              href={`/tag/${tag.name}`}
              className="flex items-center bg-card p-2 rounded-full px-5 gap-4"
              key={tag.id}
            >
              #{tag.name.toLowerCase()}
            </Link>
          ))}
        </div>{" "}
        <p>
          {PostSearchResults.length} results for &quot;{query}&quot; in posts
        </p>
        <p>
          {AuthorSearchResults.length} results for &quot;{query}&quot; in
          authors
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {PostSearchResults.map((post) => (
            <BlogCard key={post.id} post={post} author={post.author} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {AuthorSearchResults.map((author) => (
            <UserCard author={author} key={author.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
