// import { getAuthSession } from '@/lib/auth'
import { db } from "@/lib/db";
// import { z } from "zod";

export async function GET() {
  try {
    const posts = await db.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        subreddit: true,
        votes: true,
        author: true,
        comments: true,
      },
    });

    return new Response(JSON.stringify(posts));
  } catch (error) {
    console.log(error);
    return new Response("Could not fetch posts", { status: 500 });
  }
}
