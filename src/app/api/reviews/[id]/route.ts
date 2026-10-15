import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const reviewId = Number(id);
    if (!Number.isInteger(reviewId) || reviewId <= 0)
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: { select: { id: true, username: true } },
        game: true
      }
    });
    if (!existingReview)
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    return NextResponse.json(existingReview, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error from server" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const reviewId = Number(id);
    if (!Number.isInteger(reviewId) || reviewId <= 0)
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    const existingReview = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!existingReview)
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    const deletedReview = await prisma.review.delete({ where: { id: reviewId } });
    return NextResponse.json(deletedReview, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error from server" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const reviewId = Number(id);
    const body = await request.json();
    const { rating, title, content } = body;

    if (!Number.isInteger(reviewId) || reviewId <= 0)
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });

    if (rating === undefined && title === undefined && content === undefined)
      return NextResponse.json({ error: "At least one field is required" }, { status: 400 });

    if (rating !== undefined && (!Number.isInteger(rating) || rating < 1 || rating > 10))
      return NextResponse.json({ error: "Rating must be an integer between 1 and 10" }, { status: 400 });

    if (title !== undefined && (typeof title !== "string" || title.trim().length === 0))
      return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });

    if (content !== undefined && (typeof content !== "string" || content.trim().length === 0))
      return NextResponse.json({ error: "Content cannot be empty" }, { status: 400 });

    const existingReview = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!existingReview)
      return NextResponse.json({ error: "Review not found" }, { status: 404 });

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(rating !== undefined && { rating }),
        ...(title !== undefined && { title: title.trim() }),
        ...(content !== undefined && { content: content.trim() })
      }
    });
    return NextResponse.json(updatedReview, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error from server" }, { status: 500 });
  }
}