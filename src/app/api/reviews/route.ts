import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, gameId, rating, title, content } = body;

    if (userId === undefined || gameId === undefined || rating === undefined || title === undefined || content === undefined)
      return NextResponse.json({ error: "Some data is missing" }, { status: 400 });
    if (!Number.isInteger(userId) || userId <= 0)
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    if (!Number.isInteger(gameId) || gameId <= 0)
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    if (!Number.isInteger(rating) || rating < 1 || rating > 10)
      return NextResponse.json({ error: "Rating must be an integer between 1 and 10" }, { status: 400 });
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser)
      return NextResponse.json({ error: "User ID not found" }, { status: 404 });
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
    return NextResponse.json({ error: "Internal error from server" }, { status: 500 });
  }
}