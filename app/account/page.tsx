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
import {
  CheckCircle2,
  Linkedin,
  Pencil,
  SeparatorHorizontal,
  Upload,
} from "lucide-react";
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

import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChangeBio, ChangeGitHubLink } from "./actions";
import CopyUserID from "@/components/account/CopyUserID";
import { Textarea } from "@/components/ui/textarea";
import { BsDiscord, BsGithub, BsTwitterX } from "react-icons/bs";
import ChangeGitHubLinkDialog from "@/components/account/ChangeGitHubLink";

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
      <div className="container px-4 py-10">
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Update your account information here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              {author.image_url && (
                <Avatar className="w-20 h-20">
                  <AvatarImage src={author.image_url} alt="User avatar" />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
              )}
              <div>
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <ChangeProfilePictureDialog />
                  </div>
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
            <div className=" flex items-center justify-between">
              <div className="flex gap-3 flex-col">
                <Label htmlFor="name">Name</Label>
                <p>{author.full_name ? author.full_name : "N/A"}</p>
              </div>
              <ChangeNameDialog />
            </div>
            <div className=" flex items-center justify-between">
              <div className="flex gap-3 flex-col">
                <Label htmlFor="name">User ID</Label>
                <p>{author.id}</p>
              </div>
              <CopyUserID id={author.id} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <p>{author.email}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="max-w-2xl mx-auto mt-6">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your public profile information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className=" flex items-center pb-6 justify-between">
              <div className="flex gap-3 flex-col">
                <Label htmlFor="name">Username</Label>
                <p>{author.username}</p>
              </div>
              <ChangeUsernameDialog />
            </div>
            <div className=" flex items-center pb-6 justify-between">
              <div className="flex gap-3 flex-col w-full">
                <Label htmlFor="name">Profile Bio</Label>
                <Textarea className="w-full" readOnly>
                  {author.bio}
                </Textarea>{" "}
                <div className="flex justify-between">
                  <p></p>
                  <ChangeBioDialog />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Social Links</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="github"
                        className="flex items-center space-x-2"
                      >
                        <BsGithub className="w-4 h-4" />
                        <span>GitHub</span>
                      </Label>
                      <div className="flex items-center justify-between w-full">
                        <p>
                          {author.pref_githubLink
                            ? author.pref_githubLink
                            : "N/A"}
                        </p>{" "}
                        <ChangeGitHubLinkDialog />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="twitter"
                        className="flex items-center space-x-2"
                      >
                        <BsTwitterX className="w-4 h-4" />
                        <span>Twitter</span>
                      </Label>
                      <Input
                        id="twitter"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="linkedin"
                        className="flex items-center space-x-2"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </Label>
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="discord"
                        className="flex items-center space-x-2"
                      >
                        <BsDiscord className="w-4 h-4" />
                        <span>Discord</span>
                      </Label>
                      <Input id="discord" placeholder="username#0000" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
        <Card className="max-w-2xl mx-auto mt-6">
          <CardHeader>
            <CardTitle>Delete Account</CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This action cannot be undone. All your data will be permanently
                removed.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button variant="destructive">Delete Account</Button>
          </CardFooter>
        </Card>
      </div>
    );
}
