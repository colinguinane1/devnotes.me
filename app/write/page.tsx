"use client";
import BlogEditor from "./editor";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createPost } from "@/lib/actions";
import { Check, Loader, X } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default function Home() {
  const [user, setUser] = useState<any>(null);
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
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchUser();
  }, []);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState("");
  const [content, setContent] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user.user) {
      console.error("User not authenticated");
      return;
    }

    try {
      setLoading("true");
      await createPost({
        title,
        description,
        slug,
        mdx: false,
        content: content,
        published: true,
        userId: user?.user.id,
        createdAt: new Date(),
      });
      setLoading("success");
      console.log("Post created successfully");
    } catch (error) {
      setLoading("error");
      setErrorMessage((error as Error).message);
      console.error("Error creating post:", error);
    }
  };
  console.log(content);
  return (
    <main className="flex min-h-screen w-screen p-2  flex-col items-center justify-between">
      <div className="flex flex-col p-6 border w-full gap-6 rounded-md bg-card">
        <div className="flex md:flex-row flex-col justify-between ">
          <div className="flex flex-col">
            <h1 className="text-4xl font-semibold"> Write Your Blog</h1>
            <p className="text-gray-500 mt-4">
              {" "}
              Write your blog here, and publish it to the world.
            </p>
          </div>
          {user.user && (
            <div className="flex gap-2 text-gray-500 items-center md:flex-col  mt-4">
              <h1 className="flex  items-center gap-2">Publish as:</h1>
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
        <div className="flex flex-col  w-full items-center gap-4">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex-col  flex md:flex-row mb-4  gap-2">
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
            <div className="pb-4">
              <label>Description:</label>
              <input
                maxLength={25}
                minLength={10}
                required
                value={description}
                name="description"
                className="border rounded-md p-1 w-full"
                placeholder="Enter your description"
                onChange={(e) => setDescription(e.target.value)}
              ></input>
            </div>
            <BlogEditor initialValue={defaultValue} onChange={setContent} />
            <Button
              disabled={loading === "true"}
              className="w-full mt-4"
              type="submit"
            >
              Publish Blog
              {loading === "true" ? (
                <Loader className="ml-2 animate-spin" size={20} />
              ) : null}
              {loading === "success" ? (
                <>
                  <Check className="ml-2" color="rgb(34 197 94)" size={20} />
                  <p className="text-green-500">Success</p>
                </>
              ) : null}
              {loading === "error" ? (
                <>
                  <X className="ml-2" color="red" size={20} />
                  <p className="text-red-500">{errorMessage}</p>{" "}
                </>
              ) : null}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
