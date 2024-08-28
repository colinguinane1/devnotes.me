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
import { ChangeFirstName, ChangeUsername } from "@/app/account/actions";
import Loading from "../ui/loader-spinner";

export default function ChangeLastNameDialog() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const data = [
    { title: "Change First Name", description: "Change your first name." },
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
            <DialogDescription>{data[0].description}</DialogDescription>
          </DialogHeader>
          <ProfileForm />
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
          <DrawerDescription>{data[0].description}</DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
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
      await ChangeFirstName(formData);
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
      <div className="grid gap-2">
        <Label htmlFor="username">First Name</Label>
        <Input
          id="first_name"
          name="first_name"
          placeholder="Enter your new first name"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? <Loading /> : "Update First Name"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <div className="bg-green-500/50 flex items-center gap-2 max-w-fit px-2 rounded-md">
          <CheckCircle size={15} color="rgb(134 239 172)" />
          <p className="text-green-300">First Name updated successfully!</p>
        </div>
      )}
    </form>
  );
}
