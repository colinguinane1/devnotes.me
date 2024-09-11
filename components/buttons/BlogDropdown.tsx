"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { BsPerson, BsThreeDots } from "react-icons/bs";
import {
  Check,
  CheckCircle,
  Clipboard,
  Delete,
  Edit,
  Plus,
  PlusCircle,
} from "lucide-react";
import { useToast } from "../ui/use-toast";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Author } from "@prisma/client";
import { deletePost } from "@/app/account/actions";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import * as React from "react";
import DeletePostDialog from "./DeleteBlog";
import Loading from "../ui/loader-spinner";

interface BlogDropdownProps {
  slug: string;
  author: Author;
  type?: string;
}

export default function BlogDropdown({
  slug,
  author,
  type = "user",
}: BlogDropdownProps) {
  const { toast } = useToast();
  const successTitle = <CheckCircle size={15} /> + "Success!";
  const [open, setOpen] = React.useState(false);
  const [deleteState, setDeleteState] = React.useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);

    try {
      await deletePost(slug);
      setSuccess(true);
      // Optionally close the drawer or dialog here if you want to hide the form after success
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  const copyToClipboard = () => {
    const url = `https://www.devnotes.me/posts/${slug}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({
          variant: "success",
          title: "Success ✓",
          description: "Copied to clipboard",
        });
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy to clipboard",
        });
        console.error("Failed to copy text: ", err);
      });
  };
  if (isDesktop) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button size={"icon"} variant={"ghost"}>
            <BsThreeDots />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-transparent backdrop-blur-2xl"
          align="start"
        >
          <DropdownMenuItem
            onClick={copyToClipboard}
            className="cursor-pointer flex"
          >
            <div className="flex items-center gap-2">
              <Clipboard size={15} /> Copy Link
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer flex">
            <Link
              href={`/profile/${author.username}`}
              className="flex items-center gap-2"
            >
              <BsPerson /> Go to Author
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer flex">
            <div className="flex items-center gap-2">
              <Plus size={15} /> Add to Read Later
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button size={"icon"} variant={"ghost"}>
            <BsThreeDots />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-4 flex flex-col gap-6 pb-20">
          <DrawerClose>
            <button onClick={copyToClipboard} className="cursor-pointer flex">
              <div className="flex items-center gap-2">
                <Clipboard size={15} /> Copy Link
              </div>
            </button>
          </DrawerClose>
          <DrawerClose>
            <Link
              href={`/profile/${author.username}`}
              className="cursor-pointer flex"
            >
              <div className="flex items-center gap-2">
                <BsPerson size={15} /> Go To Author
              </div>
            </Link>
          </DrawerClose>
          <DrawerClose>
            <button className="cursor-pointer flex" disabled>
              <div className="flex items-center gap-2">
                <PlusCircle size={15} /> Add To Read Later (TODO)
              </div>
            </button>
          </DrawerClose>
          {type === "author" && (
            <DrawerClose>
              <Link className="cursor-pointer flex" href={`/edit/${slug}`}>
                <div className="flex items-center gap-2">
                  <Edit size={15} /> Edit Post
                </div>
              </Link>
            </DrawerClose>
          )}
          {type === "author" && (
            <>
              {deleteState ? (
                <form onSubmit={handleSubmit}>
                  <button
                    type="submit"
                    className="flex items-center justify-start"
                  >
                    <div className="flex items-center gap-2 justify-start">
                      <Delete size={15} color="red" />
                      {loading ? (
                        <Loading />
                      ) : (
                        <p className="text-destructive font-extrabold">
                          Are you sure? {error && <p>{error}</p>}
                        </p>
                      )}
                    </div>
                  </button>
                </form>
              ) : (
                <button onClick={() => setDeleteState(true)}>
                  <div className="flex items-center gap-2">
                    <Delete size={15} color="red" />
                    <p className="text-destructive">Delete Post</p>
                  </div>
                </button>
              )}
            </>
          )}
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
}
