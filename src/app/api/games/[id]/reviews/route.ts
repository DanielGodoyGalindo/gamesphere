import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const gameId = Number(id);
    if (!Number.isInteger(gameId) || gameId <= 0)
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    const existingGame = await prisma.game.findUnique({where: { id: gameId }});
    if (!existingGame)
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    // Find reviews for game
    const reviews = await prisma.review.findMany({
      where: { gameId: gameId },
      include: { user: true }
    });
    return NextResponse.json(reviews, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error: " }, { status: 500 });
  }
}