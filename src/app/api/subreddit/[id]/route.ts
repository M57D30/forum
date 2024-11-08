import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE method to delete a subreddit by id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log("id:", id);
  try {
    // Check if subreddit exists
    const subreddit = await db.subreddit.findUnique({
      where: { id },
    });

    if (!subreddit) {
      return NextResponse.json(
        { message: "Subreddit not found" },
        { status: 404 }
      );
    }

    // Delete the subreddit
    await db.subreddit.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Subreddit deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting subreddit:", error);
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
    // Extract the subreddit ID from the URL parameters
    const { id } = params;

    // Retrieve the subreddit
    const subreddit = await db.subreddit.findUnique({
      where: { id },
      include: {
        posts: true,
        Creator: true,
        subscribers: true,
      },
    });

    // Check if the subreddit exists
    if (!subreddit) {
      return NextResponse.json(
        { message: "Subreddit not found" },
        { status: 404 }
      );
    }

    // Return the retrieved subreddit data
    return NextResponse.json(subreddit, { status: 200 });
  } catch (error) {
    console.error("Error retrieving subreddit:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the subreddit ID from the URL parameters
    const { id } = params;

    // Parse the request body to get the fields to update
    const { name } = await req.json();
    console.log(name);
    // Validate required fields (e.g., ensure "name" is provided)
    if (!name) {
      return NextResponse.json(
        { message: "Subreddit name is required." },
        { status: 400 }
      );
    }

    // Update the subreddit with the provided fields
    const updatedSubreddit = await db.subreddit.update({
      where: { id },
      data: {
        name,
        updatedAt: new Date(), // Update the "updatedAt" timestamp manually if needed
      },
    });

    // Return the updated subreddit data
    return NextResponse.json(updatedSubreddit, { status: 200 });
  } catch (error) {
    console.error("Error updating subreddit:", error);

    // Return a generic 500 error for other cases
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
