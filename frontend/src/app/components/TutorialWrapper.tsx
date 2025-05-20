"use client";
import Etapa1Upload from "./Etapa1Upload";
import Etapa2Hash from "./Etapa2Hash";
import Etapa4Certificacao from "./Etapa4Certificacao";
import Etapa3Verificacao from "./Etapa3Verificacao";
import { useState } from "react";

export default function TutorialWrapper() {
  const [dado, setDado] = useState("");
  return (
    <div className="row gy-4">
      <div className="col-md-6 order-md-1">
        <Etapa1Upload setDado={setDado} />
      </div>
      <div className="col-md-6 order-md-2">
        <Etapa2Hash dado={dado} />
      </div>
      <div className="col-md-6 order-md-3">
        <Etapa4Certificacao />
      </div>
      <div className="col-md-6 order-md-4">
        <Etapa3Verificacao />
      </div>
    </div>
  );
}
