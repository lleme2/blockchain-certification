
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export async function generateUserKeyPair() {
    try{
    if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
        throw new Error("Web Crypto API não disponível neste ambiente (não é um navegador).");
    }
}
catch(error){
    console.log(error)
}
    // RSA-PSS é recomendado para assinaturas
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-PSS",
            modulusLength: 2048, // Tamanho da chave (2048 ou 4096 bits)
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: "SHA-256", // Algoritmo de hash usado
        },
        true, // extractable: true para poder exportar (para download ou armazenamento local)
        ["sign", "verify"] // Usos da chave
    );

    // Exportar a chave privada (PKCS#8 para compatibilidade com Python)
    const privateKeyBuffer = await window.crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey
    );
    const privateKeyContent = arrayBufferToBase64(privateKeyBuffer);
    const privateKeyPem = privateKeyContent.match(/.{1,64}/g).join('\n');
    const privateKeyJWK = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);
    const privateKeyPemHeader = `-----BEGIN PRIVATE KEY-----\n${privateKeyPem}\n-----END PRIVATE KEY-----`;

    // Exportar a chave pública (SPKI para compatibilidade com Python)
    const publicKeyBuffer = await window.crypto.subtle.exportKey(
        "spki",
        keyPair.publicKey
    );
    const publicKeyContent = arrayBufferToBase64(publicKeyBuffer);
    const publicKeyPem = publicKeyContent.match(/.{1,64}/g).join('\n');
    const publicKeyJWK = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
    const publicKeyPemHeader = `-----BEGIN PUBLIC KEY-----\n${publicKeyPem}\n-----END PUBLIC KEY-----`;

    // Retorne ou armazene para o usuário (download, localStorage - com cautela)
    return {
        privateKey: keyPair.privateKey, // O objeto CryptoKey para uso direto
        publicKey: keyPair.publicKey,   // O objeto CryptoKey para uso direto
        privateKeyPem: privateKeyPemHeader, // Para mostrar/download
        publicKeyPem: publicKeyPemHeader,    // Para enviar ao servidor
        publicKeyJWK: publicKeyJWK,
        privateKeyJWK: privateKeyJWK
    };
}

// Para usar e assinar no cliente:
export async function signMessageClientSide(privateKeyCryptoKey, messageHashBytes) {
    
    // 1. Executa a assinatura RSA-PSS
    const signatureBuffer = await window.crypto.subtle.sign(
        {
            name: "RSA-PSS",
            saltLength: 32, // Deve ser 32 na verificação também!
        },
        privateKeyCryptoKey, 
        messageHashBytes // ArrayBuffer/Uint8Array da hash
    );

    // 2. CORREÇÃO DE DEBUG: Loga o tamanho REAL do binário
    const binarySize = signatureBuffer.byteLength;
    console.log(`✅ Tamanho da Assinatura BINÁRIA: ${binarySize} bytes`);
    // Se suas chaves são 2048 bits, este valor DEVE ser 256.

    // 3. Converte o binário da assinatura para string Hexadecimal
    const signatureUint8Array = new Uint8Array(signatureBuffer);
    const signatureHex = Array.from(signatureUint8Array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    // 4. CORREÇÃO DE DEBUG: Loga o tamanho correto da string Hex
    const hexLength = signatureHex.length;
    console.log(`✅ Tamanho da Assinatura HEXADECIMAL: ${hexLength} caracteres`);
    // Se o binário é 256 bytes, este valor DEVE ser 512 caracteres.

    // 5. Retorna a assinatura em formato Hex
    console.log("Assinatura salva: " + signatureHex)
    return signatureHex;
}



export async function importPrivateKeyPem(pemContent) {
  try {
    let pem;

    // 1. Detecta o formato e limpa o conteúdo de forma mais robusta
    if (pemContent.includes('-----BEGIN PRIVATE KEY-----')) {
      pem = pemContent
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\s/g, '');
    } else if (pemContent.includes('-----BEGIN RSA PRIVATE KEY-----')) {
      // Se você quisesse suportar PKCS#1, o formato de importação seria "pkcs1", mas é mais complexo.
      // Por enquanto, é melhor lançar um erro claro.
      throw new Error("Formato de chave não suportado. Use o formato PKCS#8 (-----BEGIN PRIVATE KEY-----).");
    } else {
      throw new Error("Conteúdo do PEM inválido: cabeçalho não encontrado.");
    }

    // 2. Converte Base64 para ArrayBuffer
    const binaryDer = Uint8Array.from(atob(pem), c => c.charCodeAt(0));

    // 3. Importa o ArrayBuffer como uma chave PKCS#8
    const privateKey = await window.crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      {
        name: "RSA-PSS",
        hash: "SHA-256",
      },
      true, // extractable
      ["sign"] // keyUsages
    );
    
    return privateKey;

  } catch (error) {
    console.error("Falha ao importar a chave privada PEM:", error);
    // Retorna null ou relança o erro, dependendo de como você quer lidar com falhas
    return null; 
  }
}

export async function importPublicKeyPem(pemContent) {
    // 1. Remove cabeçalhos, rodapés e quebras de linha
    const pem = pemContent
        .replace('-----BEGIN PUBLIC KEY-----', '')
        .replace('-----END PUBLIC KEY-----', '')
        .replace(/\s/g, ''); // Remove espaços e quebras de linha

    // 2. Converte Base64 para ArrayBuffer
    const binaryDer = Uint8Array.from(atob(pem), c => c.charCodeAt(0));

    // 3. Importa o ArrayBuffer como uma chave PKCS#8
    const publicKey = await window.crypto.subtle.importKey(
        "spki",
        binaryDer,
        {
            name: "RSA-PSS",
            hash: "SHA-256",
        },
        true, // extractable
        ["verify"] // keyUsages
    );

    console.log("Public Key: " + publicKey)
    
    return publicKey;
}


export async function verifySignatureClientSide(
  fileHash,
  signature,
  publicKey
) {
  try {
    // --- PONTO DE DEBUG 1: Argumentos iniciais ---
    console.log("--- DEBUG VERIFICAÇÃO ---");
    console.log(`1. Tipo e Tamanho do fileHash (esperado: string hexadecimal): ${typeof fileHash}, length: ${fileHash.length}`);
    console.log(`2. Tipo e Tamanho da signatureBase64 (esperado: string Base64): ${typeof signature}, length: ${signature.length}`);
  
    
    // --- PONTO DE DEBUG 3: Buffers Finais ---
    console.log(`5. hashBuffer tam: ${fileHash.length} (esperado 32 para SHA-256)`);
    console.log(`6. signatureBuffer (Uint8Array) length: ${signature.length} (esperado 256 para RSA-2048)`);

    // 4. Executa o algoritmo de VERIFICAÇÃO RSA-PSS
    const isValid = await window.crypto.subtle.verify(
      {
        name: 'RSA-PSS',
        saltLength: 32, // Deve ser o mesmo usado em signMessageClientSide
      },
      publicKey,
      signature,
      fileHash // A hash que foi assinada
    );

    console.log(`8. Resultado Final da Verificação: ${isValid}`);
    return isValid;

  } catch (error) {
    console.error('Erro durante a verificação da assinatura:', error);
    return false;
  }
}

