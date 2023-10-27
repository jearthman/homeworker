/*
  Warnings:

  - You are about to alter the column `functionCall` on the `Message` table. The data in that column could be lost. The data in that column will be cast from `Json` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "functionCall" SET DATA TYPE VARCHAR(255);
