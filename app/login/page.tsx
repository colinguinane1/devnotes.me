"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
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
import { Info, XCircle } from "lucide-react";
import LoadingSpinner from "@/components/ui/loader-spinner";
import { AnimatePresence, motion } from "framer-motion";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string; messageType: string };
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formType, setFormType] = useState("login");

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
    <section className="h-screen flex justify-center items-center">
      <div className="mb-60">
        <Tabs defaultValue="login">
          <TabsList className="w-full bg-card">
            <TabsTrigger
              className="w-full"
              value="login"
              onClick={() => setFormType("login")}
            >
              Log In
            </TabsTrigger>
            <TabsTrigger
              className="w-full"
              value="signup"
              onClick={() => setFormType("signup")}
            >
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
                    {searchParams.message && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0.5 }}
                        className={`text-sm border p-2 rounded-md flex items-center gap-2 font-medium ${
                          searchParams.messageType === "error"
                            ? "bg-red-200 text-red-700 border-red-300"
                            : "bg-green-200 text-green-700 border-green-300"
                        }`}
                      >
                        {searchParams.messageType === "error" ? (
                          <XCircle size={20} />
                        ) : (
                          <Info size={20} />
                        )}
                        {searchParams.message}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex justify-between">
                    <div></div>
                    <Link href="/forgot-password">
                      <p className="text-sm underline">Forgot Password?</p>
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full active:scale-95"
                  >
                    {isSubmitting && <LoadingSpinner />}
                    <motion.p
                      layout
                      className="flex items-center justify-center"
                    >
                      Log In
                    </motion.p>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="mx-auto w-[22rem]">
              <CardHeader>
                <CardTitle className="text-2xl">Sign Up</CardTitle>
                <CardDescription>Create a devnotes account.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <OAuthButtons />
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
                    {searchParams.message && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0.5 }}
                        className={`text-sm border p-2 rounded-md flex items-center gap-2 font-medium ${
                          searchParams.messageType === "error"
                            ? "bg-red-200 text-red-700 border-red-300"
                            : "bg-green-200 text-green-700 border-green-300"
                        }`}
                      >
                        {searchParams.messageType === "error" ? (
                          <XCircle size={20} />
                        ) : (
                          <Info size={20} />
                        )}
                        {searchParams.message}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full active:scale-95"
                  >
                    {isSubmitting && <LoadingSpinner />}
                    <motion.p
                      layout
                      className="flex items-center justify-center"
                    >
                      Sign Up
                    </motion.p>
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
