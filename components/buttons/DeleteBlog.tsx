"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, CheckCircle, Pencil } from "lucide-react";
import { ChangeBio, ChangeName, deletePost } from "@/app/account/actions";
import Loading from "../ui/loader-spinner";
import { Textarea } from "../ui/textarea";

export default function DeletePostDialog({ slug }: { slug: string }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const data = [{ title: "Delete Post", description: "This is irreversible!" }];

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <p className="text-destructive text-sm"> Delete Post</p>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              {data[0].title}
            </DialogTitle>
            <DrawerDescription>{data[0].description}</DrawerDescription>
          </DialogHeader>
          <ProfileForm slug={slug} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="border-destructive">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-destructive">
            {data[0].title}
          </DrawerTitle>
          <DrawerDescription>{data[0].description}</DrawerDescription>
        </DrawerHeader>
        <ProfileForm slug={slug} className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({
  className,
  slug,
}: React.ComponentProps<"form"> & { slug: string }) {
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
    }
  };

  return (
    <form
      className={cn("grid items-start gap-4", className)}
      onSubmit={handleSubmit}
    >
      <Button type="submit" variant={"destructive"} disabled={loading}>
        {loading ? <Loading /> : "Delete Post"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <div className="bg-green-500/50 flex items-center gap-2 max-w-fit px-2 rounded-md">
          <CheckCircle size={15} color="rgb(134 239 172)" />
          <p className="text-green-300">Deleted Post successfully!</p>
        </div>
      )}
    </form>
  );
}
