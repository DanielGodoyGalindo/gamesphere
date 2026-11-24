import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createReviewSchema } from "@/schemas/review.schema";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = Number(user.id);
    const body = await request.json();
    const validation = createReviewSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json({ error: validation.error.issues }, { status: 400 });
    const { gameId, rating, title, content } = validation.data;
    const existingGame = await prisma.game.findUnique({ where: { id: gameId } });
    if (!existingGame)
      return NextResponse.json({ error: "Game ID not found" }, { status: 404 });
    const existingReview = await prisma.review.findUnique({ where: { userId_gameId: { userId, gameId } } });
    if (existingReview)
      return NextResponse.json({ error: "User's review already exists for this game" }, { status: 409 });
    const newReview = await prisma.review.create({ data: { userId, gameId, rating, title, content } });
    return NextResponse.json(newReview, { status: 201 });
  } catch (e) {
    console.error(e);
    if (typeof e === "object" && e !== null && "code" in e && e.code === "P2002")
      return NextResponse.json({ error: "Review already exists" }, { status: 409 });
    return NextResponse.json({ error: "Internal error from server" }, { status: 500 });
  }
}