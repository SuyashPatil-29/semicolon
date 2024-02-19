/*
  Warnings:

  - You are about to drop the column `username` on the `File` table. All the data in the column will be lost.
  - Added the required column `uploadedBy` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "username",
ADD COLUMN     "uploadedBy" TEXT NOT NULL,
ALTER COLUMN "uploadedAt" SET DATA TYPE TEXT;
