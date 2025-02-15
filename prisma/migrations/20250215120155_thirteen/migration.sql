/*
  Warnings:

  - Added the required column `examId` to the `Option` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Option" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "examId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "description" TEXT,
    "isCorrect" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Option" ("body", "createdAt", "description", "id", "isCorrect", "questionId", "updatedAt") SELECT "body", "createdAt", "description", "id", "isCorrect", "questionId", "updatedAt" FROM "Option";
DROP TABLE "Option";
ALTER TABLE "new_Option" RENAME TO "Option";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
