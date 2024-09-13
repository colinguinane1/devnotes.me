"use client";

import BlogEditor from "./editor"; // BlogEditor is now a client component
import { createPost } from "../actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loader-spinner";

import { Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Editor() {
  const { toast } = useToast();
  const [content, setContent] = useState<string>(
    "Type for commands or start writing..."
  );
  const [loading, setLoading] = useState("false");
  const successToast = () => {
    toast({
      variant: "success",
      title: "Success ✓",
      description: "Blog posted successfully!",
    });
  };
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
  const markdown = false;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("content", content);
    try {
      setLoading("true");
      // Directly call the server action
      await createPost(formData, markdown);
      console.log("Post created successfully");
      setLoading("success");
      successToast();
    } catch (error) {
      setLoading("error");
      console.error("Error creating post:", error);
    }
  };

  return (
    <main className="flex min-h-screen w-screen  flex-col items-center justify-between">
      <div className="flex flex-col p-6  w-full gap-6 rounded-md ">
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
                name="slug"
                className="border rounded-md p-1 w-full"
                placeholder="https://devnotes.me/posts/(slug)"
              />
            </div>
            <div className="pb-4">
              <label>Description:</label>
              <input
                maxLength={250}
                required
                minLength={10}
                name="description"
                className="border rounded-md p-1 w-full"
                placeholder="Enter your description"
              />
            </div>
            <BlogEditor initialValue={defaultValue} onChange={setContent} />
            <Button
              className="w-full mt-4"
              type="submit"
              disabled={loading === "true"}
            >
              {loading === "true" && <Loading />}
              Publish Blog
              {loading === "success" && <Check color="green" />}
              {loading === "error" && <X color="red" />}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
