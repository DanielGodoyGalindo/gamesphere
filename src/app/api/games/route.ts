import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

  try {
    const body = await request.json();
    const { title, slug } = body;
    let { cover, description, releaseDate } = body

    // Title and slug
    if (typeof title !== "string" || title.trim() === "" || typeof slug !== "string" || slug.trim() === "")
      return NextResponse.json({ error: "Title and slug are required and must be non-empty strings" }, { status: 400 });
    // Game
    const existingGame = await prisma.game.findUnique({ where: { slug: slug } });
    if (existingGame)
      return NextResponse.json({ error: "Game already exists" }, { status: 409 });
    // Cover
    if (cover === undefined || cover === null || cover === "")
      cover = "/images/games/default-cover.jpg";
    else if (typeof cover !== "string")
      return NextResponse.json({ error: "'Cover' should be a string" }, { status: 400 });
    // Description
    if (description === undefined || description === null || description === "")
      description = "No description";
    else if (typeof description !== "string")
      return NextResponse.json({ error: "'Description' should be a string" }, { status: 400 });
    // Date
    const parsedReleaseDate = releaseDate ? new Date(releaseDate) : null;
    if (parsedReleaseDate && Number.isNaN(parsedReleaseDate.getTime()))
      return NextResponse.json({ error: "Invalid release date" }, { status: 400 });
    // Entry
    const newGame = await prisma.game.create({ data: { title, slug, description, cover, releaseDate: parsedReleaseDate } });
    return NextResponse.json(newGame, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error from server" }, { status: 500 });
  }
}

export async function GET() {
  // get all games
  try {
    const allGames = await prisma.game.findMany();
    return NextResponse.json(allGames, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error from server" }, { status: 500 })
  }
}