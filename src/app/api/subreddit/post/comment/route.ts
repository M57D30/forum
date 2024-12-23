import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/comment";
import { NextResponse } from "next/server";
import { z } from "zod";

// Todo: AUTH truksta

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { postId, text, replyToId } = CommentValidator.parse(body);

    // Authenticate the user (assuming user authentication is added later)
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Create a new comment in the database
    const comment = await db.comment.create({
      data: {
        text,
        postId,
        authorId: session?.user.id, // Replace with actual authorId from session if available
        replyToId,
      },
    });

    // Return a success response
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    // Generic error handling
    return new Response(
      "Could not post comment at this time. Please try later",
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const comments = await db.comment.findMany({
      include: {
        author: true,
      },
    });

    if (!comments) {
      return NextResponse.json({ message: "Not found." }, { status: 404 });
    }

    return NextResponse.json(comments);
  } catch (error) {
    NextResponse.json(
      { message: "Internal server error:" + error },
      { status: 500 }
    );
  }
}
