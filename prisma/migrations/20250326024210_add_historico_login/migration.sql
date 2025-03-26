-- CreateTable
CREATE TABLE "historico_acessos" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "ip" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "local" TEXT NOT NULL,

    CONSTRAINT "historico_acessos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_login" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_login_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "historico_acessos_userId_idx" ON "historico_acessos"("userId");

-- AddForeignKey
ALTER TABLE "historico_acessos" ADD CONSTRAINT "historico_acessos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_login" ADD CONSTRAINT "historico_login_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
