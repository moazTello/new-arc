/*
  Warnings:

  - You are about to drop the column `name` on the `Author` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Author" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prefix" TEXT,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "overview" TEXT,
    "birthDate" TEXT NOT NULL,
    "deathDate" TEXT,
    "photoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Author" ("birthDate", "createdAt", "deathDate", "id", "overview", "photoUrl", "updatedAt") SELECT "birthDate", "createdAt", "deathDate", "id", "overview", "photoUrl", "updatedAt" FROM "Author";
DROP TABLE "Author";
ALTER TABLE "new_Author" RENAME TO "Author";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
