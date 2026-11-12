import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { updateGameSchema } from "@/schemas/game.schema";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const gameId = Number(id)
    if (!Number.isInteger(gameId) || gameId <= 0)
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game)
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    return NextResponse.json(game, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const gameId = Number(id)
    // Validate game ID
    if (!Number.isInteger(gameId) || gameId <= 0)
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    // Validate body
    const body = await request.json();
    const validation = updateGameSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json({ error: validation.error.issues }, { status: 400 });
    // Ensure at least one field is provided
    if (Object.keys(validation.data).length === 0)
      return NextResponse.json({ error: "At least one field is required" }, { status: 400 });
    // Game
    const gameFound = await prisma.game.findUnique({ where: { id: gameId } });
    if (!gameFound)
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    // Check if slug already exists
    const { slug } = validation.data;
    if (slug !== undefined) {
      const existingSlugGame = await prisma.game.findUnique({ where: { slug } });
      if (existingSlugGame && existingSlugGame.id !== gameId)
        return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    // Update
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: validation.data
    })
    return NextResponse.json(updatedGame, { status: 200 });
  } catch (e) {
    console.error(e);
    if (typeof e === "object" && e !== null && "code" in e && e.code === "P2002")
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    return NextResponse.json({ error: "Internal server error: " }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const gameID = Number(id)
    if (!Number.isInteger(gameID) || gameID <= 0)
      return NextResponse.json({ error: "Id required" }, { status: 400 });
    const gameFound = await prisma.game.findUnique({ where: { id: gameID } });
    if (!gameFound)
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    const deletedGame = await prisma.game.delete({ where: { id: gameID } })
    return NextResponse.json(deletedGame, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}