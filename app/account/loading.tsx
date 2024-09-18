import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div>
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-32" />
                </div>
              </Label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-3 flex-col">
              <Label htmlFor="name">Name</Label>
              <Skeleton className="h-6 w-48" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-3 flex-col">
              <Label htmlFor="email">Email</Label>
              <Skeleton className="h-6 w-64" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto mt-6">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between pb-6">
            <div className="flex gap-3 flex-col">
              <Label htmlFor="username">Username</Label>
              <Skeleton className="h-6 w-40" />
            </div>
          </div>

          <div className="flex items-center justify-between pb-6">
            <div className="flex gap-3 flex-col w-full">
              <Label htmlFor="bio">Profile Bio</Label>
              <Skeleton className="w-full h-20" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-40" />
        </CardFooter>
      </Card>

      <Card className="max-w-2xl mx-auto mt-6">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-40" />
        </CardFooter>
      </Card>
    </div>
  );
}
