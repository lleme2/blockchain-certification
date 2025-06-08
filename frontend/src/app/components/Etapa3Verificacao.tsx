"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import axios, { AxiosResponse } from "axios";

type VerifyResponse = {
  owner?: string;
  exists?: boolean;
  signature: string;
  publicKey: string;
};

type ComponenteBProps = {
  dado: string;
  setSignatureVer: Dispatch<SetStateAction<string>>;
  setpublicKeyVer: Dispatch<SetStateAction<string>>;
};

export default function Etapa3Verificacao({
  dado,
  setSignatureVer,
  setpublicKeyVer,
}: ComponenteBProps) {
  const [valor, setValor] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [borderColor, setBorderColor] = useState("#a5a5a5");
  const [resultado, setResultado] = useState<string>(
    "Coloque aqui a Hash do seu documento."
  );
  const [existe, setExiste] = useState("");
  const [owner, setOwner] = useState<string>("Quem certificou seu documento?");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValor(event.target.value);
  }

  async function verificar(hash: string) {
    try {
      const response: AxiosResponse<VerifyResponse> = await axios.post(
        `http://localhost:8080/verify`,
        { hash: hash, dado: dado }
      );
      setResultado(response.data.owner || "");
      setSignatureVer(response.data.signature);
      setpublicKeyVer(response.data.publicKey);
      if (response.data.exists) {
        setBorderColor("green");
        setExiste("Seu documento já foi certificado!");
      } else {
        setBorderColor("red");
        setExiste("Seu documento ainda não foi certificado ou foi alterado!");
      }
    } catch (error) {
      console.error(error);
      setResultado("Erro ao buscar hash");
    }
  }

  function handleClick() {
    if (valor.trim() !== "") {
      verificar(valor.trim());
    } else {
      setResultado("Digite uma hash para verificar.");
    }
  }

  async function ver2(hash: string) {
    const response: AxiosResponse<VerifyResponse> = await axios.get(
      `http://localhost:8080/verify/${valor.trim()}`
    );
  }

  function handleClick2() {
    //ver2(valor.trim());
    console.log(dado === valor.trim());
  }

  return (
    <div className="card text-center shadow-sm p-4 size_component card-etapa2">
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
        placeholder={resultado}
        className="form-control mb-2 conteudo-topo mt-2"
        onChange={handleChange}
        value={valor}
        style={{ border: `2px solid #a5a5a5`, borderRadius: "4px" }}
      />
      <input
        type="text"
        placeholder="Seu documento já foi verificado?"
        className="form-control mb-2 conteudo-topo mt-2"
        onChange={handleChange}
        value={existe}
        style={{ border: `2px solid ${borderColor}`, borderRadius: "4px" }}
      />
      <input
        type="text"
        placeholder={owner}
        className="form-control mb-2 conteudo-topo mt-2"
        style={{ border: `2px solid #a5a5a5`, borderRadius: "4px" }}
        readOnly
      />
      <button className="btn btn-primary btn-sm w-100" onClick={handleClick}>
        Verificar
      </button>
    </div>
  );
}
