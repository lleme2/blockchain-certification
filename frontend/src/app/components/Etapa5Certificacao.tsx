"use client";
const axios = require("axios");
import { useState, useEffect, useRef } from "react";
import {
  generateUserKeyPair,
  signMessageClientSide,
  verifySignatureClientSide,
  importPrivateKeyPem,
  importPublicKeyPem,
} from "../utils/generateKey";

type ResponseType = {
  data: {
    transactionHash?: string;
  };
};

type ComponenteBProps = {
  dado: string;
  keyPublic: string;
  publickeyImport: string;
  privatekeyImport: string;
  signature: string;
  isLoggedIn: boolean;
};

export default function Etapa5Certificacao({
  dado,
  keyPublic,
  signature,
  isLoggedIn,
  publickeyImport,
  privatekeyImport,
}: ComponenteBProps) {
  const [response_data, setResponse] = useState<ResponseType | null>(null);
  const [hashDocumento, setHashDocumento] = useState<string>();
  const [hashTransacao, setHashTransacao] = useState(
    "Aqui você verá a hash da transação"
  );
  const [borderColor, setBorderColor] = useState("#a5a5a5");

  useEffect(() => {
    if (
      response_data?.data?.transactionHash &&
      response_data.data.transactionHash.trim() !== ""
    ) {
      setBorderColor("green");
      setHashTransacao(
        "Hash da transação: " + response_data.data.transactionHash
      );
    } else if (!publickeyImport || !privatekeyImport) {
      setBorderColor("red");
      setHashTransacao("Realize upload das chaves para certificar!");
    } else {
      setBorderColor("#a5a5a5");
      setHashTransacao("Aqui você verá a hash da transação");
    }
  }, [response_data]);

  useEffect(() => {
    if (dado && dado.trim() !== "") {
      setHashDocumento(dado);
    } else {
      setHashDocumento("");
    }
  }, [dado]);

  const handleClick = async () => {
    if (isLoggedIn) {
      if (keyPublic != "") {
        console.log(keyPublic);
      }
      try {
        const response = await axios.post("http://localhost:8080/certify", {
          hash: hashDocumento,
          signature: signature,
          publicKey: keyPublic,
        });
        console.log(response);
        setResponse(response);
      } catch (error) {
        console.error("Erro ao enviar:", error);
      }
    } else {
      window.alert("Voce precisa estar logado para certificar.");
    }
  };

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

  function hexToArrayBuffer(hex: string): ArrayBuffer {
    const len = hex.length / 2;
    const array = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      array[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    }
    return array.buffer;
  }

  const handleClick2 = async () => {
    if (isLoggedIn) {
      try {
        const privatekeyObj = await importPrivateKeyPem(privatekeyImport);
        const publickeyObj = await importPublicKeyPem(publickeyImport);
        const publicKeyBlockchain = await exportPublicKeyToHex(publickeyObj);
        const uint8Array = hexToArrayBuffer(dado);
        const data = await signMessageClientSide(privatekeyObj, uint8Array);
        const hashAssinada: string = data;
        const response = await axios.post("http://localhost:8080/certify", {
          hash: hashDocumento,
          signature: "0x" + hashAssinada,
          publicKey: publicKeyBlockchain,
        });
        console.log(response);
        setResponse(response);
      } catch (error) {
        console.error("Erro ao enviar:", error);
      }
    } else {
      window.alert("Voce precisa estar logado para certificar.");
    }
  };

  return (
    <div className="card text-center shadow-sm p-4 size_component2 card-etapa">
      <div className="etapa-numero">5</div>
      <a
        href="#"
        className="fw-bold mb-2"
        style={{
          fontSize: "1.5rem",
          color: "black",
          textDecoration: "none",
        }}>
        Certificar documento
      </a>
      <div className="d-flex justify-content-center">
        <img
          src="/imagem_certificacao.png"
          alt="Certificar"
          style={{ height: "80px" }}
        />
      </div>
      <input
        className="form-control mt-2 mb-2 text-center conteudo-topo size_input"
        value={hashTransacao}
        style={{ border: `2px solid ${borderColor}`, borderRadius: "4px" }}
        readOnly
      />
      <div className="d-flex justify-content-around gap-3">
        <button
          className="btn btn-primary btn-sm flex-fill"
          onClick={handleClick2}>
          Certificar documento
        </button>
      </div>
    </div>
  );
}
