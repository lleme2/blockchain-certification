/**
 * Converte uma string hexadecimal em um ArrayBuffer.
 * Útil para converter assinaturas recuperadas da blockchain.
 */
export function hexStringToArrayBuffer(hexString: string): ArrayBuffer {
    if (hexString.length % 2 !== 0) {
        throw new Error("A string hexadecimal deve ter um número par de caracteres.");
    }
    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
        bytes[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
    }
    return bytes.buffer;
}

/**
 * Converte uma string de texto em um ArrayBufferLike (UTF-8).
 * Útil para codificar dados originais que foram assinados.
 */
export function stringToArrayBuffer(str: string): ArrayBufferLike {
  const encoder = new TextEncoder();
  // TextEncoder.encode retorna Uint8Array, e .buffer pode ser ArrayBuffer ou SharedArrayBuffer.
  // ArrayBufferLike é o tipo mais flexível para compatibilidade.
  return encoder.encode(str).buffer;
}

/**
 * Importa uma chave pública de um formato PEM para um objeto CryptoKey.
 * @param pem A chave pública em formato PEM.
 * @param algorithmName O nome do algoritmo da chave (ex: "RSASSA-PKCS1-v1_5", "RSA-PSS").
 * @param hashAlgorithm O algoritmo de hash usado com a chave (ex: "SHA-256").
 * @returns Uma Promise que resolve para o objeto CryptoKey importado.
 */
export async function importPublicKeyFromPem(
    pem: string,
    algorithmName: string,
    hashAlgorithm: string
): Promise<CryptoKey> {
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";

    if (!pem.startsWith(pemHeader) || !pem.endsWith(pemFooter)) {
        throw new Error("Formato PEM inválido. Deve começar com '-----BEGIN PUBLIC KEY-----' e terminar com '-----END PUBLIC KEY-----'.");
    }

    const pemContents = pem
        .substring(pemHeader.length, pem.length - pemFooter.length)
        .replace(/\s/g, ''); // Remove espaços em branco e quebras de linha

    const binaryDerString = window.atob(pemContents); // Base64 decode
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
        binaryDer[i] = binaryDerString.charCodeAt(i);
    }

    return await crypto.subtle.importKey(
        "spki", // SubjectPublicKeyInfo para chaves públicas PEM
        binaryDer,
        {
            name: algorithmName,
            hash: { name: hashAlgorithm },
        },
        true, // extractable (permite exportar a chave novamente, não estritamente necessário para 'verify')
        ["verify"] // Uso permitido para esta chave
    );
}

// Interface para os parâmetros do algoritmo de assinatura
export interface SignatureAlgorithmParams {
    name: string; // Ex: "RSASSA-PKCS1-v1_5" ou "RSA-PSS"
    hash: { name: string }; // Ex: "SHA-256"
    saltLength?: number; // Necessário se o algoritmo for "RSA-PSS"
}