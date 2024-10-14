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
  LogOut,
  Plus,
  PlusCircle,
  Settings,
  User,
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signOut } from "@/app/login/actions";

interface BlogDropdownProps {
  author: Author;
  type?: string;
}

export default function UserDropdown({
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

  if (isDesktop) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button className="h-10 w-10" size={"icon"} variant={"ghost"}>
            {author.image_url && (
              <Avatar className="w-full h-full border">
                <AvatarImage src={author.image_url} alt="@shadcn" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="" align="start">
          {" "}
          <DropdownMenuItem>
            <Link
              className="flex items-center gap-2"
              href={`/profile/${author.username}`}
            >
              <User className="w-5 h-5" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className="flex items-center gap-2" href={`/account`}>
              {author.image_url && (
                <Avatar className="w-5 h-5 border">
                  <AvatarImage src={author.image_url} alt="@shadcn" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              )}
              Account Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <form>
              <button
                formAction={signOut}
                className="text-destructive flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button size={"icon"} variant={"ghost"}>
            {author.image_url && (
              <Avatar className="w-full h-full border">
                <AvatarImage src={author.image_url} alt="@shadcn" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-card text-left items-start p-4 flex flex-col gap-6 pb-20">
          <DrawerClose asChild>
            <Link
              className="flex items-center gap-2"
              href={`/profile/${author.username}`}
            >
              <User className="w-6 h-6" />
              Profile
            </Link>
          </DrawerClose>
          <DrawerClose asChild>
            <Link className="flex items-center gap-2" href={`/account`}>
              {author.image_url && (
                <Avatar className="w-6 h-6">
                  <AvatarImage src={author.image_url} alt="@shadcn" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              )}
              Account Settings
            </Link>
          </DrawerClose>

          <DrawerClose asChild>
            <form>
              <button
                formAction={signOut}
                className="text-destructive flex items-center gap-2"
              >
                <LogOut className="w-6 h-6" /> Sign Out
              </button>
            </form>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    );
  }
}
