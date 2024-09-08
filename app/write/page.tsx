import React from "react";
import Link from "next/link";
import { FilePenIcon } from "lucide-react";
export default function EditorDialog() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="max-w-2xl -mt-[4rem] px-4 py-8 space-y-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Choose Your Blog Editor
          </h1>
          <p className="max-w-3xl mx-auto mt-4 text-lg text-muted-foreground">
            Select the blog editor that best fits your needs. The simple editor
            provides a basic writing experience using Notion-style commands,
            while the advanced editor offers a powerful Markdown-based writing
            experience for experienced bloggers.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/write/simple"
            className="flex flex-col items-center justify-center p-6 transition-colors rounded-lg shadow-lg bg-card hover:bg-card/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            prefetch={false}
          >
            <FilePenIcon className="w-12 h-12 text-primary" />
            <h3 className="mt-4 text-2xl font-bold text-foreground">
              Simple Editor
            </h3>
            <p className="mt-2 text-muted-foreground">
              A basic writing experience with Notion-style commands for
              formatting.
            </p>
          </Link>
          <Link
            href="/write/advanced"
            className="flex flex-col items-center justify-center p-6 transition-colors rounded-lg shadow-lg bg-card hover:bg-card/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            prefetch={false}
          >
            <FilePenIcon className="w-12 h-12 text-primary" />
            <h3 className="mt-4 text-2xl font-bold text-foreground">
              Advanced Editor
            </h3>
            <p className="mt-2 text-muted-foreground">
              A powerful Markdown-based writing experience with advanced
              formatting and publishing tools.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
