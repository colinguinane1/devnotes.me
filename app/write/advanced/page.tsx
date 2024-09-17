"use client";
import React, { useState, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createPost } from "../actions"; // Your server action to create a post
import rehypeSanitize from "rehype-sanitize";
import { useTheme } from "next-themes";
import BlogImageUpload from "@/components/buttons/BlogimageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";

export default function App() {
  const [loading, setLoading] = useState("false");
  const { setTheme, theme, resolvedTheme } = useTheme();
  const { toast } = useToast();

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const successToast = () => {
    toast({
      variant: "success",
      title: "Success ✓",
      description: "Blog posted successfully!",
    });
  };

  const markdown = true;
  const [value, setValue] = useState("**Hello world!!!**");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.append("content", value);
    formData.append("tags", JSON.stringify(tags)); // Add tags as JSON string
    // Set published to false

    try {
      setLoading("true");
      await createPost(formData, markdown); // Call your server action
      console.log("Post created successfully");
      setLoading("success");
      successToast();
    } catch (error) {
      setLoading("error");
      console.error("Error creating post:", error);
    }
  };

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

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="p-4 min-h-screen my-auto"
      data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}
    >
      <div className="flex flex-col w-full items-center gap=4">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex-col flex mb-4 gap-2">
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Image Upload</h2>
              <div className="mb-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                  id="image-upload"
                  ref={fileInputRef}
                  aria-label="Choose an image to upload"
                />
                <Label htmlFor="image-upload" className="sr-only">
                  Choose an image to upload
                </Label>
                <div
                  onClick={handleUploadClick}
                  className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleUploadClick()}
                  aria-label="Click or press enter to upload an image"
                >
                  <PlusIcon className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              {selectedImage ? (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                  <div className="relative w-full h-64">
                    {/* <Image
                      src={selectedImage}
                      alt="Preview of the selected image"
                      layout="fill"
                      objectFit="contain"
                    /> */}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 mt-2">
                  No image selected
                </p>
              )}
            </div>
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

          <label>Content:</label>
          <MDEditor
            height="100%"
            className="min-h-[500px]"
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
