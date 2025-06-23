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
    "insertedBooksCount" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Author" ("birthDate", "createdAt", "deathDate", "firstName", "id", "lastName", "middleName", "overview", "photoUrl", "prefix", "updatedAt") SELECT "birthDate", "createdAt", "deathDate", "firstName", "id", "lastName", "middleName", "overview", "photoUrl", "prefix", "updatedAt" FROM "Author";
DROP TABLE "Author";
ALTER TABLE "new_Author" RENAME TO "Author";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
