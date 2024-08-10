"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { BsPerson, BsThreeDots } from "react-icons/bs";
import { Clipboard, Plus } from "lucide-react";
export default function BlogDropdown(slug: any) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://www.devnotes.me/posts/${slug}`
      );
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size={"icon"} className="" variant={"ghost"}>
          <BsThreeDots />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-transparent backdrop-blur-md"
        align="start"
      >
        <DropdownMenuItem
          onClick={() => copyToClipboard}
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
