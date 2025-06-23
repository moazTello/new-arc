-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Author" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "overview" TEXT,
    "birthDate" TEXT NOT NULL,
    "deathDate" TEXT,
    "photoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Author" ("birthDate", "createdAt", "deathDate", "id", "name", "overview", "photoUrl", "updatedAt") SELECT "birthDate", "createdAt", "deathDate", "id", "name", "overview", "photoUrl", "updatedAt" FROM "Author";
DROP TABLE "Author";
ALTER TABLE "new_Author" RENAME TO "Author";
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
    "deminsions" TEXT NOT NULL,
    "printDate" DATETIME NOT NULL,
    "bookUrl" TEXT NOT NULL,
    "authorId" INTEGER,
    CONSTRAINT "Book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("authorId", "bookUrl", "checker", "code", "createdAt", "deminsions", "id", "name", "pagesCount", "printDate", "releaseDate", "translator", "updatedAt", "weight") SELECT "authorId", "bookUrl", "checker", "code", "createdAt", "deminsions", "id", "name", "pagesCount", "printDate", "releaseDate", "translator", "updatedAt", "weight" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_code_key" ON "Book"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
