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
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const router = useRouter();

  const { slug } = params;

  // Fetch the post data from the server action
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const post = await getBlogBySlug(slug); // Call the server action
        setTitle(post.title);
        setTags(post.tags);
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

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault(); // Prevent form submission on Enter key
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]); // Add the new tag if it's not already in the list
        setTagInput(""); // Clear the input field
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove)); // Remove the tag
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updatePost(slug, title, content, description, tags); // Use another server action to update the post
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
        <div className="pb-4">
          <label>Tags:</label>
          <div className="flex items-center flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-200 text-black px-2 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            value={tagInput}
            disabled={tags.length >= 5}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            className="border rounded-md p-1 w-full"
            placeholder="Type a tag and press Enter"
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
