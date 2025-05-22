"use client";
import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";

type VerifyResponse = {
  owner?: string;
};

export default function Etapa3Verificacao() {
  const [valor, setValor] = useState<string>(""); // valor digitado
  const [resultado, setResultado] = useState<string>(""); // resposta da verificação

  async function verificar(hash: string) {
    try {
      const response: AxiosResponse<VerifyResponse> = await axios.get(
        `http://localhost:8080/verify/${hash}`
      );
      console.log(response);
      setResultado(response.data.owner || "Hash não encontrada");
    } catch (error) {
      console.error(error);
      setResultado("Erro ao buscar hash");
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValor(event.target.value);
  }

  function handleClick() {
    if (valor.trim() !== "") {
      verificar(valor.trim());
    } else {
      setResultado("Digite uma hash para verificar.");
    }
  }

  return (
    <div className="card text-center shadow-sm p-4 card-etapa">
      <div className="etapa-numero">3</div>
      <a
        href="#"
        className="fw-bold mb-2"
        style={{
          fontSize: "1.5rem",
          color: "black",
          textDecoration: "none",
        }}>
        Verificar a autenticidade
      </a>
      <input
        type="text"
        placeholder="Hash ou arquivo do documento"
        className="form-control mb-2 conteudo-topo mt-2"
        onChange={handleChange}
        value={valor}
      />
      {"Owner: " + resultado && (
        <div className="mt-3 alert alert-light border text-break">
          Owner: {resultado}
        </div>
      )}
      <button className="btn btn-primary btn-sm w-100" onClick={handleClick}>
        Verificar
      </button>
    </div>
  );
}
