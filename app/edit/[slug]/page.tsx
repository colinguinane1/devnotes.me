"use client";

import React, { useState, useEffect } from "react";
import { getBlogBySlug, updatePost } from "./actions";
import { Button } from "@/components/ui/button"; // Assuming you are using a Button component
import { useRouter } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import BlogNotFound from "@/components/global/BlogNotFound";

export default function EditBlog({ params }: { params: { slug: string } }) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState<boolean | null>(false);
  const router = useRouter();

  const { slug } = params;

  // Fetch the post data from the server action
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const post = await getBlogBySlug(slug); // Call the server action
        setTitle(post.title);
        setContent(post.content);
        setDescription(post.description || "");
        setMarkdown(post.markdown);
      } catch (error) {
        setError("Failed to fetch post data");
        return <BlogNotFound />;
      }
    };

    fetchPostData();
  }, [slug]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updatePost(slug, title, content, description); // Use another server action to update the post
      router.push(`/posts/${slug}`); // Redirect to the updated blog post
    } catch (error) {
      setError("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4 mx-auto min-h-screen">
      <h1 className="text-4xl font-bold">Edit Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            className="w-full border rounded-md p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            className="w-full border rounded-md p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content">Content</label>
          <MDEditor
            height="100%"
            className="min-h-[500px]"
            preview="edit"
            value={content}
            previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
            onChange={(newValue) => setContent(newValue || "")} // Update state with new value
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Blog"}
        </Button>
      </form>
    </div>
  );
}
