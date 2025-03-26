/*
  Warnings:

  - You are about to drop the `historico_login` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "historico_login" DROP CONSTRAINT "historico_login_userId_fkey";

-- DropTable
DROP TABLE "historico_login";
