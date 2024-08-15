"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { BsPerson, BsThreeDots } from "react-icons/bs";
import { Clipboard, Plus } from "lucide-react";
import { useToast } from "../ui/use-toast";

interface BlogDropdownProps {
  slug: string;
}

export default function BlogDropdown({ slug }: BlogDropdownProps) {
  const { toast } = useToast();

  const copyToClipboard = () => {
    const url = `https://www.devnotes.me/posts/${slug}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({
          variant: "success",
          title: "Success!",
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
          <div className="flex items-center gap-2">
            <BsPerson /> Go to Author
          </div>
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
