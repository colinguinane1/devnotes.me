import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { emailLogin, signup } from "./actions";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BsGithub } from "react-icons/bs";
import { OAuthButtons } from "./oauth-signin";
import { Info } from "lucide-react";

export default async function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/todos");
  }

  return (
    <section className="h-screen flex justify-center items-center">
      <div className="h-[65vh]">
        <Tabs defaultValue="login" className="">
          <TabsList className="w-full bg-card">
            <TabsTrigger className="w-full" value="login">
              Log In
            </TabsTrigger>
            <TabsTrigger className="w-full" value="signup">
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card className="mx-auto w-[22rem]">
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                  Enter your email below to login to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <OAuthButtons />
                <form id="login-form" className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      minLength={6}
                      name="password"
                      id="password"
                      type="password"
                      required
                    />
                  </div>
                  {searchParams.message && (
                    <div className="text-sm font-medium text-destructive">
                      <Info />
                      {searchParams.message}
                    </div>
                  )}
                  <div className="flex justify-between">
                    <div></div>
                    <Link href="/forgot-password">
                      <p className="text-sm underline">Forgot Password?</p>
                    </Link>
                  </div>
                  <Button formAction={emailLogin} className="w-full">
                    Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            {" "}
            <Card className="mx-auto w-[22rem]">
              <CardHeader>
                <CardTitle className="text-2xl">Sign Up</CardTitle>
                <CardDescription>Create a devnotes account.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <OAuthButtons />
                <form id="login-form" className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username*</Label>
                    <Input
                      className="w-full"
                      id="username"
                      name="username"
                      type="text"
                      placeholder="johndoe17"
                      required
                    />
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-2 ">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          className="w-full"
                          id="first_name"
                          name="first_name"
                          type="text"
                          placeholder="John"
                        />
                      </div>
                      <div className="flex flex-col gap-2 ">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          className="w-full"
                          id="last_name"
                          name="last_name"
                          type="text"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password *</Label>
                    </div>
                    <Input
                      minLength={6}
                      name="password"
                      id="password"
                      type="password"
                      placeholder="********"
                      required
                    />
                  </div>
                  {searchParams.message && (
                    <div className="text-sm border p-2 rounded-md flex items-center gap-2  font-medium  ">
                      <Info size={20} />
                      {searchParams.message}
                    </div>
                  )}
                  <Button formAction={signup} className="w-full">
                    Sign Up
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
