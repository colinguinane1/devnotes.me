// ChangeProfilePicClient.tsx

"use client";

import { useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { Button } from "../ui/button";
import { ChangeProfilePicture } from "@/app/account/actions";
import { useMediaQuery } from "@/hooks/use-media-query";
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
import { Pencil } from "lucide-react";
import { Input } from "../ui/input";

export default function ChangeProfilePicClient() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const data = [{ title: "Change Avatar", description: "Change your avatar." }];

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
          <ProfilePicForm />
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
        <ProfilePicForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfilePicForm({ className }: React.ComponentProps<"form">) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    try {
      const supabase = createClient();

      // Ensure the user is authenticated
      const { data: session } = await supabase.auth.getSession();
      if (!session) {
        setUploadError("You must be logged in to upload a file.");
        return;
      }

      const user = session?.session?.user.id;

      const fileData = await selectedFile.arrayBuffer();
      const fileName = `${user}/avatar`;

      const mimeType = selectedFile.type || "application/octet-stream";

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, fileData, {
          cacheControl: "3600",
          upsert: true,
          contentType: mimeType,
        });

      if (error) {
        setUploadError("Error uploading file: " + error.message);
      } else {
        setUploadSuccess(true);
        setUploadError(null);
        console.log("File uploaded successfully:", data);
        ChangeProfilePicture();
      }
    } catch (err) {
      console.error("An unexpected error occurred:", err);
      setUploadError("An unexpected error occurred.");
    }
  };
  return (
    <div className="p-4">
      <div className="mt-4">
        <Input className="flex" type="file" onChange={handleFileChange} />
      </div>
      <div className="mt-4 flex justify-end">
        <p></p>
        <Button className="w-full" onClick={handleSave}>
          Save
        </Button>
      </div>
      {uploadError && <p className="mt-2 text-red-500">{uploadError}</p>}
      {uploadSuccess && (
        <p className="mt-2 text-green-500">File uploaded successfully!</p>
      )}
    </div>
  );
}
