"use client";
const axios = require("axios");
import { useState, useEffect } from "react";

type ComponenteBProps = {
  dado: string;
};

export default function Etapa2Hash({ dado }: ComponenteBProps) {
  const hash = dado;
  const handleClick = async () => {
    try {
      const response = await axios.post("http://localhost:8080/certify", {
        hash: hash,
      });
      console.log(response);
    } catch (error) {
      console.log("Hash salva: " + hash);
      console.error("Erro ao enviar:", error);
    }
  };

  const teste = async () => {
    try {
      const response = await axios.get("http://localhost:8080/arquivos");
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="card text-center shadow-sm p-4 card-etapa">
      <div className="etapa-numero">2</div>
      <h5 className="fw-bold mb-3 ">Hash do arquivo</h5>
      <input
        type="text"
        value={dado || "Aqui você verá a Hash do seu documento."}
        className="form-control mb-2 text-center conteudo-topo"
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
