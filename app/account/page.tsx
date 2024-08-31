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
import ChangeFirstNameDialog from "@/components/account/ChangeFirstName";
import Image from "next/image";
import ChangeProfilePictureDialog from "@/components/account/ChangeProfilePicDialog";
import ChangeLastNameDialog from "@/components/account/ChangeLastName";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
                    <Image
                      src={author.image_url || "Cant find image"}
                      className="rounded-full"
                      width={50}
                      height={50}
                      alt={"pfp"}
                    ></Image>
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
                <h1 className="font-bold py-2 text-lg">First Name</h1>
                <div className="flex items-center gap-4 justify-between">
                  <p
                    className={`${
                      author.first_name === "null" && "text-gray-400"
                    }`}
                  >
                    {author.first_name}
                  </p>
                  <ChangeFirstNameDialog />
                </div>
              </div>
              <div className="text-sm">
                <h1 className="font-bold py-2 text-lg">Last Name</h1>
                <div className="flex items-center gap-4 justify-between">
                  <p
                    className={`${
                      author.last_name === "null" && "text-gray-400"
                    }`}
                  >
                    {author.last_name}
                  </p>
                  <ChangeLastNameDialog />
                </div>
              </div>
              <div className="">
                <Label htmlFor="uuid">User ID</Label>
                <div className="flex items-center">
                  <Input placeholder={user.id} id="uuid" disabled></Input>
                  <Button>Copy</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
}
