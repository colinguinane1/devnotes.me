"use client";
import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createPost } from "../actions"; // Your server action to create a post
import rehypeSanitize from "rehype-sanitize";
import { useTheme } from "next-themes";

export default function App() {
  const [loading, setLoading] = useState("false");
  const { setTheme, theme, resolvedTheme, themes } = useTheme();
  const { toast } = useToast();

  const successToast = () => {
    toast({
      variant: "success",
      title: "Success ✓",
      description: "Blog posted successfully!",
    });
  };

  const [value, setValue] = useState("**Hello world!!!**");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.append("content", value);

    // Add the content (markdown) to the FormData

    try {
      setLoading("true");
      await createPost(formData); // Call your server action
      console.log("Post created successfully");
      setLoading("success");
      successToast();
    } catch (error) {
      setLoading("error");
      console.error("Error creating post:", error);
    }
  };

  return (
    <div
      className="p-4 min-h-screen my-auto"
      data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}
    >
      <div className="flex flex-col w-full items-center gap=4">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex-col flex mb-4 gap-2">
            <label>Title:</label>
            <input
              name="title"
              required
              className="border rounded-md p-1 w-full"
              placeholder="Blog Title"
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
          <label>Content:</label>
          <MDEditor
            height="100%"
            preview="edit"
            value={value}
            previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
            onChange={(newValue) => setValue(newValue || "")} // Update state with new value
          />
          <p>Preview:</p>
          <MDEditor.Markdown
            className="p-4 rounded-lg border border-gray-300"
            source={value}
            style={{ whiteSpace: "pre-wrap" }}
          />
          <Button className="w-full mt-4" type="submit">
            {loading === "true" ? "Publishing..." : "Publish Blog"}
          </Button>
        </form>
      </div>
    </div>
  );
}
