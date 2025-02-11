/*
  Warnings:

  - Added the required column `examId` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Response" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "examId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "optionId" INTEGER,
    "isCorrect" BOOLEAN NOT NULL,
    "body" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Response_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Response_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Response_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Response_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Response" ("body", "createdAt", "employeeId", "id", "isCorrect", "optionId", "questionId", "updatedAt") SELECT "body", "createdAt", "employeeId", "id", "isCorrect", "optionId", "questionId", "updatedAt" FROM "Response";
DROP TABLE "Response";
ALTER TABLE "new_Response" RENAME TO "Response";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
