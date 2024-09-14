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
import { ChangeSocial } from "@/app/account/actions"; // Change this to your actual function
import Loading from "../ui/loader-spinner";

interface SocialProps {
  social: string;
}

export default function ChangeSocialDialog({ social }: SocialProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const data = [
    {
      title: "Change " + social + " Link",
      description: "Set or update your" + social + " link.",
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
          <SocialChangeForm social={social} />
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
        <SocialChangeForm social={social} className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
function SocialChangeForm({
  className,
  social,
}: {
  className?: string;
  social: string;
}) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const socialLink = formData.get(social) as string | null;

    try {
      await ChangeSocial(socialLink, social);
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
        <Label htmlFor={social}>{social} URL</Label>
        <Input
          type="url"
          id={social}
          name={social}
          placeholder={`Enter your ${social}  URL`}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? <Loading /> : "Update  " + social + " URL"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <div className="bg-green-500/50 flex items-center gap-2 max-w-fit px-2 rounded-md">
          <CheckCircle size={15} color="rgb(134 239 172)" />
          <p className="text-green-300">URL updated successfully!</p>
        </div>
      )}
    </form>
  );
}
