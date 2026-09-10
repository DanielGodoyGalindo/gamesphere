import { prisma } from "@/lib/prisma";

export default async function Home() {
  const users = await prisma.user.findMany();

  return (
    <main>
      <h1>GameSphere</h1>
      <p>Usuarios registrados: {users.length}</p>
    </main>
  );
}