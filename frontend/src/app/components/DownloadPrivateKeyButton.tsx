import React from "react";

interface DownloadPrivateKeyProps {
  publicKeyPem: string; // A chave publica já no formato PEM
  privateKeyPem: string; // A chave privada já no formato PEM
  fileName_private?: string;
  fileName_public?: string;
}

const DownloadPrivateKeyButton: React.FC<DownloadPrivateKeyProps> = ({
  publicKeyPem,
  privateKeyPem,
  fileName_private = "private_key.pem",
  fileName_public = "public_key.pem",
}) => {
  const handleDownload = () => {
    if (privateKeyPem) {
      // Cria um Blob (Binary Large Object) a partir da string PEM
      const blob = new Blob([privateKeyPem], {
        type: "application/x-pem-file",
      });

      // Cria um URL para o Blob
      const url = URL.createObjectURL(blob);

      // Cria um link temporário para iniciar o download
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName_private; // Define o nome do arquivo para download

      // Adiciona o link ao DOM, clica nele e depois remove
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Libera o URL do Blob para liberar memória
      URL.revokeObjectURL(url);

      alert(
        `Sua chave privada foi baixada como "${fileName_private}". Mantenha-a em segurança!`
      );
      return;
    } else {
      alert("A chave privada PEM está vazia. Não é possível fazer o download.");
      return;
    }
  };

  const handleDownloadPublic = () => {
    if (publicKeyPem) {
      const blob = new Blob([publicKeyPem], {
        type: "application/x-pem-file",
      });

      // Cria um URL para o Blob
      const url = URL.createObjectURL(blob);

      // Cria um link temporário para iniciar o download
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName_public; // Define o nome do arquivo para download

      // Adiciona o link ao DOM, clica nele e depois remove
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Libera o URL do Blob para liberar memória
      URL.revokeObjectURL(url);

      alert(
        `Sua chave privada foi baixada como "${fileName_public}". Mantenha-a em segurança!`
      );
    } else {
      alert("A chave publica PEM está vazia. Não é possível fazer o download.");
      return;
    }
  };

  return (
    <>
      <button
        className="size_component2 mt-3"
        onClick={handleDownload}
        disabled={!privateKeyPem} // Desabilita o botão se a chave PEM estiver vazia
        style={{
          padding: "10px 15px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: privateKeyPem ? "pointer" : "not-allowed",
          fontSize: "16px",
        }}>
        Baixar Chave Privada
      </button>
      <button
        className="size_component2 mt-3"
        onClick={handleDownloadPublic}
        disabled={!publicKeyPem} // Desabilita o botão se a chave PEM estiver vazia
        style={{
          padding: "10px 15px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: publicKeyPem ? "pointer" : "not-allowed",
          fontSize: "16px",
        }}>
        Baixar Chave Pública
      </button>
    </>
  );
};

export default DownloadPrivateKeyButton;
