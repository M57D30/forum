import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { subredditId: string } }
) {
  const { subredditId } = params;

  try {
    const posts = await db.post.findMany({
      where: {
        subredditId: subredditId,
      },
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

    console.log(posts);
    return new Response(JSON.stringify(posts));
  } catch (error) {
    console.log(error);
    return new Response("Could not fetch posts for subreddit", { status: 500 });
  }
}
