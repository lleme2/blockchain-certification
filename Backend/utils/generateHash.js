
const crypto = require("crypto");
const fs = require("fs");

function lerArquivo(filePath) {
  try {
    const conteudo =  fs.readFileSync(filePath);
    return conteudo;
  } catch (err) {
    console.error("Erro ao ler arquivo:", err);
    return null;
  }
}

function generateFileHash(filePath) {
    const file = lerArquivo(filePath);
    if(file != null){
        const hash = crypto.createHash("sha256").update(file).digest("hex");
        return hash;
    }
    else{
        return null;
    }
}

module.exports = generateFileHash;