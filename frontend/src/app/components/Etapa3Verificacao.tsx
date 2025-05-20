"use client";
import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";

type VerifyResponse = {
  documentHash?: string;
  // outros campos que vierem na resposta
};

export default function Etapa3Verificacao() {
  const [valor, setValor] = useState("");

  async function handleEnviar(): Promise<void> {
    try {
      const response: AxiosResponse<VerifyResponse> = await axios.get(
        `/verify/${valor}`
      );
      console.log("Resposta:", response.data);
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValor(event.target.value);
    setValor(event.target.value); // pega o valor digitado
  }

  return (
    <div className="card text-center shadow-sm p-4 card-etapa">
      <div className="etapa-numero">3</div>
      <h5 className="fw-bold mb-3">Verificar a autenticidade</h5>
      <input
        type="text"
        placeholder="Hash ou arquivo do documento"
        value={valor}
        className="form-control mb-2 conteudo-topo mb-3"
        onChange={handleChange}
      />
      <button className="btn btn-primary btn-sm w-100" onClick={handleEnviar}>
        Verificar
      </button>
    </div>
  );
}
