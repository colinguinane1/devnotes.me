// Code: Support Page

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="h-screen -mt-20 grid place-content-center">
      <div className="flex items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>
              You can reach us at the following email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Support Email</Label>
                  <Input readOnly id="name" placeholder="support@devnotes.me" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="mailto:support@devnotes.me">
              <Button className="flex items-center gap-1">
                Email <ArrowRight size={10} />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
