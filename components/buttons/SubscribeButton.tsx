// components/SubscribeButton.tsx
"use client"; // This directive makes the component a Client Component

import { Button } from "@/components/ui/button";
import { subscribe, unsubscribe } from "@/app/profile/[[...username]]/actions"; // Adjust the import path as necessary
import { useState } from "react";
import Loading from "../ui/loader-spinner";

interface SubscribeButtonProps {
  subscriberId: string;
  subscribeToId: string;
}

export function SubscribeButton({
  subscriberId,
  subscribeToId,
}: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      await subscribe(subscriberId, subscribeToId);
      // Optionally: Add a success message or update UI state here
    } catch (error) {
      console.error("Error subscribing:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button onClick={handleSubscribe} disabled={isLoading}>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loading />
          <p>Subscribing...</p>
        </div>
      ) : (
        "Subscribe"
      )}
    </Button>
  );
}

export function UnsubscribeButton({
  subscriberId,
  subscribeToId,
}: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      await unsubscribe(subscriberId, subscribeToId);
      // Optionally: Add a success message or update UI state here
    } catch (error) {
      console.error("Error unsubscribing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={"destructive"}
      onClick={handleUnsubscribe}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loading />
          <p>Unsubscribing...</p>
        </div>
      ) : (
        "Unsubscribe"
      )}
    </Button>
  );
}
