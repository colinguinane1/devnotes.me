// File: /components/buttons/LikeManager.tsx
"use client";

import { useTransition } from "react";
import { likePost } from "@/app/posts/[slug]/actions";

export default function LikeManager({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    startTransition(() => {
      likePost(postId);
    });
  };

  return (
    <button onClick={handleLike} disabled={isPending}>
      {isPending ? "Liking..." : "Like Post"}
    </button>
  );
}
