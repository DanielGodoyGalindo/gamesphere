import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createLibrarySchema } from "@/schemas/library.schema";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {

  try {

    // Check authentication
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = Number(user.id);
    // Validate request body
    const body = await request.json();
    const validation = createLibrarySchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json({ error: validation.error.issues }, { status: 400 });
    const { gameId, status, progress } = validation.data;
    // Check if game exists
    const existingGame = await prisma.game.findUnique({ where: { id: gameId } });
    if (!existingGame)
      return NextResponse.json({ error: "Game ID not found" }, { status: 404 });
    // Check library
    const existingLibrary = await prisma.library.findUnique({
      where: { userId_gameId: { userId, gameId } }
    });
    if (existingLibrary)
      return NextResponse.json({ error: "Game already exists in user's library" }, { status: 409 });
    // Create library
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