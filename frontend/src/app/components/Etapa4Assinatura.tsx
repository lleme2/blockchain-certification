"use client";
const axios = require("axios");
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  generateUserKeyPair,
  signMessageClientSide,
  //verifySignatureClientSide,
  importPublicKeyPem,
  importPrivateKeyPem,
} from "../utils/generateKey";

type ComponenteBProps = {
  dado: string;
  signatureVer: string;
  publicKeyVer: string;
  ppublicKeyImport: string;
  privateKeyImport: string;
  setKey: Dispatch<SetStateAction<string>>;
  setSignature: Dispatch<SetStateAction<string>>;
  setPrivatePem: Dispatch<SetStateAction<string>>;
  setKeyPEM: Dispatch<SetStateAction<string>>;
};

type ResponseType = {
  data: {
    transactionHash?: string;
  };
};

interface KeyPairData {
  privateKey: CryptoKey;
  publicKey: CryptoKey;
  privateKeyPem: string;
  publicKeyPem: string;
  publicKeyJWK: any;
  privateKeyJWK: any;
  publicKeyVer: any;
}

export default function Etapa4Assinatura({
  dado,
  setKey,
  setSignature,
  setPrivatePem,
  setKeyPEM,
  signatureVer,
  ppublicKeyImport,
  privateKeyImport,
  publicKeyVer,
}: ComponenteBProps) {
  const [publickeyImport, setpublickeyImport] = useState("");
  const [keyPair, setKeyPair] = useState<KeyPairData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [assinatura, setAssinatura] = useState<string>();
  const [borderColor, setBorderColor] = useState("#a5a5a5");
  const [publicKeyDisplay, setPublicKeyDisplay] = useState<string>("");
  const [resultado, setResultado] = useState<string>(
    "Coloque aqui a sua chave pública."
  );
  const [valor, setValor] = useState<string>("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValor(event.target.value);
  }

  async function exportPublicKeyToHex(publicKey: CryptoKey): Promise<string> {
    if (!publicKey) {
      throw new Error("Objeto da chave pública não fornecido.");
    }

    let publicKeyRawBytes: ArrayBuffer;
    try {
      publicKeyRawBytes = await crypto.subtle.exportKey("spki", publicKey);
    } catch (error) {
      console.error("Erro ao exportar a chave pública:", error);
      throw new Error(
        "Falha na exportação da chave pública para bytes brutos."
      );
    }

    const uint8Array = new Uint8Array(publicKeyRawBytes);
    let publicKeyHexString = "";
    for (let i = 0; i < uint8Array.length; i++) {
      publicKeyHexString += uint8Array[i].toString(16).padStart(2, "0");
    }

    return "0x" + publicKeyHexString;
  }

  async function exportPrivateKeyToHex(publicKey: CryptoKey): Promise<string> {
    if (!publicKey) {
      throw new Error("Objeto da chave pública não fornecido.");
    }

    let publicKeyRawBytes: ArrayBuffer;
    try {
      publicKeyRawBytes = await crypto.subtle.exportKey("pkcs8", publicKey);
    } catch (error) {
      console.error("Erro ao exportar a chave pública:", error);
      throw new Error(
        "Falha na exportação da chave pública para bytes brutos."
      );
    }

    const uint8Array = new Uint8Array(publicKeyRawBytes);
    let publicKeyHexString = "";
    for (let i = 0; i < uint8Array.length; i++) {
      publicKeyHexString += uint8Array[i].toString(16).padStart(2, "0");
    }

    return "0x" + publicKeyHexString;
  }

  useEffect(() => {
    const fetchKeyPair = async () => {
      try {
        const data = await generateUserKeyPair();
        const {
          privateKey,
          publicKey,
          privateKeyPem,
          publicKeyPem,
          publicKeyJWK,
          privateKeyJWK,
        } = data;
        setPrivatePem(privateKeyPem);
        setKeyPEM(publicKeyPem);
        const PublicPemtoObj = await importPublicKeyPem(publicKeyPem);
        const publicKeyForBlockchain = await exportPublicKeyToHex(
          PublicPemtoObj
        );
        const privateKeyTest = await exportPrivateKeyToHex(privateKey);
        console.log(privateKeyTest);
        setPublicKeyDisplay(publicKeyForBlockchain);
        setKeyPair({
          privateKey,
          publicKey,
          privateKeyPem,
          publicKeyPem,
          publicKeyJWK,
          privateKeyJWK,
          publicKeyVer,
        });
      } catch (err) {
        setError("Erro ao gerar o par de chaves.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchKeyPair();
  }, []);

  useEffect(() => {
    console.log("Olha a chave: " + keyPair?.publicKey);
    if (keyPair != undefined) {
      const hashAssinada = async () => {
        try {
          const privKey = await importPrivateKeyPem(keyPair.privateKeyPem);
          const uint8Array = hexToArrayBuffer(dado);
          const data = await signMessageClientSide(
            keyPair.privateKey,
            uint8Array
          );
          const hashAssinada: string = data;

          console.log("Assinatura (Hash Assinada):", hashAssinada);
          setSignature("0x" + hashAssinada);
          setAssinatura(hashAssinada);
          setKey(publicKeyDisplay);
        } catch (error) {
          console.error("Erro ao assinar a mensagem:", error);
        }
      };
      hashAssinada();
    }
  }, [keyPair]);

  function hexToArrayBuffer(hex: string): ArrayBuffer {
    const len = hex.length / 2;
    const array = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      array[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    }
    return array.buffer;
  }

  async function verifySignatureClientSide(
    fileHashHex: string, // Espera a hash em formato string Hexadecimal
    signatureBase64: string,
    publicKey: CryptoKey
  ) {
    try {
      const hashBuffer = hexToArrayBuffer(fileHashHex);
      const signatureBuffer = hexToArrayBuffer(signatureBase64.slice(2));
      if (signatureBuffer == null || hashBuffer == null) {
        throw new Error("assinatura nula");
      }

      const isValid = await window.crypto.subtle.verify(
        {
          name: "RSA-PSS",
          saltLength: 32,
        },
        publicKey,
        signatureBuffer,
        hashBuffer
      );

      console.log(`Resultado Final da Verificação: ${isValid}`);
      return isValid;
    } catch (error) {
      console.error("Erro durante a verificação da assinatura:", error);
      return false;
    }
  }

  const handleVerAss = async () => {
    const KeyBuffer = hexToArrayBuffer(publicKeyVer.slice(2));
    const key = await window.crypto.subtle.importKey(
      "spki",
      KeyBuffer,
      {
        name: "RSA-PSS",
        hash: "SHA-256",
      },
      true, // extractable
      ["verify"] // keyUsages
    );

    const res = await verifySignatureClientSide(dado, signatureVer, key);
    if (res) {
      setBorderColor("green");
      setValor("True");
    } else {
      setBorderColor("red");
      setValor("False");
    }
    console.log(res);
  };

  return (
    <>
      <div className="card text-center shadow-sm p-4 size_component2 card-etapa">
        <div className="etapa-numero">4</div>
        <a
          href="#"
          className="fw-bold mb-2"
          style={{
            fontSize: "1.5rem",
            color: "black",
            textDecoration: "none",
          }}>
          Verificação Assinatura
        </a>
        <input
          className="form-control mb-2 conteudo-topo mt-2"
          placeholder={"Retorno da verificação da hash com chave pública."}
          value={valor}
          readOnly
          style={{ border: `2px solid ${borderColor}`, borderRadius: "4px" }}
        />
        <input
          className="form-control mb-2 conteudo-topo mt-2"
          placeholder={"Aqui você verá a assinatura retornada da verificação."}
          value={signatureVer}
          readOnly
          style={{ border: `2px solid a5a5a5`, borderRadius: "4px" }}
        />
        <button
          onClick={handleVerAss}
          className="btn btn-primary btn-sm w-100 mt-2">
          Verificar
        </button>
      </div>
    </>
  );
}
