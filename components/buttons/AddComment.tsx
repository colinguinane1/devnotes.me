"use client";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { addComment } from "@/app/posts/[slug]/actions";
import * as React from "react";
import Loading from "../ui/loader-spinner";

export default function AddCommentForm({ postId }: { postId: string }) {
  // useTransition hook for managing transitions
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const content = formData.get("content") as string;

    if (!content || content.trim() === "") {
      setError("Content cannot be empty");
      return;
    }

    // Start a transition and run the async operation
    startTransition(async () => {
      try {
        await addComment(postId, content);
        setSuccess(true);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      }
    });
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-black dark:text-white">
        Leave a Comment
      </h3>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <Textarea
          name="content"
          id="content"
          placeholder="Write your comment here..."
          className="h-24 text-black dark:text-white"
        />
        <div className="flex justify-end">
          <Button disabled={isPending} type="submit" className="w-42">
            {isPending ? <Loading /> : "Comment"}
          </Button>
        </div>
      </form>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
