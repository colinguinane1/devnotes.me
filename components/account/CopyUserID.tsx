"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { CheckCircle2Icon, Clipboard } from "lucide-react";

interface CopyUserIDProps {
  id: string;
}

export default function CopyUserID({ id }: CopyUserIDProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyUserID = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      variant: "success",
      title: "Success ✓",
      description: "Copied User ID to clipboard",
    });
  };

  return (
    <div className="flex items-center">
      <Button variant={"ghost"} size={"icon"} onClick={copyUserID}>
        {copied ? <CheckCircle2Icon color="green" /> : <Clipboard size={20} />}
      </Button>
    </div>
  );
}
