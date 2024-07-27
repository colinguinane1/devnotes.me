"use client";
import BlogEditor from "./editor";
import { JSONContent } from "novel";
import { useState } from "react";
import { defaultValue } from "./default-value";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createPost } from "@/lib/actions";

export default function Home() {
  const user = useUser();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [value, setValue] = useState<JSONContent>(defaultValue);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user.user) {
      console.error("User not authenticated");
      return;
    }

    try {
      await createPost({
        title,
        slug,
        content: JSON.stringify(value),
        published: true,
        userId: user.user.id,
      });
      console.log("Post created successfully");
      // Optionally, you can reset form fields or navigate to another page
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  console.log(value);
  return (
    <main className="flex min-h-screen w-screen p-6  flex-col items-center justify-between">
      <div className="flex flex-col p-6 border w-full gap-6 rounded-md bg-card">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-4xl font-semibold"> Write Your Blog</h1>
            <p className="text-gray-500">
              {" "}
              Write your blog here, and publish it to the world.
            </p>
          </div>
          {user.user && (
            <div>
              <h1 className="flex items-center gap-2">Publish as:</h1>
              <div className="flex items-center gap-2">
                <Image
                  className="rounded-full"
                  width={40}
                  height={40}
                  src={user.user?.imageUrl}
                  alt="pfp"
                ></Image>{" "}
                {user.user?.username}
              </div>
            </div>
          )}
        </div>
        <div className="flex w-full items-center gap-4">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex my-4 items-center gap-4">
              <label>Title:</label>
              <input
                name="title"
                required
                className="border rounded-md p-1 w-full"
                placeholder="Blog Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></input>
              <label>Slug:</label>
              <input
                required
                value={slug}
                name="slug"
                className="border rounded-md p-1 w-full"
                placeholder="https://devnotes.me/posts/(slug)"
                onChange={(e) => setSlug(e.target.value)}
              ></input>
            </div>{" "}
            <BlogEditor initialValue={value} onChange={setValue} />
            <Button className="w-full my-2" type="submit">
              Publish Blog
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
