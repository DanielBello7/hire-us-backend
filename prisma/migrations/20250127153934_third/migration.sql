/*
  Warnings:

  - You are about to drop the column `idNumber` on the `Person` table. All the data in the column will be lost.
  - Added the required column `taxId` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxId` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Organization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "avatar" TEXT,
    "brief" TEXT,
    "taxId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Organization_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Organization" ("accountId", "address", "avatar", "brief", "country", "createdAt", "email", "id", "title", "updatedAt") SELECT "accountId", "address", "avatar", "brief", "country", "createdAt", "email", "id", "title", "updatedAt" FROM "Organization";
DROP TABLE "Organization";
ALTER TABLE "new_Organization" RENAME TO "Organization";
CREATE UNIQUE INDEX "Organization_email_key" ON "Organization"("email");
CREATE UNIQUE INDEX "Organization_taxId_key" ON "Organization"("taxId");
CREATE TABLE "new_Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "avatar" TEXT,
    "taxId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Person_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Person" ("accountId", "address", "avatar", "country", "createdAt", "email", "gender", "id", "name", "updatedAt", "username") SELECT "accountId", "address", "avatar", "country", "createdAt", "email", "gender", "id", "name", "updatedAt", "username" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
CREATE UNIQUE INDEX "Person_email_key" ON "Person"("email");
CREATE UNIQUE INDEX "Person_username_key" ON "Person"("username");
CREATE UNIQUE INDEX "Person_taxId_key" ON "Person"("taxId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
