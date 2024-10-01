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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Comment } from "@prisma/client";
import { Textarea } from "../ui/textarea";
import { addReply } from "@/app/actions";

interface BlogDropdownProps {
  comment: Comment;
  author: Author;
}

export default function ReplyButton({ comment, author }: BlogDropdownProps) {
  const { toast } = useToast();
  const successTitle = <CheckCircle size={15} /> + "Success!";
  const [open, setOpen] = React.useState(false);
  const [deleteState, setDeleteState] = React.useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  console.log(comment);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"ghost"}>Reply</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <ReplyForm comment={comment} author={author} />
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant={"ghost"}>Reply</Button>
        </DrawerTrigger>
        <DrawerContent className="bg-card text-left items-start p-4 flex flex-col gap-6 pb-20">
          <ReplyForm comment={comment} author={author} />
        </DrawerContent>
      </Drawer>
    );
  }
}

export function ReplyForm({
  comment,
  author,
}: {
  comment: Comment;
  author: Author;
}) {
  const [isPending, setIsPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setError(null);
    setSuccess(false);

    try {
      await addReply(comment.id, event.currentTarget.content.value);
      console.log("Comment added successfully");
      setIsPending(false);
      setSuccess(true);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("An error occurred. Please try again.");
      setIsPending(false);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-2xl mb-2 font-bold text-black dark:text-white">
        Reply
      </h3>
      <div className="p-2 border rounded-md bg-card/50">
        <p className="text-gray-600 flex items-center gap-2 dark:text-gray-400">
          Replying to{" "}
          <span>
            {" "}
            {author.image_url && (
              <Avatar className="w-6 h-6">
                <AvatarImage src={author.image_url} alt="@shadcn" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            )}
          </span>
          {author.username}
        </p>
        <blockquote>{comment.content}</blockquote>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <Textarea
          name="content"
          id="content"
          placeholder="Write your comment here..."
          className="h-24 text-black dark:text-white"
        />
        <div className="flex justify-end">
          <Button disabled={isPending} type="submit" className="w-42">
            {isPending ? <Loading /> : "Comment"}
          </Button>
        </div>
      </form>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
