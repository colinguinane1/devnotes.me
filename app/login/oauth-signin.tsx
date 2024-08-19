"use client";
import { Button } from "@/components/ui/button";
import { Provider } from "@supabase/supabase-js";
import { Github } from "lucide-react";
import { oAuthSignIn } from "./actions";
import { BsGoogle } from "react-icons/bs";

type OAuthProvider = {
  name: Provider;
  displayName: string;
  icon?: JSX.Element;
};

export function OAuthButtons() {
  const oAuthProviders: OAuthProvider[] = [
    {
      name: "github",
      displayName: "GitHub",
      icon: <Github className="size-5" />,
    },
    {
      name: "google",
      displayName: "Google",
      icon: <BsGoogle className="size-5" />,
    },
  ];

  return (
    <div className="flex md:flex-col gap-4">
      {oAuthProviders.map((provider) => (
        <Button
          key={provider.name}
          variant={"outline"}
          className="w-full flex  items-center  justify-center gap-2"
          onClick={async () => {
            await oAuthSignIn(provider.name);
          }}
        >
          {provider.icon}
          {provider.displayName}
        </Button>
      ))}
    </div>
  );
}
