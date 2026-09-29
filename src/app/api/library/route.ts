import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

  try {
    const body = await request.json();
    const { userId, gameId, status, progress } = body;

    if (!userId || !gameId)
      return NextResponse.json({ error: "User and game data are mandatory!" }, { status: 400 });

    const existingGame = await prisma.game.findUnique({ where: { id: gameId } });
    if (!existingGame)
      return NextResponse.json({ error: "Game ID not found" }, { status: 404 });
    const existingUserId = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUserId)
      return NextResponse.json({ error: "User ID not found" }, { status: 404 });

    const existingLibrary = await prisma.library.findUnique({
      where: { userId_gameId: { userId, gameId } }
    });

    if (existingLibrary)
      return NextResponse.json({ error: "Game already exists in user's library" }, { status: 409 });

    const newLibrary = await prisma.library.create({ data: { userId, gameId, ...(status !== undefined && { status }), ...(progress !== undefined && { progress }) } });
    return NextResponse.json(newLibrary, { status: 201 });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error from server" }, { status: 500 });
  }
}