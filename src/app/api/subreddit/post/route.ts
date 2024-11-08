// import { getAuthSession } from '@/lib/auth'
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { NextResponse } from "next/server";
import { z } from "zod";

// Todo: Reik sesijos

// Posto create
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, content, subredditId } = PostValidator.parse(body);
    // const session = await getAuthSession()

    // if (!session?.user) {
    //   return new Response('Unauthorized', { status: 401 })
    // }

    const subscription = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: "1",
      },
    });

    if (!subscription) {
      return new Response("Subscribe to post", { status: 403 });
    }

    const newpost = await db.post.create({
      data: {
        title,
        content,
        authorId: "1",
        subredditId,
      },
    });

    return NextResponse.json(newpost, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }
  }
}

/// Postu get all
export async function GET() {
  try {
    const posts = await db.post.findMany({
      include: {
        comments: true,
      },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (err) {
    console.log("Error fetching posts.:", err);

    return NextResponse.json(
      { error: "Failed to fetch subreddits" },
      { status: 500 }
    );
  }
}
