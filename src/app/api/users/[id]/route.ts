import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { updateUserSchema } from "@/schemas/user.schema";
import { getCurrentUser } from "@/lib/session";

// https://nextjs.org/docs/app/api-reference/file-conventions/route#context-optional
// https://www.prisma.io/docs/orm/v6/prisma-client/queries/crud#read
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }) {
  try {

    // Auth user ID
    const authUser = await getCurrentUser();
    if (!authUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = Number(authUser.id);
    // Get user id from params
    const { id } = await params;
    const paramsUserId = Number(id)
    if (!Number.isInteger(paramsUserId) || paramsUserId <= 0)
      return NextResponse.json({ error: "Id required" }, { status: 400 });
    if (paramsUserId !== userId)
      return NextResponse.json({ error: "Action not allowed" }, { status: 403 });
    // Found user with received id
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user, { status: 200 });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// https://www.prisma.io/docs/orm/v6/prisma-client/queries/crud#update
export async function PATCH(
  request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Auth user ID
    const authUser = await getCurrentUser();
    if (!authUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = Number(authUser.id);
    // Validate ID
    if (!Number.isInteger(userId) || userId <= 0)
      return NextResponse.json({ error: "Id required" }, { status: 400 });
    // Get data from request and id from params
    const { id } = await params;
    const paramsUserId = Number(id)
    if (paramsUserId !== userId)
      return NextResponse.json({ error: "Action not allowed" }, { status: 403 });
    // Validate request body
    const body = await request.json();
    const validation = updateUserSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json({ error: validation.error.issues }, { status: 400 });
    const { username, email } = validation.data;
    // Ensure at least 1 field is provided
    if (Object.keys(validation.data).length === 0)
      return NextResponse.json({ error: "At least one field is required" }, { status: 400 });
    // Find user
    const userFound = await prisma.user.findUnique({ where: { id: userId } });
    if (!userFound)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username !== undefined && { username }),
        ...(email !== undefined && { email })
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (e) {
    console.error(e);
    if (typeof e === "object" && e !== null && "code" in e && e.code === "P2002")
      return NextResponse.json({ error: "Username or email already exists" }, { status: 409 });
    return NextResponse.json({ error: "Internal server error: " }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Auth user ID
    const authUser = await getCurrentUser();
    if (!authUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = Number(authUser.id);
    if (!Number.isInteger(userId) || userId <= 0)
      return NextResponse.json({ error: "Id required" }, { status: 400 });
    // Params user ID
    const { id } = await params;
    const paramsUserId = Number(id)
    if (paramsUserId !== userId)
      return NextResponse.json({ error: "Action not allowed" }, { status: 403 });
    const userFound = await prisma.user.findUnique({ where: { id: userId } });
    if (!userFound)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })
    return NextResponse.json(deletedUser, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}