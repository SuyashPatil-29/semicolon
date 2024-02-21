/*
  Warnings:

  - You are about to drop the column `user_id` on the `Classroom` table. All the data in the column will be lost.
  - You are about to drop the `ClassroomMembership` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `adminId` to the `Classroom` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Classroom" DROP CONSTRAINT "Classroom_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ClassroomMembership" DROP CONSTRAINT "ClassroomMembership_classroomId_fkey";

-- DropForeignKey
ALTER TABLE "ClassroomMembership" DROP CONSTRAINT "ClassroomMembership_userId_fkey";

-- AlterTable
ALTER TABLE "Classroom" DROP COLUMN "user_id",
ADD COLUMN     "adminId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ClassroomMembership";

-- CreateTable
CREATE TABLE "ClassroomUser" (
    "userId" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,

    CONSTRAINT "ClassroomUser_pkey" PRIMARY KEY ("userId","classroomId")
);

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomUser" ADD CONSTRAINT "ClassroomUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomUser" ADD CONSTRAINT "ClassroomUser_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
