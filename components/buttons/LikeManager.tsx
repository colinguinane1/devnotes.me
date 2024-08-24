// File: /components/buttons/LikeManager.tsx
"use client";

import { useTransition } from "react";
import { handleLike } from "@/app/posts/[slug]/actions";
import Loading from "../ui/loader-spinner";
import { Heart } from "lucide-react";
import { Button } from "../ui/button";

export const PostLikedManager = ({ postId }: { postId: string }) => {
  const [isPending, startTransition] = useTransition();

  const like = () => {
    startTransition(() => {
      handleLike(postId);
    });
  };

  return (
    <Button variant={"ghost"} size={"icon"} onClick={like} disabled={isPending}>
      {isPending ? <Loading /> : <Heart fill="red" color="red" />}
    </Button>
  );
};

export const RemovePostLikeManager = ({ postId }: { postId: string }) => {
  const [isPending, startTransition] = useTransition();

  const like = () => {
    startTransition(() => {
      handleLike(postId);
    });
  };

  return (
    <Button variant={"ghost"} size={"icon"} onClick={like} disabled={isPending}>
      {isPending ? <Loading /> : <Heart />}
    </Button>
  );
};
