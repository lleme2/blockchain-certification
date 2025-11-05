"use client";
import Etapa1Upload from "./Etapa1Upload";
import Etapa2Hash from "./Etapa2Hash";
import Etapa5Certificacao from "./Etapa5Certificacao";
import Etapa3Verificacao from "./Etapa3Verificacao";
import { use, useState } from "react";
import Etapa4Assinatura from "./Etapa4Assinatura";
import UploadKeys from "./UploadKeys";
import DownloadPrivateKeyButton from "./DownloadPrivateKeyButton";

type ComponenteBProps = {
  isLoggedIn: boolean;
};

export default function TutorialWrapper({ isLoggedIn }: ComponenteBProps) {
  const [key, setKey] = useState("");
  const [dado, setDado] = useState("");
  const [signature, setSignature] = useState("");
  const [signatureVer, setSignatureVer] = useState("");
  const [publicKeyVer, setpublicKeyVer] = useState("");
  const [publickeyImport, setpublickeyImport] = useState("");
  const [privatekeyImport, setprivatekeyImport] = useState("");
  const [privatePEM, setPrivatePEM] = useState("");
  const [keyPEM, setkeyPEM] = useState("");
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
            setKeyPEM={setkeyPEM}
            setSignature={setSignature}
            setPrivatePem={setPrivatePEM}
            signatureVer={signatureVer}
            publicKeyVer={publicKeyVer}
            ppublicKeyImport={publickeyImport}
            privateKeyImport={privatekeyImport}
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
        <UploadKeys
          setpublickeyImport={setpublickeyImport}
          setprivatekeyImport={setprivatekeyImport}
        />
      </div>
      <div className="mt-4">
        <Etapa5Certificacao
          dado={dado}
          keyPublic={key}
          signature={signature}
          isLoggedIn={isLoggedIn}
          publickeyImport={publickeyImport}
          privatekeyImport={privatekeyImport}
        />
        <DownloadPrivateKeyButton
          privateKeyPem={privatePEM}
          publicKeyPem={keyPEM}
          fileName_private={"privateKeyPEM"}
          fileName_public={"publicKeyPEM"}
        />
      </div>
    </>
  );
}
