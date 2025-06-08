"use client";
const axios = require("axios");
import { useState, useEffect } from "react";

type ResponseType = {
  data: {
    transactionHash?: string;
  };
};

type ComponenteBProps = {
  dado: string;
  keyPublic: string;
  signature: string;
};

export default function Etapa5Certificacao({
  dado,
  keyPublic,
  signature,
}: ComponenteBProps) {
  const [response_data, setResponse] = useState<ResponseType | null>(null);
  const [hashDocumento, setHashDocumento] = useState<string>();
  const [hashTransacao, setHashTransacao] = useState(
    "Aqui você verá a hash da transação"
  );

  useEffect(() => {
    if (
      response_data?.data?.transactionHash &&
      response_data.data.transactionHash.trim() !== ""
    ) {
      setHashTransacao(
        "Hash da transação: " + response_data.data.transactionHash
      );
    } else {
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
  };

  const handleClick2 = async () => {
    try {
      const response = await axios.post("http://localhost:8080/certify", {
        hash: hashDocumento,
      });
      console.log(response);
      setResponse(response);
    } catch (error) {
      console.error("Erro ao enviar:", error);
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
        readOnly
      />
      <div className="d-flex justify-content-around gap-3">
        <button
          className="btn btn-primary btn-sm flex-fill"
          onClick={handleClick2}>
          Certificar com minha chave privada
        </button>
        <button
          className="btn btn-primary btn-sm flex-fill"
          onClick={handleClick}>
          Certificar com chave privada gerada
        </button>
      </div>
    </div>
  );
}
