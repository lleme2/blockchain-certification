"use client";
const axios = require("axios");
import { useState, useEffect } from "react";

type ComponenteBProps = {
  dado: string;
};

type ResponseType = {
  data: {
    transactionHash?: string;
  };
};

export default function Etapa2Hash({ dado }: ComponenteBProps) {
  const [hashTransacao, setHashTransacao] = useState(
    "Aqui você verá a hash da transação"
  );
  const [hashDocumento, setHashDocumento] = useState(
    "Aqui você verá a Hash do seu documento."
  );
  const [response_data, setResponse] = useState<ResponseType | null>(null);

  // Atualiza hashDocumento quando dado muda
  useEffect(() => {
    if (dado && dado.trim() !== "") {
      setHashDocumento("Hash do documento: " + dado);
      setHashTransacao("Aqui você verá a hash da transação");
    } else {
      setHashDocumento("Aqui você verá a Hash do seu documento.");
    }
  }, [dado]);

  // Atualiza hashTransacao quando response mudar
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
  const hash = dado;
  const handleClick = async () => {
    try {
      const response = await axios.post("http://localhost:8080/certify", {
        hash: hash,
      });
      console.log(response);
      setResponse(response);
    } catch (error) {
      console.log("Hash salva: " + hash);
      console.error("Erro ao enviar:", error);
    }
  };

  const teste = async () => {
    setHashTransacao(
      "0xb1fa2af5f1d6f1ac1c467c8209412c12c816f3f2a2b658ea2ee3bb9b59259c6e"
    );
    console.log(hashTransacao);
  };

  return (
    <div className="card text-center shadow-sm p-4 card-etapa">
      <div className="etapa-numero">2</div>
      <h5 className="fw-bold mb-3 ">Hash do arquivo</h5>
      <input
        className="form-control pt-3 pb-3 text-center conteudo-topo"
        value={hashDocumento}
        readOnly
      />
      <input
        className="form-control pt-3 pb-3 text-center conteudo-topo"
        value={hashTransacao}
        readOnly
      />
      <a href="#" className="small text-primary mb-2 d-block tag-a">
        O que é isso?
      </a>
      <button className="btn btn-primary btn-sm w-100" onClick={handleClick}>
        Certificar
      </button>
    </div>
  );
}
