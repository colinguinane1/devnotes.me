"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { BsPerson, BsThreeDots } from "react-icons/bs";
import { Check, CheckCircle, Clipboard, Plus } from "lucide-react";
import { useToast } from "../ui/use-toast";
import Link from "next/link";
import { User } from "@prisma/client";

interface BlogDropdownProps {
  slug: string;
  author: User;
}

export default function BlogDropdown({ slug, author }: BlogDropdownProps) {
  const { toast } = useToast();
  const successTitle = <CheckCircle size={15} /> + "Success!";

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size={"icon"} variant={"ghost"}>
          <BsThreeDots />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-transparent backdrop-blur-md"
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
}
