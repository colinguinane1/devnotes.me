// ChangeProfilePicClient.tsx

"use client";

import { useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { Button } from "../ui/button";
import { ChangeProfilePicture } from "@/app/account/actions";

export default function ChangeProfilePicClient() {
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
    <>
      <div className="mt-4">
        <input type="file" onChange={handleFileChange} />
      </div>
      <div className="mt-4 flex justify-end">
        <p></p>
        <Button onClick={handleSave}>Save</Button>
      </div>
      {uploadError && <p className="mt-2 text-red-500">{uploadError}</p>}
      {uploadSuccess && (
        <p className="mt-2 text-green-500">File uploaded successfully!</p>
      )}
    </>
  );
}
