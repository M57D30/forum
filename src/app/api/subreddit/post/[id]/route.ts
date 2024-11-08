import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POsto getas
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the post ID from the URL

    const { id } = params;
    console.log(id);
    // Fetch the post from the database
    const post = await db.post.findUnique({
      where: { id },
      include: {
        author: true, // Include author information
        subreddit: true, // Include subreddit information
        comments: true, // Include comments if needed
        votes: true, // Include votes if needed
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Return the post data
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Error retrieving post:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Posto delete
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the post ID from the URL parameters
    const { id } = params;

    // Check if the post exists before attempting to delete it
    const post = await db.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Delete the post
    await db.post.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    // Extract the post ID from the URL parameters
    const { postId } = params;

    // Fetch all comments for the specified post

    const comments = await db.comment.findMany({
      where: { postId },
      include: {
        author: true, // Include author information
        replies: true, // Include replies if needed
        votes: true, // Include votes if needed
      },
      orderBy: { createdAt: "asc" }, // Optional: Order comments by creation date
    });

    // Check if comments exist
    if (comments.length === 0) {
      return NextResponse.json(
        { error: "Post has no comments yet." },
        { status: 404 }
      );
    }

    // Return all comments for the post, including the newly created comment
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Posto update
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the post ID from the URL parameters
    const { id } = params;

    // Parse the request body
    const { title, content } = await req.json(); // Assuming `title` and `content` are sent in the request body

    // Validate the input
    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required." },
        { status: 400 }
      );
    }

    // Check if the post exists
    const existingPost = await db.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
    }

    // Update the post
    const updatedPost = await db.post.update({
      where: { id },
      data: {
        title,
        content,
        updatedAt: new Date(), // Update the timestamp
      },
    });

    // Return the updated post data
    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
