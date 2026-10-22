import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {

    const body = await request.json();
    const { username, email } = body;

    // Validate required fields
    if (username === undefined || email === undefined)
      return NextResponse.json({ error: "Username and email are mandatory" }, { status: 400 });
    // Validate username
    if (typeof username !== "string" || username.trim() === "")
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || email.trim() === "" || !emailRegex.test(email.trim()))
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    // Normalize values
    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim();
    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: normalizedUsername },
          { email: normalizedEmail }
        ]
      }
    });
    if (existingUser)
      return NextResponse.json({ error: "Username or email already exists" }, { status: 409 });
    // Create user
    const user = await prisma.user.create({
      data: {
        username: normalizedUsername,
        email: normalizedEmail
      }
    });
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error(err);
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