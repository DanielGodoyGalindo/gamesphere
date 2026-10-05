import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const libraryId = Number(id);
    if (!Number.isInteger(libraryId) || libraryId <= 0)
      return NextResponse.json({ error: "Invalid library ID" }, { status: 400 });
    const foundLibrary = await prisma.library.findUnique({ where: { id: libraryId }, include: { game: true } });
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
    const { id } = await params;
    const libraryId = Number(id);
    if (!Number.isInteger(libraryId) || libraryId <= 0)
      return NextResponse.json({ error: "Invalid library ID" }, { status: 400 });
    const foundLibrary = await prisma.library.findUnique({ where: { id: libraryId } });
    if (!foundLibrary)
      return NextResponse.json({ error: "Library not found" }, { status: 404 });
    const deletedLibrary = await prisma.library.delete({ where: { id: libraryId } });
    return NextResponse.json(deletedLibrary, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { status, progress } = body;
    const { id } = await params;
    const libraryId = Number(id)
    if ((!Number.isInteger(libraryId) || libraryId <= 0))
      return NextResponse.json({ error: "Library id invalid" }, { status: 400 });
    if (status === undefined && progress === undefined)
      return NextResponse.json({ error: "At least one field is required" }, { status: 400 });
    const existingLibrary = await prisma.library.findUnique({ where: { id: libraryId } });
    if (!existingLibrary)
      return NextResponse.json({ error: "Library not found" }, { status: 404 });
    if (progress !== undefined && (!Number.isInteger(progress) || progress < 0 || progress > 100))
      return NextResponse.json({ error: "Progress must be an integer between 0 and 100" }, { status: 400 });
    const updatedLibrary = await prisma.library.update({
      where: { id: libraryId },
      data: {
        ...(status !== undefined && { status }),
        ...(progress !== undefined && { progress })
      }
    })
    return NextResponse.json(updatedLibrary, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error: " }, { status: 500 });
  }
}