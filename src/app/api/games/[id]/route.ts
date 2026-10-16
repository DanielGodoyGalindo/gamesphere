import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
    const body = await request.json();
    const { title, slug, description, cover, releaseDate, rating } = body;
    const { id } = await params;
    const gameId = Number(id)
    // Game ID
    if (!Number.isInteger(gameId) || gameId <= 0)
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    // All fields
    if (title === undefined && slug === undefined && description === undefined && cover === undefined && releaseDate === undefined && rating === undefined)
      return NextResponse.json({ error: "At least one field is required" }, { status: 400 });
    // Game
    const gameFound = await prisma.game.findUnique({ where: { id: gameId } });
    if (!gameFound)
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    // Title
    if (title !== undefined && (typeof title !== "string" || title.trim() === ""))
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    //  Slug
    if (slug !== undefined && (typeof slug !== "string" || slug.trim() === ""))
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    if (slug !== undefined) {
      const normalizedSlug = slug.trim();
      const existingSlugGame = await prisma.game.findUnique({ where: { slug: normalizedSlug } })
      if (existingSlugGame && (existingSlugGame.id !== gameId))
        return NextResponse.json({ error: "Slug already exist!" }, { status: 409 });
    }
    // Description
    if (description !== undefined && description !== null && typeof description !== "string")
      return NextResponse.json({ error: "Description must be a string or null" }, { status: 400 });
    // Cover
    if (cover !== undefined && cover !== null && typeof cover !== "string")
      return NextResponse.json({ error: "Cover must be a string or null" }, { status: 400 });
    // Release date
    let parsedReleaseDate: Date | null | undefined;
    if (releaseDate !== undefined) {
      if (releaseDate === null) {
        parsedReleaseDate = null;
      } else if (typeof releaseDate === "string" && releaseDate.trim() !== "") {
        parsedReleaseDate = new Date(releaseDate);
        if (Number.isNaN(parsedReleaseDate.getTime()))
          return NextResponse.json({ error: "Invalid release date" }, { status: 400 });
      } else
        return NextResponse.json({ error: "Release date must be a valid date string or null" }, { status: 400 });
    }
    // Rating
    if (rating !== undefined && rating !== null && (typeof rating !== "number" || !Number.isFinite(rating) || rating < 0 || rating > 10))
      return NextResponse.json({ error: "Rating must be a number between 0 and 10, or null" }, { status: 400 });
    // Update
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