/*
  Warnings:

  - You are about to drop the column `deminsions` on the `Book` table. All the data in the column will be lost.
  - Added the required column `height` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `length` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "translator" TEXT,
    "checker" TEXT,
    "pagesCount" INTEGER NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "length" TEXT NOT NULL,
    "width" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "printDate" DATETIME NOT NULL,
    "bookUrl" TEXT NOT NULL,
    "authorId" INTEGER,
    CONSTRAINT "Book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("authorId", "bookUrl", "checker", "code", "createdAt", "id", "name", "pagesCount", "printDate", "releaseDate", "translator", "updatedAt", "weight") SELECT "authorId", "bookUrl", "checker", "code", "createdAt", "id", "name", "pagesCount", "printDate", "releaseDate", "translator", "updatedAt", "weight" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_code_key" ON "Book"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
