import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerUserSchema } from "@/schemas/user.schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = registerUserSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json({ error: validation.error.issues }, { status: 400 });
    const { username, email, password } = validation.data;

    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ]
      }
    });
    if (existingUser)
      return NextResponse.json({ error: "Username or email already exists" }, { status: 409 });
    // Create user
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash
      },
      select: { // return safe fields
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error(err);
    if (typeof err === "object" && err !== null && "code" in err && err.code === "P2002")
      return NextResponse.json({ error: "Username or email already exists" }, { status: 409 });
    return NextResponse.json({ error: "Internal error from server" }, { status: 500 });
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