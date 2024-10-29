"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { emailLogin, signup } from "./actions";
import { redirect } from "next/navigation";
import { createClient } from "@/app/utils/supabase/server";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BsGithub } from "react-icons/bs";
import { OAuthButtons } from "./oauth-signin";
import { Info, XCircle } from "lucide-react";
import LoadingSpinner from "@/components/ui/loader-spinner";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "@/components/ui/loader-spinner";

export default function Login({
  searchParams,
}: {
  searchParams: { m: string; type: string; form: string };
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formType, setFormType] = useState("login");

  const tabChangeHandler = (value: string) => {
    setFormType(value);
    redirect(`/login`);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const action = formType === "login" ? emailLogin : signup;

    try {
      await action(formData);
      redirect("/todos"); // or any other post-submit redirection logic
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="grid h-screen -mt-20 place-content-center">
      <div className="max-h-fit px-4">
        <Tabs
          className="max-h-fit"
          defaultValue="login"
          value={formType}
          onValueChange={tabChangeHandler}
        >
          <TabsList className="w-full bg-card border">
            <TabsTrigger className="w-full" value="login">
              Log In
            </TabsTrigger>
            <TabsTrigger className="w-full" value="signup">
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card className="mx-auto border bg-card w-fit">
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                  Enter your email below to login to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <form
                  id="login-form"
                  className="grid gap-4"
                  onSubmit={handleSubmit}
                >
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
                  <AnimatePresence>
                    {searchParams.form === "login" && searchParams.m && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0.5 }}
                        className={`text-sm border p-2 rounded-md flex items-center gap-2 font-medium ${
                          searchParams.type === "error"
                            ? "bg-red-200 text-red-700 border-red-300"
                            : "bg-green-200 text-green-700 border-green-300"
                        }`}
                      >
                        {searchParams.type === "error" ? (
                          <XCircle size={20} />
                        ) : (
                          <Info size={20} />
                        )}
                        {searchParams.m}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* <div className="flex justify-between">
                    <div></div>
                    <Link href="/forgot-password">
                      <p className="text-sm underline">Forgot Password?</p>
                    </Link>
                  </div> */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full active:scale-95 flex items-center justify-center"
                  >
                    <AnimatePresence>
                      {isSubmitting && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="items-center justify-center flex px-2"
                          layout
                        >
                          <Loading />
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <motion.p layout>Log In</motion.p>
                  </Button>

                  <OAuthButtons />
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="bg-card border">
              <CardHeader>
                <CardTitle className="text-2xl">Sign Up</CardTitle>
                <CardDescription>Create a devnotes account.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <form
                  id="signup-form"
                  className="grid gap-4"
                  onSubmit={handleSubmit}
                >
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
                  <AnimatePresence>
                    {searchParams.form === "signup" && searchParams.m && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0.5 }}
                        className={`text-sm border p-2 rounded-md flex items-center gap-2 font-medium ${
                          searchParams.type === "error"
                            ? "bg-red-200 text-red-700 border-red-300"
                            : "bg-green-200 text-green-700 border-green-300"
                        }`}
                      >
                        {searchParams.type === "error" ? (
                          <XCircle size={20} />
                        ) : (
                          <Info size={20} />
                        )}
                        {searchParams.m}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full active:scale-95"
                  >
                    <AnimatePresence>
                      {isSubmitting && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="items-center justify-center flex px-2"
                          layout
                        >
                          <Loading />
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <motion.p
                      layout
                      className="flex items-center justify-center"
                    >
                      Sign Up
                    </motion.p>
                  </Button>

                  <OAuthButtons />
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
