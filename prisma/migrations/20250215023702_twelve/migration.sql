/*
  Warnings:

  - Added the required column `tempid` to the `Upload` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Upload" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tempid" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Upload_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Upload" ("accountId", "createdAt", "id", "mimetype", "size", "title", "updatedAt", "url") SELECT "accountId", "createdAt", "id", "mimetype", "size", "title", "updatedAt", "url" FROM "Upload";
DROP TABLE "Upload";
ALTER TABLE "new_Upload" RENAME TO "Upload";
CREATE UNIQUE INDEX "Upload_tempid_key" ON "Upload"("tempid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
