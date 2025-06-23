-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "projectId" INTEGER,
    CONSTRAINT "ProjectType_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProjectType" ("createdAt", "id", "name", "projectId", "updatedAt") SELECT "createdAt", "id", "name", "projectId", "updatedAt" FROM "ProjectType";
DROP TABLE "ProjectType";
ALTER TABLE "new_ProjectType" RENAME TO "ProjectType";
CREATE UNIQUE INDEX "ProjectType_name_key" ON "ProjectType"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
