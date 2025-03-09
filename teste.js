
const crypto = require("crypto");
const fs = require("fs");

function generateFileHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
    return hash;
}

// Teste com um arquivo
const documentHash = generateFileHash("D:/Users/Home/Desktop/blockchain-certifier/Documento-Teste.txt");
console.log("Hash do Documento:", documentHash);
