import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

  try {
    const body = await request.json();
    const { title, slug } = body;
    let { cover, description, releaseDate } = body

    if (!title || !slug)
      return NextResponse.json({ error: "All game data is mandatory!" }, { status: 400 });

    const existingGame = await prisma.game.findUnique({ where: { slug: slug } });
    if (existingGame)
      return NextResponse.json({ error: "Game already exists" }, { status: 409 });
    // Cover and description
    if (!cover)
      cover = "/images/games/default-cover.jpg"
    if (!description)
      description = "No description"
    // Date
    const parsedReleaseDate = releaseDate ? new Date(releaseDate) : null;
    if (parsedReleaseDate && Number.isNaN(parsedReleaseDate.getTime()))
      return NextResponse.json({ error: "Invalid release date" }, { status: 400 });

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