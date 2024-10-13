"use client";

import React, { useState, useEffect } from "react";
import { getBlogBySlug, publishPost, updatePost } from "./actions";
import { Button } from "@/components/ui/button"; // Assuming you are using a Button component
import { useRouter } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import BlogNotFound from "@/components/global/BlogNotFound";
import { Tag } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil, Tag as TagIcon } from "lucide-react";
import { AiOutlinePicture } from "react-icons/ai";
import Loading from "@/components/ui/loader-spinner";
import { useTheme } from "next-themes";
import { createDraft as saveDraft } from "@/app/write/actions";
import { createClient } from "@/app/utils/supabase/client";
import Image from "next/image";
import { BiLogoHeroku } from "react-icons/bi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function EditBlog({ params }: { params: { slug: string } }) {
  const [title, setTitle] = useState<string>("");

  const [cover, setCover] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [markdown, setMarkdown] = useState<boolean | null>(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [value, setValue] = useState<string>("");
  const [autoSave, setAutoSave] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [publishing, setPublishing] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState("");
  const [postId, setPostId] = useState<string>("");
  const [published, setPublished] = useState<boolean | null>(false);
  const [fetching, setFetching] = useState(true);
  const [draftTimeout, setDraftTimeout] = useState<NodeJS.Timeout | null>(null);
  const supabaseURL =
    "https://gktuazxnjcwahdrwuchb.supabase.co/storage/v1/object/public/blog-images/";

  const router = useRouter();

  const resolvedTheme = useTheme().resolvedTheme;
  const { slug } = params;

  // Fetch the post data from the server action
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setFetching(true);
        const post = await getBlogBySlug(slug); // Call the server action
        setTitle(post.title);
        setTags(post.tags);
        setPostId(post.id);
        setPublished(post.published);
        setValue(post.content);
        setDescription(post.description || "");
        setMarkdown(post.markdown);
        setImageUrl(post.cover_url);
        setFetching(false);
      } catch (error) {
        setError("Failed to fetch post data");
      }
    };

    fetchPostData();
  }, [slug]);

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = { id: Date.now().toString(), name: tagInput.trim() }; // Create a new tag object
      if (!tags.some((tag) => tag.name === newTag.name)) {
        setTags([...tags, newTag]); // Add the new tag if it's not already in the list
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: Tag) => {
    setTags(tags.filter((tag) => tag.id !== tagToRemove.id)); // Remove the tag by its ID
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
        setImageUrl(`${supabaseURL}${fileName}`);
      }
    } catch (err) {
      console.error("An unexpected error occurred:", err);
      setUploadError("An unexpected error occurred.");
    } finally {
      setImageLoading(false);
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updatePost(slug, title, value, description, tags); // Use another server action to update the post
      router.push(`/posts/${slug}`); // Redirect to the updated blog post
    } catch (error) {
      setError("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  const publish = async () => {
    try {
      setPublishing(true);
      await publishPost(postId); // Call the publishPost server action
      router.push(`/posts/${slug}`); // Redirect to the published post
    } catch (error) {
      setPublishing(false);
      setError("Failed to publish post");
    }
  };

  if (error) return <p>{error}</p>;

  if (fetching)
    return (
      <div className="min-h-screen min-w-screen grid place-content-center">
        <div className="flex items-center gap-4 text-primary flex-col scale-150 animate-pulse">
          <Loading />
          <p>Fetching blog...</p>
        </div>
      </div>
    );
  else if (error) return <BlogNotFound />;

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
                    src={imageUrl ? imageUrl : "/gradient.jpg"}
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
            </div>
          </div>
          {/* Content Section */}
          <div className="flex justify-center w-full">
            <div className="max-w-3xl w-full">
              <div className="p-4 flex flex-col gap-4 mt-4">
                {" "}
                <div className="py-2">
                  {!published && (
                    <>
                      <Alert>
                        <AlertTitle className="flex items-center gap-1">
                          <Pencil size={20} />
                          Draft Mode
                        </AlertTitle>
                        <AlertDescription>
                          Your blog is not published yet!
                        </AlertDescription>
                      </Alert>
                    </>
                  )}

                  {uploadError && <p className="text-red-500">{uploadError}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <Input
                    name="title"
                    value={title}
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
                  value={description}
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
                        <Badge
                          variant={"outline"}
                          className="mb-4"
                          key={tag.id}
                        >
                          <TagIcon size={10} className="mr-2" /> {tag.name}
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
                    onChange={(value) => setValue(value || "")} // Correctly update the content state
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
              </div>{" "}
            </div>
          </div>
        </form>{" "}
        <Button variant={"outline"} disabled={loading} className="w-full">
          {publishing ? <Loading /> : "Publish Post"}
        </Button>
      </div>
    </div>
  );
}
