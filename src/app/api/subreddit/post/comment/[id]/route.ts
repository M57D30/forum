import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the comment ID from the URL parameters
    const { id } = params;

    // Parse the request body to get the new text for the comment
    const { text } = await req.json();

    // Validate the input
    if (!text) {
      return NextResponse.json(
        { message: "Comment text is required." },
        { status: 400 }
      );
    }

    // Check if the comment exists
    const existingComment = await db.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return NextResponse.json(
        { message: "Comment not found." },
        { status: 404 }
      );
    }

    // Update the comment
    const updatedComment = await db.comment.update({
      where: { id },
      data: { text },
    });

    // Return the updated comment data
    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the comment ID from the URL parameters
    const { id } = params;

    // Check if the comment exists
    const existingComment = await db.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return NextResponse.json(
        { message: "Comment not found." },
        { status: 404 }
      );
    }

    // Delete the comment
    await db.comment.delete({
      where: { id },
    });

    // Return a success message
    return NextResponse.json(
      { message: "Comment deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(id);
    const comment = await db.comment.findUnique({
      where: {
        id: id,
      },
    });

    if (!comment) {
      return NextResponse.json({ message: "Not found." }, { status: 404 });
    }

    return NextResponse.json(comment, { status: 200 });
  } catch (error) {
    console.log("Error fetching comment:", error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
