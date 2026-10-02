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