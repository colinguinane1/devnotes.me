"use client";

import { useTransition, useState } from "react";
import { uploadProfilePicture } from "@/app/profile/[[...username]]/actions";

export default function ProfilePictureUpload({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    startTransition(async () => {
      const result = await uploadProfilePicture(userId, file);

      if (result.success) {
        setFileUrl(result.publicUrl);
        setErrorMessage(null);
        alert("Profile picture uploaded successfully!");
      } else {
        setErrorMessage("An error occurred while uploading.");
      }
    });
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {isPending && <p>Uploading...</p>}
      {fileUrl && (
        <div>
          <p>Uploaded image:</p>
          <img src={fileUrl} alt="Profile" width={200} />
        </div>
      )}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}
