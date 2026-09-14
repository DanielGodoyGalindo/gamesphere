import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// https://nextjs.org/docs/app/api-reference/file-conventions/route#context-optional
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }) {
  try {
    
    // Get user id from params
    const { id } = await params;
    const userId = Number(id)
    if (!Number.isInteger(userId) || userId <= 0)
      return NextResponse.json({ error: "Id required", status: 400 });
    
    // Found user with received id
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return NextResponse.json({ error: "User not found", status: 404 });
    return NextResponse.json(user, { status: 200 });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error: " }, { status: 500 });
  }
}