import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { LibraryStatus } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/session";
import { updateLibrarySchema } from "@/schemas/library.schema";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = Number(user.id);
    const { id } = await params;
    const libraryId = Number(id);
    if (!Number.isInteger(libraryId) || libraryId <= 0)
      return NextResponse.json({ error: "Invalid library ID" }, { status: 400 });
    const foundLibrary = await prisma.library.findUnique({ where: { id: libraryId, userId: userId }, include: { game: true } });
    if (!foundLibrary)
      return NextResponse.json({ error: "Library not found" }, { status: 404 });
    return NextResponse.json(foundLibrary, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = Number(user.id);
    const { id } = await params;
    const libraryId = Number(id);
    if (!Number.isInteger(libraryId) || libraryId <= 0)
      return NextResponse.json({ error: "Invalid library ID" }, { status: 400 });
    const foundLibrary = await prisma.library.findUnique({ where: { id: libraryId, userId: userId } });
    if (!foundLibrary)
      return NextResponse.json({ error: "Library not found" }, { status: 404 });
    const deletedLibrary = await prisma.library.delete({ where: { id: libraryId, userId: userId } });
    return NextResponse.json(deletedLibrary, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = Number(user.id);
    const body = await request.json();
    const validation = updateLibrarySchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json({ error: validation.error.issues }, { status: 400 });
    if (Object.keys(validation.data).length === 0)
      return NextResponse.json({ error: "At least one field is required" }, { status: 400 });
    const { status, progress } = validation.data;
    const { id } = await params;
    const libraryId = Number(id)
    // ID
    if ((!Number.isInteger(libraryId) || libraryId <= 0))
      return NextResponse.json({ error: "Library id invalid" }, { status: 400 });
    // Library
    const existingLibrary = await prisma.library.findUnique({ where: { id: libraryId, userId: userId } });
    if (!existingLibrary)
      return NextResponse.json({ error: "Library not found" }, { status: 404 });
    const updatedLibrary = await prisma.library.update({
      where: { id: libraryId, userId: userId },
      data: {
        ...(status !== undefined && { status }),
        ...(progress !== undefined && { progress })
      }
    });
    return NextResponse.json(updatedLibrary, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error: " }, { status: 500 });
  }
}