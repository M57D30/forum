// import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    // const session = await getAuthSession();
    // Todo: sesija
    // if (!session?.user) {
    //   return new Response("Unauthorized", { status: 401 });
    // }

    const body = await req.json();
    const { name } = SubredditValidator.parse(body);

    // check if subreddit already exists
    const subredditExists = await db.subreddit.findFirst({
      where: {
        name,
      },
    });
    if (subredditExists) {
      return new Response("Subreddit already exists", { status: 409 });
    }

    // create subreddit and associate it with the user
    const subreddit = await db.subreddit.create({
      data: {
        name,
        // todo: hardcode
        creatorId: "1",
      },
    });

    // creator also has to be subscribed
    await db.subscription.create({
      data: {
        // todo: hardcode
        userId: "1",
        subredditId: subreddit.id,
      },
    });

    return NextResponse.json(subreddit, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create subreddit", { status: 500 });
  }
}

// GET method for fetching all subreddits
export async function GET() {
  try {
    const subreddits = await db.subreddit.findMany({
      include: {
        posts: true,
        Creator: true,
        subscribers: true,
      },
    });

    return NextResponse.json(subreddits);
  } catch (error) {
    console.error("Error fetching subreddits:", error);

    return NextResponse.json(
      { error: "Failed to fetch subreddits" },
      { status: 500 }
    );
  }
}
