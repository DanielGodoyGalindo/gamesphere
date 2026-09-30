import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = Number(id);
    if (!Number.isInteger(userId) || userId <= 0)
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    const existingUser = await prisma.user.findUnique({where: { id: userId }});
    if (!existingUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    // Find libraries for user (including games in each library)
    const library = await prisma.library.findMany({
      where: { userId: userId },
      include: { game: true }
    });
    return NextResponse.json(library, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error: " }, { status: 500 });
  }
}