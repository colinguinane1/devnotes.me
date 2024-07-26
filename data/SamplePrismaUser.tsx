// components/SamplePrismaUser.tsx

"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SamplePrismaUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/createUser", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const data = await response.json();
      console.log("User created:", data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={createAccount} disabled={loading}>
        {loading ? "Creating..." : "Create Sample Account"}
      </Button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}
