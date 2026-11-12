import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createGameSchema } from "@/schemas/game.schema";

export async function POST(request: Request) {

  try {
    const body = await request.json();
    // Validate body
    const validation = createGameSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json({ error: validation.error.issues }, { status: 400 });
    // Get validated data
    const { title, slug, cover, description, releaseDate, rating } = validation.data;
    // Check if game already exists
    const existingGame = await prisma.game.findUnique({ where: { slug: slug } });
    if (existingGame)
      return NextResponse.json({ error: "Game already exists" }, { status: 409 });
    // Create game
    const newGame = await prisma.game.create({
      data: {
        title,
        slug,
        description: description || "No description",
        cover: cover || "/images/games/default-cover.jpg",
        releaseDate: releaseDate ?? null,
        rating: rating ?? null
      }
    });
    return NextResponse.json(newGame, { status: 201 });
  } catch (e) {
    console.error(e);
    if (typeof e === "object" && e !== null && "code" in e && e.code === "P2002")
      return NextResponse.json({ error: "Game already exists" }, { status: 409 });
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