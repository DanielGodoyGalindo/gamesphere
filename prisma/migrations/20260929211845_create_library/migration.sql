-- CreateTable
CREATE TABLE "Library" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'WANT_TO_PLAY',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Library_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Library_userId_gameId_key" ON "Library"("userId", "gameId");

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
