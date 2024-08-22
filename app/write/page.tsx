"use client";
import BlogEditor from "./editor"; // BlogEditor is now a client component
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createPost } from "./actions";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const defaultValue = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: 'Type "/" for commands or start writing...',
          },
        ],
      },
    ],
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget); // Create FormData object

    try {
      // Directly call the server action
      await createPost(formData);
      console.log("Post created successfully");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <main className="flex min-h-screen w-screen p-2 flex-col items-center justify-between">
      <div className="flex flex-col p-6 border w-full gap-6 rounded-md bg-card">
        <div className="flex md:flex-row flex-col justify-between">
          <div className="flex flex-col">
            <h1 className="text-4xl font-semibold">Write Your Blog</h1>
            <p className="text-gray-500 mt-4">
              Write your blog here, and publish it to the world.
            </p>
          </div>

          {/* {user && (
            <div className="flex gap-2 text-gray-500 items-center md:flex-col mt-4">
              <h1 className="flex items-center gap-2">Publish as:</h1>
              <div className="flex items-center gap-2">
                <Image
                  className="rounded-full"
                  width={40}
                  height={40}
                  src={currentUser?.image_url}
                  alt="pfp"
                />
                {currentUser?.username}
              </div>
            </div>
          )} */}
        </div>
        <div className="flex flex-col w-full items-center gap=4">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex-col flex md:flex-row mb-4 gap-2">
              <label>Title:</label>
              <input
                name="title"
                required
                className="border rounded-md p-1 w-full"
                placeholder="Blog Title"
              />
              <label>Slug:</label>
              <input
                required
                name="slug"
                className="border rounded-md p-1 w-full"
                placeholder="https://devnotes.me/posts/(slug)"
              />
            </div>
            <div className="pb-4">
              <label>Description:</label>
              <input
                maxLength={25}
                minLength={10}
                required
                name="description"
                className="border rounded-md p-1 w-full"
                placeholder="Enter your description"
              />
            </div>
            <BlogEditor initialValue={defaultValue} onChange={() => {}} />
            <Button className="w-full mt-4" type="submit">
              Publish Blog
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
