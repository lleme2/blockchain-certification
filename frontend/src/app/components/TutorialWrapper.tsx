"use client";
import Etapa1Upload from "./Etapa1Upload";
import Etapa2Hash from "./Etapa2Hash";
import Etapa5Certificacao from "./Etapa5Certificacao";
import Etapa3Verificacao from "./Etapa3Verificacao";
import { use, useState } from "react";
import Etapa4Assinatura from "./Etapa4Assinatura";
import DownloadPrivateKeyButton from "./DownloadPrivateKeyButton";

export default function TutorialWrapper() {
  const [key, setKey] = useState("");
  const [dado, setDado] = useState("");
  const [signature, setSignature] = useState("");
  const [signatureVer, setSignatureVer] = useState("");
  const [publicKeyVer, setpublicKeyVer] = useState("");
  const [privatePEM, setPrivatePEM] = useState("");
  return (
    <>
      <div className="row gy-2">
        <div className="col-md-6 order-md-1">
          <Etapa1Upload setDado={setDado} />
        </div>
        <div className="col-md-6 order-md-2">
          <Etapa2Hash dado={dado} />
        </div>
        <div className="col-md-6 order-md-3">
          <Etapa4Assinatura
            dado={dado}
            setKey={setKey}
            setSignature={setSignature}
            setPrivatePem={setPrivatePEM}
            signatureVer={signatureVer}
            publicKeyVer={publicKeyVer}
          />
        </div>
        <div className="col-md-6 order-md-4">
          <Etapa3Verificacao
            dado={dado}
            setpublicKeyVer={setpublicKeyVer}
            setSignatureVer={setSignatureVer}
          />
        </div>
      </div>
      <div className="mt-4">
        <Etapa5Certificacao dado={dado} keyPublic={key} signature={signature} />
        <DownloadPrivateKeyButton
          privateKeyPem={privatePEM}
          fileName={"privateKeyPEM"}
        />
      </div>
    </>
  );
}
