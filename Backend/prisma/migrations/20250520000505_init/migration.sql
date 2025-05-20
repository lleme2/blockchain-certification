-- CreateTable
CREATE TABLE "Arquivo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeOriginal" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "certificado" BOOLEAN NOT NULL DEFAULT false,
    "caminhoArquivo" TEXT NOT NULL,
    "dataUpload" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Arquivo_hash_key" ON "Arquivo"("hash");
