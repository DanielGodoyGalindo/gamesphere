import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const gameId = Number(id)
    if (!Number.isInteger(gameId) || gameId <= 0)
      return NextResponse.json({ error: "Id required" }, { status: 400 });
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
    const body = await request.json();
    const { title, slug, description, cover, releaseDate } = body;
    const { id } = await params;
    const gameId = Number(id)
    if (title === undefined && slug === undefined && description === undefined && cover === undefined && releaseDate === undefined)
      return NextResponse.json({ error: "At least one field is required" }, { status: 400 });
    if (!Number.isInteger(gameId) || gameId <= 0)
      return NextResponse.json({ error: "Id required" }, { status: 400 });
    if (slug !== undefined) {
      const existingSlugGame = await prisma.game.findUnique({ where: { slug: slug } })
      if (existingSlugGame && (existingSlugGame.id !== gameId))
        return NextResponse.json({ error: "Slug already exist!" }, { status: 409 });
    }
    const gameFound = await prisma.game.findUnique({ where: { id: gameId } });
    if (!gameFound)
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    const parsedReleaseDate = releaseDate !== undefined ? new Date(releaseDate) : undefined;
    if (parsedReleaseDate !== undefined && Number.isNaN(parsedReleaseDate.getTime()))
      return NextResponse.json({ error: "Invalid release date" }, { status: 400 });
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(cover !== undefined && { cover }),
        ...(releaseDate !== undefined && { releaseDate: parsedReleaseDate })
      }
    })
    return NextResponse.json(updatedGame, { status: 200 });
  } catch (e) {
    console.error(e);
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