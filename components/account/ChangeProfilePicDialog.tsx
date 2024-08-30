// ChangeProfilePicClient.tsx

"use client"; // This is necessary to make this a client component

import { useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { Button } from "../ui/button";

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
      const fileData = await selectedFile.arrayBuffer();
      const fileName = `${Date.now()}-${selectedFile.name}`; // Optionally prepend a timestamp to avoid overwrites

      // Upload the file to Supabase storage
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, fileData, {
          cacheControl: "3600", // Optionally set cache control
          upsert: true, // Prevent overwriting existing files
        });

      if (error) {
        setUploadError("Error uploading file: " + error.message);
      } else {
        setUploadSuccess(true);
        setUploadError(null);
        console.log("File uploaded successfully:", data);
        // Optionally, update the profile picture URL in the database here
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
        <Button onClick={handleSave}>Save</Button>
      </div>
      {uploadError && <p className="mt-2 text-red-500">{uploadError}</p>}
      {uploadSuccess && (
        <p className="mt-2 text-green-500">File uploaded successfully!</p>
      )}
    </>
  );
}
