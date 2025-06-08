

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
    const privateKeyPem = btoa(String.fromCharCode(...new Uint8Array(privateKeyBuffer)))
                          .match(/.{1,64}/g).join('\n');
    const privateKeyPemHeader = `-----BEGIN PRIVATE KEY-----\n${privateKeyPem}\n-----END PRIVATE KEY-----`;

    // Exportar a chave pública (SPKI para compatibilidade com Python)
    const publicKeyBuffer = await window.crypto.subtle.exportKey(
        "spki",
        keyPair.publicKey
    );
    const publicKeyPem = btoa(String.fromCharCode(...new Uint8Array(publicKeyBuffer)))
                         .match(/.{1,64}/g).join('\n');
    const publicKeyPemHeader = `-----BEGIN PUBLIC KEY-----\n${publicKeyPem}\n-----END PUBLIC KEY-----`;

    // Retorne ou armazene para o usuário (download, localStorage - com cautela)
    return {
        privateKey: keyPair.privateKey, // O objeto CryptoKey para uso direto
        publicKey: keyPair.publicKey,   // O objeto CryptoKey para uso direto
        privateKeyPem: privateKeyPemHeader, // Para mostrar/download
        publicKeyPem: publicKeyPemHeader    // Para enviar ao servidor
    };
}

// Para usar e assinar no cliente:
export async function signMessageClientSide(privateKeyCryptoKey, messageHashBytes) {
    const signature = await window.crypto.subtle.sign(
        {
            name: "RSA-PSS",
            saltLength: 32, // Deve corresponder ao hash (SHA-256 = 32 bytes)
        },
        privateKeyCryptoKey, 
        messageHashBytes 
    );
    return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
}

