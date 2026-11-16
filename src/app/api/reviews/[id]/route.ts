import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { updateReviewSchema } from "@/schemas/review.schema";

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

    const body = await request.json();
    const validation = updateReviewSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json({ error: validation.error.issues }, { status: 400 });
    if (Object.keys(validation.data).length === 0)
      return NextResponse.json({ error: "At least one field is required" }, { status: 400 });

    const { rating, title, content } = validation.data;

    const { id } = await params;
    const reviewId = Number(id);
    if (!Number.isInteger(reviewId) || reviewId <= 0)
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    const existingReview = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!existingReview)
      return NextResponse.json({ error: "Review not found" }, { status: 404 });

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(rating !== undefined && { rating }),
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content })
      }
    });
    return NextResponse.json(updatedReview, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error from server" }, { status: 500 });
  }
}