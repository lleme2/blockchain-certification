"use client";
import { useState } from "react";
const axios = require("axios");

export default function Etapa1Upload() {
  const [documento, setDocumento] = useState<File | null>(null);
  const handleSelecionarArquivo = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setDocumento(file);
      console.log("Arquivo selecionado:", file.name);
    }
  };

  async function enviarDocumento(documento: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", documento);

    try {
      const response = await axios.post(
        "http://localhost:8080/gerarHash",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      localStorage.setItem("Hash", response.data.hash);
    } catch (error) {
      console.error("Erro ao enviar:", error);
    }
  }

  const handleEnviar = () => {
    if (!documento) {
      alert("Selecione um documento primeiro.");
      return;
    }
    enviarDocumento(documento);
    console.log("Enviando documento:", documento.name);
  };
  return (
    <div className="card text-center shadow-sm p-4 card-etapa">
      <div className="etapa-numero">1</div>
      <div className="mb-4">
        <h5 className="fw-bold mb-2">Escolha ou crie um documento</h5>
      </div>
      <div className="flex-grow-1 d-flex flex-column justify-content-center">
        <input
          type="file"
          className="form-control mb-3 conteudo-topo-2 input-arquivo"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleSelecionarArquivo}
        />
        {documento && (
          <p className="small text-success mb-2">
            Selecionado: <strong>{documento.name}</strong>
          </p>
        )}
      </div>
      <button className="btn btn-outline-primary btn-sm" onClick={handleEnviar}>
        Enviar documento
      </button>
    </div>
  );
}
