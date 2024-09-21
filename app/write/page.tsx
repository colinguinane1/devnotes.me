"use client";
import React, { useState, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createPost } from "./actions";
import rehypeSanitize from "rehype-sanitize";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { createClient } from "../utils/supabase/client";

export default function App() {
  const [loading, setLoading] = useState(false);
  const { setTheme, theme, resolvedTheme } = useTheme();
  const { toast } = useToast();
  
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState("");
  const markdown = true;
  const [value, setValue] = useState("**Hello world!!!**");

  const successToast = () => {
    toast({
      variant: "success",
      title: "Success ✓",
      description: "Blog posted successfully!",
    });
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
      await handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setImageLoading(true);
      const supabase = createClient();
      const { data: session } = await supabase.auth.getSession();

      if (!session) {
        setUploadError("You must be logged in to upload a file.");
        return;
      }

      const userId = session?.session?.user.id;
      const fileData = await file.arrayBuffer();
      const fileName = `${userId}/image_${Date.now()}`;
      const mimeType = file.type || "application/octet-stream";

      const { data, error } = await supabase.storage
        .from("blog-images")
        .upload(fileName, fileData, {
          cacheControl: "3600",
          upsert: true,
          contentType: mimeType,
        });

      if (error) {
        setUploadError("Error uploading file: " + error.message);
      } else {
        setImageUrl(fileName);
      }
    } catch (err) {
      console.error("An unexpected error occurred:", err);
      setUploadError("An unexpected error occurred.");
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("content", value);
    formData.append("tags", JSON.stringify(tags));

    try {
      setLoading(true);
      await createPost(formData, markdown, imageUrl);
      successToast();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const trimmedTag = tagInput.trim();
      if (!tags.includes(trimmedTag) && tags.length < 5) {
        setTags((prev) => [...prev, trimmedTag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="p-4 min-h-screen my-auto" data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}>
      <div className="flex flex-col w-full items-center gap-4">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex-col flex mb-4 gap-2">
            <div className="max-w-xl mx-auto mt-8 p-6 bg-card rounded-lg shadow-md">
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
                <Label htmlFor="image-upload" className="sr-only">Choose an image to upload</Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                  aria-label="Click or press enter to upload an image"
                >
                  <PlusIcon className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              {selectedImage ? (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                  <div className="relative w-full h-64">
                    <Image src={selectedImage} alt="Preview of the selected image" layout="fill" objectFit="contain" />
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 mt-2">No image selected</p>
              )}
              {uploadError && <p className="text-red-500">{uploadError}</p>}
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
                <span key={tag} className="bg-gray-200 text-black px-2 py-1 rounded-full text-sm flex items-center gap-1">
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
            {tags.length >= 5 && <p className="text-red-500">Maximum of 5 tags allowed.</p>}
          </div>

          <label>Content:</label>
          <MDEditor
            height="100%"
            className="min-h-[500px]"
            preview="edit"
            value={value}
            previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
            onChange={(newValue) => setValue(newValue || "")}
          />
          <p>Preview:</p>
          <MDEditor.Markdown
            className="p-4 rounded-lg border border-gray-300"
            source={value}
            style={{ whiteSpace: "pre-wrap" }}
          />
          <Button className="w-full mt-4" type="submit" disabled={loading}>
            {loading ? "Publishing..." : "Publish Blog"}
          </Button>
        </form>
      </div>
    </div>
  );
}
