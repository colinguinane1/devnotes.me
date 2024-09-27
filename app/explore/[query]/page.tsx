import prisma from "@/prisma/db";
import BlogCard from "@/components/global/BlogCard";
import UserIcon from "@/components/buttons/UserIcon";
import ClientSearchBar from "../SearchBar";
import { createClient } from "@/app/utils/supabase/server";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import UserCard from "@/components/global/UserCard";
import * as Tabs from "@radix-ui/react-tabs";
import { Tag, TagIcon, User } from "lucide-react";
import { IoIosPaper } from "react-icons/io";
import { Badge } from "@/components/ui/badge";

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

  const [PostSearchResults, AuthorSearchResults, TagSearchResults] =
    await Promise.all([
      prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        include: { author: true },
        take: 10,
      }),
      prisma.author.findMany({
        where: {
          OR: [
            { username: { contains: query, mode: "insensitive" } },
            { full_name: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 10,
      }),
      prisma.tag.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        include: {
          posts: true,
        },
      }),
    ]);

  console.log("Params:", queryString);

  if (!queryString) {
    console.error("no query");
  } else {
    console.log(query);
  }
  return (
    <main className="p-4 flex flex-col items-center   gap-4 min-h-screen w-screen">
      <section className="w-full max-w-2xl flex flex-col h-full items-center gap-4">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="md:text-4xl text-2xl font-extrabold">
              {greet} {author && author_first_name}
            </h1>
          </div>

          {user && <UserIcon />}
        </div>
        <div className="relative w-full">
          <ClientSearchBar />
        </div>
        <div className=" overflow-x-auto flex items-center gap-4  no-scrollbar w-full">
          {tags.map((tag) => (
            <Link
              href={`/tag/${tag.name}`}
              className="flex items-center bg-card p-2 rounded-full px-5 gap-4"
              key={tag.id}
            >
              <TagIcon size={10} className="" />
              {tag.name.toLowerCase()}
            </Link>
          ))}
        </div>{" "}
        <Tabs.Root defaultValue="posts" className="w-full">
          <Tabs.List
            defaultValue="posts"
            className="flex no-scrollbar pb-4 overflow-x-auto whitespace-nowrap  w-full "
          >
            <Tabs.Trigger
              className="px-5 h-[45px] w-full dark:data-[state=active]:text-white  border-b flex items-center justify-center text-[15px] leading-none text-gray-700 dark:text-gray-500 dark:data-[state=active]:border-white outline-none cursor-pointer transition-colors duration-200 data-[state=active]:text-black data-[state=active]:border-black"
              value="posts"
            >
              <IoIosPaper className="mr-1" /> ({PostSearchResults.length})
            </Tabs.Trigger>

            <Tabs.Trigger
              className="px-5 h-[45px] w-full dark:data-[state=active]:text-white  border-b flex items-center justify-center text-[15px] leading-none text-gray-700 dark:text-gray-500 dark:data-[state=active]:border-white outline-none cursor-pointer transition-colors duration-200 data-[state=active]:text-black data-[state=active]:border-black"
              value="authors"
            >
              <User className="mr-1" /> ({AuthorSearchResults.length})
            </Tabs.Trigger>

            <Tabs.Trigger
              className="px-5 h-[45px] w-full dark:data-[state=active]:text-white  border-b flex items-center justify-center text-[15px] leading-none text-gray-700 dark:text-gray-500 dark:data-[state=active]:border-white outline-none cursor-pointer transition-colors duration-200 data-[state=active]:text-black data-[state=active]:border-black"
              value="tabs"
            >
              <Tag className="mr-1" /> ({TagSearchResults.length})
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="posts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {PostSearchResults.map((post) => (
                <BlogCard key={post.id} post={post} author={post.author} />
              ))}
            </div>
          </Tabs.Content>
          <Tabs.Content value="authors">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {AuthorSearchResults.map((author) => (
                <UserCard author={author} key={author.id} />
              ))}
            </div>
          </Tabs.Content>
          <Tabs.Content value="tabs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {TagSearchResults.map((tag) => (
                <Link href={`/tag/${tag.name}`} key={tag.id}>
                  <Badge
                    className="flex items-center gap-1 max-w-fit"
                    variant={"outline"}
                  >
                    <TagIcon size={10} />
                    {tag.name} ({tag.posts.length})
                  </Badge>
                </Link>
              ))}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </section>
    </main>
  );
}
