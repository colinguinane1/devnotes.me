"use client";

import { Button } from "@/components/ui/button";
import { subscribe, unsubscribe } from "@/app/profile/[[...username]]/actions"; // Adjust the import path as necessary
import { useState, useTransition } from "react";
import Loading from "../ui/loader-spinner";
import { CheckCircle, CheckCircle2Icon, PlusIcon } from "lucide-react";
import { BsCheckCircleFill } from "react-icons/bs";

interface SubscribeButtonProps {
  subscriberId: string;
  subscribeToId: string;
}

export function SubscribeButton({
  subscriberId,
  subscribeToId,
}: SubscribeButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubscribe = () => {
    startTransition(async () => {
      try {
        await subscribe(subscriberId, subscribeToId);
        // Optionally: Add a success message or update UI state here
      } catch (error) {
        console.error("Error subscribing:", error);
      }
    });
  };

  return (
    <Button className="w-full" onClick={handleSubscribe}>
      {isPending ? (
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-2">
            Following <BsCheckCircleFill />
          </p>
        </div>
      ) : (
        <p className="flex items-center gap-2">
          Follow <PlusIcon size={10} />
        </p>
      )}
    </Button>
  );
}

export function UnsubscribeButton({
  subscriberId,
  subscribeToId,
}: SubscribeButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleUnsubscribe = () => {
    startTransition(async () => {
      try {
        await unsubscribe(subscriberId, subscribeToId);
        // Optionally: Add a success message or update UI state here
      } catch (error) {
        console.error("Error unsubscribing:", error);
      }
    });
  };

  return (
    <Button className="w-full" onClick={handleUnsubscribe}>
      {isPending ? (
        <p className="flex items-center gap-2">
          Follow <PlusIcon size={10} />
        </p>
      ) : (
        <p className="flex items-center gap-2">
          Following <BsCheckCircleFill />
        </p>
      )}
    </Button>
  );
}
