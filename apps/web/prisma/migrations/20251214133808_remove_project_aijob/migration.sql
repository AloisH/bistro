/*
  Warnings:

  - You are about to drop the `ai_jobs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ai_jobs" DROP CONSTRAINT "ai_jobs_projectId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_userId_fkey";

-- DropTable
DROP TABLE "ai_jobs";

-- DropTable
DROP TABLE "projects";
