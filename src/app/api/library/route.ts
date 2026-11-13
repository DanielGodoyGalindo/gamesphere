import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createLibrarySchema } from "@/schemas/library.schema";

export async function POST(request: Request) {

  try {
    const body = await request.json();
    const validation = createLibrarySchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json({ error: validation.error.issues }, { status: 400 });
    const { userId, gameId, status, progress } = validation.data;
    // Check if game exists
    const existingGame = await prisma.game.findUnique({ where: { id: gameId } });
    if (!existingGame)
      return NextResponse.json({ error: "Game ID not found" }, { status: 404 });
    // Check user
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser)
      return NextResponse.json({ error: "User ID not found" }, { status: 404 });
    // Check library
    const existingLibrary = await prisma.library.findUnique({
      where: { userId_gameId: { userId, gameId } }
    });
    if (existingLibrary)
      return NextResponse.json({ error: "Game already exists in user's library" }, { status: 409 });
    const newLibrary = await prisma.library.create({
      data: {
        userId,
        gameId,
        ...(status !== undefined && { status }),
        ...(progress !== undefined && { progress })
      }
    });
    return NextResponse.json(newLibrary, { status: 201 });

  } catch (e) {
    console.error(e);
    if (typeof e === "object" && e !== null && "code" in e && e.code === "P2002")
      return NextResponse.json({ error: "Game already exists" }, { status: 409 });
    return NextResponse.json({ error: "Internal error from server" }, { status: 500 });
  }

}