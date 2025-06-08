"use client";
const axios = require("axios");
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  generateUserKeyPair,
  signMessageClientSide,
} from "../utils/generateKey";

import {
  hexStringToArrayBuffer,
  stringToArrayBuffer,
  importPublicKeyFromPem,
  SignatureAlgorithmParams,
} from "../utils/cryptoHelpers";

type ComponenteBProps = {
  dado: string;
  signatureVer: string;
  publicKeyVer: string;
  setKey: Dispatch<SetStateAction<string>>;
  setSignature: Dispatch<SetStateAction<string>>;
  setPrivatePem: Dispatch<SetStateAction<string>>;
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
}

export default function Etapa4Assinatura({
  dado,
  setKey,
  setSignature,
  setPrivatePem,
  signatureVer,
}: ComponenteBProps) {
  const [keyPair, setKeyPair] = useState<KeyPairData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
      // Use crypto.subtle diretamente, pois está disponível globalmente no navegador
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

  useEffect(() => {
    const fetchKeyPair = async () => {
      try {
        const data = await generateUserKeyPair();
        const { privateKey, publicKey, privateKeyPem, publicKeyPem } = data;
        setPrivatePem(privateKeyPem);
        const publicKeyForBlockchain = await exportPublicKeyToHex(publicKey);
        setPublicKeyDisplay(publicKeyForBlockchain);
        setKeyPair({ privateKey, publicKey, privateKeyPem, publicKeyPem });
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
    console.log("Olha a chave: " + keyPair);
    if (keyPair != undefined) {
      const hashAssinada = async () => {
        try {
          const encoder = new TextEncoder();
          const uint8Array = encoder.encode(dado);
          const data = await signMessageClientSide(
            keyPair.privateKey,
            uint8Array
          );
          const hashAssinada: string = data;
          //console.log("Assinatura (Hash Assinada):", hashAssinada);
          setSignature("0x" + hashAssinada);
          setKey(publicKeyDisplay);
        } catch (error) {
          console.error("Erro ao assinar a mensagem:", error);
        }
      };
      hashAssinada();
    }
  }, [keyPair]);

  return (
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
        type="text"
        placeholder={resultado}
        className="form-control mb-2 conteudo-topo mt-2"
        onChange={handleChange}
        value={valor}
        style={{ border: `2px solid #a5a5a5`, borderRadius: "4px" }}
      />
      <input
        className="form-control mb-2 conteudo-topo mt-2"
        placeholder={"Aqui você verá a assinatura retornada da verificação."}
        value={signatureVer}
        readOnly
        style={{ border: `2px solid ${borderColor}`, borderRadius: "4px" }}
      />
      <button className="btn btn-primary btn-sm w-100 mt-2">Verificar</button>
    </div>
  );
}
