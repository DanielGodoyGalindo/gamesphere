import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {

    const body = await request.json();
    const { username, email } = body;

    // Check if recieved data is ok
    if (!username || !email) {
      return NextResponse.json(
        { error: "Username and email are mandatory" },
        { status: 400 }
      );
    }
    // Check if user or email already exist
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }], },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username or email already exist" },
        { status: 409 }
      );
    }
    // Create user
    const user = await prisma.user.create({
      data: { username, email, },
    });
    return NextResponse.json(user, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal error from server" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allUsers = await prisma.user.findMany();
    return NextResponse.json(allUsers, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error from server" }, { status: 500 });
  }
}