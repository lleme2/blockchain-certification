"use client";
import { useState } from "react";
const axios = require("axios");
import React, { Dispatch, SetStateAction } from "react";

type ComponenteAProps = {
  setprivatekeyImport: Dispatch<SetStateAction<string>>;
  setpublickeyImport: Dispatch<SetStateAction<string>>;
};

let hash;

export default function UploadKeys({
  setprivatekeyImport,
  setpublickeyImport,
}: ComponenteAProps) {
  const [privatePEM, setprivatePEM] = useState<File | null>(null);
  const [publicPEM, setpublicPEM] = useState<File | null>(null);
  const [PublicPemStringTmp, setPublicPemStringTmp] = useState<string>("");
  const [PrivatePemStringTmp, setPrivatePemStringTmp] = useState<string>("");

  const handleSelecionarArquivoPrivate = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setprivatePEM(file);
      try {
        // 1. Chama o método .text() e aguarda (await) a Promise ser resolvida
        const PrivatePemString = await file.text();
        setPrivatePemStringTmp(PrivatePemString);

        // Agora você pode usar a string 'fileContentAsString'
      } catch (error) {
        console.error("Ocorreu um erro ao ler o arquivo:", error);
      }
    }
  };

  const handleSelecionarArquivoPublic = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setpublicPEM(file);
      try {
        // 1. Chama o método .text() e aguarda (await) a Promise ser resolvida
        const PublicPemString = await file.text();

        setPublicPemStringTmp(PublicPemString);
      } catch (error) {
        console.error("Ocorreu um erro ao ler o arquivo:", error);
      }
    }
  };

  const handleEnviarPrivate = () => {
    if (!privatePEM || PrivatePemStringTmp == "") {
      alert("Selecione um documento primeiro.");
      return;
    } else {
      console.log("Conteúdo do arquivo:");
      setprivatekeyImport(PrivatePemStringTmp);
      console.log(PrivatePemStringTmp);
    }
  };

  const handleEnviarPublic = () => {
    if (!publicPEM || PublicPemStringTmp == "") {
      alert("Selecione um documento primeiro.");
      return;
    } else {
      console.log("Conteúdo do arquivo:");
      setpublickeyImport(PublicPemStringTmp);
      console.log(PublicPemStringTmp);
    }
  };

  return (
    <>
      <div className="card text-center shadow-sm p-4 size_component card-etapa">
        <div className="mb-4">
          <a
            href="#"
            className="fw-bold mb-2"
            style={{
              fontSize: "1.5rem",
              color: "black",
              textDecoration: "none",
            }}>
            PEM Private Key
          </a>
        </div>
        <div className="flex-grow-1 d-flex flex-column justify-content-center">
          <input
            type="file"
            className="form-control mb-3 conteudo-topo-2 input-arquivo"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleSelecionarArquivoPrivate}
          />
          {privatePEM && (
            <p className="small text-success mb-2">
              Selecionado: <strong>{privatePEM.name}</strong>
            </p>
          )}
        </div>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={handleEnviarPrivate}>
          Upload Private Key PEM
        </button>
      </div>
      <div className="card text-center shadow-sm p-4 size_component card-etapa mt-4">
        <div className="mb-4">
          <a
            href="#"
            className="fw-bold mb-2"
            style={{
              fontSize: "1.5rem",
              color: "black",
              textDecoration: "none",
            }}>
            PEM Public Key
          </a>
        </div>
        <div className="flex-grow-1 d-flex flex-column justify-content-center">
          <input
            type="file"
            className="form-control mb-3 conteudo-topo-2 input-arquivo"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleSelecionarArquivoPublic}
          />
          {publicPEM && (
            <p className="small text-success mb-2">
              Selecionado: <strong>{publicPEM.name}</strong>
            </p>
          )}
        </div>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={handleEnviarPublic}>
          Upload Private Key PEM
        </button>
      </div>
    </>
  );
}
