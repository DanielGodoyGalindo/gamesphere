import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { LibraryStatus } from "@/generated/prisma/client";

export async function POST(request: Request) {

  try {

    const body = await request.json();
    const { userId, gameId, status, progress } = body;

    // UserID and gameID
    if ((!Number.isInteger(userId) || userId <= 0))
      return NextResponse.json({ error: "User ID invalid" }, { status: 400 });
    if ((!Number.isInteger(gameId) || gameId <= 0))
      return NextResponse.json({ error: "Game ID invalid" }, { status: 400 });
    // Status
    if (status !== undefined && !Object.values(LibraryStatus).includes(status))
      return NextResponse.json({ error: "'Status' field is invalid" }, { status: 400 });
    // Progress
    if (progress !== undefined && (!Number.isInteger(progress) || progress < 0 || progress > 100))
      return NextResponse.json({ error: "'Progress' field must be an integer between 0 and 100" }, { status: 400 });
    // Game
    const existingGame = await prisma.game.findUnique({ where: { id: gameId } });
    if (!existingGame)
      return NextResponse.json({ error: "Game ID not found" }, { status: 404 });
    // User
    const existingUserId = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUserId)
      return NextResponse.json({ error: "User ID not found" }, { status: 404 });
    // Library
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