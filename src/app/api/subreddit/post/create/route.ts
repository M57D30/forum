// import { getAuthSession } from '@/lib/auth'
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";

// Todo: Reik sesijos

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, content, subredditId } = PostValidator.parse(body);
    console.log("zydas");
    console.log(title);
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

    await db.post.create({
      data: {
        title,
        content,
        authorId: "1",
        subredditId,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }
  }
}
