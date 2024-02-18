-- CreateEnum
CREATE TYPE "access" AS ENUM ('HOD', 'TEACHER', 'STUDENT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "access" "access" NOT NULL DEFAULT 'STUDENT';
