/*
  Warnings:

  - The `status` column on the `Library` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "LibraryStatus" AS ENUM ('WANT_TO_PLAY', 'PLAYING', 'COMPLETED', 'DROPPED');

-- AlterTable
ALTER TABLE "Library" DROP COLUMN "status",
ADD COLUMN     "status" "LibraryStatus" NOT NULL DEFAULT 'WANT_TO_PLAY';
