import { createClient } from "../utils/supabase/server";
import prisma from "@/prisma/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Pencil } from "lucide-react";
import ChangeUsername from "@/components/account/ChangeUsername";
import ChangeNameDialog from "@/components/account/ChangeName";
import Image from "next/image";
import ChangeProfilePictureDialog from "@/components/account/ChangeProfilePicDialog";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRightIcon } from "lucide-react";
import { formatDate } from "@/data/SiteData";
import ChangeBioDialog from "@/components/account/ChangeBio";
import VerifiedUser from "@/components/ui/verified";
import ChangeUsernameDialog from "@/components/account/ChangeUsername";

export default async function AccountPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("User not found");
    return (
      <section className="min-h-screen grid place-content-center">
        <div className="-mt-32">
          <h1>Account</h1>
          <p>User not found</p>
        </div>
      </section>
    );
  }
  const author = await prisma.author.findUnique({
    where: { id: user.id },
  });

  if (!author) {
    <section className="min-h-screen grid place-content-center">
      <div className="-mt-30">
        <h1>Account</h1>
        <p>Author Profile cannot be found. {user.id}</p>
      </div>
    </section>;
  } else
    return (
      <div className="flex flex-col w-full -mt-2 min-h-screen bg-background">
        <main className="flex ">
          <div className=" w-full">
            <div className="grid grid-cols-1 gap-8">
              <div className="bg-card rounded-lg p-6">
                <div className="flex items-center gap-4">
                  {author.image_url && (
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={author.image_url} alt="User Avatar" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div className="text-lg font-medium text-foreground">
                      {author.full_name ? (
                        <div>
                          <h2 className="flex items-center gap-2">
                            {author.full_name}{" "}
                            {author.verified && <VerifiedUser />}
                          </h2>
                          <h2 className="">@{author.username}</h2>
                        </div>
                      ) : (
                        <h2 className="">{author.username}</h2>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {author.email}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg p-6">
                <Collapsible className="grid gap-4">
                  <CollapsibleTrigger className="flex items-center justify-between text-lg font-medium text-foreground [&[data-state=open]>svg]:rotate-90">
                    Personal Information
                    <ChevronRightIcon className="h-5 w-5 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <div className="flex items-center justify-between">
                          <p>{author.full_name ? author.full_name : "-"}</p>
                          <ChangeNameDialog />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="name">Email</Label>
                        <div className=" flex-col">
                          <p>{author.email}</p>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible className="grid gap-4">
                  <CollapsibleTrigger className="flex items-center justify-between text-lg font-medium text-foreground [&[data-state=open]>svg]:rotate-90">
                    Security
                    <ChevronRightIcon className="h-5 w-5 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          defaultValue="********"
                        />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible className="grid gap-4">
                  <CollapsibleTrigger className="flex items-center justify-between text-lg font-medium text-foreground [&[data-state=open]>svg]:rotate-90">
                    Notifications
                    <ChevronRightIcon className="h-5 w-5 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox id="email-notifications" defaultChecked />
                        <Label htmlFor="email-notifications">
                          Email Notifications
                        </Label>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible className="grid gap-4">
                  <CollapsibleTrigger className="flex items-center justify-between text-lg font-medium text-foreground [&[data-state=open]>svg]:rotate-90">
                    Profile
                    <ChevronRightIcon className="h-5 w-5 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid gap-4">
                      {" "}
                      <div className="flex flex-col">
                        {" "}
                        <Label>Username</Label>
                        <div className="flex items-center justify-between">
                          {author.username ? author.username : "-"}{" "}
                          <ChangeUsernameDialog />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        {" "}
                        <Label>Profile Bio</Label>
                        <div className="flex items-center justify-between">
                          {author.bio ? author.bio : "-"} <ChangeBioDialog />
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
}
