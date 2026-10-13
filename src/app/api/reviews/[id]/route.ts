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

