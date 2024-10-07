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
import { PlusIcon, Tag } from "lucide-react";
import Image from "next/image";
import { createClient } from "../utils/supabase/client";
import { Badge } from "@/components/ui/badge";
import { AiOutlinePicture } from "react-icons/ai";

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

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    <div
      className="min-h-screen my-auto"
      data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}
    >
      <div className="flex flex-col w-full items-center gap-4">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex-col w-full flex  gap-2">
            <div className="w-full mx-auto bg-card rounded-lg shadow-md">
              <div className="">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                  id="image-upload"
                  ref={fileInputRef}
                  aria-label="Choose an image to upload"
                />{" "}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-[400px] md:-mt-0 mt-[-4px]  w-screen overflow-hidden"
                >
                  <Image
                    src={selectedImage ? selectedImage : "/gradient.jpg"}
                    alt="Blog cover image"
                    width={1920}
                    height={1080}
                    className="h-full w-full object-cover cursor-pointer"
                    style={{ aspectRatio: "1920/1080", objectFit: "cover" }}
                  />
                  <p className="absolute bottom-4 right-4 flex items-center gap-2 text-gray-200">
                    <AiOutlinePicture color="rgb(229 231 235)" /> Change Cover
                    Image
                  </p>{" "}
                </div>
                <Label htmlFor="image-upload" className="sr-only">
                  Choose an image to upload
                </Label>
              </div>

              {uploadError && <p className="text-red-500">{uploadError}</p>}
            </div>
          </div>
          <div className="p-4 mt-4">
            <Input
              name="title"
              required
              className="p-1 border-none w-full placeholder:font-extrabold placeholder:text-4xl"
              placeholder="Blog Title"
            />

            <div className="">
              <Input
                maxLength={250}
                required
                minLength={10}
                name="description"
                className="p-1 w-full border-none placeholder:font-semibold placeholder:text-lg"
                placeholder="Enter your description"
              />
            </div>

            <div className="pb-4">
              {tags.length > 0 && (
                <div className="flex items-center flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge variant={"outline"} key={tag}>
                      <Tag size={10} className="mr-1" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-red-500 ml-1 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <Input
                value={tagInput}
                disabled={tags.length >= 5}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                className=" border-none p-1 w-full"
                placeholder="Type a tag and press Enter"
              />
              {tags.length >= 5 && (
                <p className="text-red-500">Maximum of 5 tags allowed.</p>
              )}
            </div>

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
          </div>
          <Button className="w-full mt-4" type="submit" disabled={loading}>
            {loading ? "Publishing..." : "Publish Blog"}
          </Button>
        </form>
      </div>
    </div>
  );
}
