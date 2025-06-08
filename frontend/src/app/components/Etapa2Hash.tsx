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
    } else {
      setHashDocumento("Aqui você verá a Hash do seu documento.");
    }
  }, [dado]);

  return (
    <div className="card text-center shadow-sm p-4 size_component card-etapa">
      <div className="etapa-numero">2</div>
      <a
        href="#"
        className="fw-bold mb-2"
        style={{
          fontSize: "1.5rem",
          color: "black",
          textDecoration: "none",
        }}>
        Hash do arquivo
      </a>
      <div>
        <img src="/img_hash.png" alt="Certificar" style={{ height: "100px" }} />
      </div>

      <input
        className="form-control  text-center conteudo-topo"
        value={hashDocumento}
        readOnly
      />
    </div>
  );
}
