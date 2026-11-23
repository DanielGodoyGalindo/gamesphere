import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = Number(user.id);
    const { id } = await params;
    const paramUserId = Number(id);
    if (!Number.isInteger(userId) || userId <= 0)
      return NextResponse.json({ error: "Invalid authenticated user ID" }, { status: 400 });
    if (!Number.isInteger(paramUserId) || paramUserId <= 0)
      return NextResponse.json({ error: "Invalid param user ID" }, { status: 400 });
    if (paramUserId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
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