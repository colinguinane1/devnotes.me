import prisma from "@/prisma/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function ExplorePage() {
  const user = await currentUser();

  function formatDate(dateString: Date) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  }
  const posts = await prisma.post.findMany({
    include: {
      author: true, // Include author data
    },
  });
  return (
    <div className="grid p-4">
      {posts.map((post) => (
        <Card className="w-60 px-2 " key={post.id}>
          <CardContent>
            <CardTitle className="mt-4 capitalize">{post.title}</CardTitle>
            <CardDescription>{post.content}</CardDescription>
            <div className="flex items-center gap-2  min-w-fit">
              <Calendar size={18} /> {formatDate(post.updatedAt)}
            </div>
            <p className="mt-2">
              Posted by
              <div className="flex items-center gap-2">
                <Image
                  className="rounded-full"
                  alt="user"
                  src={post.author.image_url || ""}
                  width={25}
                  height={25}
                ></Image>
                <p>{post.author.first_name + post.author.last_name}</p>
              </div>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
