import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// https://nextjs.org/docs/app/api-reference/file-conventions/route#context-optional
// https://www.prisma.io/docs/orm/v6/prisma-client/queries/crud#read
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

// https://www.prisma.io/docs/orm/v6/prisma-client/queries/crud#update
export async function PATCH(
  request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Get data from request and id from params
    const body = await request.json();
    const { username, email } = body;
    const { id } = await params;
    const userId = Number(id)
    // Ensure a field
    if (username === undefined && email === undefined)
      return NextResponse.json({ error: "At least one field is required" }, { status: 400 });
    if (!Number.isInteger(userId) || userId <= 0)
      return NextResponse.json({ error: "Id required" }, { status: 400 });
    // Find user
    const userFound = await prisma.user.findUnique({ where: { id: userId } });
    if (!userFound)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username !== undefined && { username }),
        ...(email !== undefined && { email }),
      }
    })
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error: " }, { status: 500 });
  }
}