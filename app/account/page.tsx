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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { defaultAvatar } from "@/data/SiteData";
import { useToast } from "@/components/ui/use-toast";
import CopyUserID from "@/components/account/CopyUserID";

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
      <div className="-mt-32">
        <h1>Account</h1>
        <p>Author Profile cannot be found. {user.id}</p>
      </div>
    </section>;
  } else
    return (
      <section className="min-h-screen  grid place-content-center">
        <div className="-mt-32 ">
          <Card className="w-[95vw]">
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Change your account details here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <h1 className="font-bold py-2 text-lg">Avatar</h1>
                <div className="flex items-center gap-4 justify-between">
                  <p>
                    {author.image_url && (
                      <Avatar>
                        <AvatarImage src={author.image_url}></AvatarImage>
                        <AvatarFallback>{defaultAvatar}</AvatarFallback>
                      </Avatar>
                    )}
                  </p>
                  <ChangeProfilePictureDialog />
                </div>
              </div>
              <div className="text-sm">
                <h1 className="font-bold py-2 text-lg">Email</h1>
                <div className="flex items-center gap-4 justify-between mr-2">
                  <p>{author.email}</p>
                  <CheckCircle2 color="green" />
                </div>
              </div>
              <div className="text-sm">
                <h1 className="font-bold py-2 text-lg">Username</h1>
                <div className="flex items-center gap-4 justify-between">
                  <p>{author.username}</p>
                  <ChangeUsername />
                </div>
              </div>
              <div className="text-sm">
                <h1 className="font-bold py-2 text-lg">Name</h1>
                <div className="flex items-center gap-4 justify-between">
                  <p
                    className={`${
                      author.full_name === "null" && "text-gray-400"
                    }`}
                  >
                    {author.full_name}
                  </p>
                  <ChangeNameDialog />
                </div>
              </div>

              <div className="">
                <h1 className="font-bold py-2 text-lg">User ID</h1>

                <div className="flex items-center justify-between">
                  <p className="text-sm">{user.id}</p>
                  <CopyUserID id={author.id} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
}
