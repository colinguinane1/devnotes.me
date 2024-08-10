"use client"; // Ensures this component is client-side only

import { Button } from "../ui/button";
import { HeartIcon, Loader } from "lucide-react";
import { SignedIn, useUser } from "@clerk/nextjs";
import { manageLikes } from "@/lib/actions";
import { useState, useEffect } from "react";

interface LikeManagerProps {
  postId: string; // Define the type of postId
}

export default function LikeManager({ postId }: LikeManagerProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);

  // Optionally, you can check if the post is already liked on component mount
  useEffect(() => {
    // Check if the post is already liked by the user
    // Set `liked` state accordingly if you have an API to check this
  }, [postId, user]);

  const handleLike = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    setLoading(true);
    try {
      // Call the manageLikes function to handle the like/unlike
      await manageLikes(user.id, postId);
      setLiked((prev) => !prev); // Toggle liked state
      console.log("Liked successfully");
    } catch (error) {
      console.error("Error managing like:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SignedIn>
        <Button onClick={handleLike} size="icon" disabled={loading}>
          {loading ? (
            <div className="animate-spin">
              <Loader />
            </div>
          ) : (
            <HeartIcon className={liked ? "text-red-500" : ""} />
          )}
        </Button>
      </SignedIn>
    </div>
  );
}
