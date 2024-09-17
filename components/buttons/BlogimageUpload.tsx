"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { PlusIcon } from "lucide-react";

export default function BlogImageUpload() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Image Upload</h2>
      <div className="mb-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="sr-only"
          id="image-upload"
          ref={fileInputRef}
          aria-label="Choose an image to upload"
        />
        <Label htmlFor="image-upload" className="sr-only">
          Choose an image to upload
        </Label>
        <div
          onClick={handleUploadClick}
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleUploadClick()}
          aria-label="Click or press enter to upload an image"
        >
          <PlusIcon className="w-12 h-12 text-gray-400" />
        </div>
      </div>
      {selectedImage ? (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Preview:</h3>
          <div className="relative w-full h-64">
            <Image
              src={selectedImage}
              alt="Preview of the selected image"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-2">No image selected</p>
      )}
    </div>
  );
}
