"use client";
import { useState, useRef, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createPost, createDraft as saveDraft } from "./actions";
import rehypeSanitize from "rehype-sanitize";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, Tag } from "lucide-react";
import Image from "next/image";
import { createClient } from "../utils/supabase/client";
import { Badge } from "@/components/ui/badge";
import { AiOutlinePicture } from "react-icons/ai";
import Loading from "@/components/ui/loader-spinner";
import { title } from "process";
import { AnimatePresence, motion } from "framer-motion";

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
  const [autoSave, setAutoSave] = useState(false);
  const markdown = true;
  const [postId, setPostId] = useState<string | null>(null);
  const [value, setValue] = useState("Start writing your blog here...");
  const [title, setTitle] = useState(""); // State for the title
  const [description, setDescription] = useState(""); // State for the title

  const [draftTimeout, setDraftTimeout] = useState<NodeJS.Timeout | null>(null);

  const supabaseURL =
    "https://gktuazxnjcwahdrwuchb.supabase.co/storage/v1/object/public/blog-images/";

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
        setImageUrl(supabaseURL + fileName);
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
    const published = true;

    try {
      setLoading(true);
      await createPost(formData, markdown, imageUrl, published);
      successToast();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const createDraft = async () => {
    const formData = new FormData();
    formData.append("content", value);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags));
    const published = false;
    try {
      setAutoSave(true);
      const post_id = await saveDraft(formData, true, imageUrl, postId);
      setPostId(post_id); // Update the postId state after draft creation
    } catch (error) {
      console.error("Error creating draft:", error);
    } finally {
      setAutoSave(false);
    }
  };

  // Auto-save draft effect
  useEffect(() => {
    if (draftTimeout) {
      clearTimeout(draftTimeout); // Clear previous timeout if any
    }

    const timeout = setTimeout(() => {
      if (value.trim()) {
        createDraft(); // Only save draft if there is content
      }
    }, 2000); // 2 seconds delay before saving the draft

    setDraftTimeout(timeout);

    return () => {
      if (draftTimeout) {
        clearTimeout(draftTimeout); // Cleanup timeout on component unmount or change
      }
    };
  }, [value, tags, imageUrl]); // Run effect when value, tags, or image changes

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
      <div className="flex flex-col items-center gap-4">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full">
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
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-[400px] md:mt-0 mt-[-4px] w-screen overflow-hidden"
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
                  </p>
                </div>
              </div>

              {uploadError && <p className="text-red-500">{uploadError}</p>}
            </div>
          </div>
          {/* Content Section */}
          <div className="flex justify-center w-full">
            <div className="max-w-3xl w-full">
              <div className="p-4 flex flex-col gap-4 mt-4">
                <div className="flex items-center justify-between">
                  <Input
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    className="p-1 border-none font-extrabold text-4xl w-full placeholder:font-extrabold placeholder:text-4xl tracking-tight"
                    placeholder="Blog Title"
                  />
                  <div className="dark:text-gray-200 text-black flex w-fit items-center animate-pulse gap-2">
                    {autoSave && <Loading />}
                  </div>
                </div>
                <Input
                  maxLength={250}
                  required
                  onChange={(e) => setDescription(e.target.value)}
                  minLength={10}
                  name="description"
                  className="p-1 w-full border-none placeholder:font-semibold placeholder:text-lg border-b text-lg font-semibold"
                  placeholder="Blog description"
                />
                <div className="">
                  {tags.length > 0 && (
                    <div className="flex items-center flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge variant={"outline"} className="mb-4" key={tag}>
                          <Tag size={10} className="mr-2" /> {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      pattern="^[a-zA-Z0-9]+$"
                      placeholder="Add a tag and press Enter"
                      className="placeholder:text-gray-500"
                    />
                  </div>
                </div>
                <div
                  data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}
                >
                  <MDEditor
                    value={value}
                    onChange={(val = "") => setValue(val)}
                    preview="edit"
                    hideToolbar={false}
                    height={400}
                    fullscreen={false}
                    autoFocus={false}
                    extraCommands={[]}
                    visiableDragbar={false}
                    previewOptions={{
                      rehypePlugins: [[rehypeSanitize]],
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? <Loading /> : "Post"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
