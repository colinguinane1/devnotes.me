// /app/api/blogs/[slug]/route.ts
import { NextResponse } from 'next/server';
import prisma from "@/prisma/db";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const blog = await prisma.post.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
      },
    });

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching blog' }, { status: 500 });
  }
}
