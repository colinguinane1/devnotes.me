"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
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
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Pencil } from "lucide-react";
import { ChangeGitHubLink } from "@/app/account/actions"; // Change this to your actual function
import Loading from "../ui/loader-spinner";

export default function ChangeGitHubLinkDialog() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const data = [
    {
      title: "Set GitHub Profile",
      description: "Set or update your GitHub link.",
    },
  ];

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size={"icon"}>
            <Pencil size={15} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{data[0].title}</DialogTitle>
          </DialogHeader>
          <GitHubForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size={"icon"}>
          <Pencil size={15} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{data[0].title}</DrawerTitle>
        </DrawerHeader>
        <GitHubForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function GitHubForm({ className }: React.ComponentProps<"form">) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget); // This is creating FormData correctly
    const githubLink = formData.get("github") as string | null;

    try {
      // Pass the githubLink as a JSON payload to your server action
      await ChangeGitHubLink(githubLink); // Change this to pass data as JSON
      setSuccess(true);
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
      <div className="grid gap-2">
        <Label htmlFor="github">GitHub URL</Label>
        <Input id="github" name="github" placeholder="Enter your GitHub URL" />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? <Loading /> : "Update GitHub"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <div className="bg-green-500/50 flex items-center gap-2 max-w-fit px-2 rounded-md">
          <CheckCircle size={15} color="rgb(134 239 172)" />
          <p className="text-green-300">GitHub URL updated successfully!</p>
        </div>
      )}
    </form>
  );
}
